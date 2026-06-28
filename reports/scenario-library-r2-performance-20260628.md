# Scenario Library R2 Performance — 2026-06-28

## 结论

性能预算 PASS。新增场景目录页保持路由级 lazy loading；主入口 chunk 未触发 Vite 500KB warning。

## 构建摘要

命令：`cmd /c npm run build`

- `index-UAU0SNXz.js`：302.81 kB，gzip 96.89 kB
- `scenarioExercises-BeqBwDxT.js`：73.18 kB，gzip 20.34 kB
- `ScenariosPage-B_EiQmFK.js`：2.75 kB，gzip 1.27 kB
- `ScenarioPage-BI9x7Uyu.js`：23.16 kB，gzip 7.51 kB
- `ProfilePage-aA3d9fvK.js`：12.25 kB，gzip 3.50 kB

## 判断

- `/scenarios` 作为独立 lazy route，不进入主入口页面组件。
- 场景数据随相关页面 chunk 加载，未被 Sidebar / BottomNav 拉入首包。
- 新增 `UserProgress` 字段只影响轻量 store 和 progressCore，不引入全量课程正文。

## 残余风险

- 场景数量继续增长后，`scenarioExercises` chunk 会继续变大；超过 10 个场景时建议按场景族或详情页拆数据。
