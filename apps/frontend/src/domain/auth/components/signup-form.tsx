"use client";

import { useSignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormState {
  error?: string;
  success?: boolean;
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  const { pending } = useFormStatus();
  const isLoading = pending || isSubmitting;

  return (
    <Button type="submit" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Creating Account...
        </>
      ) : (
        "Create Account"
      )}
    </Button>
  );
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function signupAction(
    _prevState: FormState,
    formData: FormData,
  ): Promise<FormState> {
    setIsSubmitting(true);

    try {
      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        toast.error("All fields are required");
        return {};
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return {};
      }

      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return {};
      }

      if (!signUp) throw Error("Clerk not loaded yet!");

      const result = await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Account created successfully!");
        router.push("/");
        return { success: true };
      } else {
        console.log("Additional verification needed", result);
        toast.success("Please check your email to verify your account");
        return {};
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { errors?: Array<{ message?: string }> })?.errors?.[0]
              ?.message || "Account creation failed";
      toast.error(errorMessage);
      return {};
    } finally {
      setIsSubmitting(false);
    }
  }

  const [, formAction] = useActionState(signupAction, { error: undefined });

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading authentication...
        </p>
      </div>
    );
  }

  async function handleGoogleSignup() {
    try {
      if (!signUp) throw Error("Clerk not loaded yet!");
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Google signup failed";
      toast.error(errorMessage);
    }
  }

  return (
    <form
      action={formAction}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="John"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              required
            />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" name="password" type="password" required />
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
          />
        </Field>

        {/* Clerk's CAPTCHA widget */}
        <div
          id="clerk-captcha"
          data-cl-theme="auto"
          data-cl-size="flexible"
          data-cl-language="auto"
        />
        <Field>
          <SubmitButton isSubmitting={isSubmitting} />
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" onClick={handleGoogleSignup}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              role="img"
              aria-label="Google Logo"
              className="h-5 w-5 mr-2"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Sign up with Google
          </Button>

          <FieldDescription className="text-center">
            Already have an account?{" "}
            <a href="/signin" className="underline underline-offset-4">
              Sign in
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
