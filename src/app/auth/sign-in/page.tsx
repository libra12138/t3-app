import { type Metadata } from "next";
import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import LoginForm from "./_components/login-form";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Sign In - Beam",
};

export default async function SignIn() {
  const session = await getServerAuthSession();

  if (session) {
    redirect("/");
  }

  const providers = await getProviders();

  // console.log(providers);

  // const sentence = await api.sentence.random.query();

  return <LoginForm providers={providers} />;
}
