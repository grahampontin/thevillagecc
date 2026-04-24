"""
Fetches all teams, venues, and matches from the VCC API and produces
a proposed team -> home venue mapping based on where each opposition
team most frequently plays as the HOME side.

Usage: python scripts/map-team-venues.py
"""

import urllib.request
import json
from collections import defaultdict, Counter

BASE = "https://api.thevillagecc.org.uk/api"

def fetch(path):
    url = f"{BASE}{path}"
    with urllib.request.urlopen(url, timeout=60) as r:
        return json.loads(r.read())

print("Fetching teams...")
teams = fetch("/teams")
print(f"  {len(teams)} teams")

print("Fetching venues...")
venues = fetch("/venues")
print(f"  {len(venues)} venues")

print("Fetching matches...")
matches = fetch("/matches")
print(f"  {len(matches)} matches")

# Index for quick lookup
team_by_id   = {t["id"]: t for t in teams}
venue_by_id  = {v["id"]: v for v in venues}

# Inspect the first match to understand the shape
print("\nSample match fields:")
if matches:
    print(json.dumps(matches[0], indent=2))

# For each opposition team, count how many times they appear as the
# home team (isHome == False from VCC's perspective means THEY are home)
# The match object should have oppositionId / venueId / isHome fields.
# We accumulate: team_id -> Counter(venue_id -> appearances)
venue_counts = defaultdict(Counter)   # team_id -> {venue_id: count}

for m in matches:
    # Skip if key fields missing
    opp_id   = m.get("oppositionId") or (m.get("opposition") or {}).get("id")
    venue_id = m.get("venueId")      or (m.get("venue") or {}).get("id")
    is_home  = m.get("isHome")        # True = VCC are home, False = opposition are home

    if opp_id is None or venue_id is None:
        continue

    # Only count matches where the opposition played at HOME (their ground)
    if is_home is False:
        venue_counts[opp_id][venue_id] += 1

# Build proposed mapping
print("\n\n=== PROPOSED TEAM -> HOME VENUE MAPPING ===\n")
print(f"{'TeamId':<8} {'VenueId':<9} {'Plays':>6}  {'Team Name':<45} {'Venue Name'}")
print("-" * 120)

rows = []
for team in sorted(teams, key=lambda t: t.get("name") or ""):
    tid  = team["id"]
    name = team.get("name") or ""

    if tid in venue_counts and venue_counts[tid]:
        best_vid, count = venue_counts[tid].most_common(1)[0]
        venue_name = (venue_by_id.get(best_vid) or {}).get("name", "???")
        # Flag if there's ambiguity (another venue within 2 appearances)
        all_counts = venue_counts[tid].most_common()
        ambiguous = len(all_counts) > 1 and all_counts[1][1] >= count - 1
        flag = " ⚠ AMBIGUOUS" if ambiguous else ""
        rows.append((tid, best_vid, count, name, venue_name, flag))
        print(f"{tid:<8} {best_vid:<9} {count:>6}  {name:<45} {venue_name}{flag}")
    else:
        rows.append((tid, None, 0, name, "— no away matches recorded —", ""))
        print(f"{tid:<8} {'':9} {'':6}  {name:<45} — no away matches recorded —")

# Also emit as SQL UPDATE statements for convenience
print("\n\n=== SQL UPDATE STATEMENTS ===\n")
for tid, vid, count, name, venue_name, flag in rows:
    if vid is not None:
        comment = f"-- {name} @ {venue_name} ({count} matches){flag}"
        print(f"UPDATE Teams SET HomeVenueId = {vid} WHERE Id = {tid};  {comment}")

print("\nDone.")

