

import { api } from "@/utils/api";
import { SignedIn, SignedOut, SignInButton, } from "@clerk/nextjs";
import CreatePostWizard from "@/components/createPostWizard";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft } from "lucide-react";
import Head from "next/head";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { createServerSideHelpers } from '@trpc/react-query/server';

import superjson from 'superjson';
import { appRouter } from "@/server/api/root";
import { db } from "@/server/db"
import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import PageLayout from "@/components/layouts/pageLayout";
import Image from "next/image";
import ProfilePostsFeed from "@/components/profilePostsFeed";

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [], fallback: "blocking"
    }
}




export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {

    const ssgHelper = createServerSideHelpers({
        router: appRouter,
        ctx: {
            db,
            user: null
        },
        transformer: superjson, // optional - adds superjson serialization
    });

    const slug = context.params?.slug;
    if (!slug) {
        throw new Error("No  slug found.")
    }


    const username = (slug as string).replace("@", "");

    await ssgHelper.profile.getUserByUsername.prefetch({
        username
    })

    return {
        props: {
            trpcState: ssgHelper.dehydrate(),
            username
        }
    }

}


export default function ProfilePage({ username }: { username: string }) {



    const { data, isLoading, isError } = api.profile.getUserByUsername.useQuery({
        username: username
    });


    if (isError) {
        return <div className="w-full flex py-5">Internal Server Error.</div>
    }



    return (
        <>
            <Head>
                <title>{`Kiwi | ${username ? username : ""}`}</title>
                <meta name="description" content="Kiwi - Chirp" />
            </Head>
            <PageLayout>
                <div className="flex flex-col items-center w-full">

                    {
                        isLoading && <div className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin stroke-white" />
                            <p className="text-xs py-6 text-white">Loading....</p>
                        </div>
                    }

                    <div className="w-full h-[250px] border-b border-b-white/15 flex flex-col items-center justify-center relative">
                        <div className="w-full h-[50%] border-b border-b-white/15"></div>
                        <div className="w-full h-[50%] flex items-end justify-center py-5">
                            <p className="text-white">
                                <span className="text-semibold">{data?.name}</span> | <span className="text-xs text-slate-400">@{data?.username}</span>
                            </p>
                        </div>
                        <Image src={data.profilePicture} height={125} width={125} alt={`${data.name}`} className="rounded-full absolute" />
                    </div>
                    <ProfilePostsFeed userId={data.id} />
                    {/* <div className="text-white flex flex-col items-center justify-center gap-y-2 py-10">
                            <p className="text-2xl">404</p>
                            <p className="text-4xl">Page not found.</p>
                            <p className="text-xx">
                                Sorry, the page you are looking for cannot be found.
                                </p>
                                <Button className="flex items-center justify-center gap-x-2"
                                onClick={() => {
                                    router.push("/")
                                    }}
                            >
                                <ChevronLeft strokeWidth={1.5} />
                                Back to Home
                                </Button>
                        </div> */}
                </div>
            </PageLayout>
        </>
    );
}
