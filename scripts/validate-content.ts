/**
 * 内容结构门禁（分级 validate:*）。
 *
 * - structure          (P1.5 起始终)：56 登记 / 模块计数 10/10/8/16/6/6 / id·slug 唯一 /
 *                      moduleId·order 合法 / modules.conceptIds 一致 / 关联无悬空 /
 *                      contentStatus 合法 / 诊断题结构。不碰动画、不要求 stub 正文。
 * - published-content  (有 demo/mvp 内容后)：字段完整度（docs/content-schema.md §6.2）。
 * - animation          (P3 起)：动画一致性与注册（§6.3）。
 *
 * 用法：
 *   node scripts/validate-content.ts structure
 *   node scripts/validate-content.ts published-content
 *   node scripts/validate-content.ts animation
 *   node scripts/validate-content.ts all      （= 当前阶段应启用的子命令聚合）
 *
 * 仅读取 src/data/*；失败即非零退出，作为入库 / 发布门禁。
 */
import { concepts } from '../src/data/concepts.ts';
import { modules } from '../src/data/modules.ts';
import { glossary } from '../src/data/glossary.ts';

const MODULE_IDS = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'] as const;
const EXPECTED_COUNTS: Record<string, number> = {
  m1: 10,
  m2: 10,
  m3: 8,
  m4: 16,
  m5: 6,
  m6: 6,
};
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const VALID_STATUS = new Set(['stub', 'demo', 'mvp']);

const errors: string[] = [];
const fail = (msg: string): void => {
  errors.push(msg);
};

function validateStructure(): void {
  // 1. 总数 + 模块计数
  if (concepts.length !== 56) {
    fail(`知识点总数应为 56，实际 ${concepts.length}`);
  }
  const byModule = new Map<string, typeof concepts>();
  for (const id of MODULE_IDS) byModule.set(id, []);
  for (const c of concepts) {
    if (!byModule.has(c.moduleId)) {
      fail(`${c.id}: moduleId 非法 "${c.moduleId}"`);
      continue;
    }
    byModule.get(c.moduleId)!.push(c);
  }
  for (const id of MODULE_IDS) {
    const list = byModule.get(id)!;
    if (list.length !== EXPECTED_COUNTS[id]) {
      fail(`模块 ${id} 应有 ${EXPECTED_COUNTS[id]} 个知识点，实际 ${list.length}`);
    }
  }

  // 2. id / slug 唯一、kebab-case、slug === id
  const idSeen = new Set<string>();
  const slugSeen = new Set<string>();
  for (const c of concepts) {
    if (idSeen.has(c.id)) fail(`id 重复：${c.id}`);
    idSeen.add(c.id);
    if (slugSeen.has(c.slug)) fail(`slug 重复：${c.slug}`);
    slugSeen.add(c.slug);
    if (c.slug !== c.id) fail(`${c.id}: slug 应等于 id（当前 slug="${c.slug}"）`);
    if (!KEBAB.test(c.id)) fail(`${c.id}: id 不符合 kebab-case`);
  }

  // 4. 每模块 order 从 1 起连续、唯一
  for (const id of MODULE_IDS) {
    const orders = byModule
      .get(id)!
      .map((c) => c.order)
      .sort((a, b) => a - b);
    for (let i = 0; i < orders.length; i++) {
      if (i > 0 && orders[i] === orders[i - 1]) {
        fail(`模块 ${id} order 重复：${orders[i]}`);
      }
      if (orders[i] !== i + 1) {
        fail(`模块 ${id} order 不连续（排序后 ${orders.join(',')}）`);
        break;
      }
    }
  }

  // 3. modules.conceptIds 与该模块概念集合及 order 完全一致
  const conceptIdSet = new Set(concepts.map((c) => c.id));
  for (const m of modules) {
    if (!(MODULE_IDS as readonly string[]).includes(m.id)) {
      fail(`module id 非法：${m.id}`);
    }
    const expected = byModule
      .get(m.id)!
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((c) => c.id);
    const actual = m.conceptIds;
    if (actual.length !== expected.length) {
      fail(`模块 ${m.id} conceptIds 数量不符（期望 ${expected.length}，实际 ${actual.length}）`);
    } else {
      for (let i = 0; i < expected.length; i++) {
        if (actual[i] !== expected[i]) {
          fail(`模块 ${m.id} conceptIds 第 ${i + 1} 项不符（期望 ${expected[i]}，实际 ${actual[i]}）`);
          break;
        }
      }
    }
    for (const cid of actual) {
      if (!conceptIdSet.has(cid)) fail(`模块 ${m.id} conceptIds 指向不存在的知识点：${cid}`);
    }
  }

  // 5. 关联无悬空（概念 / 诊断题 / 术语）
  for (const c of concepts) {
    for (const rid of c.relatedConceptIds) {
      if (!conceptIdSet.has(rid)) fail(`${c.id}.relatedConceptIds 悬空：${rid}`);
    }
    if (c.diagnosticQuestion) {
      for (const rid of c.diagnosticQuestion.relatedConceptIds) {
        if (!conceptIdSet.has(rid)) fail(`${c.id} 诊断题 relatedConceptIds 悬空：${rid}`);
      }
    }
  }
  for (const g of glossary) {
    for (const rid of g.relatedConceptIds) {
      if (!conceptIdSet.has(rid)) fail(`术语 ${g.id} relatedConceptIds 悬空：${rid}`);
    }
  }

  // 6. contentStatus 合法
  for (const c of concepts) {
    if (!VALID_STATUS.has(c.contentStatus)) {
      fail(`${c.id}: contentStatus 非法 "${c.contentStatus}"`);
    }
  }

  // 7. 诊断题结构（存在时）
  for (const c of concepts) {
    const q = c.diagnosticQuestion;
    if (!q) continue;
    const optIds = new Set(q.options.map((o) => o.id));
    if (q.options.length < 2) fail(`${c.id} 诊断题选项少于 2`);
    for (const cid of q.correctOptionIds) {
      if (!optIds.has(cid)) fail(`${c.id} 诊断题 correctOptionIds 不在选项内：${cid}`);
    }
    if (q.type === 'single' && q.correctOptionIds.length !== 1) {
      fail(`${c.id} 单选题 correctOptionIds 应为 1 个（实际 ${q.correctOptionIds.length}）`);
    }
    if (q.type === 'multiple' && q.correctOptionIds.length < 1) {
      fail(`${c.id} 多选题 correctOptionIds 应不少于 1`);
    }
  }
}

// ---- 调度 ----
const cmd = process.argv[2] ?? 'all';
const runStructure = cmd === 'structure' || cmd === 'all';
const runPublished = cmd === 'published-content' || cmd === 'all';
const runAnimation = cmd === 'animation' || cmd === 'all';

console.log(`validate:content — 子命令：${cmd}`);

if (runStructure) validateStructure();

if (runPublished) {
  const n = concepts.filter((c) => c.contentStatus === 'demo' || c.contentStatus === 'mvp').length;
  console.log(
    n === 0
      ? '  [published-content] 当前无 demo/mvp 内容，跳过完整性校验。'
      : `  [published-content] demo/mvp 共 ${n} 个，完整性校验（§6.2）待后续阶段实现。`,
  );
}

if (runAnimation) {
  console.log('  [animation] 动画 registry 尚未落地（P3），跳过。');
}

if (errors.length > 0) {
  console.error(`\n失败：${errors.length} 个问题`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

if (runStructure) {
  console.log('\n通过：内容结构校验（56 登记 / 模块计数 10/10/8/16/6/6 / 唯一性 / 关联无悬空 / contentStatus / 诊断题结构）。');
}
process.exit(0);
