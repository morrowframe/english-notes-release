# 英语摘记公开更新入口

此仓库只保存公开 Release Manifest、版本说明、下载页和 GitHub Release 安装包，不存业务数据、网盘授权码或私有源码。

稳定入口：`https://raw.githubusercontent.com/morrowframe/english-notes-release/main/release-manifest.json`。客户端只固定这个入口；APK / Setup / Portable 等下载地址从 Manifest 获取。启用 GitHub Pages 后可同时访问 `https://morrowframe.github.io/english-notes-release/release-manifest.json`。

当前 Manifest 使用原有 schema v1。所有平台 `updatePolicy.disabled=true`，`packages=[]`；在实际安装包生成、签名、SHA256、大小与下载检查完成前，不向用户报告新版本。不得填写虚构 hash 或不可用下载地址。

以后迁移下载服务器只改各包 `downloadUrl`；迁移 Manifest 入口本身仍需兼容原地址。发布正式安装包后通过主源码仓库原有 Release Runtime builder/validator 生成候选清单，核验后原子替换此文件。

GitHub Pages：Settings → Pages → Deploy from a branch → main / (root) → Save。只有页面实际可访问后才标记 Pages 已启用。

## 当前初始化状态

2026-10-06 经授权创建唯一首次 main 提交 `6ce86654e240b404abf4eddb7c431c50d26570f0`，只含已验证的 `release-manifest.json`。更新继续关闭，没有 GitHub Release 或安装包。后续公开说明与页面准备在 `dev/release-preparation-v1`，不再直接修改 main。当前客户端使用 raw 稳定入口，GitHub Pages 尚未启用。
