import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { signupSchema } from "@/features/auth/validations/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate the request body
    const validatedFields = signupSchema.parse(body);
    const { confirmPassword: _, ...signupData } = validatedFields;

    // Call your backend API for user registration
    const response = await fetch(`${process.env.BACKEND_API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupData),
    });

    if (!response.ok) {
      if (response.status === 409) {
        return NextResponse.json(
          { error: "Account already exists!" },
          { status: 409 },
        );
      }
      if (response.status === 400) {
        return NextResponse.json(
          { error: "Invalid data provided" },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { error: "Registration failed. Please try again later." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Registration failed. Please try again later." },
      { status: 500 },
    );
  }
}
