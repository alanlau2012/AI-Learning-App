import styles from './StudyStats.module.css';

interface StudyStatsProps {
  completed: number;
  total: number;
  favorites: number;
  wrongQuestions: number;
  streakDays: number;
}

export function StudyStats({
  completed,
  total,
  favorites,
  wrongQuestions,
  streakDays,
}: StudyStatsProps) {
  const stats = [
    { label: '已掌握', value: `${completed}/${total}` },
    { label: '收藏', value: favorites },
    { label: '错题', value: wrongQuestions },
    { label: '连续学习', value: streakDays },
  ];

  return (
    <div className={styles.stats}>
      {stats.map((item) => (
        <div key={item.label} className={styles.item}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default StudyStats;
