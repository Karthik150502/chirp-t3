import Head from "next/head";

import { api } from "@/utils/api";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import CreatePostWizard from "@/components/createPostWizard";
import PostView from "@/components/postView";

export default function Home() {
  const { data: posts, isError, isLoading } = api.post.getAll.useQuery()
  const user = useUser()


  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen relative overflow-hidden flex items-center bg-background justify-center">

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
            !!user && <p>{user.user?.fullName} | {user.user?.id}</p>
          }
          <div className="flex flex-col items-center w-full">
            {

              isLoading ? <>
                Loading...
              </> : isError ? <>
                Error while loading posts
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
