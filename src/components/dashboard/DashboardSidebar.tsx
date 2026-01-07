import { Home, Plus, List, LogOut, Building2, X, Menu } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'لوحة التحكم', path: '/dashboard' },
  { icon: Plus, label: 'أضف عقار جديد', path: '/dashboard/add' },
  { icon: List, label: 'قائمة العقارات', path: '/dashboard/properties' },
];

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const location = useLocation();
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed right-0 top-0 z-50 h-screen w-72 gradient-sidebar shadow-xl transition-transform duration-300 lg:translate-x-0',
          isOpen ? 'translate-x-0 animate-slide-in-right' : 'translate-x-full lg:translate-x-0',
          'lg:w-64'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-4 lg:px-6 lg:py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
                <Building2 className="h-6 w-6 text-sidebar-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">عقاراتي</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 lg:py-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-md'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
          
          {/* User Section */}
          <div className="border-t border-sidebar-border p-4">
            <div className="mb-3 flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground">
                <span className="text-sm font-semibold">أح</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-sidebar-foreground">أحمد محمد</p>
                <p className="text-xs text-sidebar-foreground/60">مستخدم</p>
              </div>
            </div>
            <button className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground">
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border bg-card p-2 shadow-sm transition-colors hover:bg-accent lg:hidden"
    >
      <Menu className="h-6 w-6 text-foreground" />
    </button>
  );
}
