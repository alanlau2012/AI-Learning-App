## 元信息
- **本地 ID**：CONTENT-P1-SYS
- **优先级**：P1
- **角度**：内容·诊断题
- **来源报告**：reports/issue-tickets-content-diag-20260628.md §2.2、§3
- **GitHub**：#14
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

约 12/55 道单选题（≈22%）正确答案为最长选项，用户可通过「最长即正确」猜答案，无需工程推理。

## 2. 影响与风险

诊断题评估有效性严重削弱；违背产品「能判断方案」定位。

## 3. 复现步骤

1. 访问 `/concepts/value-review-agent`
2. 滚动至诊断题，比较四个选项字数
3. 选项 C 为 35 字，其余 ≤17 字

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 结构（选项长度） | 四选项字数差 ≤4 | 正确选项常最长且差 ≥6 字 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![value-review-agent 最长选项泄漏](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-014-value-review-agent-options.png)


### 5.2 代码 / 内容证据

- `src/data/demoConcepts.ts`
  > value-review-agent options.c 35字；涉及 12 讲：context-window, reasoning-limit, repo-context, multi-agent, code-review-agent, requirement-decomposition-agent, test-generation-agent, ops-diagnosis-agent, value-review-agent, eval, permission-governance, ai-native-org

## 6. 根因定位

内容出题未做选项长度配平；content-schema 诊断题结构校验未覆盖长度均衡。

## 7. 最小修复方向

12 讲逐题缩短正确答案或升级干扰项，目标四选项字数差 ≤4。

## 8. 验收标准

- [ ] 12 讲逐题人工抽检无「最长即正确」
- [ ] 可选：validate 脚本增加长度差规则

## 9. 关联 issue

- 同源 / 相关：#15、#16、#17、#18

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**：demoConcepts 选项长度未配平。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
