
/**
 * Process different formats of quiz data into a standardized structure
 */
export const processQuizData = (quizData: any) => {
  let quizTitle = "Quiz";
  let quizQuestions: any[] = [];
  
  if (!quizData) {
    return { quizTitle, quizQuestions };
  }
  
  console.log("Processing quiz data for display:", quizData);
  
  // Check if it's themed questions array (from Make webhook)
  if (Array.isArray(quizData) && quizData.length > 0 && quizData[0].theme) {
    console.log("Using themed quiz data from webhook, found", quizData.length, "questions");
    quizQuestions = quizData.map((q: any, index: number) => {
      return {
        id: `themed-q-${index + 1}`,
        question: q.question,
        options: Array.isArray(q.choices) ? q.choices : ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswer: typeof q.correctAnswer === 'string' 
          ? q.choices.findIndex((choice: string) => choice === q.correctAnswer) 
          : (typeof q.correctAnswer === 'number' ? q.correctAnswer : 0),
        explanation: q.explanation || "",
        theme: q.theme || ""
      };
    });
    quizTitle = "Content Quiz";
  }
  // Check if it's a structured quiz object with questions array
  else if (quizData.questions && Array.isArray(quizData.questions)) {
    quizQuestions = quizData.questions;
    quizTitle = quizData.title || "Quiz";
    console.log(`Found ${quizQuestions.length} questions in quiz data object`);
  } 
  // Check if it's just an array of questions
  else if (Array.isArray(quizData)) {
    quizQuestions = quizData;
    console.log(`Found ${quizQuestions.length} questions in quiz array`);
  }
  
  // Process any remaining questions to ensure they have the correct format
  if (!Array.isArray(quizData) || (quizData.length > 0 && !quizData[0].theme)) {
    quizQuestions = quizQuestions.map((q: any, index: number) => {
      // Handle options with different property names
      const options = Array.isArray(q.options) ? q.options : 
                    (Array.isArray(q.choices) ? q.choices : ["No option available"]);
      
      // Handle correctAnswer with different property names and formats
      let correctAnswer = 0;
      if (typeof q.correctAnswer === 'number') {
        correctAnswer = q.correctAnswer;
      } else if (typeof q.correctAnswer === 'string') {
        // If correctAnswer is a string value matching one of the options, find its index
        const optionIndex = options.findIndex((opt: string) => opt === q.correctAnswer);
        if (optionIndex !== -1) {
          correctAnswer = optionIndex;
        } else if (!isNaN(Number(q.correctAnswer))) {
          // If it's a numeric string, convert to number
          correctAnswer = Number(q.correctAnswer);
        }
      } else if (q.correct_answer !== undefined) {
        if (typeof q.correct_answer === 'number') {
          correctAnswer = q.correct_answer;
        } else if (typeof q.correct_answer === 'string' && !isNaN(Number(q.correct_answer))) {
          correctAnswer = Number(q.correct_answer);
        }
      }
      
      console.log(`Question ${index}: "${q.question?.substring(0, 30)}...", correctAnswer: ${correctAnswer}`);
      
      return {
        id: q.id || `question-${index + 1}`,
        question: q.question || `Question ${index + 1}`,
        options: options,
        correctAnswer: correctAnswer,
        explanation: q.explanation || "",
        theme: q.theme || "" // Add theme property for themed questions
      };
    });
  }

  return { quizTitle, quizQuestions };
};

/**
 * Create default sample quiz data
 */
export const createDefaultQuizData = () => {
  return {
    title: "Content Quiz",
    questions: [
      {
        id: "q1",
        question: "What type of content does this document contain?",
        options: [
          "Technical information",
          "Educational material",
          "Entertainment",
          "News"
        ],
        correctAnswer: 1
      },
      {
        id: "q2",
        question: "According to the document, what is important?",
        options: [
          "Data analysis",
          "Understanding key concepts",
          "Following procedures",
          "Quick implementation"
        ],
        correctAnswer: 1
      }
    ]
  };
};
