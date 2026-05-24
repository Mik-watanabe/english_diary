"use server";

import { createClient } from "@/lib/supabase/server";
import {
  GetUserDiaryResult,
  DiaryData,
  DiaryEvent,
  GetUserDiaryTitleByMonthResult,
} from "@/types/diary";
import moment from "moment";

export async function getUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return {
      success: false,
      message: "Failed to get user",
      errors: {},
    };
  }
  return {
    success: true,
    userData: data.user,
  };
}

export async function getUserDiary(date: string): Promise<GetUserDiaryResult> {
  const userResult = await getUser();
  if (!userResult.success || !userResult.userData?.id) {
    return {
      success: false,
      code: "auth_failed",
      message: !userResult.success
        ? (userResult.message ?? "Failed to get user")
        : "No user data",
      diaryData: null,
    };
  }

  const supabase = await createClient();
  const { data: rowDiaryData, error: diaryError } = await supabase
    .from("diaries")
    .select("*")
    .eq("user_id", userResult.userData.id)
    .eq("diary_date", date)
    .limit(1);

  if (diaryError) {
    return {
      success: false,
      code: "diary_query_failed",
      message: diaryError.message,
      diaryData: null,
    };
  }

  if (!rowDiaryData?.length) {
    return {
      success: false,
      code: "diary_not_found",
      message: "No diary for this date",
      diaryData: null,
    };
  }

  const { data: rowCorrectionsData, error: correctionsError } = await supabase
    .from("corrections")
    .select("*")
    .eq("diary_id", rowDiaryData[0].id);

  if (correctionsError) {
    return {
      success: false,
      code: "corrections_query_failed",
      message: correctionsError.message,
      diaryData: null,
    };
  }

  const correctionsData =
    rowCorrectionsData?.map((correction) => ({
      original: correction.original_text,
      revised: correction.revised_text,
      why: correction.reason,
    })) || [];

  return {
    success: true,
    diaryData: {
      title: rowDiaryData[0].title,
      original: rowDiaryData[0].original_content,
      revised: rowDiaryData[0].revised_content,
      alternative: rowDiaryData[0].alternative_content,
      date: rowDiaryData[0].diary_date,
      corrections: correctionsData,
    } as DiaryData,
  };
}

export async function getUserDiaryTitleByMonth(
  startDate: string,
  endDate: string,
): Promise<GetUserDiaryTitleByMonthResult> {
  const userResult = await getUser();
  if (!userResult.success || !userResult.userData?.id) {
    return {
      success: false,
      code: "auth_failed",
      message: !userResult.success
        ? (userResult.message ?? "Failed to get user")
        : "No user data",
      diaryData: null,
    };
  }

  const supabase = await createClient();
  const { data: rowDiaryData, error: diaryError } = await supabase
    .from("diaries")
    .select("title, diary_date")
    .eq("user_id", userResult.userData.id)
    .gte("diary_date", startDate)
    .lte("diary_date", endDate);

  if (diaryError) {
    return {
      success: false,
      code: "diary_query_failed",
      message: diaryError.message,
      diaryData: null,
    };
  }

  const diaryTitles =
    rowDiaryData?.map((diary) => {
      const date = moment(diary.diary_date, "YYYY-MM-DD").toDate();
      return {
        title: diary.title,
        start: date,
        end: date,
        allDay: true,
      };
    }) || [];

  return {
    success: true,
    diaryData: diaryTitles as DiaryEvent[],
  };
}
