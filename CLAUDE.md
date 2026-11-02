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
