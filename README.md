# MGRCL

Mugewrayce Launcher（简称 **MGRCL**）是一个面向 Windows 的 Minecraft 启动器，使用 Electron + TypeScript + React + Vite 构建。

> 本仓库公开源代码，主要用于代码审查、评估与安全审计。**不提供公开构建物下载**；构建产物仅由项目内部使用。
>
> 本项目与 Mojang Studios、Microsoft 没有隶属、endorsement 或赞助关系；Minecraft 是 Mojang Synergies AB 的商标。本仓库不包含 Minecraft 游戏资源。

## 当前状态

早期开发中，UI 先行：先完成界面与交互，再接入下载、启动、Fabric、Modrinth 与微软正版登录。

## 功能范围（v0.0.1）

- 原版 Minecraft 下载与启动
- Java 检测与启动参数
- Fabric 加载器安装
- Modrinth 模组浏览与安装
- 微软正版账号登录（设备码流程，不做离线模式）
- 实例隔离与管理

## 构建

要求：Windows 10/11 x64、Node.js LTS、npm。

```powershell
npm ci
npm run typecheck
npm run build
```

开发模式：

```powershell
npm run dev
```

图标重建（可选）：

```powershell
npm run build:icon
```

## 安全与隐私

- Electron 安全基线：`contextIsolation: true`、`sandbox: true`、`nodeIntegration: false`。
- preload 只暴露白名单 API；IPC 入参使用 zod 校验。
- 不收集遥测；不访问与启动器功能无关的用户文件。
- 登录 token 只保存在本地；日志中的 token 一律脱敏。
- 不包含 `client_secret`；OAuth 使用公共客户端设备码流程。

## 许可证

本仓库采用 **source-available** 许可：允许为审查、评估或安全审计查看、克隆和构建；**不允许再分发、发布修改版或商业使用**。详见 [LICENSE](./LICENSE)。

## 说明

本仓库只包含项目源码与构建所需的最小文件，不包含设计源文件、内部文档、参考项目源码、测试数据或任何账号凭据。
