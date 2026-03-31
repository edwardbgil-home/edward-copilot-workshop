/**
 * Returns the current timestamp in ISO 8601 format.
 * @returns {string} Current time as ISO timestamp.
 */
export function now() {
  return new Date().toISOString();
}
