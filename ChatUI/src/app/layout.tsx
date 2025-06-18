import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ServiceProvider } from "@/services/ServiceProvider";
import { ChatProvider } from "@/context/ChatContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// App name is set at build time from environment variables
const appName = process.env.NEXT_PUBLIC_APP_NAME || 'ChatUI';

export const metadata: Metadata = {
  title: appName,
  description: "Modern chat interface with standard and multi-agent modes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ServiceProvider>
            <ChatProvider>
              {children}
            </ChatProvider>
          </ServiceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
