import { Post } from "./post.type";

export type PostDto = Pick<Post, "allowComments" | "caption" | "pinned" | "tags" | "userId"> & {
    medias: Express.Multer.File[]
}