import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from '../components/ProtectedRoute';
import ClientLayout from './ClientLayout';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PASS IT ALONG - Dashboard",
  description: "PASS IT ALONG - Dashboard",
  icons: {
    icon: [{ url: "/favicon_white.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>PASS IT ALONG - Dashboard</title>
        <link rel="icon" href="/favicon_white.svg" type="image/svg+xml" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} antialiased h-screen`}
      >
        {/* <AuthGuard> */}
        <ProtectedRoute>
          <ClientLayout>
            {children}
            <Toaster />
          </ClientLayout>
        </ProtectedRoute>
        {/* </AuthGuard> */}
      </body>
    </html>
  );
}
