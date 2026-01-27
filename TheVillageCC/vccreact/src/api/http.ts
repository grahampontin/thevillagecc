/**
 * Minimal HTTP helper for API requests.
 * Uses native fetch with JSON handling and error management.
 */

/**
 * Performs a GET request and returns JSON response.
 * 
 * @param url - The URL to fetch
 * @param init - Optional fetch init options
 * @returns Promise resolving to typed JSON response
 * @throws Error with status/statusText/body snippet if response is not ok
 */
export async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Accept': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    // Best effort to read response body for error details
    let bodySnippet = '';
    try {
      bodySnippet = await response.text();
      // Limit body snippet to 200 chars to avoid huge error messages
      if (bodySnippet.length > 200) {
        bodySnippet = bodySnippet.substring(0, 200) + '...';
      }
    } catch (e) {
      // Ignore errors reading body
    }

    const errorMessage = `HTTP ${response.status} ${response.statusText}${bodySnippet ? ': ' + bodySnippet : ''}`;
    throw new Error(errorMessage);
  }

  return await response.json() as T;
}
