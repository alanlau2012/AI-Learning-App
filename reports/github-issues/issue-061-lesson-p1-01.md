## 元信息
- **本地 ID**：LESSON-P1-01
- **优先级**：P1
- **角度**：内容·56讲
- **来源报告**：reports/issue-tickets-content-lessons-20260628.md §3
- **GitHub**：#61
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

agents-md 讲 definition 被 fitDefinition 截断，以「…在业务 Agent 平台中也。」残句结尾。

## 2. 影响与风险

定义不可读；违背 v2 正文质量。

## 3. 复现步骤

1. 访问 `/concepts/agents-md`
2. 阅读定义段末句

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 定义（完整性） | 完整句子 | 残句截断 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![agents-md 定义截断](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-061-agents-md-definition-truncated.png)


### 5.2 代码 / 内容证据

- `conceptId: agents-md`
  > fitDefinition 截断

## 6. 根因定位

fitDefinition 裁剪未豁免

## 7. 最小修复方向

豁免 fitDefinition 或重写定义

## 8. 验收标准

- [ ] 定义以完整句结尾
- [ ] validate:terminology PASS

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
