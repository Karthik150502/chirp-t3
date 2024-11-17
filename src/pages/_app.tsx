import { Montserrat } from "next/font/google";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

const montserrat400 = Montserrat({
  subsets: ['latin'],
  weight: "400"
})


import "@/styles/globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner";
import Head from "next/head";
import PageLayout from "@/components/layouts/pageLayout";



const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={`${montserrat400.className} min-h-screen overflow-hidden relative `}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClerkProvider>
        <PageLayout>
          <Component {...pageProps} />
          <Toaster richColors />
        </PageLayout>
      </ClerkProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
