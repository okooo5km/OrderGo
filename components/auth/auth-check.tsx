"use client";

import { useAuth } from "@/hooks/use-auth";
import { LoginDialog } from "./login-dialog";

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginDialog />;
  }

  return <>{children}</>;
} 