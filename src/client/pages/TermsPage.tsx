import { Card, CardContent, CardHeader, CardTitle } from '@/client/components/ui/Card';
import Page from '@/client/components/Page';

export default function TermsPage() {
  return (
    <Page>
      <div className="max-w-3xl mx-auto py-8">
        <Card className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Terms and Conditions</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 text-gray-600 dark:text-gray-400">
            <p>
              By using this service, you agree to the following terms and conditions.
            </p>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing and using this application, you accept and agree to be bound by the terms and conditions outlined here.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">2. Use of Service</h2>
              <p>
                You agree to use the service only for lawful purposes and in accordance with these terms.
              </p>
            </section>

            <p className="text-sm text-gray-500 dark:text-gray-500 pt-4">
              {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
