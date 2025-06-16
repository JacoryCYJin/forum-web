/**
 * @file 举报相关类型定义
 * @module types/reportTypes
 * @description 定义举报功能相关的数据类型和接口
 */

/**
 * 举报目标类型枚举
 */
export type ComponentType = 'USER' | 'POST' | 'COMMENT';

/**
 * 举报原因接口
 */
export interface ReportReason {
  /**
   * 举报原因编号
   */
  code: number;
  
  /**
   * 举报原因英文标识
   */
  reason: string;
}

/**
 * 获取举报原因请求参数
 */
export interface GetReportReasonsRequest {
  /**
   * 组件类型
   */
  component_type: ComponentType;
}

/**
 * 获取举报原因响应数据
 */
export interface GetReportReasonsResponse {
  /**
   * 举报原因列表
   */
  data: ReportReason[];
  
  /**
   * 响应状态码
   */
  code: number;
  
  /**
   * 响应消息
   */
  message: string;
  
  /**
   * 是否成功
   */
  success: boolean;
}

/**
 * 提交举报请求参数
 */
export interface SubmitReportRequest {
  /**
   * 举报目标类型
   */
  componentType: ComponentType;
  
  /**
   * 被举报内容ID
   */
  componentId: string;
  
  /**
   * 举报原因英文标识
   */
  reasonType: string;
  
  /**
   * 自定义举报原因（当reasonType为OTHER时使用）
   */
  reason?: string;
}

/**
 * 提交举报响应数据
 */
export interface SubmitReportResponse {
  /**
   * 响应状态码
   */
  code: number;
  
  /**
   * 响应消息
   */
  message: string;
  
  /**
   * 是否成功
   */
  success: boolean;
}

/**
 * 举报弹窗组件属性接口
 */
export interface ReportDialogProps {
  /**
   * 是否显示弹窗
   */
  visible: boolean;
  
  /**
   * 关闭弹窗回调
   */
  onClose: () => void;
  
  /**
   * 举报目标类型
   */
  componentType: ComponentType;
  
  /**
   * 被举报内容ID
   */
  componentId: string;
  
  /**
   * 被举报内容标题（用于显示）
   */
  title?: string;
  
  /**
   * 举报成功回调
   */
  onSuccess?: () => void;
}

/**
 * 举报原因分类结构
 */
export interface ReportReasonCategory {
  /**
   * 分类标题
   */
  title: string;
  
  /**
   * 该分类下的举报原因列表
   */
  reasons: string[];
}

/**
 * 举报原因中文映射（根据不同的组件类型和原因组合）
 */
export const getReasonLabel = (componentType: ComponentType, reason: string): string => {
  // 根据组件类型和原因返回合适的中文标签
  switch (componentType) {
    case 'USER':
      switch (reason) {
        case 'USER_IMPERSONATE': return '冒充他人';
        case 'USER_HARASSMENT': return '骚扰他人';
        case 'USER_SEXY_PROFILE': return '色情头像/资料';
        case 'USER_FRAUD': return '诈骗行为';
        case 'USER_POLITICAL': return '政治敏感';
        case 'USER_ILLEGAL_CONTENT': return '违法内容';
        case 'USER_ATTACK': return '人身攻击';
        case 'USER_PROVOKE': return '恶意挑衅';
        case 'USER_OTHER': return '其他';
        default: return reason;
      }
    
    case 'POST':
      switch (reason) {
        case 'POST_ILLEGAL': return '违法违禁';
        case 'POST_FRAUD': return '赌博诈骗';
        case 'POST_PLAGIARISM': return '盗搬我的稿件';
        case 'POST_ILLEGAL_LINK': return '违法信息外链';
        case 'POST_COPYRIGHT': return '侵权申诉';
        case 'POST_POLITICAL': return '涉政谣言';
        case 'POST_RUMOR_EVENT': return '涉社会事件谣言';
        case 'POST_MISINFO': return '虚假不实信息';
        case 'POST_PROMOTION': return '违规推广';
        case 'POST_FORMAT_ISSUE': return '转载/自制错误';
        case 'POST_PORN': return '色情内容';
        case 'POST_DANGEROUS': return '危险内容';
        case 'POST_VIOLENCE': return '暴力内容';
        case 'POST_YOUTH_HARM': return '青少年有害';
        case 'POST_AD': return '广告内容';
        case 'POST_PROVOKE': return '恶意挑衅';
        case 'POST_DISCOMFORT': return '引起不适';
        case 'POST_OTHER': return '其他';
        default: return reason;
      }
    
    case 'COMMENT':
      switch (reason) {
        case 'COMMENT_ILLEGAL': return '违法违禁';
        case 'COMMENT_PORN': return '色情内容';
        case 'COMMENT_FRAUD': return '诈骗行为';
        case 'COMMENT_POLITICAL': return '政治敏感';
        case 'COMMENT_MISINFO': return '虚假信息';
        case 'COMMENT_RUMOR_EVENT': return '谣言事件';
        case 'COMMENT_AD': return '广告内容';
        case 'COMMENT_PROVOKE': return '恶意挑衅';
        case 'COMMENT_SPOILER': return '剧透内容';
        case 'COMMENT_SPAM': return '垃圾信息';
        case 'COMMENT_OFF_TOPIC': return '偏离主题';
        case 'COMMENT_ATTACK': return '人身攻击';
        case 'COMMENT_PRIVACY': return '隐私泄露';
        case 'COMMENT_LOTTERY': return '抽奖诱导';
        case 'COMMENT_YOUTH_HARM': return '青少年有害';
        case 'COMMENT_OTHER': return '其他';
        default: return reason;
      }
    
    default:
      return reason;
  }
};

/**
 * 举报目标类型中文映射
 */
export const COMPONENT_TYPE_LABELS: Record<ComponentType, string> = {
  'USER': '用户',
  'POST': '帖子',
  'COMMENT': '评论'
};

/**
 * 用户举报原因分类
 */
export const USER_REPORT_CATEGORIES: ReportReasonCategory[] = [
  {
    title: '恶意行为',
    reasons: ['USER_IMPERSONATE', 'USER_HARASSMENT', 'USER_ATTACK', 'USER_PROVOKE']
  },
  {
    title: '违法违规',
    reasons: ['USER_FRAUD', 'USER_POLITICAL', 'USER_ILLEGAL_CONTENT', 'USER_SEXY_PROFILE']
  },
  {
    title: '其他',
    reasons: ['USER_OTHER']
  }
];

/**
 * 帖子举报原因分类
 */
export const POST_REPORT_CATEGORIES: ReportReasonCategory[] = [
  {
    title: '违反法律法规',
    reasons: ['POST_ILLEGAL', 'POST_FRAUD', 'POST_PLAGIARISM', 'POST_ILLEGAL_LINK', 'POST_COPYRIGHT']
  },
  {
    title: '谣言及不实信息',
    reasons: ['POST_POLITICAL', 'POST_RUMOR_EVENT', 'POST_MISINFO']
  },
  {
    title: '投稿不规范',
    reasons: ['POST_PROMOTION', 'POST_FORMAT_ISSUE', 'POST_AD']
  },
  {
    title: '不适宜内容',
    reasons: ['POST_PORN', 'POST_DANGEROUS', 'POST_VIOLENCE', 'POST_YOUTH_HARM', 'POST_PROVOKE', 'POST_DISCOMFORT']
  },
  {
    title: '其他',
    reasons: ['POST_OTHER']
  }
];

/**
 * 评论举报原因分类
 */
export const COMMENT_REPORT_CATEGORIES: ReportReasonCategory[] = [
  {
    title: '违法违规',
    reasons: ['COMMENT_ILLEGAL', 'COMMENT_PORN', 'COMMENT_FRAUD', 'COMMENT_POLITICAL']
  },
  {
    title: '不当内容',
    reasons: ['COMMENT_MISINFO', 'COMMENT_RUMOR_EVENT', 'COMMENT_PROVOKE', 'COMMENT_ATTACK', 'COMMENT_YOUTH_HARM']
  },
  {
    title: '影响体验',
    reasons: ['COMMENT_SPOILER', 'COMMENT_SPAM', 'COMMENT_OFF_TOPIC', 'COMMENT_AD', 'COMMENT_LOTTERY']
  },
  {
    title: '隐私相关',
    reasons: ['COMMENT_PRIVACY']
  },
  {
    title: '其他',
    reasons: ['COMMENT_OTHER']
  }
];

/**
 * 根据组件类型获取举报原因分类
 */
export const getReportCategories = (componentType: ComponentType): ReportReasonCategory[] => {
  switch (componentType) {
    case 'USER':
      return USER_REPORT_CATEGORIES;
    case 'POST':
      return POST_REPORT_CATEGORIES;
    case 'COMMENT':
      return COMMENT_REPORT_CATEGORIES;
    default:
      return [];
  }
};
