"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { RiGithubFill, RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import { z } from "zod";
import { type getProviders, signIn } from "next-auth/react";

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "请填写邮箱",
    })
    .email({ message: "邮箱格式错误" }),
  password: z.string().min(1, {
    message: "请填写密码",
  }),
});

export default function SignIn({
  providers,
}: {
  providers: Awaited<ReturnType<typeof getProviders>>;
}) {
  const { toast } = useToast();
  const { replace } = useRouter();

  const [eye, setEye] = useState(true);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await signIn("credentials", {
      ...values,
      redirect: false,
      // callbackUrl: `${window.location.origin}/welcome`,
    });
    if (res?.error) {
      toast({
        variant: "destructive",
        description:
          res.error === "CredentialsSignin"
            ? "请检查账号或者密码"
            : "账号验证失败",
      });
    }
    console.log(res);
    if (res?.ok) {
      replace("/");
    }
  }

  return (
    <div className="dark:bg-brand dark:text-brand-contrast text-emphasis min-h-screen [--cal-brand-emphasis:#101010] [--cal-brand-subtle:#9CA3AF] [--cal-brand-text:white] [--cal-brand:#111827] dark:[--cal-brand-emphasis:#e1e1e1] dark:[--cal-brand-text:black] dark:[--cal-brand:white]">
      <div className="bg-subtle dark:bg-darkgray-50 flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
        <h3 className="logo mx-auto mb-auto"></h3>
        <div className="text-center sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="font-cal text-emphasis text-center text-3xl">
            欢迎回来
          </h2>
        </div>
        <div className="mb-auto mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-default border-subtle mx-2 rounded-md border px-4 py-10 dark:bg-muted sm:px-10">
            {providers?.credentials && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>邮箱</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email@example.com"
                            type="email"
                            autoComplete="email"
                            autoCorrect="off"
                            inputMode="email"
                            maxLength={24}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>密码</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              autoComplete="off"
                              type={eye ? "password" : "text"}
                              placeholder="•••••••••••••"
                              maxLength={26}
                              {...field}
                            />
                          </FormControl>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 border-l  border-b-border pl-2">
                            {eye ? (
                              <RiEyeLine
                                size={16}
                                onClick={() => setEye(false)}
                                className="cursor-pointer"
                              />
                            ) : (
                              <RiEyeOffLine
                                size={16}
                                onClick={() => setEye(true)}
                                className="cursor-pointer"
                              />
                            )}
                          </div>
                        </div>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button className="!mt-6  w-full" type="submit">
                    登录
                  </Button>
                </form>
              </Form>
            )}
            <hr className="border-subtle my-8" />
            <div className="space-y-3">
              {providers?.github && (
                <Button
                  variant="outline"
                  onClick={() => signIn("github", { callbackUrl: "/" })}
                  className="w-full"
                >
                  <RiGithubFill className="mr-1" />
                  使用Google登录
                </Button>
              )}
            </div>
          </div>
          <div className="text-default mt-8 text-center text-sm">
            <Link className="text-brand-500 font-medium" href="/auth/sign-up">
              没有账户？
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
