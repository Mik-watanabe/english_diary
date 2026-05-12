export default function DiaryLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <main className="max-w-7xl mx-auto w-full p-4">{children}</main>
  }