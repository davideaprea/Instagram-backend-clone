import multer, { memoryStorage, Multer } from "multer";

export const multerConfig: Multer = multer({
    storage: memoryStorage()
} as const);