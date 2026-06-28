## 元信息
- **本地 ID**：IF-03
- **优先级**：P2
- **角度**：UI 交互
- **来源报告**：reports/issue-tickets-uiux-interaction-20260628.md §3
- **GitHub**：#48
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

SearchPage Esc 仅清空 query，未 navigate(-1) 或回首页，与 product-spec 不一致。

## 2. 影响与风险

键盘用户无法 Esc 退出搜索页。

## 3. 复现步骤

1. 进入 `/search`，按 Esc
2. 观察是否仍在搜索页

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| Esc（行为） | 关闭搜索/返回 | 仅清空 query |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `SearchPage.tsx:76-86`
  > Esc 仅清空

## 6. 根因定位

product-spec 搜索 Esc 行为

## 7. 最小修复方向

Esc 时 navigate(-1) 或回首页

## 8. 验收标准

- [ ] Esc 退出搜索上下文

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
