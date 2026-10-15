import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Verify2FAForm from "./verify-2fa-form";

export const metadata: Metadata = {
  title: "Two-factor authentication",
  description: "Enter your authentication code to complete sign in.",
};

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function Login2FAPage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/login");
  }

  return <Verify2FAForm pendingToken={token} />;
}