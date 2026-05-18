export function DiaryHeader({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E5EDF8] bg-white backdrop-blur">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        {children}
      </div>
    </header>
  );
}
