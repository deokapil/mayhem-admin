"use server";

import { loginUser } from "@/lib/auth";
import { LoginFormValues } from "@/schemas/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type FormState = { error?: string } | undefined;

export async function loginAction(values: LoginFormValues): Promise<FormState> {
  let redirectUrl = null;
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
    redirectUrl = "/dashboard";
  } catch (err: any) {
    return { error: err.message };
  }
  if (redirectUrl) {
    revalidatePath(redirectUrl);
    redirect(redirectUrl);
  }
}
