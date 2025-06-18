'use client';

import { useEffect, useRef, useState } from 'react';
import { ElMessage } from 'element-plus';
import { MapPost } from '@/lib/api/postsApi';
import './MapDisplay.css';

// 为window对象添加_AMapSecurityConfig属性
declare global {
  interface Window {
    _AMapSecurityConfig: {
      securityJsCode: string;
    };
    AMap: any;
  }
}

export default function MapDisplay() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 生成随机帖子数据
  const generateRandomPosts = (): MapPost[] => {
    // 在中国范围内生成随机点
    const chinaCoordinates = [
      { city: '北京', lng: 116.397428, lat: 39.90923 },
      { city: '上海', lng: 121.4737, lat: 31.2304 },
      { city: '广州', lng: 113.2644, lat: 23.1291 },
      { city: '深圳', lng: 114.0579, lat: 22.5431 },
      { city: '成都', lng: 104.0668, lat: 30.5728 },
      { city: '杭州', lng: 120.1551, lat: 30.2741 },
      { city: '武汉', lng: 114.3162, lat: 30.5810 },
      { city: '西安', lng: 108.9402, lat: 34.3416 },
      { city: '重庆', lng: 106.5516, lat: 29.5630 },
      { city: '南京', lng: 118.7969, lat: 32.0603 }
    ];
    
    const mockPosts: MapPost[] = [];
    const topics = ['今天天气真好', '附近有什么好吃的', '有人一起去看电影吗', '刚刚看到一只可爱的小猫', '这里交通太堵了'];
    const authors = ['用户A', '用户B', '用户C', '用户D', '用户E'];

    // 生成30个随机帖子，分布在中国各地
    for (let i = 0; i < 30; i++) {
      // 随机选择一个城市作为基准点
      const baseLocation = chinaCoordinates[Math.floor(Math.random() * chinaCoordinates.length)];
      // 在基准点附近随机偏移
      const randomOffset = 0.5; // 约50公里范围内
      const randomLng = baseLocation.lng + (Math.random() * 2 - 1) * randomOffset;
      const randomLat = baseLocation.lat + (Math.random() * 2 - 1) * randomOffset;
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const randomAuthor = authors[Math.floor(Math.random() * authors.length)];
        
      // 随机时间，从现在到30分钟前
      const randomTime = new Date(Date.now() - Math.random() * 30 * 60 * 1000).toISOString();
      
      mockPosts.push({
        id: i + 1,
        title: randomTopic,
        content: `这是一条位于${baseLocation.city}附近的消息 [${randomLng.toFixed(4)}, ${randomLat.toFixed(4)}]`,
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

    // 直接使用固定颜色以确保显示正确
    const bgColor = '#FFFFFF'; // 浅色模式下的背景色
    const textColor = '#1A1A1B'; // 浅色模式下的文本色
    const mutedColor = '#666666'; // 浅色模式下的次要文本色
    const subtleColor = '#999999'; // 浅色模式下的辅助文本色

    return `
      <div class="info-window" style="background-color: ${bgColor}; color: ${textColor}; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);">
        <h3 style="color: ${textColor}; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${post.title}</h3>
        <p style="color: ${mutedColor}; margin: 0 0 10px 0; font-size: 14px;">${post.content}</p>
        <div style="display: flex; justify-content: space-between; font-size: 12px;">
          <span style="color: ${subtleColor};">作者: ${post.author}</span>
          <span style="color: ${subtleColor};">${timeAgo}</span>
        </div>
      </div>
    `;
  };

  // 创建自定义标记内容
  const createCustomMarker = (post: MapPost): string => {
    const opacity = calculateOpacity(post.createdAt);
    // 使用CSS变量，从Tailwind配置中获取primary颜色
    const primaryColor = 'var(--primary)';
    
    // 为每个标记生成随机动画延迟和方向，使它们看起来各不相同
    const randomDelay = Math.random() * 2; // 0-2秒的随机延迟
    const randomDirection = Math.random() > 0.5 ? 1 : -1; // 随机方向
    const randomDuration = 2 + Math.random() * 2; // 2-4秒的随机动画持续时间
    
    return `
      <div class="custom-marker-container" style="opacity:${opacity}">
        <div class="custom-marker" 
             style="animation-delay:${randomDelay}s; 
                    animation-duration:${randomDuration}s; 
                    --random-direction:${randomDirection}">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C12 22 19.5 16 19.5 9.5C19.5 5.35786 16.1421 2 12 2C7.85786 2 4.5 5.35786 4.5 9.5C4.5 16 12 22 12 22Z" 
                  fill="${primaryColor}" stroke="none"/>
            <circle cx="12" cy="9.5" r="3" fill="white" stroke="none"/>
          </svg>
        </div>
      </div>
    `;
  };

  // 初始化高德地图
  useEffect(() => {
    // 确保代码只在浏览器环境中执行
    if (typeof window === 'undefined') return;

    // 显示加载状态
    setIsMapLoaded(false);

    // 动态导入AMapLoader，避免服务器端渲染问题
    const loadMap = async () => {
      try {
        console.log('开始加载高德地图...');
        
        // 配置安全密钥（如果你的key是2021年12月2日后申请的，需要配置安全密钥）
        const securityJsCode = process.env.NEXT_PUBLIC_AMAP_SECURITY_JS_CODE || '9bdea8960678552c012b993488a73203';
        window._AMapSecurityConfig = {
          securityJsCode: securityJsCode,
        };

        // 动态导入AMapLoader
        const AMapLoader = (await import('@amap/amap-jsapi-loader')).default;
        const posts = generateRandomPosts();

        console.log('AMapLoader导入成功，开始加载地图API...');

        // 加载高德地图API
        const apiKey = process.env.NEXT_PUBLIC_AMAP_API_KEY || '37fc8d676413b9a955a49104a6dc6bb9';
        const AMap = await AMapLoader.load({
          key: apiKey,
          version: '2.0',
          plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar']
        });

        // 保存AMap到全局，方便调试
        window.AMap = AMap;

        console.log('高德地图API加载成功，开始初始化地图...');

        if (!mapRef.current) {
          console.error('地图容器不存在');
          return;
        }
        
        // 创建地图实例 - 调整缩放级别为5，显示整个中国
        const map = new AMap.Map(mapRef.current, {
          zoom: 5, // 缩放级别为5，显示整个中国
          center: [105.0, 35.0], // 中国中心点
          viewMode: '2D',
          mapStyle: 'amap://styles/normal' // 使用标准地图样式
        });
        
        console.log('地图实例创建成功，添加控件...');
        
        // 添加控件
        map.addControl(new AMap.Scale());
        map.addControl(new AMap.ToolBar());
        
        // 保存地图实例到ref
        mapInstance.current = map;
        
        console.log('开始添加标记...');
        
        // 添加标记
        const markers = posts.map(post => {
          // 计算透明度
          const opacity = calculateOpacity(post.createdAt);
          if (opacity <= 0) return null;

          // 创建自定义内容的信息窗体
          const infoWindow = new AMap.InfoWindow({
            isCustom: true,
            content: createInfoWindowContent(post),
            offset: new AMap.Pixel(0, -30),
            autoMove: true,
            closeWhenClickMap: true
          });

          // 创建标记 - 使用自定义图标
          const marker = new AMap.Marker({
            position: [post.longitude, post.latitude],
            title: post.title,
            content: createCustomMarker(post),
            anchor: 'bottom-center',
            zIndex: 10 // 降低标记的z-index
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
        
        console.log('地图加载完成，标记添加成功');
        
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
      {/* 地图容器 - 占满容器空间但不再固定定位 */}
      <div ref={mapRef} id="map-container" className="w-full h-full absolute top-0 left-0" style={{ minHeight: '100vh', zIndex: 1 }}></div>
      
        {/* 地图加载中的占位显示 */}
      <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80 z-2 map-loading ${isMapLoaded ? 'hidden' : ''}`}>
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-gray-700">地图加载中...</p>
            </div>
      </div>
    </div>
  );
}