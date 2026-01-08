import { useState, useMemo } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import TaskDrawer from '@/components/admin/TaskDrawer';
import { useData } from '@/contexts/DataContext';
import { Task } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card } from '@/components/ui/card';
import { Plus, Search, Pencil, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableRowProps {
  task: Task;
  getCategoryById: (id: string) => { name: string } | undefined;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function SortableRow({ task, getCategoryById, onEdit, onDelete }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-[40px]">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </TableCell>
      <TableCell className="font-medium">{task.name}</TableCell>
      <TableCell>{getCategoryById(task.categoryId)?.name || '-'}</TableCell>
      <TableCell>
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${task.isVisible ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
          {task.isVisible ? '展示中' : '已隐藏'}
        </span>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {format(task.updatedAt, 'yyyy-MM-dd HH:mm')}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(task)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function TasksPage() {
  const { tasks, categories, deleteTask, getCategoryById, reorderTasks } = useData();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sort tasks by order for display
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => a.order - b.order);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return sortedTasks.filter((task) => {
      const matchesSearch = task.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || task.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [sortedTasks, search, categoryFilter]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedTasks.findIndex((t) => t.id === active.id);
      const newIndex = sortedTasks.findIndex((t) => t.id === over.id);
      const newOrder = arrayMove(sortedTasks, oldIndex, newIndex);
      reorderTasks(newOrder.map((t) => t.id));
      toast.success('任务顺序已更新');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setDrawerOpen(true);
  };

  const handleAdd = () => {
    setEditingTask(null);
    setDrawerOpen(true);
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      toast.success('任务已删除');
    }
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  // Check if we can drag (only when showing all tasks without filter)
  const canDrag = search === '' && categoryFilter === 'all';

  return (
    <>
      <AdminHeader title="任务管理" />
      <div className="flex-1 p-6 overflow-auto">
        <Card className="border-0 shadow-card">
          {/* Toolbar */}
          <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="搜索任务名称..."
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="全部分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              新增任务
            </Button>
          </div>

          {/* Drag hint */}
          {!canDrag && (
            <div className="px-4 py-2 bg-muted/50 text-xs text-muted-foreground">
              提示：清除搜索和分类筛选后可拖拽调整任务顺序
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead className="min-w-[200px]">任务名称</TableHead>
                    <TableHead className="min-w-[100px]">所属分类</TableHead>
                    <TableHead className="min-w-[80px]">状态</TableHead>
                    <TableHead className="min-w-[140px]">更新时间</TableHead>
                    <TableHead className="w-[100px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        暂无数据
                      </TableCell>
                    </TableRow>
                  ) : canDrag ? (
                    <SortableContext
                      items={filteredTasks.map((t) => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {filteredTasks.map((task) => (
                        <SortableRow
                          key={task.id}
                          task={task}
                          getCategoryById={getCategoryById}
                          onEdit={handleEdit}
                          onDelete={handleDeleteClick}
                        />
                      ))}
                    </SortableContext>
                  ) : (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="w-[40px]">
                          <GripVertical className="h-4 w-4 text-muted-foreground/30" />
                        </TableCell>
                        <TableCell className="font-medium">{task.name}</TableCell>
                        <TableCell>{getCategoryById(task.categoryId)?.name || '-'}</TableCell>
                        <TableCell>
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${task.isVisible ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                            {task.isVisible ? '展示中' : '已隐藏'}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(task.updatedAt, 'yyyy-MM-dd HH:mm')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(task)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(task)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
        </Card>
      </div>

      <TaskDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        task={editingTask}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除任务「{taskToDelete?.name}」，不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
