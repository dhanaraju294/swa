-- ===========================================================================
-- FIX: onboarding_profiles.email stays NULL while every other field saves.
--
-- CAUSE: the live database is still running an OLD version of
-- public.save_onboarding(uuid, jsonb) that was created before email existed.
-- That old function simply never reads p_profile->>'email', so the value the
-- app sends is silently discarded while all the other keys are stored. The
-- app payload is correct (see apps/mobile/src/onboarding/types.ts →
-- toRpcProfile, covered by __tests__/onboarding.test.ts).
--
-- This script is idempotent and safe to re-run. Paste it whole into the
-- Supabase SQL editor (Dashboard → SQL Editor → New query → Run).
-- ===========================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1) Make sure the column and its guards exist.
-- ---------------------------------------------------------------------------
alter table public.onboarding_profiles
  add column if not exists email text;

alter table public.onboarding_profiles
  drop constraint if exists onboarding_profiles_email_format;

alter table public.onboarding_profiles
  add constraint onboarding_profiles_email_format check (
    email is null
    or email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]{2,}$'
  );

create index if not exists onboarding_profiles_email_idx
  on public.onboarding_profiles (email);

comment on column public.onboarding_profiles.email is
  'User email collected on the About You onboarding screen (stored lowercase).';

-- ---------------------------------------------------------------------------
-- 2) Drop EVERY overload of save_onboarding.
--
-- This is the step a plain "create or replace" misses. If an older function
-- exists with a different signature (e.g. (uuid, json) instead of
-- (uuid, jsonb)), PostgREST may keep resolving the call to that stale
-- overload, so the email is dropped no matter how many times you re-run the
-- newer definition.
-- ---------------------------------------------------------------------------
do $$
declare
  fn record;
begin
  for fn in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'save_onboarding'
  loop
    execute format('drop function if exists %s cascade', fn.sig);
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3) Recreate the one true version, which DOES persist email.
-- ---------------------------------------------------------------------------
create function public.save_onboarding(
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

  -- Normalise: trim + lowercase, treat '', 'null' and whitespace as absent.
  v_email := nullif(lower(trim(coalesce(p_profile->>'email', ''))), '');
  if v_email = 'null' then
    v_email := null;
  end if;

  -- Never let a malformed address abort the whole upsert: the rest of the
  -- questionnaire is still worth saving.
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

commit;

-- ---------------------------------------------------------------------------
-- 4) Reload the PostgREST schema cache so the API picks up the new function
--    immediately instead of after the next redeploy.
-- ---------------------------------------------------------------------------
notify pgrst, 'reload schema';

-- ---------------------------------------------------------------------------
-- 5) SELF-TEST — proves the fix works. Raises an exception if email is still
--    dropped, and cleans up the temporary row either way.
-- ---------------------------------------------------------------------------
do $$
declare
  v_test_device constant uuid := '00000000-0000-4000-8000-0000000000ff';
  v_stored text;
begin
  perform public.save_onboarding(
    v_test_device,
    jsonb_build_object(
      'email', '  SelfTest@Example.COM ',
      'role', 'college_student',
      'onboarding_step', 1
    )
  );

  select email into v_stored
  from public.onboarding_profiles
  where device_id = v_test_device;

  delete from public.onboarding_profiles where device_id = v_test_device;

  if v_stored is distinct from 'selftest@example.com' then
    raise exception
      'save_onboarding SELF-TEST FAILED: expected selftest@example.com, got %',
      coalesce(v_stored, 'NULL');
  end if;

  raise notice 'save_onboarding SELF-TEST PASSED — email is stored correctly.';
end;
$$;
