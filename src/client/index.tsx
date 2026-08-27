import { Suspense } from 'react';
import { MethodError, renderApp } from 'modelence/client';
import { toast, Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { router } from './router';
import favicon from './assets/favicon.svg';
import './index.css';
import LoadingSpinner from './components/LoadingSpinner';
import { Seo } from './components/Seo';
import { useAutoLogin } from './lib/autoLogin';
import { TooltipProvider } from './components/ui/Tooltip';

const queryClient = new QueryClient();

function App() {
  useAutoLogin();

  return (
    <TooltipProvider delay={150}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        {/* Site-wide SEO defaults; pages can override via <Page seo={{...}}> */}
        <Seo />
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </Suspense>
    </TooltipProvider>
  );
}

renderApp({
  routesElement: (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  ),
  errorHandler: (error) => {
    // LoginPage handles this inline with a resend link; skip the duplicate,
    // less actionable toast.
    if (error instanceof MethodError && error.code === 'EMAIL_NOT_VERIFIED') {
      return;
    }
    toast.error(error.message);
  },
  loadingElement: <LoadingSpinner fullScreen />,
  favicon
});

