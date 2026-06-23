# MVP 0.2 Wave 2 内容合入报告

## 合入结论
PASS。Wave 2 的 7 讲已按自审通过内容合入 `src/data/demoConcepts.ts`，并通过现有 `concepts.ts` 的 `demoById` 覆盖机制从 stub 升级为 `mvp`。

## 合入范围
- `reasoning-limit`
- `tpot`
- `session-affinity`
- `batch-scheduling`
- `pd-separation`
- `speculative-decoding`
- `quantization`

## 数据变更
- 7 讲均设置 `contentStatus: "mvp"`。
- 未修改任何 `id / slug / order / moduleId`。
- 未修改 56 讲目录和模块构成。
- 未修改已封板 12 讲正文。
- 未修改 Wave 1 已上线 7 讲正文。
- 未修改 `src/types/index.ts`、`docs/content-schema.md`、`docs/animation-spec.md`。

## 动画合入
- `tpot` 设置 `hasAnimation: true`，`animation.type = "prefill-decode"`。
- `tpot` 使用已验证 key：`first-output-token`, `decode-loop`, `tpot`, `token-interval`, `long-output`, `total-latency`。
- `session-affinity` 设置 `hasAnimation: true`，`animation.type = "kv-cache"`。
- `session-affinity` 使用已验证 key：`session`, `instance`, `prefill`, `kv-write`, `cache-hit`, `decode`, `route-miss`, `cache-miss`, `memory`, `eviction`。
- 其他 5 讲保持 `hasAnimation: false`，无 `animation` 字段。
- 未新增动画协议、组件或修改 AnimationPlayer。

## 主学习路径
- M1 当前发布进度：10/10。
- M2 当前发布进度：10/10。
- 当前总上线讲数：26/56。
- 剩余 stub：30。
- `reasoning-limit` 下一讲指向已上线 `prefill`。
- `quantization` 下一讲指向已上线 `model-gateway`。
- 主路径未进入剩余 stub。

## 诊断题答案分布
- Wave 2：A=1，B=2，C=2，D=2。
- Wave 1 + Wave 2：A=3，B=4，C=4，D=3。

## 合入后门禁
- `npm run validate:content`：PASS，已校验 demo/mvp 内容 26 个。
- 状态抽查：M1=10，M2=10，总上线=26，剩余 stub=30。

