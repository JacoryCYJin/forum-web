/**
 * @file 用户相关类型定义
 * @description 包含用户信息、登录响应等类型定义
 */

/**
 * 用户信息接口
 */
export interface User {
  /**
   * 用户唯一标识符
   */
  userId: string;
  
  /**
   * 用户名
   */
  username: string;
  
  /**
   * 手机号
   */
  phone?: string;
  
  /**
   * 邮箱
   */
  email?: string;
  
  /**
   * 头像URL
   */
  avatarUrl?: string;
  
  /**
   * 个人简介
   */
  profile?: string;
  
  /**
   * 创建时间
   */
  ctime?: string;
  
  /**
   * 更新时间
   */
  mtime?: string;
}

/**
 * 登录响应VO（对应后端LoginVO）
 */
export interface LoginVO {
  /**
   * 用户唯一标识符
   */
  userId: string;
  
  /**
   * 用户名
   */
  username: string;
  
  /**
   * 手机号
   */
  phone?: string;
  
  /**
   * 邮箱
   */
  email?: string;
  
  /**
   * 头像URL
   */
  avatarUrl?: string;
  
  /**
   * 个人简介
   */
  profile?: string;
  
  /**
   * 创建时间
   */
  ctime?: string;
  
  /**
   * 更新时间
   */
  mtime?: string;
  
  
  /**
   * JWT访问令牌
   */
  accessToken: string;
  
  /**
   * 令牌类型（通常是Bearer）
   */
  tokenType: string;
  
  /**
   * 令牌过期时间（秒数，注意：前端处理时需转换为毫秒）
   */
  expiresIn: number;
}

/**
 * 登录请求参数
 */
export interface LoginRequest {
  /**
   * 手机号或邮箱
   */
  phoneOrEmail: string;
  
  /**
   * 密码
   */
  password: string;
}

/**
 * 更新用户头像、昵称和个人简介请求参数
 */
export interface UpdateAvatarAndUsernameAndProfileRequest {
  username?: string;
  avatar?: File;  // 改为 File 类型
  profile?: string;
}

/**
 * 带验证码的注册请求参数
 */
export interface RegisterWithCodeRequest {
  /**
   * 手机号或邮箱
   */
  phoneOrEmail: string;
  
  /**
   * 密码
   */
  password: string;
  
  /**
   * 验证码
   */
  verificationCode: string;
}

/**
 * 发送注册验证码请求参数
 */
export interface SendRegisterCodeRequest {
  /**
   * 邮箱地址
   */
  email: string;
}

/**
 * 更新用户名请求参数
 */
export interface UpdateUsernameRequest {
  /**
   * 用户ID
   */
  userId: string;
  
  /**
   * 新用户名
   */
  username: string;
}

/**
 * 发送重置密码验证码请求参数
 */
export interface SendResetCodeRequest {
  /**
   * 邮箱地址
   */
  email: string;
}

/**
 * 重置密码请求参数
 */
export interface ResetPasswordRequest {
  /**
   * 手机号或邮箱
   */
  phoneOrEmail: string;
  
  /**
   * 验证码
   */
  code: string;
  
  /**
   * 新密码
   */
  newPassword: string;
}

/**
 * 刷新令牌请求参数
 */
export interface RefreshTokenRequest {
  /**
   * 原JWT令牌
   */
  token: string;
}

/**
 * 用户信息查询请求参数
 */
export interface GetUserInfoRequest {
  /**
   * 用户id
   */
  userId: string;
}

/**
 * API响应基础接口
 */
export interface ApiResponse<T = any> {
  /**
   * 响应状态码
   */
  code: number;
  
  /**
   * 响应数据
   */
  data: T;
  
  /**
   * 响应消息
   */
  message: string;
}

/**
 * 用户基本信息接口
 */
export interface UserInfo {
  /** 用户唯一标识符 */
  userId: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 邮箱地址 */
  email: string;
  /** 手机号 */
  phone: string;
  /** 头像URL */
  avatar: string;
  /** 个人简介 */
  bio?: string;
  /** 注册时间 */
  createdAt: Date;
  /** 最后登录时间 */
  lastLoginAt: Date;
  /** 最后更新时间 */
  updatedAt?: Date;
}

/**
 * 用户统计信息接口
 */
export interface UserStats {
  /** 关注数 */
  followingCount: number;
  /** 粉丝数 */
  followersCount: number;
  /** 发帖数 */
  postsCount: number;
  /** 被浏览数 */
  viewsCount: number;
}

/**
 * 发帖类型枚举
 */
export enum PostType {
  /** 图文帖子 */
  TEXT_IMAGE = 'text_image',
  /** 视频帖子 */
  VIDEO = 'video'
}

/**
 * 帖子基本信息接口
 */
export interface Post {
  /** 帖子ID */
  id: string;
  /** 帖子类型 */
  type: PostType;
  /** 标题 */
  title: string;
  /** 作者ID */
  authorId: string;
  /** 作者信息 */
  author: Pick<UserInfo, 'userId' | 'username' | 'nickname' | 'avatar'>;
  /** 创建时间 */
  createdAt: Date;
  /** 更新时间 */
  updatedAt: Date;
  /** 点赞数 */
  upvotes: number;
  /** 评论数 */
  commentCount: number;
  /** 收藏数 */
  favoriteCount: number;
  /** 浏览数 */
  viewCount: number;
  /** 标签列表 */
  tags: string[];
  /** 封面图片URL */
  coverImage?: string;
}

/**
 * 图文帖子接口
 */
export interface TextImagePost extends Post {
  type: PostType.TEXT_IMAGE;
  /** 富文本内容 */
  content: string;
  /** 图片列表 */
  images: string[];
}

/**
 * 视频帖子接口
 */
export interface VideoPost extends Post {
  type: PostType.VIDEO;
  /** 视频简介 */
  description: string;
  /** 视频URL */
  videoUrl: string;
  /** 视频时长（秒） */
  duration: number;
}

/**
 * 文件类型枚举
 */
export enum FileType {
  /** 图片 */
  IMAGE = 'image',
  /** 视频 */
  VIDEO = 'video',
  /** 文档 */
  DOCUMENT = 'document',
  /** 压缩包 */
  ARCHIVE = 'archive',
  /** 其他 */
  OTHER = 'other'
}

/**
 * 文件信息接口
 */
export interface FileInfo {
  /** 文件ID */
  id: string;
  /** 文件名 */
  name: string;
  /** 文件类型 */
  type: FileType;
  /** 文件大小（字节） */
  size: number;
  /** 文件URL */
  url: string;
  /** 父文件夹ID */
  parentFolderId: string | null;
  /** 上传时间 */
  uploadedAt: Date;
  /** MIME类型 */
  mimeType: string;
}

/**
 * 文件夹信息接口
 */
export interface FolderInfo {
  /** 文件夹ID */
  id: string;
  /** 文件夹名称 */
  name: string;
  /** 父文件夹ID */
  parentFolderId: string | null;
  /** 创建时间 */
  createdAt: Date;
  /** 子文件夹列表 */
  subFolders: FolderInfo[];
  /** 文件列表 */
  files: FileInfo[];
}

/**
 * 通知类型枚举
 */
export enum NotificationType {
  /** 系统消息 */
  SYSTEM = 'system',
  /** 评论提醒 */
  COMMENT = 'comment',
  /** 点赞提醒 */
  LIKE = 'like',
  /** 关注提醒 */
  FOLLOW = 'follow',
  /** 收藏提醒 */
  FAVORITE = 'favorite'
}

/**
 * 通知信息接口
 */
export interface Notification {
  /** 通知ID */
  id: string;
  /** 通知类型 */
  type: NotificationType;
  /** 通知标题 */
  title: string;
  /** 通知内容 */
  content: string;
  /** 是否已读 */
  isRead: boolean;
  /** 创建时间 */
  createdAt: Date;
  /** 相关链接 */
  relatedUrl?: string;
}

/**
 * 用户动态类型枚举
 */
export enum UserActivityType {
  /** 发帖 */
  POST = 'post',
  /** 评论 */
  COMMENT = 'comment',
  /** 点赞 */
  LIKE = 'like',
  /** 收藏 */
  FAVORITE = 'favorite',
  /** 关注 */
  FOLLOW = 'follow'
}

/**
 * 用户动态接口
 */
export interface UserActivity {
  /** 动态ID */
  id: string;
  /** 动态类型 */
  type: UserActivityType;
  /** 描述 */
  description: string;
  /** 创建时间 */
  createdAt: Date;
  /** 相关对象ID */
  relatedId: string;
  /** 相关对象类型 */
  relatedType: string;
}

/**
 * 修改密码请求参数
 */
export interface ChangePasswordRequest {
  /**
   * 用户ID
   */
  userId: string;
  
  /**
   * 当前密码
   */
  currentPassword: string;
  
  /**
   * 新密码
   */
  newPassword: string;
  
  /**
   * 确认新密码
   */
  newPasswordConfirm: string;
}

/**
 * 修改手机号请求参数
 */
export interface ChangePhoneRequest {
  /**
   * 新手机号
   */
  newPhone: string;
  
  /**
   * 验证码
   */
  verificationCode: string;
}

/**
 * 修改邮箱请求参数
 */
export interface ChangeEmailRequest {
  /**
   * 用户ID
   */
  userId: string;
  
  /**
   * 新邮箱
   */
  email: string;
  
  /**
   * 验证码
   */
  verificationCode: string;
}

/**
 * 发送手机验证码请求参数
 */
export interface SendPhoneCodeRequest {
  /**
   * 手机号
   */
  phone: string;
}

/**
 * 更新隐私设置请求参数
 */
export interface UpdatePrivacySettingsRequest {
  /**
   * 用户ID
   */
  userId: string;
  
  /**
   * 是否显示邮箱
   */
  showEmail?: boolean;
  
  /**
   * 是否显示手机号
   */
  showPhone?: boolean;
  
  /**
   * 是否允许好友请求
   */
  allowFriendRequests?: boolean;
  
  /**
   * 是否展示收藏
   */
  showCollections?: boolean;
  
  /**
   * 是否展示点赞
   */
  showLikes?: boolean;
  
  /**
   * 是否展示粉丝
   */
  showFollowers?: boolean;
  
  /**
   * 是否展示关注
   */
  showFollowing?: boolean;
}

/**
 * 隐私设置响应数据
 */
export interface PrivacySettings {
  /**
   * 是否显示邮箱
   */
  showEmail: boolean;
  
  /**
   * 是否显示手机号
   */
  showPhone: boolean;
  
  /**
   * 是否允许好友请求
   */
  allowFriendRequests: boolean;
  
  /**
   * 是否展示收藏
   */
  showCollections: boolean;
  
  /**
   * 是否展示点赞
   */
  showLikes: boolean;
  
  /**
   * 是否展示粉丝
   */
  showFollowers: boolean;
  
  /**
   * 是否展示关注
   */
  showFollowing: boolean;
}