/**
 * 顶部工具条（design.md §5）。
 * breadcrumb + 搜索入口（按 / 唤起，点击/回车进 /search）+ 连续学习天数。
 * 高度约 56px，背景半透明 + blur。搜索逻辑（实时检索）属 P5，此处只做入口。
 */
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { concepts } from '../../data/concepts';
import { modules } from '../../data/modules';
import { useProgressStore } from '../../store/progressStore';
import styles from './Header.module.css';

const conceptById = new Map(concepts.map((c) => [c.id, c]));
const moduleById = new Map(modules.map((m) => [m.id, m]));

/** 根据当前路径生成轻量面包屑。 */
function buildBreadcrumb(pathname: string): string[] {
  if (pathname === '/') return ['首页'];
  if (pathname === '/modules') return ['模块'];
  const moduleMatch = pathname.match(/^\/modules\/([^/]+)$/);
  if (moduleMatch) {
    const m = moduleById.get(moduleMatch[1]);
    return m ? ['模块', m.title] : ['模块'];
  }
  const conceptMatch = pathname.match(/^\/concepts\/([^/]+)$/);
  if (conceptMatch) {
    const c = conceptById.get(conceptMatch[1]);
    return c ? ['知识点', c.title] : ['知识点'];
  }
  if (pathname === '/search') return ['搜索'];
  if (pathname === '/glossary') return ['术语'];
  if (pathname === '/profile') return ['我的学习'];
  return [];
}

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const studyStreakDays = useProgressStore((s) => s.studyStreakDays);
  const crumbs = buildBreadcrumb(location.pathname);

  // 全局快捷键：在非输入态按 / 唤起搜索。
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== '/') return;
      const el = document.activeElement;
      const tag = el?.tagName.toLowerCase();
      if (
        tag === 'input' ||
        tag === 'textarea' ||
        (el instanceof HTMLElement && el.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      navigate('/search');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  return (
    <header className={styles.header}>
      <nav className={styles.breadcrumb} aria-label="breadcrumb">
        {crumbs.map((c, i) => (
          <span key={i} className={styles.crumb}>
            {c}
          </span>
        ))}
      </nav>

      <button
        type="button"
        className={styles.searchBox}
        onClick={() => navigate('/search')}
        aria-label="搜索知识点"
      >
        <span className={styles.searchPlaceholder}>搜索知识点</span>
        <kbd className={styles.searchKey}>/</kbd>
      </button>

      <div className={styles.streak}>
        <span className={styles.streakNum}>{studyStreakDays}</span>
        <span className={styles.streakLabel}>连续学习</span>
      </div>
    </header>
  );
}

export default Header;
