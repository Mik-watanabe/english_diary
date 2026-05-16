import { Toaster } from "sonner";
import { DiaryCreateHeader } from "./diary-create-header";

export default function DiaryCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DiaryCreateHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-8 pb-16">
        <Toaster />
        {children}
      </main>
    </>
  );
}
