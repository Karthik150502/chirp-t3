import { api } from '@/utils/api'

import React from 'react'
import PostView from './postView'

export default function ProfilePostsFeed({ userId }: { userId: string }) {


    const { data, isLoading } = api.post.getPostsByUserid.useQuery({
        userId: userId
    })

    if (isLoading) {
        return <div>Loading....</div>
    }


    if (!data?.length) {
        return <div>User has no posts....</div>
    }



    return (
        <div className='flex flex-col w-full items-center justify-center gap-y-2'>
            {
                data.map((d) => {
                    return <PostView {...d} key={d.post.id} />
                })
            }
        </div>
    )
}
