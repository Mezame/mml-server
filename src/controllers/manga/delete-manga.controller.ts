import { Request, Response } from "express";
import { throttling } from "../../configs/global.config.js";
import { db } from "../../services/in-memory-database.service.js";

function deleteOneManga(req: Request, res: Response) {

    const reqClone: any = req;

    const userId = reqClone['userId'];

    const mangaId: number = parseInt(req.params.id);

    const deletedManga = db.deleteOneManga(userId, mangaId);

    console.log(`manga w/ id=${deletedManga.id} was deleted`);

    setTimeout(() => {

        res.status(201).send(deletedManga);

    }, throttling);


}

export default deleteOneManga;