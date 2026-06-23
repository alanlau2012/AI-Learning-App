# 专家级动画验证报告 · animation-expert-verification

> 对应重构：[animation-expert-fix-report.md](animation-expert-fix-report.md)。基线 `main` @ `900ffb5` + 本轮动画重构。
> 验证目标：确认重构后 (1) 四条工程门禁全绿；(2) 每讲动画数据 key 被画布真实消费；(3) 无 raw key 泄漏；(4) reduced-motion 可读；(5) 不破坏页面与 schema。

---

## 1. 工程门禁结果（硬验收）

全部在 `D:\AI项目\AI-Learning-App` 实跑：

| 命令 | 结果 | 关键输出 |
|---|---|---|
| `npm run validate:content` | ✅ PASS | `[published-content] 已校验 demo/mvp 内容 12 个`；`[animation] 已校验动画一致性、注册类型与步骤合法性`；结构 56 / 模块计数 10/10/8/16/6/6 全绿 |
| `npm run typecheck` | ✅ PASS | `tsc -b` 无输出（0 错误），含 `noUnusedLocals/Parameters`、`verbatimModuleSyntax`、`strict` |
| `npm run lint` | ✅ PASS | `eslint .` 无输出（0 错误/0 警告） |
| `npm run build` | ✅ PASS | `102 modules transformed`，`built in ~0.8s`，CSS 56.33KB / JS 441.92KB（gzip 140KB） |

> 上述命令在加入 attention 修正后再次复跑，仍全绿。

---

## 2. 动画 key-wiring 交叉校验（机制级，自动）

因环境无法启动浏览器（见 §4），用脚本直接加载 `src/data/demoConcepts.ts`（仅含 type-only import，可被 Node 直接执行），对每讲动画的全部 `highlightTargets` 与其画布实际读取的 key 集合做交叉比对。这正是审计中 KVCache「画了开关没接线」那类 bug 的探针。

结果（重构后）：

```
token                  token-flow       ok (10 keys all consumed)
attention              attention-map    ok (9 keys all consumed)
prefill                prefill-decode   ok (11 keys all consumed)
decode                 prefill-decode   ok (9 keys all consumed)
ttft                   prefill-decode   ok (10 keys all consumed)
kv-cache               kv-cache         ok (10 keys all consumed)   ← 原 bug 已修
model-gateway          model-router     ok (11 keys all consumed)
multi-model-routing    model-router     ok (9 keys all consumed)
context-window         context-window   ok (9 keys all consumed)
agent-loop             agent-loop       ok (13 keys all consumed)
skill                  skill-lifecycle  ok (14 keys all consumed)   ← 新增，从无到有
issue-fix-agent        issue-fix-flow   ok (13 keys all consumed)

PASS: every animation data key is consumed by its canvas.
```

> 首跑曾报 `attention` 的 `tokens/context` 为 dead key（步骤 1 无元素响应）→ 已在 `AttentionAnimation` 增加 `contextOn` 让步骤 1 点亮 Token 行，复跑通过。校验脚本为临时文件，验证后已删除（不入库）。

---

## 3. raw key 泄漏检查（红线）

- 跨 `src/components/animation/` 检索 `config.type` / `{step.highlightTargets` / 将 key 渲染为文本的模式：仅 `AnimationPlayer.tsx` 出现 `config.type`，用于 ① registry 查表 ② DEV `console.warn`，**均不上屏**。
- 7 个新/改画布的可见文字逐一核对：全部为固定中文短标签（如「Prefill」「首字前/首字后」「命中/未命中」「观察」「问题单」「Skill = SOP + 工具包」「上限」等），**无任何 raw key / `config.type` / `highlightTargets` 文本**。
- 结论：**无 raw key 泄漏**，保持封板前的红线。

---

## 4. 浏览器可视化走查（受限说明）

- 计划用 Playwright（插件已就绪）走查：首页 / 模块页 / 搜索页 / 12 讲详情页 / 所有动画区块逐步 / reduced-motion / 完成 / 收藏 / 我的学习。
- 实际：MCP Playwright 绑定 `chrome` channel，本机无 chrome.exe；`npx playwright install chrome` 下载失败（远端返回 **502**）。环境无法完成浏览器渲染验证。
- 替代手段：①§1 构建门禁（含 `tsc` 全量类型 + vite 真实打包 102 模块，能捕获 JSX/CSS-module/import 错误）；②§2 机制级 key-wiring；③§3 泄漏检查；④逐组件源码与 CSS 走查（见 §5）。
- 仍需 Owner 在浏览器补一次像素级走查（详见 fix-report §9 风险 1）。

---

## 5. 组件级设计自检（逐画布）

每个画布对照「专家级动画额外标准」（展示机制/因果/权衡/失败/指标）自检：

| 画布 | ≥3 步 | 状态变化 | 指标/瓶颈 | 失败路径 | reduced-motion 静态 |
|---|---|---|---|---|---|
| TokenFlow | 5 | 文本→token→编号/向量→prefill→decode 渐进 | Prefill 占用条 / TTFT / 成本条 | 颗粒度不均（≠字数误解） | `.reduced` 关过渡，阶段静态可读 |
| Attention | 5 | 线宽=权重，污染/清洗切换 | 权重分布条 | 污染带偏权重（步4） | 线宽/颜色静态编码 |
| ModelRouting·网关 | 5 | 入口→治理→路由→证据→兜底 | 计量/Trace 证据格 | 拦截 + 熔断降级 | lane 着色静态 |
| ModelRouting·路由 | 5 | 约束→画像→选中→升级→回流 | 能力/成本/时延条 | 失败升级/SLA 补位 | 卡片状态静态 |
| ContextWindow | 5 | 候选→塞满→筛选→压缩→指标 | 成本/TTFT/质量条 | 塞满时约束被挤出 | 在窗/出窗位置+颜色静态 |
| KVCache | 5 | 会话→Prefill/写入→双路径→显存 | 命中/未命中 TTFT 对照 + 显存条 | 未命中重算 + 显存淘汰 | 双路径同屏静态对照 |
| SkillLifecycle | 6 | 发现→加载→执行→反馈→沉淀→治理 | 版本递增 + 资产沉淀 | 普通 Prompt 反例对照 | Skill 卡多行静态 |
| IssueFixFlow | 6 | 问题单→定位→补丁→验证→PR→回流 | scope 边界 + 回流闭环 | **验证失败回流**（核心） | 节点+回流箭头静态 |

- 全部画布根节点接 `reducedMotion` → `.reduced * { transition:none; animation:none }`；`AnimationPlayer` 在 reduced-motion 下已关闭自动播放，保留手动上一步/下一步。
- 移动端：各画布 `max-width` 居中、关键栅格在 `≤600px` 降为单列（KVCache 双路径、ContextWindow 三栏、ModelRouting lane、Skill 底部治理带均有断点处理）。

---

## 6. 页面/路由影响面确认（静态）

- 仅 `ConceptPage` 通过 `<AnimationPlayer config={concept.animation}/>` 消费动画；本轮**未改** `AnimationPlayer` / `ConceptPage` / 路由 / 任何页面组件，故首页 / 模块页 / 搜索页 / 我的学习 / 收藏 / 完成 等路径逻辑不受影响（构建全绿佐证无破坏性 import/类型变更）。
- `validate:structure` 复跑确认 56 登记、模块计数、关联无悬空、诊断题结构未受 skill 数据改动影响。

---

## 7. 验证结论

- 工程四门禁：**全绿**。
- 机制接线：**12/12 讲 0 dead key**；KVCache 原 bug 已修；skill 动画从无到有。
- 红线：**无 raw key 泄漏**，未改协议/schema/页面结构。
- 唯一缺口：**浏览器像素级走查未执行**（环境限制），建议 Owner 补一次后再开 44 讲扩展。
