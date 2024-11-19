import { DeleteObjectCommand, DeleteObjectCommandInput, PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import createHttpError from "http-errors";

const bucket: string = process.env.S3_BUCKET_NAME!

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACC_KEY!,
        secretAccessKey: process.env.S3_SECRET_ACC_KEY!
    },
    region: process.env.S3_BUCKET_REGION!
});

export const saveFile = async (file: Express.Multer.File): Promise<string> => {
    if (!file.mimetype.startsWith("image")) {
        throw new createHttpError.BadRequest("Please, provide a proper image source.");
    }

    if(Math.floor(file.size / (10 ** 6)) > 5) {
        throw new createHttpError.BadRequest("Exceeded images maximum size of 5 megabytes.");
    }

    const sourceCommand: PutObjectCommandInput = {
        Bucket: bucket,
        Key: randomUUID() + "_" + file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype
    }

    const command: PutObjectCommand = new PutObjectCommand(sourceCommand);

    await s3Client.send(command);
    return sourceCommand.Key!;
}

export const deleteFile = async (fileName: string) => {
    const sourceCommand: DeleteObjectCommandInput = {
        Bucket: bucket,
        Key: fileName
    }

    const command: DeleteObjectCommand = new DeleteObjectCommand(sourceCommand);

    await s3Client.send(command);
}