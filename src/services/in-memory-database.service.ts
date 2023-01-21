import { Manga } from '../models/manga.js';
import { mangaMock } from '../mocks/manga.js';
import { User } from '../models/user.js';
import { userMock } from '../mocks/user.js';


class InMemoryDatabase {

    mangaDb: { [key: number]: any } = {
        1: { mangaList: mangaMock }
    };

    userDb: User[] = userMock;

    mangaCounter: number[] = [];

    readAllManga(userId: number): Manga[] {

        const mangaList = this.mangaDb[userId].mangaList as Manga[];

        return mangaList;

    }

    readOneManga(userId: number, mangaId: number): Manga {

        const mangaList = this.mangaDb[userId].mangaList as Manga[];

        const mangaIndex = mangaList.findIndex(m => m.id == mangaId);

        const manga = mangaList[mangaIndex] as Manga;

        return manga;

    }

    createOneManga(userId: number, manga: Manga): Manga {

        const mangaList = this.mangaDb[userId].mangaList as Manga[];

        this.mangaCounter[userId - 1] = mangaList.length + 1;

        manga.id = this.mangaCounter[userId - 1];

        console.log(manga.id);

        mangaList.push(manga);

        return manga;

    }

    updateOneManga(userId: number, mangaId: number, manga: Manga): Manga {

        const mangaList = this.mangaDb[userId].mangaList as Manga[];

        const mangaIndex = mangaList.findIndex(m => m.id == mangaId);

        mangaList[mangaIndex] = manga;

        return manga;

    }

    updateChapterFromOneManga(userId: number, mangaId: number, chapter: number): Manga {

        const mangaList = this.mangaDb[userId].mangaList as Manga[];

        const mangaIndex = mangaList.findIndex(m => m.id == mangaId);

        const date = new Date(Date.now()).toLocaleString();

        mangaList[mangaIndex].chapter = chapter;

        mangaList[mangaIndex].updateDate = date;

        return mangaList[mangaIndex];

    }

    deleteOneManga(userId: number, mangaId: number): Manga {

        const mangaList = this.mangaDb[userId].mangaList as Manga[];

        this.mangaCounter[userId - 1] = mangaList.length - 1;

        const mangaIndex = mangaList.findIndex(m => m.id == mangaId);

        const deletedManga = mangaList[mangaIndex];

        mangaList.splice(mangaIndex, 1);

        return deletedManga;

    }

    findOneUserByUsername(username: string): User {

        const userIndex = this.userDb.findIndex(u => u.username == username);

        const user = this.userDb[userIndex];

        return user;

    }

}


export const db = new InMemoryDatabase();