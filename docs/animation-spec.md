# 动画规格 · animation-spec

> 动画是知识点详情页中的一个章节，不是独立控制台。全部用 SVG / CSS / Canvas / React 组件实现，**不做 3D、不做视频、不依赖远程资源**。数据结构见 [content-schema.md](content-schema.md)。

## 1. 权威 AnimationType 枚举

采用 56 讲 PDF 的 17 值枚举为权威（最完整），统一 kebab-case，由 `src/types/index.ts` 导出：

```ts
export type AnimationType =
  | 'token-flow'
  | 'semantic-space'
  | 'attention-map'
  | 'context-window'
  | 'prefill-decode'
  | 'kv-cache'
  | 'batch-scheduler'
  | 'pd-separation'
  | 'model-router'
  | 'cache-layers'
  | 'rag-pipeline'
  | 'agent-loop'
  | 'tool-calling'
  | 'skill-lifecycle'
  | 'issue-fix-flow'
  | 'observability-trace'
  | 'token-roi-flow';
```

### 与 PRD 8 值枚举的命名对应

PRD §8.3 用了较短的枚举，与本枚举命名差异如下（以本枚举为准）：

| PRD 枚举 | 权威枚举 |
|---|---|
| `attention` | `attention-map` |
| `model-routing` | `model-router` |
| `token-flow` / `context-window` / `kv-cache` / `prefill-decode` / `rag-pipeline` / `agent-loop` | 同名 |

## 2. 首版 8 个动画组件与覆盖的知识点

首版只实现 8 个组件，通过配置复用覆盖多个知识点（**不为每一讲写独立动画**）。下表与 [content-schema.md](content-schema.md) §4 的 `hasAnimation` 严格一致。

| 组件 | AnimationType | 覆盖知识点（id） |
|---|---|---|
| TokenFlowAnimation | `token-flow` | token, autoregressive |
| AttentionAnimation | `attention-map` | attention |
| ContextWindowAnimation | `context-window` | context-window |
| PrefillDecodeAnimation | `prefill-decode` | prefill, decode, ttft, tpot |
| KVCacheAnimation | `kv-cache` | kv-cache, session-affinity |
| ModelRoutingAnimation | `model-router` | model-gateway, multi-model-routing, cost-routing, capability-routing |
| AgentLoopAnimation | `agent-loop` | agent-loop, tool-calling |
| IssueFixFlowAnimation | `issue-fix-flow` | issue-fix-agent |

> 覆盖 8 组件 / 7 类型 / 17 知识点，满足“≥4 类动画、≥6 个动画配置”的内容门槛。
> 其余高动画优先级概念（如 skill→`skill-lifecycle`、batch-scheduling→`batch-scheduler`、pd-separation→`pd-separation`、trace/observability→`observability-trace`、token-roi→`token-roi-flow`、semantic-space→`semantic-space`）为后续扩展，按本枚举补充，不阻塞首版。

## 3. AnimationPlayer 统一契约

所有动画组件由 `AnimationPlayer` 统一驱动，**步骤数据来自 `AnimationConfig`，不写死在组件内**。

### 输入

```ts
interface AnimationPlayerProps {
  config: AnimationConfig;          // type / title / steps
}
```

### 控制能力

- 播放 / 暂停（自动按步推进，默认步间隔约 1700ms，可由 `step.durationMs` 覆盖）
- 上一步 / 下一步
- 重置（回到第 1 步）
- 步骤计数显示（如 `3 / 5`）
- 当前步说明同步显示（`step.title` + `step.description`）

### 行为规则

- 每次只解释当前一步，不并列展示所有步骤说明。
- 播放到最后一步自动停止；从最后一步再次播放则从头开始。
- 切换知识点 / 离开页面时停止计时器，避免泄漏。
- 通过 `config.type` 分发到对应的机制画布组件（注册式，新增动画只需注册，不改 Player）。

### 注册式分发

```ts
const REGISTRY: Partial<Record<AnimationType, React.ComponentType<AnimationCanvasProps>>> = {
  'token-flow': TokenFlowAnimation,
  'attention-map': AttentionAnimation,
  'context-window': ContextWindowAnimation,
  'prefill-decode': PrefillDecodeAnimation,
  'kv-cache': KVCacheAnimation,
  'model-router': ModelRoutingAnimation,
  'agent-loop': AgentLoopAnimation,
  'issue-fix-flow': IssueFixFlowAnimation,
  // 其余类型后续注册
};
```

> 用 `Partial<Record<...>>` 表达“枚举已定义但组件未实现”的中间态；`validate:content` 会校验任何 `hasAnimation` 概念引用的 `type` 必须在 REGISTRY 中存在实现（见 [content-schema.md](content-schema.md) §6.1）。

### 3.1 AnimationCanvas 组件契约（8 个动画组件统一实现）

每个机制画布组件都接收统一的只读 props，**自身不持有播放状态、不写步骤数据**，仅按当前步渲染：

```ts
interface AnimationCanvasProps {
  config: AnimationConfig;   // 完整配置（type / title / steps）
  step: AnimationStep;       // 当前步（= config.steps[stepIndex]）
  stepIndex: number;         // 当前步下标，从 0 起
  totalSteps: number;        // 总步数
  reducedMotion: boolean;    // 是否启用减弱动效（见下）
}
```

- `highlightTargets` 语义：`AnimationStep.highlightTargets` 是该步需要高亮的画布元素 key 列表；各 canvas 组件维护一个 `元素 key → 高亮样式` 的映射，仅高亮命中项，其余保持基态。key 命名在组件内自定义但需稳定。
- 画布只读：组件不调用计时器、不修改 `config`；推进由 `AnimationPlayer` 负责。

### 3.2 未注册类型 fallback

- `AnimationPlayer` 通过 `config.type` 查 REGISTRY；命中则渲染对应 canvas。
- **未命中**（类型未实现）时：渲染降级占位（标题 + 当前步 `title/description` 的纯文本步骤视图 + 步骤计数），保证页面不崩、阅读不中断，并在开发模式 `console.warn` 提示“未注册的 AnimationType”。
- 生产环境不得因未注册类型抛错或白屏。

### 3.3 移动端尺寸与可访问性

- 画布自适应容器宽度，深色画布区设最小高度（约 236px）与最大宽度（约 600–640px 居中），移动端单列、可横向内部滚动但页面整体无横向滚动。
- **reduced motion**：尊重 `prefers-reduced-motion`。开启时 `reducedMotion=true`，组件禁用自动过渡/循环动效，仅做“按步切换的静态状态”渲染；`AnimationPlayer` 关闭自动播放计时（保留手动上一步/下一步）。
- 控制按钮可键盘聚焦与操作，提供可辨识的聚焦态。

## 4. 视觉约束（来自 design.md）

- 允许机制画布使用**深色背景**（如 `#1A1916`），但**面积克制**，仅作机制演示容器；外层仍处于浅色阅读页面中。
- 控制区保持简单：上一步、播放/暂停、下一步、重置、步骤计数。
- **不**增加监控面板、复杂指标、右侧大说明栏。
- 强调色沿用蓝 `#1F40D8`；命中/正向状态可用绿，未命中/告警可用克制的暖橙/红，但不堆砌。
- 移动端可用，单列适配。

## 5. 基准步骤脚本（已在高保真原型验证）

以下三个脚本作为风格与节奏基准，落库时转为 `AnimationConfig.steps`（补 `id`）。

### 5.1 kv-cache（KV Cache 命中与未命中）

1. 多轮请求进入同一会话 — 用户在同一会话里连续提问，模型需要复用之前的上下文。
2. Prefill：处理完整输入 — 模型一次性并行处理全部输入上下文，并为每层注意力计算 Key 和 Value。
3. 写入 KV Cache — 计算出的 Key / Value 被缓存到显存中，作为“已读上下文的笔记”。
4. Decode：命中缓存 — 生成新 Token 时直接复用已缓存的 KV，无需重算历史，TTFT 很低。
5. 路由失效：缓存未命中 — 请求被打散到没有缓存的实例，必须重新 Prefill，TTFT 飙升。

### 5.2 token-flow（文本到 Token 再到输出）

1. 输入文本 — 用户输入一段自然语言，模型还看不懂文字本身。
2. 分词为 Token — 分词器把文本切成若干 Token，一个 Token 不一定等于一个字。
3. 映射为编号 — 每个 Token 对应一个整数编号，再被转换为向量。
4. 逐 Token 生成 — 模型基于上下文逐个预测下一个 Token。
5. 解码为文本 — 输出的 Token 再被解码为人类可读文本。

### 5.3 agent-loop（Observe → Think → Act → Check → Continue/Stop）

1. 用户给出目标 — Agent 接到一个需要完成的任务，而不仅是一个问题。
2. Observe 观察 — 读取上下文，了解当前状态与可用信息。
3. Think 思考 — 基于目标和观察生成计划与下一步动作。
4. Act 行动 — 调用工具执行动作，并消费工具返回的结果。
5. Check 校验 — 检查结果是否达成目标、是否出错。
6. 判断是否继续 — 未完成则回到观察继续循环；完成或触发退出条件则结束或转人工。
