
// Quiz module handler
export const callQuizWebhook = async (
  file: File, 
  setIsLoading: (loading: boolean) => void, 
  setError: (error: string | null) => void
): Promise<{ questions: any[] | null, title: string } | null> => {
  try {
    setIsLoading(true);
    setError(null);
    
    // Return sample data for testing
    const sampleQuestions = [
      {
        id: "q1",
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        correctAnswer: 1,
        explanation: "Mars is called the Red Planet because it appears reddish in color due to iron oxide (rust) on its surface."
      },
      {
        id: "q2",
        question: "What is the chemical symbol for gold?",
        options: ["Au", "Ag", "Fe", "Cu"],
        correctAnswer: 0,
        explanation: "Au is the chemical symbol for gold, derived from the Latin word 'aurum'."
      },
      {
        id: "q3",
        question: "Which is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctAnswer: 3,
        explanation: "The Pacific Ocean is the largest and deepest ocean on Earth, covering more than 30% of the Earth's surface."
      }
    ];
    
    return { questions: sampleQuestions, title: "Sample Quiz" };
  } catch (error) {
    console.error("Error in quiz webhook:", error);
    setError("Error loading quiz questions");
    return { questions: [], title: "Quiz" };
  } finally {
    setIsLoading(false);
  }
};
