# Relay — Equipment Health
Independent portfolio prototype by Ibrahim Aldrees.

## Run locally
Serve `dist` with any static HTTP server, for example `python3 -m http.server 8000 --directory dist`, then open localhost:8000. No dependencies or external requests are required.

## Architecture
`engine.js` is a deterministic simulator and state detector, separate from the UI in `app.js`. Each tick updates telemetry, evaluates health and records state transitions. The chart retains 60 samples; the event log retains 1000 entries. Connection status takes precedence over temperature/battery state, since old measurements cannot establish current equipment condition. Last-known values remain labeled when stale. A nominal simulation tick represents one second; browser timer throttling can slow wall-clock execution. No backend, persistence, real device integration, or production validation is claimed.

## Validation
Run `node tests/engine.test.cjs`. Tests cover stale/offline boundary timing, overheating, low battery, recovery, missing chart samples, bounded history, transition deduplication and the full guided scenario.

## Next engineering steps
Add a telemetry ingestion API with schema validation, device timestamps and sequence IDs; persistence; independent simultaneous alerts with acknowledgments; authenticated device access; and tests against real equipment. Current thresholds are illustrative, not equipment specifications.
