// 地图帖子数据类型
export interface MapPost {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
  author: string;
  createdAt: string;
  content: string;
}

/**
 * 获取地图上显示的帖子
 * @returns 帖子列表
 */
export async function fetchMapPostsApi(): Promise<MapPost[]> {
  // 实际项目中，这里应该是真实的API调用
  // 例如：const response = await fetch('/api/map-posts');
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 模拟数据
  return [
    {
      id: 1,
      latitude: 39.9042,
      longitude: 116.4074,
      title: "北京天安门附近有什么好吃的?",
      author: "美食家",
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5分钟前
      content: "求推荐北京天安门附近的美食，最好是老字号"
    },
    {
      id: 2,
      latitude: 39.9142,
      longitude: 116.3974,
      title: "故宫今天人多吗?",
      author: "旅行者",
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15分钟前
      content: "计划明天去故宫，想问问今天人多不多"
    },
    {
      id: 3,
      latitude: 39.9242,
      longitude: 116.4174,
      title: "王府井附近有什么好玩的?",
      author: "探险家",
      createdAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25分钟前
      content: "第一次来北京，想在王府井附近找些有意思的地方"
    }
  ];
}