import { useEffect, useRef, useState } from 'react';
import type {
  ArchitectureTradeoffDimension,
  ChecklistItem,
  ChecklistPhase,
  DecisionGuide,
  ReviewQuestion,
} from '../../types';
import styles from './DecisionGuideSection.module.css';

const TRADEOFF_LABELS: Record<ArchitectureTradeoffDimension, string> = {
  cost: '成本',
  latency: '延迟',
  quality: '质量',
  reliability: '可靠性',
  observability: '可观测性',
  security: '安全',
  operability: '运维',
};

const CHECKLIST_PHASES: Array<{ phase: ChecklistPhase; label: string }> = [
  { phase: 'beforeBuild', label: '设计前' },
  { phase: 'beforeLaunch', label: '上线前' },
  { phase: 'running', label: '运行中' },
];

type CopyTarget = 'questions' | 'checklist';
type CopyStatus = 'idle' | 'copied' | 'failed';

interface DecisionGuideSectionProps {
  guide: DecisionGuide;
  conceptTitle: string;
}

function formatReviewQuestions(conceptTitle: string, questions: ReviewQuestion[]) {
  const lines = [`评审问题：${conceptTitle}`, ''];

  questions.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.question}`);
    lines.push(`   为什么问：${item.whyAsk}`);
    lines.push(`   好答案信号：${item.goodAnswerSignals.join('；')}`);
    lines.push('');
  });

  return lines.join('\n').trim();
}

function formatImplementationChecklist(conceptTitle: string, checklist: ChecklistItem[]) {
  const lines = [`落地清单：${conceptTitle}`, ''];

  CHECKLIST_PHASES.forEach(({ phase, label }) => {
    const items = checklist.filter((item) => item.phase === phase);
    if (items.length === 0) return;

    lines.push(`[${label}]`);
    items.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.item}`);
      lines.push(`   通过信号：${item.passSignal}`);
    });
    lines.push('');
  });

  return lines.join('\n').trim();
}

async function writeClipboardText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();

  const copied = document.execCommand('copy');
  document.body.removeChild(textArea);

  if (!copied) {
    throw new Error('Clipboard copy failed');
  }
}

export function DecisionGuideSection({ guide, conceptTitle }: DecisionGuideSectionProps) {
  const [copyStatus, setCopyStatus] = useState<Record<CopyTarget, CopyStatus>>({
    questions: 'idle',
    checklist: 'idle',
  });
  const resetTimers = useRef<Partial<Record<CopyTarget, number>>>({});

  useEffect(() => {
    const timers = resetTimers.current;
    return () => {
      Object.values(timers).forEach((timer) => {
        if (timer !== undefined) window.clearTimeout(timer);
      });
    };
  }, []);

  const copyText = async (target: CopyTarget, text: string) => {
    if (resetTimers.current[target] !== undefined) {
      window.clearTimeout(resetTimers.current[target]);
    }

    try {
      await writeClipboardText(text);
      setCopyStatus((current) => ({ ...current, [target]: 'copied' }));
    } catch {
      setCopyStatus((current) => ({ ...current, [target]: 'failed' }));
    }

    resetTimers.current[target] = window.setTimeout(() => {
      setCopyStatus((current) => ({ ...current, [target]: 'idle' }));
      resetTimers.current[target] = undefined;
    }, 1600);
  };

  const checklistByPhase = CHECKLIST_PHASES.map(({ phase, label }) => ({
    phase,
    label,
    items: guide.implementationChecklist.filter((item) => item.phase === phase),
  })).filter((group) => group.items.length > 0);

  return (
    <div className={styles.root}>
      <section className={styles.executiveBrief} aria-labelledby="decision-executive-title">
        <div>
          <span className={styles.eyebrow}>负责人摘要</span>
          <h3 id="decision-executive-title">{guide.executiveExplanation.summary}</h3>
        </div>
        <dl className={styles.briefGrid}>
          <div>
            <dt>业务价值</dt>
            <dd>{guide.executiveExplanation.businessValue}</dd>
          </div>
          <div>
            <dt>主要风险</dt>
            <dd>{guide.executiveExplanation.mainRisk}</dd>
          </div>
          <div>
            <dt>控制方式</dt>
            <dd>{guide.executiveExplanation.riskControl}</dd>
          </div>
        </dl>
      </section>

      <div className={styles.scenarioGrid}>
        <ScenarioList title="适用场景" items={guide.applicableScenarios} tone="positive" />
        <ScenarioList title="不适用场景" items={guide.nonApplicableScenarios} tone="caution" />
      </div>

      <section className={styles.block} aria-labelledby="decision-signals-title">
        <div className={styles.blockHeader}>
          <span className={styles.eyebrow}>Decision signals</span>
          <h3 id="decision-signals-title">决策信号</h3>
        </div>
        <div className={styles.signalList}>
          {guide.decisionSignals.map((signal) => (
            <article key={signal.id} className={styles.signalItem}>
              <div className={styles.signalHead}>
                <strong>{signal.metricOrFact}</strong>
                {signal.threshold && <span>{signal.threshold}</span>}
              </div>
              <p>{signal.interpretation}</p>
              <small>证据来源：{signal.evidenceSource}</small>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.block} aria-labelledby="decision-tradeoffs-title">
        <div className={styles.blockHeader}>
          <span className={styles.eyebrow}>Architecture tradeoffs</span>
          <h3 id="decision-tradeoffs-title">架构取舍</h3>
        </div>
        <div className={styles.tradeoffGrid}>
          {guide.tradeoffs.map((tradeoff) => (
            <article key={tradeoff.id} className={styles.tradeoffItem}>
              <span className={styles.badge}>{TRADEOFF_LABELS[tradeoff.dimension]}</span>
              <dl>
                <div>
                  <dt>收益</dt>
                  <dd>{tradeoff.gain}</dd>
                </div>
                <div>
                  <dt>代价</dt>
                  <dd>{tradeoff.cost}</dd>
                </div>
                <div>
                  <dt>盯防点</dt>
                  <dd>{tradeoff.watchOut}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.copyBlock} aria-labelledby="decision-questions-title">
        <CopyHeader
          id="decision-questions-title"
          eyebrow="Review checklist"
          title="评审问题"
          buttonLabel={copyStatus.questions === 'copied' ? '已复制' : '复制评审问题'}
          status={copyStatus.questions}
          onCopy={() =>
            copyText(
              'questions',
              formatReviewQuestions(conceptTitle, guide.reviewQuestions),
            )
          }
        />
        <ol className={styles.questionList}>
          {guide.reviewQuestions.map((item) => (
            <li key={item.id}>
              <strong>{item.question}</strong>
              <p>{item.whyAsk}</p>
              <ul>
                {item.goodAnswerSignals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.copyBlock} aria-labelledby="decision-checklist-title">
        <CopyHeader
          id="decision-checklist-title"
          eyebrow="Implementation checklist"
          title="落地清单"
          buttonLabel={copyStatus.checklist === 'copied' ? '已复制' : '复制落地清单'}
          status={copyStatus.checklist}
          onCopy={() =>
            copyText(
              'checklist',
              formatImplementationChecklist(conceptTitle, guide.implementationChecklist),
            )
          }
        />
        <div className={styles.checklistGroups}>
          {checklistByPhase.map((group) => (
            <div key={group.phase} className={styles.checklistGroup}>
              <span className={styles.phase}>{group.label}</span>
              <ul>
                {group.items.map((item) => (
                  <li key={item.id}>
                    <strong>{item.item}</strong>
                    <span>通过信号：{item.passSignal}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ScenarioList({
  title,
  items,
  tone,
}: {
  title: string;
  items: DecisionGuide['applicableScenarios'];
  tone: 'positive' | 'caution';
}) {
  return (
    <section
      className={`${styles.scenarioPanel} ${
        tone === 'positive' ? styles.positive : styles.caution
      }`}
      aria-label={title}
    >
      <h3>{title}</h3>
      <div className={styles.scenarioList}>
        {items.map((item) => (
          <article key={item.id} className={styles.scenarioItem}>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <ul>
              {item.signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function CopyHeader({
  id,
  eyebrow,
  title,
  buttonLabel,
  status,
  onCopy,
}: {
  id: string;
  eyebrow: string;
  title: string;
  buttonLabel: string;
  status: CopyStatus;
  onCopy: () => void;
}) {
  return (
    <div className={styles.copyHeader}>
      <div>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h3 id={id}>{title}</h3>
      </div>
      <div className={styles.copyControl}>
        <button type="button" className={styles.copyButton} onClick={onCopy}>
          {buttonLabel}
        </button>
        <span className={styles.copyStatus} aria-live="polite">
          {status === 'failed' ? '复制失败，请手动选择' : ''}
        </span>
      </div>
    </div>
  );
}

export default DecisionGuideSection;
