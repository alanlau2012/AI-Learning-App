## 元信息
- **本地 ID**：ARCH-P1-01
- **优先级**：P1
- **角度**：架构
- **来源报告**：reports/issue-tickets-architecture-20260628.md §4.5
- **GitHub**：#9
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

审计时访问 `/scenarios` 或 `/scenarios/:id` 时，Header 面包屑为空（buildBreadcrumb fallthrough 返回 []），用户失去顶部导航锚点。

## 2. 影响与风险

破坏场景演练页面闭环；与知识点页面包屑不一致，误导「页面未加载完成」判断。

## 3. 复现步骤

1. 启动：`scripts\start-local.cmd web`
2. 视口：1440×900
3. 访问 http://127.0.0.1:5173/scenarios
4. 观察 Header 左侧面包屑文本
5. 再访问 http://127.0.0.1:5173/scenarios/rag-answer-quality

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 列表页（面包屑） | 「场景演练」 | 审计时空白 |
| 详情页（面包屑） | 「场景演练 / {标题}」 | 审计时空白 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![场景页 Header 面包屑](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-009-scenarios-breadcrumb.png)


### 5.2 代码 / 内容证据

- `src/components/layout/Header.tsx:30-35`
  > if (pathname === '/scenarios') return ['场景演练'];
const scenarioMatch = pathname.match(/^\/scenarios\/([^/]+)$/);

## 6. 根因定位

AGENTS.md §3 Header 职责；审计基线 buildBreadcrumb 未识别 /scenarios 路径。

## 7. 最小修复方向

在 buildBreadcrumb 增加 /scenarios 与 /scenarios/:id 分支，用 scenarioTitleById 查标题（与 concept 模式一致）。

## 8. 验收标准

- [ ] 列表页面包屑显示「场景演练」
- [ ] 详情页显示「场景演练 / {场景名}」
- [ ] 截图对比审计基线

## 9. 关联 issue

- 同源 / 相关：#45

## 10. 当前代码复核（2026-06-28 执行时填写）

**已修复**：当前 Header.tsx L30–35 已含 scenarios 分支；验收步骤改为确认面包屑正常显示即可 PASS。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
