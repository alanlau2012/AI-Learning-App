import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { conceptById, concepts } from '../data/concepts';
import { getHyperframeMaterialsForConcept } from '../data/hyperframes';
import { modules } from '../data/modules';
import { scenarioExercises } from '../data/scenarioExercises';
import { ConceptHeader } from '../components/concept/ConceptHeader';
import { ConceptSection, EmptySectionHint } from '../components/concept/ConceptSection';
import { RelatedConcepts } from '../components/concept/RelatedConcepts';
import { TakeawayBox } from '../components/concept/TakeawayBox';
import { MechanismContent } from '../components/concept/MechanismContent';
import { RichText } from '../components/concept/RichText';
import { DecisionGuideSection } from '../components/concept/DecisionGuideSection';
import { AnimationPlayer } from '../components/animation/AnimationPlayer';
import { DiagnosticQuestion } from '../components/quiz/DiagnosticQuestion';
import { useProgressStore } from '../store/progressStore';
import { isPublishedConcept } from '../utils/progress';
import styles from './ConceptPage.module.css';

const orderedPublishedConcepts = modules
  .flatMap((module) => module.conceptIds)
  .map((id) => conceptById.get(id))
  .filter((concept): concept is (typeof concepts)[number] => Boolean(concept))
  .filter(isPublishedConcept);

const scenarioEntriesByConceptId = new Map<string, typeof scenarioExercises>();
scenarioExercises.forEach((scenario) => {
  const conceptIds = new Set([...scenario.entryConceptIds, ...scenario.relatedConceptIds]);
  conceptIds.forEach((conceptId) => {
    const existing = scenarioEntriesByConceptId.get(conceptId) ?? [];
    scenarioEntriesByConceptId.set(conceptId, [...existing, scenario]);
  });
});

export function ConceptPage() {
  const { slug } = useParams();
  const concept = concepts.find((x) => x.slug === slug);
  const module = concept ? modules.find((x) => x.id === concept.moduleId) : undefined;
  const completedConceptIds = useProgressStore((s) => s.completedConceptIds);
  const favoriteConceptIds = useProgressStore((s) => s.favoriteConceptIds);
  const reviewConceptIds = useProgressStore((s) => s.reviewConceptIds);
  const toggleComplete = useProgressStore((s) => s.toggleComplete);
  const toggleFavorite = useProgressStore((s) => s.toggleFavorite);
  const toggleReviewConcept = useProgressStore((s) => s.toggleReviewConcept);
  const recordVisit = useProgressStore((s) => s.recordVisit);

  useEffect(() => {
    if (concept && isPublishedConcept(concept)) recordVisit(concept.id);
  }, [concept, recordVisit]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [concept?.id]);

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
  const inReviewList = reviewConceptIds.includes(concept.id);
  const conceptIndex = orderedPublishedConcepts.findIndex((item) => item.id === concept.id);
  const previousConcept =
    conceptIndex > 0 ? orderedPublishedConcepts[conceptIndex - 1] : undefined;
  const nextConcept =
    conceptIndex >= 0 ? orderedPublishedConcepts[conceptIndex + 1] : orderedPublishedConcepts[0];
  const hasEnterpriseCase = Object.values(concept.enterpriseCase).some(Boolean);
  const hasDecisionGuide = Boolean(concept.decisionGuide);
  const sectionOffset = hasDecisionGuide ? 1 : 0;
  const conceptMaterials = getHyperframeMaterialsForConcept(concept.id);
  const conceptScenarios = scenarioEntriesByConceptId.get(concept.id) ?? [];

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
        <span className={styles.definitionLabel}>一句话定义</span>
        {concept.definition ? (
          <RichText text={concept.definition} className={styles.definitionText} />
        ) : (
          <p className={styles.definitionText}>内容草稿待审核入库，当前先保留知识点结构。</p>
        )}
      </section>

      {conceptMaterials.length > 0 && (
        <section className={styles.materialCallout} aria-label="相关机制短片">
          <div>
            <span className={styles.materialLabel}>机制短片</span>
            <h2>先看完整链路，再拆这一讲</h2>
            <p>{conceptMaterials[0].subtitle}</p>
          </div>
          <Link to={`/modules/${conceptMaterials[0].moduleId}#material-${conceptMaterials[0].id}`}>
            观看完整链路 →
          </Link>
        </section>
      )}

      {conceptScenarios.length > 0 && (
        <section className={styles.scenarioCallout} aria-label="场景演练">
          <div>
            <span className={styles.scenarioLabel}>场景演练</span>
            <h2>把这个知识点放进生产诊断</h2>
            <p>从相关场景进入，观察策略调整如何改变指标和复盘结论。</p>
          </div>
          <div className={styles.scenarioLinks}>
            {conceptScenarios.map((scenario) => (
              <Link key={scenario.id} to={`/scenarios/${scenario.id}`}>
                {scenario.title}
              </Link>
            ))}
          </div>
        </section>
      )}      <ConceptSection index={1} title="为什么重要">
        {concept.whyItMatters ? (
          <RichText text={concept.whyItMatters} />
        ) : (
          <EmptySectionHint />
        )}
      </ConceptSection>

      <ConceptSection index={2} title="心智模型" tone="soft">
        {concept.mentalModel ? (
          <RichText text={concept.mentalModel} />
        ) : (
          <EmptySectionHint />
        )}
      </ConceptSection>

      <ConceptSection index={3} title="机制讲解">
        {concept.mechanism.length > 0 ? (
          <MechanismContent mechanism={concept.mechanism} />
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
            {concept.enterpriseCase.scenario && (
              <p><strong>场景：</strong><RichText text={concept.enterpriseCase.scenario} as="span" /></p>
            )}
            {concept.enterpriseCase.problem && (
              <p><strong>问题：</strong><RichText text={concept.enterpriseCase.problem} as="span" /></p>
            )}
            {concept.enterpriseCase.analysis && (
              <p><strong>分析：</strong><RichText text={concept.enterpriseCase.analysis} as="span" /></p>
            )}
            {concept.enterpriseCase.solution && (
              <p><strong>方案：</strong><RichText text={concept.enterpriseCase.solution} as="span" /></p>
            )}
            {concept.enterpriseCase.takeaway && (
              <p><strong>结论：</strong><RichText text={concept.enterpriseCase.takeaway} as="span" /></p>
            )}
          </div>
        ) : (
          <EmptySectionHint />
        )}
      </ConceptSection>

      {concept.decisionGuide && (
        <ConceptSection index={6} title="工程决策">
          <DecisionGuideSection guide={concept.decisionGuide} conceptTitle={concept.title} />
        </ConceptSection>
      )}

      <ConceptSection index={6 + sectionOffset} title="常见误区">
        {concept.pitfalls.length > 0 ? (
          <ul className={styles.dashList}>
            {concept.pitfalls.map((item) => (
              <li key={item}>
                <RichText text={item} as="span" />
              </li>
            ))}
          </ul>
        ) : (
          <EmptySectionHint />
        )}
      </ConceptSection>

      <ConceptSection index={7 + sectionOffset} title="诊断题">
        {concept.diagnosticQuestion ? (
          <DiagnosticQuestion question={concept.diagnosticQuestion} />
        ) : (
          <p className={styles.empty}>当前知识点暂无诊断题。</p>
        )}
      </ConceptSection>

      <ConceptSection index={8 + sectionOffset} title="核心结论">
        <TakeawayBox items={concept.keyTakeaways} />
      </ConceptSection>

      <ConceptSection index={9 + sectionOffset} title="关联知识点">
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
        <button
          type="button"
          className={inReviewList ? `${styles.secondary} ${styles.reviewActive}` : styles.secondary}
          onClick={() => toggleReviewConcept(concept.id)}
        >
          {inReviewList ? '移出本周复盘' : '加入本周复盘'}
        </button>
        {(previousConcept || nextConcept) && (
          <nav className={styles.lessonNav} aria-label="知识点前后导航">
            {previousConcept && (
              <Link to={`/concepts/${previousConcept.slug}`} className={styles.previous}>
                ← 上一个 · {previousConcept.title}
              </Link>
            )}
            {nextConcept && (
              <Link to={`/concepts/${nextConcept.slug}`} className={styles.next}>
                下一个 · {nextConcept.title} →
              </Link>
            )}
          </nav>
        )}
      </footer>
    </main>
  );
}

export default ConceptPage;
