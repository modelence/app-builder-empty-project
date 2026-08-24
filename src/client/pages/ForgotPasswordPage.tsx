import React, { useCallback, useState } from 'react';
import { sendResetPasswordToken } from 'modelence/client';
import { Button } from '@/client/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/Card';
import { Input } from '@/client/components/ui/Input';
import { Label } from '@/client/components/ui/Label';
import { Link } from 'react-router';
import Page from '@/client/components/Page';

export default function ForgotPasswordPage() {
  return (
    <Page seo={{ title: 'Reset password', noindex: true }}>
      <div className="flex items-center justify-center min-h-full">
        <ForgotPasswordForm />
      </div>
    </Page>
  );
}

function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email'));

    setIsSending(true);
    try {
      await sendResetPasswordToken({ email });
      // Always report success: whether the address is registered is not
      // disclosed, to avoid leaking which accounts exist.
      setSentTo(email);
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setIsSending(false);
    }
  }, []);

  if (sentTo) {
    return (
      <Card className="w-full max-w-sm mx-auto bg-white text-gray-900">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Check your inbox</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-center text-gray-600">
            If an account exists for{' '}
            <span className="font-medium text-gray-900">{sentTo}</span>, we've sent a link to
            reset your password. The link expires in one hour.
          </p>
          <p className="text-center text-sm text-gray-500">
            No email? Check your spam folder.
          </p>
        </CardContent>

        <CardFooter className="justify-center">
          <Link
            to="/login"
            className="text-sm text-gray-900 underline hover:no-underline font-medium"
          >
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm mx-auto bg-white text-gray-900">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Reset your password</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-sm text-gray-600">
          Enter your email address and we'll send you a link to choose a new password.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" className="block mb-2">
              Email
            </Label>
            <Input type="email" name="email" id="email" required />
          </div>

          <Button className="w-full" type="submit" loading={isSending}>
            Send reset link
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-center text-sm text-gray-600">
          Remembered it?{' '}
          <Link
            to="/login"
            className="text-gray-900 underline hover:no-underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
