# WebDAV-only 最终优化安装候选

本目录仅供覆盖安装和设备验收。没有创建正式 Release，正式更新 manifest 保持原样，候选更新策略 disabled=true / rollout=0。

- Windows Setup / Portable 0.3.15：[下载同一候选 ZIP](https://github.com/morrowframe/english-notes-desktop/actions/runs/38500678759/artifacts/11866386486)。登录有仓库访问权的 GitHub 账号后下载，内含两个实际安装文件、源码 SHA、SHA256 和原生验收记录，保留至 2027-01-12。
- Android 8.11.18 / 81119：[下载同签名 APK](files/english-notes-8.11.18-81119.apk)。包名 com.jackie.quickentryoffline，原证书 SHA256 为 2e7fb5691085ea22881c622dcc67b9ff953fce4212bca3a9546799e554e58dbc。
- [版本、实际源码 SHA、大小与签名](CANDIDATE_GROUP.json)；[SHA256](SHA256SUMS.txt)；[完整优化 / 回归报告](REPORT.md)；[用户设备验收](DEVICE_ACCEPTANCE.md)。
- [候选更新 Manifest](release-manifest.candidate.json) 没有激活，不作为正式更新源。

Full Web / Relay 沿用已经验证的正式站点；浏览器插件沿用上一候选，本轮未改动或重新打包。Windows 安装包当前未做 Authenticode 签名。Android 保持原签名，不需要卸载原应用。

正常恢复保留当前设备身份与私有同步历史；原有损坏库救援路径保持原文件与既有策略，不混同于正常恢复验收。真实坚果云、实际 Windows / 手机、后台限制与长期离线仍待验收。
