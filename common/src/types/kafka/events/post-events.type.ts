import { PostTopics } from "../topics/post-topics.enum";

export type PostEvents = {
    [PostTopics.POST_CREATE]: string
    [PostTopics.POST_DELETE]: string
}