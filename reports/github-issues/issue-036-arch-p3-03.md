## 元信息
- **本地 ID**：ARCH-P3-03
- **优先级**：P3
- **角度**：架构
- **来源报告**：reports/issue-tickets-architecture-20260628.md §4.3
- **GitHub**：#36
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

HomePage 调用 getContinueLearningConceptId 时手工拼装 UserProgress，scenario 字段写死 []。

## 2. 影响与风险

未来 helper 依赖 scenario 字段时会出错。

## 3. 复现步骤

1. 阅读 HomePage.tsx 36-45

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| progress（传参） | 完整 store 状态 | 手工拼 partial 对象 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `HomePage.tsx:36-45`
  > 手工拼 progress

## 6. 根因定位

派生值调用方式

## 7. 最小修复方向

传 useProgressStore.getState() 完整状态

## 8. 验收标准

- [ ] 无手工拼 partial progress

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
