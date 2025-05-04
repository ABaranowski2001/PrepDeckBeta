
// Cards module handler
export const callCardsWebhook = async (
  file: File, 
  setIsLoading: (loading: boolean) => void, 
  setError: (error: string | null) => void
): Promise<any[] | { cards: any[], title: string } | null> => {
  try {
    setIsLoading(true);
    setError(null);
    
    // Return sample data for testing
    const sampleCards = [
      { question: "What is photosynthesis?", answer: "The process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll." },
      { question: "What is the capital of France?", answer: "Paris" },
      { question: "What is the formula for water?", answer: "H2O" }
    ];
    
    // Return in object format with title (consistent with other modules)
    return {
      cards: sampleCards,
      title: "Sample Memory Cards"
    };
  } catch (error) {
    console.error("Error in cards webhook:", error);
    setError("Error loading cards");
    return null;
  } finally {
    setIsLoading(false);
  }
};
