import type { NextAuthConfig } from "next-auth";

const protectedRoutes = ["/orders", "/checkout", "/profile"];
const adminRoutes = ["/admin"];
const authRoutes = ["/auth/login", "/auth/new-account"];

export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 60, // 8 horas
    updateAge: 86400,
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/new-account",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.image = user.image ?? undefined;
        token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.image = token.image;
      session.user.role = token.role;

      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user.role;

      const pathname = nextUrl.pathname;

      //AUTH PAGES
      const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route)
      );
      if (isAuthRoute && isLoggedIn) {
        const redirectUrl = new URL("/", nextUrl);
        return Response.redirect(redirectUrl);
      }

      //admin pages
      const isAdminRoute = adminRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (isAdminRoute) {
        return isLoggedIn && userRole === "admin";
      }

      //PROTECTED PAGES
      const requiresAuth = protectedRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (requiresAuth) {
        return isLoggedIn;
      }
      return true;
    },
  },

  providers: [],
} satisfies NextAuthConfig;
