## 元信息
- **本地 ID**：CONTENT-P2-03
- **优先级**：P2
- **角度**：内容·诊断题
- **来源报告**：reports/issue-tickets-content-diag-20260628.md §3
- **GitHub**：#32
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

ttft 为唯一多选题，UI/题干未显式标注「多选」，用户易漏选。

## 2. 影响与风险

UX 与评估公平性；见 #19。

## 3. 复现步骤

1. 访问 `/concepts/ttft`
2. 观察题干与 UI 是否标注多选

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| UI（标注） | 显式「多选」 | 无标注 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![ttft 缺多选标注](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-032-ttft-multiselect-label.png)


### 5.2 代码 / 内容证据

- `conceptId: ttft`
  > type:multiple 唯一

## 6. 根因定位

DiagnosticQuestion UI 未读 type

## 7. 最小修复方向

题干或 UI 显式标注多选

## 8. 验收标准

- [ ] 用户可见多选提示

## 9. 关联 issue

- 同源 / 相关：#19

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
