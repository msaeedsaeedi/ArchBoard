import type { ReactNode } from "react";
import DashboardHeader from "@/domain/dashboard/components/header";

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <DashboardHeader></DashboardHeader>
      <div>{children}</div>
    </div>
  );
}
