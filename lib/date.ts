import moment, { Moment } from "moment";

export function parseDiaryDate(
  rawDate: string | null,
  format = "YYYY-MM-DD",
): Moment | null {
  if (!rawDate) return null;

  const date = moment(rawDate, format, true);

  return date.isValid() ? date : null;
}
