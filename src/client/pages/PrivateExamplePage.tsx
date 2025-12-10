import { useSession } from 'modelence/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/components/ui/Card';
import Page from '@/client/components/Page';

export default function PrivateExamplePage() {
  const { user } = useSession();

  return (
    <Page>
      <div className="max-w-3xl mx-auto py-8">
        <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Private Example</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              Welcome, <span className="font-medium text-gray-900 dark:text-white">{user?.handle}</span>!
            </p>
            <p>
              This is a protected page that requires authentication.
            </p>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}

