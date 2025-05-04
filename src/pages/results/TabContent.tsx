import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardsPanel from './CardsPanel';
import QuizPanel from './QuizPanel';
import VideosPanel from './VideosPanel';
import ChatPanel from './ChatPanel';
import ReadPanel from './ReadPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useFileState } from '@/contexts/ModuleContext';

interface TabContentProps {
  fileTitle: string;
}

const TabContent = ({
  fileTitle
}: TabContentProps) => {
  const [activeTab, setActiveTab] = useState("cards");
  const { user } = useAuth();
  const { currentFile } = useFileState();

  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    console.log("Current user:", user?.id);
    console.log("Current file:", currentFile?.name);
    setActiveTab(value);
  };

  // Log active tab for debugging
  useEffect(() => {
    console.log("Active tab is:", activeTab);
  }, [activeTab]);

  return (
    <div className="h-[calc(100vh-8rem)] relative">
      <Tabs defaultValue="cards" onValueChange={handleTabChange} className="w-full h-full flex flex-col">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="cards" className="apple-tabs-trigger">Cards</TabsTrigger>
          <TabsTrigger value="quiz" className="apple-tabs-trigger">Test</TabsTrigger>
          <TabsTrigger value="watch" className="apple-tabs-trigger">Watch</TabsTrigger>
          <TabsTrigger value="read" className="apple-tabs-trigger">Read</TabsTrigger>
          <TabsTrigger value="chat" className="apple-tabs-trigger">Chat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cards" className="mt-0 flex-grow apple-card shadow-sm overflow-hidden">
          <CardsPanel isTabActive={activeTab === "cards"} />
        </TabsContent>
        
        <TabsContent value="quiz" className="mt-0 flex-grow apple-card shadow-sm overflow-hidden">
          <QuizPanel />
        </TabsContent>
        
        <TabsContent value="watch" className="mt-0 flex-grow apple-card shadow-sm overflow-hidden">
          <VideosPanel isTabActive={activeTab === "watch"} />
        </TabsContent>
        
        <TabsContent value="read" className="mt-0 flex-grow apple-card shadow-sm overflow-hidden">
          <ReadPanel isTabActive={activeTab === "read"} />
        </TabsContent>
        
        <TabsContent value="chat" className="mt-0 flex-grow apple-card shadow-sm overflow-hidden">
          <ChatPanel documentTitle={fileTitle} isTabActive={activeTab === "chat"} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabContent;
