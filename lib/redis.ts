import { Redis } from '@upstash/redis'

/**
 * Shared Redis singleton — instantiated once per process, reused across
 * all API routes. Avoids repeated constructor overhead and keeps connection
 * pool config in one place.
 */
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})
