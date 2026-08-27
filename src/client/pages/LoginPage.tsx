import React, { useCallback, useState } from 'react';
import { getConfig, loginWithPassword, MethodError } from 'modelence/client';
import { Button } from '@/client/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/Card';
import { Input } from '@/client/components/ui/Input';
import { Label } from '@/client/components/ui/Label';
import { Link } from 'react-router';
import Page from '@/client/components/Page';
import VerifyEmailNotice from '@/client/components/VerifyEmailNotice';

export default function LoginPage() {
  return (
    <Page seo={{ title: 'Sign in', noindex: true }}>
      <div className="flex items-center justify-center min-h-full">
        <LoginForm />
      </div>
    </Page>
  );
}

function LoginForm() {
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const isSandboxEnv = getConfig('_system.env.type') === 'sandbox';
  const defaultDemoEmail = isSandboxEnv ? getConfig('example.modelenceDemoUsername') as string | undefined : undefined;
  const defaultDemoPassword = isSandboxEnv ? getConfig('example.modelenceDemoPassword') as string | undefined : undefined;

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      await loginWithPassword({ email, password });
    } catch (error) {
      // Recoverable, not a failed login: offer resend instead of an error.
      if (error instanceof MethodError && error.code === 'EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(email);
        return;
      }
      throw error;
    }
  }, []);

  if (unverifiedEmail) {
    return (
      <VerifyEmailNotice
        email={unverifiedEmail}
        title="Verify your email to sign in"
        footer={
          <button
            type="button"
            onClick={() => setUnverifiedEmail(null)}
            className="text-sm text-gray-600 underline hover:no-underline"
          >
            Back to sign in
          </button>
        }
      />
    );
  }

  return (
    <Card className="w-full max-w-sm mx-auto bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          Sign in to your account
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" className="block mb-2">
              Email
            </Label>
            <Input 
              type="email" 
              name="email" 
              id="email"
              defaultValue={defaultDemoEmail}
              required
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="password">
                Password
              </Label>
              <Link
                to="/forgot-password"
                className="text-sm text-gray-600 underline hover:no-underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input 
              type="password" 
              name="password" 
              id="password" 
              defaultValue={defaultDemoPassword}
              required
            />
          </div>

          <Button
            className="w-full"
            type="submit"
          >
            Login
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="text-gray-900 underline hover:no-underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
