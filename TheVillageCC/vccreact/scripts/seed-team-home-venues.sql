-- ============================================================
-- Migration: Seed HomeVenueId for opposition Teams
-- Generated: 2026-04-23 from https://api.thevillagecc.org.uk/api
-- Method: most-frequent venue when VCC played AWAY (547 matches)
-- ⚠ = ambiguous (top two venues within 1 match of each other)
-- ============================================================

BEGIN TRANSACTION;

-- ── High-confidence mappings (3+ away matches) ───────────────────────────

UPDATE Teams SET HomeVenueId = 25  WHERE Id = 158;  -- Alexandra Park 4th XI @ Ally Pally (6 matches)
UPDATE Teams SET HomeVenueId = 29  WHERE Id = 64;   -- Agricola CC @ Civil Service Sports Ground, Chiswick (3 matches)
UPDATE Teams SET HomeVenueId = 33  WHERE Id = 36;   -- BBC Mishits @ Burnham (3 matches)
UPDATE Teams SET HomeVenueId = 54  WHERE Id = 90;   -- Beamers CC @ North Middlesex CC (4 matches)
UPDATE Teams SET HomeVenueId = 90  WHERE Id = 72;   -- COBCC @ Paddington Recreation Ground (3 matches)
UPDATE Teams SET HomeVenueId = 97  WHERE Id = 115;  -- Cookham Dean Cricket Club @ Cookham Dean Cricket Club, Cookham (10 matches)
UPDATE Teams SET HomeVenueId = 117 WHERE Id = 140;  -- Crossbats CC @ Marble Hill (5 matches)
UPDATE Teams SET HomeVenueId = 46  WHERE Id = 12;   -- DemiJohns @ St Johns College Oxford (14 matches)
UPDATE Teams SET HomeVenueId = 74  WHERE Id = 146;  -- Dulwich Lawnmower CC @ Hilly Fields Park, Brockley (4 matches)
UPDATE Teams SET HomeVenueId = 9   WHERE Id = 11;   -- Further Friars @ Keevil Manor (5 matches)
UPDATE Teams SET HomeVenueId = 77  WHERE Id = 74;   -- H.A.C @ H.A.C (4 matches)
UPDATE Teams SET HomeVenueId = 74  WHERE Id = 87;   -- Hobgoblin Nomads CC @ Hilly Fields Park, Brockley (10 matches)
UPDATE Teams SET HomeVenueId = 9   WHERE Id = 31;   -- Keevil @ Keevil Manor (3 matches)
UPDATE Teams SET HomeVenueId = 47  WHERE Id = 143;  -- London Itinerants @ Barnes Common (5 matches)
UPDATE Teams SET HomeVenueId = 4   WHERE Id = 154;  -- Maida Vale CC @ Parliament Hill (2 matches)
UPDATE Teams SET HomeVenueId = 111 WHERE Id = 133;  -- Montenegro Bokaneers @ Bokaneer Zentraal (2 matches)
UPDATE Teams SET HomeVenueId = 29  WHERE Id = 37;   -- New Barbarian Weasels @ Civil Service Sports Ground, Chiswick (2 matches)
UPDATE Teams SET HomeVenueId = 41  WHERE Id = 54;   -- Old Whitgiftians @ Whitgift Sports Ground, Croydon (12 matches)
UPDATE Teams SET HomeVenueId = 109 WHERE Id = 128;  -- OMTSU2 @ Merchant Taylors School (5 matches)
UPDATE Teams SET HomeVenueId = 133 WHERE Id = 174;  -- Oval Dream Boys CC @ Edward Alleyene Cricket Ground (2 matches)
UPDATE Teams SET HomeVenueId = 24  WHERE Id = 32;   -- Pacific CC @ Wray Crescent (5 matches)
UPDATE Teams SET HomeVenueId = 13  WHERE Id = 17;   -- Pimlico Strollers @ Crouch End (4 matches)
UPDATE Teams SET HomeVenueId = 30  WHERE Id = 38;   -- Pyrford @ Pyrford (3 matches)
UPDATE Teams SET HomeVenueId = 2   WHERE Id = 7;    -- Queens' College Cambs @ Barton Road (6 matches)
UPDATE Teams SET HomeVenueId = 87  WHERE Id = 98;   -- Pretenders CC @ Malta (2 matches)
UPDATE Teams SET HomeVenueId = 89  WHERE Id = 104;  -- South Bank Cricket Club @ Dulwich Sports Ground (15 matches)
UPDATE Teams SET HomeVenueId = 69  WHERE Id = 58;   -- Southwark & Lambeth CC (Gupte-Burton Trophy) @ Haydons Road Recreation Ground (8 matches)
UPDATE Teams SET HomeVenueId = 122 WHERE Id = 139;  -- Stoke Newington CC @ Hackney Marshes (3 matches)
UPDATE Teams SET HomeVenueId = 35  WHERE Id = 45;   -- Strong Room @ Highgate Woods (4 matches)
UPDATE Teams SET HomeVenueId = 35  WHERE Id = 96;   -- Stronngroom CC @ Highgate Woods (5 matches)
UPDATE Teams SET HomeVenueId = 102 WHERE Id = 122;  -- UCS Old Boys @ UCS Playing Fields (3 matches)
UPDATE Teams SET HomeVenueId = 29  WHERE Id = 100;  -- Whalers CC @ Civil Service Sports Ground, Chiswick (5 matches)
UPDATE Teams SET HomeVenueId = 113 WHERE Id = 135;  -- Woodford Green CC @ Woodford Green (8 matches)

-- ── Lower-confidence mappings (1-2 away matches, clear winner) ───────────

UPDATE Teams SET HomeVenueId = 16  WHERE Id = 40;   -- A Few Good Men @ Bartlemas, Oxford (1 match)
UPDATE Teams SET HomeVenueId = 99  WHERE Id = 118;  -- Bank of England 3rd XI @ Bank of England Sports Ground (1 match)
UPDATE Teams SET HomeVenueId = 64  WHERE Id = 70;   -- Battersea Ironsides @ Battersea Ironsides Sports Club (2 matches)
UPDATE Teams SET HomeVenueId = 92  WHERE Id = 105;  -- Bengal Troopers @ Chigwell (1 match)
UPDATE Teams SET HomeVenueId = 80  WHERE Id = 93;   -- BICC Fullers 3rd XI @ Abbey Recreation Ground (1 match)
UPDATE Teams SET HomeVenueId = 127 WHERE Id = 157;  -- Boldklubben FREM @ Valby Idrtspark (1 match)
UPDATE Teams SET HomeVenueId = 42  WHERE Id = 55;   -- Buckhurst Hill CC @ Barnes Elms Sports Trust (1 match)
UPDATE Teams SET HomeVenueId = 104 WHERE Id = 120;  -- Butlers XI @ Turville Park CC (1 match)
UPDATE Teams SET HomeVenueId = 103 WHERE Id = 164;  -- Butterlords CC @ Battersea Park - Pitch 2 (1 match)
UPDATE Teams SET HomeVenueId = 66  WHERE Id = 88;   -- Byron Cricket Club @ Marina Cricket Ground, Corfu (1 match)
UPDATE Teams SET HomeVenueId = 103 WHERE Id = 79;   -- Cairns Fudge @ Battersea Park - Pitch 2 (1 match)
UPDATE Teams SET HomeVenueId = 2   WHERE Id = 29;   -- Cambs College XI @ Barton Road (1 match)
UPDATE Teams SET HomeVenueId = 18  WHERE Id = 179;  -- City Christ Church CC @ Regents Park (1 match)
UPDATE Teams SET HomeVenueId = 32  WHERE Id = 85;   -- Cuxham CC @ Wadham College, Oxford (1 match)
UPDATE Teams SET HomeVenueId = 116 WHERE Id = 142;  -- Dulwich Dusters @ Dulwich College (1 match)
UPDATE Teams SET HomeVenueId = 67  WHERE Id = 75;   -- Gymnastikos @ Corfu Town Ground, Corfu (1 match)
UPDATE Teams SET HomeVenueId = 72  WHERE Id = 84;   -- Hawridge and Cholesbury @ Cholesbury Common (1 match)
UPDATE Teams SET HomeVenueId = 68  WHERE Id = 80;   -- Hutton CC @ Hutton Cricket Club (1 match)
UPDATE Teams SET HomeVenueId = 128 WHERE Id = 156;  -- Ishj CC @ Ishj Idrtscenter (1 match)
UPDATE Teams SET HomeVenueId = 39  WHERE Id = 52;   -- Jesus College @ Jesus College, Cambridge (2 matches)
UPDATE Teams SET HomeVenueId = 112 WHERE Id = 130;  -- Journeymen CC @ St Aloysius College (1 match)
UPDATE Teams SET HomeVenueId = 100 WHERE Id = 119;  -- Kew CC @ Kew CC (1 match)
UPDATE Teams SET HomeVenueId = 4   WHERE Id = 50;   -- Kings College and Lewisham Hospitals CC @ Parliament Hill (1 match)
UPDATE Teams SET HomeVenueId = 18  WHERE Id = 62;   -- Kings College London Old Boys @ Regents Park (1 match)
UPDATE Teams SET HomeVenueId = 32  WHERE Id = 89;   -- London New Zealand CC @ Wadham College, Oxford (1 match)
UPDATE Teams SET HomeVenueId = 115 WHERE Id = 137;  -- London Shabab @ GSK Sports Ground (1 match)
UPDATE Teams SET HomeVenueId = 18  WHERE Id = 175;  -- LUS Village CC @ Regents Park (1 match)
UPDATE Teams SET HomeVenueId = 89  WHERE Id = 155;  -- Middlesex Strikers CC @ Dulwich Sports Ground (1 match)
UPDATE Teams SET HomeVenueId = 89  WHERE Id = 178;  -- Millfields CC @ Dulwich Sports Ground (1 match)
UPDATE Teams SET HomeVenueId = 2   WHERE Id = 14;   -- Milton Brewery XI @ Barton Road (1 match)
UPDATE Teams SET HomeVenueId = 7   WHERE Id = 9;    -- Monckton Wylde Cider Barn XI @ Nettlecombe (1 match)
UPDATE Teams SET HomeVenueId = 4   WHERE Id = 171;  -- Nightwatchman CC @ Parliament Hill (1 match)
UPDATE Teams SET HomeVenueId = 89  WHERE Id = 161;  -- North West CC @ Dulwich Sports Ground (1 match)
UPDATE Teams SET HomeVenueId = 40  WHERE Id = 53;   -- Old Ignatians @ St Ignatius College, Enfield (1 match)
UPDATE Teams SET HomeVenueId = 34  WHERE Id = 86;   -- Pecos XI @ Hampstead Heath Ext. (1 match)
UPDATE Teams SET HomeVenueId = 85  WHERE Id = 99;   -- Pink Elephants CC @ Vincent Square, Westminster (1 match)
UPDATE Teams SET HomeVenueId = 132 WHERE Id = 168;  -- Porto CC @ Oporto Cricket and Lawn Tennis Club (1 match)
UPDATE Teams SET HomeVenueId = 123 WHERE Id = 153;  -- Princess Head CC @ Richmond Green (1 match)
UPDATE Teams SET HomeVenueId = 95  WHERE Id = 114;  -- Qui Vive Cricket Club @ Cricket Club Qui Vive (1 match)
UPDATE Teams SET HomeVenueId = 63  WHERE Id = 69;   -- Rainham CC @ Gidea Park, Romford (1 match)
UPDATE Teams SET HomeVenueId = 70  WHERE Id = 82;   -- Rode CC @ Rode Playing Fields (2 matches)
UPDATE Teams SET HomeVenueId = 76  WHERE Id = 78;   -- Ruislip Orientals @ Vale Farm Sports Ground, North Wembley (1 match)
UPDATE Teams SET HomeVenueId = 19  WHERE Id = 24;   -- six-a-side tournament @ Romsey Town 6-a-side (1 match)
UPDATE Teams SET HomeVenueId = 135 WHERE Id = 180;  -- Southgate Adelaide CC @ The Walker Ground (1 match)
UPDATE Teams SET HomeVenueId = 98  WHERE Id = 117;  -- St. Lukes CC @ King George Playing Fields (1 match)
UPDATE Teams SET HomeVenueId = 31  WHERE Id = 57;   -- Sultans of Swing @ Peter May Sports Centre (1 match)
UPDATE Teams SET HomeVenueId = 55  WHERE Id = 111;  -- Teesras @ Chiswick House (1 match)
UPDATE Teams SET HomeVenueId = 10  WHERE Id = 121;  -- The Journeymen XI @ Winchmore Hill (1 match)
UPDATE Teams SET HomeVenueId = 11  WHERE Id = 21;   -- The Outcasts @ TBC (1 match)
UPDATE Teams SET HomeVenueId = 79  WHERE Id = 123;  -- Tour TBC @ Wiltshire TBC (2 matches)
UPDATE Teams SET HomeVenueId = 14  WHERE Id = 30;   -- Tower Ravens @ Millfields Park (1 match)
UPDATE Teams SET HomeVenueId = 131 WHERE Id = 162;  -- United Lawyers Society CC @ Barn Elms Sports Ground (1 match)
UPDATE Teams SET HomeVenueId = 14  WHERE Id = 28;   -- Victoria Park Juniors @ Millfields Park (1 match)
UPDATE Teams SET HomeVenueId = 4   WHERE Id = 63;   -- Village England @ Parliament Hill (1 match)
UPDATE Teams SET HomeVenueId = 4   WHERE Id = 172;  -- Village Rest of the World @ Parliament Hill (1 match)
UPDATE Teams SET HomeVenueId = 2   WHERE Id = 129;  -- Village XI @ Barton Road (1 match)
UPDATE Teams SET HomeVenueId = 94  WHERE Id = 113;  -- VRA Amsterdam Amstelveen @ VRA Cricket Ground, Amstelveen (1 match)
UPDATE Teams SET HomeVenueId = 1   WHERE Id = 34;   -- Wenlock Arms @ Springfield Park (1 match)
UPDATE Teams SET HomeVenueId = 4   WHERE Id = 159;  -- Willow Tree CC @ Parliament Hill (1 match)
UPDATE Teams SET HomeVenueId = 21  WHERE Id = 25;   -- Witham Friary @ Witham Firary (1 match)
UPDATE Teams SET HomeVenueId = 71  WHERE Id = 83;   -- Wolfson College @ Downing College Sports Ground, Cambridge (1 match)

-- ── Ambiguous mappings — REVIEW BEFORE APPLYING ──────────────────────────
-- These teams have two venues within 1 match of each other.
-- The best guess is applied but commented out; uncomment after manual review.

-- Chessington CC (127): venue 106 " Chessington CC"(2) vs venue 107 "Chessington CC"(1)
--   Likely duplicate venue records — merge venues first, then apply.
-- UPDATE Teams SET HomeVenueId = 106 WHERE Id = 127;

-- Chigwell CC (147): venue 92 "Chigwell"(1) vs venue 119 "Paddock Green Lane, Chigwell"(1)
-- UPDATE Teams SET HomeVenueId = 92 WHERE Id = 147;

-- Clapham In CC / Boa Cup (66): Regents Park(1) vs Brondesbury CC(1)
-- UPDATE Teams SET HomeVenueId = 18 WHERE Id = 66;

-- Coach & Horses (2): Springfield Park(4) vs London Fields(3)
-- UPDATE Teams SET HomeVenueId = 1 WHERE Id = 2;

-- Dell Boys CC (167): Parliament Hill(2) vs Dulwich Sports Ground(1)
-- UPDATE Teams SET HomeVenueId = 4 WHERE Id = 167;

-- Elite CC (145): Parliament Hill(1) / Regents Park(1) / North Acton Playing Fields(1) — three-way tie
-- UPDATE Teams SET HomeVenueId = 4 WHERE Id = 145;

-- Gents of West London (56): Fairfield RG Kingston(1) vs King Edwards Rec Tolworth(1)
-- UPDATE Teams SET HomeVenueId = 48 WHERE Id = 56;

-- Graces CC (138): Broxbourne CC(2) vs Parliament Hill(1)
-- UPDATE Teams SET HomeVenueId = 118 WHERE Id = 138;

-- I Dont Like Cricket Club (163): Parliament Hill(1) / Regents Park(1) / Barnes Elms(1) / Wandsworth Park(1)
-- UPDATE Teams SET HomeVenueId = 4 WHERE Id = 163;

-- London Nigerians CC (112): Roding Valley(1) vs Footscray Playing Fields(1)
-- UPDATE Teams SET HomeVenueId = 93 WHERE Id = 112;

-- London Welsh CC 1st XI (148): Dulwich Sports Ground(1) vs Woking(1)
-- UPDATE Teams SET HomeVenueId = 89 WHERE Id = 148;

-- London Welsh CC 2nd XI (170): Regents Park(1) vs Dulwich Sports Ground(1)
-- UPDATE Teams SET HomeVenueId = 18 WHERE Id = 170;

-- Marsa CC (47): The Marsa Club Malta(1) vs Malta(1) — probably same ground, two venue records
-- UPDATE Teams SET HomeVenueId = 36 WHERE Id = 47;

-- National Audit Office (42): Ally Pally(1) vs Tooting Common(1)
-- UPDATE Teams SET HomeVenueId = 25 WHERE Id = 42;

-- Salix CC (43): Bartlemas Oxford(1) vs Wadham College Oxford(1)
-- UPDATE Teams SET HomeVenueId = 16 WHERE Id = 43;

-- Shakespeare (16): Springfield Park(1) vs Millfields Park(1)
-- UPDATE Teams SET HomeVenueId = 1 WHERE Id = 16;

-- St Annes Allstars (22): Mill Hill Village CC(1) vs Oxford(1)
-- UPDATE Teams SET HomeVenueId = 84 WHERE Id = 22;

-- TBC (49): Parliament Hill(2) / Wiltshire TBC(2) / Denmark(2) — not a real team, skip
-- UPDATE Teams SET HomeVenueId = 4 WHERE Id = 49;

-- The Falcon (15): Lea Bridge(1) vs Millfields Park(1)
-- UPDATE Teams SET HomeVenueId = 12 WHERE Id = 15;

-- The Griffin (10): Corsley(1) vs Compton Bassett(1)
-- UPDATE Teams SET HomeVenueId = 8 WHERE Id = 10;

-- The Informals (27): Regents Park(1) vs Ally Pally(1)
-- UPDATE Teams SET HomeVenueId = 18 WHERE Id = 27;

-- The Old Fallopians (8): Parliament Hill(2) vs Peter May Sports Centre(1)
-- UPDATE Teams SET HomeVenueId = 4 WHERE Id = 8;

-- The Rad (6): Barton Road(3) vs Newton Cambridge(2) vs Fitzwilliam(1)
-- UPDATE Teams SET HomeVenueId = 2 WHERE Id = 6;

-- The Rainmen (5): Chawton Hants(1) vs Douglas Eyre Sports Ground(1)
-- UPDATE Teams SET HomeVenueId = 5 WHERE Id = 5;

-- A.A. Page Invitational XI (20): always at TBC venue — uninformative
-- UPDATE Teams SET HomeVenueId = 11 WHERE Id = 20;

COMMIT;

-- ── Teams with no away matches — HomeVenueId left NULL ───────────────────
-- Id 1   Crescent & Star
-- Id 3   London Fields
-- Id 4   The Lamb
-- Id 13  Island CCC
-- Id 18  Cincinnati CC
-- Id 19  UBS
-- Id 23  All comers
-- Id 26  Cric Me Up CC
-- Id 33  John Minshull Invitational XI
-- Id 35  Rampant Badgers
-- Id 39  Railway Taverners
-- Id 41  Black Rose
-- Id 44  London Wanderers
-- Id 46  Burbs Lot
-- Id 48  Club Day
-- Id 51  Finchley CC 4th XI
-- Id 59  Crouch End CC
-- Id 60  Nihilists CC
-- Id 61  Rain Men
-- Id 65  EHCC
-- Id 67  Rhode
-- Id 68  YRG Eagles
-- Id 71  Fancy Dans
-- Id 73  East Ham Corinthians
-- Id 76  Byron CC
-- Id 77  Combined Jesus College XI
-- Id 81  The Chelsea Arts Club CC
-- Id 91  Thames Ditton CC
-- Id 92  Marlow Park CC
-- Id 94  Cross Keys CC
-- Id 95  Nomads CC
-- Id 97  London Coolers XI
-- Id 101 Metropolitan Cricket Club
-- Id 102 Raynes Park Former Pupils CC
-- Id 103 Stanmore Cricket Club
-- Id 106 Hackney Marshes CC
-- Id 107 St Clements CC
-- Id 108 St Albans CC
-- Id 116 Team Mitcham CC
-- Id 124 Eastside
-- Id 125 Harry Baldwins
-- Id 131 Star CC
-- Id 132 Millwall Stars CC
-- Id 134 KLCC
-- Id 136 Croxley Guild CC
-- Id 141 Grenfell CC
-- Id 144 Hackney Village CC
-- Id 149 xxxxChessington CC  (likely test/duplicate record)
-- Id 150 Rotten Livers CC
-- Id 151 Lessa Christchurch CC
-- Id 152 Team Fornax Friendly XI
-- Id 160 Chatty Bats CC
-- Id 165 Rising Globetrotters CC
-- Id 166 Anglos United CC
-- Id 169 Free weekend  (not a real team)
-- Id 176 Stamford Hill CC
-- Id 177 London City Christ Temple CC
-- Id 126 xxxxxChessington CC  (likely test/duplicate record)

