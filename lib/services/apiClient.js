import { useAuthStore } from "@/lib/store/AuthStore";

/**
 * Base fetch wrapper that automatically attaches the access token from Zustand
 */
export async function apiClient(endpoint, options = {}) {
  const { body, headers, method = "GET", ...customConfig } = options;

  // 1. Get the current token from Zustand store
  const session = useAuthStore.getState().session;
  const token = session?.access_token;

  // 2. Set default headers
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  // 3. Serialize object bodies to JSON string
  const formattedBody =
    body && typeof body !== "string" ? JSON.stringify(body) : body;

  const config = {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...(formattedBody ? { body: formattedBody } : {}),
    ...customConfig,
  };

  try {
    const response = await fetch(endpoint, config);

    // Safely attempt to parse JSON
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        data: null,
        error: data?.error || data?.message || `Error ${response.status}: Request failed`,
        status: response.status,
      };
    }

    return {
      data: data?.data ?? data,
      error: null,
      status: response.status,
    };
  } catch (err) {
    return {
      data: null,
      error: err?.message || "Network request failed",
      status: 500,
    };
  }
}

// ── Shorthand Convenience Methods ──
apiClient.get = (endpoint, options) =>
  apiClient(endpoint, { ...options, method: "GET" });

apiClient.post = (endpoint, body, options) =>
  apiClient(endpoint, { ...options, method: "POST", body });

apiClient.put = (endpoint, body, options) =>
  apiClient(endpoint, { ...options, method: "PUT", body });

apiClient.delete = (endpoint, options) =>
  apiClient(endpoint, { ...options, method: "DELETE" });