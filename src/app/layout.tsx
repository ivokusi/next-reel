import AuthProvider from "@/components/Auth";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> 
      <body className={`${montserrat.className} bg-black w-screen h-screen flex items-center justify-center`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
