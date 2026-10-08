import { useAuth } from '../context/AuthContext.jsx';

/**
 * Helper to check current dev simulation state (loading, error, empty, normal).
 * Supports override via URL query parameter (e.g. ?devState=loading|error|empty)
 */
export function useDevSimulation() {
  let devState = 'normal';

  try {
    const auth = useAuth();
    devState = auth?.devState || 'normal';
  } catch (e) {
    // Fallback if rendered outside AuthProvider
  }

  // URL query parameter takes precedence for granular route testing
  if (typeof window !== 'undefined') {
    const urlParam = new URLSearchParams(window.location.search).get('devState');
    if (urlParam) {
      devState = urlParam;
    }
  }

  return {
    isLoading: devState === 'loading',
    isError: devState === 'error',
    isEmpty: devState === 'empty',
    devState,
  };
}
