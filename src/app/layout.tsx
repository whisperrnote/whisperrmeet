import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WhisperMeet - Secure Video Conferencing",
  description: "End-to-end encrypted video meetings and live streaming platform. Free, secure, and easy to use.",
  keywords: "video conferencing, online meetings, secure video calls, live streaming, end-to-end encryption",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans antialiased h-full bg-gray-50 dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}
