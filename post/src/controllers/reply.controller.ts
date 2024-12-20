import { RequestHandler } from "express";
import { ReplyService } from "../services/reply.service";
import { createReplySchema } from "../joi-schemas/create-reply.schema";

export namespace ReplyController {
    export const create: RequestHandler = async (req, res): Promise<void> => {
        await createReplySchema.validateAsync(req.body, { abortEarly: false });

        req.body.userId = req.currentUser!.userId;

        const reply = await ReplyService.create(req.body);

        res
            .status(201)
            .json(reply);
    }

    export const remove: RequestHandler = async (req, res): Promise<void> => {
        await ReplyService.remove(req.params.id, req.currentUser!.userId);

        res
            .status(204)
            .send();
    }
}