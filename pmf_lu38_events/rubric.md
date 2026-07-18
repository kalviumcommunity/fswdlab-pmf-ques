# LU38 — Pulseboard Activity Bus Rubric

**PMF auto-evaluated: 10 marks.** Each passing test = 1 mark.

| Test | Mark | Behaviour |
|---:|---:|---|
| 1 | 1 | Reject blank event name and missing payload |
| 2 | 1 | Event envelope contains name |
| 3 | 1 | Envelope preserves payload |
| 4 | 1 | Envelope contains numeric timestamp |
| 5 | 1 | Persistent listener receives every matching event |
| 6 | 1 | Subscribers run in registration order |
| 7 | 1 | Exact-listener, idempotent unsubscribe |
| 8 | 1 | One-time subscription |
| 9 | 1 | Event names are isolated |
| 10 | 1 | Audit + notification handlers order and cleanup |
