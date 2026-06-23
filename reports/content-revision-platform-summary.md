# 正文改版 · 平台层摘要

**日期**：2026-06-23  
**权威样板**：`reviews/transformer-改版样板对比.html`

## Schema

- `MechanismGroup` / `MechanismContent` union（`src/types/index.ts`）
- `contentRevision?: 'legacy' | 'v2'`
- 规范文档：`docs/content-schema.md` §7

## 校验

- `npm run validate:terminology` — v2 术语 / 深度 / 轻量标记
- 聚合于 `npm run validate:content`

## 渲染

| 组件 | 路径 |
|------|------|
| RichText | `src/components/concept/RichText.tsx` |
| MechanismContent | `src/components/concept/MechanismContent.tsx` |
| 术语表 | `src/data/termCanonical.ts` |
| v2 合并 | `src/utils/applyV2Revisions.ts` |

## 全站 UI

- masthead + ink rule：ConceptHeader / HomePage / ModulePage / Glossary
- ledger-row：ConceptCard / Search / Glossary / Home 进度
- dash list：pitfalls / TakeawayBox
- soft 块去圆角：ConceptSection

## 验证

```
npm run validate:content  PASS
npm run typecheck           PASS
npm run lint                PASS
npm run build               PASS
```
