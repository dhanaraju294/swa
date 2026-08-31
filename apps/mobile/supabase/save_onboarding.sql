-- Run this in the Supabase SQL editor for project jsumpnqarpjwjtjephgk.
-- The mobile app calls save_onboarding(uuid, jsonb) with the anon key only.
-- Never grant table access to anon; never put the service_role key in the app.

create table if not exists public.onboarding_profiles (
  device_id uuid primary key,
  role text,
  year_of_study text,
  field_of_study text,
  goals text[] not null default '{}',
  challenges text[] not null default '{}',
  experience_length text,
  reflect_frequency text,
  morning_checkin_time text,
  evening_checkin_time text,
  onboarding_step integer,
  completed boolean not null default false,
  profile jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.onboarding_profiles enable row level security;

revoke all on table public.onboarding_profiles from anon, authenticated, public;

create or replace function public.save_onboarding(p_device_id uuid, p_profile jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  next_goals text[];
  next_challenges text[];
begin
  if p_device_id is null then
    raise exception 'device_id required';
  end if;

  if jsonb_typeof(coalesce(p_profile->'goals', '[]'::jsonb)) = 'array'
     and jsonb_array_length(coalesce(p_profile->'goals', '[]'::jsonb)) > 0 then
    next_goals := array(select jsonb_array_elements_text(p_profile->'goals'));
  else
    next_goals := null;
  end if;

  if jsonb_typeof(coalesce(p_profile->'challenges', '[]'::jsonb)) = 'array'
     and jsonb_array_length(coalesce(p_profile->'challenges', '[]'::jsonb)) > 0 then
    next_challenges := array(select jsonb_array_elements_text(p_profile->'challenges'));
  else
    next_challenges := null;
  end if;

  insert into public.onboarding_profiles as t (
    device_id,
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
    completed,
    profile,
    updated_at
  ) values (
    p_device_id,
    p_profile->>'role',
    p_profile->>'year_of_study',
    p_profile->>'field_of_study',
    coalesce(next_goals, '{}'),
    coalesce(next_challenges, '{}'),
    p_profile->>'experience_length',
    p_profile->>'reflect_frequency',
    p_profile->>'morning_checkin_time',
    p_profile->>'evening_checkin_time',
    nullif(p_profile->>'onboarding_step', '')::integer,
    coalesce((p_profile->>'completed')::boolean, false),
    p_profile,
    now()
  )
  on conflict (device_id) do update set
    role = coalesce(excluded.role, t.role),
    year_of_study = coalesce(excluded.year_of_study, t.year_of_study),
    field_of_study = coalesce(excluded.field_of_study, t.field_of_study),
    goals = coalesce(next_goals, t.goals),
    challenges = coalesce(next_challenges, t.challenges),
    experience_length = coalesce(excluded.experience_length, t.experience_length),
    reflect_frequency = coalesce(excluded.reflect_frequency, t.reflect_frequency),
    morning_checkin_time = coalesce(excluded.morning_checkin_time, t.morning_checkin_time),
    evening_checkin_time = coalesce(excluded.evening_checkin_time, t.evening_checkin_time),
    onboarding_step = coalesce(excluded.onboarding_step, t.onboarding_step),
    completed = t.completed or excluded.completed,
    profile = t.profile || excluded.profile,
    updated_at = now();
end;
$$;

revoke all on function public.save_onboarding(uuid, jsonb) from public;
grant execute on function public.save_onboarding(uuid, jsonb) to anon, authenticated;
