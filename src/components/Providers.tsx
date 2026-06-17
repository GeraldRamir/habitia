"use client";

import { usePathname } from "next/navigation";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastContainer } from "@/components/ui/Toast";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  return (
    <AppProvider>
      {!isDashboard && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isDashboard && <Footer />}
      <ToastContainer />
    </AppProvider>
  );
}
