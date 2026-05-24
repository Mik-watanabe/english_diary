import { CreateHeader } from "@/app/ui/diary/create-header";

export default function DiaryCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CreateHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-8 pb-16">
        {children}
      </main>
    </>
  );
}
