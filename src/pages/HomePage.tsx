/**
 * 首页（design.md §4 / product-spec §4.1）。
 * 第一屏只有一个核心动作：继续学习。六大模块/推荐路径下沉到滚动后。
 * 模块卡只做入口（标题 + done/total），不堆统计、不做 dashboard。
 */
import { Link, useNavigate } from 'react-router-dom';
import { modules } from '../data/modules';
import { concepts } from '../data/concepts';
import { useProgressStore } from '../store/progressStore';
import {
  getFirstPublishedConceptIdByModule,
  getContinueLearningConceptId,
  moduleProgress,
  overallProgress,
} from '../utils/progress';
import { ProgressBar } from '../components/progress/ProgressBar';
import styles from './HomePage.module.css';

const conceptById = new Map(concepts.map((c) => [c.id, c]));

// 首页露出 4 条推荐路径（product-spec §5）
const RECOMMENDED_PATHS = [
  { moduleId: 'm1', name: '入门路径', desc: '模型怎么工作' },
  { moduleId: 'm2', name: '工程路径', desc: '推理系统与 MaaS' },
  { moduleId: 'm4', name: '应用路径', desc: 'Agent、上下文与 Skill' },
  { moduleId: 'm6', name: '负责人路径', desc: '成本、评测、治理与组织' },
];

export function HomePage() {
  const navigate = useNavigate();
  const completedConceptIds = useProgressStore((s) => s.completedConceptIds);
  const favoriteConceptIds = useProgressStore((s) => s.favoriteConceptIds);
  const studyStreakDays = useProgressStore((s) => s.studyStreakDays);
  const lastVisitedConceptId = useProgressStore((s) => s.lastVisitedConceptId);

  const overall = overallProgress(completedConceptIds);
  const completedSet = new Set(completedConceptIds);
  const continueId = getContinueLearningConceptId({
    completedConceptIds,
    favoriteConceptIds,
    wrongQuestionIds: [],
    lastVisitedConceptId,
    studyStreakDays,
  });
  const continueConcept = conceptById.get(continueId);

  return (
    <div className={styles.home}>
      {/* 第一屏：主标题 + 继续学习 */}
      <section className={styles.hero}>
        <span className={styles.eyebrow}>交互式知识系统</span>
        <h1 className={styles.headline}>
          从模型原理
          <br />
          到 Agent 工厂
        </h1>
        <p className={styles.lede}>
          把 AI 应用工程的关键知识点，从「听过概念」提升到能解释机制、能判断方案、
          能诊断问题、能指导落地。
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => navigate(`/concepts/${continueId}`)}
          >
            {continueConcept
              ? `继续学习 · ${continueConcept.title}`
              : '开始学习'}
            <span aria-hidden>→</span>
          </button>
          <Link to="/profile" className={styles.secondaryBtn}>
            查看我的学习
          </Link>
        </div>
      </section>

      {/* 简洁进度（不堆统计） */}
      <section className={styles.progressPanel}>
        <div className={styles.progressBig}>
          <span className={styles.progressNum}>
            {overall.done} / {overall.total}
          </span>
          <span className={styles.progressCaption}>已掌握知识点</span>
        </div>
        <ProgressBar percent={overall.percent} className={styles.progressbar} />
        <div className={styles.progressStats}>
          <span>{overall.percent}% 完成度</span>
          <span>{favoriteConceptIds.length} 收藏</span>
          <span>{studyStreakDays} 连续天数</span>
        </div>
      </section>

      {/* 推荐路径：露出 4 条，安静 */}
      <section className={styles.paths}>
        <h2 className={styles.sectionTitle}>推荐学习路径</h2>
        <div className={styles.pathGrid}>
          {RECOMMENDED_PATHS.map((p) => {
            const startConceptId = getFirstPublishedConceptIdByModule(p.moduleId);
            const startConcept = startConceptId ? conceptById.get(startConceptId) : undefined;

            if (!startConcept) {
              return (
                <div key={p.moduleId} className={`${styles.pathCard} ${styles.pathDisabled}`}>
                  <span className={styles.pathName}>{p.name}</span>
                  <span className={styles.pathDesc}>{p.desc}</span>
                  <span className={styles.pathMeta}>即将上线</span>
                </div>
              );
            }

            return (
              <Link key={p.moduleId} to={`/concepts/${startConcept.slug}`} className={styles.pathCard}>
                <span className={styles.pathName}>{p.name}</span>
                <span className={styles.pathDesc}>{p.desc}</span>
                <span className={styles.pathMeta}>从 {startConcept.title} 开始</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 六大模块：下沉到下方，仅入口 */}
      <section className={styles.modules}>
        <h2 className={styles.sectionTitle}>六大模块</h2>
        <div className={styles.moduleList}>
          {modules.map((m) => {
            const { done, total } = moduleProgress(m.id, completedSet);
            return (
              <Link key={m.id} to={`/modules/${m.id}`} className={styles.moduleRow}>
                <span className={styles.moduleIndex}>
                  {String(m.order).padStart(2, '0')}
                </span>
                <span className={styles.moduleBody}>
                  <span className={styles.moduleTitle}>{m.title}</span>
                  <span className={styles.moduleSubtitle}>{m.subtitle}</span>
                </span>
                <span className={styles.moduleDone}>
                  {done}/{total}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
