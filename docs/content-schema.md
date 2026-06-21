# 内容数据 Schema · content-schema（权威）

> 这是数据 schema 的唯一权威来源。`src/types/index.ts` 必须与本文件一致。
> 字段命名采用 **PRD 的 TypeScript 接口**；56 讲写作模板字段仅用于写作，落库时按 §3 映射转换。

## 1. 权威 TypeScript 接口

逐字采用 PRD 第 8 节定义：

```ts
export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export interface KnowledgePoint {
  id: string;
  title: string;
  slug: string;
  moduleId: string;
  order: number;
  difficulty: Difficulty;
  estimatedMinutes: number;
  tags: string[];
  hasAnimation: boolean;
  definition: string;
  whyItMatters: string;
  mentalModel: string;
  mechanism: string[];
  animation?: AnimationConfig;
  enterpriseCase: EnterpriseCase;
  pitfalls: string[];
  diagnosticQuestion?: DiagnosticQuestion;
  keyTakeaways: string[];
  relatedConceptIds: string[];
}

export interface LearningModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  order: number;
  conceptIds: string[];
  recommendedFor: string[];
}

export interface AnimationConfig {
  type: AnimationType;
  title: string;
  steps: AnimationStep[];
}

export interface AnimationStep {
  id: string;
  title: string;
  description: string;
  highlightTargets?: string[];
  durationMs?: number;
}

export interface EnterpriseCase {
  title: string;
  scenario: string;
  problem: string;
  analysis: string;
  solution: string;
  takeaway: string;
}

export interface DiagnosticQuestion {
  id: string;
  type: 'single' | 'multiple';
  scenario: string;
  question: string;
  options: DiagnosticOption[];
  correctOptionIds: string[];
  explanation: string;
  troubleshootingPath: string[];
  relatedConceptIds: string[];
}

export interface DiagnosticOption {
  id: string;
  text: string;
}

export interface UserProgress {
  completedConceptIds: string[];
  favoriteConceptIds: string[];
  wrongQuestionIds: string[];
  lastVisitedConceptId?: string;
  lastStudyDate?: string;
  studyStreakDays: number;
}
```

`AnimationType` 的枚举值定义在 [animation-spec.md](animation-spec.md) §1，由 `types/index.ts` 统一导出。

## 2. 字段级约束

- `id`：全局唯一，英文 kebab-case（见 §4 登记表），一经发布不可改（持久化与 URL 依赖）。
- `slug`：用于 `/concepts/:slug`，首版与 `id` 保持一致。
- `moduleId`：必须是 `m1`–`m6` 之一。
- `order`：模块内顺序，从 1 递增、连续、唯一。
- `difficulty`：仅 `basic | intermediate | advanced`。
- `estimatedMinutes`：正整数（分钟）。
- `tags`：用于搜索与筛选，建议含英文术语（如 `Token`、`TTFT`、`MaaS`）。
- `hasAnimation`：与 `animation` 是否存在保持一致；为 `true` 时该概念须被 [animation-spec.md](animation-spec.md) 的首版 8 组件覆盖。
- `relatedConceptIds`：每一项必须指向**已存在的** `KnowledgePoint.id`（构建期应校验，避免悬空引用）。
- `LearningModule.conceptIds`：与该模块下所有 `KnowledgePoint` 的集合一致，且顺序等于其 `order`。
- `DiagnosticQuestion.correctOptionIds`：每一项必须是该题 `options[].id` 之一；单选长度为 1，多选 ≥ 1。
- 内容正文（`definition`/`whyItMatters`/… 等）由后续按写作模板填充；登记阶段可先留空字符串/空数组，但**结构字段（id/slug/moduleId/order/difficulty/estimatedMinutes/hasAnimation）必须先行登记**。

## 3. 56 讲写作模板 → 权威 schema 映射

56 讲 PDF 的写作字段需转换为权威 schema：

| 56 讲写作模板字段 | 权威 schema 字段 | 转换说明 |
|---|---|---|
| `oneSentence` | `definition` | 直接搬运 |
| `whyItMatters` | `whyItMatters` | 同名 |
| `mentalModel` | `mentalModel` | 同名 |
| `mechanism: string[]` | `mechanism: string[]` | 同名 |
| `animationBrief { type, goal, steps[] }` | `animation: AnimationConfig` | `type`→规范化为 `AnimationType`；`goal`→`title`；`steps[]`→`AnimationStep[]`（补 `id`、可选 `durationMs`） |
| `enterpriseCase { title, scenario, problem, analysis, solution, takeaway }` | `enterpriseCase` | 同结构 |
| `commonPitfalls` | `pitfalls` | 改名 |
| `diagnosticQuestion { scenario, question, options[], answer, explanation, troubleshootingPath[] }` | `diagnosticQuestion` | `options: string[]`→`DiagnosticOption[]`（补 `id`，如 `a/b/c/d`）；`answer`→`correctOptionIds`；补题目 `id` 与 `relatedConceptIds` |
| `keyTakeaways` | `keyTakeaways` | 同名 |
| `relatedConcepts: string[]`（标题/术语） | `relatedConceptIds: string[]` | **必须从标题映射到对应概念 id**；映射不到的术语放入 `tags` 或术语表，不得直接写入 `relatedConceptIds` |

## 4. 登记表：6 模块 + 56 知识点

模块构成 `10 / 10 / 8 / 16 / 6 / 6`，共 **56**。难度/时长来自 56 讲 PDF。`anim` 列为首版动画类型（空 = 首版无动画，可后续按扩展枚举补充）。

### 模块

| id | title | subtitle | recommendedFor |
|---|---|---|---|
| m1 | 模型怎么工作 | 大模型的基本机制 | 全部用户（入门路径） |
| m2 | 模型怎么跑得又快又稳 | 推理性能与系统瓶颈 | 平台/工程（工程路径） |
| m3 | 模型怎么变成企业平台 | MaaS、网关与治理 | 平台负责人 |
| m4 | 模型怎么变成 Agent | 上下文、工具与任务闭环 | 应用开发（应用路径） |
| m5 | Agent 怎么改变软件工程 | AI 原生研发闭环 | 研发管理者 |
| m6 | 企业怎么治理 AI | 评测、安全、成本与组织 | AI 负责人（负责人路径） |

### M1 模型怎么工作（10）

| order | id / slug | title | difficulty | min | hasAnim | anim |
|---|---|---|---|---|---|---|
| 1 | token | Token | basic | 8 | ✓ | token-flow |
| 2 | semantic-space | 词向量与语义空间 | basic | 8 |  |  |
| 3 | transformer | Transformer | basic | 10 |  |  |
| 4 | attention | 注意力机制 | basic | 10 | ✓ | attention-map |
| 5 | positional-encoding | 位置编码 | basic | 7 |  |  |
| 6 | autoregressive | 自回归生成 | basic | 8 | ✓ | token-flow |
| 7 | sampling | 采样策略 | basic | 8 |  |  |
| 8 | instruction-tuning | 指令微调与偏好优化 | intermediate | 10 |  |  |
| 9 | hallucination | 幻觉 | intermediate | 10 |  |  |
| 10 | reasoning-limit | 推理能力边界 | intermediate | 12 |  |  |

### M2 模型怎么跑得又快又稳（10）

| order | id / slug | title | difficulty | min | hasAnim | anim |
|---|---|---|---|---|---|---|
| 1 | prefill | Prefill | intermediate | 10 | ✓ | prefill-decode |
| 2 | decode | Decode | intermediate | 10 | ✓ | prefill-decode |
| 3 | ttft | TTFT | intermediate | 9 | ✓ | prefill-decode |
| 4 | tpot | TPOT | intermediate | 8 | ✓ | prefill-decode |
| 5 | kv-cache | KV Cache | advanced | 12 | ✓ | kv-cache |
| 6 | session-affinity | Session 亲和 | advanced | 10 | ✓ | kv-cache |
| 7 | batch-scheduling | Batch 调度 | advanced | 11 |  |  |
| 8 | pd-separation | P-D 分离 | advanced | 12 |  |  |
| 9 | speculative-decoding | 投机解码 | advanced | 10 |  |  |
| 10 | quantization | 量化 | intermediate | 10 |  |  |

### M3 模型怎么变成企业平台（8）

| order | id / slug | title | difficulty | min | hasAnim | anim |
|---|---|---|---|---|---|---|
| 1 | maas | MaaS | intermediate | 10 |  |  |
| 2 | model-gateway | 模型网关 | intermediate | 10 | ✓ | model-router |
| 3 | multi-model-routing | 多模型路由 | advanced | 11 | ✓ | model-router |
| 4 | cost-routing | 成本路由 | advanced | 10 | ✓ | model-router |
| 5 | capability-routing | 能力路由 | advanced | 10 | ✓ | model-router |
| 6 | cache-system | 缓存体系 | advanced | 11 |  |  |
| 7 | rate-limit-circuit-break | 限流熔断 | intermediate | 10 |  |  |
| 8 | sla | SLA 保障 | intermediate | 10 |  |  |

### M4 模型怎么变成 Agent（16）

| order | id / slug | title | difficulty | min | hasAnim | anim |
|---|---|---|---|---|---|---|
| 1 | prompt-context | Prompt 与 Context | basic | 9 |  |  |
| 2 | system-prompt | 系统提示词 | basic | 8 |  |  |
| 3 | context-window | 上下文窗口 | basic | 9 | ✓ | context-window |
| 4 | context-compression | 上下文压缩 | intermediate | 10 |  |  |
| 5 | context-pollution | 上下文污染 | intermediate | 10 |  |  |
| 6 | layered-session | 分层会话 | advanced | 10 |  |  |
| 7 | agents-md | AGENTS.md | intermediate | 10 |  |  |
| 8 | repo-context | 仓库上下文 | advanced | 11 |  |  |
| 9 | spec-driven-development | 规格驱动开发 | advanced | 11 |  |  |
| 10 | agent-loop | Agent Loop | intermediate | 12 | ✓ | agent-loop |
| 11 | tool-calling | 工具调用 | intermediate | 10 | ✓ | agent-loop |
| 12 | skill | Skill | advanced | 12 |  |  |
| 13 | subagent | Subagent | advanced | 10 |  |  |
| 14 | memory | 记忆 | intermediate | 10 |  |  |
| 15 | human-in-the-loop | Human-in-the-loop | intermediate | 10 |  |  |
| 16 | multi-agent | 多 Agent 协作 | advanced | 12 |  |  |

### M5 Agent 怎么改变软件工程（6）

| order | id / slug | title | difficulty | min | hasAnim | anim |
|---|---|---|---|---|---|---|
| 1 | code-review-agent | Code Review Agent | advanced | 11 |  |  |
| 2 | issue-fix-agent | Issue Fix Agent | advanced | 12 | ✓ | issue-fix-flow |
| 3 | requirement-decomposition-agent | 需求拆解 Agent | advanced | 11 |  |  |
| 4 | test-generation-agent | 测试生成 Agent | intermediate | 10 |  |  |
| 5 | ops-diagnosis-agent | 运维诊断 Agent | advanced | 11 |  |  |
| 6 | value-review-agent | 价值复盘 Agent | intermediate | 10 |  |  |

### M6 企业怎么治理 AI（6）

| order | id / slug | title | difficulty | min | hasAnim | anim |
|---|---|---|---|---|---|---|
| 1 | eval | Eval | advanced | 12 |  |  |
| 2 | trace | Trace | advanced | 10 |  |  |
| 3 | observability | Observability | advanced | 11 |  |  |
| 4 | token-roi | Token ROI | advanced | 12 |  |  |
| 5 | permission-governance | 权限治理 | advanced | 11 |  |  |
| 6 | ai-native-org | AI 原生组织阵型 | advanced | 12 |  |  |

> 首版 `hasAnimation=true` 的概念共 17 个，覆盖 7 类首版动画（≥4 类、≥6 个，满足内容门槛）。其余概念可后续用 [animation-spec.md](animation-spec.md) §1 的扩展枚举补动画。

## 5. 完整样例（KV Cache）

展示一个填满后的 `KnowledgePoint`（内容取自 PRD §13.2 与 56 讲第 15 讲）：

```ts
const kvCache: KnowledgePoint = {
  id: 'kv-cache',
  title: 'KV Cache',
  slug: 'kv-cache',
  moduleId: 'm2',
  order: 5,
  difficulty: 'advanced',
  estimatedMinutes: 12,
  tags: ['KV Cache', 'TTFT', 'Session 亲和', 'MaaS'],
  hasAnimation: true,
  definition:
    'KV Cache 是在大模型推理中缓存历史上下文的 Key 和 Value，避免每次生成新 Token 时重复计算全部历史。',
  whyItMatters:
    'KV Cache 直接影响首字时延、吞吐、显存占用和多轮对话体验。企业 MaaS 平台如果 KV Cache 命中率低，高并发下会快速劣化。',
  mentalModel:
    '把 KV Cache 理解为“模型已经读过的上下文笔记”。下一轮还在同一会话里时，模型可直接翻笔记，而不是重新读全文。',
  mechanism: [
    'Prefill 阶段处理完整输入上下文',
    '模型为每层注意力生成 Key 和 Value',
    '这些 Key 和 Value 被缓存到显存中',
    'Decode 阶段生成新 Token 时复用已有 KV',
    '如果请求被路由到没有缓存的实例，就需要重新 Prefill',
  ],
  animation: {
    type: 'kv-cache',
    title: 'KV Cache 命中与未命中',
    steps: [
      { id: 's1', title: '多轮请求进入同一会话', description: '用户在同一会话里连续提问，模型需要复用之前的上下文。' },
      { id: 's2', title: 'Prefill：处理完整输入', description: '模型一次性并行处理全部输入上下文，并为每层注意力计算 Key 和 Value。' },
      { id: 's3', title: '写入 KV Cache', description: '计算出的 Key / Value 被缓存到显存中，作为“已读上下文的笔记”。' },
      { id: 's4', title: 'Decode：命中缓存', description: '生成新 Token 时直接复用已缓存的 KV，无需重算历史，TTFT 很低。' },
      { id: 's5', title: '路由失效：缓存未命中', description: '请求被打散到没有缓存的实例，必须重新 Prefill，TTFT 飙升。' },
    ],
  },
  enterpriseCase: {
    title: '高峰期 TTFT 飙升',
    scenario: '某 MaaS 平台高峰期 TTFT 明显上升。',
    problem: '用户反馈首字等待明显变长。',
    analysis: '负载均衡未保持 Session 亲和，多轮请求被分配到不同实例，导致 KV Cache 命中率下降。',
    solution: '启用 Session 亲和路由，让同一会话稳定命中持有缓存的实例；监控缓存命中率而非只看平均时延。',
    takeaway: 'Session 亲和是企业 MaaS 必须具备的能力。',
  },
  pitfalls: [
    '只关注模型大小，不关注缓存命中',
    '认为增加卡数一定能降低 TTFT',
    '忽视会话亲和',
    '忽视长上下文对显存的挤占',
  ],
  diagnosticQuestion: {
    id: 'q-kv-cache-1',
    type: 'single',
    scenario:
      '某 MaaS 平台高峰期 TTFT 从 800ms 上升到 4s，KV Cache 命中率从 60% 下降到 15%，用户反馈首字等待明显变长。',
    question: '最优先排查什么？',
    options: [
      { id: 'a', text: '模型参数量是否过大' },
      { id: 'b', text: 'Session 亲和是否失效' },
      { id: 'c', text: '温度参数是否过高' },
      { id: 'd', text: '是否需要增加提示词长度' },
    ],
    correctOptionIds: ['b'],
    explanation:
      'TTFT 上升且 KV Cache 命中率下降，优先怀疑请求没有路由到持有上下文缓存的实例，或会话亲和策略失效。模型大小和温度不是该现象的首要解释。',
    troubleshootingPath: ['确认会话亲和/路由策略', '检查实例缓存状态', '核对请求是否被错误打散', '复核高峰期扩缩容'],
    relatedConceptIds: ['prefill', 'decode', 'ttft', 'session-affinity'],
  },
  keyTakeaways: [
    'KV Cache 是多轮对话性能的关键',
    'Session 亲和是企业 MaaS 必须具备的能力',
    '高并发问题不能只看平均时延，要同时看缓存命中率',
  ],
  relatedConceptIds: ['prefill', 'decode', 'ttft', 'session-affinity', 'sla'],
};
```
