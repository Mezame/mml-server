import express from 'express';
import { viewAllManga, viewOneManga } from '../controllers/manga/view-manga.controller.js';
import addOneManga from '../controllers/manga/add-manga.controller.js';
import { editChapterFromOneManga, editOneManga } from '../controllers/manga/edit-manga.controller.js';
import deleteOneManga from '../controllers/manga/delete-manga.controller.js';
import checkCsrfToken from '../middlewares/csrf.middleware.js';
import checkIfAuthenticated from '../middlewares/auth.middleware.js';
import getUserIdFromToken from '../middlewares/user-token.middleware.js';

const router = express.Router();

router.use(getUserIdFromToken);
router.use(checkIfAuthenticated);
router.get('/mangas', viewAllManga);
router.get('/manga/:id', viewOneManga);
router.post('/manga', checkCsrfToken, addOneManga);
router.put('/manga/:id', checkCsrfToken, editOneManga);
router.patch('/mangaChapter/:id', checkCsrfToken, editChapterFromOneManga);
router.delete('/manga/:id', checkCsrfToken, deleteOneManga);

export default router;
