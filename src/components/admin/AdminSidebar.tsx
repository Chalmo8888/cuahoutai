import { NavLink, useLocation } from 'react-router-dom';
import { ListTodo, FolderOpen, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin/tasks', icon: ListTodo, label: '任务管理', exact: true },
  { to: '/admin/categories', icon: FolderOpen, label: '分类管理' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-60 min-h-screen bg-sidebar flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-xl bg-sidebar-primary flex items-center justify-center">
          <span className="text-lg font-bold text-sidebar-primary-foreground">C</span>
        </div>
        <span className="ml-3 text-lg font-semibold text-sidebar-foreground">CUA 后台</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive: active }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                active || isActive(item.to, item.exact)
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-destructive transition-all"
        >
          <LogOut className="h-5 w-5" />
          退出登录
        </button>
      </div>
    </aside>
  );
}
