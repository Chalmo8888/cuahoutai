import AdminHeader from '@/components/admin/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { ListTodo, FolderOpen, Eye, EyeOff } from 'lucide-react';

export default function Dashboard() {
  const { tasks, categories } = useData();

  const visibleTasks = tasks.filter(t => t.isVisible).length;
  const hiddenTasks = tasks.filter(t => !t.isVisible).length;

  const stats = [
    {
      title: '总任务数',
      value: tasks.length,
      icon: ListTodo,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: '分类数量',
      value: categories.length,
      icon: FolderOpen,
      color: 'bg-emerald-500/10 text-emerald-600',
    },
    {
      title: '已展示',
      value: visibleTasks,
      icon: Eye,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: '已隐藏',
      value: hiddenTasks,
      icon: EyeOff,
      color: 'bg-amber-500/10 text-amber-600',
    },
  ];

  return (
    <>
      <AdminHeader title="概览" />
      <div className="flex-1 p-6 overflow-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-0 shadow-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Tasks */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">最近任务</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => {
                const category = categories.find(c => c.id === task.categoryId);
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{task.name}</p>
                      <p className="text-sm text-muted-foreground">{category?.name || '未分类'}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${task.isVisible ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {task.isVisible ? '展示中' : '已隐藏'}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
