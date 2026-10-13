# WebDAV-only 候选交付记录

两个代码仓库使用独立分支 `release/webdav-only-rc-20261013`，main 未修改。安装文件源 SHA 与后续证据文档提交分别记录，文档提交未改变可执行源码。

- Desktop 当前证据 HEAD：`f428da619690298acce50c293079e93cce4a1697`；Windows / Extension 冻结源码：`17f2bacf460d1b43f81a3078524e062422af34ac`。
- Android 当前证据 HEAD：`22d985f97050655e1e8ca2cc9f6bc2e67c03adfd`；签名 APK 冻结源码：`4111b099841fff0057558217df141d584a0ee1cd`。
- Desktop 从 LAN v2 HEAD 三方合入批准 Full Web，再合入 Windows P0 原身份/历史恢复修复；staging/update 分支的非 LAN 成果均保留。原代码仓库 `release/webdav-only/INTEGRATION.md` 有整合提交与详细改动。

## LAN 完整归档

- [Desktop LAN v2](https://github.com/morrowframe/english-notes-desktop/tree/dev/lan-v2-independent-20261009)：`948cd4fc9f6ec2d6910fad833c8da60288f85f9a`。
- [Android LAN v2](https://github.com/morrowframe/offline-quick-entry-android/tree/dev/lan-v2-independent-20261009)：`b0dd64cb1531502861e16866877db85017094ccf`。
- [LAN Lab readiness](https://github.com/morrowframe/english-notes-desktop/tree/fix/lan-lab-readiness-20261013)：`918e1da349dee90c40ca1a0bdd06583f9d406cec`；开发线 `dev/lan-lab-local-build-20261010@d2483635db00b878e319d6148b4d4648cfd8de83`。

## 下线与保护

Windows 移除所有 LAN App 绑定、自动服务接线、同步页面入口和打包 Rust/OPAQUE/DLL 依赖；安装器不操作防火墙规则。Android 移除 LAN 页面/路由、生命周期恢复、发现配对管理与 JNI 构建依赖；APK 不含 LAN 原生库。旧身份、业务记录、配置与 journal/ledger 保留。WebDAV 专用迁移先归档、采用可重放收据，保留原云端身份/历史及 origin floor，退休 LAN 门禁不再阻塞业务/云端事务。

Full Web `web/app`、`web/core`、`webdav-relay` 以及 Sync Foundation、Release Foundation、Release Runtime 的 Git tree，与批准 `2cb040a5449ee71fe407dd180b07f00a9aa73f1f` 完全相等，含已完成的更新提示修复。Release main `447386b784f6af1928cb5ab5f55f0ce2574523a3`、gh-pages `c11cffd80eaa2c469422c0a119adbe6252af2491` 未移动；Pages、Relay、存储路径、live Manifest 均未部署或修改。

## 验证范围

[REGRESSION.json](REGRESSION.json) 列全部测试数量、各次 Actions 原因与限制；[LOCAL_EVIDENCE.zip](LOCAL_EVIDENCE.zip) 包含可共享的结构化结果，私有源码日志留在代码仓库 Actions 与 Work 私有证据目录。

本地 Go 全套与 vet、Windows 门禁/身份恢复、158 前端测试、168 Web/插件测试、15 安装契约、13 SQLite 契约通过。Android 36 suites / 147 tests 零失败，签名 Release APK 和非 LAN instrumentation APK 编译通过。31 个本地 HTTP WebDAV 场景覆盖双向新增/编辑/删除/恢复、重复、断网重试、冲突、分类、复习及原身份；使用当前 Go SQLite/Kotlin 协议适配器/Web SQLite，明确不是安装手机 Room/OkHttp 或真实坚果云账号。

Chrome for Testing 155 与 Edge 155 实际 MV3：加载、选词/上下文/保存/搜索、HTTPS DAV 夹具、重启/离线重试、非空 outbox 的 1.0.0→1.0.1 升级保留身份/配置、响应式设置/Popup/编辑保存、清除凭据与重新授权状态通过。实际浏览器更新提示场景通过。产品权限与原批准版相同，没有扩权；Linux 自动化预授权夹具不能代替日常 Windows 权限弹窗。

真实设备和原账号验收为 [DEVICE_ACCEPTANCE.md](DEVICE_ACCEPTANCE.md) 的 PENDING 项。正式 Release 未创建；候选 Manifest disabled=true、rollout=0。验收通过后只提升同一组已记录 SHA256 的文件，不重建四端。
