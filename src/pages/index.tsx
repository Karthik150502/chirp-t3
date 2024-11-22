import Head from "next/head";

import { api } from "@/utils/api";
import { SignedIn, SignedOut, SignInButton, } from "@clerk/nextjs";
import CreatePostWizard from "@/components/createPostWizard";
import PostView from "@/components/postView";
import PostViewSkeleton from "@/components/skeletons/postView";
import PageLayout from "@/components/layouts/pageLayout";
export default function Home() {
  const { data: posts, isError, isLoading } = api.post.getAll.useQuery()


  return (
    <>
      <Head>
        <title>{`Kiwi | Home`}</title>
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

        <div className="flex flex-col items-center w-full">
          {

            isLoading ? <>
              <div className="w-full h-full relative">
                {
                  ["", "", "", "", "", ""].map((p, i) => {
                    return <PostViewSkeleton key={i} />
                  })
                }
              </div>
            </> : isError ? <>
              <p className="text-xs text-center text-white">Error while loading posts...</p>
            </> : <>
              {
                posts?.length && posts.map((data) => {
                  return <PostView key={data.post.id} {...data} />
                })
              }
            </>

          }

        </div>
      </PageLayout>

    </>
  );
}
