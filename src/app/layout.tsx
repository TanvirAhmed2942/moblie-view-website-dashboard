import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import localFont from "next/font/local";
import "./globals.css";
import ReduxProvider from "@/redux/Provider";
import { Toaster } from "sonner";
import AuthInitializer from "@/components/AuthInitializer";
import { SocketProvider } from "@/contexts/SocketContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// const myFont = localFont({
//   src: "/public/font/fonnts.com-Degular_Variable.otf",
//   variable: "--font-degular-variable",
// });

export const metadata: Metadata = {
  title: "Fund Raise Dashboard",
  description: "Fund Raise Dashboard",
  icons: {
    icon: [{ url: "/Logo.png", type: "image/svg+xml" }],
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
        <link rel="icon" href="/Logo.png" type="image/png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}   antialiased h-screen`}
      >
        <ReduxProvider>
          <SocketProvider>
            <AuthInitializer />
            {children}
            <Toaster
              position="top-right"
              expand={true}
              richColors={true}
              closeButton={true}
            />
          </SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
