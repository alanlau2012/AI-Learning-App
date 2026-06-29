/**
 * 轻量场景导航索引。
 *
 * 布局层只需要场景标题生成面包屑，不应因此把完整场景演练数据打进首屏 bundle。
 */
export const scenarioTitleById: Record<string, string> = {
  'model-router': '模型路由策略失效诊断',
  'token-cost-spike': 'Token 成本异常飙升诊断',
  'rag-answer-quality': 'RAG 答案质量下降诊断',
  'agent-tool-failure': 'Agent 工具调用失败诊断',
  'trace-not-diagnostic': 'Trace 有记录但无法诊断',
};
