import type { Metadata } from "next";
import { Domine, PT_Serif } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { FileProvider } from "@/contexts/file-context";
import "./globals.css";

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin"],
  weight: ["400", "700"]
});

const domine = Domine({
  variable: "--font-domine",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memoro",
  description: "A personal growth application for tracking your life",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ptSerif.variable} ${domine.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FileProvider>
            {children}
          </FileProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
