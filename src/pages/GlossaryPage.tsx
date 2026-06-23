import { Link } from 'react-router-dom';
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
        <p>基础版术语列表，关联到已有知识点。</p>
        <div className={styles.headerRule} aria-hidden />
      </section>

      <section className={styles.list}>
        {glossary.map((term, index) => (
          <article key={term.id} className={styles.term}>
            <span className={styles.termIdx}>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <span className={styles.module}>{moduleById.get(term.moduleId)?.title}</span>
              <h2>{term.name}</h2>
              <p className={styles.en}>{term.enName}</p>
              <p>{term.definition}</p>
            </div>
            <div className={styles.related}>
              {term.relatedConceptIds.map((id) => {
                const concept = conceptById.get(id);
                if (!concept) return null;
                return (
                  <Link key={id} to={`/concepts/${concept.slug}`}>
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
