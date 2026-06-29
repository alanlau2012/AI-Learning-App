# AI-Learning-App 内容审核问题单 - 56讲正文+glossary（20260628）

> 审核范围：`src/data/concepts.ts`（56 讲合并后 `definition` + `pitfalls`；深读含 `mechanism` / `enterpriseCase`）+ `src/data/glossary.ts`（15 条全审）  
> 审核身份：AI 全栈专家 + 内容事实审核 Agent（只审核，不改文件）  
> 审核时间：2026-06-28  
> 不审范围：`diagnosticQuestion`（见 `reports/issue-tickets-content-diag-20260628.md`）

---

## 1. 结论先行

| 维度 | 结果 |
|---|---|
| **总体结论** | **有条件通过**。深读未发现 P0 级基础事实错误；推理链路（Prefill/Decode/KV Cache/TTFT/TPOT）、平台治理（网关/MaaS/缓存/权限）、Agent 与可观测性表述与企业实践基本一致。主要风险来自 **v2 正文改版流水线副作用**（定义截断、模板句、pitfalls 填充重复）及 **Glossary 与 ConceptPage 双源定义漂移**。 |
| **深读 / 快扫 / Glossary** | **深读 16 讲** / **快扫 56 讲（definition + pitfalls）** / **Glossary 15 条全审** |
| **P0 / P1 / P2 / P3** | **P0 = 0，P1 = 3，P2 = 11，P3 = 8** |
| **relatedConceptIds 悬空** | `npm run validate:structure` 通过，**0 悬空** |
| **最大风险（一句话）** | **`agents-md` 定义被 `fitDefinition` 截成残句**，读者在 M4 规范讲次会看到不完整定义；叠加 **Glossary 与正文 15/15 条均有表述漂移**，Search/Glossary 与 ConceptPage 可能给出不一致口径。 |

---

## 2. P0 / P1 清单

| 级别 | ID | 字段 | 问题类型 | 原文片段 / 现象 | 风险 | 建议 |
|---|---|---|---|---|---|---|
| **P1** | `agents-md` | `definition` | **v2 截断缺陷** | 合并后定义以「…在业务 Agent 平台中也。」结尾，原稿为「…也可以是同类运行规程。」 | 定义句不完整，损害 M4 规范讲可信度 | 为 `agents-md` 豁免 `fitDefinition` 字数裁剪，或缩短前半句保留完整后半句 |
| **P1** | `positional-encoding` | `pitfalls[3]` | **ensureFour 重复填充** | 第 3、4 条实质相同，第 4 条带「**（续）**」 | 用户可见重复条目，削弱 pitfalls 可信度 | 在源稿补第 4 条独立 pitfall（如 RoPE/长上下文外推），或对该讲豁免 `ensureFour` |
| **P1** | `glossary`（3 条） | 术语 ID 与 56 讲 | **IA 不对齐** | `embedding`、`rag`、`model-routing` 无同名 `KnowledgePoint.id` | Glossary 有独立术语页签，但无法一键跳到同名讲；学习者以为缺课 | 在登记表/路线图标注「术语索引项」；或新增/别名映射到 `semantic-space`、`prompt-context`、`multi-model-routing` |
| P2 | 8 讲（见 §4） | `definition` | v2 模板句 | 尾部统一追加「…是企业 AI 工程决策中需要优先理解的基础概念。」 | 定义同质化、信息密度下降 | 为各讲写 ≥50 字专属定义，移除模板后缀 |
| P2 | `speculative-decoding` | `pitfalls[0]` | 误区/纠正混写 | 「认为投机解码会改变答案质量，本质上目标模型仍负责验证和接受。」 | 误区与纠正同句，bold 后更像正确事实 | 拆成纯误区句，如「误以为投机解码会改变最终答案分布」 |
| P2 | `cache-system` / `speculative-decoding` | `pitfalls` | ensureFour 丢条目 | 源稿 5 条 pitfalls，合并后各剩 4 条（如 cache 丢「灰度」、投机丢「TTFT 混淆」） | 快扫看不到完整误区集 | 源稿精确写 4 条，或扩展 ensureFour 逻辑保留语义 distinct 条目 |
| P2 | `glossary`（15/15） | `definition` | 与正文漂移 | 例：Glossary TTFT「模型返回第一个 Token」vs 正文「客户端收到第一个输出 Token」 | 双入口定义不一致 | 以 ConceptPage 为准统一 Glossary，或 Glossary 仅保留短句+链接正文 |
| P3 | `tpot` / `positional-encoding` 等 | `definition` | 大小写不一致 | 「token」vs「Token」混用 | 排版一致性问题 | 统一为「Token」 |
| P3 | `glossary`（12/15） | `relatedConceptIds` | 自引用 | 如 `token→token`、`kv-cache→kv-cache` | 相关链接重复展示同一讲 | 自引用改为更互补的关联讲 |

---

## 3. 重点深读讲（分节）

**深读清单（16 讲）**

| 模块 | 讲次 ID | 说明 |
|---|---|---|
| M1×3 | `token`, `transformer`, `autoregressive` | 基础机制抽样 |
| M2×4 | `kv-cache`, `ttft`, `tpot`, `prefill` | 含用户指定的 KV/时延链（无独立 `prefix-cache` 讲，前缀复用见 `cache-system` + `kv-cache` mechanism） |
| M3×3 | `model-gateway`, `cache-system`, `maas` | 含网关/前缀与平台缓存 |
| M4×4 | `agent-loop`, `tool-calling`, `prompt-context`, `context-window` | Agent 上下文链 |
| M5/M6×6 | `trace`, `observability`, `token-roi`, `permission-governance`, `code-review-agent`, `value-review-agent` | 含 observability-trace / ROI / safety（权限治理） |

### 3.1 M1：`token` / `transformer` / `autoregressive`

- **事实结论**：通过。Token 与 Prefill/Decode/计费的关联正确；Transformer 未过度承诺「理解」；自回归与流式感知、TTFT/Decode 分工表述准确。
- **小问题（P3）**：`autoregressive` pitfalls 中「流式只改善感知首字」表述略简，可接受。
- **企业视角**：成本治理入口清晰，适合负责人读者。

### 3.2 M2：`kv-cache` / `ttft` / `tpot` / `prefill`

- **事实结论**：通过。核心机制准确：
  - KV Cache 为注意力 K/V 中间态缓存，跨请求复用依赖会话/前缀缓存与路由（未过度承诺「天然跨实例」）。
  - TTFT 覆盖网关/RAG/工具/Prefill/网络全链路，且强调「≠ 总耗时」。
  - TPOT 聚焦首 token 之后的 Decode 间隔，与 batch/KV/带宽关联正确。
  - Prefill 与 KV 写入、首字计算量关系正确。
- **产品缺口（P3）**：用户任务书提及 `prefix-cache`，56 讲无独立 ID；前缀复用已在 `kv-cache` mechanism 与 `cache-system` 中覆盖，建议在目录/搜索加别名或 cross-link。
- **企业视角**：Session 亲和 + 扩缩容案例可信，符合 MaaS 运维经验。

### 3.3 M3：`model-gateway` / `cache-system` / `maas`

- **事实结论**：通过。网关职责（鉴权/路由/计量/审计/降级）与 MaaS 平台化定位准确；`cache-system` 区分结果/语义/RAG/KV 四层缓存，并强调版本/权限/TTL——企业级正确。
- **P2**：`cache-system`、`maas` 定义带 v2 模板后缀；`cache-system` 第 5 条 pitfall（灰度）在合并后丢失。
- **企业视角**：语义缓存误命中政策旧版案例典型，takeaway 可用。

### 3.4 M4：`agent-loop` / `tool-calling` / `prompt-context` / `context-window`

- **事实结论**：通过。Agent Loop（Observe-Plan-Act-Check-退出条件）、工具调用权限边界、上下文窗口≠记忆等表述准确。
- **P1**：`agents-md` 不在本次 16 讲深读序号内，但同属 M4——其 **definition 截断** 为 M4 最大单点缺陷（见 §2）。
- **企业视角**：高风险动作需 HITL/审批的边界与 M6 权限治理一致。

### 3.5 M5/M6：`trace` / `observability` / `token-roi` / `permission-governance` / `code-review-agent` / `value-review-agent`

- **事实结论**：通过。亮点：
  - Trace 强调结构化 span + **脱敏/最小化**（与仓库 AGENTS.md 敏感数据口径一致）。
  - Observability 补「质量维度」——纠正传统 APM 盲区，事实正确。
  - Token ROI 反对全局压缩/全局堆质量，按场景单位经济学——治理口径正确。
  - 权限治理：最小权限 + 审批 + 审计 + 爆炸半径，符合 Agent 安全实践。
  - M5 两类 Agent 均强调「辅助非替代」「采纳率/返工率」——工程闭环正确。
- **企业视角**：RAG 质量劣化三周未发现、Agent 批量删表等案例可信。

---

## 4. 快扫问题（56 讲 definition + pitfalls）

### 4.1 v2 模板定义（8 讲，P2）

以下讲次 `definition` 被 `fitDefinition` 追加统一模板尾句「…是企业 AI 工程决策中需要优先理解的基础概念。」：

`instruction-tuning`, `hallucination`, `quantization`, `maas`, `cost-routing`, `cache-system`, `context-pollution`, `skill`

**风险**：56 讲中 14% 定义收束为同一句，Search 摘要/卡片展示同质化。

### 4.2 pitfalls 流水线问题（P1/P2）

| ID | 问题 |
|---|---|
| `positional-encoding` | 第 4 条 `ensureFour` 重复（P1） |
| `speculative-decoding` | 第 1 条误区/纠正混写；源稿第 5 条「混淆 TTFT」丢失（P2） |
| `cache-system` | 源稿第 5 条「缓存策略不上线灰度…」丢失（P2） |

### 4.3 快扫其余观察（P3，无事实错误）

- **大小写**：M2/M1 部分讲次 definition 中 `token` 小写，与同模块其他讲次 `Token` 不一致。
- **模板化 whyItMatters**：部分 M3/M4 讲次 mentalModel 质量高，definition 相对短——非错误，属文风差异。
- **56/56** 均有非空 `definition` 与 4 条 `pitfalls`；**0 stub**；与 AGENTS.md 快照一致。

---

## 5. glossary（15 条全审）

| # | ID | 结论 | 主要问题 |
|---|---|---|---|
| 1 | `token` | 通过 | 与正文漂移（P2）；`relatedConceptIds` 含自引用 `token`（P3） |
| 2 | `embedding` | 通过 | **无同名讲**（概念在 `semantic-space`）（P1 IA）；定义比正文更短 |
| 3 | `kv-cache` | 通过 | 事实正确；未强调「跨实例需路由/会话」细节（正文更完整）；自引用 |
| 4 | `ttft` | 通过 | Glossary 写「模型返回」vs 正文「客户端收到」（P2）；未链 `tpot`（P3） |
| 5 | `tpot` | 通过 | 与正文轻微措辞差；自引用 |
| 6 | `maas` | 通过 | Glossary 含「可观测」正文模板讲未强调；定义漂移 |
| 7 | `model-gateway` | 通过 | Glossary 列「审计、观测」与正文「控制面」互补；漂移 |
| 8 | `model-routing` | 通过 | **无同名讲**（`multi-model-routing`）（P1 IA）；`confusedWith` 质量高 |
| 9 | `context-window` | 通过 | Glossary 未写「非长期记忆」（正文有）；漂移 |
| 10 | `rag` | 通过 | **无同名讲**（RAG 分散在 M4 上下文链）（P1 IA）；`confusedWith` 准确 |
| 11 | `agent-loop` | 通过 | 未写「退出条件/状态」细节；漂移 |
| 12 | `tool-calling` | 通过 | 链 `trace` 合理；漂移 |
| 13 | `eval` | 通过 | Glossary 偏通用 ML eval，正文强调「离线集+在线指标+上线门禁」；漂移 |
| 14 | `trace` | 通过 | Glossary 未写脱敏/最小化（正文 M6 重点）；漂移 |
| 15 | `token-roi` | 通过 | 事实正确；正文更强调「两极端」框架 |

**Glossary 总结**：15/15 术语事实层面 **0 P0**；`confusedWith` 整体质量高。主要修复方向是 **与 ConceptPage 定义对齐** 及 **三条无同名讲的 IA 标注**。

---

## 6. 产品一致性（relatedConceptIds 悬空）

- **校验结果**：`npm run validate:structure` → **通过**，56 讲 + Glossary 的 `relatedConceptIds` **无悬空**。
- **补充（非悬空但需注意）**：
  - Glossary 术语 ID 与讲 ID 不完全一一对应（见 §5 P1）。
  - 多条 Glossary `relatedConceptIds` 含 **自引用**（链接重复，非 broken link）。

---

## 7. 高风险技术点复核

| 技术点 | 深读讲次 | 复核结论 |
|---|---|---|
| KV Cache / 前缀复用 | `kv-cache`, `cache-system`, `session-affinity`（快扫） | ✅ 未声称「无亲和也能跨实例复用」 |
| TTFT vs TPOT vs 总耗时 | `ttft`, `tpot`, `prefill`, `decode` | ✅ 拆分清晰 |
| Trace / PII 最小化 | `trace`, `observability` | ✅ 与生产合规口径一致 |
| Agent 权限 / 注入 | `permission-governance`, `tool-calling` | ✅ 最小权限 + 审批 |
| 缓存错误复用 | `cache-system` | ✅ 强调版本/权限/TTL |
| 投机解码质量 | `speculative-decoding`（快扫） | ⚠️ pitfalls 文案易误读（P2），事实无误 |

---

## 8. 企业视角可读性

- **优势**：enterpriseCase 普遍含场景/问题/分析/方案/takeaway；M2/M3/M6 与负责人 KPI（TTFT、成本、SLA、审计）对齐良好。
- **短板**：8 讲 definition 模板化；Glossary 与正文双源；`agents-md` 残句影响「规范类」讲次专业感。

---

## 9. 修复优先级建议

1. **立即（P1）**：修复 `agents-md` 定义截断；修复 `positional-encoding` 重复 pitfall；标注或映射 Glossary 三条无同名讲。
2. **本轮内容 polish（P2）**：移除 8 讲模板定义尾句；统一 Glossary 15 条定义与正文；修正 `speculative-decoding` 首条 pitfall；补回被截断的第 5 条 pitfalls 或重写为 4 条 distinct。
3. **后续（P3）**：Token 大小写统一；Glossary 自引用清理；TTFT Glossary 补「客户端收到/非总耗时」；考虑 `prefix-cache` 搜索别名。

---

## 10. 审计范围与方法论

| 项 | 说明 |
|---|---|
| 数据源 | `src/data/concepts.ts`（`demoConcepts` + `applyV2Revisions` 合并结果）、`src/data/glossary.ts` |
| 快扫 | 56 讲 `definition` + `pitfalls` 全量；脚本复核模板句/重复 pitfalls/空字段 |
| 深读 | 16 讲（见 §3 表）：含 mechanism、enterpriseCase、mentalModel；**未精读**其余 40 讲 mechanism |
| 未审 | `diagnosticQuestion`、`animation`、`decisionGuide`、场景演练 |
| 门禁 | `validate:structure` 已通过（2026-06-28 审计时） |

---

**审计签名**：内容事实审核 Agent · 2026-06-28  
**返回摘要**：P0=0 / P1=3 / P2=11 / P3=8 · 深读=16 · 快扫=56 · Glossary=15 全审 · 最大风险=`agents-md` 定义截断 + Glossary/正文双源漂移
