import type { RouterOutputs } from '@/utils/api'
import React from 'react';
import Image from 'next/image';
import moment from "moment"
import Link from 'next/link';
type Post = RouterOutputs["post"]["getAll"][number];

export default function PostView({ post, author }: Post) {



    return (
        <div className='text-white w-full rounded-md p-4 flex flex-col items-start justify-center gap-y-2'>
            <Image src={author.profilePicture} alt={`${author.name}`} height={45} width={45} className='rounded-full' />
            <div className='w-full flex flex-col justify-center items-start gap-y-4'>

                <p className='text-slate-300 text-xs'>
                    <Link href={`/@${author.username}`}><span>{`@${author.username}`}</span></Link>&nbsp;&nbsp;&#x2022;&nbsp;&nbsp;<Link href={`/post/${post.id}`}><span>{moment(new Date(post.createdAt)).fromNow()}</span></Link></p>

                <p className='text-sm text-slate-300 font-extralight'>{post.content}</p>
            </div>
            <div className="w-full flex justify-end">
            </div>
        </div>
    )
}
