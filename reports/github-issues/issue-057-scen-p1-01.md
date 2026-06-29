## 元信息
- **本地 ID**：SCEN-P1-01
- **优先级**：P1
- **角度**：内容·场景
- **来源报告**：reports/issue-tickets-content-scenarios-20260628.md §3
- **GitHub**：#57
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

rag-answer-quality 场景 narrative/background/facts 写命中率 11%/74%，baseline 写 9.5%/78%，同一故障态两套数字并存。

## 2. 影响与风险

用户无法判断以哪组指标为准；削弱场景演练可信度。

## 3. 复现步骤

1. 访问 `/scenarios/rag-answer-quality`
2. 对比页面 baseline 与 facts/background 中的百分比

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 命中率（数字） | 单一故障态快照 | 11%/74% vs 9.5%/78% |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![rag 场景指标不一致](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-057-rag-metrics-mismatch.png)


### 5.2 代码 / 内容证据

- `scenarioId: rag-answer-quality`
  > baseline vs facts 数字分叉

## 6. 根因定位

场景内容编辑未统一指标时间线

## 7. 最小修复方向

统一为同一快照或在 narrative 补时间线说明

## 8. 验收标准

- [ ] 页面仅一套一致指标或有时线解释

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**：需读 scenarioExercises 原文。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
