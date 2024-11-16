

import { api } from "@/utils/api";
import { SignedIn, SignedOut, SignInButton, } from "@clerk/nextjs";
import CreatePostWizard from "@/components/createPostWizard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Head from "next/head";
export default function ProfilePage() {

    const router = useRouter();

    return (
        <>
            <Head>
                <title>{`Kiwi | `}</title>
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
                </div>
            </main>
        </>
    );
}
