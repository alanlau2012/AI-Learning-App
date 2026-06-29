# Security Readiness Report — 2026-06-28

## 结论

安全隐私门禁 PASS，满足本轮 Web 生产化与桌面内部试用发行要求。已补基础 CSP、Electron 外链 allowlist，并记录 sandbox iframe 的本地静态素材安全假设。

## 已完成加固

1. `index.html` 增加基础 CSP：
   - `default-src 'self'`
   - `script-src 'self'`
   - `style-src 'self' 'unsafe-inline'`
   - `img-src 'self' data:`
   - `font-src 'self'`
   - `frame-src 'self'`
   - `connect-src 'self' ws: http://localhost:* http://127.0.0.1:*`
   - `object-src 'none'`
   - `base-uri 'self'`
   - `form-action 'none'`

2. Electron 外链策略收紧：
   - 仅允许 `mailto:`
   - 仅允许 `https/http` 到 `github.com`、`www.github.com`、`gsap.com`、`www.gsap.com`
   - 其他 `window.open` / 顶层导航默认拒绝

3. HyperFrame iframe 边界说明：
   - iframe 使用 `sandbox="allow-scripts"`，不授予 same-origin。
   - sandbox 文档为 opaque origin，`postMessage('*')` 保留，但接收端校验 `event.source`、origin、message type、material id。
   - 该假设仅适用于仓库内静态课程素材，不适用于未来外部动态内容。

4. 依赖审计：
   - `cmd /c npm audit --omit=dev`：0 vulnerabilities
   - `cmd /c npm audit`：0 vulnerabilities

## 不在本轮范围

- 登录、账号、后端、真实模型 API、远程内容加载均未引入。
- 桌面版仍未配置正式代码签名、自动更新、安装包发布渠道。

## 残余风险

- CSP 当前保留 `style-src 'unsafe-inline'`，因为现有 Vite/CSS 注入与静态样式路径尚未做 nonce/hash 化；正式企业安全基线可在下一轮收紧。
- 若未来 HyperFrame 支持外部 URL 或用户上传素材，必须改为精确 `targetOrigin` 与内容签名/allowlist。
