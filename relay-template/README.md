# 英语摘记 WebDAV Relay

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/morrowframe/english-notes-release/tree/main/relay-template)

这是“英语摘记” Full Web 的最小 WebDAV 中转。它只允许来自 `https://morrowframe.github.io` 的浏览器请求，并只转发到 `https://dav.jianguoyun.com/dav/`。

- 不保存账号、授权码或摘记内容
- 不使用 KV / D1 / R2
- 不记录请求日志
- 不开放任意代理地址
- 仅支持现有 Full Web 所需的 OPTIONS / PROPFIND / MKCOL / GET / PUT
- 当前发布用于 iOS / Safari 真机验收

部署后地址形如：

`https://english-notes-webdav-relay.<你的Cloudflare子域>.workers.dev`

把该地址发回 ChatGPT，即可继续自动接入 Full Web。
