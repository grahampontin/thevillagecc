/**
 * Minimal HTTP helper for API requests.
 * Uses native fetch with JSON handling and error management.
 */

async function handleResponse<T>(response: Response): Promise<T> {
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

  // 204 No Content has no body to parse
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return await response.json() as T;
}

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

  return handleResponse<T>(response);
}

/**
 * Performs a POST request with a JSON body.
 *
 * @param url - The URL to post to
 * @param body - The request body (will be JSON-serialized)
 * @returns Promise resolving to typed JSON response
 */
export async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

/**
 * Performs a PUT request with a JSON body.
 *
 * @param url - The URL to put to
 * @param body - The request body (will be JSON-serialized)
 * @returns Promise resolving to typed JSON response
 */
export async function putJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

/**
 * Performs a DELETE request.
 *
 * @param url - The URL to delete
 */
export async function deleteRequest(url: string): Promise<void> {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  });

  await handleResponse<void>(response);
}
