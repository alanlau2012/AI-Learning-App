## 元信息
- **本地 ID**：ES-01
- **优先级**：P1
- **角度**：UI 交互
- **来源报告**：reports/issue-tickets-uiux-interaction-20260628.md §3
- **GitHub**：#45
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

ScenariosPage 能力域/难度筛选组合至零结果时，页面渲染空 grid，无「无匹配场景」提示或清除筛选按钮。

## 2. 影响与风险

用户误以为页面故障或内容缺失；对比 ModulePage/SearchPage 有空态。

## 3. 复现步骤

1. 访问 `/scenarios`
2. 点击筛选 chip 直至 visibleScenarios 为空
3. 观察主区域是否仅有空白

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 空态（零结果） | 提示 + 清除筛选 | 空 grid 无文案 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![场景筛选零结果无空态](https://github.com/alanlau2012/AI-Learning-App/blob/main/output/qa/issues-20260628/issue-045-scenarios-filter-empty.png)


### 5.2 代码 / 内容证据

- `ScenariosPage.tsx:78-108`
  > visibleScenarios 为空时无 empty state
- `ModulePage.tsx:190-191 / SearchPage.tsx:110-122`
  > 有空态参照

## 6. 根因定位

product-spec 列表页空态一致性

## 7. 最小修复方向

增加「无匹配场景」+「清除筛选」按钮

## 8. 验收标准

- [ ] 零结果显示空态
- [ ] 清除后恢复列表

## 9. 关联 issue

- 同源 / 相关：#9

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**：需浏览器筛选至零结果复核。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
