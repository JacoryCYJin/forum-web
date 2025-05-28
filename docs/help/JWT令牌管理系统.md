# JWT令牌管理系统技术文档

## 📋 系统概述

本项目实现了完整的JWT令牌自动刷新机制，提供了智能的令牌生命周期管理，确保用户无感知的登录状态维护。

### 核心功能
- **自动令牌刷新**: 令牌过期前5分钟自动刷新
- **滑动过期机制**: API调用成功时在最后30分钟内重置令牌
- **智能状态管理**: 前端自动维护令牌有效性
- **开发调试工具**: 可视化令牌状态监控

## 🔧 技术架构

### 1. 核心组件

#### TokenManager 令牌管理器
```typescript
// 主要功能
- saveToken()           // 保存令牌并启动自动刷新
- refreshToken()        // 刷新令牌
- clearToken()          // 清除令牌
- ensureValidToken()    // 确保令牌有效
- resetTokenTimeOnApiCall() // 滑动过期机制
- getTokenStatus()      // 获取令牌状态（调试用）
```

#### 请求拦截器
- 每次API调用前检查令牌有效性
- 自动添加Authorization头
- 处理不同类型的请求数据

#### 响应拦截器
- API调用成功时触发滑动过期机制
- 401错误时自动清除令牌
- 统一错误处理

### 2. 时间计算修复

#### 问题根源
- **后端配置**: 604,800,000毫秒 (7天)
- **后端返回**: 604,800秒 (7天)
- **前端错误理解**: 604,800毫秒 ≈ 10分钟
- **修复方案**: `expiresIn * 1000` 转换为毫秒

#### 修复后效果
```typescript
// 正确的时间计算
const expirationTime = tokenInfo.issuedAt + (tokenInfo.expiresIn * 1000);
```

### 3. 滑动过期机制

#### 实现策略
- **触发时机**: API调用成功后在响应拦截器中执行
- **智能判断**: 只在token剩余时间≤30分钟时刷新
- **避免过度刷新**: 剩余时间>30分钟不刷新

#### 核心代码
```typescript
static async resetTokenTimeOnApiCall(): Promise<boolean> {
  const tokenInfo = this.getTokenInfo();
  if (!tokenInfo) return false;

  const now = Date.now();
  const expirationTime = tokenInfo.issuedAt + (tokenInfo.expiresIn * 1000);
  const remainingTime = expirationTime - now;
  
  // 滑动过期阈值：30分钟
  const slidingThreshold = 30 * 60 * 1000;

  // 只有在剩余时间少于30分钟时才刷新
  if (remainingTime > slidingThreshold) {
    return true;
  }

  console.log(`🔄 API调用成功，令牌剩余时间少于30分钟，执行滑动刷新...`);
  return await this.refreshToken();
}
```

## 🚀 接口标准化

### 后端接口修改
```java
/**
 * 刷新JWT令牌
 * @param authorization Authorization请求头（包含JWT token）
 * @return 新的JWT令牌
 */
@PostMapping("/refresh-token")
public Result<LoginVO> refreshToken(@RequestHeader("Authorization") String authorization) {
    if (authorization == null || !authorization.startsWith("Bearer ")) {
        return ResultUtils.returnFail(401, "缺少有效的Authorization头");
    }
    
    String token = authorization.substring(7); // 移除 "Bearer " 前缀
    LoginVO loginVO = userService.refreshToken(token);
    return ResultUtils.returnSuccess(loginVO);
}
```

### 前端接口调用
```typescript
export async function refreshTokenApi(params: RefreshTokenRequest): Promise<LoginVO> {
  try {
    // 创建临时axios实例，绕过拦截器避免循环调用
    const tempAxios = request.create({
      baseURL: 'http://localhost:8080',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${params.token}`
      }
    });

    const response = await tempAxios.post('/user/refresh-token', {});
    const result: ApiResponse<LoginVO> = response.data;
    
    if (result.code === 0) {
      return result.data;
    } else {
      throw new Error(result.message || '刷新令牌失败');
    }
  } catch (error: any) {
    console.error('刷新令牌失败:', error);
    throw new Error(error.response?.data?.message || error.message || '刷新令牌失败，请稍后重试');
  }
}
```

## ⚙️ 配置参数

### 后端配置
```properties
# application.properties
jwt.secret=myCustomSecretKey123456789012345678901234567890abcdefghijklmnopqrstuvwxyz
jwt.expiration=604800000  # 7天过期时间（毫秒）
```

### 前端配置
```typescript
// TokenManager配置
private static readonly REFRESH_THRESHOLD = 5 * 60 * 1000;     // 提前5分钟刷新
private static readonly SLIDING_THRESHOLD = 30 * 60 * 1000;    // 滑动过期阈值30分钟
private static refreshTimer: NodeJS.Timeout | null = null;      // 定时器
```

## 🔄 完整调用链路

1. **用户调用API** → 请求拦截器检查token有效性 → 添加token到请求头 → 发送HTTP请求
2. **后端处理请求** → 响应拦截器接收响应 → 在token最后30分钟内时刷新token → 返回响应数据
3. **滑动过期判断**: 剩余时间>30分钟不刷新，≤30分钟且API调用成功时执行刷新
4. **刷新时调用后端refresh-token API** → 保存新token → 返回原始响应

## 🎯 性能优化效果

### 智能刷新策略
- **新登录用户**: 6.5小时内不刷新token
- **活跃用户**: 只在最后30分钟刷新
- **服务器负载**: 大幅减少刷新频率
- **用户体验**: 完全无感知的token管理

### 对比分析

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| **响应拦截器** | 1. 只有成功的API调用才延长token<br>2. 真正的用户活跃检测<br>3. 避免失败请求的无效刷新<br>4. 符合滑动过期概念 | 1. 可能的竞态条件<br>2. 逻辑稍微分散 | ⭐⭐⭐⭐⭐ |
| **请求拦截器** | 1. 预防性刷新<br>2. 逻辑集中<br>3. 避免无效请求 | 1. 可能过度刷新<br>2. 失败请求也会刷新<br>3. 增加请求延迟 | ⭐⭐⭐ |

## 🔍 调试与监控

### 开发环境调试工具
```typescript
// TokenStatusDebug组件
- 实时显示令牌有效性
- 显示过期状态和剩余时间
- 支持手动刷新和清除操作
- 仅在开发环境显示
```

### 控制台日志
```
💾 Token已保存，过期时间: 2025-01-28T10:00:00.000Z
⚡ 自动刷新定时器已启动
🚀 令牌管理器已初始化
⏰ 检测到令牌即将过期，尝试自动刷新...
🔄 正在刷新令牌...
✅ 令牌刷新成功
```

## 🛡️ 安全考虑

### Authorization vs Cookie对比

| 特性 | JWT Authorization Header | Cookie |
|------|-------------------------|--------|
| **存储位置** | localStorage + HTTP Header | 浏览器Cookie存储 |
| **传输方式** | `Authorization: Bearer <token>` | 自动发送Cookie头 |
| **安全性** | 需要手动防护XSS | 支持HttpOnly防护 |
| **跨域支持** | 完全支持 | 需要CORS配置 |
| **移动端支持** | 完美支持 | 部分限制 |
| **服务端解析** | 需要手动解析JWT | 自动解析Cookie |
| **有效期控制** | 令牌内置过期时间 | 服务端Session控制 |

### 安全最佳实践
- 使用标准的Authorization头传输token
- 遵循OAuth 2.0标准的Bearer token格式
- 后端严格验证token的有效性和格式
- 完善的错误处理和状态码返回

## 📝 使用方法

### 1. 登录时自动设置
```typescript
// 在登录成功后
TokenManager.saveToken({
  accessToken: loginResult.accessToken,
  tokenType: loginResult.tokenType,
  expiresIn: loginResult.expiresIn  // 7天过期时间
});
```

### 2. API调用时自动刷新
```typescript
// 每次调用API前会自动执行
const response = await get('/api/user/profile');
// 如果令牌即将过期，会先刷新再发送请求
```

### 3. 手动查看状态（开发模式）
在开发环境下，页面右下角会显示"显示Token状态"按钮，可以实时查看令牌状态。

## 🎉 总结

### 解决的核心问题
1. ✅ **JWT令牌存储时间管理**: 自动维护7天的登录有效期
2. ✅ **API调用时刷新令牌状态**: 每次API调用前确保令牌有效
3. ✅ **Authorization与Cookie的区别**: 采用更现代、更安全的Authorization Header方式

### 技术优势
- **智能刷新**: 只在必要时刷新，避免频繁请求
- **滑动过期**: 活跃用户永不过期
- **标准化接口**: 使用Authorization头，符合OAuth 2.0规范
- **完善调试**: 开发环境下可视化令牌状态
- **用户体验**: 无感知的自动续期机制

这套JWT令牌管理系统比传统的Cookie方式更灵活、更安全，特别适合单页应用和移动端使用。 