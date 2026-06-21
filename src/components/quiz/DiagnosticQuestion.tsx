import { useState } from 'react';
import type { DiagnosticQuestion as DiagnosticQuestionData } from '../../types';
import { useProgressStore } from '../../store/progressStore';
import { ExplanationPanel } from './ExplanationPanel';
import { OptionCard } from './OptionCard';
import styles from './DiagnosticQuestion.module.css';

interface DiagnosticQuestionProps {
  question: DiagnosticQuestionData;
}

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((item) => set.has(item));
}

export function DiagnosticQuestion({ question }: DiagnosticQuestionProps) {
  const recordWrongQuestion = useProgressStore((s) => s.recordWrongQuestion);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const correct = sameSet(selected, question.correctOptionIds);

  function toggle(optionId: string) {
    if (submitted) return;
    if (question.type === 'single') {
      setSelected([optionId]);
      return;
    }
    setSelected((cur) =>
      cur.includes(optionId) ? cur.filter((id) => id !== optionId) : [...cur, optionId],
    );
  }

  function submit() {
    if (selected.length === 0) return;
    setSubmitted(true);
    if (!correct) recordWrongQuestion(question.id);
  }

  return (
    <div className={styles.question}>
      <div className={styles.prompt}>
        <span>{question.type === 'single' ? '单选诊断' : '多选诊断'}</span>
        <p>{question.scenario}</p>
        <h3>{question.question}</h3>
      </div>

      <div className={styles.options}>
        {question.options.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            selected={selected.includes(option.id)}
            submitted={submitted}
            correct={question.correctOptionIds.includes(option.id)}
            onToggle={() => toggle(option.id)}
          />
        ))}
      </div>

      {!submitted ? (
        <button
          type="button"
          className={styles.submit}
          onClick={submit}
          disabled={selected.length === 0}
        >
          提交判断
        </button>
      ) : (
        <ExplanationPanel question={question} correct={correct} />
      )}
    </div>
  );
}

export default DiagnosticQuestion;
