import type { RouterOutputs } from '@/utils/api'
import React from 'react';
import Image from 'next/image';
import moment from "moment"
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import DeletePost from './deletePost';

type Post = RouterOutputs["post"]["getAll"][number];

export default function PostView({ post, author }: Post) {

    const { user } = useUser();


    return (
        <div className='text-white w-full rounded-md p-4 flex flex-col items-start justify-center gap-y-2'>

            <div className="w-full flex justify-between items-start">
                <Image src={author.profilePicture} alt={`${author.name}`} height={45} width={45} className='rounded-full' />
                {
                    (post.authorId === user?.id) && <DeletePost id={post.id} />
                }
            </div>
            <div className='w-full flex flex-col justify-center items-start gap-y-4'>

                <p className='text-slate-300 text-xs'>
                    <Link href={`/@${author.username}`}><span>{`@${author.username}`}</span></Link>&nbsp;&nbsp;&#x2022;&nbsp;&nbsp;<Link href={`/post/${post.id}`}><span>{moment(new Date(post.createdAt)).fromNow()}</span></Link></p>

                <p className='text-sm text-slate-300 font-extralight'>{post.content}</p>
            </div>

        </div>
    )
}
