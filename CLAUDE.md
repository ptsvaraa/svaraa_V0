# Svaraa Mobile

Expo + TypeScript (strict) + Expo Router. iOS, Android, web (caregiver screens only).

Read docs/frontend-plan.md first. Screens in docs/svaraa-wireframes.html. Brand in docs/ui-guide/.

## Rules

- app/ = screens only. All API, pendant, voice and storage calls go through services/.
- No hard-coded text: every string in i18n/en.json and i18n/hi.json.
- Two themes: caregiver and wearer (larger text only; button size is the same in both).
- Server state: TanStack Query. App state: Zustand. Mocks: MSW.
- Mobile-only code in .native.ts, with a .web.ts stub.
- Small commits; run lint, typecheck and tests before finishing.
- Check docs/open-items.md before finishing a feature; add anything postponed there.

## Git and pull requests

- Branch names: `type/FE-XX-short-name` (types: feat, fix, chore, refactor, test, docs), e.g. `feat/FE-02-sign-in`. `main` is the only other allowed name. Checked by the pre-push hook.
- Commit messages: `type(FE-XX): message`, e.g. `feat(FE-02): add phone sign-in`. The ticket ID is required. Checked by the commit-msg hook (commitlint).
- One PR per ticket into `main`, using `.github/pull_request_template.md` (Ticket, What changed, Screenshots EN + HI, Mocked / pending backend, Checklist).
- Never skip the hooks (`--no-verify`). Full rules: CONTRIBUTING.md.
