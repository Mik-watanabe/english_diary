import CreateDiaryPage from "@/app/diary/create/page";
import { fireEvent, render, waitFor } from "@testing-library/react";

// --- hoisted mocks ---
const mockNotFound = vi.hoisted(() => vi.fn());
const mockUseSearchParams = vi.hoisted(() => vi.fn());
const mockShowErrorToast = vi.hoisted(() => vi.fn());
const mockFetch = vi.hoisted(() => vi.fn());

vi.mock("next/navigation", () => ({
  notFound: mockNotFound,
  useSearchParams: mockUseSearchParams,
}));

vi.mock("@/lib/show-toast", () => ({
  showErrorToast: mockShowErrorToast,
}));

vi.stubGlobal("fetch", mockFetch);

vi.mock("@/app/ui/diary/save-diary-dialog", () => ({
  default: vi.fn(() => <div>SaveDiaryDialog</div>),
}));

vi.mock("@/app/ui/diary/diary-editor", () => ({
  default: ({ handleRevise }: { handleRevise: (value: string) => void }) => (
    <button onClick={() => handleRevise("test diary value")}>
      AI review & Correct
    </button>
  ),
}));

vi.mock("@/app/ui/diary/tabs", () => ({
  default: vi.fn(() => <div>DiaryTabs</div>),
}));

vi.mock("@/app/ui/diary/section-heading", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const VALID_DATE = "2026-01-01";

const revisedResponse = {
  corrections: [],
  alternative: "test alternative value",
  original: "test original value",
  revised: "test revised value",
};

function mockValidDate() {
  mockUseSearchParams.mockReturnValue(
    new URLSearchParams(`date=${VALID_DATE}`),
  );
}

function mockFetchSuccess() {
  mockFetch.mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue(revisedResponse),
  });
}

function mockFetchFailure() {
  mockFetch.mockResolvedValue({
    ok: false,
    json: vi.fn().mockResolvedValue({ error: "test error" }),
  });
}

function renderPage() {
  return render(<CreateDiaryPage />);
}

async function clickRevise(page: ReturnType<typeof render>) {
  await fireEvent.click(page.getByText("AI review & Correct"));
}

describe("date validation", () => {
  test.each([{ date: "2026" }, { date: "2026-01" }, { date: "aaa" }])(
    "calls notFound when date is invalid ($date)",
    ({ date }) => {
      mockUseSearchParams.mockReturnValue(new URLSearchParams(`date=${date}`));
      renderPage();
      expect(mockNotFound).toHaveBeenCalledOnce();
    },
  );

  test("calls notFound when date param is missing", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    renderPage();
    expect(mockNotFound).toHaveBeenCalledOnce();
  });

  test("renders the page when date is valid", () => {
    mockValidDate();
    const page = renderPage();
    expect(page.getByText("🌤️ How was your day?")).toBeInTheDocument();
    expect(page.getByText("SaveDiaryDialog")).toBeInTheDocument();
    expect(page.getByText("AI review & Correct")).toBeInTheDocument();
    expect(mockNotFound).not.toHaveBeenCalled();
  });
});

describe("handleRevise", () => {
  beforeEach(() => {
    mockValidDate();
  });

  test("show revised diary, ai feedback, and diary tabs on success", async () => {
    mockFetchSuccess();
    const page = renderPage();
    await clickRevise(page);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/revise-diary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalDiary: "test diary value" }),
      });
      expect(page.getByText(/Revised Diary/i)).toBeInTheDocument();
      expect(page.getByText(/AI Feedback/i)).toBeInTheDocument();
      expect(page.getByText(/DiaryTabs/i)).toBeInTheDocument();
    });
  });

  test("renders error toast when API returns not ok response", async () => {
    mockFetchFailure();
    const page = renderPage();
    await clickRevise(page);

    await waitFor(() => {
      expect(mockShowErrorToast).toHaveBeenCalledWith(
        "Failed to revise diary. Please try again.",
      );
    });
  });
});
