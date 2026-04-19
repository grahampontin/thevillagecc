/**
 * Utility functions for cricket field/scoring logic
 */

/**
 * Returns the cricket field zone name for a given angle.
 * Angle convention: 0 = toward bowler (straight up), increasing clockwise.
 * For a right-handed batsman: clockwise (right of diagram) = OFF side,
 * counter-clockwise (left of diagram) = LEG side.
 *
 * Zones going clockwise from straight (off side first):
 *   0       → Mid-off
 *   π×0.25  → Cover
 *   π×0.5   → Point
 *   π×0.675 → Gully
 *   π×0.75  → Third Man
 *   π×1.0   → Fine Leg
 *   π×1.25  → Backward Square Leg
 *   π×1.5   → Square Leg / Mid-wicket
 *   π×1.75  → Mid-on
 *   (wraps back to 0 = Mid-off)
 */
export function getScoringArea(angle: number): string {
  const TWO_PI = 2 * Math.PI;
  const a = ((angle % TWO_PI) + TWO_PI) % TWO_PI;
  if (a < Math.PI * 0.25) return 'Mid-off';
  if (a < Math.PI * 0.5)  return 'Cover';
  if (a < Math.PI * 0.675) return 'Point';
  if (a < Math.PI * 0.75) return 'Gully';
  if (a < Math.PI * 1.0)  return 'Third Man';
  if (a < Math.PI * 1.25) return 'Fine Leg';
  if (a < Math.PI * 1.5)  return 'Backward Square Leg';
  if (a < Math.PI * 1.75) return 'Mid-wicket';
  return 'Mid-on';
}
