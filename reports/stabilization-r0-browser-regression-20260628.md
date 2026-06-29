# Stabilization R0 Browser Regression（2026-06-28）

> 验证对象：Stabilization R0 P0/P1 修复批次  
> 预览地址：`http://127.0.0.1:4173/`  
> 执行方式：`cmd /c npm run build` + `cmd /c npm run preview -- --host 127.0.0.1 --port 4173` + `playwright-cli`  
> 视口：移动端 `390x844`，桌面 `1440x900`

## 1. 结论

- 浏览器回归：**PASS**。
- 移动端 `/scenarios` 不再横向溢出，BottomNav 固定全宽。
- `/scenarios` 能触发零结果空态，并可清除筛选恢复列表。
- `/scenarios/model-router` 面包屑、策略按钮 `aria-pressed` 与恢复基线确认已验证。
- `/concepts/ttft` 诊断题提交后出现 `role="status"` + `aria-live="polite"` 解析面板。
- `/scenarios/agent-tool-failure` 深链与刷新均可用。

## 2. 验证项

| 项目 | 结果 | 证据 |
|---|---|---|
| 移动端 BottomNav 全宽 | PASS | `nav` rect = `x:0,width:390,height:56` |
| 移动端无横向溢出 | PASS | `scrollWidth=390, innerWidth=390` |
| ScenariosPage 筛选 `aria-pressed` | PASS | `全部` 初始 `aria-pressed=true` |
| ScenariosPage 零结果空态 | PASS | 选择 `模型机制理解` 后出现 `暂无匹配场景` |
| 清除筛选恢复列表 | PASS | 卡片数量恢复到 `>=5` |
| ScenarioPage 面包屑 | PASS | header 包含 `场景演练` |
| ScenarioPage 策略按钮状态 | PASS | `button[aria-pressed=true]` 数量 `4` |
| 恢复基线确认 | PASS | confirm 文案包含 `恢复基线` |
| 诊断题解析 aria-live | PASS | 提交后 `role=status aria-live=polite` 从 `0` 到 `1` |
| 新场景深链 | PASS | `/scenarios/agent-tool-failure` 加载成功 |
| 新场景刷新 | PASS | reload 后仍加载成功 |

## 3. 产物

- 截图：`output/qa/stabilization-r0-20260628/mobile-scenarios.png`
- 截图：`output/qa/stabilization-r0-20260628/mobile-scenario-detail.png`
- 临时 QA 脚本：`output/qa/stabilization-r0-20260628/run-*.js`

`output/qa/*` 为本地验证产物，不纳入源码提交。
