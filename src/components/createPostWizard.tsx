import React from 'react'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image';
export default function CreatePostWizard() {


    const { user } = useUser();


    

    if (!user) {
        return null;
    }

    return (
        <div className='flex items-center justify-start gap-3 w-full'>
            <img src={user.imageUrl} className="w-14 h-14 rounded-full" alt={`${user.imageUrl} Profile image`} />
            <input type="text" className='rounded-lg h-[35px] px-2 font-thin bg-transparent text-white/50 grow outline-none' placeholder='Type some emojis!' />
        </div>
    )
}
