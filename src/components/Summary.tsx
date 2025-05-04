import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface FormattingOptions {
  fontSize?: string;
  lineHeight?: string;
}

interface SummaryProps {
  text: string;
  title: string;
  original?: string;
  videoUrl?: string;
  layout?: 'default' | 'text-only';
  forceOriginalView?: boolean;
  isRawData?: boolean;
  textFormatOptions?: FormattingOptions;
  renderAs?: 'markdown' | 'prepdeck';
}

const Summary = ({ 
  text, 
  title, 
  original, 
  videoUrl, 
  layout = 'default', 
  forceOriginalView = false,
  isRawData = false,
  textFormatOptions,
  renderAs = 'markdown'
}: SummaryProps) => {
  const [formattedText, setFormattedText] = useState<React.ReactNode>(null);
  const [formattedOriginal, setFormattedOriginal] = useState<React.ReactNode>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const formatOptions: FormattingOptions = {
    fontSize: textFormatOptions?.fontSize || 'text-sm',
    lineHeight: textFormatOptions?.lineHeight || 'leading-snug'
  };

  useEffect(() => {
    if (text) {
      if (renderAs === 'prepdeck') {
        setFormattedText(renderPrepDeckMarkdown(text));
      } else {
        setFormattedText(formatMarkdownText(text, formatOptions));
      }
    }
    
    if (original) {
      if (renderAs === 'prepdeck') {
        setFormattedOriginal(renderPrepDeckMarkdown(original));
      } else {
        setFormattedOriginal(formatMarkdownText(original, formatOptions));
      }
    }
  }, [text, original, formatOptions, renderAs]);

  const handleCopy = () => {
    navigator.clipboard.writeText(forceOriginalView && original ? original : text);
    toast.success(`${forceOriginalView ? 'Original' : 'Simplified'} content copied to clipboard`);
  };

  const handleDownload = async () => {
    if (!contentRef.current) return;

    try {
      toast.info("Generating PDF, please wait...");
      
      const contentElement = contentRef.current;
      const canvas = await html2canvas(contentElement, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true
      });
      
      const contentWidth = canvas.width;
      const contentHeight = canvas.height;
      
      // A4 dimensions in pts (595.28 x 841.89)
      const pdf = new jsPDF({
        orientation: contentWidth > contentHeight ? 'landscape' : 'portrait',
        unit: 'pt',
        format: 'a4'
      });
      
      // Calculate pdf width and height
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate scaling ratio to fit content in PDF
      const ratio = Math.min(pdfWidth / contentWidth, pdfHeight / contentHeight);
      const scaledWidth = contentWidth * ratio;
      const scaledHeight = contentHeight * ratio;
      
      // Center content in PDF
      const x = (pdfWidth - scaledWidth) / 2;
      const y = (pdfHeight - scaledHeight) / 2;
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
      
      // Save the PDF
      const pdfFileName = `${title.toLowerCase().replace(/\s+/g, '-')}-${forceOriginalView ? 'original' : 'simplified'}.pdf`;
      pdf.save(pdfFileName);
      
      toast.success(`PDF downloaded successfully`);
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const isInTitleCase = (text: string): boolean => {
    if (!text || text.length < 3) return false;
    
    const words = text.split(' ');
    // Check if most words (especially longer ones) start with a capital letter
    const significantWords = words.filter(word => word.length > 3);
    const capitalizedWords = significantWords.filter(word => 
      /^[A-Z]/.test(word)
    );
    
    return capitalizedWords.length > 0 && 
           (capitalizedWords.length / significantWords.length) >= 0.6;
  };

  const formatMarkdownText = (text: string, options: FormattingOptions) => {
    if (!text) return '';
    
    // Remove file name lines at the beginning
    const textWithoutFilename = text.replace(/^.+\.pdf\s*$/m, '').trim();
    
    // Split text into lines
    const lines = textWithoutFilename.split('\n');
    const result: React.ReactNode[] = [];
    
    let i = 0;
    
    while (i < lines.length) {
      let line = lines[i].trim();
      
      // Skip empty lines but add spacing for layout
      if (line === '') {
        result.push(<div key={`empty-${i}`} className="h-4"></div>);
        i++;
        continue;
      }
      
      // 1. Strip any hash marks
      line = line.replace(/^#+\s*/, '');
      
      // 2. Detect headings - standalone lines in Title Case
      if (isInTitleCase(line) && line.length < 100 && 
          (i === 0 || lines[i-1].trim() === '') && 
          (i === lines.length - 1 || lines[i+1].trim() === '')) {
        result.push(
          <div key={`heading-${i}`} className="my-4">
            <p className="text-xl font-normal">{line}</p>
          </div>
        );
        i++;
        continue;
      }
      
      // 3. Check for subtitle followed by paragraph
      if (isInTitleCase(line) && !line.endsWith('.') && 
          i < lines.length - 1 && lines[i+1].trim() !== '') {
        const nextLine = lines[i+1].trim();
        result.push(
          <div key={`subtitle-para-${i}`} className="mb-4">
            <p className={`text-gray-800 ${options.lineHeight} ${options.fontSize}`}>
              {line}
              <br />
              {nextLine}
            </p>
          </div>
        );
        i += 2; // Skip both the subtitle and the next line
        continue;
      }
      
      // 4. Handle lists - Only lines starting with "-" become list items
      if (line.startsWith('-')) {
        const listItems = [];
        // Collect consecutive list items
        while (i < lines.length && lines[i].trim().startsWith('-')) {
          let listItemText = lines[i].trim().substring(1).trim();
          
          // Check for nested lists (indented by 2+ spaces)
          const indentMatch = lines[i].match(/^(\s+)-/);
          const isNested = indentMatch && indentMatch[1].length >= 2;
          
          listItems.push(
            <li key={`li-${i}`} className={`${isNested ? 'ml-4' : ''} ${options.lineHeight} mb-2`}>
              {listItemText}
            </li>
          );
          i++;
        }
        
        result.push(
          <div key={`list-wrapper-${i}`} className="my-4">
            <ul className="list-disc space-y-1 pl-6">
              {listItems}
            </ul>
          </div>
        );
        continue;
      }
      
      // 5. Handle labeled points inline (not as list items)
      const labelMatch = line.match(/^([^:]+):(.*)/);
      if (labelMatch) {
        const label = labelMatch[1].trim();
        const description = labelMatch[2].trim();
        
        result.push(
          <p key={`labeled-${i}`} className={`mb-4 text-gray-800 ${options.lineHeight} ${options.fontSize}`}>
            <span className="font-semibold">{label}:</span> {description}
          </p>
        );
        i++;
        continue;
      }
      
      // 6. Default: Regular paragraph
      result.push(
        <p key={`p-${i}`} className={`mb-4 text-gray-800 ${options.lineHeight} ${options.fontSize}`}>
          {line}
        </p>
      );
      i++;
    }
    
    return result;
  };

  const renderPrepDeckMarkdown = (markdown: string): React.ReactNode => {
    if (!markdown) return null;
    
    // Split the markdown into sections based on top-level headings
    const sections = markdown.split(/^# /m).filter(Boolean);
    
    if (sections.length === 0) {
      // If no sections found, treat the whole markdown as one section
      sections.push(markdown);
    }
    
    return (
      <div className="prepdeck-content">
        {sections.map((section, sectionIndex) => {
          const lines = section.split('\n');
          const result: React.ReactNode[] = [];
          let i = 0;
          
          // If this is a section that was split on '# ', the first line is a heading
          const firstLine = lines[0]?.trim();
          const isFirstLineHeading = sectionIndex > 0 || firstLine.startsWith('# ') || firstLine.startsWith('## ');
          
          if (isFirstLineHeading) {
            if (firstLine.startsWith('## ')) {
              result.push(
                <h2 key={`h2-${sectionIndex}`} className="prepdeck-subtitle">
                  {firstLine.replace(/^## /, '')}
                </h2>
              );
            } else {
              result.push(
                <h1 key={`h1-${sectionIndex}`} className="prepdeck-title">
                  {firstLine.replace(/^# /, '')}
                </h1>
              );
            }
            i = 1; // Skip the first line as we've processed it
          }
          
          // Process the rest of the lines
          while (i < lines.length) {
            const line = lines[i].trim();
            
            // Skip empty lines but keep track for paragraph separation
            if (line === '') {
              i++;
              continue;
            }
            
            // Check for secondary headings (##)
            if (line.startsWith('## ')) {
              result.push(
                <h2 key={`h2-${sectionIndex}-${i}`} className="prepdeck-subtitle">
                  {line.replace(/^## /, '')}
                </h2>
              );
              i++;
              continue;
            }
            
            // Check for list items
            if (line.startsWith('- ')) {
              const listItems: React.ReactNode[] = [];
              
              // First, check if this is a labeled list (ends with colon)
              if (line.includes(':') && line.trim().endsWith(':')) {
                const labelText = line.substring(2); // Remove the "- "
                result.push(
                  <p key={`label-${sectionIndex}-${i}`}>{labelText}</p>
                );
                i++;
                
                // Collect the sublist items
                const sublistItems: React.ReactNode[] = [];
                while (i < lines.length && lines[i].trim().startsWith('- ')) {
                  sublistItems.push(
                    <li key={`subli-${sectionIndex}-${i}`}>
                      {lines[i].trim().substring(2)} {/* Remove the "- " */}
                    </li>
                  );
                  i++;
                }
                
                if (sublistItems.length > 0) {
                  result.push(
                    <ul key={`sublist-${sectionIndex}-${i}`} className="prepdeck-sublist">
                      {sublistItems}
                    </ul>
                  );
                }
                continue;
              }
              
              // Regular list (not labeled)
              while (i < lines.length && lines[i].trim().startsWith('- ')) {
                listItems.push(
                  <li key={`li-${sectionIndex}-${i}`}>
                    {lines[i].trim().substring(2)} {/* Remove the "- " */}
                  </li>
                );
                i++;
              }
              
              result.push(
                <ul key={`list-${sectionIndex}-${i}`} className="prepdeck-list">
                  {listItems}
                </ul>
              );
              continue;
            }
            
            // Regular paragraph (collect consecutive lines)
            let paragraphText = line;
            i++;
            
            while (i < lines.length && lines[i].trim() !== '' && 
                   !lines[i].trim().startsWith('# ') && 
                   !lines[i].trim().startsWith('## ') && 
                   !lines[i].trim().startsWith('- ')) {
              paragraphText += ' ' + lines[i].trim();
              i++;
            }
            
            result.push(
              <p key={`p-${sectionIndex}-${i}`}>{paragraphText}</p>
            );
          }
          
          return (
            <section key={`section-${sectionIndex}`} className="prepdeck-module">
              {result}
            </section>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="w-full h-full shadow-sm border border-gray-200 overflow-hidden animate-fade-in flex flex-col">
      <CardHeader className="pb-2 flex flex-row items-center justify-between shrink-0">
        <div>
          <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCopy} 
            aria-label="Copy text"
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDownload} 
            aria-label="Download as PDF"
            title="Download as PDF"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="text-left p-0 flex-grow overflow-hidden">
        <ScrollArea className="h-full max-h-[calc(100vh-8rem)] pr-4 pb-4 pl-6">
          <div className={`${renderAs !== 'prepdeck' ? 'prose prose-sm max-w-none pt-2' : 'pt-2'}`} ref={contentRef}>
            {forceOriginalView && original ? (
              renderAs === 'prepdeck' ? (
                formattedOriginal
              ) : (
                <div className={`text-gray-700 ${formatOptions.lineHeight} space-y-2`}>
                  {formattedOriginal}
                </div>
              )
            ) : isRawData && forceOriginalView ? (
              renderAs === 'prepdeck' ? (
                formattedText
              ) : (
                <div className={`text-gray-700 ${formatOptions.lineHeight} space-y-2`}>
                  {formattedText}
                </div>
              )
            ) : (
              renderAs === 'prepdeck' ? (
                formattedText
              ) : (
                <div className={`text-gray-700 ${formatOptions.lineHeight} space-y-2`}>
                  {formattedText}
                </div>
              )
            )}
            
            {layout === 'default' && videoUrl && (
              <div className="mt-6 mb-6">
                <h3 className="text-lg font-medium mb-2">Video Summary</h3>
                <div className="aspect-video rounded overflow-hidden">
                  <iframe 
                    src={videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video Summary"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Summary;
