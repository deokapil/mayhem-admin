"use server";

import { clearAuthCookie, loginUser } from "@/lib/auth";
import { LoginFormValues } from "@/schemas/auth";
import { cookies } from "next/headers";

type FormState = { error?: string; data?: any } | undefined;

export async function loginAction(values: LoginFormValues): Promise<FormState> {
  try {
    // Use the loginUser function from our auth library
    const authResponse = await loginUser(values.email, values.password);

    if (!authResponse) {
      throw new Error("Invalid credentials");
    }
    console.log(authResponse);

    // Set the auth token cookie
    // setAuthCookie(authResponse.token);
    const cookieStore = await cookies();
    cookieStore.set("auth_token", authResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
      sameSite: "strict",
    });
    return { data: authResponse.admin };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function logoutUser() {
  await clearAuthCookie();
}
