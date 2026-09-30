import type { ReactNode } from "react";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-cream-paper text-ink-black selection:bg-ash">
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-ash bg-pure-white sticky top-0 z-40">
          <h1 className="font-nantes text-[20px]">Admin Portal</h1>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-ink-black hover:bg-ash/50 rounded-[4px]"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-ink-black/50 z-[45] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}