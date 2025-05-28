# JSDoc3 注释规范指南

本文档提供了在使用TypeScript和React开发时，如何编写符合JSDoc3规范的注释。良好的注释不仅有助于其他开发者理解代码，也能提升IDE的智能提示功能，提高开发效率。

## 基本原则

1. **注重"为什么"而非"是什么"** - 代码本身应该清晰表达它做了什么，注释应该解释为什么这样做
2. **简洁明了** - 使用清晰简洁的语言，避免冗余信息
3. **及时更新** - 代码变更时同步更新注释，避免注释与代码不一致
4. **为复杂逻辑添加注释** - 对于复杂的算法或业务逻辑，添加详细解释
5. **使用正确的JSDoc标签** - 掌握并正确使用JSDoc标签系统

## 文件头注释

每个源代码文件顶部应包含文件说明注释：

```typescript
/**
 * @file 简要描述文件的主要功能和用途
 * @module 模块名称
 * @description 详细描述文件的功能、目的和用法
 * @author 作者名 <邮箱>
 * @copyright 版权信息
 */
```

## 函数和方法注释

函数和方法注释应包含函数的目的、参数、返回值和可能抛出的异常：

```typescript
/**
 * 函数简短描述
 * 
 * 函数的详细描述，说明其功能、算法原理或注意事项
 *
 * @param {类型} 参数名 - 参数描述
 * @param {类型} [可选参数名] - 可选参数描述
 * @param {类型} [默认参数名=默认值] - 带默认值的参数描述
 * @returns {返回类型} 返回值描述
 * @throws {错误类型} 可能抛出的错误描述
 * @example
 * // 如何使用该函数的示例
 * const result = funcName(param1, param2);
 */
function funcName(param1, param2) {
  // 函数实现
}
```

## React组件注释

React组件的注释应包含组件的用途、属性和使用示例：

```typescript
/**
 * 组件简短描述
 * 
 * 组件的详细描述，包括使用场景和特殊行为
 *
 * @component
 * @example
 * // 基本用法示例
 * <ComponentName prop1="value1" prop2={value2} />
 */
interface ComponentNameProps {
  /**
   * prop1的详细描述
   * @default 默认值(如果有)
   */
  prop1: string;
  
  /**
   * prop2的详细描述
   */
  prop2?: number;
  
  /**
   * 子元素
   */
  children?: React.ReactNode;
}

function ComponentName({ prop1, prop2, children }: ComponentNameProps) {
  // 组件实现
}

export default ComponentName;
```

## TypeScript类型注释

为TypeScript接口、类型和枚举添加注释：

```typescript
/**
 * 用户信息接口
 * 
 * 包含用户基本信息的数据结构
 */
interface User {
  /**
   * 用户唯一标识符
   */
  id: string;
  
  /**
   * 用户名
   */
  username: string;
  
  /**
   * 用户邮箱
   */
  email: string;
  
  /**
   * 用户注册时间
   */
  createdAt: Date;
}

/**
 * 用户角色枚举
 */
enum UserRole {
  /**
   * 普通用户
   */
  USER = 'user',
  
  /**
   * 管理员
   */
  ADMIN = 'admin',
  
  /**
   * 超级管理员
   */
  SUPER_ADMIN = 'super_admin'
}
```

## Zustand状态管理注释

为Zustand状态存储添加注释：

```typescript
/**
 * 用户状态管理
 * 
 * 处理用户登录、登出和个人信息更新等操作
 * 
 * @example
 * // 如何使用该状态存储
 * const user = useUserStore(state => state.user);
 * const login = useUserStore(state => state.login);
 * 
 * // 登录操作
 * login({ email: 'user@example.com', password: 'password' });
 */
interface UserState {
  /**
   * 当前用户信息
   */
  user: User | null;
  
  /**
   * 登录状态
   */
  isLoading: boolean;
  
  /**
   * 错误信息
   */
  error: string | null;
  
  /**
   * 用户登录
   * 
   * @param credentials - 登录凭证
   * @returns 登录操作的Promise
   * @throws 登录失败时抛出错误
   */
  login: (credentials: { email: string; password: string }) => Promise<void>;
  
  /**
   * 用户登出
   */
  logout: () => void;
  
  /**
   * 更新用户信息
   * 
   * @param data - 需要更新的用户数据
   * @returns 更新操作的Promise
   */
  updateProfile: (data: Partial<User>) => Promise<void>;
}
```

## API函数注释

API调用函数的注释：

```typescript
/**
 * 获取用户列表API
 * 
 * 从服务器获取用户列表数据
 *
 * @async
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页显示数量
 * @param {string} [params.sortBy] - 排序字段
 * @returns {Promise<{users: User[], total: number}>} 用户列表数据和总数
 * @throws {ApiError} 当API请求失败时抛出错误
 */
async function getUserListApi(params: {
  page: number;
  pageSize: number;
  sortBy?: string;
}): Promise<{users: User[], total: number}> {
  // API实现
}
```

## Hooks注释

自定义Hooks的注释：

```typescript
/**
 * 用户身份验证Hook
 * 
 * 提供用户登录、登出和验证状态的功能
 *
 * @hook
 * @example
 * // 如何使用该Hook
 * const { user, login, logout, isLoading } = useAuth();
 * 
 * // 登录操作
 * login({ email: 'user@example.com', password: 'password' });
 * 
 * @returns {Object} 包含用户状态和认证方法的对象
 * @returns {User|null} returns.user - 当前用户信息
 * @returns {boolean} returns.isLoading - 加载状态
 * @returns {string|null} returns.error - 错误信息
 * @returns {Function} returns.login - 登录方法
 * @returns {Function} returns.logout - 登出方法
 */
function useAuth() {
  // Hook实现
}
```

## 事件处理函数注释

事件处理函数的注释：

```typescript
/**
 * 处理表单提交
 * 
 * 验证表单数据并提交到服务器
 *
 * @param {React.FormEvent<HTMLFormElement>} event - 表单提交事件
 * @returns {Promise<void>}
 */
async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
  // 函数实现
}
```

## 工具函数注释

工具函数的注释：

```typescript
/**
 * 日期格式化函数
 * 
 * 将Date对象格式化为指定格式的字符串
 *
 * @param {Date} date - 要格式化的日期
 * @param {string} [format='YYYY-MM-DD'] - 输出格式
 * @returns {string} 格式化后的日期字符串
 * @example
 * // 返回: "2023-04-15"
 * formatDate(new Date(2023, 3, 15));
 * 
 * // 返回: "15/04/2023"
 * formatDate(new Date(2023, 3, 15), 'DD/MM/YYYY');
 */
function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
  // 函数实现
}
```

## 常见JSDoc标签参考

| 标签 | 描述 | 示例 |
|------|------|------|
| `@file` | 文件描述 | `@file 用户管理模块` |
| `@module` | 模块名称 | `@module UserManagement` |
| `@author` | 作者信息 | `@author 张三 <zhangsan@example.com>` |
| `@copyright` | 版权信息 | `@copyright Company Inc. 2023` |
| `@description` | 详细描述 | `@description 这个函数处理...` |
| `@param` | 参数描述 | `@param {string} name - 用户名` |
| `@returns` | 返回值描述 | `@returns {boolean} 是否成功` |
| `@throws` | 可能抛出的异常 | `@throws {Error} 参数无效时` |
| `@example` | 使用示例 | `@example const result = add(1, 2);` |
| `@deprecated` | 标记为已弃用 | `@deprecated 使用newFunc替代` |
| `@since` | 添加版本 | `@since v1.2.0` |
| `@see` | 引用其他文档 | `@see OtherFunction` |
| `@todo` | 待办事项 | `@todo 实现缓存机制` |
| `@version` | 版本号 | `@version 1.0.0` |
| `@async` | 标记为异步函数 | `@async` |
| `@component` | 标记为React组件 | `@component` |
| `@hook` | 标记为React Hook | `@hook` |
| `@default` | 默认值 | `@default true` |
| `@type` | 类型说明 | `@type {string[]}` |
| `@typedef` | 定义类型 | `@typedef {Object} UserOptions` |
| `@callback` | 回调函数类型 | `@callback RequestCallback` |
| `@memberof` | 成员所属 | `@memberof namespace` |
| `@private` | 私有成员 | `@private` |
| `@protected` | 受保护成员 | `@protected` |
| `@public` | 公共成员 | `@public` |
| `@readonly` | 只读成员 | `@readonly` |
| `@ignore` | 从文档中排除 | `@ignore` |

## 注释实践示例

### 完整的React组件示例

```typescript
/**
 * @file 用户详情组件
 * @module components/features/user
 * @description 显示用户详细信息的组件，支持编辑操作
 * @author 张三 <zhangsan@example.com>
 */

import React, { useState, useEffect } from 'react';
import { ElButton, ElInput, ElMessage } from 'element-plus';
import { getUserByIdApi, updateUserApi } from '@/lib/api/user';
import { useUserStore } from '@/store/user';

/**
 * 用户详情组件Props
 */
interface UserDetailsProps {
  /**
   * 用户ID
   */
  userId: string;
  
  /**
   * 是否处于编辑模式
   * @default false
   */
  editMode?: boolean;
  
  /**
   * 保存成功后的回调函数
   */
  onSaveSuccess?: () => void;
}

/**
 * 用户详情组件
 * 
 * 显示用户详细信息并支持编辑功能
 *
 * @component
 * @example
 * // 只读模式
 * <UserDetails userId="123" />
 * 
 * // 编辑模式
 * <UserDetails userId="123" editMode={true} onSaveSuccess={() => alert('保存成功')} />
 */
export function UserDetails({ 
  userId, 
  editMode = false, 
  onSaveSuccess 
}: UserDetailsProps) {
  /**
   * 用户数据状态
   */
  const [user, setUser] = useState<User | null>(null);
  
  /**
   * 加载状态
   */
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  /**
   * 错误信息
   */
  const [error, setError] = useState<string | null>(null);
  
  /**
   * 是否处于编辑状态
   */
  const [isEditing, setIsEditing] = useState<boolean>(editMode);
  
  /**
   * 用户输入的表单数据
   */
  const [formData, setFormData] = useState<Partial<User>>({});
  
  /**
   * 获取用户详情数据
   * 
   * @async
   */
  const fetchUserDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = await getUserByIdApi(userId);
      setUser(userData);
      setFormData(userData);
    } catch (err) {
      setError('获取用户数据失败');
      console.error('获取用户数据错误:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 初始化时获取用户数据
   */
  useEffect(() => {
    fetchUserDetails();
  }, [userId]);
  
  /**
   * 处理表单输入变化
   * 
   * @param {string} field - 字段名
   * @param {any} value - 字段值
   */
  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };
  
  /**
   * 保存用户数据
   * 
   * @async
   */
  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      await updateUserApi(userId, formData);
      setUser({ ...user, ...formData } as User);
      setIsEditing(false);
      ElMessage.success('保存成功');
      
      // 调用保存成功回调
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      setError('保存用户数据失败');
      ElMessage.error('保存失败');
      console.error('保存用户数据错误:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 渲染加载状态
  if (isLoading && !user) {
    return <div className="p-4">加载中...</div>;
  }
  
  // 渲染错误状态
  if (error && !user) {
    return <div className="p-4 text-red-500">{error}</div>;
  }
  
  // 用户不存在
  if (!user) {
    return <div className="p-4">用户不存在</div>;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">用户详情</h2>
      
      {/* 用户信息表单 */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">用户名</label>
          {isEditing ? (
            <ElInput
              value={formData.username}
              onChange={(value) => handleInputChange('username', value)}
            />
          ) : (
            <p className="p-2 bg-gray-50 dark:bg-gray-700 rounded">{user.username}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">电子邮箱</label>
          {isEditing ? (
            <ElInput
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
            />
          ) : (
            <p className="p-2 bg-gray-50 dark:bg-gray-700 rounded">{user.email}</p>
          )}
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="mt-6 flex space-x-4">
        {isEditing ? (
          <>
            <ElButton 
              type="primary" 
              onClick={handleSave} 
              loading={isLoading}
            >
              保存
            </ElButton>
            <ElButton 
              onClick={() => {
                setIsEditing(false);
                setFormData(user);
              }}
            >
              取消
            </ElButton>
          </>
        ) : (
          <ElButton 
            type="primary" 
            onClick={() => setIsEditing(true)}
          >
            编辑
          </ElButton>
        )}
      </div>
    </div>
  );
}

export default UserDetails;
```

### API调用函数完整示例

```typescript
/**
 * @file 用户API模块
 * @module lib/api/user
 * @description 提供用户相关的API调用函数
 */

import { apiClient } from '../apiClient';

/**
 * 用户列表请求参数
 */
export interface UserListParams {
  /**
   * 页码，从1开始
   */
  page: number;
  
  /**
   * 每页显示数量
   * @default 20
   */
  pageSize?: number;
  
  /**
   * 搜索关键词
   */
  search?: string;
  
  /**
   * 排序字段
   */
  sortBy?: string;
  
  /**
   * 排序方向
   * @default 'asc'
   */
  sortDirection?: 'asc' | 'desc';
}

/**
 * 用户列表响应数据
 */
export interface UserListResponse {
  /**
   * 用户列表
   */
  users: User[];
  
  /**
   * 总记录数
   */
  total: number;
  
  /**
   * 当前页码
   */
  page: number;
  
  /**
   * 每页记录数
   */
  pageSize: number;
}

/**
 * 获取用户列表
 * 
 * 获取分页的用户列表数据
 *
 * @async
 * @param {UserListParams} params - 请求参数
 * @returns {Promise<UserListResponse>} 用户列表数据
 * @throws {ApiError} 当API请求失败时抛出错误
 * @example
 * // 获取第一页用户数据
 * const { users, total } = await getUserListApi({ page: 1, pageSize: 20 });
 * 
 * // 获取带搜索条件的用户数据
 * const { users, total } = await getUserListApi({ 
 *   page: 1, 
 *   pageSize: 20,
 *   search: 'john',
 *   sortBy: 'createdAt',
 *   sortDirection: 'desc'
 * });
 */
export async function getUserListApi(params: UserListParams): Promise<UserListResponse> {
  const { page, pageSize = 20, search, sortBy, sortDirection = 'asc' } = params;
  
  try {
    const response = await apiClient.get('/users', {
      params: {
        page,
        pageSize,
        search,
        sortBy,
        sortDirection
      }
    });
    
    return response.data;
  } catch (error) {
    // 处理错误，可能会重新格式化或附加额外信息
    console.error('获取用户列表失败:', error);
    throw error;
  }
}

/**
 * 获取单个用户详情
 * 
 * 根据用户ID获取详细信息
 *
 * @async
 * @param {string} userId - 用户ID
 * @returns {Promise<User>} 用户详情数据
 * @throws {ApiError} 当API请求失败时抛出错误
 */
export async function getUserByIdApi(userId: string): Promise<User> {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`获取用户(ID: ${userId})详情失败:`, error);
    throw error;
  }
}

/**
 * 更新用户信息
 * 
 * 部分更新用户数据
 *
 * @async
 * @param {string} userId - 用户ID
 * @param {Partial<User>} userData - 要更新的用户数据
 * @returns {Promise<User>} 更新后的用户数据
 * @throws {ApiError} 当API请求失败时抛出错误
 */
export async function updateUserApi(userId: string, userData: Partial<User>): Promise<User> {
  try {
    const response = await apiClient.patch(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`更新用户(ID: ${userId})信息失败:`, error);
    throw error;
  }
}

/**
 * 删除用户
 * 
 * 根据用户ID删除用户
 *
 * @async
 * @param {string} userId - 用户ID
 * @returns {Promise<void>}
 * @throws {ApiError} 当API请求失败时抛出错误
 */
export async function deleteUserApi(userId: string): Promise<void> {
  try {
    await apiClient.delete(`/users/${userId}`);
  } catch (error) {
    console.error(`删除用户(ID: ${userId})失败:`, error);
    throw error;
  }
}
```

## 注释风格约定

1. **使用第三人称现在时** - 例如，使用"返回用户数据"而不是"将返回用户数据"
2. **保持一致性** - 整个项目中使用一致的注释风格和术语
3. **使用命令句式** - 在函数描述中，使用"获取用户数据"而非"这个函数获取用户数据"
4. **避免不必要的标点符号** - 注释描述通常不需要句号结尾
5. **使用简洁的语言** - 避免使用"这个函数是用来..."等冗余短语

---

通过遵循以上JSDoc3注释规范，可以提高代码的可读性和可维护性，同时为团队成员提供清晰的代码文档。良好的注释也能够帮助IDE提供更准确的智能提示，提高开发效率。 