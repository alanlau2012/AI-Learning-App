# Phase 2 DEV-06 Scenario Simulation Summary

Date: 2026-06-25

## Scope

Implemented pure frontend simulation logic for the `model-router` scenario exercise.

Changed files:

- `src/utils/scenarioSimulation.ts`
- `reports/phase2-dev06-simulation-summary.md`

No changes were made to `src/data/scenarioExercises.ts`, `src/types/index.ts`, UI components, routes, or `progressStore`.

## Public API

`src/utils/scenarioSimulation.ts` exports:

- `initializeScenarioState(exercise, selectedStrategies?)`
- `applyStrategyChange(exercise, state, change)`
- `runScenarioRound(exercise, stateOrSelection?)`
- `evaluateScenarioStrategy(exercise, stateOrSelection?)`
- `deriveScenarioReview(exercise, result, eventId?)`

Main exported data shapes:

- `ScenarioSimulationState`
- `ScenarioStrategySelection`
- `ScenarioStrategyChange`
- `ScenarioModelChoice`
- `ScenarioRequestBreakdown`
- `ScenarioModelLoad`
- `ScenarioReviewSignal`
- `ScenarioSimulationResult`
- `ScenarioReviewResult`

## Algorithm

The simulation is deterministic and does not use randomness.

Routing:

- Normalizes selected strategies against `exercise.baseline.selectedStrategies`.
- Evaluates the existing `StrategyOption.routingRules`.
- Applies deterministic priority: task routing, context/SLA routing, then risk routing.
- Chooses one primary model per request type and carries an optional fallback model.
- Produces per-request model choice, applied strategy options, and decision reasons.

Metrics:

- `costPer1kRequests`: weighted by request volume, input tokens, primary model cost, and fallback cost.
- `p95LatencyMs`: estimated from selected model latency, queue pressure, context pressure, and escalation chain.
- `successRate`: derived from model quality, task quality need, context fit, and fallback policy.
- `escalationRate`: derived from fallback mode plus context, quality, risk, and strict guard pressure.
- `riskInterceptRate`: derived from model risk handling and guard policy.
- `qualityComplaintRate`: derived from quality gap, context mismatch, and exposed failure risk.

Coverage:

- Quality, SLA, cost, risk, permission/sensitive-action handling, fallback/escalation, and queue pressure are all represented in the output.
- `activeEvents`, `reviewSignals`, and `recommendations` are derived for later DEV-07/08 UI use.

## Validation

Commands run:

- `cmd /c npx tsc --ignoreConfig --noEmit --target es2023 --lib ES2023,DOM --module esnext --moduleResolution bundler --strict --skipLibCheck --verbatimModuleSyntax --moduleDetection force src/utils/scenarioSimulation.ts` - PASS
- `cmd /c npx eslint src/utils/scenarioSimulation.ts` - PASS
- `cmd /c npm run validate:content` - PASS
- `cmd /c npm run typecheck` - BLOCKED by existing `src/utils/progress.ts(701,1): error TS1005: '}' expected.`

The project-level typecheck blocker is in a file that was already modified before DEV-06 work began; DEV-06 did not edit it.

## DEV-07/08 UI handoff

Recommended UI integration:

- Use `initializeScenarioState` for baseline state.
- Call `applyStrategyChange` on each control interaction.
- Call `runScenarioRound` or `evaluateScenarioStrategy` after each change.
- Render `metrics` as the top metric row.
- Render `requestBreakdowns` as the request-type routing table.
- Render `modelLoad` as queue/capacity hints.
- Render `activeEvents`, `reviewSignals`, and `deriveScenarioReview(...)` in the diagnosis/review panel.
