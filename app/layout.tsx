import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers"; // Uses the file I made earlier
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Toaster } from "react-hot-toast";
import { AuthWrapper } from "@/components/wrappers/auth-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flight Logs Analsysis Tool",
  description: "Advanced Log Analysis Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gray-50 text-slate-900 h-screen overflow-hidden`}
      >
        <AuthWrapper>
          <Providers>
            <div className="flex h-full">
              <aside className="w-64 hidden md:flex flex-col border-r bg-slate-900 text-white shadow-xl z-20">
                <Sidebar />
              </aside>
              <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
                  {children}
                </main>
              </div>
            </div>
            <Toaster position="top-right" />
          </Providers>
        </AuthWrapper>
      </body>
    </html>
  );
}
