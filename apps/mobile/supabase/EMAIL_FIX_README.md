# Fix: onboarding email saved as NULL in Supabase

## Symptom

A user types their email on the "About you" screen. Every other field
(`role`, `year_of_study`, `field_of_study`, `goals`, `challenges`, times…)
lands in `public.onboarding_profiles`, but `email` stays `NULL`.

## Root cause — the database, not the app

`public.save_onboarding(uuid, jsonb)` is a `security definer` function that
performs an explicit column-list `INSERT`. The version currently live in your
project was created **before** the email column existed, so it never reads
`p_profile->>'email'`.

The app sends the email; the function throws it away. That's exactly why *only*
this one field is NULL while everything else works — a network or client bug
would drop the whole row, not a single key.

The client side was verified correct:

- `apps/mobile/src/screens/onboarding/OnboardingScreen.tsx` writes it via
  `patch({ email: t })`
- `toRpcProfile()` emits `email: 'student@example.com'` (trimmed + lowercased)
- `pushRecordToSupabase()` sends that object as `p_profile`
- Covered by `__tests__/onboarding.test.ts` — **passing**

A migration adding email already existed
(`2026-09-01_add_email_to_onboarding.sql`) but was evidently never run against
the live database.

## The fix — run this once

Supabase Dashboard → **SQL Editor** → **New query** → paste all of
[`2026-09-01_fix_email_null.sql`](./2026-09-01_fix_email_null.sql) → **Run**.

Expected output:

```
NOTICE:  save_onboarding SELF-TEST PASSED — email is stored correctly.
```

If it raises `SELF-TEST FAILED`, the email is still being dropped — do not
ignore it; the script rolls its test row back either way.

### Why not just re-run the older migration?

It used `create or replace function`, which only replaces a function with an
**identical signature**. If an older overload exists (e.g. `(uuid, json)` rather
than `(uuid, jsonb)`), PostgREST can keep resolving calls to the stale one and
the email keeps vanishing. The new script drops *every* `save_onboarding`
overload first, then recreates exactly one.

It also:

- normalises the email (trim + lowercase, `''`/`'null'` → `NULL`)
- downgrades a malformed address to a warning instead of aborting the whole
  upsert, so the rest of the questionnaire still saves
- runs `notify pgrst, 'reload schema'` so the API picks it up immediately
- self-tests and cleans up after itself; safe to re-run

## App-side companion fix

Devices that completed onboarding *before* the SQL fix were marked
`syncedAt`/`pendingSync: false`, so `flushPendingOnboarding()` skipped them and
their email would never be sent again — the DB fix alone would only help new
users.

`src/onboarding/sync.ts` now re-pushes such records **exactly once**
(`EMAIL_BACKFILL_KEY`) to backfill the missing email, retrying if the device is
offline and never looping. Emails are also normalised at capture time in
`OnboardingScreen.tsx` so keyboard autocomplete can't slip a trailing space past
the server's format check.

Regression tests: `__tests__/onboardingEmailSync.test.ts` (full suite: 48 passing).

## Verify end to end

```sql
select device_id, email, role, onboarding_step, created_at
from public.onboarding_profiles
order by created_at desc
limit 5;
```

Complete onboarding on a device with a fresh email and confirm it appears.
