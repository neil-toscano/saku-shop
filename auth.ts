import NextAuth, { DefaultSession } from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";

import { ZodError } from "zod";
import { signInSchema } from "@/lib/zod";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string;
  }

  interface Session {
    user: {
      /** The user's postal address. */
      id: string;
      image?: string;
      role: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id: string;
    role: string;
    image?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          //buscar correo
          const user = await prisma.user.findFirst({
            where: {
              email: email.toLocaleLowerCase(),
            },
          });

          if (!user) return null;
          //compara password
          const isCorrectPassword = bcrypt.compareSync(password, user.password);

          if (!isCorrectPassword) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image ?? undefined,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
          return null;
        }
      },
    }),
  ],
});
