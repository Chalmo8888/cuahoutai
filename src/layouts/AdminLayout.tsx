import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-secondary/20 to-background">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
