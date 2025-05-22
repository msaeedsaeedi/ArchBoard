---
name: New Feature
about: Feature template for proposing new features
title: "[Feature] {Feature Name}"
labels: feature
assignees: ''

---

**As a** {user role, e.g., registered user, board owner, collaborator}\
**I need** {what the user needs to do}\
**So that** {why the user needs to do it}

## Details and Assumptions

- {Brief description of the feature, e.g., what it does, key inputs/outputs}
- NestJS API: {Role of NestJS, e.g., specific endpoint, validation, or logic}
- Supabase: {Role of Supabase, e.g., auth, database, real-time, storage}
- UI: Angular with PrimeNg {specific components, e.g., p-inputText, p-table}
- {Any other assumptions, e.g., permissions, error handling}

## Acceptance Criteria

```gherkin
Feature: {Feature Name} with Supabase and NestJS

Scenario: {Main success scenario}
Given {context, e.g., user is logged in}
When {action the user takes}
Then {expected outcome}

Scenario: {Key failure or edge case}
Given {context}
When {action}
Then {error outcome or alternative behavior}
```

## Implementation Notes

- NestJS endpoint: {e.g., `POST /endpoint`, `GET /endpoint/:id`}
- Supabase: {e.g., table name, query, or auth method}
- {Other technical details, e.g., validation, schema, real-time subscription}
- PrimeNg: {specific components, e.g., `p-button`, `p-dialog`}
- {Additional notes, e.g., Angular routing, accessibility}
