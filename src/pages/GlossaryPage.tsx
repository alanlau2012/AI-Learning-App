import { Link } from 'react-router-dom';
import { capabilityDomainLabels } from '../data/capabilityDomains';
import { concepts } from '../data/concepts';
import { glossary } from '../data/glossary';
import { modules } from '../data/modules';
import styles from './GlossaryPage.module.css';

const moduleById = new Map(modules.map((module) => [module.id, module]));
const conceptById = new Map(concepts.map((concept) => [concept.id, concept]));

export function GlossaryPage() {
  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <span>Glossary</span>
        <h1>术语索引</h1>
        <p>按模块、能力域和易混点组织核心术语，关联到已有知识点。</p>
        <div className={styles.headerRule} aria-hidden />
      </section>

      <section className={styles.list}>
        {glossary.map((term, index) => (
          <article key={term.id} className={styles.term}>
            <span className={styles.termIdx}>{String(index + 1).padStart(2, '0')}</span>
            <div className={styles.termBody}>
              <span className={styles.module}>{moduleById.get(term.moduleId)?.title}</span>
              <h2>{term.name}</h2>
              <p className={styles.en}>{term.enName}</p>
              <p>{term.definition}</p>
              {term.capabilityDomains && term.capabilityDomains.length > 0 && (
                <div className={styles.domainBadges} aria-label="能力域">
                  {term.capabilityDomains.map((domain) => (
                    <span key={domain}>{capabilityDomainLabels[domain]}</span>
                  ))}
                </div>
              )}
              {term.confusedWith && term.confusedWith.length > 0 && (
                <div className={styles.confusion}>
                  <h3>常被混淆</h3>
                  <ul>
                    {term.confusedWith.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className={styles.related} aria-label="相关知识点">
              {term.relatedConceptIds.map((id) => {
                const concept = conceptById.get(id);
                if (!concept) return null;
                const decisionHash = concept.decisionGuide ? '#decision-guide' : '';
                return (
                  <Link
                    key={id}
                    to={`/concepts/${concept.slug}${decisionHash}`}
                    title={concept.decisionGuide ? '跳转到知识点的工程决策章节' : '跳转到知识点'}
                  >
                    {concept.title}
                  </Link>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default GlossaryPage;
