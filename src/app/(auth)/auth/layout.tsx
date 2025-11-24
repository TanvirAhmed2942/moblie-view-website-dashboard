import Image from "next/image";
import "../../globals.css";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#cfc7d6] flex items-center justify-center w-full h-[100vh] relative overflow-hidden">
      {/* Top-left decorative image */}
      <Image
        src="/auth/top_left.png"
        alt="auth-bg"
        width={1000}
        height={1000}
        className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] absolute top-5 left-20  opacity-60 grayscale -translate-x-20 xl:-translate-x-30 -translate-y-20 xl:-translate-y-30 xl:scale-90 2xl:scale-100 object-contain"
        priority
      />
      {/* Bottom-right decorative image */}
      <Image
        src="/auth/bottom_right.png"
        alt="auth-bg"
        width={1000}
        height={1000}
        className="w-[600px] h-[600px] md:w-[800px] md:h-[800px] absolute -bottom-10 right-24 opacity-60 grayscale translate-x-20  xl:translate-x-34 translate-y-30 object-contain xl:scale-90 2xl:scale-110"
        priority
      />

      {/* Form content - positioned on top */}
      <div className="relative z-10 w-full flex items-center justify-center px-4">
        {children}
      </div>
    </div>
  );
}
