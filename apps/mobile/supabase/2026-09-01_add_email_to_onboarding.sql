-- Migration: add email collection to onboarding.
-- Run this ONCE in the Supabase SQL editor on the existing database
-- (the one already created from the original onboarding dump).

-- 1) Add the column + format guard + index
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

-- 2) Replace the RPC so the app can write the email
create or replace function public.save_onboarding(
  p_device_id uuid,
  p_profile jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_device_id is null then
    raise exception 'device_id required';
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
    nullif(lower(trim(p_profile->>'email')), ''),
    nullif(p_profile->>'role', ''),
    nullif(p_profile->>'year_of_study', ''),
    nullif(p_profile->>'field_of_study', ''),
    coalesce(
      array(select jsonb_array_elements_text(p_profile->'goals')),
      '{}'
    ),
    coalesce(
      array(select jsonb_array_elements_text(p_profile->'challenges')),
      '{}'
    ),
    nullif(p_profile->>'experience_length', ''),
    nullif(p_profile->>'reflect_frequency', ''),
    nullif(p_profile->>'morning_checkin_time', '')::time,
    nullif(p_profile->>'evening_checkin_time', '')::time,
    coalesce((p_profile->>'onboarding_step')::smallint, 1),
    case
      when (p_profile->>'completed')::boolean is true then now()
      else null
    end
  )
  on conflict (device_id) do update set
    display_name = coalesce(excluded.display_name, t.display_name),
    email = coalesce(excluded.email, t.email),
    role = coalesce(excluded.role, t.role),
    year_of_study = coalesce(excluded.year_of_study, t.year_of_study),
    field_of_study = coalesce(excluded.field_of_study, t.field_of_study),
    goals = case when excluded.goals = '{}' then t.goals else excluded.goals end,
    challenges = case when excluded.challenges = '{}' then t.challenges else excluded.challenges end,
    experience_length = coalesce(excluded.experience_length, t.experience_length),
    reflect_frequency = coalesce(excluded.reflect_frequency, t.reflect_frequency),
    morning_checkin_time = coalesce(excluded.morning_checkin_time, t.morning_checkin_time),
    evening_checkin_time = coalesce(excluded.evening_checkin_time, t.evening_checkin_time),
    onboarding_step = greatest(t.onboarding_step, excluded.onboarding_step),
    completed_at = coalesce(t.completed_at, excluded.completed_at);
end;
$$;

-- create or replace keeps existing grants, but re-assert them for safety
revoke all on function public.save_onboarding(uuid, jsonb) from public;
grant execute on function public.save_onboarding(uuid, jsonb) to anon;
