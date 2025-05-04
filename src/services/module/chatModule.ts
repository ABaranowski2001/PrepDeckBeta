
export const callChatWebhook = async (
  file: File,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
): Promise<any> => {
  try {
    setIsLoading(true);
    setError(null);
    return { messages: [] };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    setError(errorMessage);
    return { messages: [] };
  } finally {
    setIsLoading(false);
  }
};
