/**
 * API configuration.
 *
 * In development (CRA dev server), we typically call relative `/api/...` and let
 * `src/setupProxy.js` forward to the backend.
 *
 * In production (Static Web Apps), there is no dev proxy, so you must provide
 * an absolute API base URL via `REACT_APP_API_BASE_URL`.
 */

/**
 * Base URL for the backend API.
 *
 * - When set (recommended for production), requests become: `${baseUrl}/api/...`
 * - When unset, requests remain relative: `/api/...` (works with the CRA dev proxy)
 */
export const API_BASE_URL: string = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/+$/, '');

/**
 * Builds a full API URL for an endpoint path.
 *
 * @param path e.g. '/api/Players'
 */
export function apiUrl(path: string): string {
  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  // In Jest/unit tests we always prefer relative URLs so fetch can be mocked
  // without needing to know the production host.
  if (process.env.NODE_ENV === 'test') {
    return path;
  }

  // If API_BASE_URL includes a path (e.g. https://example.com/backend), preserve it.
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}
