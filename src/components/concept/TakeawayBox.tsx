import { RichText } from './RichText';
import styles from './TakeawayBox.module.css';

interface TakeawayBoxProps {
  items: string[];
}

export function TakeawayBox({ items }: TakeawayBoxProps) {
  if (items.length === 0) {
    return <p className={styles.empty}>核心结论待审核入库。</p>;
  }

  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item}>
          <RichText text={item} as="span" />
        </li>
      ))}
    </ul>
  );
}

export default TakeawayBox;
