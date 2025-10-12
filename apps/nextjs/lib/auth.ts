import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginSchema } from "@/features/auth/validations/schemas";

interface User {
  id: string;
  email: string;
  fullName: string;
  pictureUrl?: string;
  userId: number;
}

interface AuthError extends Error {
  statusCode?: number;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Validate input format
          const validatedFields = loginSchema.parse({
            email: credentials.email,
            password: credentials.password,
          });

          // Call your NestJS backend API for authentication
          const response = await fetch(
            `${process.env.BACKEND_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(validatedFields),
            },
          );

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error("Invalid email or password");
            }
            throw new Error("Authentication failed");
          }

          // Get user details from your backend
          const userResponse = await fetch(
            `${process.env.BACKEND_API_URL}/auth/me`,
            {
              method: "GET",
              headers: {
                Cookie: response.headers.get("set-cookie") || "",
              },
            },
          );

          if (!userResponse.ok) {
            throw new Error("Failed to get user details");
          }

          const userData = await userResponse.json();

          // Transform to NextAuth user format
          const user: User = {
            id: userData.userId,
            email: userData.email,
            fullName: userData.fullName,
            pictureUrl: userData.pictureUrl,
            userId: userData.userId,
          };

          return user;
        } catch (error) {
          console.error("Auth error:", error);
          const authError = error as AuthError;

          if (authError.statusCode === 401) {
            throw new Error("Invalid email or password");
          }

          throw new Error("Authentication failed. Please try again.");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 60 * 60, // 1 hour
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.fullName = (user as User).fullName;
        token.pictureUrl = (user as User).pictureUrl;
        token.userId = (user as User).userId;
      }
      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          fullName: token.fullName as string,
          pictureUrl: token.pictureUrl as string | undefined,
          userId: token.userId as number,
        };
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  events: {
    async signOut() {
      // Optional: Call backend logout endpoint to clear server-side session
      try {
        await fetch(`${process.env.BACKEND_API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
  },

  // Security configurations
  secret: process.env.NEXTAUTH_SECRET,

  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",

  // Cookie configuration for security
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      },
    },
  },
};
