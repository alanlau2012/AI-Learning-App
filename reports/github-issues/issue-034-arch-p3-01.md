## 元信息
- **本地 ID**：ARCH-P3-01
- **优先级**：P3
- **角度**：架构
- **来源报告**：reports/issue-tickets-architecture-20260628.md §4.1
- **GitHub**：#34
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

progress.ts 与 progressCore.ts 职责边界对新读者不清晰（re-export 桥）。

## 2. 影响与风险

可维护性；不阻断运行。

## 3. 复现步骤

1. 阅读 progress.ts 与 progressCore.ts 文件头

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 分工（文档） | 文件头注释清晰 | 缺注释 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `progress.ts / progressCore.ts`
  > re-export 桥

## 6. 根因定位

AGENTS.md §3 utils 清晰性

## 7. 最小修复方向

两文件顶部注释写清分工

## 8. 验收标准

- [ ] 注释存在且准确

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**（文档项）。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
