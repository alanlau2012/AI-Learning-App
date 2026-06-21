import styles from './SearchBox.module.css';

interface SearchBoxProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function SearchBox({ query, onQueryChange }: SearchBoxProps) {
  return (
    <label className={styles.box}>
      <span>搜索知识点</span>
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="输入 Token、KV Cache、TTFT..."
        autoFocus
      />
    </label>
  );
}

export default SearchBox;
