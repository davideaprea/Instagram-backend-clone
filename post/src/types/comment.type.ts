import { InteractiveContent } from "./interactive-content.type"
import { Likeable } from "./likeable.type"
import { PostInteraction } from "./post-interaction.type"

export type Comment = PostInteraction & Likeable & {
    content: InteractiveContent
    replies: number,
    pinned: boolean
}