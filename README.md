# Svaraa Mobile

Expo + TypeScript (strict) + Expo Router. iOS, Android, web (caretaker screens only).
Rules for people and AI tools: [`CLAUDE.md`](CLAUDE.md). Plan: [`docs/frontend-plan.md`](docs/frontend-plan.md).

## Run

```bash
npm install
npm run web      # or: npm run ios / npm run android
```

The first screen is the component demo (`app/(dev)/components.tsx`): every component, in both themes and both languages.
Mocks are on by default (`EXPO_PUBLIC_USE_MOCKS=true`). Demo one-time code: `000000`.

## Checks (CI runs all of them)

```bash
npm run lint && npm run typecheck && npm test && npm run i18n:check && npm run build:web
```

## Folders

| Folder      | What                                                                     |
| ----------- | ------------------------------------------------------------------------ |
| `app/`      | Screens only                                                             |
| `features/` | auth, circles, devices, invites, consent, sos, settings                  |
| `services/` | api (generated client), mocks (MSW), storage; pendant, voice, push later |
| `ui/`       | tokens, caretaker + wearer themes, components                            |
| `i18n/`     | `en.json`, `hi.json`                                                     |
| `config/`   | env, feature flags                                                       |
| `docs/`     | plan, wireframes, UI guide, source documents                             |

## API client

`services/api/openapi.json` is a sample spec. When the backend publishes `/openapi.json`, replace the file and run `npm run api:generate`.
