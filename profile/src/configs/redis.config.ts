import { createClient } from "redis"

export const initRedis = async (): Promise<void> => {
    await createClient({
        url: process.env.LOCAL_REDIS_URL
    });
}