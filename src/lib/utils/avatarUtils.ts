/**
 * @file 头像路径处理工具
 * @description 处理不同类型的头像路径，包括本地路径、网络URL等
 */

/**
 * 处理头像路径
 * 
 * 将各种类型的头像路径转换为可在浏览器中显示的URL
 * 
 * @param avatarPath - 原始头像路径
 * @returns 处理后的头像URL
 */
export function processAvatarPath(avatarPath: string | null | undefined): string {
  // 如果没有头像路径，返回默认头像
  if (!avatarPath) {
    return 'https://via.placeholder.com/100';
  }

  // 如果已经是完整的HTTP/HTTPS URL，直接返回
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath;
  }

  // 如果是data URL（base64编码的图片），直接返回
  if (avatarPath.startsWith('data:')) {
    return avatarPath;
  }

  // 如果是本地文件路径（以/Users、/home、C:等开头），返回默认头像
  if (
    avatarPath.startsWith('/Users/') || 
    avatarPath.startsWith('/home/') || 
    avatarPath.startsWith('C:') || 
    avatarPath.startsWith('D:') ||
    avatarPath.match(/^[A-Z]:\\/)
  ) {
    // console.warn('检测到本地文件路径，使用默认头像:', avatarPath);
    // return 'https://via.placeholder.com/100';
    return avatarPath;
  }

  // 如果是相对路径，假设是服务器上的静态资源
  if (avatarPath.startsWith('/')) {
    // 这里可以根据你的静态资源服务器配置来处理
    // 例如：return `${process.env.NEXT_PUBLIC_STATIC_URL}${avatarPath}`;
    return avatarPath;
  }

  // 其他情况，尝试作为相对路径处理
  return avatarPath;
}

/**
 * 检查头像路径是否为本地文件路径
 * 
 * @param avatarPath - 头像路径
 * @returns 是否为本地文件路径
 */
export function isLocalFilePath(avatarPath: string | null | undefined): boolean {
  if (!avatarPath) return false;
  
  return (
    avatarPath.startsWith('/Users/') || 
    avatarPath.startsWith('/home/') || 
    avatarPath.startsWith('C:') || 
    avatarPath.startsWith('D:') ||
    avatarPath.match(/^[A-Z]:\\/) !== null
  );
}

/**
 * 获取默认头像URL
 * 
 * @returns 默认头像URL
 */
export function getDefaultAvatarUrl(): string {
  return 'https://via.placeholder.com/100';
} 