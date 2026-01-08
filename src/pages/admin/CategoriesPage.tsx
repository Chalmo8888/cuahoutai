import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '@/components/admin/AdminHeader';
import CategoryDialog from '@/components/admin/CategoryDialog';
import { useData } from '@/contexts/DataContext';
import { Category } from '@/types/admin';
import { Button } from '@/components/ui/button';
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
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
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

interface SortableCategoryRowProps {
  category: Category;
  taskCount: number;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onTaskCountClick: (category: Category, count: number) => void;
}

function SortableCategoryRow({ 
  category, 
  taskCount, 
  onEdit, 
  onDelete,
  onTaskCountClick,
}: SortableCategoryRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-[50px]">
        <button
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell className="font-medium">{category.name}</TableCell>
      <TableCell className="text-muted-foreground">
        {category.description || '-'}
      </TableCell>
      <TableCell>
        <button
          onClick={() => onTaskCountClick(category, taskCount)}
          className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
        >
          {taskCount} 个任务
        </button>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(category)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { categories, tasks, deleteCategory, reorderCategories } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [noTaskDialogOpen, setNoTaskDialogOpen] = useState(false);
  const [noTaskCategory, setNoTaskCategory] = useState<Category | null>(null);

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

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.order - b.order);
  }, [categories]);

  const getTaskCount = (categoryId: string) => {
    return tasks.filter(t => t.categoryId === categoryId).length;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedCategories.findIndex((c) => c.id === active.id);
      const newIndex = sortedCategories.findIndex((c) => c.id === over.id);
      const newOrder = arrayMove(sortedCategories, oldIndex, newIndex);
      reorderCategories(newOrder.map((c) => c.id));
      toast.success('分类顺序已更新');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    const count = getTaskCount(category.id);
    if (count > 0) {
      toast.error(`该分类下还有 ${count} 个任务，无法删除`);
      return;
    }
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      toast.success('分类已删除');
    }
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleTaskCountClick = (category: Category, count: number) => {
    if (count === 0) {
      setNoTaskCategory(category);
      setNoTaskDialogOpen(true);
    } else {
      navigate(`/admin/tasks?category=${category.id}`);
    }
  };

  return (
    <>
      <AdminHeader title="分类管理" />
      <div className="flex-1 p-6 overflow-auto">
        <Card className="border-0 shadow-card">
          {/* Toolbar */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-medium">全部分类</h2>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              新增分类
            </Button>
          </div>

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
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="min-w-[150px]">分类名称</TableHead>
                    <TableHead className="min-w-[200px]">描述</TableHead>
                    <TableHead className="min-w-[100px]">任务数量</TableHead>
                    <TableHead className="w-[100px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        暂无数据
                      </TableCell>
                    </TableRow>
                  ) : (
                    <SortableContext
                      items={sortedCategories.map((c) => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {sortedCategories.map((category) => (
                        <SortableCategoryRow
                          key={category.id}
                          category={category}
                          taskCount={getTaskCount(category.id)}
                          onEdit={handleEdit}
                          onDelete={handleDeleteClick}
                          onTaskCountClick={handleTaskCountClick}
                        />
                      ))}
                    </SortableContext>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
        </Card>
      </div>

      <CategoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        category={editingCategory}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除分类「{categoryToDelete?.name}」，不可恢复。
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

      <AlertDialog open={noTaskDialogOpen} onOpenChange={setNoTaskDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>暂无任务</AlertDialogTitle>
            <AlertDialogDescription>
              分类「{noTaskCategory?.name}」下暂无任务。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setNoTaskDialogOpen(false)}>
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
