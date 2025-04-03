// lib/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import { AuthResponse, User } from "@/schemas/auth";
// Type for your API response
import { apiUrl } from "@/schemas/env";

// Function to log in a user
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse | null> {
  try {
    const response = await fetch(`${apiUrl}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to login");
    }

    const data: AuthResponse = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

// Set auth cookie
export const setAuthCookie = async (token: string) => {};

// Get auth token from cookie
export const getAuthToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value;
};

// Clear auth cookie on logout
export const clearAuthCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
};

// Helper to check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// Middleware to protect API routes
export function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      // You can optionally verify the token here if needed
      return await handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: "Invalid authentication" });
    }
  };
}

// Function to get authenticated user data
export async function getAuthenticatedUser(): Promise<User | null> {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${process.env.API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
