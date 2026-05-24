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
  | SuccessGetUserDiaryResult
  | ErrorGetUserDiaryResult;

export type SuccessGetUserDiaryResult = {
  success: true;
  diaryData: DiaryData;
};

export type ErrorGetUserDiaryResult = {
  success: false;
  code: GetUserDiaryErrorCode;
  message: string;
  diaryData: null;
};

export type GetUserDiaryTitleByMonthResult =
  | SuccessGetUserDiaryTitleByMonthResult
  | ErrorGetUserDiaryTitleByMonthResult;

export type SuccessGetUserDiaryTitleByMonthResult = {
  success: true;
  diaryData: DiaryEvent[];
};

export type ErrorGetUserDiaryTitleByMonthResult = {
  success: false;
  code: "auth_failed" | "diary_query_failed";
  message: string;
  diaryData: null;
};

export type DiaryEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
};

export type SignupState = {
  success: boolean;
  message: string;
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
};
