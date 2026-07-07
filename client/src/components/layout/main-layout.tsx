import { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
// 1. Elimina la línea: import { Navbar } from "@/components/navbar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 antialiased font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto bg-slate-950">
        <main className="flex-1 p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}