import { useState } from 'react';
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
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const { categories, tasks, deleteCategory } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const getTaskCount = (categoryId: string) => {
    return tasks.filter(t => t.categoryId === categoryId).length;
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">分类名称</TableHead>
                  <TableHead className="min-w-[200px]">描述</TableHead>
                  <TableHead className="min-w-[100px]">任务数量</TableHead>
                  <TableHead className="min-w-[80px]">排序</TableHead>
                  <TableHead className="w-[100px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {category.description || '-'}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {getTaskCount(category.id)} 个任务
                        </span>
                      </TableCell>
                      <TableCell>{category.order}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(category)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
    </>
  );
}
