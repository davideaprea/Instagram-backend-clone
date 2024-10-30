declare global {
    namespace Express {
        interface Request {
            currentUser?: {
                userId: string
            }
        }
    }
}