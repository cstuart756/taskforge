import type { Metadata } from "next";
import RegisterForm from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your TaskForge account.",
};

type PageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function RegisterPage({ searchParams }: PageProps) {
  const { callbackUrl } = await searchParams;
  return <RegisterForm callbackUrl={callbackUrl} />;
}