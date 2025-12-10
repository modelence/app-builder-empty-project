import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/components/ui/Card';
import { Button } from '@/client/components/ui/Button';
import Page from '@/client/components/Page';

export default function NotFoundPage() {
  return (
    <Page>
      <div className="flex items-center justify-center min-h-full">
        <Card className="w-full max-w-sm mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-6xl font-bold">404</CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-center">
              Page not found
            </p>
            <Link to="/" className="w-full">
              <Button className="w-full">
                Go home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}

