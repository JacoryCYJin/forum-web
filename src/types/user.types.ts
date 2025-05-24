/**
 * @file 用户相关类型定义
 * @description 包含用户、发帖、文件管理等功能的类型接口
 */

/**
 * 用户基本信息接口
 */
export interface User {
  /** 用户唯一标识符 */
  id: string;
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
  /** 注册时间 */
  createdAt: Date;
  /** 最后登录时间 */
  lastLoginAt: Date;
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
  author: Pick<User, 'id' | 'username' | 'nickname' | 'avatar'>;
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