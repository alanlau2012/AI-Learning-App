# MVP 0.2 Wave 1 内容合入报告

## 合入结论
PASS。Wave 1 的 7 讲已按审核通过内容合入 `src/data/demoConcepts.ts`，通过现有 `concepts.ts` 的 `demoById` 覆盖机制从 stub 升级为 `mvp`。

## 合入范围
- `semantic-space`
- `transformer`
- `positional-encoding`
- `autoregressive`
- `sampling`
- `instruction-tuning`
- `hallucination`

## 数据变更
- 7 讲均设置 `contentStatus: "mvp"`。
- 未修改任何 `id / slug / order / moduleId`。
- 未修改 56 讲目录和模块构成。
- 未修改已封板 12 讲正文。
- 未修改 `src/types/index.ts`、`docs/content-schema.md`、`docs/animation-spec.md`。

## 动画合入
- `autoregressive` 设置 `hasAnimation: true`。
- `autoregressive.animation.type = "token-flow"`。
- highlightTargets：`input-text`, `tokens`, `prefill`, `decode`, `output-tokens`, `cost`。
- 其余 6 讲保持 `hasAnimation: false`，无 animation 字段。

## 主学习路径
M1 当前发布进度为 9/10。`reasoning-limit` 仍保持 stub，不进入详情主路径。

## 诊断题答案分布
- A：2
- B：2
- C：2
- D：1

## 合入后门禁
- `npm run validate:content`：PASS
- `npm run typecheck`：PASS
- `npm run lint`：PASS
- `npm run build`：PASS

