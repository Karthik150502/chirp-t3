import Head from "next/head";

import { api } from "@/utils/api";
import { SignedIn, SignedOut, SignInButton, } from "@clerk/nextjs";
import CreatePostWizard from "@/components/createPostWizard";
import PostView from "@/components/postView";
import PostViewSkeleton from "@/components/skeletons/postView";
export default function Home() {
  const { data: posts, isError, isLoading } = api.post.getAll.useQuery()


  return (
    <>
      <Head>
        <title>{`Kiwi | Home`}</title>
        <meta name="description" content="Kiwi - Chirp" />
      </Head>
      <main className="min-h-screen relative overflow-hidden flex items-center bg-background justify-center bg-black">

        <div className="min-h-screen w-full md:max-w-2xl border-x border-x-white/15">
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
            {

              isLoading ? <>
                <div className="w-full h-full relative">
                  {
                    ["", "", "", "", "", ""].map((p, i) => {
                      return <PostViewSkeleton key={i} />
                    })
                  }
                  {/* <div className="absolute z-10 w-full flex items-center justify-center h-[100px] top-0">
                    <Loader2Icon className="animate-spin stroke-slate-500" size={40} />
                  </div> */}
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
        </div>
      </main>
    </>
  );
}
