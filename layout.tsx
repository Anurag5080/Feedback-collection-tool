import "../global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FeedbackPro - Modern Feedback Collection Tool",
  description: "Collect and analyze user feedback with beautiful real-time dashboard and analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: "bg-background text-foreground border border-border",
          }}
        />
      </body>
    </html>
  );
}
