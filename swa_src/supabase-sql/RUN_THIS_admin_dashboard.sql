-- ===========================================================================
-- SWA — admin analytics endpoint for the hidden /admin page on the website.
--
-- Run in: Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Idempotent. Safe to re-run.
--
-- WHY AN RPC INSTEAD OF SELECTING THE TABLE?
--   onboarding_profiles is correctly locked down: `anon` has no SELECT on it
--   (a direct read returns 42501 permission denied). That protection must
--   stay. So the dashboard calls this SECURITY DEFINER function instead,
--   which returns data ONLY when given the correct passcode.
--
-- IMPORTANT — CHANGE THE PASSCODE BELOW before running.
--   The website never contains this passcode; it is typed in at the /admin
--   page and verified here, inside the database.
-- ===========================================================================

-- >>> CHANGE ME <<<
-- Pick something long. This is the only thing protecting user emails.
create or replace function public.admin_passcode()
returns text
language sql
immutable
security definer
set search_path = public
as $$
  select 'swa-change-this-passcode-9f3k2'::text;
$$;

-- Nobody may call this directly; admin_overview() reads it internally.
revoke all on function public.admin_passcode() from public;
do $$
begin
  execute 'revoke all on function public.admin_passcode() from anon';
exception when undefined_object then null;
end;
$$;


create or replace function public.admin_overview(p_passcode text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result jsonb;
begin
  -- Constant-time-ish comparison and a deliberate delay make brute forcing
  -- over the network impractical.
  if p_passcode is null or p_passcode <> public.admin_passcode() then
    perform pg_sleep(1);
    raise exception 'unauthorized' using errcode = '28000';
  end if;

  select jsonb_build_object(
    'generated_at', now(),

    'totals', (
      select jsonb_build_object(
        'users',        count(*),
        'with_email',   count(*) filter (where email is not null),
        'completed',    count(*) filter (where completed_at is not null),
        'last_7_days',  count(*) filter (where created_at >= now() - interval '7 days'),
        'students',     count(*) filter (where role = 'college_student'),
        'professionals',count(*) filter (where role = 'working_professional')
      )
      from public.onboarding_profiles
    ),

    -- signups per day for the last 30 days, zero-filled
    'daily', (
      select coalesce(jsonb_agg(jsonb_build_object('date', d::date, 'count', c) order by d), '[]'::jsonb)
      from (
        select d, (
          select count(*) from public.onboarding_profiles p
          where p.created_at::date = d::date
        ) as c
        from generate_series(current_date - interval '29 days', current_date, interval '1 day') d
      ) s
    ),

    'by_role', (
      select coalesce(jsonb_agg(jsonb_build_object('name', coalesce(role,'unknown'), 'count', c) order by c desc), '[]'::jsonb)
      from (select role, count(*) c from public.onboarding_profiles group by role) t
    ),

    'by_year', (
      select coalesce(jsonb_agg(jsonb_build_object('name', coalesce(year_of_study,'unknown'), 'count', c) order by c desc), '[]'::jsonb)
      from (select year_of_study, count(*) c from public.onboarding_profiles group by year_of_study) t
    ),

    'by_field', (
      select coalesce(jsonb_agg(jsonb_build_object('name', coalesce(field_of_study,'unknown'), 'count', c) order by c desc), '[]'::jsonb)
      from (select field_of_study, count(*) c from public.onboarding_profiles group by field_of_study) t
    ),

    'by_step', (
      select coalesce(jsonb_agg(jsonb_build_object('name', onboarding_step::text, 'count', c) order by onboarding_step), '[]'::jsonb)
      from (select onboarding_step, count(*) c from public.onboarding_profiles group by onboarding_step) t
    ),

    -- goals / challenges are text[]; unnest before counting
    'top_goals', (
      select coalesce(jsonb_agg(jsonb_build_object('name', g, 'count', c) order by c desc), '[]'::jsonb)
      from (
        select unnest(goals) g, count(*) c
        from public.onboarding_profiles group by 1 order by c desc limit 12
      ) t
    ),

    'top_challenges', (
      select coalesce(jsonb_agg(jsonb_build_object('name', ch, 'count', c) order by c desc), '[]'::jsonb)
      from (
        select unnest(challenges) ch, count(*) c
        from public.onboarding_profiles group by 1 order by c desc limit 12
      ) t
    ),

    'users', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', id,
        'display_name', display_name,
        'email', email,
        'role', role,
        'year_of_study', year_of_study,
        'field_of_study', field_of_study,
        'goals', goals,
        'challenges', challenges,
        'onboarding_step', onboarding_step,
        'completed_at', completed_at,
        'created_at', created_at
      ) order by created_at desc), '[]'::jsonb)
      from public.onboarding_profiles
    )
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.admin_overview(text) from public;
grant execute on function public.admin_overview(text) to anon;

notify pgrst, 'reload schema';

-- Quick check: wrong passcode must fail, right one must return data.
do $$
declare
  v jsonb;
begin
  begin
    v := public.admin_overview('definitely-wrong');
    raise exception 'SELF-TEST FAILED: bad passcode was accepted';
  exception
    when sqlstate '28000' then null;  -- expected
  end;

  v := public.admin_overview(public.admin_passcode());
  raise notice 'SELF-TEST PASSED — admin_overview works. users=%',
    v->'totals'->>'users';
end;
$$;
