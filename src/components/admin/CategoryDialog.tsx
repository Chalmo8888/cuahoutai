import { useEffect, useState } from 'react';
import { Category } from '@/types/admin';
import { useData } from '@/contexts/DataContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
}

export default function CategoryDialog({ open, onClose, category }: CategoryDialogProps) {
  const { addCategory, updateCategory } = useData();
  const isEdit = !!category;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('请输入分类名称');
      return;
    }

    if (isEdit && category) {
      updateCategory(category.id, formData);
      toast.success('分类更新成功');
    } else {
      addCategory(formData);
      toast.success('分类创建成功');
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? '编辑分类' : '新增分类'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="cat-name">分类名称 <span className="text-destructive">*</span></Label>
            <Input
              id="cat-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="请输入分类名称"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cat-desc">分类描述</Label>
            <Textarea
              id="cat-desc"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="请输入分类描述（可选）"
              rows={3}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            分类展示顺序请在分类列表中通过拖拽调整
          </p>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" className="flex-1">
              保存
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
