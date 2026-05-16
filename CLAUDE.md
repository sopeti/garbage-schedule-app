# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### App (root)
```
npm start          # Expo dev server (scan QR with Expo Go)
npm run android    # launch on Android emulator
npm run ios        # launch on iOS simulator
npm run web        # launch in browser
```

### Pipeline (run from `pipeline/`)
```
cd pipeline
npm run run-all 13123    # fetch + parse via Claude API + validate + write TS file
npm run fetch 13123      # fetch raw HTML only (prints first 2000 chars)
npm run validate 13123   # validate existing JSON/TS output
```
The pipeline requires `ANTHROPIC_API_KEY` in the environment.

## Architecture

### Two independent packages
- **Root** — the Expo/React Native app. TypeScript, `expo-router` for file-based routing.
- **`pipeline/`** — a Node.js CLI (ESM, `tsx`) that scrapes municipal websites and uses the Claude API to parse HTML into structured schedule data. It has its own `package.json` and `node_modules` and is excluded from the app's `tsconfig.json`.

### Path alias
`@/*` maps to `src/*` (configured in `tsconfig.json` and resolved by Expo). All app imports use this alias.

### Data flow
1. **Municipality data** lives as hand-authored (or pipeline-generated) TypeScript files in `src/data/municipalities/jp/<prefecture>/<code>.ts`, each exporting a `Municipality` object.
2. **`src/data/municipalities/index.ts`** is the registry — the only place new municipalities are wired up. Add both the import and a `registry` entry here.
3. **`src/services/scheduleService.ts`** resolves `ScheduleRule` discriminated unions against a `Date` to produce `CollectionEvent[]`. This is the core domain logic.
4. **`src/services/notificationService.ts`** calls `scheduleService` to look ahead 30 days and schedules two `expo-notifications` triggers per collection event (20:00 the evening before, 07:00 the morning of). It is imported once in `app/_layout.tsx` to register the notification handler.
5. **`src/services/storageService.ts`** persists `UserLocation` (`{ municipalityCode, areaId }`) via `AsyncStorage`.
6. **`src/hooks/useLocation.ts`** composes storage + notification scheduling into a single hook used by all screens.

### Routing
`expo-router` file-based. Entry point is `app/_layout.tsx` (Stack). Tabs live under `app/(tabs)/` — two tabs only: `index` (Schedule) and `settings` (Settings/設定). A third tab was considered and deliberately dropped; the home screen already shows today, tomorrow, and an infinite-scroll upcoming calendar inline. `app/onboarding.tsx` is a modal presented when no location is stored.

### UI conventions
- Tab bar labels are language-aware via `useLanguage()` in `app/(tabs)/_layout.tsx`. The home tab is always labelled "Schedule" in both languages; the settings tab uses `t.locationSettings` ('設定' / 'Settings').
- All UI strings live in `src/i18n/translations.ts`. Do not hardcode user-visible English or Japanese strings elsewhere.
- Entrance animations use RN's built-in `Animated` API (not reanimated) — `FadeInView` in `index.tsx` handles staggered fade+slide. Keep new animated components consistent with this pattern.
- Haptic feedback (`expo-haptics`) is used on interactive selections in `onboarding.tsx`. Always guard with `Platform.OS !== 'web'` before calling Haptics — it is a no-op on web.
- The home screen supports pull-to-refresh via `RefreshControl` on the `FlatList`. The refresh increments `refreshKey` to recompute today's date.
- Loading state on the home screen shows a pulsing `SkeletonScreen` instead of plain text.

### `ScheduleRule` types
```
weekly        — every week on listed days
nth_weekday   — single occurrence, e.g. 1st Monday
nth_weekdays  — multiple occurrences, e.g. 1st & 3rd Friday
biweekly      — every other week (odd/even week-of-year)
by_appointment — never fires automatically
none          — never fires
```
`firesOnDate()` in `scheduleService.ts` is the single authoritative function for all rule types.

### Internationalisation (i18n)
Language support is Japanese (`ja`) and English (`en`).

- **`src/i18n/translations.ts`** — single source of all UI strings and notification templates, keyed by `Language = 'ja' | 'en'`. Add new strings here in both languages.
- **`src/contexts/LanguageContext.tsx`** — React context (`LanguageProvider`) that reads/writes the chosen language to AsyncStorage. Wrap with `useLanguage()` to get `{ lang, t, setLang }`.
- The language preference is stored under `user_language` in AsyncStorage (see `storageService.ts`).
- `scheduleNotificationsForLocation` in `notificationService.ts` takes a `language` parameter — it's passed from `useLocation` hook which reads `lang` from context.
- The language toggle is rendered in both `onboarding.tsx` and `settings.tsx`. Any new screen that needs translated text should call `useLanguage()`.

### Adding a new municipality
1. Write (or generate via pipeline) a `Municipality` TS file in `src/data/municipalities/jp/<prefecture>/<code>.ts`.
2. Import it and add it to `registry` in `src/data/municipalities/index.ts`.
3. Register a scraper in `pipeline/src/run.ts` (`SCRAPERS` and `PARSER_META` maps) if pipeline generation is needed.

### Known data issues
None outstanding. All 5 zones verified as of 2026-05-16:
- `13123-E` plastic confirmed Monday (user field verification)
- `paper` added to zones A–D on same day as cardboard (confirmed via official Edogawa-ku schedule: all resources share one weekly collection day per zone)
