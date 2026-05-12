import React from "react";
import { diffWords } from "diff";


export function highlightDiff(original: string, revised: string) {
  const diff = diffWords(original, revised);
  return diff.filter((part) => !part.removed).map((part, index) => {
    if (part.added) {
      return <mark key={index}>{part.value}</mark>;
    }

    return <span key={index}>{part.value}</span>;
  });
}