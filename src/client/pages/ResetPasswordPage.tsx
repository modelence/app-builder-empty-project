import React, { useCallback, useState } from 'react';
import { resetPassword } from 'modelence/client';
import { Button } from '@/client/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/client/components/ui/Card';
import { Input } from '@/client/components/ui/Input';
import { Label } from '@/client/components/ui/Label';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-hot-toast';
import Page from '@/client/components/Page';

export default function ResetPasswordPage() {
  return (
    <Page seo={{ title: 'Choose a new password', noindex: true }}>
      <div className="flex items-center justify-center min-h-full">
        <ResetPasswordForm />
      </div>
    </Page>
  );
}

function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSaving, setIsSaving] = useState(false);

  // The landing route sends ?status=error for an invalid or expired link.
  const linkError = searchParams.get('status') === 'error'
    ? searchParams.get('message') || 'This password reset link is invalid or has expired.'
    : null;

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const password = String(formData.get('password'));
    const confirmPassword = String(formData.get('confirmPassword'));

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSaving(true);
    try {
      // No token: it's in an httpOnly cookie the server reads. Passing it
      // client-side is deprecated.
      await resetPassword({ password });
      toast.success('Your password has been updated. Please sign in.');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  }, [navigate]);

  if (linkError) {
    return (
      <Card className="w-full max-w-sm mx-auto bg-white text-gray-900">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Link expired</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-center text-gray-600">{linkError}</p>
          <Link to="/forgot-password" className="w-full">
            <Button className="w-full">Request a new link</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm mx-auto bg-white text-gray-900">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Choose a new password</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="password" className="block mb-2">
              New password
            </Label>
            <Input type="password" name="password" id="password" required />
          </div>

          <div>
            <Label htmlFor="confirm-password" className="block mb-2">
              Confirm new password
            </Label>
            <Input
              type="password"
              name="confirmPassword"
              id="confirm-password"
              required
            />
          </div>

          <Button className="w-full" type="submit" loading={isSaving}>
            Update password
          </Button>
        </form>
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
