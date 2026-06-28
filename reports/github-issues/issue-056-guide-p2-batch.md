## 元信息
- **本地 ID**：GUIDE-P2-BATCH
- **优先级**：P2
- **角度**：内容·决策手册
- **来源报告**：reports/issue-tickets-content-guides-20260628.md §3 P2
- **GitHub**：#56
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

决策手册 P2 polish 批次原正文不可执行。

## 2. 影响与风险

内容质量 polish。

## 3. 复现步骤

1. 逐项见 §5 checklist

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 批次（条目） | 4+ 子项 | 一句话 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `content-guides §3 P2`
  > context-window/kv-cache 等

### 5.3 批次子项 checklist

- [ ] **context-window**
  - 复现：读 decisionPoints 证据来源
  - 证据：guideId context-window
  - 修复：Attention 分析补证据来源句

- [ ] **kv-cache**
  - 复现：读 30% 阈值
  - 证据：guideId kv-cache
  - 修复：阈值加适用条件

- [ ] **capability-routing**
  - 复现：未知任务默认策略
  - 证据：guideId capability-routing
  - 修复：补 fallback 策略句

- [ ] **eval**
  - 复现：tradeoff 维度
  - 证据：guideId eval
  - 修复：评审题扩 tradeoff 维度

## 6. 根因定位

批量 issue

## 7. 最小修复方向

按子项修订 decisionGuides.ts

## 8. 验收标准

- [ ] 各 guideId 子项验收

## 9. 关联 issue

- 同源 / 相关：#54、#55

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
