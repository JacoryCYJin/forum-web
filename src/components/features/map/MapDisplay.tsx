'use client';

import { useEffect, useRef, useState } from 'react';
import { ElMessage } from 'element-plus';
import { fetchMapPostsApi, MapPost } from '@/lib/api/posts';
import MapBubble from './MapBubble';

export default function MapDisplay() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [posts, setPosts] = useState<MapPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 获取帖子数据
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        // 实际项目中应该从API获取数据
        const data = await fetchMapPostsApi();
        setPosts(data);
      } catch (error) {
        console.error('获取地图帖子失败:', error);
        ElMessage.error('获取地图数据失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    // 调用获取帖子的函数
    fetchPosts();

    return () => {
      // 清理地图实例
      if (map) {
        map.destroy();
      }
    };
  }, [map]);

  // 初始化地图
  useEffect(() => {
    if (!mapRef.current) return;

    // 这里应该使用实际的地图API，如高德地图、百度地图或MapBox等
    // 以下为模拟地图初始化的代码
    const initMap = async () => {
      try {
        // 模拟地图加载
        console.log('地图初始化中...');
        
        // 实际项目中，这里应该是地图API的初始化代码
        // 例如：const mapInstance = new AMap.Map(mapRef.current, {...配置});
        
        // 模拟地图实例
        const mockMap = {
          destroy: () => console.log('地图销毁')
        };
        
        setMap(mockMap);
      } catch (error) {
        console.error('地图初始化失败:', error);
        ElMessage.error('地图加载失败，请刷新页面重试');
      }
    };

    initMap();
  }, [mapRef]);

  // 计算帖子的透明度，随时间逐渐减少
  const calculateOpacity = (createdAt: string): number => {
    const postTime = new Date(createdAt).getTime();
    const now = Date.now();
    const ageInMinutes = (now - postTime) / (1000 * 60);
    
    // 30分钟后完全消失
    if (ageInMinutes >= 30) return 0;
    
    // 线性递减透明度
    return 1 - (ageInMinutes / 30);
  };

  return (
    <div className="w-full h-full relative">
      {/* 地图容器 */}
      <div ref={mapRef} className="w-full h-full bg-gray-200">
        {/* 地图加载中的占位显示 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-10">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-gray-700">地图加载中...</p>
            </div>
          </div>
        )}
        
        {/* 这里是模拟的地图背景，实际项目中会被真实地图替换 */}
        <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
          <div className="text-gray-400 text-lg">地图区域 (实际项目中将显示真实地图)</div>
        </div>
        
        {/* 帖子气泡 */}
        {posts.map((post) => (
          <MapBubble
            key={post.id}
            post={post}
            opacity={calculateOpacity(post.createdAt)}
          />
        ))}
      </div>
    </div>
  );
}