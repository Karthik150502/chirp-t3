

import { api } from "@/utils/api";
import { SignedIn, SignedOut, SignInButton, } from "@clerk/nextjs";
import CreatePostWizard from "@/components/createPostWizard";
import Head from "next/head";
import { useEffect } from "react";
import PageLayout from "@/components/layouts/pageLayout";


export default function SinglePostPage() {



  return (
    <>
      <Head>
        <title>{`Kiwi | `}</title>
        <meta name="description" content="Kiwi - Chirp" />
      </Head>
      <PageLayout>

        <header className="w-full h-[80px] border-b border-b-white/15 py-2 px-4 flex items-center justify-between">
          <div className="h-full w-full flex items-center gap-2 text-white">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <CreatePostWizard />
            </SignedIn>
          </div>
        </header>
        {
          // !!user && <p>{user.user?.fullName} | {user.user?.id}</p>
        }
        <div className="flex flex-col items-center w-full">


        </div>
      </PageLayout>
    </>
  );
}
