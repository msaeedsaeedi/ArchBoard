import { GalleryVerticalEnd } from "lucide-react";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            ArchBoard
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Join ArchBoard Today
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Start collaborating with your team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
