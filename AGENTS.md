# Repository agent instructions

On native Windows Codex sessions, never run a Git command that contacts an HTTPS remote directly. In particular, do not directly run `git fetch`, `git pull`, `git push`, `git ls-remote`, `git remote show`, or a command that implicitly queries a remote. The Windows sandbox can make Schannel/Git Credential Manager crash `git-remote-https.exe`.

Use `node scripts/git-remote-safe.mjs diagnose` for a network-free check and use the matching `ls-remote`, `fetch`, `pull`, or `push` operation for remote work. Do not persist SSL backend, credential-helper, proxy, tokens, or askpass configuration in repository or global Git configuration. Normal local Git commands remain safe.

