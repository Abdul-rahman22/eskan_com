import { ReactNode, useState } from 'react';
import { DashboardSidebar, MobileMenuButton } from './DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Mobile Header */}
      <div className="fixed right-0 top-0 z-30 flex w-full items-center justify-between bg-card/95 px-4 py-3 shadow-sm backdrop-blur-sm lg:hidden">
        <MobileMenuButton onClick={() => setSidebarOpen(true)} />
        <h1 className="text-lg font-bold text-foreground">عقاراتي</h1>
        <div className="w-10" />
      </div>
      
      <main className="min-h-screen pt-16 lg:mr-64 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
