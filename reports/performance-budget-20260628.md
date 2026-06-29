# Performance Budget Report — 2026-06-28

## 结论

性能 P1 已关闭。Sidebar / Home / Module 进度计算不再被动拉入全量 `concepts` 数据，生产构建不再出现 Vite 500KB warning。

## 关键改动

- 新增 `src/utils/progressCore.ts`：
  - 只承载 LocalStorage 迁移、轻量进度统计、模块进度、继续学习入口。
  - 依赖 `modules` 与轻量导航索引，不依赖全量课程正文。

- 调整 `src/utils/progress.ts`：
  - 保留 Profile/能力域/角色路径等需要全量课程数据的计算。
  - 轻量函数改从 `progressCore` 复用。

- 调整调用方：
  - `Sidebar`、`ModulesPage`、`progressStore` 改用 `progressCore`。
  - `HomePage` 只用 `conceptNav` 显示标题与继续学习链接。

## 构建证据

命令：`cmd /c npm run build`

最新构建结果：

- `dist/assets/index-Ut7FJfH-.js`：301.26 kB，gzip 96.63 kB
- `dist/assets/concepts-4HwrLUj2.js`：337.33 kB，gzip 111.84 kB
- `dist/assets/progress-DUU8L-Q7.js`：12.79 kB，gzip 4.68 kB
- 未出现 Vite 500KB warning

对比修复前现象：

- 主入口曾因全量内容数据进入首包触发不可解释的 500KB warning。
- 本轮拆分后，全量课程正文进入独立 lazy chunk。

## 残余风险

- 尚未设置正式 Lighthouse 指标预算。
- 下一轮若继续增加场景库与课程正文，需要关注 `concepts` chunk 与 `scenarioExercises` chunk 的增长趋势。
