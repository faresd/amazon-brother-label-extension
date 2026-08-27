# Release process

1. Update the identical version in `manifest.json` and `package.json`.
2. Run `npm run release` and inspect both ZIP files under `dist/`.
3. Merge to `main` after CI passes.
4. Push a matching protected tag such as `v2.0.15`.
5. GitHub Actions creates an immutable GitHub Release containing the Store and local-install packages.
6. The bridge repository's trusted publisher workflow downloads the immutable Store ZIP, validates it, and uploads it through Chrome Web Store API v2.

The first Store item, listing metadata, privacy declarations, visibility configuration, and service-account authorization must be completed once in the Chrome Web Store Developer Dashboard. The first visibility configuration must also be submitted manually when required by Chrome.
