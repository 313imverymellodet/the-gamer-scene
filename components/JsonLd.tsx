// Server component — renders a JSON-LD <script> tag for structured data.
// No 'use client' needed; this is pure server-side HTML.

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>
}

export default function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      // Using suppressHydrationWarning because the content is static and
      // serialized server-side — no hydration mismatch possible.
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
