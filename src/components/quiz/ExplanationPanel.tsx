import type { DiagnosticQuestion } from '../../types';
import styles from './ExplanationPanel.module.css';

interface ExplanationPanelProps {
  question: DiagnosticQuestion;
  correct: boolean;
}

export function ExplanationPanel({ question, correct }: ExplanationPanelProps) {
  return (
    <div
      className={correct ? `${styles.panel} ${styles.ok}` : `${styles.panel} ${styles.warn}`}
      role="status"
      aria-live="polite"
    >
      <strong>{correct ? '判断正确' : '判断需要修正'}</strong>
      <p>{question.explanation}</p>
      <h4>推荐排查路径</h4>
      <ol>
        {question.troubleshootingPath.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  );
}

export default ExplanationPanel;
