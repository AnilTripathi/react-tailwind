/**
 * Date utility functions for API integration
 * Handles date normalization for start/end of day in ISO format
 */

/**
 * Convert date to start of day in ISO format
 * @param date - Date object or ISO string
 * @returns ISO string at start of day (00:00:00.000Z)
 */
export const toStartOfDay = (date: Date | string): string => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

/**
 * Convert date to end of day in ISO format
 * @param date - Date object or ISO string
 * @returns ISO string at end of day (23:59:59.999Z)
 */
export const toEndOfDay = (date: Date | string): string => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
};