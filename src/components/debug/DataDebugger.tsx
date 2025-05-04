import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFileState } from '@/contexts/ModuleContext';
import { createDebugReport } from '@/utils/debugUtils';
import { testAdapter, USE_TEST_DATA_VIDEOS, USE_TEST_DATA_READS } from '@/utils/testAdapter';

interface DataDebuggerProps {
  onClose: () => void;
}

/**
 * DataDebugger provides a comprehensive interface for
 * troubleshooting data issues in the application
 */
const DataDebugger = ({ onClose }: DataDebuggerProps) => {
  const { user } = useAuth();
  const { currentFile } = useFileState();
  const [debugData, setDebugData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [testStatus, setTestStatus] = useState({
    videoTestEnabled: USE_TEST_DATA_VIDEOS,
    readTestEnabled: USE_TEST_DATA_READS,
    useNewVideoFormat: true
  });

  // Run the debug report on mount
  useEffect(() => {
    const runDebugReport = async () => {
      try {
        const report = await createDebugReport(user?.id, currentFile?.name);
        setDebugData(report);
      } catch (error) {
        console.error('Error generating debug report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    runDebugReport();
  }, [user?.id, currentFile?.name]);

  // Toggle test data for videos
  const toggleVideoTestData = () => {
    if (testStatus.videoTestEnabled) {
      // Disable test data
      testAdapter.disableVideoMocks();
      setTestStatus({...testStatus, videoTestEnabled: false});
    } else {
      // Enable test data
      testAdapter.enableVideoMocks().useVideoFormat(testStatus.useNewVideoFormat);
      setTestStatus({...testStatus, videoTestEnabled: true});
    }
  };

  // Toggle video format
  const toggleVideoFormat = () => {
    const newFormat = !testStatus.useNewVideoFormat;
    testAdapter.useVideoFormat(newFormat);
    setTestStatus({...testStatus, useNewVideoFormat: newFormat});
    
    // If video test data is enabled, reload with new format
    if (testStatus.videoTestEnabled) {
      testAdapter.enableVideoMocks().useVideoFormat(newFormat);
    }
  };

  // Toggle test data for read texts
  const toggleReadTestData = () => {
    if (testStatus.readTestEnabled) {
      // Disable test data
      testAdapter.disableReadMocks();
      setTestStatus({...testStatus, readTestEnabled: false});
    } else {
      // Enable test data
      testAdapter.enableReadMocks();
      setTestStatus({...testStatus, readTestEnabled: true});
    }
  };

  // Update component state when global flags change
  useEffect(() => {
    const checkTestStatus = () => {
      if (testStatus.videoTestEnabled !== USE_TEST_DATA_VIDEOS || 
          testStatus.readTestEnabled !== USE_TEST_DATA_READS) {
        setTestStatus({
          ...testStatus,
          videoTestEnabled: USE_TEST_DATA_VIDEOS,
          readTestEnabled: USE_TEST_DATA_READS
        });
      }
    };
    
    // Check status every second
    const interval = setInterval(checkTestStatus, 1000);
    
    return () => clearInterval(interval);
  }, [testStatus]);

  // Tabs for different debug views
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'videos', label: 'Videos' },
    { id: 'reads', label: 'Reads' },
    { id: 'raw', label: 'Raw Data' },
    { id: 'test', label: 'Test Tools' }
  ];

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Gathering debug information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Application Debug Interface</h2>
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={onClose}>
          Close
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-gray-100 border-b">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`px-4 py-2 ${activeTab === tab.id ? 'bg-white border-t border-r border-l -mb-px' : 'hover:bg-gray-200'}`}
              onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-auto p-4">
        {activeTab === 'overview' && debugData && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-medium mb-2">User Information</h3>
                <p>User ID: {debugData.auth.userId}</p>
                <p>Authenticated: {debugData.auth.hasUserId ? 'Yes' : 'No'}</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-medium mb-2">File Information</h3>
                <p>File Name: {debugData.file.fileName}</p>
                <p>File Selected: {debugData.file.hasFileName ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-medium mb-2">Data Summary</h3>
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2">Table</th>
                    <th className="pb-2">Count</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Test Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(debugData.supabase.results).map(([table, data]: [string, any]) => (
                    <tr key={table} className="border-b">
                      <td className="py-2">{table}</td>
                      <td className="py-2">{data.count || 0}</td>
                      <td className="py-2">
                        {data.error ? (
                          <span className="text-red-500">Error: {data.error}</span>
                        ) : data.isEmpty ? (
                          <span className="text-yellow-500">Empty</span>
                        ) : (
                          <span className="text-green-500">OK</span>
                        )}
                      </td>
                      <td className="py-2">
                        {table === 'PDF Video' && testStatus.videoTestEnabled && (
                          <span className="text-purple-500">
                            Test Mode ({testStatus.useNewVideoFormat ? 'New Format' : 'Old Format'})
                          </span>
                        )}
                        {table === 'PDF Read' && testStatus.readTestEnabled && (
                          <span className="text-purple-500">Test Mode</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-medium mb-2">Test Data Status</h3>
              <div className="flex space-x-4">
                <div className={`px-4 py-2 rounded ${testStatus.videoTestEnabled ? 'bg-green-100 border border-green-500' : 'bg-gray-100'}`}>
                  Video Test Data: {testStatus.videoTestEnabled ? 'Enabled' : 'Disabled'}
                  {testStatus.videoTestEnabled && (
                    <span className="ml-2 text-xs text-gray-600">
                      ({testStatus.useNewVideoFormat ? 'Flat Format' : 'YouTube API Format'})
                    </span>
                  )}
                </div>
                <div className={`px-4 py-2 rounded ${testStatus.readTestEnabled ? 'bg-green-100 border border-green-500' : 'bg-gray-100'}`}>
                  Read Test Data: {testStatus.readTestEnabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'videos' && debugData && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-medium mb-2">Videos Data</h3>
              {testStatus.videoTestEnabled ? (
                <div className="bg-purple-50 p-4 rounded border border-purple-300 mb-4">
                  <p className="font-medium">
                    Using test video data ({testStatus.useNewVideoFormat ? 'flat array format' : 'YouTube API format'}) 
                    instead of real database data.
                  </p>
                  <div className="flex mt-2 space-x-2">
                    <button 
                      className="px-3 py-1 bg-purple-500 text-white text-sm rounded"
                      onClick={toggleVideoTestData}>
                      Disable Test Data
                    </button>
                    <button 
                      className="px-3 py-1 bg-gray-500 text-white text-sm rounded"
                      onClick={toggleVideoFormat}>
                      Switch to {testStatus.useNewVideoFormat ? 'YouTube API Format' : 'Flat Array Format'}
                    </button>
                  </div>
                </div>
              ) : null}
              {!testStatus.videoTestEnabled && debugData.supabase.results['PDF Video']?.isEmpty ? (
                <div className="bg-yellow-50 p-4 rounded border border-yellow-300">
                  <p>No video data found for this user and file.</p>
                  <p className="mt-2">Expected query parameters:</p>
                  <ul className="list-disc pl-6 mt-1">
                    <li>User_ID: {debugData.auth.userId}</li>
                    <li>File Name: {debugData.file.fileName}</li>
                  </ul>
                  <div className="mt-4 flex flex-col space-y-2">
                    <button 
                      className="px-3 py-1 bg-yellow-500 text-white text-sm rounded"
                      onClick={() => {
                        setTestStatus({...testStatus, useNewVideoFormat: true});
                        testAdapter.useVideoFormat(true);
                        toggleVideoTestData();
                      }}>
                      Use Test Data (Flat Format)
                    </button>
                    <button 
                      className="px-3 py-1 bg-yellow-500 text-white text-sm rounded"
                      onClick={() => {
                        setTestStatus({...testStatus, useNewVideoFormat: false});
                        testAdapter.useVideoFormat(false);
                        toggleVideoTestData();
                      }}>
                      Use Test Data (YouTube API Format)
                    </button>
                  </div>
                </div>
              ) : !testStatus.videoTestEnabled && debugData.supabase.results['PDF Video']?.error ? (
                <div className="bg-red-50 p-4 rounded border border-red-300">
                  <p>Error retrieving videos: {debugData.supabase.results['PDF Video'].error}</p>
                  <div className="mt-4 flex flex-col space-y-2">
                    <button 
                      className="px-3 py-1 bg-yellow-500 text-white text-sm rounded"
                      onClick={() => {
                        setTestStatus({...testStatus, useNewVideoFormat: true});
                        testAdapter.useVideoFormat(true);
                        toggleVideoTestData();
                      }}>
                      Use Test Data (Flat Format)
                    </button>
                    <button 
                      className="px-3 py-1 bg-yellow-500 text-white text-sm rounded"
                      onClick={() => {
                        setTestStatus({...testStatus, useNewVideoFormat: false});
                        testAdapter.useVideoFormat(false);
                        toggleVideoTestData();
                      }}>
                      Use Test Data (YouTube API Format)
                    </button>
                  </div>
                </div>
              ) : !testStatus.videoTestEnabled ? (
                <div>
                  <p className="mb-2">Found {debugData.supabase.results['PDF Video'].count} record(s)</p>
                  <div className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                    <pre>{JSON.stringify(debugData.supabase.results['PDF Video'].sample, null, 2)}</pre>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {activeTab === 'reads' && debugData && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-medium mb-2">Academic Readings Data</h3>
              {testStatus.readTestEnabled ? (
                <div className="bg-purple-50 p-4 rounded border border-purple-300 mb-4">
                  <p className="font-medium">Using test academic reading data instead of real database data.</p>
                  <button 
                    className="mt-2 px-3 py-1 bg-purple-500 text-white text-sm rounded"
                    onClick={toggleReadTestData}>
                    Disable Test Data
                  </button>
                </div>
              ) : null}
              {!testStatus.readTestEnabled && debugData.supabase.results['PDF Read']?.isEmpty ? (
                <div className="bg-yellow-50 p-4 rounded border border-yellow-300">
                  <p>No academic reading data found for this user and file.</p>
                  <p className="mt-2">Expected query parameters:</p>
                  <ul className="list-disc pl-6 mt-1">
                    <li>User_ID: {debugData.auth.userId}</li>
                    <li>File Name: {debugData.file.fileName}</li>
                  </ul>
                  <button 
                    className="mt-4 px-3 py-1 bg-yellow-500 text-white text-sm rounded"
                    onClick={toggleReadTestData}>
                    Use Test Data Instead
                  </button>
                </div>
              ) : !testStatus.readTestEnabled && debugData.supabase.results['PDF Read']?.error ? (
                <div className="bg-red-50 p-4 rounded border border-red-300">
                  <p>Error retrieving academic readings: {debugData.supabase.results['PDF Read'].error}</p>
                  <button 
                    className="mt-4 px-3 py-1 bg-yellow-500 text-white text-sm rounded"
                    onClick={toggleReadTestData}>
                    Use Test Data Instead
                  </button>
                </div>
              ) : !testStatus.readTestEnabled ? (
                <div>
                  <p className="mb-2">Found {debugData.supabase.results['PDF Read'].count} record(s)</p>
                  <div className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
                    <pre>{JSON.stringify(debugData.supabase.results['PDF Read'].sample, null, 2)}</pre>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {activeTab === 'raw' && debugData && (
          <div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-medium mb-2">Raw Debug Data</h3>
              <div className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-[calc(100vh-12rem)]">
                <pre>{JSON.stringify(debugData, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'test' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-medium mb-2">Test Tools</h3>
              <p className="mb-4">These tools allow you to use test data to verify component rendering.</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Video Test Data</h4>
                  <p className="mb-2 text-sm">When enabled, the Watch tab will use sample video data instead of real data.</p>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-medium mb-2">Video Data Format</h5>
                    <div className="flex space-x-2 mb-3">
                      <button
                        className={`px-3 py-1 rounded-full text-xs ${testStatus.useNewVideoFormat ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => {
                          setTestStatus({...testStatus, useNewVideoFormat: true});
                          testAdapter.useVideoFormat(true);
                        }}>
                        Flat Array Format
                      </button>
                      <button
                        className={`px-3 py-1 rounded-full text-xs ${!testStatus.useNewVideoFormat ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => {
                          setTestStatus({...testStatus, useNewVideoFormat: false});
                          testAdapter.useVideoFormat(false);
                        }}>
                        YouTube API Format
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <button
                      className={`px-4 py-2 rounded ${testStatus.videoTestEnabled ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                      onClick={toggleVideoTestData}>
                      {testStatus.videoTestEnabled ? 'Disable Video Test Data' : 'Enable Video Test Data'}
                    </button>
                    {testStatus.videoTestEnabled && (
                      <span className="ml-2 text-green-500">
                        ✓ Active - {testStatus.useNewVideoFormat ? 'Using flat array format' : 'Using YouTube API format'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Academic Reading Test Data</h4>
                  <p className="mb-2 text-sm">When enabled, the Read tab will use sample scholarly article data instead of real data.</p>
                  <div className="flex items-center">
                    <button
                      className={`px-4 py-2 rounded ${testStatus.readTestEnabled ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                      onClick={toggleReadTestData}>
                      {testStatus.readTestEnabled ? 'Disable Read Test Data' : 'Enable Read Test Data'}
                    </button>
                    {testStatus.readTestEnabled && (
                      <span className="ml-2 text-green-500">✓ Active - Reload Read tab to see test articles</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded">
                  <h4 className="font-medium mb-2">How to Use Test Data</h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Select the video format you want to use for testing (flat array or YouTube API format).</li>
                    <li>Enable the test data mode for videos and/or academic readings.</li>
                    <li>Close this debug panel.</li>
                    <li>Navigate to the Watch or Read tab.</li>
                    <li>The component should now display the test data instead of actual database data.</li>
                    <li>Return to this panel anytime to disable test data when finished.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataDebugger; 