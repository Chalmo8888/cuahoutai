export interface Category {
  id: string;
  name: string;
  description?: string;
  order: number;
  createdAt: Date;
}

export interface Task {
  id: string;
  name: string;
  categoryId: string;
  prompt: string;
  isVisible: boolean;
  order: number;
  updatedAt: Date;
  createdAt: Date;
}

export const defaultCategories: Category[] = [
  { id: '1', name: '社交媒体', description: '社交媒体自动化任务', order: 1, createdAt: new Date() },
  { id: '2', name: '电商采购', description: '电商平台数据采集', order: 2, createdAt: new Date() },
  { id: '3', name: '消息通讯', description: '消息自动回复与监控', order: 3, createdAt: new Date() },
];

export const defaultTasks: Task[] = [
  {
    id: '1',
    name: '抖音创作者中心私信自动回复监控',
    categoryId: '1',
    prompt: '监控抖音创作者中心的私信，当收到新消息时自动根据预设模板进行回复。',
    isVisible: true,
    order: 1,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'WhatsApp 未读消息自动回复监控',
    categoryId: '3',
    prompt: '监控 WhatsApp 未读消息，自动识别消息内容并进行智能回复。',
    isVisible: true,
    order: 2,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Alibaba 发电机供应商信息爬取与汇总',
    categoryId: '2',
    prompt: '从 Alibaba 平台爬取发电机供应商信息，包括价格、规格、联系方式等，并汇总成表格。',
    isVisible: true,
    order: 3,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'Facebook 帖子评论者好友添加',
    categoryId: '1',
    prompt: '自动获取 Facebook 帖子的评论者列表，并批量发送好友请求。',
    isVisible: true,
    order: 4,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '5',
    name: 'YouTube 短视频评论者订阅',
    categoryId: '1',
    prompt: '获取 YouTube 短视频的评论者，自动订阅其频道。',
    isVisible: true,
    order: 5,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '6',
    name: 'Instagram 帖子评论者关注',
    categoryId: '1',
    prompt: '自动获取 Instagram 帖子评论者，并批量关注这些用户。',
    isVisible: true,
    order: 6,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
];
