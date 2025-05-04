
import Summary from '@/components/Summary';
import PDFViewer from '@/components/PDFViewer';
import PanelContainer from '@/components/panels/PanelContainer';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSummaryModule } from '@/contexts/ModuleContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFileState } from '@/contexts/ModuleContext';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
// ----- ADDED
import { useCustomUpload } from '@/hooks/useCustomUpload';

interface SummaryPanelProps {
  fileTitle: string;
  pageType?: 'pdf' | 'url';
  isPollingSummary?: boolean; // Added prop to receive polling state from parent
}

const SummaryPanel = ({ fileTitle, pageType = 'pdf', isPollingSummary = false }: SummaryPanelProps) => {
  // Use different localStorage keys based on pageType
  const localStorageKey = `summaryPanelActiveTab_${pageType}`;
  
  const getInitialTab = () => {
    const savedTab = localStorage.getItem(localStorageKey);
    return savedTab || "summary";
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab());
  const { processedText, originalText, isLoading, error } = useSummaryModule();
  const { currentFile } = useFileState();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Import polling state from hook (for PDF workflow) or use the passed prop (for URL workflow)
  const { isPollingSummary: isPdfPolling } = useCustomUpload();
  // Determine if we're in a polling state from either source
  const isAwaitingResults = isPollingSummary || isPdfPolling;
  
  useEffect(() => {
    localStorage.setItem(localStorageKey, activeTab);
  }, [activeTab, localStorageKey]);

  useEffect(() => {
    if (currentFile && currentFile.type === 'application/pdf') {
      const url = URL.createObjectURL(currentFile);
      setPdfUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [currentFile]);

  const formatSiteTitle = (title: string) => {
    return title
      .replace('URL: ', '')
      .replace('www.', '')
      .split('/')[0]
      .replace(/\.(com|org|net|edu|co|io|dev)$/, '');
  };

  const displayText =
    isAwaitingResults
      ? "Your document is being analyzed. Please wait while we generate your summary..."
      : (processedText || "No summary available. This tab is intentionally blank.");

  const formattedTitle =
    isAwaitingResults && activeTab === "summary"
      ? "Generating Content"
      : formatSiteTitle(fileTitle);

  const getSummaryFormatOptions = () => ({
    fontSize: 'text-base',
    lineHeight: 'leading-relaxed'
  });
  
  const getOriginalFormatOptions = () => ({
    fontSize: 'text-sm',
    lineHeight: 'leading-normal'
  });

  const renderURLPreview = (url: string) => {
    return (
      <div className="h-full flex flex-col items-center justify-start p-4 space-y-4">
        <div className="w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-white">
          <iframe 
            src={url}
            className="w-full h-full"
            title="Website Preview"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={() => window.open(url, '_blank')}
        >
          Visit Website
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <PanelContainer
      isPending={isAwaitingResults || isLoading}
      loadingTitle={isAwaitingResults && activeTab === "summary" ? "Generating Content" : "Processing document"}
      loadingDescription={isAwaitingResults
        ? "Your document is being analyzed. Please wait while we generate your summary."
        : "Your document is being analyzed. This may take a moment."
      }
      error={error}
    >
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full h-full"
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="summary" className="apple-tabs-trigger">Summary</TabsTrigger>
          <TabsTrigger value="original" className="apple-tabs-trigger">Original</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="h-[calc(100%-3rem)] overflow-hidden">
          <Summary 
            title={formattedTitle} 
            text={displayText}
            layout="text-only"
            forceOriginalView={false}
            key={`summary-${processedText ? Date.now() : 'blank'}`}
            isRawData={false}
            textFormatOptions={getSummaryFormatOptions()}
            renderAs="prepdeck"
          />
        </TabsContent>
        
        <TabsContent value="original" className="h-[calc(100%-3rem)] overflow-hidden document-viewer">
          {currentFile && currentFile.type === 'application/pdf' ? (
            <PDFViewer fileUrl={pdfUrl} className="w-full h-full" />
          ) : currentFile && currentFile.name.startsWith('URL:') ? (
            renderURLPreview(originalText || '')
          ) : (
            <Summary 
              title={formattedTitle}
              text={originalText || "No original text available. This tab is intentionally blank."}
              layout="text-only"
              forceOriginalView={true}
              key={`original-${originalText ? Date.now() : 'blank'}`}
              isRawData={true}
              textFormatOptions={getOriginalFormatOptions()}
              renderAs="prepdeck"
            />
          )}
        </TabsContent>
      </Tabs>
    </PanelContainer>
  );
};

export default SummaryPanel;
