# HyperFrames 系列化视频制作指导书

本指导书交给后续 Codex / Agent 批量制作机制解释视频使用。目标不是给 56 讲逐讲配视频，而是把相邻知识点串成少量高质量短片，让用户先看懂一条完整工程链路，再回到 APP 中学习单讲。

## 1. 制作原则

### 1.1 交付形态

- 每支视频先交付 **HyperFrames 可预览项目**，不直接接入 APP。
- 默认路径：`materials/hyperframes/<video-slug>/`。
- 每个项目至少包含：
  - `index.html`：standalone HyperFrames composition。
  - `DESIGN.md`：本视频视觉说明。
  - `README.md`：预览、检查、渲染命令。
  - `vendor/gsap.min.js`：本地 GSAP，避免预览依赖 CDN。
  - `fonts/*.woff2`：本地字体文件，避免 lint 字体错误。
- 不修改 `src/data/*`、`src/components/*`、`src/types/*`、`docs/content-schema.md`。
- MP4 渲染作为二期动作；本机需先保证 FFmpeg 在 PATH。

### 1.2 视频规格

- 画幅：`1920 x 1080`，16:9。
- 时长：单支 35-60 秒；首批建议 45 秒左右。
- 语言：中文屏幕文字。
- 声音：默认无旁白、无音频，只做字幕式视觉解释。
- 风格：工程学习书桌感，克制、清晰、机制优先。

### 1.3 视觉规范

沿用仓库 `design.md`：

- 背景：`#FAF9F6`
- Surface：`#FFFFFF`
- Soft surface：`#F2EFE7`
- Border：`#E7E3D9`
- Title：`#1A1916`
- Text：`#34322C`
- Muted：`#8C887E`
- Primary blue：`#1F40D8`
- Progress green：`#2E7D58`
- Warning amber：`#E8943A`

字体：

- 标题：IBM Plex Serif
- 正文/UI：IBM Plex Sans
- Token、编号、指标：IBM Plex Mono

禁止：

- 华为红主视觉。
- 大面积深色科技背景。
- 霓虹、紫蓝渐变、赛博光效。
- dashboard 式密集信息墙。
- 把课程正文长段直接搬上屏。

## 2. HyperFrames 实现规范

### 2.1 项目结构模板

```text
materials/hyperframes/<video-slug>/
  index.html
  DESIGN.md
  README.md
  fonts/
    ibm-plex-sans-300.woff2
    ibm-plex-sans-400.woff2
    ibm-plex-sans-700.woff2
    ibm-plex-serif-400.woff2
    ibm-plex-serif-700.woff2
    ibm-plex-mono-400.woff2
    ibm-plex-mono-700.woff2
  vendor/
    gsap.min.js
```

### 2.2 Composition 基本要求

- standalone composition，不使用 `<template>`。
- root div 必须包含：

```html
<div
  id="root"
  data-composition-id="<video-slug>"
  data-width="1920"
  data-height="1080"
  data-start="0"
  data-duration="<seconds>"
>
```

- 多场景必须有转场，不能 jump cut。
- 每个场景必须有入场动画。
- 不在非最终场景做 exit 动画；转场负责离场。
- Timeline 必须同步构建并注册：

```js
window.__timelines = window.__timelines || {};
var tl = gsap.timeline({ paused: true });
window.__timelines["<video-slug>"] = tl;
```

### 2.3 转场建议

- 默认主转场：horizontal push slide。
- 章节切换：staggered full-frame blocks。
- 结尾：blur crossfade。
- 不使用 shader，除非后续明确升级视觉表达。

### 2.4 文案规则

- 每屏只讲一个机制动作。
- 标题 12-18 个中文字以内。
- 正文 1-2 行，避免超过 36 个中文字。
- Token、指标、编号可用英文/数字，但不要泄漏内部 raw key。
- 屏幕文字要像解释图，不像讲义页。

## 3. 验证流程

每支视频完成后，在仓库根目录执行：

```bash
npx --yes hyperframes lint materials/hyperframes/<video-slug>
npx --yes hyperframes validate materials/hyperframes/<video-slug>
npx --yes hyperframes inspect materials/hyperframes/<video-slug> --samples 15
npx --yes hyperframes preview materials/hyperframes/<video-slug> --port 3017
```

验收标准：

- `lint` 必须 0 error。warning 可保留，但要在交付说明中解释。
- `validate` 必须无 console error，文本通过 WCAG AA。
- `inspect` 必须 0 layout issues。
- Studio URL 使用：

```text
http://localhost:3017/#project/<video-slug>
```

如果 preview 生成 `preview.log`，停止服务后可删除；不要把日志当作正式交付物。

## 4. 已完成样板

### 4.1 `text-to-answer`

路径：`materials/hyperframes/text-to-answer/`

主题：一句话如何变成模型回答

串联知识点：

```text
token -> semantic-space -> transformer -> attention -> positional-encoding -> autoregressive -> sampling
```

结构：

1. 片头：一句话如何变成模型回答。
2. Token：自然语言被切成 Token。
3. 语义空间：Token 映射为编号和向量点。
4. Transformer：Token + 位置编码进入多层加工。
5. 注意力：当前位置对历史 Token 分配权重。
6. 自回归：一次预测一个下一个 Token。
7. 采样策略：从概率分布中选出输出。
8. 结尾：模型回答是一条工程链路。

已验证：

- `lint`：0 error。
- `validate`：无 console error，WCAG AA pass。
- `inspect --samples 15`：0 layout issues。

## 5. 推荐批量制作清单

### P0 / 第一批：最值得先做

#### 1. 一句话如何变成模型回答

- slug：`text-to-answer`
- 状态：已完成样板。
- 知识点：`token`、`semantic-space`、`transformer`、`attention`、`positional-encoding`、`autoregressive`、`sampling`
- 用户收获：理解模型不是“直接理解一句话”，而是 Token 化、向量化、Transformer 加工、逐 Token 生成。

#### 2. 为什么大模型会慢：首字前与首字后

- slug：`latency-prefill-decode`
- 知识点：`token`、`prefill`、`ttft`、`kv-cache`、`decode`、`tpot`、`batch-scheduling`、`pd-separation`
- 核心叙事：一次请求先经历首字前链路，再进入逐 Token 输出；慢要拆成 Prefill、TTFT、Decode、TPOT 和缓存命中。
- 适合画面：输入 Token 条、Prefill 区、KV Cache 写入、首 Token 分隔线、Decode 循环、TPOT 间隔条、批调度队列。
- 可复用现有概念动画语义：`token-flow`、`prefill-decode`、`kv-cache`。

#### 3. 长上下文不是越长越好

- slug：`long-context-quality`
- 知识点：`token`、`attention`、`context-window`、`context-compression`、`context-pollution`、`hallucination`、`eval`
- 核心叙事：更长窗口给了更多材料，也带来更高成本、更重注意力竞争和更大污染风险；质量要靠选择、压缩、排序和评测。
- 适合画面：有限窗口容器、证据片段排队、无关片段挤占、注意力权重偏移、压缩/重排后关键证据置顶、Eval 回归。
- 重点避免：不要表达成长上下文天然更聪明。

### P1 / 第二批：平台与 Agent 主线

#### 4. 模型如何变成企业平台 MaaS

- slug：`maas-control-plane`
- 知识点：`maas`、`model-gateway`、`multi-model-routing`、`cost-routing`、`capability-routing`、`rate-limit-circuit-break`、`sla`、`observability`
- 核心叙事：企业不是让应用直连模型，而是通过统一控制面完成鉴权、路由、限流、计量、审计和观测。
- 适合画面：业务应用汇入网关、策略过滤、模型池路由、成本/能力权衡、熔断降级、指标回流。
- 可复用现有概念动画语义：`model-router`、`observability-trace`。

#### 5. Agent 如何从回答变成执行系统

- slug：`agent-execution-loop`
- 知识点：`prompt-context`、`system-prompt`、`context-window`、`agent-loop`、`tool-calling`、`skill`、`human-in-the-loop`、`multi-agent`
- 核心叙事：Agent 不是更长回答，而是带目标、上下文、工具、校验和退出条件的循环执行系统。
- 适合画面：目标输入、上下文窗口、Observe/Plan/Act/Check 环、工具调用、Skill 加载、人审闸门、多 Agent 分工汇总。
- 可复用现有概念动画语义：`context-window`、`agent-loop`、`skill-lifecycle`。

#### 6. AI 原生软件工程闭环

- slug：`ai-native-engineering-loop`
- 知识点：`agents-md`、`repo-context`、`spec-driven-development`、`issue-fix-agent`、`code-review-agent`、`test-generation-agent`、`value-review-agent`
- 核心叙事：AI 软件工程不是“让模型写代码”，而是从规格、仓库上下文、修复、评审、测试到价值复盘的闭环。
- 适合画面：规格输入、仓库上下文检索、Issue Fix PR、Review 反馈、测试生成、价值复盘指标回流。
- 可复用现有概念动画语义：`issue-fix-flow`。

### P2 / 第三批：治理与组织

#### 7. AI 系统如何被评测和观测

- slug：`eval-trace-observability`
- 知识点：`eval`、`trace`、`observability`、`ops-diagnosis-agent`、`sla`
- 核心叙事：上线前靠 Eval 回归，上线后靠 trace 和 observability 定位质量、延迟、成本和失败路径。
- 适合画面：评测集、线上请求、trace id、span 树、质量/延迟/成本指标、异常下钻。
- 可复用现有概念动画语义：`observability-trace`。

#### 8. Token ROI：什么时候该省，什么时候不能省

- slug：`token-roi-decision`
- 知识点：`token`、`cost-routing`、`token-roi`、`value-review-agent`、`eval`、`kv-cache`
- 核心叙事：降本不是全局压 Token，而是按场景计算单位价值成本，高价值保质量，低价值才压缩或换小模型。
- 适合画面：输入/输出 Token 成本、业务价值轴、质量曲线、边际收益拐点、路由/缓存/提示精简策略。
- 可复用现有概念动画语义：`token-roi-flow`、`model-router`。

#### 9. 权限治理与人工在环

- slug：`permission-human-gate`
- 知识点：`permission-governance`、`human-in-the-loop`、`tool-calling`、`trace`、`observability`、`ai-native-org`
- 核心叙事：企业 Agent 默认最小权限，高风险动作必须经过人审，并留下可审计 trace。
- 适合画面：只读默认、写权限申请、高风险动作闸门、人工审批卡、审计日志、越权告警。
- 重点避免：不要把人工在环画成“阻碍自动化”，而是质量和责任边界。

## 6. 单支视频制作步骤

1. 选定 slug 和知识点链路。
2. 从 `src/data/demoConcepts.ts` 抽取相关讲的 `definition`、`mechanism`、`keyTakeaways`，只取机制动作，不搬长文。
3. 写 6-8 个场景，每个场景对应一个机制动作。
4. 新建 `materials/hyperframes/<slug>/DESIGN.md`，复用本指导书视觉规范。
5. 新建 `index.html`，用 standalone composition。
6. 本地化 `vendor/gsap.min.js` 和 `fonts/*.woff2`。
7. 写 GSAP timeline：每场景入场 + 场景间转场 + 结尾淡出。
8. 跑 `lint`、`validate`、`inspect`。
9. 启动 preview，把 Studio URL 交付给 Owner。

## 7. 交付说明模板

```text
已完成 <video-title> HyperFrames 试做视频。

路径：
materials/hyperframes/<video-slug>/

预览：
http://localhost:<port>/#project/<video-slug>

验证：
- lint：0 error（若有 warning，说明原因）
- validate：无 console error，WCAG AA pass
- inspect --samples 15：0 layout issues

未做：
- 未渲染 MP4
- 未接入 APP
- 未改 src/data 或 schema
```

