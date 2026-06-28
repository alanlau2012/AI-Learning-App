## 元信息
- **本地 ID**：CONTENT-P3-01
- **优先级**：P3
- **角度**：内容·诊断题
- **来源报告**：reports/issue-tickets-content-diag-20260628.md §3
- **GitHub**：#41
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

sampling 题 A 使用「低随机采样」非标准术语。

## 2. 影响与风险

术语一致性；低优先级。

## 3. 复现步骤

1. 访问 `/concepts/sampling`
2. 阅读选项 A

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 术语（A） | 低 temperature/top-p | 低随机采样 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![sampling 术语](https://github.com/alanlau2012/AI-Learning-App/blob/main/output/qa/issues-20260628/issue-041-sampling-terminology.png)


### 5.2 代码 / 内容证据

- `conceptId: sampling`
  > 低随机采样

## 6. 根因定位

术语 polish

## 7. 最小修复方向

改为「低 temperature/top-p 采样」

## 8. 验收标准

- [ ] 术语与 glossary 一致

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
