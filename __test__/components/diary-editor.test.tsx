import { fireEvent, render, RenderResult } from "@testing-library/react";
import DiaryEditor, { MAX_WORDS } from "@/app/ui/diary/diary-editor";

describe("DiaryEditor", () => {
  describe("with loading false", () => {
    let screen: RenderResult;
    let handleRevise: (diaryValue: string) => void;
    beforeEach(() => {
      handleRevise = vi.fn();
      const loading = false;
      screen = render(
        <DiaryEditor handleRevise={handleRevise} loading={loading} />,
      );
    });

    test("renders textarea with initial word count and enabled submit button", () => {
      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(screen.getByText(`0/${MAX_WORDS}`)).toBeInTheDocument();
      expect(screen.getByRole("button")).toHaveTextContent(
        "AI review & Correct",
      );
      expect(screen.getByRole("button")).toBeEnabled();
    });

    test("displays the text in the text area", () => {
      const textArea = screen.getByRole("textbox");
      fireEvent.change(textArea, { target: { value: "Hello, world!" } });
      expect(textArea).toHaveValue("Hello, world!");
      // and should show the expected word count
      expect(screen.getByText(`2/${MAX_WORDS}`)).toBeInTheDocument();
    });

    test.for([
      { words: 0, expectedErrorMessage: "Please enter at least 5 words" },
      {
        words: 4,
        expectedErrorMessage: "Please enter at least 5 words",
      },
      {
        words: 126,
        expectedErrorMessage: "You have reached the maximum word limit",
      },
    ])(
      "displays error message : $expectedErrorMessage when $words words are entered",
      ({ words, expectedErrorMessage }) => {
        const textArea = screen.getByRole("textbox");
        const testWords = createWords(words);
        fireEvent.change(textArea, { target: { value: testWords } });
        expect(textArea).toHaveValue(testWords);

        fireEvent.click(screen.getByRole("button"));
        expect(
          screen.getByText(new RegExp(expectedErrorMessage, "i")),
        ).toBeInTheDocument();
        expect(handleRevise).not.toHaveBeenCalled();
      },
    );

    test.for([5, 125])(
      `calls handleRevise when %i words are entered`,
      (words) => {
        const textArea = screen.getByRole("textbox");
        const testWords = createWords(words);

        fireEvent.change(textArea, { target: { value: testWords } });
        expect(textArea).toHaveValue(testWords);
        fireEvent.click(screen.getByRole("button"));
        expect(handleRevise).toHaveBeenCalledWith(testWords);
      },
    );
  });

  describe("with loading true", () => {
    // while submitting, loading will be true, so the button should be disabled and include a loading spinner
    let screen: RenderResult;
    let handleRevise: (diaryValue: string) => void;
    beforeEach(() => {
      handleRevise = vi.fn();
      const loading = true;
      screen = render(
        <DiaryEditor handleRevise={handleRevise} loading={loading} />,
      );
    });

    test("disables submit button", () => {
      expect(screen.getByRole("button")).toBeDisabled();
    });

    test("shows loading spinner", () => {
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    test("textarea is read only", () => {
      expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
    });
  });
});

const createWords = (count: number) => Array(count).fill("test").join(" ");
