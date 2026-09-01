-- ===========================================================================
-- 10-second diagnosis: is the LIVE save_onboarding() actually storing email?
-- Run in Supabase → SQL Editor. Read-only except for one row it deletes itself.
-- ===========================================================================

-- (1) THE DECIDING QUESTION: does the live function body even mention email?
--     'MISSING' here is the bug. The column can exist while the function that
--     writes to it is an older build that never reads p_profile->>'email'.
select
  p.oid::regprocedure                            as signature,
  case when pg_get_functiondef(p.oid) ilike '%email%'
       then 'OK - function references email'
       else 'MISSING - function ignores email  <-- THIS IS THE BUG'
  end                                            as verdict
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname = 'save_onboarding';
-- More than one row returned = stale overloads; PostgREST may call the wrong one.

-- (2) Column present? (You already confirmed this — included for completeness.)
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'onboarding_profiles'
  and column_name = 'email';

-- (3) Live proof: push an email through the real RPC and read it back.
do $$
declare
  v_dev constant uuid := '00000000-0000-4000-8000-0000000000fe';
  v_got text;
begin
  perform public.save_onboarding(
    v_dev,
    jsonb_build_object('email','ProbE@Example.COM','role','college_student','onboarding_step',1)
  );
  select email into v_got from public.onboarding_profiles where device_id = v_dev;
  delete from public.onboarding_profiles where device_id = v_dev;

  if v_got is distinct from 'probe@example.com' then
    raise notice 'RESULT: email came back as %  -> the RPC is dropping it. Run 2026-09-01_fix_email_null.sql', coalesce(v_got,'NULL');
  else
    raise notice 'RESULT: email stored correctly (%). The RPC is fine - look at the client/device instead.', v_got;
  end if;
end;
$$;

-- (4) What is actually in the table right now?
select device_id, email, role, onboarding_step, created_at
from public.onboarding_profiles
order by created_at desc
limit 10;
