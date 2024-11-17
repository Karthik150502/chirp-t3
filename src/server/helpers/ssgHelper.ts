import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "../api/root";
import { db } from "../db";
import SuperJSON from "superjson";




export function generateSsgHelper() {
    return createServerSideHelpers({
        router: appRouter,
        ctx: {
            db,
            user: null
        },
        transformer: SuperJSON, // optional - adds superjson serialization
    });
}