## 元信息
- **本地 ID**：CONTENT-P1-03
- **优先级**：P1
- **角度**：内容·诊断题
- **来源报告**：reports/issue-tickets-content-diag-20260628.md §3
- **GitHub**：#17
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

sla 题 C 为最长且唯一结构化选项，A/B/D 明显错误，双重结构泄漏。

## 2. 影响与风险

长度 + 内容双重提示正确答案。

## 3. 复现步骤

1. 访问 `/concepts/sla`
2. 比较选项长度与内容可信度

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| sla（泄漏） | 均衡选项 | C 最长且唯一合理 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![sla 诊断题](https://github.com/alanlau2012/AI-Learning-App/blob/main/output/qa/issues-20260628/issue-017-sla-options.png)


### 5.2 代码 / 内容证据

- `conceptId: sla`
  > C 含 SLA 结构化条款且最长

## 6. 根因定位

选项未配平 + 干扰项弱。

## 7. 最小修复方向

拆 C 或加长 A/B/D 为可信 SLA 设计动作。

## 8. 验收标准

- [ ] 无最长即正确
- [ ] ≥2 可信干扰项

## 9. 关联 issue

- 同源 / 相关：#14

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
