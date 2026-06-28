## 元信息
- **本地 ID**：CONTENT-P1-05
- **优先级**：P1
- **角度**：内容·诊断题
- **来源报告**：reports/issue-tickets-content-diag-20260628.md §3
- **GitHub**：#19
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

ttft 多选题干三个数据点与 A/B/C 一一对应，D 明显错误，缺少需排除的迷惑项。

## 2. 影响与风险

多选题退化为「勾选对应项」，无工程推理环节。

## 3. 复现步骤

1. 访问 `/concepts/ttft`
2. 阅读题干与 A/B/C/D
3. 注意题型为多选

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| ttft（映射） | 含应排除迷惑项 | 题干数据直接映射 ABC |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![ttft 多选诊断题](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-019-ttft-multiple.png)


### 5.2 代码 / 内容证据

- `conceptId: ttft`
  > q-ttft-1 正确 A+B+C

## 6. 根因定位

多选题设计未加入「看似相关但应排除」项。

## 7. 最小修复方向

增加如「提升 GPU 利用率」等迷惑项（对应排队但非 TTFT 根因）。

## 8. 验收标准

- [ ] 至少 1 个强迷惑项
- [ ] UI 标注多选（见 #32）

## 9. 关联 issue

- 同源 / 相关：#32

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
