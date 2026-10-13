# 英语摘记 WebDAV-only 正式版候选

Windows 0.3.14 / Android 8.11.17 (81118) / 浏览器插件 1.0.1。

Windows 和 Android 只保留 WebDAV 云同步。移除局域网发现、配对和设备管理入口，以及旧开关导致的自动服务恢复。安装包不再依赖 LAN 配对原生库；旧数据、身份、同步历史和必要的兼容证据保留。LAN v2 / LAN Lab 继续留在独立开发分支。

插件设置页适合桌面浏览器，分组清楚，展示连接、最近同步与待发送内容；Popup 搜索优先，高级筛选可折叠，长编辑表单能完整滚动和保存。采集、上下文、搜索、直连 WebDAV、加密凭据和更新提示保留。

整合并保留已经完成的 Full Web Relay 与 Windows 原身份/历史安全恢复修复。Full Web 继续使用现有 Pages 和双 Relay，没有部署、更换服务或改变用户存储位置。

同步协议 1、数据契约 1、Excel Schema 8 和各端数据库格式保持不变。Android 保持原包名和签名；Windows Setup 继续沿用原安装位置，Portable 升级保留 Data/storage.json。

这是安装验收候选。真实用户设备与网盘验收为 PENDING，未发布正式 Release，稳定更新提示保持关闭。后续正式发布必须提升这里记录的同一组文件，核对 SHA256 后上传，不重新编译。
