import React from "react";
import { notFound, redirect } from "next/navigation";
import moment from "moment";
import {
  getUserDiary,
  type GetUserDiaryErrorCode,
} from "@/app/actions/diary/read-action";
import { highlightDiff } from "@/lib/diaryHighlight";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TextSpeechButton from "@/app/ui/diary/text-speech-button";

const logGetUserDiarySuccess = (diaryData: DiaryData) => {
  console.log("[getUserDiary]", diaryData);
};

const DiaryPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const date = moment(slug).format("YYYY-MM-DD");
  const result = await getUserDiary(date);

  if (!result.success) {
    const { code, message } = result;
    if (code === "auth_failed") {
      redirect("/login");
    }
    if (code === "diary_not_found") {
      notFound();
    }
    logGetUserDiaryFailure(code, message);
    notFound();
  }
  const {
    original,
    revised,
    corrections,
    alternative,
    date: diaryDate,
    title,
  } = result.diaryData;

  const rivisedWithHighlight = highlightDiff(original, revised);

  return (
    <div data-diary-id={String(result.diaryData.id ?? "")}>
      {/* TODO:This should be made into a common component. */}
      <h1 className="text-2xl font-bold mb-4">English Diary - {diaryDate}</h1>
      {/* TODO: result.diaryData / result.diaryData.corrections で本文・表を表示 */}
      <div className="grid grid-cols-2 border border-gray-300">
        <div>
          <h2 className="font-semibold text-center border-r border-gray-300 p-2">
            Your Diary
          </h2>
          <div className="border-t border-r border-gray-300 p-2 rounded-none">
            <textarea
              readOnly
              name="diary"
              id="diary"
              placeholder="Write about your day in english, what you did, how you felt etc 💭"
              rows={10}
              className="border-none w-full focus-within:outline-none"
              value={original}
            ></textarea>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-center p-2">
            Revised Diary by AI assistant
            <TextSpeechButton revisedText={revised} />
          </h2>
          <div className="border-t border-gray-300 p-2 rounded-none">
            <div className="whitespace-pre-wrap">{rivisedWithHighlight}</div>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Original</TableHead>
            <TableHead>Revised</TableHead>
            <TableHead>Why</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {corrections?.map((item, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{item.original}</TableCell>
              <TableCell>{item.revised}</TableCell>
              <TableCell>{item.why}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div>
        <h2 className="font-semibold text-left">Alternatives</h2>
        <div className="whitespace-pre-wrap">{alternative}</div>
      </div>
    </div>
  );
};

export default DiaryPage;
