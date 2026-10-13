# WebDAV-only 最终安装候选（2026-10-13）

四件安装候选已生成，自动化与 Windows 原生安装验证通过；真实用户设备验收 PENDING。正式 Release 未发布，稳定更新保持关闭。

| 安装文件 | 下载 | 签名 |
| --- | --- | --- |
| Windows 0.3.14 amd64 Setup | [Windows 候选包](https://github.com/morrowframe/english-notes-desktop/actions/runs/38468737946/artifacts/11851041993)，下载后解压取 Setup.exe | NotSigned |
| Windows 0.3.14 amd64 Portable ZIP | 同一 Windows 候选包内的 Portable.zip | ZIP 不适用 Authenticode；与 Setup 安装程序内置 exe 字节一致 |
| Android 8.11.17 / 81118 | [原签名 Release APK](files/english-notes-8.11.17-81118.apk) | APK v2 验证通过，延续原签名 |
| Chrome / Edge 1.0.1 | [Extension ZIP](files/EnglishNotes-Extension-1.0.1-Chrome-Edge.zip) | 未打包 MV3 ZIP，非商店签名 |

Windows 私有仓库 artifact 需要使用有仓库访问权的 GitHub 账号，保存至 2027-01-11；同一包还含 candidate-receipt.json、SHA256SUMS、installed-overlay.json 和 SOURCE_COMMIT。Work 的下载代理不允许将该 artifact 复制到本地，因此此处保留真实原生 artifact 下载，不替换、不重新构建。

[版本 / 源码 SHA / 大小 / 签名 / SHA256](CANDIDATE_GROUP.json) · [四件文件 SHA256SUMS](SHA256SUMS.txt)（把四件下载文件放同一目录后校验） · [Windows 原生收据](WINDOWS_CANDIDATE_RECEIPT.json) · [Windows 原生验证](WINDOWS_NATIVE_RESULTS.json) · [完整回归与边界](REGRESSION.json) · [本地结果证据](LOCAL_EVIDENCE.zip) · [整合、LAN 归档与保护证据](INTEGRATION_DELIVERY.md)

插件效果：[桌面设置](screenshots/options-desktop.png)、[窄屏设置](screenshots/options-narrow.png)、[最近摘记](screenshots/popup-recent.png)、[搜索](screenshots/popup-search.png)、[长编辑表单](screenshots/popup-editor.png)。截图来自实际加载的 Chrome MV3 插件和测试记录。

插件升级必须在原解压目录替换文件并“重新加载”，保留原 profile、扩展 ID 与加载路径，不卸载旧插件。Portable 关闭软件后仅替换程序和说明，保留 Data/storage.json 和原 Runtime。Android 直接覆盖安装，不清数据。

[Release 说明](RELEASE_NOTES.md) · [Manifest v1 候选](release-manifest.candidate.json) · [真实设备验收项](DEVICE_ACCEPTANCE.md) · [同一文件正式提升说明](PROMOTION.md)。Manifest 三端 disabled=true、rollout=0；Windows 正式 Release URL 已准备，验收后上传同一文件才可启用。未修改 live stable Manifest。

Full Web 继续使用 <https://morrowframe.github.io/english-notes-release/>。批准版网页与 Relay 源码 Git tree 完全相等，Pages、服务、数据位置、main 与 gh-pages 未改变。
