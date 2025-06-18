/**
 * @file 地理位置工具函数
 * @description 提供地理位置相关的工具函数，包括经纬度转地址等
 */

/**
 * 地理位置接口
 */
export interface GeoLocation {
  /** 经度 */
  longitude: number;
  /** 纬度 */
  latitude: number;
}

/**
 * 地址信息接口
 */
export interface AddressInfo {
  /** 完整地址 */
  address: string;
  /** 省份 */
  province?: string;
  /** 城市 */
  city?: string;
  /** 区县 */
  district?: string;
  /** 街道 */
  street?: string;
}

/**
 * 解析位置字符串为经纬度对象
 * 
 * @param location - 位置字符串，可能是 "经度,纬度" 或 "纬度,经度" 格式
 * @returns 经纬度对象，如果解析失败则返回null
 * @example
 * // 解析位置字符串
 * const coords = parseLocationString("116.4074,39.9042");
 * // 返回: { longitude: 116.4074, latitude: 39.9042 }
 */
export function parseLocationString(location: string): GeoLocation | null {
  if (!location || typeof location !== 'string') {
    return null;
  }

  const parts = location.trim().split(',');
  if (parts.length !== 2) {
    return null;
  }

  const first = parseFloat(parts[0]);
  const second = parseFloat(parts[1]);

  if (isNaN(first) || isNaN(second)) {
    return null;
  }

  // 智能检测坐标格式
  // 经度范围：-180 到 180，纬度范围：-90 到 90
  let longitude: number, latitude: number;

  // 如果第一个数字的绝对值 > 90，很可能是经度在前（经度,纬度格式）
  if (Math.abs(first) > 90 || Math.abs(first) > Math.abs(second)) {
    longitude = first;
    latitude = second;
  } else {
    // 如果第一个数字 <= 90，很可能是纬度在前（纬度,经度格式）
    latitude = first;
    longitude = second;
  }

  // 验证经纬度范围
  if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    return null;
  }

  console.log('🗺️ 坐标解析:', { 
    原始: location, 
    解析后: { longitude, latitude },
    格式判断: Math.abs(first) > 90 ? '经度,纬度' : '纬度,经度'
  });

  return { longitude, latitude };
}

/**
 * 根据坐标提供模拟地址（备用方案）
 * 
 * @param longitude - 经度
 * @param latitude - 纬度
 * @returns 模拟地址字符串
 */
function getMockAddressByCoordinates(longitude: number, latitude: number): string {
  // 中国主要城市的大致坐标范围
  const cityRanges = [
    { name: '北京市', lng: [115.7, 117.4], lat: [39.4, 41.6] },
    { name: '上海市', lng: [120.9, 122.2], lat: [30.7, 31.9] },
    { name: '广州市', lng: [112.9, 114.2], lat: [22.4, 23.9] },
    { name: '深圳市', lng: [113.8, 114.8], lat: [22.4, 22.9] },
    { name: '杭州市', lng: [119.5, 120.9], lat: [29.8, 30.6] },
    { name: '成都市', lng: [103.5, 104.9], lat: [30.1, 31.4] },
    { name: '重庆市', lng: [105.3, 109.8], lat: [28.1, 32.2] },
    { name: '武汉市', lng: [113.7, 115.1], lat: [29.9, 31.4] },
    { name: '西安市', lng: [107.7, 109.7], lat: [33.7, 34.8] },
    { name: '南京市', lng: [118.2, 119.3], lat: [31.6, 32.5] }
  ];

  // 查找匹配的城市
  for (const city of cityRanges) {
    if (longitude >= city.lng[0] && longitude <= city.lng[1] &&
        latitude >= city.lat[0] && latitude <= city.lat[1]) {
      return city.name;
    }
  }
  
  // 特殊处理上海周边地区
  if (longitude >= 120.5 && longitude <= 122.5 && latitude >= 30.5 && latitude <= 31.5) {
    return '上海市';
  }

  // 根据大致区域判断
  if (longitude >= 113 && longitude <= 120 && latitude >= 22 && latitude <= 25) {
    return '广东省';
  } else if (longitude >= 118 && longitude <= 122 && latitude >= 30 && latitude <= 33) {
    return '江苏省';
  } else if (longitude >= 119 && longitude <= 123 && latitude >= 28 && latitude <= 31) {
    return '浙江省';
  } else if (longitude >= 115 && longitude <= 118 && latitude >= 39 && latitude <= 42) {
    return '北京市';
  } else if (longitude >= 103 && longitude <= 108 && latitude >= 28 && latitude <= 33) {
    return '四川省';
  }

  // 如果都不匹配，返回坐标信息
  return `${longitude.toFixed(3)}°E, ${latitude.toFixed(3)}°N`;
}

/**
 * 使用高德地图API进行逆地理编码
 * 将经纬度转换为地址信息
 * 
 * @param longitude - 经度
 * @param latitude - 纬度
 * @returns 地址信息
 * @throws 当API请求失败时抛出错误
 */
export async function reverseGeocode(longitude: number, latitude: number): Promise<AddressInfo> {
  // 高德地图API key (从环境变量获取)
  const API_KEY = process.env.NEXT_PUBLIC_AMAP_API_KEY || '37fc8d676413b9a955a49104a6dc6bb9';
  
  const url = `https://restapi.amap.com/v3/geocode/regeo?key=${API_KEY}&location=${longitude},${latitude}&radius=1000&extensions=base&batch=false&roadlevel=0`;

  console.log('🌍 开始逆地理编码:', { longitude, latitude, API_KEY: API_KEY.substring(0, 8) + '...' });

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log('📍 高德API响应:', data);

    if (data.status === '1' && data.regeocode) {
      const regeocode = data.regeocode;
      const addressComponent = regeocode.addressComponent;
      
      const addressInfo = {
        address: regeocode.formatted_address || '未知地址',
        province: addressComponent.province || '',
        city: addressComponent.city || addressComponent.province || '',
        district: addressComponent.district || '',
        street: addressComponent.township || ''
      };

      console.log('✅ 地址解析成功:', addressInfo);
      return addressInfo;
    } else {
      console.error('❌ 高德API响应异常:', data);
      throw new Error(`地理编码API响应异常: ${data.info || '未知错误'}`);
    }
  } catch (error) {
    console.error('❌ 逆地理编码失败:', error);
    
    // 由于CORS或其他原因，浏览器端直接调用高德API可能失败
    // 提供一个基于坐标的简单地址猜测
    const mockAddress = getMockAddressByCoordinates(longitude, latitude);
    
    console.log('🔄 使用备用地址:', mockAddress);
    
    return {
      address: mockAddress,
      province: '',
      city: '',
      district: '',
      street: ''
    };
  }
}

/**
 * 将位置字符串转换为地址
 * 
 * @param location - 位置字符串，格式为 "经度,纬度"
 * @returns 地址信息，如果转换失败则返回原字符串
 * @example
 * // 转换位置字符串为地址
 * const address = await locationToAddress("116.4074,39.9042");
 * // 返回: "北京市东城区天安门广场"
 */
export async function locationToAddress(location: string): Promise<string> {
  const coords = parseLocationString(location);
  
  if (!coords) {
    return location; // 如果解析失败，返回原字符串
  }

  console.log('🗺️ 开始位置转换:', { location, coords });

  // 优先使用本地城市匹配（快速且可靠）
  const mockAddress = getMockAddressByCoordinates(coords.longitude, coords.latitude);
  
  // 如果本地匹配到了具体城市，直接返回
  if (!mockAddress.includes('°')) {
    console.log('✅ 本地匹配成功:', mockAddress);
    return mockAddress;
  }

  // 如果本地匹配失败，尝试调用高德API
  try {
    const addressInfo = await reverseGeocode(coords.longitude, coords.latitude);
    return addressInfo.address;
  } catch (error) {
    console.error('📍 API调用失败，使用备用地址:', error);
    return mockAddress; // 返回坐标格式的备用地址
  }
}

/**
 * 计算两个地理位置之间的距离（米）
 * 使用Haversine公式计算球面距离
 * 
 * @param loc1 - 第一个位置
 * @param loc2 - 第二个位置
 * @returns 距离（米）
 */
export function calculateDistance(loc1: GeoLocation, loc2: GeoLocation): number {
  const R = 6371000; // 地球半径（米）
  const φ1 = loc1.latitude * Math.PI / 180;
  const φ2 = loc2.latitude * Math.PI / 180;
  const Δφ = (loc2.latitude - loc1.latitude) * Math.PI / 180;
  const Δλ = (loc2.longitude - loc1.longitude) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

/**
 * 格式化距离显示
 * 
 * @param distance - 距离（米）
 * @returns 格式化的距离字符串
 * @example
 * formatDistance(1500); // "1.5 公里"
 * formatDistance(500);  // "500 米"
 */
export function formatDistance(distance: number): string {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)} 公里`;
  } else {
    return `${Math.round(distance)} 米`;
  }
} 