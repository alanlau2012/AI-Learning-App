## 元信息
- **本地 ID**：CONTENT-P2-02
- **优先级**：P2
- **角度**：内容·诊断题
- **来源报告**：reports/issue-tickets-content-diag-20260628.md §3
- **GitHub**：#31
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

ai-native-org 正确选项偏理念性，工程动作距离较远。

## 2. 影响与风险

troubleshootingPath 可补 RACI/操作手册。

## 3. 复现步骤

1. 访问 `/concepts/ai-native-org`

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| D（表达） | 含 RACI/手册 | 理念性分工描述 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![ai-native-org 诊断题](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-031-ai-native-org-options.png)


### 5.2 代码 / 内容证据

- `conceptId: ai-native-org`
  > options.d 理念性

## 6. 根因定位

内容 polish

## 7. 最小修复方向

troubleshootingPath 补 RACI / Agent 操作手册

## 8. 验收标准

- [ ] 路径含具象落地动作

## 9. 关联 issue

- 同源 / 相关：#14

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
