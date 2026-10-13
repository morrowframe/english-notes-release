# 同一文件正式发布准备

当前状态：候选交付；正式 Release 未创建；live main/gh-pages/release-manifest.json 未改变。

- 此目录 release-manifest.candidate.json 为 Manifest v1；三个平台 disabled=true、rollout=0，不能被误用开启提示。
- CANDIDATE_GROUP.json、SHA256SUMS.txt 固定候选源 SHA、文件大小、哈希、签名与 native run。
- DEVICE_ACCEPTANCE.md 由真实用户设备完成，自动化证据不替代它。
- 验收通过后下载/提升现有候选文件到同一个正式 GitHub Release；严格校验原 SHA256。不要重新构建 Windows/APK/Extension 来发布。
- 将 Manifest downloadUrl 更新为这些同一文件的正式 HTTPS Release 下载地址，保留协议/数据/数据库/Excel 兼容字段与现有 stable 来源。用既有 release-foundation 校验并核对真实远端字节后，才改 disabled=false 与正式 rollout。
- 将同一个正式 Manifest 同步到现有 main raw 和 gh-pages stable 入口；不要重建或覆盖 Pages Full Web/Relay。
