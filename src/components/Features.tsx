
import { BrainCircuit, FileText, ListChecks, Repeat, Upload, Globe, FileText as TextSummary } from 'lucide-react';

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature = ({ icon, title, description }: FeatureProps) => (
  <div className="group relative p-6 rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01] hover:border-blue-100">
    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-100">
      {icon}
    </div>
    <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Features = () => {
  // Keep the original feature data and component implementation for backward compatibility
  // We've created a new FeaturesCarousel component for the home page
  const features = [
    {
      icon: <TextSummary className="h-6 w-6" />,
      title: "Text Summaries",
      description: "Convert dense document content into concise, easy-to-understand summaries that highlight key concepts."
    },
    {
      icon: <BrainCircuit className="h-6 w-6" />,
      title: "AI-Powered Analysis",
      description: "Our advanced AI understands context, extracts key information, and generates learning materials instantly."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Smart Cue Cards",
      description: "Automatically generate flashcards from notes, transcripts, or uploads — perfect for bite-sized revision."
    },
    {
      icon: <ListChecks className="h-6 w-6" />,
      title: "Multiple Choice Generator",
      description: "Turn raw content into high-quality multiple-choice questions with explanations, ready for quizzes and practice."
    },
    {
      icon: <Repeat className="h-6 w-6" />,
      title: "Interactive Learning Loops",
      description: "Engage with your content through smart repetition — flip, test, and reinforce understanding with every scroll."
    },
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Upload & Go",
      description: "Drop in your files (PDFs, Word docs, transcripts) and get instant, structured study tools — no formatting needed."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Access Anywhere",
      description: "StudyDeck works across devices, so learners can revise on desktop, tablet, or mobile — whenever inspiration hits."
    }
  ];

  return (
    <section className="section-container">
      <div className="text-center mb-16 animate-fade-in">
        <h2 className="heading-lg text-gray-900 mb-4">Transform How You Study</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our AI-powered tools help you understand, memorize, and master any material with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="animate-fade-in" style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
            <Feature {...feature} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
