# Bear Kingdom: Wild Hunter — Phone-only starter

This is the first playable prototype, not the finished full game. It includes:
- 3D forest scene and castle/market buildings
- Third-person hunter character and touch joystick
- Bears with simple movement AI
- Hunt interaction, meat collection and selling
- Castle upgrade and worker hiring buttons
- Responsive landscape/portrait UI

## Build an APK using only your Android phone

1. Open https://github.com/ in Chrome and sign in or create a free account.
2. Create a new **public** repository named `bear-kingdom-wild-hunter`.
3. Upload the contents of this ZIP into the repository (not the ZIP itself). On GitHub mobile web, use **Add file → Upload files**. Keep the `.github/workflows/build-apk.yml` folder structure.
4. Open the repository's **Actions** tab. If GitHub asks, enable Actions.
5. Select **Build Bear Kingdom APK** → **Run workflow**. You can also push a commit to `main` to trigger it.
6. Wait for the workflow to finish with a green check.
7. Open the completed workflow run, scroll to **Artifacts**, and download `Bear-Kingdom-Android-APK`.
8. Extract the downloaded ZIP on your phone and install `app-debug.apk`. Android may ask you to allow installs from your browser/file manager.

## Important
- GitHub Actions offers limited free usage; public repositories generally have free standard-runner usage subject to GitHub's current limits.
- The APK is a debug APK for testing, not a Play Store release.
- The game loads Three.js from the bundled app build. No desktop computer is required.
- This is a starter prototype. Bear animations, combat, sound, inventory persistence, detailed models, missions, and full castle-building are planned next.
