/**
 * 知识点详情（/concepts/:slug）—— P3 实现（12 段固定结构）。P2 先占位。
 * 进入真实详情页时由 ConceptPage 调用 recordVisit（记录 lastVisited / 连续天数）。
 */
import { useParams } from 'react-router-dom';
import { concepts } from '../data/concepts';
import { PagePlaceholder } from '../components/layout/PagePlaceholder';

export function ConceptPage() {
  const { slug } = useParams();
  const c = concepts.find((x) => x.id === slug);

  return (
    <PagePlaceholder
      stage="P3"
      title={c ? c.title : '知识点详情'}
      intent={
        c
          ? `「${c.title}」将按 12 段结构展开：定义 → 为什么重要 → 心智模型 → 机制 → 动画 → 企业案例 → 常见误区 → 诊断题 → 核心结论 → 关联 → 完成学习。`
          : '知识点详情将按固定 12 段结构展开。'
      }
    />
  );
}

export default ConceptPage;
