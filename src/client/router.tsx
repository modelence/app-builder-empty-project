import { lazy } from 'react';
import { createBrowserRouter, Navigate, Outlet, RouteObject, useLocation, useSearchParams } from 'react-router';
import { useSession } from 'modelence/client';
import { useEmailVerificationStatus } from './lib/verificationStatus';

// Wraps every route so the ?status= param from the email verification link is
// handled wherever the framework redirects back to (the site root by default).
function RootLayout() {
  useEmailVerificationStatus();
  return <Outlet />;
}

// For guest-only routes (login, signup) - redirects to home if already logged in
function GuestRoute() {
  const { user } = useSession();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const encodedRedirect = searchParams.get('_redirect');
  const redirect = encodedRedirect ? decodeURIComponent(encodedRedirect) : '/';

  if (user) {
    return <Navigate to={redirect} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

// For protected routes - redirects to login if not authenticated
function PrivateRoute() {
  const { user } = useSession();
  const location = useLocation();

  if (!user) {
    const fullPath = location.pathname + location.search;
    return (
      <Navigate
        to={`/login?_redirect=${encodeURIComponent(fullPath)}`}
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}

// Public routes (no auth required)
const publicRoutes: RouteObject[] = [
  {
    path: '/',
    Component: lazy(() => import('./pages/HomePage'))
  },
  {
    path: '/example/:itemId',
    Component: lazy(() => import('./pages/ExamplePage'))
  },
  {
    path: '/terms',
    Component: lazy(() => import('./pages/TermsPage'))
  },
  {
    path: '/logout',
    Component: lazy(() => import('./pages/LogoutPage'))
  },
  // Public rather than guest-only: a reset link may be opened while an old
  // session is still active, and GuestRoute would redirect it away.
  {
    path: '/forgot-password',
    Component: lazy(() => import('./pages/ForgotPasswordPage'))
  },
  {
    path: '/reset-password',
    Component: lazy(() => import('./pages/ResetPasswordPage'))
  },
  {
    path: '*',
    Component: lazy(() => import('./pages/NotFoundPage'))
  }
];

// Guest routes (redirect to home if already logged in)
const guestRoutes: RouteObject[] = [
  {
    path: '/login',
    Component: lazy(() => import('./pages/LoginPage'))
  },
  {
    path: '/signup',
    Component: lazy(() => import('./pages/SignupPage'))
  }
];

// Private routes (redirect to login if not authenticated)
const privateRoutes: RouteObject[] = [
  {
    path: '/example/private',
    Component: lazy(() => import('./pages/PrivateExamplePage'))
  }
];

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      ...publicRoutes,
      {
        Component: GuestRoute,
        children: guestRoutes
      },
      {
        Component: PrivateRoute,
        children: privateRoutes
      }
    ]
  }
]);
