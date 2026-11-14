import type { Metadata } from "next";

import { AuthPage } from "@/components/auth/auth-page";

export const metadata: Metadata = {
  title: "Sign in — RCA Tracking System",
  description:
    "Sign in or create an account for the RCA Tracking System incident workspace.",
};

export default function AuthRoute() {
  return <AuthPage />;
}
