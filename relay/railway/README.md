# Railway WebDAV Relay

Standalone Railway deployment for the Full Web client.

- Fixed upstream: https://dav.jianguoyun.com
- Browser origin: https://morrowframe.github.io
- Allowed methods: OPTIONS / PROPFIND / MKCOL / GET / PUT
- No database, volume, cache, or credential storage
- Health check: /healthz
- Start command: npm start

This is a backup transport candidate. The existing Cloudflare Worker remains unchanged.
