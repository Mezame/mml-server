import { Request, Response } from 'express';
import { throttling } from '../../configs/global.config.js';
import { db } from '../../services/in-memory-database.service.js';


function viewAllManga(req: Request, res: Response) {

    const reqClone: any = req;

    const userId = reqClone['userId'];

    const manga = db.readAllManga(userId);

    setTimeout(() => {

        res.status(200).send(manga);

    }, throttling);

}

function viewOneManga(req: Request, res: Response) {

    const reqClone: any = req;

    const userId = reqClone['userId'];

    const mangaId = req.params.id as unknown as number;

    const manga = db.readOneManga(userId, mangaId);

    setTimeout(() => {

        res.status(200).send(manga);

    }, throttling);

}


export { viewAllManga, viewOneManga };