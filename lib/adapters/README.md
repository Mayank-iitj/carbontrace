# Service adapters

Every external service in CarbonTrace sits behind a thin **adapter** with the same
contract so the app runs locally with **zero API keys** and swaps in real providers
via environment variables — no code changes at call sites.

## The pattern

```ts
const client = process.env.SERVICE_KEY ? new RealClient(key) : null;
export const serviceEnabled = Boolean(client);

export async function doThing(input) {
  if (!client) {
    console.info("[service:stub] ...");   // graceful no-op, observable in dev
    return { stubbed: true, /* sensible default */ };
  }
  return client.realCall(input);          // real provider when configured
}
```

## Reference implementations

- `lib/email/index.ts` — Resend when `RESEND_API_KEY` is set, else logs to console.
- `lib/ai/groq.ts` + `lib/ai/insights.ts` — **Groq** powers all AI operations. Real
  OpenAI-compatible call when `GROQ_API_KEY` is set, deterministic sample insights otherwise.
  Called only from server route handlers so the key never reaches the client.

## Adapters added in later milestones (same shape)

| Service        | Env var(s)                         | Stub behaviour                         |
| -------------- | ---------------------------------- | -------------------------------------- |
| Payments       | `STRIPE_SECRET_KEY`                | mock checkout session / no-op webhook  |
| AI insights    | `GROQ_API_KEY`                     | deterministic sample recommendations   |
| Cache / KV     | `KV_REST_API_URL`, `KV_REST_API_TOKEN` | in-memory Map                      |
| Blob storage   | `BLOB_READ_WRITE_TOKEN`            | local/temp data URL                    |
| Bank / spend   | `PLAID_CLIENT_ID`, `PLAID_SECRET`  | sample transaction fixtures            |

Keep keys server-side only — never import an adapter into a client component.
