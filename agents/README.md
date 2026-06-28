# AI-Learning-App Agents

本目录存放面向 `D:\AI项目\AI-Learning-App` 的专用 Agent 提示词。生产化阶段建议按“内容可信 + 发布可信 + 体验可信 + 发行可信”组织，不把所有职责塞进一个 Agent。

## 当前 Agent 清单

| Agent | 阶段 | 职责 |
|---|---|---|
| `ai-fullstack-content-production-agent.md` | 内容生产 | 生产世界级 AI 全栈课程、决策手册、场景演练和诊断题草稿，只写 `content/drafts/*` |
| `ai-fullstack-content-review-agent.md` | 内容审核 | 审核课程、决策手册、场景演练、诊断题的事实性、专业性和工程可落地性 |
| `production-release-gate-agent.md` | P0 发布门禁 | 聚合校验、构建、文档状态、发布阻断项与 release readiness |
| `browser-regression-qa-agent.md` | P0 浏览器回归 | 用真实浏览器验证核心学习路径、响应式、动画、诊断题、LocalStorage |
| `security-privacy-hardening-agent.md` | P0 安全隐私 | 审核 Electron/Web 安全边界、依赖风险、外链、iframe、隐私与本地数据 |
| `ux-accessibility-qa-agent.md` | P1 体验可用性 | 审核视觉一致性、移动端、键盘可用性、基础无障碍与阅读体验 |
| `performance-budget-agent.md` | P1 性能预算 | 审核构建产物、首屏加载、资源体积、路由切包与性能预算 |
| `desktop-distribution-agent.md` | P1 桌面发行 | 审核 Windows 安装包、portable、图标、签名、自动更新与安装卸载 smoke |
| `post-release-canary-agent.md` | P2 发布后巡检 | 对线上地址或发布包做发布后关键路径、控制台错误和回滚风险巡检 |

## 使用原则

1. 内容类 Agent 不直接改 `src/data/*`，除非 Owner 明确授权并指定合入职责。
2. QA / 安全 / 性能 / 发布 Agent 默认只读代码、运行验证、写报告。
3. 每个 Agent 的报告必须写清：实际检查范围、执行命令、证据、阻断项、非阻断建议。
4. P0 Agent 的 P0/P1 阻断项未清零前，不建议对外发布生产版本。
5. 多 Agent 并行时必须避免同时修改同一文件；生产化审计优先通过 `reports/*` 交付。


