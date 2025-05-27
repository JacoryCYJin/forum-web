/**
 * @file 头像处理工具函数
 * @description 处理头像URL的工具函数
 */

/**
 * 处理头像路径
 * 
 * 将后端返回的头像URL转换为前端可用的完整URL
 * 
 * @param avatarUrl - 后端返回的头像URL
 * @returns 处理后的头像URL
 */
export function processAvatarPath(avatarUrl?: string | null): string {
  // 如果没有头像URL，返回默认头像
  if (!avatarUrl) {
    return '/images/default-avatar.png';
  }
  
  // 如果已经是完整的URL（http或https开头），直接返回
  if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
    return avatarUrl;
  }
  
  // 如果是相对路径，拼接基础URL
  if (avatarUrl.startsWith('/')) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}${avatarUrl}`;
  }
  
  // 如果是文件名，拼接完整路径
  return `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/uploads/avatars/${avatarUrl}`;
}

/**
 * 验证头像文件
 * 
 * 验证上传的头像文件是否符合要求
 * 
 * @param file - 上传的文件
 * @returns 验证结果
 */
export function validateAvatarFile(file: File): { valid: boolean; message?: string } {
  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: '只支持 JPG、PNG、GIF、WebP 格式的图片'
    };
  }
  
  // 检查文件大小（5MB）
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      message: '图片大小不能超过 5MB'
    };
  }
  
  return { valid: true };
}

/**
 * 压缩头像图片
 * 
 * 将上传的图片压缩到合适的尺寸
 * 
 * @param file - 原始图片文件
 * @param maxWidth - 最大宽度
 * @param maxHeight - 最大高度
 * @param quality - 压缩质量 (0-1)
 * @returns 压缩后的图片数据URL
 */
export function compressAvatar(
  file: File, 
  maxWidth: number = 200, 
  maxHeight: number = 200, 
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // 计算压缩后的尺寸
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      // 设置canvas尺寸
      canvas.width = width;
      canvas.height = height;
      
      // 绘制压缩后的图片
      ctx?.drawImage(img, 0, 0, width, height);
      
      // 转换为数据URL
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    
    img.onerror = () => {
      reject(new Error('图片加载失败'));
    };
    
    // 读取文件
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    reader.readAsDataURL(file);
  });
} 