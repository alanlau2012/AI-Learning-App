# 专家级动画重构报告 · animation-expert-fix-report

> 角色：专家级动画重构 Agent。基线 `main` @ `900ffb5`。
> 配套：审计 [animation-expert-audit.md](animation-expert-audit.md)、设计 [docs/expert-animation-design-plan.md](../docs/expert-animation-design-plan.md)、验证 [animation-expert-verification.md](animation-expert-verification.md)。
> 改动范围：`src/components/animation/*`（新增 6 画布 + 重构 1 画布 + registry）、`scripts/validate-content.ts`（校验集镜像同步）、`src/data/demoConcepts.ts` 与 `content/drafts/skill.json`（仅 skill 一讲补动画）。**未改** `AnimationConfig` 协议 / `src/types/index.ts` / `docs/content-schema.md` / `AnimationPlayer` / `ConceptPage` / 课程正文 / 44 讲结构。

---

## 1. 重构了哪些 animation type

| type | 动作 | 组件文件 |
|---|---|---|
| `token-flow` | 新建专用画布 | `TokenFlowAnimation.tsx` |
| `attention-map` | 新建专用画布 | `AttentionAnimation.tsx` |
| `model-router` | 新建专用画布（网关+路由双模式） | `ModelRoutingAnimation.tsx` |
| `context-window` | 新建专用画布 | `ContextWindowAnimation.tsx` |
| `issue-fix-flow` | 新建专用画布 | `IssueFixFlowAnimation.tsx` |
| `skill-lifecycle` | 新建专用画布 + 注册 + 补数据 | `SkillLifecycleAnimation.tsx` |
| `kv-cache` | 重构（对齐 key + 双路径） | `KVCacheAnimation.tsx`（改写） |
| `prefill-decode` | 保留（A 级样板，未改） | `PrefillDecodeAnimation.tsx` |
| `agent-loop` | 保留（A 级样板，未改） | `AgentLoopAnimation.tsx` |

共 **新增 6 个画布组件 + 重构 1 个**；`GenericMechanismAnimation` 从全部上线讲注册中退役（文件保留为未注册类型降级参考，已无讲引用）。

---

## 2. 每个 type 解决了什么机制解释问题

- **token-flow**：从「一排圆点」升级为「文本→Token(颗粒度不均)→编号/向量→Prefill占用/TTFT→输出Token/成本」的流动链。表达了 Token≠字、输入压 Prefill/TTFT、输出压 Decode/成本。
- **attention-map**：用「线宽=权重 + 因果方向只看历史」表达注意力是加权选择而非理解；并演示上下文污染带偏权重、重排清洗把权重还给证据（含权重分布条，reduced-motion 静态可读）。
- **model-router（网关）**：把网关画成「治理入口闭环」——入口汇聚→鉴权/配额/策略(含拦截)→路由→计量/Trace 证据→熔断/降级，纠正「网关=薄转发」误解。
- **model-router（路由）**：同一画布另一模式，按「质量门槛先于成本」选性价比模型、失败升级/SLA 补位、评测/观测回流，纠正「永远选最强」误解。两讲共用组件、按 key 自动切换区域。
- **context-window**：用「有限工作台 + 塞满(约束被挤出) vs 筛选/压缩(约束回窗、腾空间)」两态对比，配成本/TTFT/质量三指标，落到「Agent 失败常是上下文组织失控」。
- **issue-fix-flow**：问题单(复现/期望/约束)→定位→最小化补丁(scope边界)→验证→PR/人审→质量回流；核心信号是「**验证失败回流到定位/补丁**」而非盲目向前，以及人类 Owner 合入。
- **skill-lifecycle**：用「结构化 Skill 卡（SOP+工具包）对照普通 Prompt」+「发现→加载→执行/自检→反馈回流→沉淀(版本递增)→治理(Owner/权限/弃用)」表达 Skill 是可治理可演进的能力资产。
- **kv-cache（重构）**：修掉原画布「检测 `cache/hit/miss` 但数据是 `kv-write/cache-hit/cache-miss/route-miss`」的断线 bug；改为「命中(复用,TTFT低,绿) vs 未命中(打散到空实例,重算,TTFT高,橙)」双路径同屏对照 + 显存容量/淘汰。

---

## 3. 哪些章节受益

| 受益讲 | 模块 | 动画 |
|---|---|---|
| token | M1·1 | token-flow（专用化） |
| attention | M1·4 | attention-map（专用化） |
| kv-cache | M2·5 | kv-cache（修 bug + 升 A） |
| model-gateway | M3·2 | model-router·网关区 |
| multi-model-routing | M3·3 | model-router·路由区 |
| context-window | M4·3 | context-window（专用化） |
| skill | M4·12 | skill-lifecycle（从无到有） |
| issue-fix-agent | M5·2 | issue-fix-flow（专用化） |

12 讲中此前 7 讲处于「空/近空/缺失」、1 讲（kv-cache）有断线 bug；本轮全部转为真实机制画布。prefill/decode/ttft/agent-loop 4 讲原已是 A 级，保持不变。**12 讲动画现已全部为机制专用画布。**

---

## 4. 哪些动画仍是 fallback

- **无上线讲再走通用 fallback**。`GenericMechanismAnimation`（圆点时间轴）已从 registry 全部退役，当前不被任何 `contentStatus∈{demo,mvp}` 的讲引用。
- 保留的两层 fallback 仅为「未注册类型」安全网：① `AnimationPlayer` 内置纯文本步骤视图（标题+当前步说明+计数）；② `GenericMechanismAnimation` 文件保留备用。二者只在未来出现「数据写了某 type 但组件未注册」时触发，生产不白屏。

---

## 5. 为什么 fallback 暂时可接受

- 当前 12 讲已 0 fallback，问题不存在于已上线内容。
- 余下 44 讲为 stub（`hasAnimation:false`），不渲染动画；未来扩展若引用尚未实现的扩展类型（如 `rag-pipeline`/`pd-separation`/`observability-trace` 等枚举已定义但无组件），fallback 保证「不崩、可读、DEV 告警」，符合 animation-spec §3.2。这是受控降级，不是质量妥协。

---

## 6. 是否修改了数据配置

**是，仅 1 讲、最小改动**：

- `src/data/demoConcepts.ts` 的 `skill`：`hasAnimation:false→true` + 新增 `animation`(type=`skill-lifecycle`, 6 步)。
- `content/drafts/skill.json`：同步补 `animation`（draft↔data 一致）。
- **理由**（对照「谨慎修改 src/data」前置）：`skill` 是 12 讲核心概念，原本**完全无 highlightTargets / 无 animation**，属审计中的 Empty(P0)，是「highlightTargets 无法支撑机制表达」的极端情形（根本没有可支撑的数据）；且 `skill-lifecycle` 为任务点名的重点动画。
- **未改任何其他讲的数据**：另外 5 个新画布与 kv-cache 重构**全部只读现有 highlightTargets**，零数据改动。
- `scripts/validate-content.ts` 的 `REGISTERED_ANIMATION_TYPES` 同步加入 `skill-lifecycle`（该集合是 registry 的镜像，非 schema 变更；`skill-lifecycle` 早已在 `src/types/index.ts` 的 `AnimationType` 枚举中）。

---

## 7. 是否触发协议变更提案

**否**。未触发任何停止点：

- `skill-lifecycle` 已存在于 `AnimationType` 枚举（`src/types/index.ts:31`），只走「注册新组件」路径。
- 未改 `AnimationConfig` / `AnimationStep` 协议、未改 `docs/content-schema.md`、未改 `AnimationPlayer` 架构、未改 `ConceptPage` 结构、未改课程正文、未引入第三方动画库/远程资源/视频/3D、未触及 44 讲数据结构。
- 因此**未**生成 `reports/animation-protocol-change-proposal.md`（无需要）。

---

## 8. 运行命令结果

| 命令 | 结果 |
|---|---|
| `npm run validate:content` | ✅ 通过（结构 56/模块计数 / 已校验 demo·mvp 12 讲完整性 / 动画一致性·注册·步骤） |
| `npm run typecheck`（`tsc -b`） | ✅ 0 错误 |
| `npm run lint`（`eslint .`） | ✅ 0 错误 |
| `npm run build`（`tsc -b && vite build`） | ✅ 102 模块，built in ~0.8s |
| 动画 key-wiring 交叉校验（临时脚本，已删） | ✅ 12/12 讲全部 highlightTargets 均被对应画布消费，0 dead key |
| 原始 key 泄漏检查 | ✅ 画布仅渲染固定中文短标签；`config.type` 仅用于 registry 查表与 DEV warn，不上屏 |

> 浏览器可视化走查（Playwright）因环境无法下载 Chrome（远端 502）未能执行，已用 key-wiring 交叉校验 + 构建门禁替代，详见验证报告。

---

## 9. 剩余风险

1. **未做真机/浏览器逐帧走查**：构建与 key-wiring 通过，但像素级布局、窄屏换行、深色对比仍建议 Owner 在浏览器中过一遍（重点 attention 的 SVG 窄屏、model-router 多 lane 换行、kv-cache 双路径在 <600px 的堆叠）。
2. **model-router 双模式靠 key 集合判定**：若未来新讲用 model-router 但 highlightTargets 既不含网关键也不含路由键，会默认走路由视图。扩展时需遵循设计蓝图 §5/§6 的 key 约定。
3. **skill 数据改动**：虽最小且已说明理由，但属对封板 mvp 讲的内容面扩张，建议 Owner 在合入时确认（draft 已同步、四门禁全绿）。
4. **bundle 体积**：JS 441KB/gzip 140KB，含新增 6 画布，仍为纯 CSS/SVG，无新依赖；后续 44 讲若每类型都做专用画布需关注增量（可按复用度收敛）。

---

## 10. 是否建议进入 44 讲扩展

**建议有条件进入**：

- 动画侧已具备「可复制样板矩阵」：时间轴+标尺类（prefill-decode）、环路+出口+trace 类（agent-loop）、流水+回流类（issue-fix-flow / skill-lifecycle）、对照路径类（kv-cache）、加权关系类（attention）、有限容器类（context-window）、治理管线类（model-router）。新讲可按类型复用并以 highlightTargets 聚焦，符合冻结样板标准 §7。
- 前置：① Owner 确认 skill 数据改动；② 扩展批次的动画草稿须按 [content-production-gate.md](content-production-gate.md) §4 写明「画面意图 + key 映射」，复用现有类型优先，新类型才走「注册新组件」；③ 新类型若需改 `AnimationConfig` 协议，触发停止点上报，不直接改。
- 建议先做一次浏览器走查再开 44 讲，避免把未发现的视觉问题复制到更多讲。
