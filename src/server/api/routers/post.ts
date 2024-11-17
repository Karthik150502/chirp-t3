import { z } from "zod";
import { clerkClient, User } from "@clerk/nextjs/server";
import { Post } from "@prisma/client";

import { createTRPCRouter, publicProcedure, userAuthProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis"; // see below for cloudflare and fastly adapters
import { filterUserForClient } from "@/server/lib/utils";





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




export const postRouter = createTRPCRouter({
  test: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ ctx, input }) => {

      return {
        greeting: `Hello ${input.text}`,
      };
    }),




  getById: publicProcedure.input(z.object({
    postId: z.string()
  })).query(async ({ ctx, input }) => {

    const post = await ctx.db.post.findUnique({
      where: {
        id: input.postId
      }
    })

    if (!post) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
    }

    return (await attachUserDataToPosts([post]))[0]

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

  deleteById: userAuthProcedure.input(z.object({
    id: z.string()
  })).mutation(async ({ ctx, input }) => {
    const res = await ctx.db.post.delete({
      where: {
        id: input.id
      }
    })
    return res;
  })
  ,
  getPostsByUserid: publicProcedure.input(z.object({
    userId: z.string()
  })).query(async ({ ctx, input }) => {
    const posts = await ctx.db.post.findMany({
      where: {
        authorId: input.userId
      },
      orderBy: { createdAt: "desc" },
      take: 100
    }).then(attachUserDataToPosts);
    return posts;
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 100
    });

    if (!posts.length) return [];
    return attachUserDataToPosts(posts);
  }),
});


export const attachUserDataToPosts = async (posts: Post[]) => {
  const clerkC = (await clerkClient());

  const users = (await clerkC.users.getUserList({
    userId: posts.map((p: Post) => p.authorId),
    limit: 100
  })).data.map(filterUserForClient)

  const res = posts.map(p => {
    const author = users.find((u) => u.id === p.authorId)!
    if (!author) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Author for the post not found." })
    }
    return {
      post: p,
      author: author
    }
  })
  console.log("res", res);
  return res ?? []
}