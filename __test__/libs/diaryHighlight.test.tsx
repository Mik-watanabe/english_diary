import { getRevisedDiffParts, highlightDiff } from "@/lib/diary/diaryHighlight";
import { describe, test, expect } from "vitest";
import { render } from "@testing-library/react";

describe("diaryHighlight", () => {
  describe("getRevisedDiffParts", () => {
    test("returns a single unchanged part when original and revised are identical", () => {
      const original = "The quick brown fox jumps over the lazy dog";
      const revised = "The quick brown fox jumps over the lazy dog";
      const diffParts = getRevisedDiffParts(original, revised);

      expect(diffParts).toEqual([
        {
          type: "unchanged",
          value: "The quick brown fox jumps over the lazy dog",
        },
      ]);
    });

    test("splits revised text into unchanged and added parts when a word is replaced", () => {
      const original = "The quick brown fox jumps over the lazy dog";
      const revised = "The quick brown fox jumps over the happy dog";
      const diffParts = getRevisedDiffParts(original, revised);

      expect(diffParts).toEqual([
        { type: "unchanged", value: "The quick brown fox jumps over the " },
        { type: "added", value: "happy" },
        { type: "unchanged", value: " dog" },
      ]);
    });
  });

  describe("highlightDiff", () => {
    test("wraps added words in <mark> elements", () => {
      const { container } = render(
        <>{highlightDiff("it was excited", "it was exciting")}</>,
      );

      expect(container.querySelector("mark")).toHaveTextContent("exciting");
      expect(container.querySelector("span")).toBeDefined();
    });

    test("renders unchanged text in <span> without <mark>", () => {
      const { container } = render(
        <>{highlightDiff("it was excited", "it was excited")}</>,
      );

      expect(container.querySelector("span")).toBeDefined();

      expect(container.querySelector("mark")).toBeNull();
    });
  });
});
