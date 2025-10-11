import LoginPage from "@/features/auth/login.page";

export const metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function Page() {
  return <LoginPage />;
}
