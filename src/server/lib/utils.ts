import type { User } from "@clerk/nextjs/server"

export const filterUserForClient = (user: User) => {
    return {
        id: user.id,
        name: user.fullName,
        username: user.username,
        profilePicture: user.imageUrl
    }
}