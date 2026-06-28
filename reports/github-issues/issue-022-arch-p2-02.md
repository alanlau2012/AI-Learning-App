## 元信息
- **本地 ID**：ARCH-P2-02
- **优先级**：P2
- **角度**：架构
- **来源报告**：reports/issue-tickets-architecture-20260628.md §4.4
- **GitHub**：#22
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

ProfilePage 告警色硬编码（同 UI-P1-03）。

## 2. 影响与风险

架构视角 P2 登记。

## 3. 复现步骤

1. 同 #12

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 告警（token） | var | #fff5e8/#9a520f |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![同 #12](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-012-profile-danger-color.png)


### 5.2 代码 / 内容证据

- `ProfilePage.module.css:367-368`
  > 同 #12

## 6. 根因定位

AGENTS.md §5.3

## 7. 最小修复方向

同 #10

## 8. 验收标准

- [ ] 同 #12

## 9. 关联 issue

- 同源 / 相关：#10、#12

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
