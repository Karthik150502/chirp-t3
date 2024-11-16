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



const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={`${montserrat400.className} min-h-screen overflow-hidden relative`}>
      <ClerkProvider>
        <Component {...pageProps} />
      </ClerkProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);
