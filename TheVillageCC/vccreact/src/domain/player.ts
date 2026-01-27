/**
 * PlayerV1 type matching components.schemas.PlayerV1 in cricketclub.json OpenAPI spec.
 * Note: The OpenAPI spec shows an empty object, so we define fields based on actual API responses.
 */
export interface PlayerV1 {
  playerId?: number;
  firstName?: string | null;
  surname?: string | null;
  middleInitials?: string | null;
  name?: string | null;
  shortName?: string | null;
  nickname?: string | null;
  battingStyle?: string | null;
  bowlingStyle?: string | null;
  isActive?: boolean;
  debut?: string | null;
  isRightHandBat?: boolean;
  lastMatchDate?: string | null;
  playingRole?: string | null;
  matches?: number;
}
