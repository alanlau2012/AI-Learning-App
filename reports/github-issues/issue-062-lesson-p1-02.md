## 元信息
- **本地 ID**：LESSON-P1-02
- **优先级**：P1
- **角度**：内容·56讲
- **来源报告**：reports/issue-tickets-content-lessons-20260628.md §3
- **GitHub**：#62
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

positional-encoding pitfalls 第 4 条由 ensureFour 填充，与第 3 条实质相同并带「（续）」。

## 2. 影响与风险

pitfalls 信息重复，降低内容质量。

## 3. 复现步骤

1. 访问 `/concepts/positional-encoding`
2. 阅读 pitfalls 第 3/4 条

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| pitfalls（第4条） | 独立要点 | 与第3条重复 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![positional-encoding pitfalls 重复](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-062-positional-encoding-pitfalls.png)


### 5.2 代码 / 内容证据

- `conceptId: positional-encoding`
  > ensureFour 填充

## 6. 根因定位

ensureFour 占位逻辑

## 7. 最小修复方向

补独立第 4 条或豁免 ensureFour

## 8. 验收标准

- [ ] 4 条 pitfalls 语义独立

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
