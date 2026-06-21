import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { concepts } from '../data/concepts';
import { modules } from '../data/modules';
import { ConceptHeader } from '../components/concept/ConceptHeader';
import { ConceptSection, EmptySectionHint } from '../components/concept/ConceptSection';
import { RelatedConcepts } from '../components/concept/RelatedConcepts';
import { TakeawayBox } from '../components/concept/TakeawayBox';
import { AnimationPlayer } from '../components/animation/AnimationPlayer';
import { DiagnosticQuestion } from '../components/quiz/DiagnosticQuestion';
import { useProgressStore } from '../store/progressStore';
import { getOrderedPublishedConcepts, isPublishedConcept } from '../utils/progress';
import styles from './ConceptPage.module.css';

const orderedPublishedConcepts = getOrderedPublishedConcepts();

export function ConceptPage() {
  const { slug } = useParams();
  const concept = concepts.find((x) => x.slug === slug);
  const module = concept ? modules.find((x) => x.id === concept.moduleId) : undefined;
  const completedConceptIds = useProgressStore((s) => s.completedConceptIds);
  const favoriteConceptIds = useProgressStore((s) => s.favoriteConceptIds);
  const toggleComplete = useProgressStore((s) => s.toggleComplete);
  const toggleFavorite = useProgressStore((s) => s.toggleFavorite);
  const recordVisit = useProgressStore((s) => s.recordVisit);

  useEffect(() => {
    if (concept && isPublishedConcept(concept)) recordVisit(concept.id);
  }, [concept, recordVisit]);

  if (!concept) {
    return (
      <main className={styles.page}>
        <Link to="/modules" className={styles.back}>
          ← 返回模块
        </Link>
        <h1>知识点不存在</h1>
        <p className={styles.empty}>请从模块页选择一个有效知识点。</p>
      </main>
    );
  }

  const completed = completedConceptIds.includes(concept.id);
  const favorite = favoriteConceptIds.includes(concept.id);
  const conceptIndex = orderedPublishedConcepts.findIndex((item) => item.id === concept.id);
  const nextConcept =
    conceptIndex >= 0 ? orderedPublishedConcepts[conceptIndex + 1] : orderedPublishedConcepts[0];
  const hasEnterpriseCase = Object.values(concept.enterpriseCase).some(Boolean);

  return (
    <main className={styles.page}>
      {module && (
        <Link to={`/modules/${module.id}`} className={styles.back}>
          ← {module.title}
        </Link>
      )}

      <ConceptHeader
        concept={concept}
        module={module}
        completed={completed}
        favorite={favorite}
        onToggleComplete={() => toggleComplete(concept.id)}
        onToggleFavorite={() => toggleFavorite(concept.id)}
      />

      <section className={styles.definition}>
        <span>一句话定义</span>
        <p>{concept.definition || '内容草稿待审核入库，当前先保留知识点结构。'}</p>
      </section>

      <ConceptSection index={1} title="为什么重要">
        {concept.whyItMatters ? <p>{concept.whyItMatters}</p> : <EmptySectionHint />}
      </ConceptSection>

      <ConceptSection index={2} title="心智模型" tone="soft">
        {concept.mentalModel ? <p>{concept.mentalModel}</p> : <EmptySectionHint />}
      </ConceptSection>

      <ConceptSection index={3} title="机制讲解">
        {concept.mechanism.length > 0 ? (
          <ol className={styles.mechanism}>
            {concept.mechanism.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {item}
              </li>
            ))}
          </ol>
        ) : (
          <EmptySectionHint />
        )}
      </ConceptSection>

      <ConceptSection index={4} title="动画演示">
        {concept.animation ? (
          <AnimationPlayer key={concept.id} config={concept.animation} />
        ) : (
          <p className={styles.empty}>当前知识点暂无动画配置。</p>
        )}
      </ConceptSection>

      <ConceptSection index={5} title="企业案例" tone="soft">
        {hasEnterpriseCase ? (
          <div className={styles.case}>
            {concept.enterpriseCase.title && <h3>{concept.enterpriseCase.title}</h3>}
            {concept.enterpriseCase.scenario && <p><strong>场景：</strong>{concept.enterpriseCase.scenario}</p>}
            {concept.enterpriseCase.problem && <p><strong>问题：</strong>{concept.enterpriseCase.problem}</p>}
            {concept.enterpriseCase.analysis && <p><strong>分析：</strong>{concept.enterpriseCase.analysis}</p>}
            {concept.enterpriseCase.solution && <p><strong>方案：</strong>{concept.enterpriseCase.solution}</p>}
            {concept.enterpriseCase.takeaway && <p><strong>结论：</strong>{concept.enterpriseCase.takeaway}</p>}
          </div>
        ) : (
          <EmptySectionHint />
        )}
      </ConceptSection>

      <ConceptSection index={6} title="常见误区">
        {concept.pitfalls.length > 0 ? (
          <ul className={styles.list}>
            {concept.pitfalls.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <EmptySectionHint />
        )}
      </ConceptSection>

      <ConceptSection index={7} title="诊断题">
        {concept.diagnosticQuestion ? (
          <DiagnosticQuestion question={concept.diagnosticQuestion} />
        ) : (
          <p className={styles.empty}>当前知识点暂无诊断题。</p>
        )}
      </ConceptSection>

      <ConceptSection index={8} title="核心结论">
        <TakeawayBox items={concept.keyTakeaways} />
      </ConceptSection>

      <ConceptSection index={9} title="关联知识点">
        <RelatedConcepts conceptIds={concept.relatedConceptIds} concepts={concepts} />
      </ConceptSection>

      <footer className={styles.footer}>
        <button
          type="button"
          className={completed ? `${styles.primary} ${styles.done}` : styles.primary}
          onClick={() => toggleComplete(concept.id)}
        >
          {completed ? '取消完成' : '完成学习'}
        </button>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => toggleFavorite(concept.id)}
        >
          {favorite ? '取消收藏' : '收藏'}
        </button>
        {nextConcept && (
          <Link to={`/concepts/${nextConcept.slug}`} className={styles.next}>
            下一个 · {nextConcept.title} →
          </Link>
        )}
      </footer>
    </main>
  );
}

export default ConceptPage;
