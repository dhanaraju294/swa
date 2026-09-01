/**
 * Hidden analytics dashboard — reachable only by typing /admin in the address
 * bar. Nothing on the public site links here, and RootLayout's header/footer
 * are deliberately bypassed (see routes.tsx) so the page has no site chrome.
 *
 * The passcode is verified inside the database by admin_overview(); it is not
 * present anywhere in this bundle. It is kept in sessionStorage so a refresh
 * doesn't log you out, and cleared on "Lock".
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';

import {
  AdminAuthError,
  fetchAdminOverview,
  humanize,
  type AdminOverview,
} from '@/lib/supabase-admin';
import { BarChart, DonutChart, LineChart } from '@/components/admin/Charts';

const PASS_KEY = 'swa-admin-pass';

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const load = useCallback(async (code: string) => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchAdminOverview(code);
      setData(result);
      setAuthed(true);
      sessionStorage.setItem(PASS_KEY, code);
    } catch (e) {
      if (e instanceof AdminAuthError) {
        setError('Incorrect passcode.');
        sessionStorage.removeItem(PASS_KEY);
        setAuthed(false);
      } else {
        setError(e instanceof Error ? e.message : 'Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Resume an existing session on refresh.
  useEffect(() => {
    const saved = sessionStorage.getItem(PASS_KEY);
    if (saved) void load(saved);
  }, [load]);

  const users = data?.users ?? [];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.email, u.display_name, u.role, u.field_of_study]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [users, query]);

  const exportCsv = () => {
    const head = ['name', 'email', 'role', 'year', 'field', 'step', 'completed', 'created'];
    const rows = filtered.map((u) => [
      u.display_name ?? '',
      u.email ?? '',
      u.role ?? '',
      u.year_of_study ?? '',
      u.field_of_study ?? '',
      String(u.onboarding_step ?? ''),
      u.completed_at ? 'yes' : 'no',
      u.created_at,
    ]);
    const csv = [head, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `swa-users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------------------------------------------------------------- lock screen
  if (!authed) {
    return (
      <>
        <Meta />
        <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void load(passcode);
            }}
            className="w-full max-w-sm rounded-xl border border-stone-200 bg-white p-8 shadow-sm"
          >
            <h1 className="text-lg font-semibold text-stone-900">SWA Admin</h1>
            <p className="mt-1 text-sm text-stone-500">Enter the passcode to continue.</p>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Passcode"
              autoFocus
              className="mt-5 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500"
            />
            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading || !passcode}
              className="mt-4 w-full rounded-md bg-stone-900 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              {loading ? 'Checking…' : 'Unlock'}
            </button>
          </form>
        </div>
      </>
    );
  }

  // ---------------------------------------------------------------- dashboard
  const t = data?.totals;

  return (
    <>
      <Meta />
      <div className="min-h-screen bg-stone-50 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-stone-900">SWA Analytics</h1>
              <p className="text-xs text-stone-500">
                {data ? `Updated ${new Date(data.generated_at).toLocaleString()}` : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => void load(sessionStorage.getItem(PASS_KEY) ?? '')}
                className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700"
              >
                {loading ? 'Refreshing…' : 'Refresh'}
              </button>
              <button
                onClick={exportCsv}
                className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700"
              >
                Export CSV
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem(PASS_KEY);
                  setAuthed(false);
                  setData(null);
                  setPasscode('');
                }}
                className="rounded-md bg-stone-900 px-3 py-1.5 text-xs font-medium text-white"
              >
                Lock
              </button>
            </div>
          </header>

          {error && (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </p>
          )}

          <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-6">
            <Stat label="Total users" value={t?.users ?? 0} />
            <Stat label="With email" value={t?.with_email ?? 0} />
            <Stat label="Completed" value={t?.completed ?? 0} />
            <Stat label="Last 7 days" value={t?.last_7_days ?? 0} />
            <Stat label="Students" value={t?.students ?? 0} />
            <Stat label="Professionals" value={t?.professionals ?? 0} />
          </section>

          <Card title="Signups — last 30 days" className="mb-6">
            <LineChart data={data?.daily ?? []} />
          </Card>

          <div className="mb-6 grid gap-4 lg:grid-cols-2">
            <Card title="By role">
              <DonutChart data={(data?.by_role ?? []).map((d) => ({ ...d, name: humanize(d.name) }))} />
            </Card>
            <Card title="By year of study">
              <BarChart data={(data?.by_year ?? []).map((d) => ({ ...d, name: humanize(d.name) }))} />
            </Card>
            <Card title="Top goals">
              <BarChart data={(data?.top_goals ?? []).map((d) => ({ ...d, name: humanize(d.name) }))} />
            </Card>
            <Card title="Top challenges">
              <BarChart
                data={(data?.top_challenges ?? []).map((d) => ({ ...d, name: humanize(d.name) }))}
                color="#b08968"
              />
            </Card>
            <Card title="Field of study">
              <BarChart data={data?.by_field ?? []} />
            </Card>
            <Card title="Onboarding step reached">
              <BarChart
                data={(data?.by_step ?? []).map((d) => ({ ...d, name: `Step ${d.name}` }))}
                color="#8da9c4"
              />
            </Card>
          </div>

          <Card title={`Enrolled users (${filtered.length})`}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, role, field…"
              className="mb-3 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-500"
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-stone-200 text-stone-500">
                  <tr>
                    {['Name', 'Email', 'Role', 'Year', 'Field', 'Step', 'Joined'].map((h) => (
                      <th key={h} className="whitespace-nowrap px-2 py-2 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b border-stone-100">
                      <td className="whitespace-nowrap px-2 py-2">{u.display_name || '—'}</td>
                      <td className="whitespace-nowrap px-2 py-2">
                        {u.email ? (
                          <a href={`mailto:${u.email}`} className="text-amber-700 hover:underline">
                            {u.email}
                          </a>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2">{humanize(u.role)}</td>
                      <td className="whitespace-nowrap px-2 py-2">{humanize(u.year_of_study)}</td>
                      <td className="whitespace-nowrap px-2 py-2">{u.field_of_study || '—'}</td>
                      <td className="px-2 py-2">{u.onboarding_step ?? '—'}</td>
                      <td className="whitespace-nowrap px-2 py-2 text-stone-500">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-stone-400">
                        No users match.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function Meta() {
  return (
    <Helmet>
      <title>SWA Admin</title>
      {/* Keep this page out of search results entirely. */}
      <meta name="robots" content="noindex, nofollow, noarchive" />
    </Helmet>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <p className="text-2xl font-semibold tabular-nums text-stone-900">{value}</p>
      <p className="mt-0.5 text-xs text-stone-500">{label}</p>
    </div>
  );
}

function Card({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-stone-200 bg-white p-5 ${className}`}>
      <h2 className="mb-4 text-sm font-semibold text-stone-900">{title}</h2>
      {children}
    </section>
  );
}
