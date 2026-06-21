import type { DiagnosticOption } from '../../types';
import styles from './OptionCard.module.css';

interface OptionCardProps {
  option: DiagnosticOption;
  selected: boolean;
  submitted: boolean;
  correct: boolean;
  onToggle: () => void;
}

export function OptionCard({
  option,
  selected,
  submitted,
  correct,
  onToggle,
}: OptionCardProps) {
  const stateClass = submitted
    ? correct
      ? styles.correct
      : selected
        ? styles.wrong
        : ''
    : selected
      ? styles.selected
      : '';

  return (
    <button
      type="button"
      className={`${styles.option} ${stateClass}`}
      onClick={onToggle}
      disabled={submitted}
      aria-pressed={selected}
    >
      <span className={styles.id}>{option.id.toUpperCase()}</span>
      <span>{option.text}</span>
    </button>
  );
}

export default OptionCard;
