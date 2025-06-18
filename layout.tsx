import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/app/components/theme-provider';
import { Toaster } from 'sooner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FeedbackPro - Modern Feedback Collection Tool',
  description: 'Collect and analyze user feedback with beautiful real-time dashboard and analytics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark" storageKey="feedback-theme">
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(17, 24, 39, 0.8)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}