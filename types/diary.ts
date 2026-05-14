export type DiaryData = {
  title: string;
  original: string;
  revised: string;
  corrections: Correction[];
  alternative: string;
  date: string;
};

export type Correction = {
  original: string;
  revised: string;
  why: string;
};

export type RevisedDiaryResponse = {
  title: string;
  original: string;
  revised: string;
  corrections: Correction[];
  alternative: string;
};

export type GetUserDiaryErrorCode =
  | "auth_failed"
  | "diary_not_found"
  | "diary_query_failed"
  | "corrections_query_failed";

export type GetUserDiaryResult =
  | {
      success: true;
      diaryData: Record<string, unknown> & {
        corrections: Record<string, unknown>[];
      };
    }
  | {
      success: false;
      code: GetUserDiaryErrorCode;
      message: string;
      diaryData: null;
    };
