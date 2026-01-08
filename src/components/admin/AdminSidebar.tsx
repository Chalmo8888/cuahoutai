import { NavLink, useLocation } from 'react-router-dom';
import { ListTodo, FolderOpen, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const navItems = [
  { to: '/admin/tasks', icon: ListTodo, label: '任务管理', exact: true },
  { to: '/admin/categories', icon: FolderOpen, label: '分类管理' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { logout, adminName } = useAuth();

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

      {/* User section at bottom */}
      <div className="p-3 border-t border-sidebar-border">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-sidebar-accent/50 transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  {adminName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-sidebar-foreground">{adminName}</p>
                <p className="text-xs text-muted-foreground">管理员</p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent 
            side="top" 
            align="start" 
            className="w-48 p-2"
          >
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              退出登录
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </aside>
  );
}
