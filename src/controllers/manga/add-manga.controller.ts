import { Request, Response } from 'express';
import fs from 'fs';
import { imageStorageUrl, throttling } from '../../configs/global.config.js';
import { Manga, Status } from '../../models/manga.js';
import { db } from '../../services/in-memory-database.service.js';
import { isValidWebUrl, validateMangaCoverImage } from '../../common/validations.js';


export interface MangaForm {
  mangaTitle: string;
  mangaStatus: string;
  mangaChapter: string;
  mangaSite?: string;
  mangaCoverImageAsDataURL?: string;
}

export type ResCode = 'ok' | 'invalidImage' | 'unstoredImage';

function addOneManga(req: Request, res: Response, _next: any) {

  const reqClone: any = req;

  const userId = reqClone['userId'];

  const mangaForm: MangaForm = req.body;

  const fileAsDataURL = mangaForm.mangaCoverImageAsDataURL;

  if (validateMangaForm(mangaForm) == false) {

    res.sendStatus(403);

  } else {

    const date = new Date(Date.now()).toLocaleString();

    /* https://stackoverflow.com/a/20864946/20135116 */
    const mangaUrl = mangaForm.mangaTitle.toLowerCase().replace(/[\W_]+/g, '').replace(/ /g, '-');

    if (mangaForm.mangaSite !== undefined) {

      if (!isValidWebUrl(mangaForm.mangaSite)) { mangaForm.mangaSite = undefined; }

    }

    let manga: Manga = {
      id: 0,
      imageUrl: undefined,
      title: mangaForm.mangaTitle,
      status: mangaForm.mangaStatus as Status,
      chapter: parseInt(mangaForm.mangaChapter),
      updateDate: date,
      mangaSite: mangaForm.mangaSite,
      url: mangaUrl
    }

    let resCode: ResCode;

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

        manga.imageUrl = mangaUrl + fileExt;

        resCode = 'ok';

      } catch (err) {

        console.error(err);

        manga.imageUrl = undefined;

        resCode = 'unstoredImage';

      }

    }

    const newManga = db.createOneManga(userId, manga);

    console.log('new manga was created: ', newManga);

    setTimeout(() => {

      res.status(201).send({ newManga, resCode });

    }, throttling);

  }

}

function validateMangaForm(mangaForm: MangaForm): boolean {

  const status = ['reading', 'completed', 'planning', 'paused'];

  const isMangaTitleValid = (mangaForm.mangaTitle == '' || mangaForm.mangaTitle == undefined) ? false : true;

  const isMangaStatusValid = (mangaForm.mangaStatus == '' ||
    mangaForm.mangaStatus == undefined ||
    !status.includes(mangaForm.mangaStatus)) ? false : true;

  /* regex from https://stackoverflow.com/a/40424515/20135116 */
  const isMangaChapterValid = (mangaForm.mangaChapter == undefined || !/^\d+(\.\d\d{0,1})?$/.test(mangaForm.mangaChapter)) ? false : true;

  if (!isMangaTitleValid || !isMangaStatusValid || !isMangaChapterValid) {

    console.log('mangaForm is not valid');

    return false;

  } else { return true; }

}

export default addOneManga;