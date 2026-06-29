## 元信息
- **本地 ID**：CONTENT-P1-02
- **优先级**：P1
- **角度**：内容·诊断题
- **来源报告**：reports/issue-tickets-content-diag-20260628.md §3
- **GitHub**：#16
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

maas 诊断题 B/D/C 干扰项明显错误（最大模型、扩 GPU、业务自填日志）。

## 2. 影响与风险

同上，评估有效性不足。

## 3. 复现步骤

1. 访问 `/concepts/maas`
2. 阅读诊断题选项

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 干扰项（质量） | 强干扰项 | 多数荒谬 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![maas 诊断题](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-016-maas-options.png)


### 5.2 代码 / 内容证据

- `conceptId: maas`
  > C 应改为 SDK 统一埋点类强干扰项

## 6. 根因定位

干扰项未对齐 MaaS 平台治理语境。

## 7. 最小修复方向

C 改为「先建 SDK 统一埋点并冻结新增直连」等可信选项。

## 8. 验收标准

- [ ] ≥2 个可信干扰项

## 9. 关联 issue

- 同源 / 相关：#14

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
