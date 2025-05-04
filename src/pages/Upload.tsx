import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import UrlUpload from '@/components/upload/UrlUpload';

const Upload = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="relative pt-6">
          <div className="gradient-bg min-h-[30vh] flex items-center overflow-hidden">
            <div className="section-container py-6 md:py-10">
              <div className="apple-card p-6 sm:p-10 shadow-lg apple-appear apple-appear-delay-2">
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold apple-appear">
                    Upload Content
                  </h1>
                  <p className="apple-appear apple-appear-delay-1 max-w-2xl mx-auto mt-4 mb-4 text-gray-500">
                    Upload a PDF document or process a website URL.
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-stretch">
                  <div className="flex-1 flex flex-col">
                    <FileUpload />
                  </div>
                  {/* URL upload temporarily hidden for troubleshooting
                  <div className="flex-1 flex flex-col">
                    <UrlUpload />
                  </div>
                  */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Upload;
