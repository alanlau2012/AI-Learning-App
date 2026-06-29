## 元信息
- **本地 ID**：GUIDE-P1-01
- **优先级**：P1
- **角度**：内容·决策手册
- **来源报告**：reports/issue-tickets-content-guides-20260628.md §3
- **GitHub**：#54
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

multi-agent 决策手册 executiveExplanation / decisionPoints 混入 git status、reviewed/、src/data 等 Cursor 内容流水线用语，与企业 Agent 编排语境严重错位。

## 2. 影响与风险

误导企业读者；破坏 M4 multi-agent 讲题可信度。

## 3. 复现步骤

1. 访问 `/concepts/multi-agent`
2. 滚动至决策手册区
3. 阅读是否出现 git/reviewed/src 仓库用语

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 语境（决策手册） | orchestrator/worker/trace | git/reviewed/src 流水线 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![multi-agent 决策手册仓库用语](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-054-multi-agent-guide-repo-terms.png)


### 5.2 代码 / 内容证据

- `guideId: multi-agent`
  > decisionGuides.ts 仓库协作用语

## 6. 根因定位

内容 Agent 流水线用语渗入成品

## 7. 最小修复方向

整段替换为企业 multi-agent 编排、trace、冲突仲裁语境

## 8. 验收标准

- [ ] 无 git/reviewed/src 用语
- [ ] 与讲题定义一致

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**：需读 decisionGuides.ts multi-agent 条目。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
