import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ActionEngagementProvider } from '@/context/ActionEngagementContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { InteractionProvider } from '@/context/InteractionContext';
import { ExploreProvider } from '@/context/ExploreContext';
import MainLayout from '@/components/MainLayout';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Science for Action",
  description: "Science for people who give a shit. Take action on what matters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-background text-text`} suppressHydrationWarning>
        <InteractionProvider>
          <ProfileProvider>
            <ActionEngagementProvider>
              <ExploreProvider>
                <MainLayout>
                  {children}
                </MainLayout>
              </ExploreProvider>
            </ActionEngagementProvider>
          </ProfileProvider>
        </InteractionProvider>
      </body>
    </html>
  );
}
