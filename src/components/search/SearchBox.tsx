import { capabilityDomainLabels } from '../../data/capabilityDomains';
import type { CapabilityDomain } from '../../types';
import type { SearchDomainFilter } from '../../utils/search';
import styles from './SearchBox.module.css';

interface SearchBoxProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedDomain: SearchDomainFilter;
  onDomainChange: (domain: SearchDomainFilter) => void;
}

const domainOptions = Object.keys(capabilityDomainLabels) as CapabilityDomain[];

export function SearchBox({
  query,
  onQueryChange,
  selectedDomain,
  onDomainChange,
}: SearchBoxProps) {
  return (
    <section className={styles.box} aria-label="搜索与能力域过滤">
      <label className={styles.inputGroup}>
        <span>搜索知识点</span>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="输入 Token、KV Cache、TTFT..."
          autoFocus
        />
      </label>
      <div className={styles.domainGroup} aria-label="按能力域过滤">
        <button
          type="button"
          className={selectedDomain === 'all' ? styles.activeDomain : undefined}
          aria-pressed={selectedDomain === 'all'}
          onClick={() => onDomainChange('all')}
        >
          全部
        </button>
        {domainOptions.map((domain) => (
          <button
            key={domain}
            type="button"
            className={selectedDomain === domain ? styles.activeDomain : undefined}
            aria-pressed={selectedDomain === domain}
            onClick={() => onDomainChange(domain)}
          >
            {capabilityDomainLabels[domain]}
          </button>
        ))}
      </div>
    </section>
  );
}

export default SearchBox;
