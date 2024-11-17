import { EllipsisVertical } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,

} from "@/components/ui/dialog"
import { api } from '@/utils/api';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
export default function DeletePost({ id }: { id: string }) {

    const [dialogOpen, setDialogIsOpen] = useState<boolean>(false);
    const path = usePathname();
    const router = useRouter();
    const isOnPostPage = path.startsWith("/post")

    const ctx = api.useUtils();
    const { data, mutate } = api.post.deleteById.useMutation({
        onSuccess: async () => {
            toast.success("Post deleted.", { id: "post-delete" });
            if (isOnPostPage) {
                router.push("/")
            }
            await ctx.post.getAll.invalidate();
        },
        onError: () => {
            toast.success("Failed to delete the post.", { id: "post-delete" })
        }
    })


    const handleDelete = () => {
        toast.loading("Deleting post.", { id: "post-delete" })
        mutate({
            id: id
        })
    }


    return (
        <>
            {
                <Dialog open={dialogOpen} onOpenChange={setDialogIsOpen}>
                    <DialogTrigger asChild className='cursor-pointer'>
                        <EllipsisVertical className='stroke-white' />
                    </DialogTrigger>
                    <DialogContent className='w-full'>
                        <DialogHeader>
                            <DialogTitle>Delete Post?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className='w-full flex items-center justify-center gap-x-2'>
                            <DialogClose asChild className='w-full'>
                                <Button variant={"outline"} size={"sm"}>
                                    Cancel
                                </Button>
                            </DialogClose>

                            <DialogClose asChild className='w-full'>
                                <Button variant={"destructive"} size={"sm"} onClick={handleDelete}>
                                    Delete Post
                                </Button>
                            </DialogClose>
                        </div>
                    </DialogContent>
                </Dialog>
            }
        </>
    )
}
