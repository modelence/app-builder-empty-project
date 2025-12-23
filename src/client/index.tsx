import { Suspense } from 'react';
import { renderApp } from 'modelence/client';
import { toast, Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { router } from './router';
import favicon from './assets/favicon.svg';
import './index.css';
import LoadingSpinner from './components/LoadingSpinner';
import { useAutoLogin } from './lib/autoLogin';

const queryClient = new QueryClient();

function App() {
  useAutoLogin();

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </Suspense>
  );
}

renderApp({
  routesElement: (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  ),
  errorHandler: (error) => {
    toast.error(error.message);
  },
  loadingElement: <LoadingSpinner fullScreen />,
  favicon
});

