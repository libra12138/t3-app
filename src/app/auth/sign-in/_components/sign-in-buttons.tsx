"use client";
import { type getProviders, signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";

export const SignInButtons = ({
  providers,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>;
}) => {
  return (
    <>
      {Object.values(providers!).map((provider) => (
        <div key={provider.name}>
          <Button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </Button>
        </div>
      ))}
    </>
  );
};
