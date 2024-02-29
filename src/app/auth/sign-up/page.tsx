"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  RiMailSendFill,
  RiGithubFill,
  RiCheckboxBlankCircleFill,
  RiCheckLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLoader2Line,
} from "@remixicon/react";
import { z } from "zod";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "请填写用户名",
  }),
  email: z
    .string()
    .min(1, {
      message: "请填写邮箱",
    })
    .email({ message: "邮箱格式错误" }),
  captcha: z.string().min(1, {
    message: "请填写验证码",
  }),
  password: z
    .string()
    .min(1, {
      message: "请填写密码",
    })
    .regex(/^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{7,26}$/),
});

export default function SignUp() {
  const { toast } = useToast();
  const [eye, setEye] = useState(true);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "tom",
      email: "1182767412@qq.com",
      password: "Tom@1234567",
      captcha: "",
    },
  });

  const userCreateMutation = api.user.create.useMutation({
    onError: (err) => {
      toast({
        variant: "destructive",
        description: err.message,
      });
    },
  });

  const sendSignUpCaptchaMutation = api.user.signUpCaptcha.useMutation({
    onSuccess: () => {
      toast({
        variant: "success",
        description: "邮件已发送，请及时处理",
      });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        description: err.message,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    userCreateMutation.mutate(values, {
      onSuccess: () => {
        router.push("/auth/sign-in");
      },
    });
  }

  async function handleSendSignUpEmailClick() {
    const result = await form.trigger(["email"]);
    if (result) {
      sendSignUpCaptchaMutation.mutate({ email: form.getValues("email") });
    }
  }

  return (
    <>
      <div className="light 2xl:bg-default flex min-h-screen w-full flex-col items-center justify-center bg-muted [--cal-brand-emphasis:#101010] [--cal-brand-subtle:#9CA3AF] [--cal-brand-text:#FFFFFF] [--cal-brand:#111827] dark:[--cal-brand-emphasis:#e1e1e1] dark:[--cal-brand-text:#000000] dark:[--cal-brand:#FFFFFF]">
        <div className="2xl:border-subtle grid w-full max-w-[1440px] grid-cols-1 grid-rows-1 overflow-hidden bg-muted lg:grid-cols-2 2xl:rounded-[20px] 2xl:border 2xl:py-6">
          <div className="ml-auto mr-auto mt-0 flex w-full max-w-xl flex-col px-4 pt-6 sm:px-16 md:px-20 lg:mt-12 2xl:px-28">
            <div className="flex flex-col gap-2">
              <h1 className="font-cal text-[28px] leading-none ">
                创建您的账户
              </h1>
              {/* <p className="text-subtle text-base font-medium leading-5">
                个人免费。团队计划提供协作功能。
              </p> */}
            </div>
            <div className="mt-12">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>用户名</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="account"
                            type="text"
                            autoComplete="name"
                            autoCorrect="off"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>邮箱地址</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Input
                              className="rounded-br-none rounded-tr-none"
                              placeholder="email@example.com"
                              type="email"
                              autoComplete="email"
                              autoCorrect="off"
                              inputMode="email"
                              maxLength={24}
                              {...field}
                            />
                            <Button
                              type="button"
                              onClick={() => handleSendSignUpEmailClick()}
                              className="rounded-bl-none rounded-tl-none"
                            >
                              发送验证码
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="captcha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>验证码</FormLabel>
                        <FormControl>
                          <Input
                            maxLength={10}
                            placeholder="填写邮箱验证码"
                            type="text"
                            autoComplete="email"
                            autoCorrect="off"
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
                        <ul className="ml-2">
                          <li
                            className={`flex items-center ${/^(?=.*[A-Z].*)(?=.*[a-z].*).+$/.test(form.watch("password")) && "text-green-500"}`}
                          >
                            {/^(?=.*[A-Z].*)(?=.*[a-z].*).+$/.test(
                              form.watch("password"),
                            ) ? (
                              <RiCheckLine size={12} />
                            ) : (
                              <RiCheckboxBlankCircleFill size={6} />
                            )}
                            <span className="ml-1">大写和小写字母混合</span>
                          </li>
                          <li
                            className={`flex items-center ${form.watch("password").length > 7 && "text-green-500"}`}
                          >
                            {form.watch("password").length > 7 ? (
                              <RiCheckLine size={12} />
                            ) : (
                              <RiCheckboxBlankCircleFill size={6} />
                            )}
                            <span className="ml-1">至少 7 个字符长</span>
                          </li>
                          <li
                            className={`flex items-center ${/^(?=.*[0-9].*).+$/.test(form.watch("password")) && "text-green-500"}`}
                          >
                            {/^(?=.*[0-9].*).+$/.test(
                              form.watch("password"),
                            ) ? (
                              <RiCheckLine size={12} />
                            ) : (
                              <RiCheckboxBlankCircleFill size={6} />
                            )}
                            <span className="ml-1">包含至少 1 个数字</span>
                          </li>
                        </ul>
                        {/* <FormMessage /> */}
                      </FormItem>
                    )}
                  />

                  <Button
                    size="lg"
                    disabled={userCreateMutation.isLoading}
                    className="!mt-2  w-full"
                    type="submit"
                  >
                    {userCreateMutation.isLoading && (
                      <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    创建账户
                  </Button>
                </form>
              </Form>

              <div className="mt-6">
                <div className="relative flex items-center">
                  <div className="border-subtle flex-grow border-t"></div>
                  <span className="text-subtle leadning-none mx-2 flex-shrink text-sm font-normal ">
                    或继续使用
                  </span>
                  <div className="border-subtle flex-grow border-t"></div>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-2 md:flex-row">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => signIn("github", { callbackUrl: "/" })}
                >
                  <RiGithubFill size={16} className="mr-1" />
                  Github
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    signIn("email", {
                      email: "1182767412@qq.com",
                      callbackUrl: "/",
                    })
                  }
                  size="lg"
                  className="w-full"
                >
                  <RiMailSendFill size={16} className="mr-1" />
                  邮箱验证码
                </Button>
              </div>
            </div>
            <div className="mt-10 flex h-full flex-col justify-end text-xs">
              <div className="flex flex-col text-sm">
                <div className="flex gap-1">
                  <p className="text-subtle">已经有帐号？</p>
                  <Link
                    className="text-emphasis hover:underline"
                    href="/auth/sign-in"
                  >
                    登录
                  </Link>
                </div>
                <div className="text-subtle ">
                  By proceeding, you agree to our{" "}
                  <Link
                    className="text-emphasis hover:underline"
                    target="_blank"
                    href="https://cal.com/terms"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    className="text-emphasis hover:underline"
                    target="_blank"
                    href="https://cal.com/privacy"
                  >
                    Privacy Policy
                  </Link>
                  .
                </div>
              </div>
            </div>
          </div>
          <div className="border-subtle lg:bg-subtle mx-auto mt-24 w-full max-w-2xl flex-col justify-between rounded-l-2xl pl-4 dark:bg-none lg:mt-0 lg:flex lg:max-w-full lg:border lg:py-12 lg:pl-12">
            <div className="-mt-4 mb-6 mr-12 grid w-full grid-cols-3 gap-5 pr-4 sm:gap-3 lg:grid-cols-4">
              <div>
                {/* <Image
                  src="/product-cards/product-of-the-day.svg"
                  width="100%"
                  height="34px"
                  className="h-[34px] w-full dark:invert"
                  alt="Cal.com was Product of the Day at ProductHunt"
                /> */}
              </div>
              <div>
                {/* <Image
                  src="/product-cards/product-of-the-week.svg"
                  className="h-[34px] w-full dark:invert"
                  alt="Cal.com was Product of the Week at ProductHunt"
                /> */}
              </div>
              <div>
                {/* <Image
                  src="/product-cards/product-of-the-month.svg"
                  className="h-[34px] w-full dark:invert"
                  alt="Cal.com was Product of the Month at ProductHunt"
                /> */}
              </div>
            </div>
            <div className="mb-6 mr-12 grid w-full grid-cols-3 gap-5 pr-4 sm:gap-3 lg:grid-cols-4">
              <div>
                {/* <Image
                  src="/product-cards/producthunt.svg"
                  className="h-[54px] w-full"
                  alt="ProductHunt Rating of 5 Stars"
                /> */}
              </div>
              <div>
                {/* <Image
                  src="/product-cards/trustpilot.svg"
                  className="block h-[54px] w-full dark:hidden"
                  alt="Trustpilot Rating of 4.7 Stars"
                /> */}
                {/* <Image
                  src="/product-cards/trustpilot-dark.svg"
                  className="hidden h-[54px] w-full dark:block"
                  alt="Trustpilot Rating of 4.7 Stars"
                /> */}
              </div>
              <div>
                {/* <Image
                  src="/product-cards/g2.svg"
                  className="h-[54px] w-full"
                  alt="G2 Rating of 4.7 Stars"
                /> */}
              </div>
            </div>
            <div className="border-default hidden rounded-bl-2xl rounded-br-none rounded-tl-2xl border border-r-0 border-dashed bg-black/[3%] dark:bg-white/5 lg:block lg:py-[6px] lg:pl-[6px]">
              {/* <Image
                className="block dark:hidden"
                src="/mock-event-type-list.svg"
                alt="Cal.com Booking Page"
              />
              <Image
                className="hidden dark:block"
                src="/mock-event-type-list-dark.svg"
                alt="Cal.com Booking Page"
              /> */}
            </div>
            <div className="mr-12 mt-8 hidden h-full w-full grid-cols-3 gap-4 overflow-hidden lg:grid">
              <div className="mb-8 flex max-w-52 flex-col leading-none sm:mb-0">
                <div className="text-emphasis items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-1 h-4 w-4"
                  >
                    <path d="M21 10V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h7"></path>
                    <path d="M16 2v4"></path>
                    <path d="M8 2v4"></path>
                    <path d="M3 10h18"></path>
                    <path d="M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z"></path>
                  </svg>
                  <span className="text-sm font-medium">连接您的所有日历</span>
                </div>
                <div className="text-subtle text-sm">
                  <p>connect_all_calendars_description</p>
                </div>
              </div>
              <div className="mb-8 flex max-w-52 flex-col leading-none sm:mb-0">
                <div className="text-emphasis items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-1 h-4 w-4"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  <span className="text-sm font-medium">
                    设置您的可预约状态
                  </span>
                </div>
                <div className="text-subtle text-sm">
                  <p>set_availbility_description</p>
                </div>
              </div>
              <div className="mb-8 flex max-w-52 flex-col leading-none sm:mb-0">
                <div className="text-emphasis items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-1 h-4 w-4"
                  >
                    <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
                    <path d="M15 7h2a5 5 0 1 1 0 10h-2"></path>
                    <line x1="8" x2="16" y1="12" y2="12"></line>
                  </svg>
                  <span className="text-sm font-medium">分享或嵌入链接</span>
                </div>
                <div className="text-subtle text-sm">
                  <p>share_a_link_or_embed_description</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-none fixed inset-4 z-[9999]"></div>
      </div>
    </>
  );
}
