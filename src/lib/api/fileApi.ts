/**
 * @file 文件上传API模块
 * @description 提供文件上传相关的API调用函数
 */

import { post } from '@/lib/utils/request';

/**
 * 文件上传响应类型
 */
export interface FileUploadResponse {
  /**
   * 文件URL
   */
  url: string;
  
  /**
   * 文件名称
   */
  fileName: string;
  
  /**
   * 文件大小
   */
  fileSize?: number;
}

/**
 * 上传图片文件
 * 
 * 将图片文件上传到OSS，返回可访问的URL
 *
 * @async
 * @param {File} file - 要上传的图片文件
 * @returns {Promise<string>} 上传后的图片URL
 * @throws {Error} 当上传失败时抛出错误
 * @example
 * // 上传图片文件
 * const imageUrl = await uploadImageApi(imageFile);
 * console.log('图片URL:', imageUrl);
 */
export async function uploadImageApi(file: File): Promise<string> {
  if (!file) {
    throw new Error('文件不能为空');
  }

  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('只支持 JPG、PNG、GIF、WebP 格式的图片');
  }

  // 验证文件大小（最大10MB）
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('图片文件大小不能超过 10MB');
  }

  console.log('📤 uploadImageApi开始上传图片:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  });

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image'); // 标识为图片类型

    const response = await post('/files/upload', formData);
    
    console.log('📥 uploadImageApi响应:', response);

    if (response.data?.url) {
      console.log('✅ 图片上传成功:', response.data.url);
      return response.data.url;
    } else {
      throw new Error('图片上传失败：未获取到文件URL');
    }
  } catch (error: any) {
    console.error('❌ uploadImageApi上传失败:', error);
    throw new Error(error.message || '图片上传失败，请稍后重试');
  }
}

/**
 * 上传附件文件
 * 
 * 将附件文件（PDF、TXT等）上传到OSS，返回文件信息
 *
 * @async
 * @param {File} file - 要上传的附件文件
 * @returns {Promise<FileUploadResponse>} 上传后的文件信息
 * @throws {Error} 当上传失败时抛出错误
 * @example
 * // 上传PDF文件
 * const fileInfo = await uploadAttachmentApi(pdfFile);
 * console.log('文件URL:', fileInfo.url);
 */
export async function uploadAttachmentApi(file: File): Promise<FileUploadResponse> {
  if (!file) {
    throw new Error('文件不能为空');
  }

  // 验证文件类型
  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-rar-compressed'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('只支持 PDF、TXT、DOC、DOCX、XLS、XLSX、ZIP、RAR 格式的文件');
  }

  // 验证文件大小（最大50MB）
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('附件文件大小不能超过 50MB');
  }

  console.log('📤 uploadAttachmentApi开始上传附件:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  });

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'attachment'); // 标识为附件类型

    const response = await post('/files/upload', formData);
    
    console.log('📥 uploadAttachmentApi响应:', response);

    if (response.data?.url) {
      const fileInfo: FileUploadResponse = {
        url: response.data.url,
        fileName: file.name,
        fileSize: file.size
      };
      
      console.log('✅ 附件上传成功:', fileInfo);
      return fileInfo;
    } else {
      throw new Error('附件上传失败：未获取到文件URL');
    }
  } catch (error: any) {
    console.error('❌ uploadAttachmentApi上传失败:', error);
    throw new Error(error.message || '附件上传失败，请稍后重试');
  }
}

/**
 * 批量上传附件文件
 * 
 * 同时上传多个附件文件
 *
 * @async
 * @param {File[]} files - 要上传的附件文件数组
 * @returns {Promise<FileUploadResponse[]>} 上传后的文件信息数组
 * @throws {Error} 当上传失败时抛出错误
 * @example
 * // 批量上传文件
 * const fileInfos = await uploadMultipleAttachmentsApi([file1, file2, file3]);
 * console.log('上传的文件:', fileInfos);
 */
export async function uploadMultipleAttachmentsApi(files: File[]): Promise<FileUploadResponse[]> {
  if (!files || files.length === 0) {
    throw new Error('文件列表不能为空');
  }

  console.log('📤 uploadMultipleAttachmentsApi开始批量上传:', {
    fileCount: files.length,
    files: files.map(f => ({ name: f.name, size: f.size, type: f.type }))
  });

  try {
    // 并行上传所有文件
    const uploadPromises = files.map(file => uploadAttachmentApi(file));
    const results = await Promise.all(uploadPromises);
    
    console.log('✅ 批量上传完成:', results);
    return results;
  } catch (error: any) {
    console.error('❌ uploadMultipleAttachmentsApi批量上传失败:', error);
    throw new Error(error.message || '批量上传失败，请稍后重试');
  }
} 