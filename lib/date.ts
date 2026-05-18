import moment, { Moment } from "moment";

export function parseDiaryDate(rawDate: string | null): Moment | null {
  if (!rawDate) return null;

  const date = moment(rawDate, "YYYY-MM-DD", true);

  return date.isValid() ? date : null;
}
