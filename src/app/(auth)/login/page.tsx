import type { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your TaskForge account.",
};

type PageProps = {
  searchParams: Promise<{ callbackUrl?: string; reset?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const { callbackUrl, reset } = await searchParams;
  return <LoginForm callbackUrl={callbackUrl} reset={reset} />;
}