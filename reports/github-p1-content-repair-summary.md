# GitHub P1 内容修复回合摘要

日期：2026-06-23

## 范围

- GitHub issue #3：`trace` / `tool-calling` 缺少敏感数据最小化边界。
- GitHub issue #4：`session-affinity` 误导性绑定上下文连续性与 KV / Prefix Cache 复用。
- 联动轻修：`observability` 去 trace-centric 表述。

## 改动摘要

- `trace`：从“记录每一步输入输出、异常请求全量采样”改为“结构化 span、脱敏摘要、引用 id / hash、版本、错误码、权限上下文、高覆盖采样、访问控制、保留期和租户隔离”。
- `tool-calling`：从“所有调用参数进入 trace”改为记录安全字段、参数 schema、工具版本、审批 id、影响范围、脱敏参数摘要和错误码。
- `session-affinity`：明确其是缓存 / 服务端状态局部性策略，不是上下文连续性的来源；KV / prefix cache 复用依赖 shared prefix、cache key、模型 / schema 一致、缓存未过期和服务实现支持。
- `observability`：明确可观测体系由 metrics、logs、traces、eval signals、feedback、版本和成本共同组成，trace 是下钻链路之一。

## 内容流水线

- 草稿：`content/drafts/trace-tool-calling-session-affinity-p1-fix.md`
- 审核：`content/reviewed/trace-tool-calling-session-affinity-p1-fix.md`
- 入库：`src/data/demoConcepts.ts`

## 验证

- `npm run validate:content`：PASS（published 56 / animation / terminology 全绿）。
- `npm run typecheck`：PASS。

## 后续

- 不改 schema、路由、组件协议、动画 registry。
- `output/content-audit-extract.txt` 为审计临时产物，不参与应用构建，本轮不更新。
