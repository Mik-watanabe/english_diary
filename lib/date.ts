import moment, { Moment } from "moment";

export function parseDiaryDate(
  rawDate: string | null,
  format = "YYYY-MM-DD",
): Moment | null {
  if (!rawDate) return null;
  // Strictly validate the date format (YYYY-MM-DD) and return null if it is not valid
  const date = moment(rawDate, format, true);

  return date.isValid() ? date : null;
}
