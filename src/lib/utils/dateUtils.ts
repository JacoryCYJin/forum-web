/**
 * @file 日期工具函数
 * @description 提供日期格式化和时间处理相关的工具函数
 */

/**
 * 格式化日期为中文显示格式
 * 
 * @param {string | Date | null | undefined} date - 要格式化的日期
 * @param {string} [format='YYYY年MM月DD日'] - 输出格式
 * @returns {string} 格式化后的日期字符串
 * @example
 * // 返回: "2024年3月15日"
 * formatDateToChinese('2024-03-15T10:30:00');
 * 
 * // 返回: "2024-03-15"
 * formatDateToChinese('2024-03-15T10:30:00', 'YYYY-MM-DD');
 * 
 * // 返回: "未知"
 * formatDateToChinese(undefined);
 */
export function formatDateToChinese(
  date: string | Date | null | undefined, 
  format: string = 'YYYY年MM月DD日'
): string {
  // 检查是否为空值（null, undefined, 空字符串）
  if (!date || date === null || date === undefined) {
    return '未知';
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // 检查日期是否有效
    if (isNaN(dateObj.getTime())) {
      return '未知';
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  } catch (error) {
    console.error('日期格式化失败:', error);
    return '未知';
  }
}

/**
 * 格式化日期为相对时间显示
 * 
 * @param {string | Date | null | undefined} date - 要格式化的日期
 * @returns {string} 相对时间字符串
 * @example
 * // 返回: "2小时前"
 * formatRelativeTime('2024-03-15T08:30:00');
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) {
    return '未知';
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return '未知';
    }

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 7) {
      return formatDateToChinese(dateObj);
    } else if (diffDays > 0) {
      return `${diffDays}天前`;
    } else if (diffHours > 0) {
      return `${diffHours}小时前`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}分钟前`;
    } else {
      return '刚刚';
    }
  } catch (error) {
    console.error('相对时间格式化失败:', error);
    return '未知';
  }
}

/**
 * 检查日期是否为今天
 * 
 * @param {string | Date | null | undefined} date - 要检查的日期
 * @returns {boolean} 是否为今天
 */
export function isToday(date: string | Date | null | undefined): boolean {
  if (!date) {
    return false;
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return false;
    }

    const today = new Date();
    return dateObj.getDate() === today.getDate() &&
           dateObj.getMonth() === today.getMonth() &&
           dateObj.getFullYear() === today.getFullYear();
  } catch {
    return false;
  }
}

/**
 * 检查日期是否为本周
 * 
 * @param {string | Date | null | undefined} date - 要检查的日期
 * @returns {boolean} 是否为本周
 */
export function isThisWeek(date: string | Date | null | undefined): boolean {
  if (!date) {
    return false;
  }

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return false;
    }

    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return dateObj >= weekStart && dateObj <= weekEnd;
  } catch {
    return false;
  }
}

/**
 * @file 日期时间工具函数
 * @description 处理日期时间格式化的工具函数
 */

/**
 * 格式化发布时间
 * 
 * @param createdTime - 发布时间字符串
 * @returns 格式化后的时间显示
 */
export const formatPostTime = (createdTime?: string): string => {
  if (!createdTime) {
    return '未知时间';
  }
  
  try {
    const postDate = new Date(createdTime);
    const now = new Date();
    const diffInMs = now.getTime() - postDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    // 一周之内显示相对时间
    if (diffInDays < 7) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      
      if (diffInMinutes < 1) {
        return '刚刚';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes}分钟前`;
      } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours}小时前`;
      } else {
        return `${diffInDays}天前`;
      }
    } else {
      // 一周之外显示具体日期
      return postDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  } catch (error) {
    console.error('时间格式化错误:', error);
    return '时间格式错误';
  }
};

/**
 * 格式化完整的日期时间
 * 
 * @param dateTime - 日期时间字符串
 * @returns 格式化后的完整日期时间
 */
export const formatFullDateTime = (dateTime?: string): string => {
  if (!dateTime) {
    return '未知时间';
  }
  
  try {
    const date = new Date(dateTime);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('日期时间格式化错误:', error);
    return '时间格式错误';
  }
}; 