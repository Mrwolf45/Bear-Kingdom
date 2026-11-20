# Bear Kingdom: Wild Hunter — Realistic Upgrade

This is an upgraded, playable 3D prototype for Android. It includes a forest environment, castle and market structures, a hunter model, bear models, touch joystick, hunting, meat selling, castle upgrades, worker hiring, simple generated sound effects, and graphics settings.

## Important honest limitation
This is **not** a finished AAA or photorealistic game. Models are procedurally built from Three.js geometry; animations and sounds are lightweight prototypes. High-quality rigged characters, motion-captured animations, detailed animal fur, voice acting, large quest systems, save/load, multiplayer, and professionally composed music are not included yet. Those require separate art/audio assets and more development.

## Build APK from an Android phone using GitHub
1. Create/open your GitHub repository.
2. Upload and replace the files in this ZIP, keeping the exact paths.
3. Commit changes to the `main` branch.
4. Open the repository's **Actions** tab.
5. Choose **Build Android APK** and tap **Run workflow**.
6. When the run succeeds, download the `Bear-Kingdom-Android-APK` artifact ZIP.
7. Extract it with ZArchiver and install `app-debug.apk`.

## Files
- `package.json`
- `index.html`
- `capacitor.config.json`
- `src/main.js`
- `src/style.css`
- `.github/workflows/build-apk.yml`

The workflow creates the Android project in GitHub Actions, so you do not need a PC.
