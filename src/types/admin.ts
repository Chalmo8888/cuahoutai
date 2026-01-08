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
  description?: string;
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
    description: '自动监控并回复抖音私信，支持预设模板',
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
    description: '智能识别并回复 WhatsApp 未读消息',
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
    description: '从阿里巴巴采集供应商信息并汇总成表格',
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
    description: '批量添加 Facebook 帖子评论者为好友',
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
    description: '自动订阅 YouTube 评论者的频道',
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
    description: '批量关注 Instagram 帖子的评论用户',
    prompt: '自动获取 Instagram 帖子评论者，并批量关注这些用户。',
    isVisible: true,
    order: 6,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '7',
    name: 'Twitter 关键词监控与点赞',
    categoryId: '1',
    description: '监控推文关键词并自动点赞',
    prompt: '监控 Twitter 上包含指定关键词的推文，自动进行点赞操作。',
    isVisible: true,
    order: 7,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '8',
    name: '小红书笔记采集与分析',
    categoryId: '1',
    description: '采集小红书热门笔记数据',
    prompt: '采集小红书指定话题下的热门笔记，分析互动数据和内容趋势。',
    isVisible: true,
    order: 8,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '9',
    name: '亚马逊商品价格监控',
    categoryId: '2',
    description: '监控亚马逊商品价格变化',
    prompt: '监控亚马逊指定商品的价格变化，价格下降时发送提醒。',
    isVisible: true,
    order: 9,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '10',
    name: '京东店铺评价采集',
    categoryId: '2',
    description: '批量采集京东店铺商品评价',
    prompt: '采集京东指定店铺的商品评价数据，包括评分、内容、图片等信息。',
    isVisible: true,
    order: 10,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '11',
    name: 'Telegram 群消息转发',
    categoryId: '3',
    description: '自动转发 Telegram 群消息',
    prompt: '监控指定 Telegram 群组的消息，自动转发到其他群组或频道。',
    isVisible: true,
    order: 11,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '12',
    name: '微信公众号文章采集',
    categoryId: '3',
    description: '采集微信公众号历史文章',
    prompt: '采集指定微信公众号的历史文章，提取标题、内容、阅读量等数据。',
    isVisible: true,
    order: 12,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '13',
    name: 'LinkedIn 职位信息采集',
    categoryId: '2',
    description: '采集 LinkedIn 职位发布信息',
    prompt: '采集 LinkedIn 上指定关键词的职位发布信息，包括公司、薪资、要求等。',
    isVisible: true,
    order: 13,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '14',
    name: 'Pinterest 图片批量下载',
    categoryId: '1',
    description: '批量下载 Pinterest 图片',
    prompt: '批量下载 Pinterest 指定画板或搜索结果中的图片。',
    isVisible: true,
    order: 14,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '15',
    name: '速卖通商品数据采集',
    categoryId: '2',
    description: '采集速卖通商品信息',
    prompt: '采集速卖通指定类目的商品信息，包括价格、销量、评价等数据。',
    isVisible: true,
    order: 15,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
  {
    id: '16',
    name: 'Discord 服务器消息监控',
    categoryId: '3',
    description: '监控 Discord 服务器消息',
    prompt: '监控指定 Discord 服务器的消息，关键词触发时发送通知。',
    isVisible: true,
    order: 16,
    updatedAt: new Date(),
    createdAt: new Date(),
  },
];
