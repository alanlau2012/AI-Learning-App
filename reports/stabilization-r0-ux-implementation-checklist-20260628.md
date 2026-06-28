# Stabilization R0 UX 低风险实现检查清单（2026-06-28）

> 角色：ux-accessibility-qa-agent  
> 范围：基于 GitHub issue #44 #45 #46 #47 #49 #50 #51 #52，为主控提供低风险实现检查清单和验收用例。  
> 边界：本报告只新增 QA/派发文档，不修改业务代码；当前工作区存在其他未提交/未跟踪审计产物，不能回退或整理他人修改。

## 1. 结论先行

- **建议执行顺序**：先修 #44 + #52，再修 #45，再修 #46/#47，最后顺手收口 #49/#50/#51。
- **发布阻断**：#44 是唯一 P0；#52 是 #44 的底部安全区补丁，应与 #44 同一 PR/同一验证闭环处理。
- **低风险原则**：只改布局容器、空态、ARIA 属性、焦点样式、确认提示；不改数据 schema、不改场景数据、不改进度存储结构、不引入新依赖。
- **验收底线**：移动端 `390x844` 不横向滚动，BottomNav 全宽贴底或位于主列底部，Tab 焦点可见，诊断题提交后读屏可获知对错结果。

## 2. Issue 到实现面的映射

| Issue | 优先级 | 当前证据 | 最小实现点 | 不要扩大到 |
|---|---|---|---|---|
| #44 BottomNav 与 main 横排争宽 | P0 | `AppShell.tsx` 中 `BottomNav` 是 `.shell` 第三个子项；`.shell` 默认 flex-row；`BottomNav.module.css` 仅移动端 `display:flex` | 让移动端 BottomNav 不再与 `.main` 横向并列：优先移动到 `.main` 内底部，或用 fixed 全宽底栏 | 不重做整体导航、不改 Sidebar 信息架构 |
| #52 主内容区未为 BottomNav 预留底部空间 | P2 | `.content { padding-bottom: 24px }`，BottomNav 高 56px | 移动端给 `.content` 增加至少 `72px` 底部空间，兼容 safe area 时可用 `calc(72px + env(safe-area-inset-bottom))` | 不逐页补 padding，避免分散维护 |
| #45 ScenariosPage 筛选零结果无空态 | P1 | `visibleScenarios.map(...)` 为空时只渲染空 grid | 当 `visibleScenarios.length === 0` 时显示空态文案和「清除筛选」按钮 | 不新增搜索、不改变排序、不新增场景 |
| #46 全站缺统一 `:focus-visible` | P1 | `global.css` 只有基础 button 样式，无全局焦点环 | 在 `global.css` 增加统一 `:focus-visible`；覆盖 `a/button/[tabindex]` 等常见可聚焦元素 | 不逐组件散落焦点样式，不引入复杂 focus trap |
| #47 ExplanationPanel 无 `aria-live` | P1 | `ExplanationPanel.tsx` 根节点是普通 `div` | 给解析面板根节点加 `role="status"`、`aria-live="polite"`，必要时 `aria-atomic="true"` | 不改诊断题逻辑、不改变正确/错误判定 |
| #49 ScenariosPage 筛选缺 `aria-pressed` | P2 | 筛选按钮只靠 class 表达选中态 | 给「全部」和能力域按钮补 `aria-pressed={...}` | 不把筛选改成复杂表单 |
| #50 ScenarioPage 策略选项缺 `aria-pressed` | P2 | 策略按钮只靠 `.optionActive` 表达选中态 | 给策略按钮补 `aria-pressed={active}` | 不改 `fieldset/legend`，它们当前是正确语义 |
| #51 ScenarioPage 恢复基线无确认 | P2 | `resetScenario` 直接重置策略选择 | 在执行前加轻量确认；文案明确会清空当前策略选择 | 不新增 modal 框架；本轮可接受 `window.confirm` |

## 3. 推荐实现切片

### Slice A：移动端布局闭环（#44 + #52）

**建议改动**

1. 将 `BottomNav` 移入 `.main` 内，位于 `<main className={styles.content}>` 后面；或保持 JSX 不变但在移动端将 `.shell` 改为 column 并确保 `.main` 占满宽度。
2. `BottomNav.module.css` 移动端需明确 `width: 100%`；若采用 fixed，需加 `left/right/bottom` 或 `inset-inline: 0; bottom: 0`。
3. `AppShell.module.css` 在 `@media (max-width: 960px)` 下为 `.content` 预留底部空间，至少大于 BottomNav 高度。

**验收用例**

| 用例 | 步骤 | 通过标准 |
|---|---|---|
| A1 移动端布局 | 打开 `/`，视口 `390x844` | 页面无横向滚动；主内容宽度约等于视口宽；BottomNav 四项完整显示 |
| A2 场景页底部 | 打开 `/scenarios/model-router` 或任一存在场景，滚动到底部 | 底部操作区/复盘操作不被 BottomNav 遮挡 |
| A3 导航状态 | 在移动端点击 首页/场景/搜索/我的 | 路由切换正常；当前项仍有可见选中态；桌面端 BottomNav 不显示 |
| A4 窄桌面回归 | 视口 `1024x768` | Sidebar/主内容仍按桌面或窄桌面预期工作，无 BottomNav 抢宽 |

### Slice B：场景目录空态（#45）

**建议改动**

1. 在 `ScenariosPage.tsx` 中，当 `visibleScenarios.length === 0` 时渲染空态。
2. 空态包含三部分：标题「没有匹配的场景」、简短说明、按钮「清除筛选」。
3. 清除按钮调用 `setSelectedDomain('all')`。

**验收用例**

| 用例 | 步骤 | 通过标准 |
|---|---|---|
| B1 空态出现 | 临时选择一个无匹配能力域，或用测试数据制造零结果 | 不出现空白区域；能看到明确无结果提示 |
| B2 清除筛选 | 在空态点击「清除筛选」 | 列表恢复全部场景；筛选按钮「全部」变为选中态 |
| B3 非空回归 | 正常选择有匹配场景的能力域 | 场景卡片仍完整显示；链接跳转不变 |

### Slice C：全站焦点可见（#46）

**建议改动**

1. 在 `src/styles/global.css` 增加全局焦点样式，例如：

```css
:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}
```

2. 若个别按钮因背景色导致焦点不清楚，可用 `box-shadow` 辅助，但本轮不逐组件深修。

**验收用例**

| 用例 | 步骤 | 通过标准 |
|---|---|---|
| C1 首页 Tab | 从地址栏后按 Tab 遍历首页主要链接/按钮 | 每个可聚焦元素都有清晰焦点环 |
| C2 场景目录 Tab | 打开 `/scenarios`，Tab 到筛选按钮和场景卡片 | 筛选按钮、卡片链接焦点可见 |
| C3 场景详情 Tab | 打开任一 `/scenarios/:id`，Tab 到策略按钮和提交/恢复按钮 | 策略按钮焦点可见，不只依赖 hover |
| C4 搜索/Profile 回归 | 打开 `/search`、`/profile` 做基本 Tab | 既有搜索焦点样式不被破坏；按钮焦点一致 |

### Slice D：诊断题解析读屏反馈（#47）

**建议改动**

1. 在 `ExplanationPanel.tsx` 根节点增加 `role="status" aria-live="polite" aria-atomic="true"`。
2. 保持当前「判断正确 / 判断需要修正」文案不变，因为它已经是清晰的非视觉状态。

**验收用例**

| 用例 | 步骤 | 通过标准 |
|---|---|---|
| D1 正确答案 | 进入任一有诊断题的概念页，选择正确选项并提交 | 解析面板出现；DOM 上有 `role="status"` 和 `aria-live="polite"` |
| D2 错误答案 | 选择错误选项并提交 | 同样播报「判断需要修正」路径；视觉状态不回退 |
| D3 样式回归 | 对比提交前后布局 | 解析面板样式、间距、列表不变 |

### Slice E：筛选和策略选中语义（#49 + #50）

**建议改动**

1. `ScenariosPage.tsx`：筛选按钮增加 `aria-pressed={selectedDomain === 'all'}` 或 `aria-pressed={selectedDomain === domain}`。
2. `ScenarioPage.tsx`：策略按钮增加 `aria-pressed={active}`。
3. 保留现有 `.activeFilter` / `.optionActive` 视觉样式。

**验收用例**

| 用例 | 步骤 | 通过标准 |
|---|---|---|
| E1 场景筛选语义 | 检查 `/scenarios` 筛选按钮 DOM | 当前筛选按钮 `aria-pressed="true"`；其他为 `false` |
| E2 策略语义 | 检查 `/scenarios/:id` 策略按钮 DOM | 每组策略只有当前选项 `aria-pressed="true"` |
| E3 交互回归 | 点击不同筛选/策略按钮 | 视觉选中态和 `aria-pressed` 同步变化 |

### Slice F：恢复基线确认（#51）

**建议改动**

1. `resetScenario` 执行前增加确认：

```ts
if (!window.confirm('恢复基线会清空当前策略选择，是否继续？')) return;
```

2. 确认通过后保持原逻辑：重置策略、隐藏复盘。

**验收用例**

| 用例 | 步骤 | 通过标准 |
|---|---|---|
| F1 取消恢复 | 改动任一策略，点击「恢复基线」，选择取消 | 当前策略选择保持不变；复盘状态不被清空 |
| F2 确认恢复 | 同上，选择确认 | 策略恢复默认；复盘面板隐藏 |
| F3 已完成场景 | 已完成场景中点击恢复 | 不影响 `completedScenarioIds`，只影响当前策略选择 |

## 4. 主控验收总清单

### 静态检查

- [ ] `AppShell.tsx` / CSS 中 BottomNav 不再作为移动端横向争宽项。
- [ ] 移动端 `.content` 底部空间大于 BottomNav 高度。
- [ ] `ScenariosPage.tsx` 有零结果空态和清除筛选动作。
- [ ] 所有场景筛选按钮有 `aria-pressed`。
- [ ] 所有场景策略按钮有 `aria-pressed`。
- [ ] `ExplanationPanel.tsx` 根节点有 `role="status"`、`aria-live="polite"`。
- [ ] `global.css` 有统一 `:focus-visible`，且不使用低对比颜色。
- [ ] 「恢复基线」有确认，不影响完成状态和复盘队列状态。

### 工程门禁

建议主控要求开发完成后运行：

```bash
cmd /c npm run typecheck
cmd /c npm run lint
cmd /c npm run build
```

本批只改 UI/ARIA/布局，不涉及内容 schema；`validate:content` 可作为全量发布门禁保留，但不是这些 issue 的直接风险面。

### 浏览器验收视口

- [ ] 桌面：`1440x900`
- [ ] 窄桌面：`1024x768`
- [ ] 移动端：`390x844`
- [ ] 可选补充：`375x667`

### 浏览器路径

- [ ] `/`
- [ ] `/scenarios`
- [ ] 任一 `/scenarios/:id`，建议覆盖 `model-router` 和 `token-cost-spike`
- [ ] 任一有诊断题的 `/concepts/:slug`
- [ ] `/search`
- [ ] `/profile`

## 5. 回归风险提示

- **最高风险**：#44 若只给 BottomNav 加 `width:100%`，但仍留在 flex-row `.shell` 下，可能仍与 `.main` 横向并列；验收必须看真实移动端宽度，而不是只看 CSS 是否出现 `width:100%`。
- **次高风险**：#46 的全局焦点环可能被组件内 `outline: none` 或背景色吞掉；验收必须实际 Tab。
- **读屏相关事实**：#47 的 `aria-live` 只能保证动态区域具备播报语义；是否被具体读屏软件播报，仍需真实辅助技术抽测。
- **建议不做**：不要把 #51 升级为自定义 Modal；本轮用 `window.confirm` 更低风险，后续 inclusive dialog 可另排 polish。

## 6. GitHub issue 关闭建议

每个 issue 关闭前建议附同一格式证据：

1. 代码位置：列出修改文件。
2. 命令门禁：贴 `typecheck / lint / build` 结果。
3. 浏览器证据：说明视口、路径和通过现象。
4. 对 #44/#52：必须明确 `390x844` 无横向滚动、BottomNav 不遮挡底部操作。

---

本报告基于当前本地文件与 `gh issue view #44 #45 #46 #47 #49 #50 #51 #52` 的 OPEN 状态生成；未修改业务代码。
