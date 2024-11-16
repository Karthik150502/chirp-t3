import { z } from "zod";
import { clerkClient, User } from "@clerk/nextjs/server";
import { Post } from "@prisma/client";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";



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

  create: publicProcedure
    .input(z.object({ content: z.string().min(1), authorId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          content: input.content,
          authorId: input.authorId
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
