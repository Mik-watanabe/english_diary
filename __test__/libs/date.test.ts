import { describe, test, expect } from "vitest";
import { parseDiaryDate } from "@/lib/date";
import moment from "moment";

describe("parseDiaryDate", () => {
  test("should return null if the rawdate is null", () => {
    expect(parseDiaryDate(null)).toBeNull();
  });

  test("returns a Moment for a valid YYYY-MM-DD string (default format)", () => {
    const result = parseDiaryDate("2026-01-01");
    expect(result).not.toBeNull();
    expect(moment.isMoment(result)).toBe(true);
  });

  test("returns null when string does not match default YYYY-MM-DD format", () => {
    expect(parseDiaryDate("2026-01")).toBeNull();
  });

  test("returns null when string does not match custom format", () => {
    expect(parseDiaryDate("2026-01-01", "YYYY-MM")).toBeNull();
  });

  test("returns a Moment when string matches custom format", () => {
    const result = parseDiaryDate("2026-01", "YYYY-MM");
    expect(result).not.toBeNull();
    expect(moment.isMoment(result)).toBe(true);
  });

  test("returns null for invalid date strings", () => {
    expect(parseDiaryDate("aaa")).toBeNull();
    expect(parseDiaryDate("2026-01-44")).toBeNull();
  });

  test("returns null for empty string", () => {
    expect(parseDiaryDate("")).toBeNull();
  });
});
