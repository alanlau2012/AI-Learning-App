# GitHub Issue 移交接手模板（v2）

> 权威格式：审计 GitHub Issues #8–#66 正文升级（2026-06-28）  
> 正文草稿目录：`reports/github-issues/`  
> 批量更新脚本：`scripts/update-audit-github-issues.mjs`

---

## 适用场景

- 审计/QA 产出的问题单需要**可独立接手修复**，而非仅「位置 / 现象 / 修复」三行摘要
- UI/UX 类必须附**真实浏览器截图**（dev server + 指定视口）
- 架构/内容类必须附**代码或原文证据**（文件:行号、conceptId/guideId/scenarioId）
- **不新建 issue、不关闭编号**：原地 `gh issue edit` 保留 #N

---

## 标准正文结构（10 节）

每条 GitHub issue 正文必须包含以下章节（Markdown 二级标题）：

```markdown
## 元信息
- **本地 ID**：ARCH-P1-01
- **优先级**：P1
- **角度**：架构
- **来源报告**：reports/issue-tickets-architecture-20260628.md §4.5
- **GitHub**：#9
- **审计基线 commit**：9a11d694（2026-06-28）

## 1. 现象描述
（用户/读者在 UI 或内容上看到的具体现象，1–3 段）

## 2. 影响与风险
（误导什么判断、是否阻断发布/移动端/无障碍/内容可信度）

## 3. 复现步骤
1. 启动：`scripts\start-local.cmd web`
2. 视口：1440×900 / 390×844（按需）
3. 路由与操作：…
4. 观察点：…

## 4. 期望行为 vs 实际行为
| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| … | … | … |

## 5. 证据
### 5.1 截图（UI/UX 类必填）
![描述](https://github.com/alanlau2012/AI-Learning-App/blob/main/output/qa/issues-20260628/issue-NNN-slug.png)

### 5.2 代码 / 内容证据（架构/内容类必填）
- 文件:行号 + 片段或 Grep 结果
- 原文引用（conceptId / guideId / scenarioId + 字段）

## 6. 根因定位
- 违反约定：AGENTS.md §x / design.md §x
- 根因文件：…

## 7. 最小修复方向
（可执行、不泛泛）

## 8. 验收标准
- [ ] 复现步骤不再出现该现象
- [ ] 截图对比 / validate 命令 / 人工抽检项

## 9. 关联 issue
- 同源：#xx

## 10. 当前代码复核（2026-06-28 执行时填写）
- 仍复现 / 已修复 / 部分修复 + 说明
```

---

## 批次类 issue 规则

适用于 #53、#56、#59、#64、#65 等「polish 批次」：

- **不拆 GitHub 编号**
- 在 **§5** 使用子项 checklist，每条子问题含：
  - 本地 ID（如 IF-04）
  - mini 复现（1–2 步）
  - 证据链接（截图或文件:行号）
  - 最小修复（1 行）

---

## 截图规范

| 项 | 要求 |
|---|---|
| 目录 | `output/qa/issues-20260628/` |
| 命名 | `issue-{三位编号}-{slug}.png`（如 `issue-044-mobile-bottomnav-layout.png`） |
| 视口 | 移动端 390×844；桌面 1440×900 |
| 正文链接 | 仓库 `main` 分支 blob URL（截图须纳入 git 跟踪） |
| 启动 | `scripts\start-local.cmd web` → http://127.0.0.1:5173/ |

---

## 索引与脚本

| 产物 | 路径 |
|---|---|
| #8–#66 映射表 | `reports/issue-tickets-github-index.md` |
| 正文草稿（59 份） | `reports/github-issues/issue-NNN-*.md` |
| 生成脚本 | `scripts/generate-github-issue-bodies.mjs` |
| 批量 edit | `scripts/update-audit-github-issues.mjs` |
| 合理性复核 | `reports/issue-tickets-rationality-review-20260628.md` |

---

## 不做的事

- 不修复业务代码（除非另开开发任务）
- 不 close / reopen issue 状态（仅改 title/body）
- 不新建 duplicate issue
