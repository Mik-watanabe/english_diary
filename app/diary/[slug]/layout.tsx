import { DetailHeader } from "@/app/ui/diary/detail-header";

export default function DiaryDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DetailHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-8 pb-16">
        {children}
      </main>
    </>
  );
}
