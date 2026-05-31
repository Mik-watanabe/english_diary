import Home from "@/app/page";
import { redirect } from "next/navigation";
import { vi, test, describe, expect } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Home tests", () => {
  test("should redirect to /diary", () => {
    Home();
    expect(redirect).toHaveBeenCalledWith("/diary");
  });
});
