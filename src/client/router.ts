import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: '/',
    Component: lazy(() => import('./pages/HomePage'))
  },
  {
    path: '/example/:itemId',
    Component: lazy(() => import('./pages/ExamplePage'))
  },
  {
    path: '/login',
    Component: lazy(() => import('./pages/LoginPage'))
  },
  {
    path: '/signup',
    Component: lazy(() => import('./pages/SignupPage'))
  },
  {
    path: '/terms',
    Component: lazy(() => import('./pages/TermsPage'))
  }
]);
