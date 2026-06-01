import SaveDiaryDialog from "@/app/ui/diary/save-diary-dialog";
import { RevisedDiaryResponse } from "@/types/diary";
import { fireEvent, render, RenderResult } from "@testing-library/react";
import moment from "moment";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@/components/providers/UserProvider", () => ({
  useUser: () => ({
    user: { id: "test-user-id" },
    setUser: vi.fn(),
  }),
}));

const revisedDiaryResponse: RevisedDiaryResponse = {
  original: "Test Original",
  revised: "Test Revised",
  corrections: [],
  alternative: "Test Alternative",
};

const setup = (res: RevisedDiaryResponse | null) => {
  const date = moment("2026-01-01");
  return render(<SaveDiaryDialog revisedDiaryResponse={res} date={date} />);
};

describe("SaveDiaryDialog", () => {
  describe("trigger button", () => {
    test("disables Save Diary button when revisedDiaryResponse is null", () => {
      const screen = setup(null);
      expect(screen.getByRole("button", { name: "Save Diary" })).toBeDisabled();
    });

    test("enables Save Diary button when revisedDiaryResponse is valid", () => {
      const screen = setup(revisedDiaryResponse);
      expect(screen.getByRole("button", { name: "Save Diary" })).toBeEnabled();
    });
  });

  describe("when the dialog is open", () => {
    let screen: RenderResult;
    beforeEach(() => {
      screen = setup(revisedDiaryResponse);
      fireEvent.click(screen.getByRole("button", { name: "Save Diary" }));
    });

    test("renders dialog", () => {
      expect(screen.getByRole("dialog")).toBeVisible();
    });

    test("displays dialog header", () => {
      expect(
        screen.getByRole("heading", { name: "Enter a title for your diary" }),
      ).toBeInTheDocument();
    });
    test("renders empty title input", () => {
      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Max 50 characters")).toHaveValue("");
    });

    test.for([{ buttonName: "Save" }, { buttonName: "Cancel" }])(
      "displays button:$buttonName",
      ({ buttonName }) => {
        expect(
          screen.getByRole("button", { name: buttonName }),
        ).toBeInTheDocument();
      },
    );

    test("disables Save button when title is empty", () => {
      expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    });

    test("disables Save button when title is whitespace only", () => {
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "   " },
      });
      expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    });

    test("disables Save button when title exceeds 50 characters", () => {
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "a".repeat(51) },
      });
      expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    });

    test("enables Save button when title is exactly 50 characters", () => {
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "a".repeat(50) },
      });
      expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
    });

    test("closes dialog when overlay is clicked", () => {
      const overlay = document.querySelector(
        '[data-slot="dialog-overlay"]',
      ) as HTMLElement;

      expect(screen.queryByRole("dialog")).toBeInTheDocument();
      fireEvent.click(overlay);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    test("closes dialog when close icon is clicked", () => {
      const closeIcon = document.querySelector(
        '[data-slot="dialog-close"]',
      ) as HTMLElement;
      expect(screen.queryByRole("dialog")).toBeInTheDocument();
      fireEvent.click(closeIcon);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    test("closes dialog when Cancel button is clicked", () => {
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
