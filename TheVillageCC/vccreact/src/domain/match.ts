/**
 * MatchV1 type matching components.schemas.MatchV1 in cricketclub.json OpenAPI spec.
 */
import { TeamV1 } from './team';
import { VenueV1 } from './venue';

export interface MatchV1 {
  isHome?: boolean;
  type?: string | null;
  date?: string | null;
  opposition?: TeamV1;
  venue?: VenueV1;
  id?: number;
}
