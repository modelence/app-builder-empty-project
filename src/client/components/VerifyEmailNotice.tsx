import React, { useCallback, useState } from 'react';
import { resendEmailVerification } from 'modelence/client';
import { toast } from 'react-hot-toast';
import { Button } from '@/client/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/components/ui/Card';

interface VerifyEmailNoticeProps {
  /** Address the verification link was sent to. */
  email: string;
  /** Heading copy - differs between the post-signup and failed-login entry points. */
  title?: string;
  /** Rendered under the main copy, e.g. a link back to sign in. */
  footer?: React.ReactNode;
}

/**
 * Shown whenever an account exists but its email is not verified yet: right
 * after signup, and after a login attempt rejected with EMAIL_NOT_VERIFIED.
 * Both cases need the same recovery path, so the resend flow lives here.
 */
export default function VerifyEmailNotice({
  email,
  title = 'Verify your email',
  footer,
}: VerifyEmailNoticeProps) {
  const [isSending, setIsSending] = useState(false);

  const handleResend = useCallback(async () => {
    setIsSending(true);
    try {
      await resendEmailVerification({ email });
      toast.success('Verification email sent. Check your inbox.');
    } catch (error) {
      // The global errorHandler already surfaces a toast for this.
      console.error((error as Error).message);
    } finally {
      setIsSending(false);
    }
  }, [email]);

  return (
    <Card className="w-full max-w-sm mx-auto bg-white text-gray-900">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-4">
        <p className="text-center text-gray-600">
          We sent a verification link to <span className="font-medium text-gray-900">{email}</span>.
          Click the link to activate your account — you won't be able to sign in until you do.
        </p>
        <p className="text-center text-sm text-gray-500">
          No email? Check your spam folder, or resend it below.
        </p>

        <Button
          className="w-full"
          variant="outline"
          onClick={handleResend}
          loading={isSending}
        >
          Resend verification email
        </Button>

        {footer}
      </CardContent>
    </Card>
  );
}
