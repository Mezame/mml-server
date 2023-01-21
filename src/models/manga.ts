export interface Manga {
    id: number;
    imageUrl?: string;
    title: string;
    status: Status;
    chapter: number;
    updateDate: string;
    mangaSite?: string
    url: string;
}

export type Status = 'reading' | 'completed' | 'planning' | 'paused';