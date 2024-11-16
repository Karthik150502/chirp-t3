import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";



export const profileRouter = createTRPCRouter({

    getUserByUsername: publicProcedure.input(z.object({
        username: z.string()
    })).query(async ({ ctx }) => {
        return []
    })
});
