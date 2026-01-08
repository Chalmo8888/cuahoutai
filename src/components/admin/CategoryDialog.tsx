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
    order: 0,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        order: category.order,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        order: 0,
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

          <div className="space-y-2">
            <Label htmlFor="cat-order">排序</Label>
            <Input
              id="cat-order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
              placeholder="数字越小越靠前"
            />
          </div>

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
