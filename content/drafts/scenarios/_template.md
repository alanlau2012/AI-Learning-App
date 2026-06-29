# Scenario Draft Template

## Metadata

- id:
- title:
- type:
- capabilityDomains:
- relatedConceptIds:
- entryConceptIds:
- difficulty:
- estimatedMinutes:

## Business Background

Include realistic scale or metrics. Do not include real customer, vendor pricing, or sensitive data.

## Initial Symptom

Describe the production symptom that starts the diagnosis.

## Facts

### Fact Group

- title:
- description:
- attributes:
- risks:

## Strategy Controls

### Control

- id:
- label:
- options:
  - id:
  - label:
  - description:
  - metricEffects:

## Metrics

- id:
- label:
- value:
- unit:
- polarity:
- min/max:
- explanation:

## Trigger Events

### Event

- id:
- title:
- symptom:
- triggerStrategyOptionIds:
- correctDiagnosis:
- investigationOrder:
- missedRisks:
- relatedConceptIds:
- nextStepRecommendations:

## Review Rubric

- prompt:
- requiredFindings:
- acceptableActions:
- nextStepRecommendations:

## Content Risk Self Check

- Is this a cross-concept engineering scenario instead of a single concept quiz?
- Are symptoms, metrics, and tradeoffs concrete enough to diagnose?
- Are all concept ids real?
- Is all data simulated and non-sensitive?