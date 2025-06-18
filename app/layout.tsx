
import "../global.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/app/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Feedback App",
  description: "Collect feedback with a sleek UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
