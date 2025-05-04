
import { Text } from './types';
import { BookOpen } from 'lucide-react';

interface ReadCardProps {
  text: Text;
  onClick: () => void;
}

const ReadCard = ({ text, onClick }: ReadCardProps) => {
  return (
    <div 
      className="flex flex-col md:flex-row gap-4 p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Read article: ${text.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className="w-full md:w-1/4 lg:w-1/5">
        {text.thumbnail ? (
          <div className="aspect-[3/4] bg-gray-100 rounded-md overflow-hidden">
            <img 
              src={text.thumbnail} 
              alt={text.title} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
        ) : (
          <div className="aspect-[3/4] bg-gray-100 rounded-md flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-medium mb-1">{text.title}</h3>
        
        {text.author && (
          <p className="text-sm text-gray-600 mb-2">
            By {text.author}{text.year ? ` (${text.year})` : ''}
          </p>
        )}
        
        {text.type && (
          <div className="mb-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
              {text.type.charAt(0).toUpperCase() + text.type.slice(1)}
            </span>
          </div>
        )}
        
        {text.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{text.description}</p>
        )}
      </div>
    </div>
  );
};

export default ReadCard;
