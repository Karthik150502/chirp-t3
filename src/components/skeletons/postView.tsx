import React from 'react'

export default function PostViewSkeleton() {
    return (
        <div className='w-full animate-pulse rounded-md p-4 flex flex-col items-start justify-center gap-y-2 opacity-15'>
            <div className="w-10 h-10 rounded-full bg-slate-500"></div>
            <div className='w-full flex flex-col justify-center items-start gap-y-4'>
                <p className='rounded-md bg-slate-500 w-[50%] h-[24px]'></p>
                <p className='rounded-md bg-slate-500 w-full h-[24px]'></p>
                <p className='rounded-md bg-slate-500 w-full h-[24px]'></p>
            </div>
            <div className="w-full flex justify-end">
            </div>
        </div>
    )
}
