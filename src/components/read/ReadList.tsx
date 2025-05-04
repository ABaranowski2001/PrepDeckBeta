
import { Text } from './types';
import ReadCard from './ReadCard';
import { Book } from 'lucide-react';

interface ReadListProps {
  texts: Text[];
  title?: string;
  onTextSelect: (text: Text) => void;
}

const ReadList = ({ texts, title = "Academic Texts", onTextSelect }: ReadListProps) => {
  // Ensure texts is always a valid array
  const safeTexts = Array.isArray(texts) ? texts : [];
  
  // Check if we have valid texts after ensuring it's an array
  const hasTexts = safeTexts.length > 0;

  if (!hasTexts) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <Book className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No academic texts found for this content.</p>
      </div>
    );
  }

  console.log("ReadList rendering with texts:", safeTexts);

  return (
    <div className="h-full overflow-auto p-4">
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      <div className="space-y-4">
        {safeTexts.map((text) => (
          <ReadCard 
            key={text.id || `text-${Math.random()}`} 
            text={text} 
            onClick={() => {
              console.log("Text selected:", text);
              onTextSelect(text);
            }} 
          />
        ))}
      </div>
    </div>
  );
};

export default ReadList;
