## 元信息
- **本地 ID**：AUDIT-TRACKER-R1
- **优先级**：—
- **角度**：聚合跟踪
- **来源报告**：reports/issue-tickets-20260628.md
- **GitHub**：#8
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

第一轮审计（架构 + UI 视觉 + 内容诊断题）产出的问题单已批量创建 GitHub #8–#43，但正文仅 3–6 行摘要，缺少可接手修复的复现步骤、证据与验收标准。

## 2. 影响与风险

跟踪 issue 无法指向完整子报告与 v2 正文；新接手者需回读本地 reports 才能理解范围。

## 3. 复现步骤

1. 打开 https://github.com/alanlau2012/AI-Learning-App/issues/8
2. 对比 `reports/issue-tickets-20260628.md` §1–§6 与子报告

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 正文（跟踪） | 链接子报告 + Top 风险 + v2 升级状态 | 仅结论三行 + Top 3 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `scripts/create-audit-github-issues.mjs`
  > 批量创建 #8–#43

## 6. 根因定位

首轮 gh issue create 脚本仅写入摘要字段。

## 7. 最小修复方向

本 issue 正文已按 v2 模板升级；后续修复进度在子 issue 关闭时回写此处 checklist。

## 8. 验收标准

- [ ] §9 链接 docs/issue-handover-template.md 与 reports/github-issues/
- [ ] 子 issue #9–#42 正文均已 v2 升级

## 9. 关联 issue

- 同源 / 相关：#66

## 10. 当前代码复核（2026-06-28 执行时填写）

文档跟踪 issue；无代码复现项。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
