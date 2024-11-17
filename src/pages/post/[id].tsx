

import { api } from "@/utils/api";
import { SignedIn, SignedOut, SignInButton, } from "@clerk/nextjs";
import CreatePostWizard from "@/components/createPostWizard";
import Head from "next/head";
import PageLayout from "@/components/layouts/pageLayout";
import { generateSsgHelper } from "@/server/helpers/ssgHelper";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import PostView from "@/components/postView";




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


  const { data, isLoading, isError } = api.post.getById.useQuery({ postId })



  return (
    <>
      <Head>
        <title>{`${data?.author.username} | ${data?.post.content}`}</title>
        <meta name="description" content="Kiwi - Chirp" />
      </Head>
      <PageLayout>

        <div className="flex flex-col items-center w-full">
          <PostView {...data} />
        </div>
      </PageLayout>
    </>
  );
}
