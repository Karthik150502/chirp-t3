import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image';
import { api } from '@/utils/api';
import { Pen } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { ZodError } from 'zod';
export default function CreatePostWizard() {


    const { user } = useUser();
    const [content, setContent] = useState<string>("");
    const ctx = api.useUtils();
    const { mutate, isPending } = api.post.create.useMutation({
        onSuccess: async () => {
            toast.success("Posted", { id: "create-post" })
            await ctx.post.getAll.invalidate()
        },
        onError: (error) => {
            // if (error instanceof TRPCClientError) {
            // console.log(error)
            // }
            toast.error("Some error occured.", { id: "create-post" })
        }
    })



    if (!user) {
        return null;
    }

    const handeSubmit = () => {
        toast.loading("Posting..", { id: "create-post" })
        mutate({
            content
        })
        setContent("")
    }

    return (
        <div className='flex items-center justify-start gap-3 w-full' onKeyDown={(e) => {
            if (e.key === 'Enter') {
                handeSubmit()
            }
        }}>
            <Image src={user.imageUrl} className="w-14 h-14 rounded-full" alt={`${user.imageUrl} Profile image`} height={56} width={56} />
            <input type="text" className='rounded-lg h-[35px] px-2 font-thin bg-transparent text-white/80 grow outline-none' placeholder='Type some emojis!' value={content} onChange={(e) => {
                setContent(e.target.value)
            }} />
            <Button className='bg-purple-600 flex items-center gap-x-2 justify-center text-white text-xs rounded-lg h-[30px] px-2' disabled={isPending} onClick={() => {
                handeSubmit()
            }}>
                {isPending ? "Posting" : "Post"}
                {isPending ? <Loader2 size={15} className='stroke-white animate-spin' /> : <Pen size={15} className='stroke-white' />}
            </Button>
        </div>
    )
}
