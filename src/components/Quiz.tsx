
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, X, RefreshCw, Download, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  choices?: string[];
  correctAnswer: number | string;
  explanation?: string;
  theme?: string;
}

interface QuizProps {
  title: string;
  questions: QuizQuestion[];
  showAllQuestions?: boolean;
}

const Quiz = ({ title = "Quiz", questions = [], showAllQuestions = false }: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, number | null>>({});

  // Debug logging to help diagnose the issue
  useEffect(() => {
    console.log("Quiz component rendered with:", {
      title,
      questionsLength: questions?.length,
      firstQuestion: questions?.[0]
    });
  }, [title, questions]);

  // Safety check for valid questions
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return (
      <Card className="w-full h-full shadow-sm border border-gray-200 overflow-hidden">
        <CardContent className="flex items-center justify-center p-12 text-gray-500">
          No quiz questions were found. Please try again.
        </CardContent>
      </Card>
    );
  }

  // Ensure we have a valid current question
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <Card className="w-full h-full shadow-sm border border-gray-200 overflow-hidden">
        <CardContent className="flex items-center justify-center p-12 text-gray-500">
          Error loading question. Please try refreshing.
        </CardContent>
      </Card>
    );
  }

  // Get options from either the options or choices property
  const options = currentQuestion.options?.length ? currentQuestion.options :
                  currentQuestion.choices?.length ? currentQuestion.choices :
                  ["Option 1", "Option 2", "Option 3", "Option 4"];

  // Parse correctAnswer to ensure it's a number
  let correctAnswerIndex = 0;
  if (typeof currentQuestion.correctAnswer === 'number') {
    correctAnswerIndex = currentQuestion.correctAnswer;
  } else if (typeof currentQuestion.correctAnswer === 'string') {
    // If correctAnswer is a string, check if it's one of the options
    const optionIndex = options.findIndex(opt => opt === currentQuestion.correctAnswer);
    if (optionIndex !== -1) {
      correctAnswerIndex = optionIndex;
    } else if (!isNaN(Number(currentQuestion.correctAnswer))) {
      // If it's a numeric string, convert to number
      correctAnswerIndex = Number(currentQuestion.correctAnswer);
    }
  }

  const handleOptionSelect = (index: number) => {
    if (!isAnswered) {
      setSelectedOption(index);
    }
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    if (selectedOption === correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
    
    // Save the answered question
    setAnsweredQuestions(prev => ({ ...prev, [currentQuestionIndex]: selectedOption }));
    
    // Log for debugging purposes
    console.log("Answer checked:", {
      isAnswered,
      selectedOption,
      correctAnswer: correctAnswerIndex,
      hasExplanation: !!currentQuestion.explanation,
      explanation: currentQuestion.explanation
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(answeredQuestions[currentQuestionIndex + 1] ?? null);
      setIsAnswered(answeredQuestions[currentQuestionIndex + 1] !== undefined);
    } else {
      // All questions viewed, check if all are answered
      const answeredCount = Object.keys(answeredQuestions).length;
      if (answeredCount === questions.length) {
        setIsCompleted(true);
      } else {
        toast.info(`You've answered ${answeredCount} of ${questions.length} questions`);
      }
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      // Move to previous question
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(answeredQuestions[currentQuestionIndex - 1] ?? null);
      setIsAnswered(answeredQuestions[currentQuestionIndex - 1] !== undefined);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
    setAnsweredQuestions({});
  };

  const handleDownload = () => {
    if (!questions || questions.length === 0) return;
    
    let quizText = `${title}\n\n`;
    
    questions.forEach((q, index) => {
      if (q.theme) {
        quizText += `Theme: ${q.theme}\n`;
      }
      quizText += `Question ${index + 1}: ${q.question}\n`;
      
      // Get options from either options or choices property
      const qOptions = q.options?.length ? q.options : 
                       q.choices?.length ? q.choices : 
                       ["Option 1", "Option 2", "Option 3", "Option 4"];
      
      // Determine correct answer index
      let qCorrectAnswer = 0;
      if (typeof q.correctAnswer === 'number') {
        qCorrectAnswer = q.correctAnswer;
      } else if (typeof q.correctAnswer === 'string') {
        const optIndex = qOptions.findIndex(opt => opt === q.correctAnswer);
        qCorrectAnswer = optIndex !== -1 ? optIndex : 0;
      }
      
      qOptions.forEach((option, optIndex) => {
        quizText += `${optIndex + 1}. ${option}${optIndex === qCorrectAnswer ? ' (Correct)' : ''}\n`;
      });
      
      if (q.explanation) {
        quizText += `Explanation: ${q.explanation}\n`;
      }
      quizText += '\n';
    });
    
    const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    
    const blob = new Blob([quizText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success(`Quiz downloaded as ${fileName}`);
  };

  // Calculate progress
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Determine when to show explanation
  const isAnswerIncorrect = isAnswered && selectedOption !== null && selectedOption !== correctAnswerIndex;
  const showExplanation = isAnswerIncorrect && currentQuestion.explanation;

  // Display theme information if available
  const questionTheme = currentQuestion.theme;

  return (
    <Card className="w-full h-full flex flex-col shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 pt-3 pb-1 flex items-center justify-between text-xs text-gray-500 flex-shrink-0">
        <span>
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <div className="flex items-center gap-2">
          <span>Score: {score}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDownload} 
            aria-label="Download quiz"
            title="Download quiz"
            className="h-7 w-7"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <Progress value={progress} className="h-1 w-full rounded-none" />

      {!isCompleted ? (
        <CardContent className="flex-grow p-3 flex flex-col overflow-auto">
          {questionTheme && (
            <div className="mb-2 text-xs font-medium text-blue-600 uppercase tracking-wide">
              {questionTheme}
            </div>
          )}
          <div className="mb-3 font-medium text-base">{currentQuestion.question}</div>
          
          <RadioGroup value={selectedOption?.toString()} className="space-y-2 flex-grow">
            {options.map((option, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-2 p-2 rounded-md border transition-colors ${
                  isAnswered 
                    ? index === correctAnswerIndex 
                      ? 'border-green-200 bg-green-50' 
                      : selectedOption === index 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-gray-200' 
                    : selectedOption === index 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleOptionSelect(index)}
              >
                <RadioGroupItem 
                  value={index.toString()} 
                  id={`option-${index}`} 
                  disabled={isAnswered}
                  className="h-4 w-4"
                />
                <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer text-sm">
                  {option}
                </Label>
                
                {isAnswered && index === correctAnswerIndex && (
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                )}
                
                {isAnswered && selectedOption === index && index !== correctAnswerIndex && (
                  <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </RadioGroup>
          
          {/* Explanation for incorrect answer */}
          {showExplanation && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-800">
              <p className="font-medium mb-1">Explanation:</p>
              <p>{currentQuestion.explanation}</p>
            </div>
          )}
          
          {/* Navigation controls */}
          <div className="flex justify-between pt-3 mt-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            
            {!isAnswered ? (
              <Button 
                onClick={handleCheck} 
                disabled={selectedOption === null}
                size="sm"
              >
                Check Answer
              </Button>
            ) : (
              <Button onClick={handleNext} size="sm">
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      ) : (
        <CardContent className="flex-grow flex items-center justify-center">
          <div className="text-center py-4 space-y-4">
            <div className="text-xl font-semibold">
              Quiz Completed!
            </div>
            <div className="text-4xl font-bold text-blue-500">
              {score}/{questions.length}
            </div>
            <div className="text-sm text-gray-600">
              {score === questions.length 
                ? 'Perfect score! Excellent work!' 
                : score >= questions.length / 2 
                  ? 'Good job! Keep studying to improve further.' 
                  : 'Keep practicing to improve your score.'}
            </div>
            <Button onClick={handleReset} size="sm" className="mt-2">
              <RefreshCw className="mr-2 h-3 w-3" /> Restart Quiz
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default Quiz;
