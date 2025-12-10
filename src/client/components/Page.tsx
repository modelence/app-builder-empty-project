/**
 * Page wrapper template to be used as a base for all pages.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from 'modelence/client';
import LoadingSpinner from '@/client/components/LoadingSpinner';
import { Button } from '@/client/components/ui/Button';

interface PageProps {
  children?: React.ReactNode;
  isLoading?: boolean;
}

function Header() {
  const { user } = useSession();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <Link to="/">
        <Button variant="ghost">
          Home
        </Button>
      </Link>

      {user && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {user.handle}
          </span>
          <Link to="/logout">
            <Button variant="outline">
              Logout
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col min-h-screen max-w-full overflow-x-hidden">{children}</div>;
}

function PageBody({ children, isLoading = false }: PageProps) {
  return (
    <div className="flex flex-1 w-full">
      <main className="flex-1 p-4 space-y-4 overflow-x-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <LoadingSpinner />
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

export default function Page({ children, isLoading = false }: PageProps) {
  return (
    <PageWrapper>
      <Header />
      <PageBody isLoading={isLoading}>{children}</PageBody>
    </PageWrapper>
  );
}
