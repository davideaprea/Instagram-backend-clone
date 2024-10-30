declare global {
    namespace Express {
        interface Request {
            currentUser?: {
                username: string
            }
        }
    }
}