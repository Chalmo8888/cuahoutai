import { createContext, useContext, useState, ReactNode } from 'react';
import { Task, Category, defaultTasks, defaultCategories } from '@/types/admin';

interface DataContextType {
  tasks: Task[];
  categories: Category[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'order'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
  getTasksByCategory: (categoryId: string) => Task[];
  reorderTasks: (orderedIds: string[]) => void;
  reorderCategories: (orderedIds: string[]) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id' | 'createdAt' | 'order'>) => {
    const maxOrder = categories.reduce((max, c) => Math.max(max, c.order), 0);
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      order: maxOrder + 1,
      createdAt: new Date(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, ...updates } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id);
  };

  const getTasksByCategory = (categoryId: string) => {
    return tasks.filter(task => task.categoryId === categoryId);
  };

  const reorderTasks = (orderedIds: string[]) => {
    setTasks(prev => {
      return prev.map(task => {
        const newOrder = orderedIds.indexOf(task.id);
        if (newOrder !== -1) {
          return { ...task, order: newOrder, updatedAt: new Date() };
        }
        return task;
      });
    });
  };

  const reorderCategories = (orderedIds: string[]) => {
    setCategories(prev => {
      return prev.map(cat => {
        const newOrder = orderedIds.indexOf(cat.id);
        if (newOrder !== -1) {
          return { ...cat, order: newOrder };
        }
        return cat;
      });
    });
  };

  return (
    <DataContext.Provider
      value={{
        tasks,
        categories,
        addTask,
        updateTask,
        deleteTask,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById,
        getTasksByCategory,
        reorderTasks,
        reorderCategories,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
