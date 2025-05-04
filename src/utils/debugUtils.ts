import { supabase } from '@/integrations/supabase/client';

// Enable to turn on all debug logging
const DEBUG_MODE = true;

/**
 * Enhanced console logging with type and source information
 */
export const debugLog = (
  type: 'info' | 'warn' | 'error',
  source: string,
  message: string,
  data?: any
) => {
  if (!DEBUG_MODE) return;
  
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}][${type.toUpperCase()}][${source}]`;
  
  switch (type) {
    case 'info':
      console.log(`${prefix} ${message}`, data || '');
      break;
    case 'warn':
      console.warn(`${prefix} ${message}`, data || '');
      break;
    case 'error':
      console.error(`${prefix} ${message}`, data || '');
      break;
  }
};

/**
 * Check Supabase tables for the presence of data
 */
export const checkSupabaseData = async (
  userId: string | undefined,
  fileName: string | undefined
) => {
  if (!userId || !fileName) {
    debugLog('error', 'checkSupabaseData', 'Missing userId or fileName', { userId, fileName });
    return {
      error: 'Missing userId or fileName',
      queries: {},
      results: {}
    };
  }
  
  const results: Record<string, any> = {};
  const queries: Record<string, any> = {};
  
  // Tables to check - type-safe table names
  type TableName = 'PDF Video' | 'PDF Read' | 'PDF Quiz' | 'PDF Cards' | 'PDF Summary';
  const tables: TableName[] = [
    'PDF Video',
    'PDF Read',
    'PDF Quiz',
    'PDF Cards',
    'PDF Summary'
  ];
  
  for (const table of tables) {
    try {
      // Store query parameters for debugging
      queries[table] = {
        table,
        userId,
        fileName
      };
      
      // Run the actual query
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('User_ID', userId)
        .eq('File Name', fileName);
      
      if (error) {
        results[table] = { error: error.message };
      } else {
        results[table] = {
          count: data?.length || 0,
          isEmpty: !data || data.length === 0,
          sample: data && data.length > 0 ? data[0] : null
        };
      }
    } catch (e) {
      results[table] = { error: e instanceof Error ? e.message : String(e) };
    }
  }
  
  // Log the comprehensive results
  debugLog('info', 'checkSupabaseData', 'Completed data check', { queries, results });
  
  return {
    queries,
    results,
    timestamp: new Date().toISOString()
  };
};

/**
 * Component debugging helper
 */
export const debugComponent = (
  componentName: string,
  props: Record<string, any>,
  state: Record<string, any> = {}
) => {
  if (!DEBUG_MODE) return;
  
  debugLog('info', componentName, 'Render', {
    props,
    state,
    timestamp: new Date().toISOString()
  });
};

/**
 * Create a debug panel component with data diagnosis
 */
export const createDebugReport = async (userId?: string, fileName?: string) => {
  const report = {
    browser: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      }
    },
    auth: {
      hasUserId: !!userId,
      userId: userId || 'not available',
    },
    file: {
      hasFileName: !!fileName,
      fileName: fileName || 'not available',
    },
    supabase: await checkSupabaseData(userId, fileName),
    timestamp: new Date().toISOString()
  };
  
  debugLog('info', 'createDebugReport', 'Debug report generated', report);
  return report;
};

// Default export for convenience
export default {
  debugLog,
  checkSupabaseData,
  debugComponent,
  createDebugReport
}; 