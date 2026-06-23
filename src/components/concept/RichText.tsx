import type { ReactNode } from 'react';
import { parseRichText } from '../../utils/richText';
import styles from './RichText.module.css';

interface RichTextProps {
  text: string;
  as?: 'p' | 'span' | 'li';
  className?: string;
}

export function RichText({ text, as = 'p', className }: RichTextProps): ReactNode {
  const content = parseRichText(text);
  const Tag = as;

  if (as === 'span') {
    return <span className={className ?? styles.inline}>{content}</span>;
  }

  return <Tag className={className ?? styles.text}>{content}</Tag>;
}

export default RichText;
