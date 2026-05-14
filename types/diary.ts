export type DiaryData = {
    title: string;
    original: string;
    revised: string;
    corrections: Correction[];
    alternative: string;
    date: string;
}

export type Correction = {
    original: string;
    revised: string;
    why: string;
}

export type RevisedDiaryResponse = {
    title: string;
    original: string;
    revised: string;
    corrections: Correction[];
    alternative: string;
}