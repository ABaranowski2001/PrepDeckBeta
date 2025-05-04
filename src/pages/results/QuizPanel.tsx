
import { TestTube } from 'lucide-react';
import Quiz from '@/components/Quiz';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PanelContainer from '@/components/panels/PanelContainer';
import { useEffect } from 'react';
import { useFetchUserQuiz } from '@/hooks/useFetchUserQuiz';
import { createDefaultQuizData } from '@/utils/quizUtils';

const QuizPanel = () => {
  const { questions, title, isLoading, error } = useFetchUserQuiz();

  // Debug logging
  useEffect(() => {
    console.log("QuizPanel - questions received:", questions);
  }, [questions]);
  
  // Make sure questions is always an array
  const safeQuestions = Array.isArray(questions) ? questions : [];
  const hasQuestions = safeQuestions.length > 0;

  // Load default quiz when no questions or there's an error
  const handleLoadDefaultQuiz = () => {
    const defaultQuizData = createDefaultQuizData();
    toast.success("Using fallback quiz questions");
    console.log("Loading default quiz data:", defaultQuizData);
    window.location.reload(); // quick reload to trigger refetch & display fallback by context if needed
  };

  return (
    <PanelContainer
      isPending={isLoading}
      loadingTitle="Loading quiz questions"
      loadingDescription="Retrieving your quiz questions from storage..."
      icon={!hasQuestions && <TestTube className="h-12 w-12 text-gray-400" />}
      emptyTitle={!hasQuestions && !error ? "No quiz questions available for this content." : undefined}
      error={error}
    >
      {hasQuestions ? (
        <Quiz 
          title={title || "Quiz"} 
          questions={safeQuestions} 
          showAllQuestions={true} 
        />
      ) : (
        <div className="h-full flex flex-col items-center justify-center">
          <Button
            className="mt-4" 
            variant="outline"
            onClick={handleLoadDefaultQuiz}
          >
            Load Sample Quiz
          </Button>
        </div>
      )}
    </PanelContainer>
  );
};

export default QuizPanel;
