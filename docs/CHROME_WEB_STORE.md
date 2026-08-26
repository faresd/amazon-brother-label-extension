# Chrome Web Store automation

Tagged releases build two deterministic ZIP files and publish a GitHub Release. The Store workflow uploads the Store ZIP with Chrome Web Store API v2 and can submit it for review.

## One-time Google/Chrome setup

1. Create or select a Google Cloud project and enable the Chrome Web Store API.
2. Create a service account and add its email in Chrome Web Store Developer Dashboard → Account. Chrome currently permits one service account per publisher.
3. Configure GitHub Actions Workload Identity Federation for keyless authentication to that service account.
4. Create the initial Chrome Web Store item manually, complete Store listing, Privacy, Distribution, and test instructions, then publish the first visibility configuration manually when required by Chrome.

## GitHub repository variables

- `GCP_PROJECT_ID`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_CWS_SERVICE_ACCOUNT`
- `CWS_PUBLISHER_ID`
- `CWS_EXTENSION_ID`
- `CWS_UPLOAD_ENABLED=true`
- `CWS_SUBMIT_FOR_REVIEW=true` to submit automatically after upload

No long-lived Google key, OAuth client secret, or refresh token is stored in the repository. Protect the `production` GitHub environment and require reviewer approval if desired.

## Release

Update `manifest.json` and `package.json` to the same version, merge to `main`, and push a matching tag such as `v2.0.15`. CI validates and packages the extension; the release workflow creates GitHub artifacts; the Store workflow uses the immutable release ZIP.
