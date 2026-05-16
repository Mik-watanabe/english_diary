import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "English Diary",
  description: "English Diary is a tool that helps you practice your English writing skills by AI based corrections and let you pratice speaking English by listening to the AI generated audio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fbfbff]">{children}</body>
    </html>
  );
}
