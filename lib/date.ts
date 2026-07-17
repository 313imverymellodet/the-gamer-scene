/**
 * Shared content-date handling.
 *
 * gray-matter parses unquoted YAML dates (`date: 2026-04-30`) into JS Date
 * OBJECTS, whose default stringification ("Wed Apr 30 2026 00:00:00 GMT…")
 * cannot be reparsed by `new Date(str + 'T12:00:00')` — that produced the
 * "Invalid Date" bug on the review index. Quoted dates arrive as strings.
 *
 * parseContentDate() normalizes both cases (and raw Date objects) to a stable
 * UTC-noon Date, so date-only values never shift a day across timezones.
 */
export function parseContentDate(input: unknown): Date | null {
  if (!input) return null

  // Date object (unquoted YAML) → pull the ISO date part
  const str = input instanceof Date ? input.toISOString() : String(input)

  // Prefer an explicit YYYY-MM-DD anywhere in the string
  const iso = str.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (iso) {
    const d = new Date(`${iso[1]}-${iso[2]}-${iso[3]}T12:00:00Z`)
    return isNaN(d.getTime()) ? null : d
  }

  // Fallback: let Date try the whole string (verbose forms, etc.)
  const d = new Date(str)
  return isNaN(d.getTime()) ? null : d
}

/** "July 17, 2026" — empty string if unparseable. */
export function formatLongDate(input: unknown): string {
  const d = parseContentDate(input)
  if (!d) return ''
  return d.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}

/** "Jul 2026" — empty string if unparseable. */
export function formatMonthYear(input: unknown): string {
  const d = parseContentDate(input)
  if (!d) return ''
  return d.toLocaleDateString('en-US', {
    month: 'short', year: 'numeric', timeZone: 'UTC',
  })
}

/** "Jul 17, 2026" — empty string if unparseable. */
export function formatShortDate(input: unknown): string {
  const d = parseContentDate(input)
  if (!d) return ''
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}

/** ISO instant for JSON-LD / RSS, e.g. "2026-07-17T12:00:00.000Z". */
export function toIso(input: unknown): string | undefined {
  const d = parseContentDate(input)
  return d ? d.toISOString() : undefined
}
