# Contributing

Every change belongs to a ticket (FE-XX). The rules below are checked by Git hooks, so a wrong branch name or commit message is rejected on your machine before it reaches GitHub.

## Branches

`type/FE-XX-short-name`, all lowercase, words joined by `-`.

- Types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`
- Examples: `feat/FE-02-sign-in`, `fix/FE-03-otp-timer`
- `main` is the only other name allowed.

A Husky `pre-push` hook (`scripts/check-branch-name.sh`) rejects any other branch name.

## Commits

`type(FE-XX): message`

- Same types as branches. The ticket ID is required and goes in the brackets.
- Write the message in the imperative, with no full stop: `feat(FE-02): add phone sign-in`.
- Header at most 100 characters.
- Small commits: one change each.

A Husky `commit-msg` hook runs commitlint (`commitlint.config.js`) and rejects a message that breaks these rules, including one with no ticket ID.

## Pull requests

- Open one PR per ticket into `main`. The PR template (`.github/pull_request_template.md`) asks for:
  - **Ticket**
  - **What changed**
  - **Screenshots (EN + HI)**: the screen in English and in Hindi
  - **Mocked / pending backend**: anything running on mocks or with no backend yet (also add it to `docs/open-items.md`)
  - **Checklist**: tested on a phone (Expo Go), `npm run i18n:check` passes, tests pass
- CI (`.github/workflows/ci.yml`) must be green before merging.

## Before you push

```bash
npm run check          # lint, typecheck, tests, i18n:check
npm run format:check
```

## Project rules

See `CLAUDE.md`: use the words "caregiver" and "household", keep button size the same in both themes, put every string in `i18n/en.json` and `i18n/hi.json`, and use the real lowercase error codes from `docs/openapi.json`.
