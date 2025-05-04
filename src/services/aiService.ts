import { AIGeneratedContent, MindmapNode, QuizQuestion } from "./types";

// Function to extract text from an image using OCR
const extractTextFromImage = async (file: File): Promise<string> => {
  // In a real application, this would use a proper OCR service
  // For demo purposes, we're simulating the extraction
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Simulate processing delay
      setTimeout(() => {
        // Return dummy content based on file name to simulate extraction
        const fileName = file.name.toLowerCase();
        
        if (fileName.includes("photo") || fileName.includes("cell")) {
          resolve("Cell structure and functions. The cell is the basic structural and functional unit of all living organisms. Cells contain cytoplasm enclosed within a membrane, which contains many biomolecules such as proteins and nucleic acids. Most plant and animal cells are visible only under a microscope, with dimensions between 1 and 100 micrometres. Organisms can be classified as unicellular or multicellular. The cell was discovered by Robert Hooke in 1665, who named the biological units 'cells' when he observed dead cells in cork. Cells consist of cytoplasm enclosed within a membrane, which contains many biomolecules such as proteins and nucleic acids.");
        } else if (fileName.includes("math") || fileName.includes("equation")) {
          resolve("Quadratic equations and their solutions. A quadratic equation is a second-degree polynomial equation in a single variable with the form: ax² + bx + c = 0, where a ≠ 0. The quadratic formula provides solutions using the discriminant: x = (-b ± √(b² - 4ac)) / 2a. When the discriminant (b² - 4ac) is positive, there are two distinct real solutions. When it equals zero, there is exactly one real solution (a repeated root). When the discriminant is negative, there are two complex conjugate solutions.");
        } else if (fileName.includes("history")) {
          resolve("The Industrial Revolution was the transition to new manufacturing processes in Great Britain, continental Europe, and the United States, in the period from about 1760 to 1820-1840. This transition included going from hand production methods to machines, new chemical manufacturing and iron production processes, the increasing use of steam power and water power, the development of machine tools and the rise of the mechanized factory system. The Industrial Revolution also led to an unprecedented rise in the rate of population growth.");
        } else {
          // Default content for mitochondria example
          resolve("Mitochondria are the powerhouse of the cell, responsible for producing energy in the form of ATP through cellular respiration. They have a unique double membrane structure with the inner membrane folded into cristae to increase surface area. Mitochondria contain their own DNA (mtDNA) which is inherited maternally. Beyond energy production, they play crucial roles in cellular processes including apoptosis, calcium homeostasis, and the production of reactive oxygen species. Mitochondrial dysfunction is linked to numerous diseases, including neurodegenerative disorders, diabetes, and aging. The endosymbiotic theory suggests that mitochondria originated from free-living bacteria that were engulfed by another cell, creating a symbiotic relationship that evolved over time.");
        }
      }, 1000);
    };
    reader.readAsArrayBuffer(file);
  });
};

// Function to extract text from a PDF
const extractTextFromPDF = async (file: File): Promise<string> => {
  // In a real application, this would use a PDF parsing library
  // For demo purposes, we're simulating the extraction
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Simulate processing delay
      setTimeout(() => {
        // Return dummy content based on file name to simulate extraction
        const fileName = file.name.toLowerCase();
        
        if (fileName.includes("photo") || fileName.includes("cell")) {
          resolve("Cell structure and functions. The cell is the basic structural and functional unit of all living organisms. Cells contain cytoplasm enclosed within a membrane, which contains many biomolecules such as proteins and nucleic acids. Most plant and animal cells are visible only under a microscope, with dimensions between 1 and 100 micrometres. Organisms can be classified as unicellular or multicellular. The cell was discovered by Robert Hooke in 1665, who named the biological units 'cells' when he observed dead cells in cork. Cells consist of cytoplasm enclosed within a membrane, which contains many biomolecules such as proteins and nucleic acids.");
        } else if (fileName.includes("math") || fileName.includes("equation")) {
          resolve("Quadratic equations and their solutions. A quadratic equation is a second-degree polynomial equation in a single variable with the form: ax² + bx + c = 0, where a ≠ 0. The quadratic formula provides solutions using the discriminant: x = (-b ± √(b² - 4ac)) / 2a. When the discriminant (b² - 4ac) is positive, there are two distinct real solutions. When it equals zero, there is exactly one real solution (a repeated root). When the discriminant is negative, there are two complex conjugate solutions.");
        } else if (fileName.includes("history")) {
          resolve("The Industrial Revolution was the transition to new manufacturing processes in Great Britain, continental Europe, and the United States, in the period from about 1760 to 1820-1840. This transition included going from hand production methods to machines, new chemical manufacturing and iron production processes, the increasing use of steam power and water power, the development of machine tools and the rise of the mechanized factory system. The Industrial Revolution also led to an unprecedented rise in the rate of population growth.");
        } else {
          resolve("Mitochondria are the powerhouse of the cell, responsible for producing energy in the form of ATP through cellular respiration. They have a unique double membrane structure with the inner membrane folded into cristae to increase surface area. Mitochondria contain their own DNA (mtDNA) which is inherited maternally. Beyond energy production, they play crucial roles in cellular processes including apoptosis, calcium homeostasis, and the production of reactive oxygen species. Mitochondrial dysfunction is linked to numerous diseases, including neurodegenerative disorders, diabetes, and aging. The endosymbiotic theory suggests that mitochondria originated from free-living bacteria that were engulfed by another cell, creating a symbiotic relationship that evolved over time.");
        }
      }, 1000);
    };
    reader.readAsArrayBuffer(file);
  });
};

// Function to rewrite and simplify the transcribed text
const rewriteForClarity = async (text: string): Promise<string> => {
  // In a real application, this would call an AI service for text simplification
  // For demo purposes, we're simulating the rewriting process
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple simulation of rewriting - in a real app, use an AI service
      const simplified = text
        .replace(/mitochondria are/i, "Mitochondria (the cell's power generators) are")
        .replace(/cellular respiration/i, "cellular respiration (the process of converting nutrients to energy)")
        .replace(/double membrane/i, "double-layered outer covering")
        .replace(/cristae/i, "cristae (folded inner membranes)")
        .replace(/mtDNA/i, "mitochondrial DNA (mtDNA)")
        .replace(/apoptosis/i, "apoptosis (programmed cell death)")
        .replace(/calcium homeostasis/i, "calcium balance")
        .replace(/reactive oxygen species/i, "reactive oxygen species (free radicals)")
        .replace(/endosymbiotic theory/i, "endosymbiotic theory (evolutionary origin theory)");
      
      resolve(simplified);
    }, 1000);
  });
};

// Function to extract keywords from text
const extractKeywords = async (text: string): Promise<string[]> => {
  // In a real application, this would use an AI or NLP service
  // For demo purposes, we're doing simple keyword extraction
  return new Promise((resolve) => {
    setTimeout(() => {
      const words = text.split(/\s+/);
      const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'about', 'from']);
      const keywords = words
        .filter(word => word.length > 4)
        .filter(word => !commonWords.has(word.toLowerCase()))
        .filter(word => /^[a-zA-Z]+$/.test(word))
        .map(word => word.replace(/[.,;:]$/, ''))
        .slice(0, 15);
      
      const uniqueKeywords = Array.from(new Set(keywords));
      resolve(uniqueKeywords);
    }, 500);
  });
};

// Function to generate AI content from extracted text
const generateContentFromText = async (originalText: string, simplifiedText: string, keywords: string[]): Promise<AIGeneratedContent> => {
  // In a real application, this would call an AI service API
  // For demo purposes, we're generating mock content based on the text
  return new Promise((resolve) => {
    // Simulate AI processing delay
    setTimeout(() => {
      // Generate different content based on the text content
      if (simplifiedText.includes("cell")) {
        resolve({
          summary: {
            title: "Cell Structure and Functions",
            text: simplifiedText,
            original: originalText
          },
          mindmap: {
            title: "Cell Biology Concept Map",
            data: {
              id: "root",
              text: "Cell",
              children: [
                {
                  id: "c1",
                  text: "Structure",
                  children: [
                    { id: "c1-1", text: "Cell membrane" },
                    { id: "c1-2", text: "Cytoplasm" },
                    { id: "c1-3", text: "Nucleus" }
                  ]
                },
                {
                  id: "c2",
                  text: "Types",
                  children: [
                    { id: "c2-1", text: "Prokaryotic" },
                    { id: "c2-2", text: "Eukaryotic" }
                  ]
                },
                {
                  id: "c3",
                  text: "Discovery",
                  children: [
                    { id: "c3-1", text: "Robert Hooke (1665)" },
                    { id: "c3-2", text: "Cork observation" }
                  ]
                }
              ]
            }
          },
          quiz: {
            title: "Test Your Knowledge on Cells",
            questions: [
              {
                id: "q1",
                question: "Who discovered cells in 1665?",
                options: [
                  "Charles Darwin",
                  "Robert Hooke",
                  "Louis Pasteur",
                  "Gregor Mendel"
                ],
                correctAnswer: 1
              },
              {
                id: "q2",
                question: "What is the basic structural and functional unit of all living organisms?",
                options: [
                  "Atom",
                  "Molecule",
                  "Cell",
                  "Tissue"
                ],
                correctAnswer: 2
              },
              {
                id: "q3",
                question: "What is contained within a cell membrane?",
                options: [
                  "Cytoplasm",
                  "Vacuole",
                  "Chloroplast",
                  "Ribosome"
                ],
                correctAnswer: 0
              },
              {
                id: "q4",
                question: "What is the typical size range of most plant and animal cells?",
                options: [
                  "0.1-1 nanometer",
                  "1-100 micrometers",
                  "1-10 millimeters",
                  "1-10 centimeters"
                ],
                correctAnswer: 1
              },
              {
                id: "q5",
                question: "Organisms that consist of a single cell are classified as:",
                options: [
                  "Multicellular",
                  "Unicellular",
                  "Acellular",
                  "Bicellular"
                ],
                correctAnswer: 1
              }
            ]
          }
        });
      } else if (simplifiedText.includes("quadratic")) {
        resolve({
          summary: {
            title: "Quadratic Equations and Solutions",
            text: simplifiedText,
            original: originalText
          },
          mindmap: {
            title: "Quadratic Equations Concept Map",
            data: {
              id: "root",
              text: "Quadratic Equations",
              children: [
                {
                  id: "c1",
                  text: "Formula",
                  children: [
                    { id: "c1-1", text: "ax² + bx + c = 0" },
                    { id: "c1-2", text: "a ≠ 0" }
                  ]
                },
                {
                  id: "c2",
                  text: "Solutions",
                  children: [
                    { id: "c2-1", text: "x = (-b ± √(b² - 4ac)) / 2a" },
                    { id: "c2-2", text: "Discriminant: b² - 4ac" }
                  ]
                },
                {
                  id: "c3",
                  text: "Types of Solutions",
                  children: [
                    { id: "c3-1", text: "Two real solutions (b² - 4ac > 0)" },
                    { id: "c3-2", text: "One real solution (b² - 4ac = 0)" },
                    { id: "c3-3", text: "Two complex solutions (b² - 4ac < 0)" }
                  ]
                }
              ]
            }
          },
          quiz: {
            title: "Test Your Knowledge on Quadratic Equations",
            questions: [
              {
                id: "q1",
                question: "What is the standard form of a quadratic equation?",
                options: [
                  "ax + b = 0",
                  "ax² + bx + c = 0",
                  "ax³ + bx² + cx + d = 0",
                  "a/x + b/x² = c"
                ],
                correctAnswer: 1
              },
              {
                id: "q2",
                question: "What is the discriminant in a quadratic equation?",
                options: [
                  "a + b + c",
                  "b² - 4ac",
                  "√(b² - 4ac)",
                  "-b/2a"
                ],
                correctAnswer: 1
              },
              {
                id: "q3",
                question: "If the discriminant is negative, what type of solutions does the quadratic equation have?",
                options: [
                  "Two distinct real solutions",
                  "One real repeated solution",
                  "No real solutions, two complex solutions",
                  "Infinitely many solutions"
                ],
                correctAnswer: 2
              },
              {
                id: "q4",
                question: "In the quadratic formula x = (-b ± √(b² - 4ac)) / 2a, what does 'a' represent?",
                options: [
                  "Coefficient of x",
                  "Coefficient of x²",
                  "Constant term",
                  "Discriminant"
                ],
                correctAnswer: 1
              },
              {
                id: "q5",
                question: "When will a quadratic equation have exactly one solution?",
                options: [
                  "When a = 0",
                  "When b² - 4ac = 0",
                  "When b² - 4ac > 0",
                  "When b² - 4ac < 0"
                ],
                correctAnswer: 1
              }
            ]
          }
        });
      } else if (simplifiedText.includes("Industrial Revolution")) {
        resolve({
          summary: {
            title: "The Industrial Revolution",
            text: simplifiedText,
            original: originalText
          },
          mindmap: {
            title: "Industrial Revolution Concept Map",
            data: {
              id: "root",
              text: "Industrial Revolution",
              children: [
                {
                  id: "c1",
                  text: "Time Period",
                  children: [
                    { id: "c1-1", text: "1760-1840" },
                    { id: "c1-2", text: "Great Britain, Europe, US" }
                  ]
                },
                {
                  id: "c2",
                  text: "Key Changes",
                  children: [
                    { id: "c2-1", text: "Hand to machine production" },
                    { id: "c2-2", text: "New chemical manufacturing" },
                    { id: "c2-3", text: "Steam power adoption" }
                  ]
                },
                {
                  id: "c3",
                  text: "Effects",
                  children: [
                    { id: "c3-1", text: "Factory system" },
                    { id: "c3-2", text: "Population growth" },
                    { id: "c3-3", text: "Urbanization" }
                  ]
                }
              ]
            }
          },
          quiz: {
            title: "Test Your Knowledge on The Industrial Revolution",
            questions: [
              {
                id: "q1",
                question: "During what approximate time period did the Industrial Revolution occur?",
                options: [
                  "1600-1700",
                  "1760-1840",
                  "1850-1900",
                  "1900-1950"
                ],
                correctAnswer: 1
              },
              {
                id: "q2",
                question: "Where did the Industrial Revolution begin?",
                options: [
                  "United States",
                  "France",
                  "Germany",
                  "Great Britain"
                ],
                correctAnswer: 3
              },
              {
                id: "q3",
                question: "Which power source became increasingly important during the Industrial Revolution?",
                options: [
                  "Nuclear power",
                  "Solar power",
                  "Steam power",
                  "Wind power"
                ],
                correctAnswer: 2
              },
              {
                id: "q4",
                question: "What major change in manufacturing occurred during the Industrial Revolution?",
                options: [
                  "Transition from machines to hand production",
                  "Transition from hand production to machines",
                  "Decreased factory production",
                  "Decline in chemical manufacturing"
                ],
                correctAnswer: 1
              },
              {
                id: "q5",
                question: "What demographic change was associated with the Industrial Revolution?",
                options: [
                  "Decrease in population",
                  "Migration from urban to rural areas",
                  "Increased population growth",
                  "No significant population changes"
                ],
                correctAnswer: 2
              }
            ]
          }
        });
      } else {
        // Default mitochondria content
        resolve({
          summary: {
            title: "Mitochondria: The Powerhouse of the Cell",
            text: simplifiedText,
            original: originalText
          },
          mindmap: {
            title: "Mitochondria Concept Map",
            data: {
              id: "root",
              text: "Mitochondria",
              children: [
                {
                  id: "c1",
                  text: "Structure",
                  children: [
                    { id: "c1-1", text: "Double membrane" },
                    { id: "c1-2", text: "Cristae" },
                    { id: "c1-3", text: "Matrix" }
                  ]
                },
                {
                  id: "c2",
                  text: "Function",
                  children: [
                    { id: "c2-1", text: "ATP production" },
                    { id: "c2-2", text: "Cellular respiration" },
                    { id: "c2-3", text: "Apoptosis regulation" }
                  ]
                },
                {
                  id: "c3",
                  text: "Genetics",
                  children: [
                    { id: "c3-1", text: "Contains own DNA" },
                    { id: "c3-2", text: "Maternal inheritance" },
                    { id: "c3-3", text: "Endosymbiotic theory" }
                  ]
                }
              ]
            }
          },
          quiz: {
            title: "Test Your Knowledge on Mitochondria",
            questions: [
              {
                id: "q1",
                question: "What is the primary function of mitochondria?",
                options: [
                  "Protein synthesis",
                  "ATP production",
                  "DNA replication",
                  "Waste removal"
                ],
                correctAnswer: 1
              },
              {
                id: "q2",
                question: "Which theory explains the origin of mitochondria?",
                options: [
                  "Cell theory",
                  "Germ theory",
                  "Endosymbiotic theory",
                  "Theory of evolution"
                ],
                correctAnswer: 2
              },
              {
                id: "q3",
                question: "How is mitochondrial DNA inherited?",
                options: [
                  "Paternally",
                  "Maternally",
                  "Both parents equally",
                  "Random inheritance"
                ],
                correctAnswer: 1
              },
              {
                id: "q4",
                question: "What structural feature increases the surface area of mitochondria?",
                options: [
                  "Outer membrane",
                  "Matrix",
                  "Cristae",
                  "Ribosomes"
                ],
                correctAnswer: 2
              },
              {
                id: "q5",
                question: "Besides energy production, what other process do mitochondria regulate?",
                options: [
                  "Photosynthesis",
                  "Apoptosis",
                  "Translation",
                  "Digestion"
                ],
                correctAnswer: 1
              }
            ]
          }
        });
      }
    }, 2000);
  });
};

// Main function to process file and generate AI content
export const processFile = async (file: File): Promise<AIGeneratedContent> => {
  try {
    // Step 1: Extract text from the file
    let extractedText = "";
    
    if (file.type.startsWith("image/")) {
      console.log("Transcribing text from image...");
      extractedText = await extractTextFromImage(file);
    } else if (file.type === "application/pdf") {
      console.log("Transcribing text from PDF...");
      extractedText = await extractTextFromPDF(file);
    } else {
      throw new Error("Unsupported file type");
    }
    
    if (!extractedText) {
      throw new Error("No text could be extracted from the file");
    }

    // Step 2: Rewrite the extracted text for easier digestion
    console.log("Simplifying content for easier understanding...");
    const simplifiedText = await rewriteForClarity(extractedText);
    
    // Step 3: Extract keywords for mindmap generation
    console.log("Extracting key concepts...");
    const keywords = await extractKeywords(simplifiedText);
    
    // Step 4: Generate AI content based on processed text and keywords
    console.log("Generating summary, mindmap, and quiz...");
    const content = await generateContentFromText(extractedText, simplifiedText, keywords);
    
    return content;
  } catch (error) {
    console.error("Error processing file:", error);
    throw error;
  }
};
