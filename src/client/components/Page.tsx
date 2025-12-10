/**
 * Page wrapper template to be used as a base for all pages.
 */

import React from 'react';
import LoadingSpinner from '@/client/components/LoadingSpinner';

interface PageProps {
  children?: React.ReactNode;
  isLoading?: boolean;
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
      {/* <Header /> */}
      <PageBody isLoading={isLoading}>{children}</PageBody>
      {/* <CookiesBanner>
        <SupportChat />
      </CookiesBanner> */}
    </PageWrapper>
  );
}
