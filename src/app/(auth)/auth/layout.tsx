import "../../globals.css";
import AuthLayoutClient from "@/components/auth/AuthLayoutClient";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthLayoutClient>{children}</AuthLayoutClient>;
}
