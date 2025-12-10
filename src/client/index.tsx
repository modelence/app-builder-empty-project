import { Suspense } from 'react';
import { renderApp } from 'modelence/client';
import { toast, Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { router } from './router';
import favicon from './assets/favicon.svg';
import './index.css';
import LoadingSpinner from './components/LoadingSpinner';

const queryClient = new QueryClient();

renderApp({
  routesElement: (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  ),
  errorHandler: (error) => {
    toast.error(error.message);
  },
  loadingElement: <LoadingSpinner fullScreen />,
  favicon
});

