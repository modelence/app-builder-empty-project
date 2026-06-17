import { Spinner } from '@/client/components/ui/Spinner';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

/**
 * Page-level loading state (centered container, optional full-screen + message).
 * For an inline spinner inside a control (e.g. a button), use
 * `components/ui/Spinner` instead.
 */
export default function LoadingSpinner({ fullScreen = false, message }: LoadingSpinnerProps) {
  const containerClasses = fullScreen
    ? "h-screen flex items-center justify-center bg-gray-100"
    : "flex items-center justify-center min-h-screen";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8 text-violet-500" />
        {message && <p className="text-gray-600 text-sm">{message}</p>}
      </div>
    </div>
  );
}
