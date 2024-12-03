import { ObjectId } from "mongoose"

export type InteractiveContent = {
    text: string
    tags: ObjectId[]
    hashtags: string[]
}