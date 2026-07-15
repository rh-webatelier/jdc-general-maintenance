# Working notes for this repo

## Diagnose the failure layer before trying workarounds

When a tool call fails with a block/403/permission error, don't retry with a
different technique until you know *which* of these three layers is actually
failing — each has a different fix, and workarounds only make sense within
the layer that's actually broken:

1. **Environment network policy** (sandboxed/remote sessions only). Symptom:
   every host fails the same way, including ones with no reason to block
   scraping (`archive.org`, `google.com`). Check first, before anything else:
   - `curl -sS $HTTPS_PROXY/__agentproxy/status` (or the proxy port directly)
     — look at `recentRelayFailures` for `"policy denial"`, or an explicit
     `Host not in allowlist: <host>` message.
   - Read `/root/.ccr/README.md` if present.
   - **If this is the cause: stop.** No browser, no alternate tool, no retry
     will get through — it's an allowlist enforced outside the session. Tell
     the user plainly, with the literal error text, and point them at the
     environment's network policy setting (on code.claude.com for Claude
     Code on the web) rather than continuing to try workarounds.

2. **Site-side anti-bot / auth wall.** Symptom: this one host blocks, but
   others succeed; e.g. login walls, Cloudflare challenges. *Only here* do
   things like a real headless browser, alternate endpoints, or an archived
   snapshot (Wayback Machine) make sense as a workaround — but only once
   layer 1 is ruled out, otherwise you're just re-discovering the same wall
   through a different tool and wasting turns.

3. **Credential/token scope.** Symptom: GitHub (or similar) API calls fail
   with things like `Resource not accessible by integration` or `You need
   admin access`. This is a property of the specific token/app's granted
   permissions, not a general account setting — clicking through the
   platform's own UI (org settings, member privileges, repo settings) will
   not fix it if the token itself was never granted that scope. Identify
   what's actually authenticating the session before spending cycles on UI
   archaeology.

General rule: **one targeted diagnostic check beats several blind retries.**
If a fix requires the user to change a setting outside this session (network
policy, GitHub App permissions, etc.), say so immediately and concretely —
don't keep attempting workarounds that the diagnosis already ruled out.
