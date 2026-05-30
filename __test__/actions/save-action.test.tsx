import {
  saveDiary,
  validateSaveDiaryFormData,
} from "@/app/actions/diary/save-action";

const { mockRpc } = vi.hoisted(() => ({
  mockRpc: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    rpc: mockRpc,
  })),
}));
describe("saveDiary", () => {
  const initialFormData = {
    title: "Test Title",
    date: "2026-01-01",
    original_content: "Test Original Content",
    revised_content: "Test Revised Content",
    // corrections: [{ original: "Test Original", revised: "Test Revised", why: "Test Why" }],
    alternative_content: "Test Alternative Content",
  };

  const initialState = {
    success: false,
    message: "",
    errors: {},
  };

  const setCorrections = (formData: FormData) => {
    formData.set(
      "corrections",
      JSON.stringify([
        { original: "Test Original", revised: "Test Revised", why: "Test Why" },
      ]),
    );
  };

  const setFormData = (formData: FormData) => {
    Object.entries(initialFormData).forEach(([key, value]) => {
      formData.set(key, value);
    });
  };

  describe("form validation", () => {
    test.for([
      { attr: "title" },
      { attr: "date" },
      { attr: "original_content" },
      { attr: "revised_content" },
      { attr: "alternative_content" },
    ])("returns failure when $attr is empty", async ({ attr }) => {
      const formData = new FormData();

      setCorrections(formData);
      setFormData(formData);
      formData.set(attr, "");

      const result = await validateSaveDiaryFormData(formData);
      expect(result.success).toBeFalsy();
    });

    test("returns failure when title only contains whitespace", async () => {
      const formData = new FormData();
      setCorrections(formData);
      setFormData(formData);
      formData.set("title", "   ");
      const result = await validateSaveDiaryFormData(formData);
      expect(result.success).toBeFalsy();
    });

    test.for([{ date: "2026-01" }, { date: "2026" }, { date: "aaa" }])(
      "returns failure when date format is invalid",
      async ({ date }) => {
        const formData = new FormData();
        setCorrections(formData);

        setFormData(formData);
        formData.set("date", date);

        const result = await validateSaveDiaryFormData(formData);
        expect(result.success).toBeFalsy();
      },
    );

    test("returns failure when corrections are not JSON stringified", async () => {
      const formData = new FormData();
      setFormData(formData);
      formData.set("corrections", "not a JSON string");
      const result = await validateSaveDiaryFormData(formData);
      expect(result.success).toBeFalsy();
    });

    test("returns failure when corrections elements are not valid", async () => {
      const formData = new FormData();
      setFormData(formData);
      //   missing why field
      formData.set(
        "corrections",
        JSON.stringify([
          { original: "Test Original", revised: "Test Revised" },
        ]),
      );
      const result = await validateSaveDiaryFormData(formData);
      expect(result.success).toBeFalsy();
    });

    test("returns success when corrections are empty", async () => {
      const formData = new FormData();
      setFormData(formData);

      formData.set("corrections", JSON.stringify([]));
      const result = await validateSaveDiaryFormData(formData);

      expect(result.success).toBeTruthy();
    });

    test("returns success when corrections are valid", async () => {
      const formData = new FormData();
      setFormData(formData);
      setCorrections(formData);
      const result = await validateSaveDiaryFormData(formData);

      expect(result.success).toBeTruthy();
    });
  });

  describe("supabase integration", () => {
    const buildValidatedFormData = () => {
      const formData = new FormData();
      setFormData(formData);
      setCorrections(formData);
      return formData;
    };

    test("returns failure without calling rpc when validation fails", async () => {
      const formData = new FormData();
      setFormData(formData);
      formData.set("title", ""); // invalid
      const result = await saveDiary(initialState, formData);
      expect(result).toEqual({
        success: false,
        message: "Failed to save diary. Please try again.",
        errors: {},
      });
      expect(mockRpc).not.toHaveBeenCalled();
    });

    test("calls save_diary_with_corrections RPC with validated form data", async () => {
      mockRpc.mockResolvedValueOnce({
        success: true,
        data: { id: "123" },
        error: null,
      });

      const formData = buildValidatedFormData();

      const result = await saveDiary(initialState, formData);
      expect(mockRpc).toHaveBeenCalledWith("save_diary_with_corrections", {
        p_title: "Test Title",
        p_diary_date: new Date("2026-01-01"),
        p_original_content: "Test Original Content",
        p_revised_content: "Test Revised Content",
        p_corrections: [
          {
            original: "Test Original",
            revised: "Test Revised",
            why: "Test Why",
          },
        ],
        p_alternative_content: "Test Alternative Content",
      });
      expect(result).toEqual({
        success: true,
        message: "Diary saved successfully.",
        diaryId: { id: "123" },
      });
    });

    test("returns failure when Supabase rpc fails", async () => {
      mockRpc.mockResolvedValueOnce({
        data: null,
        error: { message: "duplicate key value violates unique constraint" },
      });

      const formData = buildValidatedFormData();

      const result = await saveDiary(initialState, formData);
      expect(result).toEqual({
        success: false,
        message: "duplicate key value violates unique constraint",
      });
    });
  });
});
