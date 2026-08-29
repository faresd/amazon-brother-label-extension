# Safe Git publishing on Windows

## Production boundary

The extension and bridge are published by GitHub Actions. A local Windows Git failure cannot bypass CI, alter an immutable release artifact, or publish directly to the Chrome Web Store. Local work only transfers reviewed commits and tags to GitHub; the existing CI tests, packaging, release checks, Workload Identity authentication, and explicit Store gates remain authoritative.

Native Windows Codex sandboxes run under an isolated account. Git for Windows can fail to obtain Schannel credentials there and can crash `git-remote-https.exe` while handing off to Git Credential Manager. Local Git commands are safe; direct HTTPS remote commands are not.

## Required procedure

1. Run `node scripts/git-remote-safe.mjs diagnose --json` from the repository root. This does not contact the network.
2. Run the full repository test and package command.
3. Use the wrapper's `fetch`, `pull`, `ls-remote`, or `push` operation. Never persist a workaround in `.git/config` or global Git configuration.
4. After a failed push, inspect the GitHub ref with GitHub CLI before retrying. A transport failure can occur after GitHub accepted the update.
5. Let GitHub Actions create and verify release artifacts. Never substitute a locally produced archive for an immutable CI artifact.

## Failure and corner-case matrix

| Case | Safe behavior |
| --- | --- |
| Schannel has no sandbox credentials | Only the child Git process uses OpenSSL; system and repository settings remain unchanged. |
| Git Credential Manager is missing, locked, interactive, or crashes | Persistent helpers are bypassed and prompts are disabled. An ephemeral token is obtained from authenticated GitHub CLI. |
| GitHub CLI is absent, signed out, times out, or returns an invalid token | The operation fails before Git contacts the remote. No fallback prompt appears. |
| A token lacks repository permission or has expired | Git fails closed. The wrapper does not weaken scopes or store a replacement token. |
| Codex injects the known `127.0.0.1:9`/`localhost:9` blackhole proxy | Only that exact proxy value is removed in the child environment. Legitimate corporate proxies are preserved. |
| Remote URL contains credentials, HTTP, SSH, a spoofed hostname, encoded separators, extra path components, query, or fragment | The operation is rejected before authentication or network access. |
| Remote name, branch, tag, or refspec resembles a command-line option or contains Git-invalid control syntax | Strict validation rejects it before spawning Git. Child processes never use a command shell. |
| Git or GitHub CLI hangs | Each child has a bounded timeout. Windows process-tree termination is attempted, with direct child termination as a sandbox-compatible fallback. |
| Read-only lookup or fetch fails transiently | It may retry at most twice with a short backoff. Timed-out operations never retry. |
| Push or pull returns an error | It never retries automatically because the remote or local state may already have changed. |
| Temporary askpass cleanup fails | The file contains only environment-variable references, never the token. Cleanup failure is warned without changing a successful Git result. |
| Process output is unexpectedly large | Captured diagnostic output is capped. Remote Git output streams directly and never contains a token in its arguments or URL. |
| Script is launched outside a repository or the remote is missing | The network-free repository checks fail immediately. |
| Online/offline sandbox identities see different repository ownership | The exact discovered repository root is trusted only through child-process `-c safe.directory=<root>`; no global wildcard or persistent exception is created. |
| Production CI runner | CI continues using its isolated GitHub-provided credentials and existing Linux workflows; the Windows workaround is not applied globally. |

## Incident recovery

If `git-remote-https.exe` appears, close the dialog and do not repeat the direct Git command. Confirm no repository-local `http.*` or `credential.*` override was added, run the network-free diagnosis, and use the safe wrapper. For an ambiguous push, use `gh api repos/<owner>/<repository>/git/ref/heads/<branch>` or inspect the GitHub Actions page before trying again.

This control reduces the known local Windows failure to a bounded development inconvenience. Production availability still depends on GitHub, Google, Chrome Web Store, Amazon, Chronopost, and the deployed service; their existing health checks, retries, idempotency controls, and release gates remain separate controls.
