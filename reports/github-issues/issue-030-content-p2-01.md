## 元信息
- **本地 ID**：CONTENT-P2-01
- **优先级**：P2
- **角度**：内容·诊断题
- **来源报告**：reports/issue-tickets-content-diag-20260628.md §3
- **GitHub**：#30
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

token-roi 选项 C 偏口号化，缺可执行步骤。

## 2. 影响与风险

诊断深度略弱；troubleshootingPath 已部分补偿。

## 3. 复现步骤

1. 访问 `/concepts/token-roi`
2. 阅读选项 C

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| C（表达） | 含具体动作 | 偏方向口号 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![token-roi 诊断题](https://github.com/alanlau2012/AI-Learning-App/blob/main/output/qa/issues-20260628/issue-030-token-roi-options.png)


### 5.2 代码 / 内容证据

- `conceptId: token-roi`
  > C 16字口号化

## 6. 根因定位

选项文案 polish

## 7. 最小修复方向

补「按场景拆 Token 成本→对齐价值」等具体动作

## 8. 验收标准

- [ ] 选项含可执行动词短语

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
