## 元信息
- **本地 ID**：CONTENT-P1-01
- **优先级**：P1
- **角度**：内容·诊断题
- **来源报告**：reports/issue-tickets-content-diag-20260628.md §3
- **GitHub**：#15
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

cost-routing 诊断题干扰项 A/C/D 均为明显荒谬动作（全量切换、只加缓存、买额度），仅 B 合理。

## 2. 影响与风险

题目难度退化为「选唯一合理项」，无法考察路由决策细节。

## 3. 复现步骤

1. 访问 `/concepts/cost-routing`
2. 阅读四个选项
3. 观察仅 B 为可信工程动作

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 干扰项（可信度） | 至少 2 个强干扰项 | 3 个明显错误 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![cost-routing 诊断题选项](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-015-cost-routing-options.png)


### 5.2 代码 / 内容证据

- `conceptId: cost-routing`
  > A/C/D 为明显荒谬干扰项

## 6. 根因定位

干扰项质量未达 v2 诊断题标准。

## 7. 最小修复方向

将至少 1 个干扰项改为可信动作（如「5% 灰度只看投诉率」）。

## 8. 验收标准

- [ ] 至少 2 个选项为可信工程动作
- [ ] 正确答案仍需工程推理

## 9. 关联 issue

- 同源 / 相关：#14

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
