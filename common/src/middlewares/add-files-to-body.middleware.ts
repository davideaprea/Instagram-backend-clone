import { RequestHandler } from "express";

type MulterFileMap = {
    [fieldname: string]: Express.Multer.File[];
};

export const addFilesToBody: RequestHandler = (req, res, next): void => {
    const files = req.files as MulterFileMap | undefined;

    for (const key in files) {
        req.body[key] = files[key][0];
    }

    next();
}