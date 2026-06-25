# Phase 1 DEV-02 ConceptPage 工程决策章节实现记录

> 日期：2026-06-25  
> 任务：DEV-02 知识点详情页决策章节  
> 范围：仅 ConceptPage 与 concept 组件；未修改 `src/data/*`、`src/types/*`、校验脚本、Search/Profile/progress utils。

## 实现内容

- 新增 `src/components/concept/DecisionGuideSection.tsx`，按 `DecisionGuide` 数据展示：
  - 负责人摘要
  - 适用场景
  - 不适用场景
  - 决策信号
  - 架构取舍
  - 评审问题
  - 落地清单
- 新增 `src/components/concept/DecisionGuideSection.module.css`，使用现有 design token，避免表格布局，移动端双列降单列。
- 更新 `src/pages/ConceptPage.tsx`：
  - 在企业案例之后、常见误区之前条件渲染 `工程决策`。
  - 仅当 `concept.decisionGuide` 存在时显示章节。
  - 无 `decisionGuide` 页面保持原章节编号；有 `decisionGuide` 页面后续章节编号自动偏移。
- 复制交互：
  - `复制评审问题` 复制 `reviewQuestions[].question / whyAsk / goodAnswerSignals`。
  - `复制落地清单` 按 `beforeBuild / beforeLaunch / running` 分组复制 `item / passSignal`。
  - 复制状态为组件内局部状态，不写入 Zustand。

## 验证

| 命令 | 结果 | 备注 |
|---|---|---|
| `cmd /c npm run validate:content` | pass | 内容校验通过，未改内容数据 |
| `cmd /c npm run lint` | pass | 无 error / warning |
| `cmd /c npm run typecheck` | pass | TypeScript 工程检查通过 |

## 风险

- 尚未做浏览器截图级响应式 QA；代码层已避免横向表格，CSS 对长文本使用 `overflow-wrap: anywhere`。
- 浏览器截图级 QA 可在 QA-01 阶段补充，重点抽查 390px 移动端无水平溢出与复制按钮状态。
