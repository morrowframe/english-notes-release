# WebDAV-only 安装候选（2026-10-13）

代码与本地回归已收口。Windows 原生候选正在修复后的最终 Actions 流程中构建；此 checkpoint 明确不是四件安装包已完成，也不是正式 Release。

- [Android 8.11.17 / 81118 签名 APK](files/english-notes-8.11.17-81118.apk)
- [Chrome / Edge 插件 1.0.1 ZIP](files/EnglishNotes-Extension-1.0.1-Chrome-Edge.zip)（首次解压后加载；升级时在原解压目录替换文件，再“重新加载”，不要卸载旧插件或更换加载路径）
- Windows Setup + Portable：见 [最终 Windows 原生流程](https://github.com/morrowframe/english-notes-desktop/actions/runs/38468737946)，完成后补入实际文件与校验信息。

[版本 / 源码 SHA / 大小 / 签名 / SHA256](CANDIDATE_GROUP.json) · [SHA256SUMS](SHA256SUMS.txt) · [回归结果与边界](REGRESSION.json) · [本地自动化结果证据](LOCAL_EVIDENCE.zip)

插件效果：[桌面设置](screenshots/options-desktop.png)、[窄屏设置](screenshots/options-narrow.png)、[最近摘记](screenshots/popup-recent.png)、[搜索](screenshots/popup-search.png)、[长编辑表单](screenshots/popup-editor.png)。截图来自实际加载的 MV3 插件和测试记录。

[Release 说明](RELEASE_NOTES.md) · [Manifest v1 候选（disabled=true）](release-manifest.candidate.json) · [真实设备验收项](DEVICE_ACCEPTANCE.md) · [同一文件正式提升说明](PROMOTION.md)。

保留 Full Web：<https://morrowframe.github.io/english-notes-release/>；没有改变 Pages、Relay、数据位置、live stable Manifest 或更新投放。
