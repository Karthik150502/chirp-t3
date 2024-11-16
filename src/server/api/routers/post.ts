import { z } from "zod";
import { clerkClient, User } from "@clerk/nextjs/server";
import { Post } from "@prisma/client";

import { createTRPCRouter, publicProcedure, userAuthProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis"; // see below for cloudflare and fastly adapters





// Create a new ratelimiter, that allows 3 requests per 1 minute.
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});


const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    name: user.fullName,
    username: user.username,
    profilePicture: user.imageUrl
  }
}


export const postRouter = createTRPCRouter({
  test: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ ctx, input }) => {

      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: userAuthProcedure
    .input(z.object({ content: z.string().emoji().min(1).max(280) }))
    .mutation(async ({ ctx, input }) => {

      const authorId = ctx.user!
      const { success } = await ratelimit.limit(authorId);


      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" })
      }


      return await ctx.db.post.create({
        data: {
          content: input.content,
          authorId: authorId
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 100
    });

    if (!posts.length) return [];


    const clerkC = (await clerkClient());
    const users = (await clerkC.users.getUserList({
      userId: posts.map((p: Post) => p.authorId),
      limit: 100
    })).data.map(filterUserForClient)

    const res = posts.map(p => {

      const author = users.find((u) => u.id === p.authorId)!

      if (!author) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Authr for the post not found." })
      }
      return {
        post: p,
        author: author
      }
    })

    console.log("res", res);

    return res ?? []

  }),



});
