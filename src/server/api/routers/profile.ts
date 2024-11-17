import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs/server";
import { filterUserForClient } from "@/server/lib/utils";


export const profileRouter = createTRPCRouter({
    getUserByUsername: publicProcedure.input(z.object({
        username: z.string()
    })).query(async ({ input }) => {
        const clerkC = await clerkClient();
        const [user] = (await clerkC.users.getUserList({
            username: [input.username]
        })).data.map(filterUserForClient);

        if (!user) {
            return new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "User not found."
            })
        }

        return user;
    })
});
