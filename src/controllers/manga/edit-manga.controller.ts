import { Request, Response } from "express";
import fs from 'fs';
import { imageStorageUrl, throttling } from "../../configs/global.config.js";
import { isValidWebUrl, validateMangaCoverImage } from "../../common/validations.js";
import { Status } from "../../models/manga.js";
import { db } from "../../services/in-memory-database.service.js";
import { MangaForm, ResCode } from "./add-manga.controller.js";


function editOneManga(req: Request, res: Response) {

    const reqClone: any = req;

    const userId = reqClone['userId'];

    const mangaId: number = req.body.id;

    const mangaForm: Partial<MangaForm> = req.body.mangaForm;

    if (validateMangaForm(mangaForm) == false) {

        console.log('mangaForm is not valid');

        res.sendStatus(403);

    } else {

        const date = new Date(Date.now()).toLocaleString();

        const fileAsDataURL = mangaForm.mangaCoverImageAsDataURL;

        let manga = db.readOneManga(userId, mangaId);

        /* https://stackoverflow.com/a/20864946/20135116 */
        const mangaUrl = manga.title.toLowerCase().replace(/[\W_]+/g, '').replace(/ /g, '-');

        let resCode: ResCode = 'ok';

        if (mangaForm.mangaTitle) { manga.title = mangaForm.mangaTitle; }

        if (mangaForm.mangaStatus) { manga.status = mangaForm.mangaStatus as Status; }

        if (mangaForm.mangaChapter) {

            manga.chapter = parseInt(mangaForm.mangaChapter);

            manga.updateDate = date;

        }

        if (mangaForm.mangaSite) {

            if (!isValidWebUrl(mangaForm.mangaSite)) { mangaForm.mangaSite = undefined; }

            manga.mangaSite = mangaForm.mangaSite;

        }

        if (fileAsDataURL == '') {

            try {

                fs.unlinkSync(imageStorageUrl + manga.imageUrl);

                manga.imageUrl = undefined;

                resCode = 'ok';

            } catch (err) {

                console.error(err);

                resCode = 'unstoredImage';

            }

        }

        if (fileAsDataURL !== '' && fileAsDataURL !== undefined) {

            if (validateMangaCoverImage(fileAsDataURL) == false) {

                //res.sendStatus(403);
                resCode = 'invalidImage';

            } else {

                const base64data = fileAsDataURL!.replace(/^data:.*,/, '');
                let fileExt = '.' + fileAsDataURL!.slice(fileAsDataURL!.indexOf('data:image/') + 11,
                    fileAsDataURL!.indexOf(';base64,'));
                fileExt = (fileExt == '.jpeg') ? '.jpg' : fileExt;

                try {

                    fs.writeFileSync(imageStorageUrl + mangaUrl + fileExt, base64data, 'base64');

                    fs.unlinkSync(imageStorageUrl + manga.imageUrl);

                    manga.imageUrl = mangaUrl + fileExt;

                    resCode = 'ok';

                } catch (err) {

                    console.error(err);

                    manga.imageUrl = undefined;

                    resCode = 'unstoredImage';

                }

            }

        }

        const editedManga = db.updateOneManga(userId, mangaId, manga);

        console.log(`manga w/ id=${editedManga.id} was edited: `, editedManga);

        setTimeout(() => {

            res.status(201).send({ editedManga, resCode });

        }, throttling);

    }

}

function editChapterFromOneManga(req: Request, res: Response) {

    const reqClone: any = req;

    const userId = reqClone['userId'];

    const mangaId: number = req.body.id;

    const mangaChapter: string = req.body.chapter;

    const manga = db.readOneManga(userId, mangaId);

    /* regex from https://stackoverflow.com/a/40424515/20135116 */
    const isMangaChapterValid = ( (mangaChapter == undefined || !/^\d+(\.\d\d{0,1})?$/.test(mangaChapter)) && mangaChapter !== manga.chapter.toString()) ? false : true;

    if (!isMangaChapterValid) {

        console.log('manga chapter is not valid');

        res.sendStatus(403);

    } else {

        const newChapter = parseInt(mangaChapter) + 1;

        const patchedManga = db.updateChapterFromOneManga(userId, mangaId, newChapter);

        console.log(`manga w/ id=${patchedManga.id} was patched`);

        setTimeout(() => {

            res.status(201).send(patchedManga);

        }, throttling);

    }

}

function validateMangaForm(mangaForm: Partial<MangaForm>): boolean {

    if (mangaForm.mangaTitle) {

        const isMangaTitleValid = (mangaForm.mangaTitle == '' || mangaForm.mangaTitle == undefined) ? false : true;

        if (!isMangaTitleValid) { return false; }

    }

    if (mangaForm.mangaStatus) {

        const status = ['reading', 'completed', 'planning', 'paused'];

        const isMangaStatusValid = (mangaForm.mangaStatus == '' ||
            mangaForm.mangaStatus == undefined ||
            !status.includes(mangaForm.mangaStatus)) ? false : true;

        if (!isMangaStatusValid) { return false; }

    }

    if (mangaForm.mangaChapter) {

        /* regex from https://stackoverflow.com/a/40424515/20135116 */
        const isMangaChapterValid = (mangaForm.mangaChapter == undefined || !/^\d+(\.\d\d{0,1})?$/.test(mangaForm.mangaChapter)) ? false : true;

        if (!isMangaChapterValid) { return false; }

    }

    return true;

}

export { editOneManga, editChapterFromOneManga };