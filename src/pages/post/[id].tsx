

import { api } from "@/utils/api";
import { SignedIn, SignedOut, SignInButton, } from "@clerk/nextjs";
import CreatePostWizard from "@/components/createPostWizard";
import Head from "next/head";
import PageLayout from "@/components/layouts/pageLayout";
import { generateSsgHelper } from "@/server/helpers/ssgHelper";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import PostView from "@/components/postView";
import { Loader2 } from "lucide-react";




export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [], fallback: "blocking"
  }
}



export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {

  const ssgHelper = generateSsgHelper();

  const id = context.params?.id;
  if (!id) {
    throw new Error("No id found.")
  }


  const postId = id as string;

  await ssgHelper.post.getById.prefetch({
    postId
  })

  return {
    props: {
      trpcState: ssgHelper.dehydrate(),
      postId
    }
  }

}

export default function SinglePostPage({ postId }: { postId: string }) {


  const { data, isLoading } = api.post.getById.useQuery({ postId })



  return (
    <>
      <Head>
        <title>{`${data?.author.username} | ${data?.post.content}`}</title>
        <meta name="description" content="Kiwi - Chirp" />
      </Head>
      <PageLayout>

        <div className="flex flex-col items-center w-full">
          {
            isLoading ? <>
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin stroke-white" />
                <p className="text-xs py-6 text-white">Loading....</p>
              </div>
            </> : !data ? <>
              <div className="flex items-center justify-center gap-2">
                <p className="text-xs py-6 text-white">Post not found..</p>
              </div>
            </> : <>
              <PostView {...data} />
            </>
          }
        </div>
      </PageLayout>
    </>
  );
}
