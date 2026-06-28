# Stabilization R1 Browser Regression（2026-06-28）

> 目标：验证 R1 修复后的 Glossary IA、Search Esc 行为、动画画布 token 化与移动端布局。
> 环境：`cmd /c npm run build` 后 `npm run preview -- --host 127.0.0.1 --port 4173`。

## 1. 结论

- **PASS**：未发现白屏、console error、移动端横向溢出或动画画布缺失。
- `/glossary`：`Embedding`、`RAG`、`Model Routing` 均显示“术语索引项”，且存在“主关联讲”入口。
- `/search`：从首页按 `/` 进入后，按 `Esc` 返回首页；直接打开 `/search` 后，按 `Esc` 也回到首页。
- `/concepts/kv-cache`：动画画布可见，尺寸大于最小验收阈值。

## 2. 覆盖项

| 路径 | 视口 | 验收点 | 结果 |
|---|---:|---|---|
| `/glossary` | 1440x900 | 3 个术语索引项、3 个主关联讲 | PASS |
| `/` -> `/search` | 1440x900 | `/` 快捷键进入搜索，`Esc` 关闭搜索返回首页 | PASS |
| `/search` | 1440x900 | 直接访问后 `Esc` 回首页，不跳站外历史 | PASS |
| `/concepts/kv-cache` | 1440x900 | 动画画布非空且可见 | PASS |
| `/glossary` | 390x844 | 无横向溢出 | PASS |

## 3. 证据

- Playwright CLI `run-code` 返回：

```json
{"glossaryIndexNotes":3,"primaryLinks":3,"screenshots":2}
```

- 运行期截图（本地 QA 临时目录，默认不纳入源码提交）：
  - `output/qa/stabilization-r1-20260628/kv-cache-animation.png`
  - `output/qa/stabilization-r1-20260628/mobile-glossary.png`

## 4. 备注

- Playwright CLI 首次运行时安装了 `chrome-for-testing`，未修改项目依赖。
- 临时脚本与截图仅作为本地 QA 证据，不纳入源码提交。
