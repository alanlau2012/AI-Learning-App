/**
 * 左侧稳定锚点（design.md §5）。
 * 产品名 + 56讲/MVP 标签 + 一级导航（首页/我的学习/搜索）+ 六大模块树导航 + 底部总进度。
 * 当前导航项/模块/知识点淡蓝底；模块进度用低对比 mono 文本。
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { conceptTitleById } from '../../data/conceptNav';
import { modules } from '../../data/modules';
import { useProgressStore } from '../../store/progressStore';
import { moduleProgress, overallProgress } from '../../utils/progressCore';
import { ProgressBar } from '../progress/ProgressBar';
import { primaryNavItems } from './navItems';
import styles from './Sidebar.module.css';

const moduleIdByConceptId = new Map(
  modules.flatMap((module) => module.conceptIds.map((conceptId) => [conceptId, module.id])),
);

function getRouteContext(pathname: string) {
  const moduleMatch = pathname.match(/^\/modules\/([^/]+)$/);
  if (moduleMatch) {
    return { activeModuleId: moduleMatch[1], activeConceptId: undefined };
  }

  const conceptMatch = pathname.match(/^\/concepts\/([^/]+)$/);
  if (conceptMatch) {
    const conceptId = decodeURIComponent(conceptMatch[1]);
    return {
      activeModuleId: moduleIdByConceptId.get(conceptId),
      activeConceptId: conceptId,
    };
  }

  return { activeModuleId: undefined, activeConceptId: undefined };
}

export function Sidebar() {
  const location = useLocation();
  const completedConceptIds = useProgressStore((s) => s.completedConceptIds);
  const completedSet = new Set(completedConceptIds);
  const overall = overallProgress(completedConceptIds);
  const activeConceptRef = useRef<HTMLAnchorElement | null>(null);
  const { activeModuleId, activeConceptId } = useMemo(
    () => getRouteContext(location.pathname),
    [location.pathname],
  );
  const [manualExpandedModuleIds, setManualExpandedModuleIds] = useState<Set<string>>(
    () => new Set(),
  );
  const expandedModuleIds = useMemo(
    () => new Set([
      ...manualExpandedModuleIds,
      ...(activeModuleId ? [activeModuleId] : []),
    ]),
    [activeModuleId, manualExpandedModuleIds],
  );

  useEffect(() => {
    activeConceptRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeConceptId]);

  function toggleModule(moduleId: string) {
    if (moduleId === activeModuleId) return;
    setManualExpandedModuleIds((current) => {
      const next = new Set(current);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandName}>AI 应用工程</div>
        <div className={styles.brandTags}>
          <span className={styles.tag}>56 讲</span>
          <span className={styles.tag}>MVP · v1</span>
        </div>
      </div>

      <nav className={styles.primaryNav}>
        {primaryNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.sectionLabel}>模块</div>
      <nav className={styles.moduleNav}>
        {modules.map((m) => {
          const { done, total } = moduleProgress(m.id, completedSet);
          const isExpanded = expandedModuleIds.has(m.id);
          const isActiveModule = activeModuleId === m.id;
          return (
            <div key={m.id} className={styles.moduleGroup}>
              <div className={styles.moduleHeader}>
                <button
                  type="button"
                  className={styles.moduleToggle}
                  aria-label={
                    isActiveModule
                      ? `${m.title}为当前模块，保持展开`
                      : isExpanded
                        ? `收起${m.title}`
                        : `展开${m.title}`
                  }
                  aria-expanded={isExpanded}
                  disabled={isActiveModule}
                  onClick={() => toggleModule(m.id)}
                >
                  <span aria-hidden="true">{isExpanded ? '−' : '+'}</span>
                </button>
                <NavLink
                  to={`/modules/${m.id}`}
                  className={
                    isActiveModule
                      ? `${styles.moduleItem} ${styles.moduleItemActive}`
                      : styles.moduleItem
                  }
                >
                  <span className={styles.moduleOrder}>
                    {String(m.order).padStart(2, '0')}
                  </span>
                  <span className={styles.moduleTitle}>{m.title}</span>
                  <span className={styles.moduleCount}>
                    {done}/{total}
                  </span>
                </NavLink>
              </div>

              {isExpanded && (
                <div className={styles.conceptTree}>
                  {m.conceptIds.map((conceptId, conceptIndex) => {
                    const isActiveConcept = activeConceptId === conceptId;
                    const isCompleted = completedSet.has(conceptId);
                    return (
                      <NavLink
                        key={conceptId}
                        ref={isActiveConcept ? activeConceptRef : undefined}
                        to={`/concepts/${conceptId}`}
                        className={
                          isActiveConcept
                            ? `${styles.conceptItem} ${styles.conceptItemActive}`
                            : styles.conceptItem
                        }
                      >
                        <span className={styles.conceptOrder}>
                          {String(conceptIndex + 1).padStart(2, '0')}
                        </span>
                        <span className={styles.conceptTitle}>
                          {conceptTitleById[conceptId] ?? conceptId}
                        </span>
                        {isCompleted && (
                          <span className={styles.conceptDone} aria-label="已完成">
                            ✓
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <ProgressBar
          percent={overall.percent}
          label={`总进度 · ${overall.done} / ${overall.total}`}
        />
      </div>
    </aside>
  );
}

export default Sidebar;
