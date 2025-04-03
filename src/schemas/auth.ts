import { z } from "zod";
export interface AuthResponse {
  token: string;
  admin: User;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  // Add other user properties as needed
}

// Define form schema with Zod
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Must be a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});
export type LoginFormValues = z.infer<typeof loginSchema>;
