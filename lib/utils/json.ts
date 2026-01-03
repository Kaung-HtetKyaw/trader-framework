/**
 * Escapes control characters in a string for safe JSON parsing
 * @param str - String to clean
 * @returns String with escaped control characters
 */
export function escapeControlCharacters(str: string): string {
  return str
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Safely parses JSON string with fallback to original string if parsing fails
 * @param data - String to parse as JSON
 * @returns Parsed JSON object or original string if parsing fails
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeJsonParse<T = any>(data: string): T | string {
  try {
    return JSON.parse(data) as T;
  } catch {
    // If parsing fails, return the raw string
    return data;
  }
}