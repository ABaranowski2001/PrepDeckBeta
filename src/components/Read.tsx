
import { useState, useEffect } from 'react';
import { Text } from './read/types';
import ReadList from './read/ReadList';
import ReadDescription from './read/ReadDescription';

interface ReadProps {
  title?: string;
  texts?: Text[];
  activeText?: Text | null;
  onTextChange?: (text: Text | null) => void;
  isTabActive?: boolean;
}

const Read = ({
  title = "Academic Texts",
  texts = [],
  activeText = null,
  onTextChange,
  isTabActive = true
}: ReadProps) => {
  // Use local state if no external control is provided
  const [localActiveText, setLocalActiveText] = useState<Text | null>(activeText);
  
  // Ensure texts is always an array
  const safeTexts = Array.isArray(texts) ? texts : [];
  
  // The actual active text is either controlled externally or locally
  const currentActiveText = onTextChange ? activeText : localActiveText;
  
  // Handle text change - either call the external handler or update local state
  const handleTextChange = (text: Text | null) => {
    console.log("handleTextChange called with text:", text);
    if (onTextChange) {
      onTextChange(text);
    } else {
      setLocalActiveText(text);
    }
  };

  // Reset view when tab becomes inactive to show the list when returning
  useEffect(() => {
    if (!isTabActive && onTextChange) {
      onTextChange(null);
    }
  }, [isTabActive, onTextChange]);

  // Update local state if the external activeText prop changes
  useEffect(() => {
    if (!onTextChange) {
      setLocalActiveText(activeText);
    }
  }, [activeText, onTextChange]);

  console.log("Read component rendering with currentActiveText:", currentActiveText);
  console.log("Read component texts:", safeTexts);

  if (!safeTexts.length) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <p className="text-gray-500">No academic texts available for this content.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {currentActiveText ? (
        <ReadDescription 
          text={currentActiveText} 
          onBack={() => {
            console.log("Back button clicked");
            handleTextChange(null);
          }} 
        />
      ) : (
        <ReadList 
          texts={safeTexts} 
          title={title} 
          onTextSelect={(text) => {
            console.log("Text selected from ReadList:", text);
            handleTextChange(text);
          }} 
        />
      )}
    </div>
  );
};

export default Read;
