import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from '@dr.pogodin/react-helmet';
import AdminPage from '../admin';
import type { AdminOverview } from '@/lib/supabase-admin';

const overview: AdminOverview = {
  generated_at: '2026-09-01T12:00:00Z',
  totals: { users: 3, with_email: 2, completed: 2, last_7_days: 2, students: 2, professionals: 1 },
  daily: [
    { date: '2026-08-30', count: 1 },
    { date: '2026-08-31', count: 0 },
    { date: '2026-09-01', count: 2 },
  ],
  by_role: [
    { name: 'college_student', count: 2 },
    { name: 'working_professional', count: 1 },
  ],
  by_year: [{ name: '3rd_year', count: 2 }],
  by_field: [{ name: 'Engineering / Technology', count: 2 }],
  by_step: [{ name: '7', count: 2 }],
  top_goals: [{ name: 'focus', count: 2 }],
  top_challenges: [{ name: 'academic_pressure', count: 1 }],
  users: [
    {
      id: '1',
      display_name: 'Ravi Kumar',
      email: 'ravi@example.com',
      role: 'college_student',
      year_of_study: '3rd_year',
      field_of_study: 'Engineering / Technology',
      goals: ['focus'],
      challenges: ['academic_pressure'],
      onboarding_step: 7,
      completed_at: '2026-09-01T10:00:00Z',
      created_at: '2026-09-01T09:00:00Z',
    },
    {
      id: '2',
      display_name: 'Asha',
      email: 'asha@example.com',
      role: 'college_student',
      year_of_study: '1st_year',
      field_of_study: 'Science / Medicine',
      goals: [],
      challenges: [],
      onboarding_step: 7,
      completed_at: null,
      created_at: '2026-08-30T09:00:00Z',
    },
  ],
};

function mockFetch(handler: (body: { p_passcode: string }) => Response) {
  return vi.fn(async (_url: string, init: RequestInit) =>
    handler(JSON.parse(String(init.body))),
  );
}

const ok = () =>
  new Response(JSON.stringify(overview), { status: 200, headers: { 'Content-Type': 'application/json' } });
const denied = () =>
  new Response(JSON.stringify({ code: '28000', message: 'unauthorized' }), { status: 400 });

const ui = <HelmetProvider><AdminPage /></HelmetProvider>;

beforeEach(() => sessionStorage.clear());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('hidden /admin dashboard', () => {
  it('shows the lock screen first and never leaks data before auth', () => {
    vi.stubGlobal('fetch', mockFetch(ok));
    render(ui);
    expect(screen.getByPlaceholderText('Passcode')).toBeTruthy();
    expect(screen.queryByText('ravi@example.com')).toBeNull();
  });

  it('rejects a wrong passcode and stores nothing', async () => {
    vi.stubGlobal('fetch', mockFetch(denied));
    render(ui);
    await userEvent.type(screen.getByPlaceholderText('Passcode'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: 'Unlock' }));
    await waitFor(() => expect(screen.getByText('Incorrect passcode.')).toBeTruthy());
    expect(sessionStorage.getItem('swa-admin-pass')).toBeNull();
  });

  it('renders stats, charts and every enrolled email once unlocked', async () => {
    sessionStorage.setItem('swa-admin-pass', 'right');
    vi.stubGlobal('fetch', mockFetch(ok));
    render(ui);

    await waitFor(() => expect(screen.getByText('SWA Analytics')).toBeTruthy());

    // headline numbers
    expect(screen.getByText('Total users')).toBeTruthy();
    // emails are the whole point of the page
    expect(screen.getByText('ravi@example.com')).toBeTruthy();
    expect(screen.getByText('asha@example.com')).toBeTruthy();
    // charts rendered
    expect(document.querySelectorAll('svg').length).toBeGreaterThan(1);
    // slugs are humanised, not raw
    expect(screen.getAllByText('College student').length).toBeGreaterThan(0);
  });

  it('tells the operator when the SQL has not been run yet', async () => {
    sessionStorage.setItem('swa-admin-pass', 'right');
    vi.stubGlobal(
      'fetch',
      mockFetch(() =>
        new Response(
          JSON.stringify({ code: 'PGRST202', message: 'Could not find the function public.admin_overview' }),
          { status: 404 },
        ),
      ),
    );
    render(ui);
    await waitFor(() =>
      expect(screen.getByText(/RUN_THIS_admin_dashboard\.sql/)).toBeTruthy(),
    );
  });
});
