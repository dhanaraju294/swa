import { RouteObject } from 'react-router';
import { lazy, Suspense } from 'react';
import HomePage from './pages/index';
// Eager import so renderToString doesn't hit a Suspense boundary on 404 routes
// and abort to client rendering. The prod 404 page is tiny; the dev-tools
// variant stays lazy because it pulls in dev-only code we don't want in
// production bundles.
import ProdNotFoundPage from './pages/_404';

const NotFoundPage = ProdNotFoundPage;

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

/**
 * Hidden admin dashboard, mounted outside the marketing layout so it renders
 * with no site header/footer. Lazy-loaded so its chart code and Supabase
 * client stay out of the main bundle that normal visitors download.
 *
 * Not linked from anywhere and marked noindex — address bar only.
 */
const AdminPage = lazy(() => import('./pages/admin'));

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <Suspense fallback={null}>
        <AdminPage />
      </Suspense>
    ),
  },
];

// Types for type-safe navigation
export type Path = '/';

export type Params = Record<string, string | undefined>;
