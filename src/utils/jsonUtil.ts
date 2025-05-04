/**
 * Safely parse JSON with error handling
 * @param json String to parse
 * @returns Object with result and error
 */
export const safeJSONParse = (json: string) => {
  try {
    const result = JSON.parse(json);
    return { result, error: null };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return { result: null, error: errorMessage };
  }
}; 