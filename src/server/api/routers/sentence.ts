import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const sentenceRouter = createTRPCRouter({
  random: publicProcedure.query(async ({ ctx }) => {
    const sentenceCount = await ctx.db.sentence.count();
    const skip = Math.floor(Math.random() * sentenceCount);
    const sentences = await ctx.db.sentence.findMany({
      take: 1,
      skip: skip,
    });
    return sentences?.at(0);
  }),
});
