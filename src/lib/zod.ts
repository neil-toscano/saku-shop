import * as z from "zod";

export const signInSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be less than 32 characters"),
});

export const SignupFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Name must be at least 2 characters long." }),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .trim()
    .min(8, { error: "Be at least 8 characters long" }),
  // .regex(/[a-zA-Z]/, { error: "Contain at least one letter." }),
  // .regex(/[0-9]/, { error: "Contain at least one number." })
  // .regex(/[^a-zA-Z0-9]/, {
  //   error: "Contain at least one special character.",
  // })
});

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
