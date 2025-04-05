import { apiUrl } from "@/schemas/env";
import { cookies } from "next/headers";
import { objectToUrlParams } from "./utils";

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export default class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = apiUrl;
  }

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    // Get token from cookies instead of localStorage
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

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
      // Add cache settings for Next.js
      cache: method === "GET" ? "force-cache" : "no-store",
      next: { tags: [endpoint] },
    });

    // Handle 401 Unauthorized - could trigger redirect in a different way
    // since we're in a server component we need to handle redirects differently
    if (response.status === 401) {
      // Instead of directly redirecting, we'll throw an error that can be caught
      // by the caller to handle redirects appropriately
      throw new Error("UNAUTHORIZED");
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

// For server actions
export async function createServerApiClient() {
  "use server";
  return new ApiClient();
}

// For client components that need to call server actions
export async function fetchFromApi<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  "use server";
  const api = new ApiClient();
  return api.request<T>(endpoint, options);
}

// Export methods for common HTTP requests as server actions
export async function getFromApi<T>(
  endpoint: string,
  headers?: Record<string, string>
): Promise<T> {
  "use server";
  const api = new ApiClient();
  return api.get<T>(endpoint, headers);
}

export async function postToApi<T>(
  endpoint: string,
  data: any,
  headers?: Record<string, string>
): Promise<T> {
  "use server";
  const api = new ApiClient();
  return api.post<T>(endpoint, data, headers);
}

export async function putToApi<T>(
  endpoint: string,
  data: any,
  headers?: Record<string, string>
): Promise<T> {
  "use server";
  const api = new ApiClient();
  return api.put<T>(endpoint, data, headers);
}

export async function patchToApi<T>(
  endpoint: string,
  data: any,
  headers?: Record<string, string>
): Promise<T> {
  "use server";
  const api = new ApiClient();
  return api.patch<T>(endpoint, data, headers);
}

export async function deleteFromApi<T>(
  endpoint: string,
  headers?: Record<string, string>
): Promise<T> {
  "use server";
  const api = new ApiClient();
  return api.delete<T>(endpoint, headers);
}

export async function getWithParams<T>(
  endpoint: string,
  params: Record<string, any> = {},
  headers?: Record<string, string>
): Promise<T> {
  const queryString = objectToUrlParams(params);
  return getFromApi(`${endpoint}${queryString}`, headers);
}
