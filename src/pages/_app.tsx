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



const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={`${montserrat400.className} min-h-screen overflow-hidden relative `}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ClerkProvider>
        <Component {...pageProps} />
        <Toaster richColors />
      </ClerkProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
