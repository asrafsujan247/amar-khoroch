/**
 * Generate a locally-unique id.
 *
 * A timestamp + random suffix is sufficient for a single-user, on-device app
 * and avoids a native crypto dependency. Collision risk is negligible at the
 * volume of records this app creates.
 */
export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
