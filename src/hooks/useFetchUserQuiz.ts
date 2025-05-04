import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useFileState } from "@/contexts/ModuleContext";
import { createDefaultQuizData } from "@/utils/quizUtils";

export interface UserQuizResult {
  questions: any[];
  title: string;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook: Fetches quiz questions for the current user and file from Supabase
 */
export const useFetchUserQuiz = (): UserQuizResult => {
  const { user } = useAuth();
  const { currentFile } = useFileState();
  const [questions, setQuestions] = useState<any[]>([]);
  const [title, setTitle] = useState<string>("Quiz");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id || !currentFile?.name) {
      console.log("Missing user or file, returning empty questions array");
      setQuestions([]);
      setTitle("Quiz");
      setError(null);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    console.log("Fetching quiz for user:", user.id, "and file:", currentFile.name);

    const fetchQuiz = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("PDF Quiz")
          .select("Quiz")
          .eq("User_ID", user.id)
          .eq("File Name", currentFile.name);

        if (fetchError) {
          console.error("Error fetching quiz:", fetchError);
          setError(fetchError.message || "Could not load quiz data.");
          setQuestions([]);
          setTitle("Quiz");
        } else if (data && data.length > 0) {
          // Always use the first entry
          const quizText = data[0].Quiz;
          
          // Debug logging
          console.log("Raw quiz data received:", quizText);
          
          let parsed = null;
          
          try {
            // Handle different possible formats of the quiz data
            if (typeof quizText === "string") {
              // Try to parse as JSON (handling markdown code blocks if present)
              const cleanedQuiz = quizText.replace(/```json\s*|\s*```/g, "");
              parsed = JSON.parse(cleanedQuiz);
              console.log("Successfully parsed quiz string data:", parsed);
            } else if (quizText === null || quizText === undefined) {
              console.error("Quiz data is null or undefined");
              throw new Error("Quiz data is empty");
            } else {
              // If not a string, assume it's already a parsed object/array
              parsed = quizText;
              console.log("Using pre-parsed quiz data:", parsed);
            }
          } catch (e) {
            console.error("Failed to parse quiz data:", e, "Raw data:", quizText);
            setError("Failed to parse quiz data.");
            // Use default quiz data as fallback
            const defaultData = createDefaultQuizData();
            setQuestions(defaultData.questions);
            setTitle(defaultData.title);
            setIsLoading(false);
            return;
          }
          
          // Process the parsed data into a standardized format
          if (parsed) {
            // Determine format: object with questions/title, or array
            if (Array.isArray(parsed)) {
              console.log("Quiz data is a direct array with", parsed.length, "questions");
              setQuestions(parsed.map(q => {
                // Ensure each question has the required properties
                return {
                  ...q,
                  id: q.id || `question-${Math.random().toString(36).substring(2, 9)}`,
                  // Keep both options and choices if present
                  options: Array.isArray(q.options) ? q.options : [],
                  choices: Array.isArray(q.choices) ? q.choices : [],
                  correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0
                };
              }));
              setTitle("Content Quiz"); // Default title for arrays
            } else if (parsed && typeof parsed === "object") {
              if (Array.isArray(parsed.questions)) {
                console.log("Quiz data is an object with questions array of length", parsed.questions.length);
                setQuestions(parsed.questions.map((q: any) => {
                  // Ensure each question has the required properties
                  return {
                    ...q,
                    id: q.id || `question-${Math.random().toString(36).substring(2, 9)}`,
                    // Keep both options and choices if present
                    options: Array.isArray(q.options) ? q.options : [],
                    choices: Array.isArray(q.choices) ? q.choices : [],
                    correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0
                  };
                }));
                if (parsed.title) setTitle(parsed.title);
                else setTitle("Content Quiz");
              } else {
                console.error("Unexpected quiz data format:", parsed);
                setQuestions([]);
                setTitle("Quiz");
              }
            } else {
              console.error("Quiz data is not an array or object:", parsed);
              setQuestions([]);
              setTitle("Quiz");
            }
          } else {
            setQuestions([]);
            setTitle("Quiz");
          }
          
          setError(null);
        } else {
          console.log("No quiz data found");
          setQuestions([]);
          setTitle("Quiz");
        }
      } catch (e: any) {
        console.error("Failed to load quiz:", e);
        setError(e?.message || "Failed to load quiz.");
        setQuestions([]);
        setTitle("Quiz");
      }
      setIsLoading(false);
    };

    fetchQuiz();
  }, [user?.id, currentFile?.name]);

  // Always ensure we return an array for questions, even if empty
  return { 
    questions: Array.isArray(questions) ? questions : [], 
    title, 
    isLoading, 
    error 
  };
};
