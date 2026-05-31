import { diffWords } from "diff";

export type DiffPart = {
  type: "added" | "unchanged";
  value: string;
};

export function getRevisedDiffParts(
  original: string,
  revised: string,
): DiffPart[] {
  return diffWords(original, revised)
    .filter((part) => !part.removed)
    .map((part) => {
      return {
        type: part.added ? "added" : "unchanged",
        value: part.value,
      };
    });
}

export function highlightDiff(original: string, revised: string) {
  return getRevisedDiffParts(original, revised).map((part, index) => {
    if (part.type === "added") {
      return <mark key={index}>{part.value}</mark>;
    }
    return <span key={index}>{part.value}</span>;
  });
}
