
import { toast } from 'sonner';

/**
 * Handles errors with consistent error messages and logging
 */
export const handleGenericError = (
  error: unknown, 
  defaultMessage: string = "An unexpected error occurred"
) => {
  const errorMessage = error instanceof Error ? error.message : defaultMessage;
  console.error(errorMessage);
  toast.error(errorMessage);
};
