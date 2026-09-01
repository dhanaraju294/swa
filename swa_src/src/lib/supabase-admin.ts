/**
 * Supabase access for the hidden /admin dashboard.
 *
 * These values are the PUBLIC anon key and project URL — the same pair that
 * ships inside the mobile app. They are safe to hardcode in a client bundle:
 * `onboarding_profiles` has RLS enabled and grants `anon` no SELECT at all, so
 * this key on its own cannot read a single user row.
 *
 * The dashboard therefore goes through the `admin_overview(p_passcode)` RPC,
 * which is SECURITY DEFINER and returns data only when the passcode entered on
 * the /admin screen matches the one stored in the database. The passcode is
 * NEVER stored in this bundle.
 */

export const SUPABASE_URL = 'https://jsumpnqarpjwjtjephgk.supabase.co';

export const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzdW1wbnFhcnBqd2p0amVwaGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxOTAzOTYsImV4cCI6MjEwMzc2NjM5Nn0.Avr-DnyFoB9kQZnTnfma_19qF6pGvpUNIhYRDV57sU4';

export type AdminUser = {
  id: string;
  display_name: string | null;
  email: string | null;
  role: string | null;
  year_of_study: string | null;
  field_of_study: string | null;
  goals: string[] | null;
  challenges: string[] | null;
  onboarding_step: number | null;
  completed_at: string | null;
  created_at: string;
};

export type NameCount = { name: string; count: number };

export type AdminOverview = {
  generated_at: string;
  totals: {
    users: number;
    with_email: number;
    completed: number;
    last_7_days: number;
    students: number;
    professionals: number;
  };
  daily: Array<{ date: string; count: number }>;
  by_role: NameCount[];
  by_year: NameCount[];
  by_field: NameCount[];
  by_step: NameCount[];
  top_goals: NameCount[];
  top_challenges: NameCount[];
  users: AdminUser[];
};

export class AdminAuthError extends Error {}

/** Calls the gated RPC. Throws AdminAuthError on a bad passcode. */
export async function fetchAdminOverview(passcode: string): Promise<AdminOverview> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/admin_overview`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Content-Profile': 'public',
    },
    body: JSON.stringify({ p_passcode: passcode }),
  });

  if (!res.ok) {
    let detail = '';
    try {
      const body = (await res.json()) as { message?: string; code?: string };
      detail = body?.message ?? '';
      // 28000 is what admin_overview raises for a wrong passcode.
      if (body?.code === '28000' || /unauthorized/i.test(detail)) {
        throw new AdminAuthError('Incorrect passcode.');
      }
      if (/could not find the function/i.test(detail)) {
        throw new Error(
          'admin_overview() is missing. Run RUN_THIS_admin_dashboard.sql in the Supabase SQL editor.',
        );
      }
    } catch (e) {
      if (e instanceof AdminAuthError || e instanceof Error) throw e;
    }
    throw new Error(detail || `Request failed (${res.status})`);
  }

  return (await res.json()) as AdminOverview;
}

/** 'college_student' -> 'College student' */
export function humanize(value: string | null | undefined): string {
  if (!value) return 'Unknown';
  return value.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}
