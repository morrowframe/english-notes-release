# 英语摘记 Deno Relay 临时测试

用途：只验证中国大陆网络是否能通过 Deno Deploy 访问坚果云 WebDAV。

不用于正式发布，不替换现有 Cloudflare Relay。

部署入口：

https://console.deno.com/new?clone=https://github.com/morrowframe/english-notes-release&path=deno-relay-test

部署完成后会得到一个公开 HTTPS 地址，把地址填到：

https://morrowframe.github.io/english-notes-release/relay-test.html

测试页只做 WebDAV PROPFIND 连通性测试。
