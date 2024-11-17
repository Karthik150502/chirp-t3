
import React from 'react'
import type { PropsWithChildren } from 'react'


export default function PageLayout({ children }: PropsWithChildren) {
    return (
        <main className="min-h-screen relative overflow-hidden flex items-center bg-background justify-center bg-black">

            <div className="min-h-screen w-full md:max-w-2xl border-x border-x-white/15">
                

                {children}
            </div>
        </main>
    )
}
