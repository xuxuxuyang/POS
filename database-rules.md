# 微信云开发数据库集合安全规则

## 集合列表

以下是 POS 机推广小程序需要创建的集合列表：

1. `user` - 用户信息
2. `product` - 产品信息
3. `order` - 订单信息
4. `payment` - 支付记录
5. `follow_up` - 客户跟进记录
6. `admin_user` - 管理员信息
7. `admin_token` - 管理员令牌
8. `role` - 角色管理
9. `config` - 系统配置

## 安全规则

### user（用户信息）

```json
{
  "read": "doc._openid == auth.openid || (doc._openid != auth.openid && get(/databases/$(database)/documents/role/$(auth.uid)).role_name in ['admin', 'super_admin'])",
  "write": "doc._openid == auth.openid || get(/databases/$(database)/documents/role/$(auth.uid)).role_name in ['admin', 'super_admin']"
}
```

说明：

- 用户只能读写自己的记录
- 管理员可以读取和修改所有用户记录

### product（产品信息）

```json
{
  "read": true,
  "write": "get(/databases/$(database)/documents/role/$(auth.uid)).role_name in ['admin', 'super_admin']"
}
```

说明：

- 所有用户都可以读取产品信息
- 只有管理员可以增删改产品

### order（订单信息）

```json
{
  "read": "doc._openid == auth.openid || get(/databases/$(database)/documents/role/$(auth.uid)).role_name in ['admin', 'super_admin']",
  "write": {
    ".create": "doc._openid == auth.openid",
    ".update": "doc._openid == auth.openid || get(/databases/$(database)/documents/role/$(auth.uid)).role_name in ['admin', 'super_admin']",
    ".remove": "get(/databases/$(database)/documents/role/$(auth.uid)).role_name in ['admin', 'super_admin']"
  }
}
```

说明：

- 用户只能读取自己的订单
- 用户可以创建自己的订单
- 用户可以更新自己的订单（如修改配送地址等）
- 管理员可以读取、更新所有订单
- 只有管理员可以删除订单

### payment（支付记录）

```json
{
  "read": "doc._openid == auth.openid || get(/databases/$(database)/documents/role/$(auth.uid)).role_name in ['admin', 'super_admin']",
  "write": {
    ".create": "doc._openid == auth.openid || get(/databases/$(database)/documents/role/$(auth.uid)).role_name in ['admin', 'super_admin']",
    ".update": "get(/databases/$(database)/documents/role/$(auth.uid)).role_name in ['admin', 'super_admin']",
    ".remove": "get(/databases/$(database)/documents/role/$(auth.uid)).role_name in ['super_admin']"
  }
}
```

说明：

- 用户只能读取自己的支付记录
- 用户可以创建自己的支付记录
- 只有管理员可以更新支付记录状态
- 只有超级管理员可以删除支付记录

### follow_up（客户跟进记录）

```json
{
  "read": "doc.user_openid == auth.openid || get(/databases/$(database)/documents/role/$(auth.uid)).role_name in ['admin', 'super_admin']",
  "write": "get(/databases/$(database)/documents/role/$(auth.uid)).role_name in ['admin', 'super_admin']"
}
```

说明：

- 用户只能读取与自己相关的跟进记录
- 只有管理员可以创建、更新和删除跟进记录

### admin_user（管理员信息）

```json
{
  "read": "get(/databases/$(database)/documents/role/$(auth.uid)).role_name in ['admin', 'super_admin']",
  "write": "get(/databases/$(database)/documents/role/$(auth.uid)).role_name == 'super_admin'"
}
```

说明：

- 只有管理员可以读取管理员信息
- 只有超级管理员可以创建、更新和删除管理员信息

### admin_token（管理员令牌）

```json
{
  "read": "resource.data.openid == auth.openid || get(/databases/$(database)/documents/role/$(auth.uid)).role_name == 'super_admin'",
  "write": {
    ".create": "doc.openid == auth.openid",
    ".update": "doc.openid == auth.openid || get(/databases/$(database)/documents/role/$(auth.uid)).role_name == 'super_admin'",
    ".remove": "doc.openid == auth.openid || get(/databases/$(database)/documents/role/$(auth.uid)).role_name == 'super_admin'"
  }
}
```

说明：

- 管理员只能读取自己的令牌记录
- 超级管理员可以读取所有令牌记录
- 管理员可以创建自己的令牌
- 管理员可以更新、删除自己的令牌
- 超级管理员可以更新、删除任何令牌

### role（角色管理）

```json
{
  "read": "get(/databases/$(database)/documents/role/$(auth.uid)).role_name in ['admin', 'super_admin']",
  "write": "get(/databases/$(database)/documents/role/$(auth.uid)).role_name == 'super_admin'"
}
```

说明：

- 只有管理员可以读取角色信息
- 只有超级管理员可以创建、更新和删除角色信息

### config（系统配置）

```json
{
  "read": true,
  "write": "get(/databases/$(database)/documents/role/$(auth.uid)).role_name == 'super_admin'"
}
```

说明：

- 所有用户都可以读取系统配置
- 只有超级管理员可以修改系统配置

## 创建初始超级管理员步骤

由于角色管理使用了循环权限检查（检查用户是否拥有管理员角色需要查询角色表），所以第一次设置时需要直接在云开发控制台操作：

1. 创建 `admin_user` 集合，添加管理员记录：

```json
{
  "username": "admin",
  "password": "经过SHA256加密的密码",
  "salt": "随机生成的盐值",
  "name": "超级管理员",
  "status": 1,
  "created_at": "服务器日期",
  "updated_at": "服务器日期"
}
```

2. 获取管理员 OpenID（可通过 login 云函数或在云开发控制台查询）

3. 创建 `role` 集合，添加超级管理员角色记录：

```json
{
  "role_name": "super_admin",
  "role_desc": "超级管理员",
  "openid": "管理员的OpenID",
  "permissions": ["all"],
  "created_at": "服务器日期",
  "updated_at": "服务器日期"
}
```

4. 设置所有集合的安全规则
