## 元信息
- **本地 ID**：CONTENT-P1-04
- **优先级**：P1
- **角度**：内容·诊断题
- **来源报告**：reports/issue-tickets-content-diag-20260628.md §3
- **GitHub**：#18
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

permission-governance 题 A 33 字且为最长；B/C/D ≤16 字且为单一荒谬动作。

## 2. 影响与风险

双重泄漏（长度 + 干扰项质量）；属 12 讲 SYS 子集最严重之一。

## 3. 复现步骤

1. 访问 `/concepts/permission-governance`
2. 比较选项 A 长度与其余选项

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| permission（A 选项） | ≤24 字且干扰项可信 | A 33 字，B/C/D 荒谬 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![permission-governance 诊断题](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-018-permission-governance-options.png)


### 5.2 代码 / 内容证据

- `conceptId: permission-governance`
  > A 33字；B 改防注入规则等可信过渡

## 6. 根因定位

同 CONTENT-P1-SYS。

## 7. 最小修复方向

拆 A 或重写 B 为「防注入规则 + 审批流」等可信干扰项。

## 8. 验收标准

- [ ] 字数差 ≤4
- [ ] ≥2 可信干扰项

## 9. 关联 issue

- 同源 / 相关：#14

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
