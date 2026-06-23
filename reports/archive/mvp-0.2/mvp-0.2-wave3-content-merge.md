# MVP 0.2 Wave 3 内容合入报告

## 合入结论
PASS。Wave 3 的 M3 收尾 6 讲已按 reviewed 内容合入 `src/data/demoConcepts.ts`，通过 `demoById` 覆盖机制从 stub 升级为 `mvp`。

## 合入范围
- `maas`
- `cost-routing`
- `capability-routing`
- `cache-system`
- `rate-limit-circuit-break`
- `sla`

## 数据变更
- 6 讲均设置 `contentStatus: "mvp"`。
- 未修改任何 `id / slug / order / moduleId`。
- 未修改 56 讲目录和模块构成。
- 未修改已封板的 Wave 1 / Wave 2 正文。
- 未修改 `src/types/index.ts`、`docs/content-schema.md`、`docs/animation-spec.md`。

## 动画合入
- `cost-routing` 设置 `hasAnimation: true`，`animation.type = "model-router"`。
- `capability-routing` 设置 `hasAnimation: true`，`animation.type = "model-router"`。
- 两讲使用已存在 key：`request-labels`, `model-profiles`, `router`, `selected-model`, `fallback`, `sla`, `eval`, `observability`, `policy`。
- `maas` / `cache-system` / `rate-limit-circuit-break` / `sla` 保持 `hasAnimation: false`。

## 主学习路径
- M3 当前发布进度：8/8。
- 当前总上线讲数：32/56。
- 剩余 stub：24。

## 诊断题答案分布
- Wave 3：A=1，B=2，C=2，D=1。

## 合入后门禁
- `npm run validate:content`：PASS，已校验 demo/mvp 内容 32 个。
