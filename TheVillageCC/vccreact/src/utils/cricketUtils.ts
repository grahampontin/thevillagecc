/**
 * Utility functions for cricket field/scoring logic
 */

// Field zone boundaries as multiples of π (angle convention: 0 = toward bowler, clockwise)
const MID_ON_BOUNDARY             = Math.PI * 0.25;
const MID_WICKET_BOUNDARY         = Math.PI * 0.5;
const SQUARE_LEG_BOUNDARY         = Math.PI * 0.675;
const BACKWARD_SQUARE_LEG_BOUNDARY = Math.PI * 0.75;
const FINE_LEG_BOUNDARY           = Math.PI * 1.0;
const THIRD_MAN_BOUNDARY          = Math.PI * 1.25;
const POINT_BOUNDARY              = Math.PI * 1.5;
const COVER_BOUNDARY              = Math.PI * 1.75;

/**
 * Returns the cricket field zone name for a given angle.
 * Angle convention: 0 = toward bowler (straight up), increasing clockwise.
 * Zones are defined for a right-handed batsman (off side = left, leg side = right).
 */
export function getScoringArea(angle: number): string {
  const TWO_PI = 2 * Math.PI;
  const a = ((angle % TWO_PI) + TWO_PI) % TWO_PI;
  if (a < MID_ON_BOUNDARY)              return 'Mid-on';
  if (a < MID_WICKET_BOUNDARY)          return 'Mid-wicket';
  if (a < SQUARE_LEG_BOUNDARY)          return 'Square Leg';
  if (a < BACKWARD_SQUARE_LEG_BOUNDARY) return 'Backward Square Leg';
  if (a < FINE_LEG_BOUNDARY)            return 'Fine Leg';
  if (a < THIRD_MAN_BOUNDARY)           return 'Third Man';
  if (a < POINT_BOUNDARY)               return 'Point';
  if (a < COVER_BOUNDARY)               return 'Cover';
  return 'Mid-off';
}
