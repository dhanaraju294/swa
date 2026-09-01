-- ===========================================================================
-- SWA — fix: onboarding email arrives from the app but stays NULL in the table
--
-- HOW TO RUN
--   Supabase Dashboard → SQL Editor → New query → paste ALL of this → Run.
--   Idempotent: safe to run more than once.
--   The last statement returns a PASS/FAIL table. Read it.
--
-- WHAT IT DOES
--   1. shows whether the CURRENT function stores email   (diagnosis, before)
--   2. makes sure the email column + guards exist
--   3. replaces save_onboarding() with a version that stores email
--   4. reloads the PostgREST schema cache
--   5. round-trips a real email through the RPC and reports PASS/FAIL
--
-- Verified against your project first: the anon key can execute
-- save_onboarding(p_device_id, p_profile), and PostgREST reports exactly ONE
-- overload — so a plain replace is enough (no overload juggling needed).
-- ===========================================================================


-- ---------------------------------------------------------------------------
-- 1) BEFORE: does the function that's live right now even mention email?
--    'IGNORES email' here is the bug — the column can exist while the function
--    writing to it predates the column and never reads p_profile->>'email'.
-- ---------------------------------------------------------------------------
select
  'BEFORE' as when_checked,
  p.oid::regprocedure as function_signature,
  case
    when pg_get_functiondef(p.oid) ilike '%email%' then 'references email'
    else 'IGNORES email  <-- this is the bug'
  end as verdict
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'save_onboarding';


-- ---------------------------------------------------------------------------
-- 2) Column + guards (no-ops if they already exist).
--    NOT VALID: apply the format check to new writes without rescanning or
--    failing on any pre-existing rows.
-- ---------------------------------------------------------------------------
alter table public.onboarding_profiles
  add column if not exists email text;

alter table public.onboarding_profiles
  drop constraint if exists onboarding_profiles_email_format;

alter table public.onboarding_profiles
  add constraint onboarding_profiles_email_format check (
    email is null
    or email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'
  ) not valid;

create index if not exists onboarding_profiles_email_idx
  on public.onboarding_profiles (email);

comment on column public.onboarding_profiles.email is
  'User email collected on the About You onboarding screen (stored lowercase).';


-- ---------------------------------------------------------------------------
-- 3) The actual fix: this version writes email.
-- ---------------------------------------------------------------------------
create or replace function public.save_onboarding(
  p_device_id uuid,
  p_profile jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
begin
  if p_device_id is null then
    raise exception 'device_id required';
  end if;

  -- trim + lowercase; treat '', whitespace and the string 'null' as absent
  v_email := nullif(lower(trim(coalesce(p_profile->>'email', ''))), '');
  if v_email = 'null' then
    v_email := null;
  end if;

  -- a malformed address must not abort the whole upsert — the rest of the
  -- questionnaire is still worth keeping
  if v_email is not null
     and v_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$' then
    raise warning 'save_onboarding: ignoring malformed email %', v_email;
    v_email := null;
  end if;

  insert into public.onboarding_profiles as t (
    device_id,
    display_name,
    email,
    role,
    year_of_study,
    field_of_study,
    goals,
    challenges,
    experience_length,
    reflect_frequency,
    morning_checkin_time,
    evening_checkin_time,
    onboarding_step,
    completed_at
  )
  values (
    p_device_id,
    nullif(p_profile->>'display_name', ''),
    v_email,
    nullif(p_profile->>'role', ''),
    nullif(p_profile->>'year_of_study', ''),
    nullif(p_profile->>'field_of_study', ''),
    coalesce(array(select jsonb_array_elements_text(p_profile->'goals')), '{}'),
    coalesce(array(select jsonb_array_elements_text(p_profile->'challenges')), '{}'),
    nullif(p_profile->>'experience_length', ''),
    nullif(p_profile->>'reflect_frequency', ''),
    nullif(p_profile->>'morning_checkin_time', '')::time,
    nullif(p_profile->>'evening_checkin_time', '')::time,
    coalesce((p_profile->>'onboarding_step')::smallint, 1),
    case when (p_profile->>'completed')::boolean is true then now() else null end
  )
  on conflict (device_id) do update set
    display_name         = coalesce(excluded.display_name, t.display_name),
    email                = coalesce(excluded.email, t.email),
    role                 = coalesce(excluded.role, t.role),
    year_of_study        = coalesce(excluded.year_of_study, t.year_of_study),
    field_of_study       = coalesce(excluded.field_of_study, t.field_of_study),
    goals                = case when excluded.goals = '{}' then t.goals else excluded.goals end,
    challenges           = case when excluded.challenges = '{}' then t.challenges else excluded.challenges end,
    experience_length    = coalesce(excluded.experience_length, t.experience_length),
    reflect_frequency    = coalesce(excluded.reflect_frequency, t.reflect_frequency),
    morning_checkin_time = coalesce(excluded.morning_checkin_time, t.morning_checkin_time),
    evening_checkin_time = coalesce(excluded.evening_checkin_time, t.evening_checkin_time),
    onboarding_step      = greatest(t.onboarding_step, excluded.onboarding_step),
    completed_at         = coalesce(t.completed_at, excluded.completed_at);
end;
$$;

revoke all on function public.save_onboarding(uuid, jsonb) from public;
grant execute on function public.save_onboarding(uuid, jsonb) to anon;


-- ---------------------------------------------------------------------------
-- 4) Make the API use it immediately instead of after the next redeploy.
-- ---------------------------------------------------------------------------
notify pgrst, 'reload schema';


-- ---------------------------------------------------------------------------
-- 5) AFTER: push a real email through the RPC, read it back, delete the probe.
-- ---------------------------------------------------------------------------
create temp table if not exists _swa_result (check_name text, result text);
delete from _swa_result;

do $$
declare
  v_dev  constant uuid := '00000000-0000-4000-8000-0000000000fe';
  v_got  text;
begin
  perform public.save_onboarding(
    v_dev,
    jsonb_build_object(
      'email', '  ProbE@Example.COM ',   -- messy on purpose
      'role', 'college_student',
      'onboarding_step', 1
    )
  );

  select email into v_got
  from public.onboarding_profiles
  where device_id = v_dev;

  delete from public.onboarding_profiles where device_id = v_dev;

  insert into _swa_result values (
    'email round-trip through save_onboarding()',
    case
      when v_got = 'probe@example.com'
        then 'PASS - email is stored (trimmed + lowercased). Fixed.'
      else 'FAIL - got ' || coalesce(v_got, 'NULL') || '. Send me this output.'
    end
  );
end;
$$;

select * from _swa_result;
