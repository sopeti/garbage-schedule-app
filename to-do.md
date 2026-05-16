# ゴミ出しカレンダー — To-Do

## App Store submission blockers

- [ ] **App icon** — design 1024×1024 PNG (currently Expo default). Required before any build.
- [ ] **Host privacy policy** — push repo to GitHub, enable Pages, use URL `https://sopeti.github.io/garbage-schedule-app/privacy-policy.html` in App Store Connect.
- [ ] **Fill eas.json** — add `ascAppId` and `appleTeamId` after creating app in App Store Connect.
- [ ] **EAS build** — run `eas login` then `eas build --platform ios --profile production`. Needs Apple Developer account ($99/yr).
- [ ] **App Store Connect** — create app record, paste copy from `appstore-copy.md`, upload screenshots from `screenshots/appstore/`.
- [ ] **Ward coverage decision** — launch Edogawa-only, or add more Tokyo wards first? (Each ward needs a new pipeline scraper.)

## Nice-to-have (post-launch)

- [ ] Add more Tokyo ward scrapers to `pipeline/src/run.ts`
- [ ] App Store review response templates
- [ ] Android build + Google Play submission (eas.json already has android package set)
