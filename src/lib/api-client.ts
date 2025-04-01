interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export default class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "http://your-rails-api.com/api/v1") {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    // Get token from localStorage
    const token = localStorage.getItem("token");

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add authorization header if token exists
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle 401 Unauthorized - could trigger logout
    if (response.status === 401) {
      // You might want to redirect to login or refresh token
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "API request failed");
    }

    // For endpoints that don't return JSON
    if (response.headers.get("Content-Type")?.includes("application/json")) {
      return await response.json();
    }

    return {} as T;
  }

  // Helper methods for common HTTP methods
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { headers });
  }

  async post<T>(
    endpoint: string,
    data: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body: data, headers });
  }

  async put<T>(
    endpoint: string,
    data: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body: data, headers });
  }

  async patch<T>(
    endpoint: string,
    data: any,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", body: data, headers });
  }

  async delete<T>(
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", headers });
  }
}

// Create and export a singleton instance
export const api = new ApiClient();
