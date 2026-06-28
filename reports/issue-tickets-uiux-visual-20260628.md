# AI-Learning-App UI 视觉规范对齐问题单（20260628）

> 审计类型：静态代码层视觉规范对齐（不起 dev server、不截图）
> 工作根目录：`d:\AI项目\AI-Learning-App`
> 对照基线：`design.md` §2/§4/§8 + `AGENTS.md` §5 视觉红线
> 工具：Grep（硬编码色值）+ Read（页面/组件 .tsx/.module.css）

## 1. 结论先行

- **视觉一致性结论**：**有条件通过**（可发布，但建议在下一轮 polish 中收口 P1 的 token 缺口）
- **主色 / 背景 / 字体 守住情况**：
  - 主色蓝 `#1F40D8`、进度绿 `#2E7D58`、背景暖纸 `#FAF9F6` 在页面级（HomePage / ConceptPage / Sidebar / BottomNav / Header）**全部通过 `var(--color-*)` 消费**，主色体系守住 ✓
  - 字体三族（serif/sans/mono）在全局 `global.css` 与主页面正确分工，标题 serif、正文 sans、序号/标签 mono 基本到位 ✓
  - **未发现华为红主视觉、未发现霓虹/渐变光效、未发现大面积深色主题（动画画布深色属 design.md §4 明确允许）** ✓
  - **首页未 dashboard 化**：第一屏只有 hero + 继续学习 + 简洁进度，六大模块下沉 ✓
- **问题计数**：**P0 = 0 / P1 = 4 / P2 = 5 / P3 = 2**
- **最大风险（一句话）**：`tokens.css` 缺少 `--color-warning-soft` 与动画深色画布系列 token，导致告警软背景与动画配色在 10+ 组件中以硬编码方式重复，后续改色需要逐文件改，是当前最大的视觉一致性隐患。

## 2. 覆盖范围

| 文件 | 是否已读 | 备注 |
|---|---|---|
| `AGENTS.md`（§5 视觉红线） | ✓ | 主色/禁项/字体规则基线 |
| `design.md` | ✓ | §2 色彩/字体、§4 页面、§8 禁止项 |
| `src/styles/tokens.css` | ✓ | 视觉唯一来源，49 行；缺 warning-soft / 动画画布 token / spacing scale |
| `src/styles/global.css` | ✓ | 全局 reset + 字体分工正确 |
| `src/pages/HomePage.tsx` + `.module.css` | ✓ | 第一屏合规，非 dashboard |
| `src/pages/ScenariosPage.tsx` + `.module.css` | ✓ | 新页面，复用了既有视觉语言 |
| `src/pages/ScenarioPage.tsx` + `.module.css` | ✓ | 改过，三栏 workspace 接近 dashboard 边界但克制 |
| `src/pages/ConceptPage.tsx` + `.module.css` | ✓ | 视觉合规 |
| `src/components/layout/Sidebar.tsx` + `.module.css` | ✓ | 全 var 消费，合规 |
| `src/components/layout/BottomNav.tsx` + `.module.css` | ✓ | 合规（仅 rgba 半透明背景，对齐 design.md Top Bar 风格） |
| `src/components/layout/Header.module.css` | ✓ | 合规 |
| `src/components/quiz/OptionCard.module.css` | ✓ | 含硬编码 `#fff5e8` / rgba 告警变体 |
| `src/components/quiz/ExplanationPanel.module.css` | ✓ | 含硬编码 `#fff5e8` / rgba 告警变体 |
| `src/components/quiz/DiagnosticQuestion.module.css` | ✓ | 合规（仅 `#fff` 主按钮文本） |
| `src/components/concept/ConceptHeader.module.css` | ✓ | 合规（仅 `#fff` 完成按钮文本） |
| `src/components/concept/ConceptCard.module.css` | ✓ | 全 var 消费，合规 |
| `src/pages/ProfilePage.module.css` | ✓ | 含硬编码 `#fff5e8` / `#9a520f` / rgba 告警变体 |
| 动画组件 `.module.css`（10 个） | ✓（Grep 全扫） | 系统性硬编码深色画布配色，design.md §4 允许深色画布，但应 token 化 |

## 3. 硬编码色值清单（Grep 结果）

> 工具：`Grep` `#[0-9a-fA-F]{3,8}\b` 与 `rgba?\(|hsla?\(`，glob `src/**/*.module.css`，已排除 `tokens.css` / `global.css`。
> 分类口径：✅ 合规 = 用途正当且属既有色体系；⚠️ 软告警 = 应改用 `var(--color-warning-soft)`；🔴 系统性 = 动画画布配色应建 token；🟡 局部魔法色 = 应 token 化。

### 3.1 `#hex` 硬编码（按文件聚合）

| 文件:行号 | 色值 | 上下文 | 是否合规 | 建议 |
|---|---|---|---|---|
| `src/pages/HomePage.module.css:52` | `#fff` | `.primaryBtn` 主按钮文本色 | ✅ | 可加 `--color-on-primary: #fff` 收口 |
| `src/pages/HomePage.module.css:59` | `#1838b8` | `.primaryBtn:hover` 背景（主色深变体） | 🟡 P2 | 应在 tokens.css 加 `--color-primary-hover` |
| `src/pages/ScenarioPage.module.css:133` | `#bed8ca` | `.metricCard.better` 边框（绿软变体） | 🟡 P2 | 加 `--color-progress-border` token |
| `src/pages/ScenarioPage.module.css:138` | `#f1d0a8` | `.metricCard.worse` 边框（告警软变体） | 🟡 P2 | 加 `--color-warning-border` token |
| `src/pages/ScenarioPage.module.css:139` | `#fff7ea` | `.metricCard.worse` 背景 | ⚠️ P1 | 改用 `var(--color-warning-soft)` |
| `src/pages/ScenarioPage.module.css:319` | `#fff` | `.primary` 按钮文本 | ✅ | 同上 on-primary 收口 |
| `src/pages/ConceptPage.module.css:164` | `#fff` | `.primary` 按钮文本 | ✅ | 同上 |
| `src/pages/ProfilePage.module.css:367` | `#fff5e8` | `.danger button` 背景（告警软） | ⚠️ P1 | 改用 `var(--color-warning-soft)` |
| `src/pages/ProfilePage.module.css:368` | `#9a520f` | `.danger button` 文本色（棕色） | 🔴 P1 | 脱离蓝/绿/告警/暖纸色体系；改用 `var(--color-warning)` 或更深一档的 warning 文本 token |
| `src/components/quiz/ExplanationPanel.module.css:14` | `#fff5e8` | `.warn` 背景 | ⚠️ P1 | 改用 `var(--color-warning-soft)` |
| `src/components/quiz/OptionCard.module.css:36` | `#fff5e8` | `.wrong` 背景 | ⚠️ P1 | 改用 `var(--color-warning-soft)` |
| `src/components/concept/ConceptHeader.module.css:70,74` | `#fff` | `.complete` 按钮文本 | ✅ | on-primary 收口 |
| `src/components/quiz/DiagnosticQuestion.module.css:39` | `#fff` | `.submit` 按钮文本 | ✅ | on-primary 收口 |
| `src/components/animation/*.module.css`（10 文件，~150 处） | `#1a1916` `#f7f3ea` `#b4b0a6` `#8ea2ff` `#f0c089` `#8fd3b0` `#6f6b62` `#c7d0ff` `#ffe1bd` `#dff1e7` `#cfe6da` `#d8d3c8` `#e7e3d9` `#2e7d58` `#e8943a` 等 | 动画画布深色背景 + 画布内主色/进度/告警变体 | 🔴 P1（系统性） | design.md §4 允许深色画布，但应在 tokens.css 集中定义 `--anim-canvas-bg` / `--anim-canvas-text` / `--anim-primary` / `--anim-progress` / `--anim-warning` / `--anim-muted` 等 token，统一消费 |

### 3.2 `rgba()` / `hsla()` 硬编码（按文件聚合）

| 文件:行号 | 色值 | 上下文 | 是否合规 | 建议 |
|---|---|---|---|---|
| `src/components/layout/Header.module.css:11` | `rgba(250, 249, 246, 0.86)` | Top Bar 半透明背景 | ✅ | 对齐 design.md §5「背景可使用 `rgba(250, 249, 246, 0.86)` + blur」原文 |
| `src/components/layout/BottomNav.module.css:8` | `rgba(250, 249, 246, 0.92)` | 移动端底栏半透明背景 | ✅ | 同上 |
| `src/components/quiz/OptionCard.module.css:30,35` | `rgba(46,125,88,0.6)` `rgba(232,148,58,0.7)` | correct/wrong 边框（进度/告警透明变体） | 🟡 P2 | 可加 `--color-progress-border` / `--color-warning-border` token |
| `src/components/quiz/ExplanationPanel.module.css:8,13` | `rgba(46,125,88,0.55)` `rgba(232,148,58,0.6)` | ok/warn 边框 | 🟡 P2 | 同上 |
| `src/components/concept/DecisionGuideSection.module.css:92,96` | `rgba(46,125,88,0.32)` `rgba(232,148,58,0.38)` | 决策手册边框 | 🟡 P2 | 同上 |
| `src/pages/ProfilePage.module.css:365` | `rgba(232,148,58,0.7)` | danger 按钮边框 | 🟡 P2 | 同上 |
| `src/components/animation/*.module.css`（10 文件，~80 处） | 大量 `rgba(250,249,246,*)` `rgba(31,64,216,*)` `rgba(46,125,88,*)` `rgba(232,148,58,*)` `rgba(142,162,255,*)` | 动画画布内透明叠加 | 🔴 P1（系统性） | 同 3.1，随动画 token 体系一并收口 |

> 备注：`global.css::selection` 用 `#dfe3fb`，属全局选择高亮，可接受，但严格说也应 token 化（P3）。

## 4. 视觉问题清单

| 级别 | 页面/组件 | 位置(文件:行号) | 现象 | 影响 | 最小修复方向 |
|---|---|---|---|---|---|
| P1 | tokens.css + OptionCard / ExplanationPanel / ProfilePage / ScenarioPage | `tokens.css`（缺） + `OptionCard.module.css:36` `ExplanationPanel.module.css:14` `ProfilePage.module.css:367` `ScenarioPage.module.css:139` | 缺少 `--color-warning-soft` token，告警软背景 `#fff5e8`/`#fff7ea` 在 4+ 文件硬编码 | 改告警色需逐文件改；存在漂移风险 | tokens.css 加 `--color-warning-soft: #fff5e8;` 与 `--color-warning-border: #f1d0a8;`，4 处改 `var(...)` |
| P1 | tokens.css + 10 个动画组件 | `tokens.css`（缺） + `src/components/animation/*.module.css` ~150 处 `#hex` + ~80 处 `rgba()` | 动画画布深色配色（bg `#1a1916`、text `#f7f3ea`、primary `#8ea2ff`、progress `#8fd3b0`、warning `#f0c089`）全硬编码 | 动画改色需在 10 个文件逐处改；新动画会继续抄写硬编码 | tokens.css 加 `--anim-canvas-bg` / `--anim-canvas-text` / `--anim-primary` / `--anim-progress` / `--anim-warning` / `--anim-muted` 系列，统一替换 |
| P1 | ProfilePage | `ProfilePage.module.css:368` | `.danger button` 文本色 `#9a520f`（棕色调）脱离蓝/绿/告警/暖纸色体系 | 引入了第 5 类色调，破坏视觉单一来源 | 改用 `var(--color-warning)` 或新增 `--color-warning-text` token（深告警文本） |
| P1 | ScenarioPage | `ScenarioPage.module.css:133,138,139` | `.metricCard.better/worse` 边框与背景硬编码 `#bed8ca` / `#f1d0a8` / `#fff7ea` | 与 OptionCard/ExplanationPanel 的告警/进度软色各写一套，不一致 | 并入 P1 第一条的 warning-soft / progress-soft / border token 体系 |
| P2 | HomePage | `HomePage.module.css:59` | `.primaryBtn:hover` 硬编码 `#1838b8`（主色深变体） | 主色 hover 色无 token，未来 darken 计算无统一来源 | tokens.css 加 `--color-primary-hover: #1838b8;` |
| P2 | ScenariosPage / ScenarioPage | `ScenariosPage.module.css:54` `ScenarioPage.module.css:72` | `.stats strong` / `.headerMeta strong` 用 `var(--font-serif)` 显示统计大数字 | design.md §2「序号、进度、标签、元信息、技术标记使用 mono」——大数字指标应用 mono，serif 用于标题 | 改用 `var(--font-mono)`（与 HomePage `.progressNum` 一致） |
| P2 | tokens.css + 全部组件 | `tokens.css`（缺 spacing） | 所有 `.module.css` 的 padding/margin/gap 都是魔法数字（28/30/14/16/18/22/26/34/36…） | 间距无尺度，组件间不易对齐 | 增补 spacing token（如 `--space-2/3/4/6/8`），下一轮 polish 逐步替换 |
| P2 | OptionCard / ExplanationPanel / DecisionGuideSection | `OptionCard.module.css:30,35` 等 | correct/wrong/ok/warn 边框用 `rgba(46,125,88,*)` / `rgba(232,148,58,*)` 硬编码透明度 | 与 token 体系脱节 | 随 P1 warning/progress border token 一并收口 |
| P2 | ScenarioPage | `ScenarioPage.module.css:297` | `.optionActive` 用 `box-shadow: inset 0 0 0 1px var(--color-primary)` 模拟内描边 | 不算强阴影，但属于「用 shadow 当 border」的写法，design.md 倾向 border 优先 | 可保留；如要更克制，改 `border-color: var(--color-primary)` + `border-width: 2px` |
| P3 | ScenariosPage | `ScenariosPage.module.css:82-86` | `.filters button:hover, .activeFilter` 用三个 `!important` 压样式 | 维护成本高，且非必要 | 提高 selector 特异性去掉 `!important` |
| P3 | global.css | `global.css:34` | `::selection { background: #dfe3fb; }` 硬编码 | 选择高亮色未 token 化 | 加 `--color-selection: #dfe3fb;` |

## 5. 视觉规范对齐评估

- **背景与主色**：**守住**。页面级（HomePage / ConceptPage / ScenariosPage / ScenarioPage / Sidebar / BottomNav / Header）全部通过 `var(--color-bg)` `var(--color-primary)` `var(--color-progress)` 消费，未发现华为红、霓虹、渐变光效。动画画布深色属 design.md §4 明确允许。唯一缺口是 `ProfilePage.danger` 引入棕色文本 `#9a520f`（P1），以及告警软背景 `#fff5e8`/`#fff7ea` 与动画配色未 token 化（P1 系统性）。
- **字体层级（serif/sans/mono）**：**基本守住，存在 2 处错位**。全局 `global.css` 把 h1–h4 设为 serif、code/kbd 设为 mono，正确。HomePage/Sidebar/ConceptPage/Header 的序号、标签、进度数字均用 mono ✓。错位点：`ScenariosPage.stats strong` 与 `ScenarioPage.headerMeta strong` 用 serif 显示统计大数字（P2），与 design.md §2「指标用 mono」不一致，且与 HomePage `.progressNum` 用 mono 不一致。
- **卡片/边框/阴影/圆角**：**克制，合规**。圆角统一走 `var(--radius)` (6px) / `var(--radius-lg)` (8px)，符合 design.md §5「6–8px」。卡片走 border 优先（`1px solid var(--color-border)`），无强阴影堆叠。ConceptPage 用左侧 3px 蓝竖线强调定义，符合 design.md §4。唯一边界案例：ScenarioPage 三栏 workspace + 多 panel 是全站最接近 dashboard 的页面，但仍以 border + 行分割为主，未越线。
- **非 dashboard 化（首页）**：**守住**。HomePage 第一屏只有 hero（eyebrow + headline + lede + 双按钮）+ 一行简洁进度，六大模块和推荐路径下沉到滚动后；进度面板用行分割而非卡片堆叠；完全符合 design.md §4/§6/§8。
- **新页面（ScenariosPage/ScenarioPage）视觉语言一致性**：**基本一致，有局部新写法**。两个新页面复用了既有语言：mono + uppercase 的小标签（`Scenario Library` / `Scenario Exercise`，与 ConceptHeader `.module` 一致）、主色 3px 竖线 led、`var(--color-primary-soft)` + `var(--color-primary-border)` 的 pill 样式、`var(--radius-lg)` panel 卡片。不一致点：(1) `metricCard.worse` 另写了一套 `#fff7ea`/`#f1d0a8` 告警配色（P1）；(2) `.stats strong` 用 serif 显示数字（P2）；(3) ScenarioPage 三栏 workspace 是全站唯一的「多 panel 同屏」布局，虽克制但建议在 design.md 补一条「场景演练页例外」说明，避免后续被当作先例扩散到其他页面。

## 6. 发布建议

### 6.1 发布前必须修
- **无 P0，无强制阻断项**。可按当前状态发布。

### 6.2 可发布但需记录（建议在下一轮 polish 收口）
1. **[P1] 告警软背景 token 化**：tokens.css 加 `--color-warning-soft` / `--color-warning-border`，替换 OptionCard / ExplanationPanel / ProfilePage / ScenarioPage 共 5 处硬编码。
2. **[P1] 动画画布配色 token 化**：tokens.css 加 `--anim-canvas-bg/text/primary/progress/warning/muted` 系列，统一 10 个动画组件。这是最大体量工作，建议单开一个 polish 回合。
3. **[P1] ProfilePage `.danger button` 文本色 `#9a520f` 改回告警体系**（改为 `var(--color-warning)` 或新增 `--color-warning-text`）。
4. **[P1] ScenarioPage metricCard better/worse 配色并入 token 体系**（随 6.2.1 一并）。
5. **[P2] HomePage 主按钮 hover 色 `#1838b8` token 化**（`--color-primary-hover`）。
6. **[P2] ScenariosPage/ScenarioPage 统计大数字 serif → mono**，与 HomePage `.progressNum` 对齐。

### 6.3 后续 polish
1. **[P2] tokens.css 增补 spacing scale**（`--space-2/3/4/6/8`），逐步替换全站魔法数字。
2. **[P2] OptionCard / ExplanationPanel / DecisionGuideSection 的 `rgba(46,125,88,*)` / `rgba(232,148,58,*)` 边框**：随 warning/progress border token 一并替换。
3. **[P3] 去掉 ScenariosPage `.filters` 的 3 个 `!important`**，改用 selector 特异性。
4. **[P3] global.css `::selection` 背景 token 化**。
5. **[文档] 在 design.md 补一条「场景演练页允许三栏 workspace」的例外说明**，避免被当作通用先例。

---

## 原则遵循自检

1. ✅ 未做大改版建议，所有建议都给出最小修复方向。
2. ✅ 每条问题都带 `文件:行号`。
3. ✅ 视觉建议全部对齐 design.md §2/§4/§8 与 AGENTS.md §5，未引入个人审美。
4. ✅ 硬编码色值用 Grep 工具生成（§3），未手工逐文件读。
