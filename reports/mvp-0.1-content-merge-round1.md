# MVP 0.1 内容合入回合 1 报告

> 角色：主开发 Agent（阶段 4 内容合入）
> 依据：`reports/mvp-0.1-content-review-round1.md`（最终复审 PASS + §3 合入清单与注意事项）、`content/reviewed/mvp-0.1-content-fix-round1.md`（修订全文）
> 合入目标：`src/data/demoConcepts.ts`（12 讲正式 mvp 内容）

## 0. 结论

- 审核清单内的全部修订已无损合入，唯一改动文件为 `src/data/demoConcepts.ts`。
- 未改 schema、未改 `src/types/index.ts`、未改 `docs/*`、未新增 44 讲、未回退 `kv-cache` 的单一正文来源（仍只在 `demoConcepts.ts`）。
- `validate:content` / `typecheck` / `lint` / `build` 四条命令全部通过（退出码均为 0）。
- 7 题正确项位移全部抽查生效，且正确项确实指向修订后的正确选项文案。

## 1. 修改文件清单

- `src/data/demoConcepts.ts`：合入 12 题诊断题、4 个企业案例、11 个心智模型、5 讲条数调整。
- `reports/mvp-0.1-content-merge-round1.md`：本报告（新增）。

未触碰：`src/types/index.ts`、`src/data/concepts.ts`（保持阶段 1 的 stub 登记不回退）、`docs/*`、页面组件、路由、样式、AnimationPlayer、动画组件、registry。

## 2. 逐讲合入清单

### 2.1 12 题诊断题（整体替换 options / correctOptionIds / explanation / troubleshootingPath）

| 题号 | 所属讲 | 合入前正确项 | 合入后正确项 | 备注 |
|---|---|---|---|---|
| `q-token-1` | Token | b | **c** | 选项重排（输入膨胀项移到 c），解析逐项点名，path 5 条 |
| `q-attention-1` | 注意力机制 | b | **d** | 选项重排（版本过滤项移到 d），path 补“显式标记最新/作废”共 5 条 |
| `q-prefill-1` | Prefill | a | a（不变） | b 改为“扩容并预热”强干扰项，解析增强，path 补“白名单字段摘要压缩” |
| `q-decode-1` | Decode | b | **c** | 选项重排（拆分长输出项移到 c），path 补“区分长短任务调度” |
| `q-ttft-1` | TTFT | a/b/c（多选） | a/b/c（不变） | 维持多选，仅合入增强解析（d 不是最佳判断的说明） |
| `q-kv-cache-1` | KV Cache | b | **d** | 选项重排（Session 亲和项移到 d），解析点名 a/b/c |
| `q-model-gateway-1` | 模型网关 | a | a（不变） | b/c/d 文案升级为更强干扰项，解析增强，path 5 条 |
| `q-multi-model-routing-1` | 多模型路由 | b | b（不变） | a 改为“5% 灰度+投诉率兜底”强干扰项，path 5 条 |
| `q-context-window-1` | 上下文窗口 | b | **d** | 选项重排（约束保留机制项移到 d），path 补“硬约束固定到高优先级” |
| `q-agent-loop-1` | Agent Loop | b | b（不变） | d 文案增强，解析增强，path 补“记录工具调用/失败原因/继续条件” |
| `q-skill-1` | Skill | b | **c** | 选项重排（结构化能力项移到 c），path 补“为关键风险补证据要求” |
| `q-issue-fix-agent-1` | Issue Fix Agent | b | **a** | 选项重排（结构化+先复现项移到 a），解析增强 |

7 题正确项位移（B→C/D/A 等）均按审核注意事项执行，且全部连同选项文案一起替换，未出现“只改 correctOptionIds”。

### 2.2 4 个企业案例升级（enterpriseCase 整体替换）

- `model-gateway`：补充 20 个生产应用 / 8 个直连 / 约 40% 缺 trace / 2 起敏感外发事件等规模与错误路径。
- `multi-model-routing`：补充每月约 120 万次请求 / 成本两月增长超 65% / 回放 1 万条历史请求等指标与验证路径。
- `skill`：补充每周约 80 次 CI 失败 / 平均 3 轮人工提醒 / PR 退回率约 30% 等流程指标。
- `agent-loop`：补充 12 分钟连续重启 3 次 / 错误率仍 ≥18% 等生产约束与升级人工条件。

### 2.3 11 个心智模型改写（mentalModel 整体替换，开头句式各异）

`token`（不要把…当成…）、`attention`（在工程上，它更像…）、`prefill`（反过来看…）、`ttft`（衡量的不是…而是…）、`kv-cache`（从推理服务的视角…）、`model-gateway`（从平台负责人的视角…）、`multi-model-routing`（解决的不是…而是…）、`context-window`（直陈+真正的工程能力不是…）、`agent-loop`（观察它运转一轮，很像…）、`skill`（更接近…而不是…）、`issue-fix-agent`（与其说…不如说…）。

`decode` 原本未使用固定句式，按审核结论保持原样。

### 2.4 5 讲条数调整（指定数组整体替换）

| 讲 | 字段 | 合入前 | 合入后 | 调整方式 |
|---|---|---:|---:|---|
| `token` | `mechanism` | 6 | **5** | 合并“分词切分”与“映射编号/向量”为一条 |
| `ttft` | `keyTakeaways` | 5 | **4** | 合并“衡量首字返回”与“代表系统有反应” |
| `model-gateway` | `pitfalls` | 5 | **4** | 合并“薄转发只代理 URL”与“只做鉴权” |
| `kv-cache` | `keyTakeaways` | 5 | **4** | 合并“依赖缓存命中”与“Session 亲和影响复用” |
| `multi-model-routing` | `mechanism` | 6 | **7** | 拆分过粗的“先过门槛再择优再补位”为两条 |

均落在机制 4-7 / 误区 3-6 / 结论 3-5 区间，并满足 `docs/content-schema.md` §6.2 入库底线。

## 3. 四条命令结果（PowerShell，逐条执行）

### 3.1 `npm run validate:content`

```
validate:content — 子命令：all
  [published-content] 已校验 demo/mvp 内容 12 个。
  [animation] 已校验动画一致性、注册类型与步骤合法性。

通过：内容结构校验（56 登记 / 模块计数 10/10/8/16/6/6 / 唯一性 / 关联无悬空 / contentStatus / 诊断题结构）。
```
退出码 0 ✅

### 3.2 `npm run typecheck`

```
> tsc -b
```
无错误输出，退出码 0 ✅

### 3.3 `npm run lint`

```
> eslint .
```
无错误输出，退出码 0 ✅

### 3.4 `npm run build`

```
> tsc -b && vite build
vite v8.0.16 building client environment for production...
✓ 92 modules transformed.
dist/index.html                   1.05 kB │ gzip:   0.63 kB
dist/assets/index-D_Mz6x3t.css   39.54 kB │ gzip:   7.69 kB
dist/assets/index-B_JDMnUr.js   417.96 kB │ gzip: 133.76 kB
✓ built in 519ms
```
退出码 0 ✅

## 4. 抽查验证（正确项位移）

源文件 `src/data/demoConcepts.ts` 实测：

- `q-token-1` → `correctOptionIds: ["c"]`，c 文案为“附件正文、邮件线程和历史会话是否让输入 Token 膨胀”✅
- `q-attention-1` → `["d"]`，d 为“在检索与上下文编排中加入版本过滤、排序和权威来源标记”✅
- `q-decode-1` → `["c"]`，c 为“拆分长输出任务，监控并优化 TPOT、批调度和输出预算”✅
- `q-kv-cache-1` → `["d"]`，d 为“Session 亲和或缓存感知路由是否失效”✅
- `q-context-window-1` → `["d"]`，d 为“建立上下文选择与约束保留机制，把硬约束固定在高优先级上下文中”✅
- `q-skill-1` → `["c"]`，c 为“补充明确触发场景、审查步骤、风险清单、证据要求和输出格式”✅
- `q-issue-fix-agent-1` → `["a"]`，a 为“要求问题单结构化，并让 Agent 在信息不足时先澄清和复现，再最小化修改”✅
- 维持不变项：`q-prefill-1` → `["a"]`、`q-model-gateway-1` → `["a"]`、`q-multi-model-routing-1` → `["b"]`、`q-agent-loop-1` → `["b"]`、`q-ttft-1` → `["a","b","c"]`（多选）✅

合入后单选答案分布：A=3（prefill / model-gateway / issue-fix-agent）、B=2（multi-model-routing / agent-loop）、C=3（token / decode / skill）、D=3（attention / kv-cache / context-window），最高占比 27.3%，未超过 40%。

## 5. 遗留项

- 审核报告 §8 / 复审 §4 建议总控或 Owner 将诊断题质量门禁、去模板化约束、样板偏差检查同步到 `docs/project-board.md` 或正式内容生产流程。本轮无权修改 `docs/*`，未处理，留待总控。
- `prefill-decode` / `agent-loop` 画面意图（reviewed §7）属动画意图 Agent 范围，本轮未涉及。

## 6. 停止点

未触发。所有修订均能无损映射到现有 `KnowledgePoint` / `DiagnosticQuestion` / `EnterpriseCase` 字段，无需新增字段或改 schema。

## 7. 是否需要总控处理的阻塞或文件冲突

无阻塞、无文件冲突。仅有第 5 节的非阻塞流程沉淀建议交由总控/Owner 后续处理。
