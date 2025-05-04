
export const callSummaryWebhook = async (
  file: File, 
  setIsLoading: (loading: boolean) => void, 
  setError: (error: string | null) => void
): Promise<{ processedText: string | null; originalText: string | null }> => {
  try {
    setIsLoading(true);
    return { processedText: null, originalText: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error processing summary';
    setError(errorMessage);
    return { processedText: null, originalText: null };
  } finally {
    setIsLoading(false);
  }
};
