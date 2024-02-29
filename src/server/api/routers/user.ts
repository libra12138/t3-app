import { z } from "zod";
import bcryptjs from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { generateCode } from "~/lib/utils";
import { sendMail } from "~/lib/mailer";
import { render } from "@react-email/render";
import { SignUpCaptcha } from "~/server/emails/sign-up-captcha";
import { differenceInMinutes } from "date-fns";

export const userRouter = createTRPCRouter({
  signUpCaptcha: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const captcha = generateCode(6);
      const email = input.email;

      const emailHtml = render(SignUpCaptcha({ email, captcha }));
      sendMail(
        {
          to: email,
          subject: "注册",
          text: `welcome ${email}!`,
          html: emailHtml,
        },
        async (error, info) => {
          if (error) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "邮件发送失败",
            });
          } else {
            await ctx.db.captcha.create({
              data: {
                email,
                content: captcha,
                type: "sign-up",
              },
            });
            return info;
          }
        },
      );
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(1),
        captcha: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (user) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "邮箱已存在",
        });
      } else {
        //检查验证码
        const captcha = await ctx.db.captcha.findFirst({
          where: {
            email: input.email,
            type: "sign-up",
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        if (!captcha) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "请先发送邮箱验证码",
          });
        }
        if (differenceInMinutes(new Date(), captcha.createdAt) > 1) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "验证码已失效,请重新发送",
          });
        }
        if (captcha.content === input.captcha) {
          return await ctx.db.user.create({
            data: {
              email: input.email,
              name: input.name,
              password: bcryptjs.hashSync(input.password, 10),
            },
          });
        }
      }
    }),
});
