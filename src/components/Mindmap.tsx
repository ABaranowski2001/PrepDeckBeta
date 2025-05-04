
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MindmapNode {
  id: string;
  text: string;
  children?: MindmapNode[];
}

interface MindmapProps {
  title: string;
  data: MindmapNode;
}

const Mindmap = ({ title, data }: MindmapProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    // Convert the mindmap data to a structured text format
    const generateTextRepresentation = (node: MindmapNode, level = 0): string => {
      const indent = '  '.repeat(level);
      let result = `${indent}${node.text}\n`;
      
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => {
          result += generateTextRepresentation(child, level + 1);
        });
      }
      
      return result;
    };
    
    const textContent = generateTextRepresentation(data);
    const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}-mindmap.txt`;
    
    // Create a blob with the content
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success('Mindmap downloaded as text file');
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // This is a simple visualization. In a real app, you'd use a proper
    // mindmap library like vis.js, d3.js, or react-flow
    const renderSimpleMindmap = () => {
      const container = canvasRef.current;
      if (!container) return;

      container.innerHTML = '';
      
      // Create root node
      const rootElement = document.createElement('div');
      rootElement.className = 'bg-blue-100 text-blue-900 font-semibold px-4 py-2 rounded-lg text-center mx-auto w-fit mb-8';
      rootElement.textContent = data.text;
      container.appendChild(rootElement);
      
      // Create first level connections
      const connectionsContainer = document.createElement('div');
      connectionsContainer.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
      
      if (data.children) {
        data.children.forEach(child => {
          const childContainer = document.createElement('div');
          childContainer.className = 'flex flex-col items-center';
          
          // Child node
          const childElement = document.createElement('div');
          childElement.className = 'bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg text-center mb-4 w-full font-medium';
          childElement.textContent = child.text;
          childContainer.appendChild(childElement);
          
          // Sub-children
          if (child.children && child.children.length > 0) {
            const subList = document.createElement('ul');
            subList.className = 'text-sm space-y-2 w-full';
            
            child.children.forEach(subChild => {
              const listItem = document.createElement('li');
              listItem.className = 'bg-gray-50 text-gray-700 px-2 py-1 rounded border border-gray-100 text-center';
              listItem.textContent = subChild.text;
              subList.appendChild(listItem);
            });
            
            childContainer.appendChild(subList);
          }
          
          connectionsContainer.appendChild(childContainer);
        });
      }
      
      container.appendChild(connectionsContainer);
    };

    renderSimpleMindmap();
  }, [data]);

  return (
    <Card className="w-full h-full shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
          <CardDescription>Visual representation of key concepts</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleDownload} 
          aria-label="Download mindmap"
          title="Download mindmap as text file"
        >
          <Download className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div 
          ref={canvasRef} 
          className="w-full min-h-[300px] p-4 rounded-lg"
        />
      </CardContent>
    </Card>
  );
};

export default Mindmap;
