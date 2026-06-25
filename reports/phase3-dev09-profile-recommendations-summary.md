# Phase 3 DEV-09 Profile 本周建议与判断偏差 Summary

日期：2026-06-25

## 范围

- 在既有 Profile 能力域与角色路径基础上，新增“本周建议”和“判断偏差”两个模块。
- 修改范围限定在 `src/utils/progress.ts`、`src/pages/ProfilePage.tsx`、`src/pages/ProfilePage.module.css` 与本报告。
- 未修改 `progressStore`、类型 schema、数据文件、路由、Search/Glossary 或 scenario 文件。

## 主要实现

### 1. 本周建议

新增 `getWeeklyProfileRecommendations`，按最多 3 条输出具体行动：

- 错题信号：优先推荐下一题复盘，链接到错题所属知识点。
- 收藏信号：收藏但未完成的知识点转为本周完成行动。
- 能力域信号：选择最低完成/诊断估算且仍有下一讲的能力域。
- 角色路径信号：选择完成度较低且仍有下一讲的角色路径。
- 场景演练兜底：推荐 model-router failure diagnosis；当前无场景路由，因此以入口讲链接 + 文案占位呈现。
- 无错题/收藏时仍会基于能力域、角色路径、最近访问或首个知识点 fallback。

### 2. 判断偏差

新增 `getProfileJudgmentBiases`，从错题、能力域估算、诊断样本、收藏和最近访问推导最多 3 条偏差提示：

- Cost-first bias
- Quality / SLA boundary bias
- Governance / permission-afterthought bias
- Evaluation / observability gap bias
- Agent-boundary optimism bias
- Context-solves-everything bias
- Model-mechanism black-box bias

每条偏差包含证据、严重度、建议动作，并在可定位时链接到下一讲。

### 3. Profile UI

- 在“下一步行动”后新增“本周建议”。
- 在能力域概览前新增“判断偏差”。
- 样式沿用现有无卡片嵌套、顶部细线、mono 元信息的 Profile 风格。
- 移动端将建议列表与偏差行降为单列，避免长标题和行动链接挤压溢出。

## 验证

- `cmd /c npm run lint`：PASS
- `cmd /c npm run typecheck`：BLOCKED by out-of-scope concurrent `src/store/progressStore.ts` / `src/types/index.ts` mismatch. Current errors are `reviewConceptIds` referenced in `progressStore.ts` but absent from `UserProgress` / `ProgressState` types.

## 遗留风险

- 场景演练目前没有正式路由，本次仅提供具体场景文案与入口讲链接；真正进入场景页需后续 DEV/route 工作接入。
- 本次未做浏览器视觉抽查，移动端防溢出通过 CSS 单列、`min-width: 0` 和自适应网格约束实现。
- 判断偏差与本周建议的内部文案采用英文 ASCII，以规避当前 Windows/PowerShell 编码写入风险；Profile 模块标题仍保持中文。