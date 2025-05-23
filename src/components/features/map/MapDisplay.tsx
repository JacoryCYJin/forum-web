'use client';

import { useEffect, useRef, useState } from 'react';
import { ElMessage } from 'element-plus';
import { MapPost } from '@/lib/api/posts';
import './MapDisplay.css';

// 为window对象添加_AMapSecurityConfig属性
declare global {
  interface Window {
    _AMapSecurityConfig: {
      securityJsCode: string;
    };
  }
}

export default function MapDisplay() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 生成随机帖子数据
  const generateRandomPosts = (): MapPost[] => {
    // 北京市中心区域的经纬度范围
    const centerLng = 116.397428;
    const centerLat = 39.90923;
    const range = 0.05; // 经纬度范围约5公里
    
    const mockPosts: MapPost[] = [];
    const topics = ['今天天气真好', '附近有什么好吃的', '有人一起去看电影吗', '刚刚看到一只可爱的小猫', '这里交通太堵了'];
    const authors = ['用户A', '用户B', '用户C', '用户D', '用户E'];
    
    // 生成20个随机帖子
    for (let i = 0; i < 20; i++) {
      const randomLng = centerLng + (Math.random() * 2 - 1) * range;
      const randomLat = centerLat + (Math.random() * 2 - 1) * range;
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
      
      // 随机时间，从现在到30分钟前
      const randomTime = new Date(Date.now() - Math.random() * 30 * 60 * 1000).toISOString();
      
      mockPosts.push({
        id: i + 1,
        title: randomTopic,
        content: `这是一条位于 [${randomLng.toFixed(4)}, ${randomLat.toFixed(4)}] 的随机消息`,
        author: randomAuthor,
        longitude: randomLng,
        latitude: randomLat,
        createdAt: randomTime
      });
    }
    
    return mockPosts;
  };

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

  // 创建信息窗体内容
  const createInfoWindowContent = (post: MapPost): string => {
    // 计算创建时间到现在的分钟数
    const created = new Date(post.createdAt).getTime();
    const now = Date.now();
    const diffMinutes = Math.floor((now - created) / (1000 * 60));
    const timeAgo = diffMinutes < 1 ? '刚刚' : `${diffMinutes}分钟前`;

    return `
      <div class="info-window">
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <div class="footer">
          <span>作者: ${post.author}</span>
          <span>${timeAgo}</span>
        </div>
      </div>
    `;
  };

  // 初始化高德地图
  useEffect(() => {
    // 确保代码只在浏览器环境中执行
    if (typeof window === 'undefined') return;

    // 动态导入AMapLoader，避免服务器端渲染问题
    const loadMap = async () => {
      try {
        // 配置安全密钥（如果你的key是2021年12月2日后申请的，需要配置安全密钥）
        window._AMapSecurityConfig = {
          securityJsCode: '9bdea8960678552c012b993488a73203', // 请替换为你的安全密钥
        };

        // 动态导入AMapLoader
        const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;
        const posts = generateRandomPosts();

        // 加载高德地图API
        const AMap = await AMapLoader.load({
          key: '37fc8d676413b9a955a49104a6dc6bb9', // 高德地图API密钥
          version: '2.0',
          plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar']
        });

        if (!mapRef.current) return;
        
        // 创建地图实例
        const map = new AMap.Map(mapRef.current, {
          zoom: 13, // 初始缩放级别
          center: [116.397428, 39.90923], // 北京市中心
          viewMode: '2D'
        });
        
        // 添加控件
        map.addControl(new AMap.Scale());
        map.addControl(new AMap.ToolBar());
        
        // 保存地图实例到ref
        mapInstance.current = map;
        
        // 添加标记
        const markers = posts.map(post => {
          // 计算透明度
          const opacity = calculateOpacity(post.createdAt);
          if (opacity <= 0) return null;

          // 创建自定义内容的信息窗体
          const infoWindow = new AMap.InfoWindow({
            isCustom: true,
            content: createInfoWindowContent(post),
            offset: new AMap.Pixel(0, -30)
          });

          // 创建标记
          const marker = new AMap.Marker({
            position: [post.longitude, post.latitude],
            title: post.title,
            content: `<div class="map-marker" style="opacity:${opacity}"></div>`,
            anchor: 'center'
          });

          // 绑定事件
          marker.on('mouseover', () => {
            infoWindow.open(map, marker.getPosition());
          });
          marker.on('mouseout', () => {
            infoWindow.close();
          });

          return marker;
        }).filter(Boolean);

        // 将标记添加到地图
        if (markers.length > 0) {
          map.add(markers);
          markersRef.current = markers;
        }
        
        // 地图加载完成
        setIsMapLoaded(true);
      } catch (error) {
        console.error('地图初始化失败:', error);
        ElMessage.error('地图加载失败，请刷新页面重试');
      }
    };

    loadMap();

    // 组件卸载时清理地图实例
    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      {/* 地图容器 */}
      <div ref={mapRef} className="w-full h-full"></div>
      
      {/* 地图加载中的占位显示 */}
      <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-10 map-loading ${isMapLoaded ? 'hidden' : ''}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-gray-700">地图加载中...</p>
        </div>
      </div>
    </div>
  );
}