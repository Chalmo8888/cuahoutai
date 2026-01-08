import { useEffect, useState } from 'react';
import { Task } from '@/types/admin';
import { useData } from '@/contexts/DataContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface TaskDrawerProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
}

export default function TaskDrawer({ open, onClose, task }: TaskDrawerProps) {
  const { categories, addTask, updateTask } = useData();
  const isEdit = !!task;

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    prompt: '',
    isVisible: true,
    order: 0,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        categoryId: task.categoryId,
        description: task.description || '',
        prompt: task.prompt,
        isVisible: task.isVisible,
        order: task.order,
      });
    } else {
      setFormData({
        name: '',
        categoryId: categories[0]?.id || '',
        description: '',
        prompt: '',
        isVisible: true,
        order: 0,
      });
    }
  }, [task, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('请输入任务名称');
      return;
    }
    if (!formData.categoryId) {
      toast.error('请选择所属分类');
      return;
    }

    if (isEdit && task) {
      updateTask(task.id, formData);
      toast.success('任务更新成功');
    } else {
      addTask(formData);
      toast.success('任务创建成功');
    }

    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEdit ? '编辑任务' : '新增任务'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">任务名称 <span className="text-destructive">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="请输入任务名称"
            />
          </div>

          <div className="space-y-2">
            <Label>所属分类 <span className="text-destructive">*</span></Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">任务描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="简要说明该任务的用途"
              rows={2}
            />
            <p className="text-xs text-muted-foreground">该描述将展示在前台任务列表中，用于说明任务用途</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">任务提示词</Label>
            <Textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="请输入任务提示词"
              rows={5}
            />
            <p className="text-xs text-muted-foreground">该内容不会直接展示给用户，仅在点击任务时填入输入框</p>
          </div>

          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              任务展示顺序请在任务列表中通过拖拽调整
            </p>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="visible">展示在主页</Label>
              <p className="text-sm text-muted-foreground">开启后将在主页展示此任务</p>
            </div>
            <Switch
              id="visible"
              checked={formData.isVisible}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVisible: checked }))}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" className="flex-1">
              保存
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
