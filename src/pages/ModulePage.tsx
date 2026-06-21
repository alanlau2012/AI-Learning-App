/**
 * 模块详情（/modules/:moduleId）—— P3 实现（ConceptCard 列表 + 筛选/排序）。P2 先占位。
 */
import { useParams } from 'react-router-dom';
import { modules } from '../data/modules';
import { PagePlaceholder } from '../components/layout/PagePlaceholder';

export function ModulePage() {
  const { moduleId } = useParams();
  const m = modules.find((x) => x.id === moduleId);

  return (
    <PagePlaceholder
      stage="P3"
      title={m ? m.title : '模块详情'}
      intent={
        m
          ? `「${m.title}」的全部知识点卡片（含难度、时长、动画、完成与收藏）将在此展示，并支持筛选与排序。`
          : '该模块的知识点卡片列表将在此展示。'
      }
    />
  );
}

export default ModulePage;
