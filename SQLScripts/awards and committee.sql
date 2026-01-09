create table dbo.committee
(
    committee_id int         not null
        constraint PK_committee
            primary key,
    year         int         not null,
    role         varchar(50) not null,
    player_id    int         not null
)
    go

create table dbo.awards
(
    award_id  int         not null
        constraint PK_awards
            primary key,
    award     varchar(50) not null,
    year      int         not null,
    player_id numeric     not null,
    data      varchar(500)
)
    go


BEGIN TRANSACTION;

-- Committee posts: Captains
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (1, 2004, 'Captain', 21);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (2, 2005, 'Captain', 21);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (3, 2006, 'Captain', 21);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (4, 2007, 'Captain', 1);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (5, 2008, 'Captain', 43);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (6, 2009, 'Captain', 43);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (7, 2010, 'Captain', 43);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (8, 2011, 'Captain', 65);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (9, 2012, 'Captain', 65);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (10, 2013, 'Captain', 65);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (11, 2014, 'Captain', 213);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (12, 2015, 'Captain', 213);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (13, 2016, 'Captain', 171);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (14, 2017, 'Captain', 171);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (15, 2018, 'Captain', 199);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (16, 2019, 'Captain', 199);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (17, 2020, 'Captain', 2);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (18, 2021, 'Captain', 2);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (19, 2022, 'Captain', 2);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (20, 2023, 'Captain', 200);

-- Committee posts: Vice-Captains
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (21, 2004, 'ViceCaptain', 4);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (22, 2005, 'ViceCaptain', 1);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (23, 2006, 'ViceCaptain', 2);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (24, 2007, 'ViceCaptain', 9);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (25, 2008, 'ViceCaptain', 3);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (26, 2009, 'ViceCaptain', 42);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (27, 2010, 'ViceCaptain', 65);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (28, 2011, 'ViceCaptain', 97);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (29, 2012, 'ViceCaptain', 97);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (30, 2013, 'ViceCaptain', 213);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (31, 2014, 'ViceCaptain', 2);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (32, 2015, 'ViceCaptain', 171);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (33, 2016, 'ViceCaptain', 200);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (34, 2017, 'ViceCaptain', 199);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (35, 2018, 'ViceCaptain', 163);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (36, 2019, 'ViceCaptain', 163);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (37, 2020, 'ViceCaptain', 200);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (38, 2021, 'ViceCaptain', 200);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (39, 2022, 'ViceCaptain', 200);
INSERT INTO dbo.Committee (committee_id, Year, Role, player_id) VALUES (40, 2023, 'ViceCaptain', 204);

-- Player of the Year (Data = NULL unless there was bracketed info — none here)
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (1, 2004, 'PlayerOfTheYear', 1, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (2, 2005, 'PlayerOfTheYear', 3, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (3, 2006, 'PlayerOfTheYear', 27, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (4, 2007, 'PlayerOfTheYear', 43, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (5, 2008, 'PlayerOfTheYear', 65, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (6, 2009, 'PlayerOfTheYear', 42, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (7, 2010, 'PlayerOfTheYear', 2, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (8, 2011, 'PlayerOfTheYear', 97, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (9, 2012, 'PlayerOfTheYear', 213, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (10, 2013, 'PlayerOfTheYear', 125, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (11, 2014, 'PlayerOfTheYear', 213, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (12, 2015, 'PlayerOfTheYear', 213, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (13, 2016, 'PlayerOfTheYear', 204, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (14, 2017, 'PlayerOfTheYear', 171, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (15, 2018, 'PlayerOfTheYear', 171, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (16, 2019, 'PlayerOfTheYear', 88, NULL);
-- 2020 blank -> skipped
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (17, 2021, 'PlayerOfTheYear', 47, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (18, 2022, 'PlayerOfTheYear', 204, NULL);

-- Main awards: only set Data when the page had bracketed info (we store inner text only)
-- 2004
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (19, 2004, 'PlayersPlayerOfTheYear', 1, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (20, 2004, 'CaptainsPlayerOfTheYear', 4, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (21, 2004, 'BatsmanOfTheYear', 21, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (22, 2004, 'BowlerOfTheYear', 4, NULL);

-- 2005
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (23, 2005, 'PlayersPlayerOfTheYear', 3, NULL);

-- 2006
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (24, 2006, 'PlayersPlayerOfTheYear', 27, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (25, 2006, 'CaptainsPlayerOfTheYear', 2, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (26, 2006, 'BatsmanOfTheYear', 27, '388 runs @ 78');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (27, 2006, 'BowlerOfTheYear', 27, '16 wkts @ 8');

-- 2007
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (28, 2007, 'PlayersPlayerOfTheYear', 43, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (29, 2007, 'CaptainsPlayerOfTheYear', 9, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (30, 2007, 'BatsmanOfTheYear', 3, '295 runs @ 74');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (31, 2007, 'BowlerOfTheYear', 21, '23 wkts @ 11');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (32, 2007, 'FielderOfTheYear', 46, NULL);

-- 2008
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (33, 2008, 'PlayersPlayerOfTheYear', 65, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (34, 2008, 'BatsmanOfTheYear', 42, '204 runs @ 20.4');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (35, 2008, 'BowlerOfTheYear', 3, '23 wkts @ 12.8');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (36, 2008, 'FielderOfTheYear', 1, NULL);

-- 2009
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (37, 2009, 'PlayersPlayerOfTheYear', 42, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (38, 2009, 'CaptainsPlayerOfTheYear', 45, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (39, 2009, 'BatsmanOfTheYear', 42, '479 runs @ 60');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (40, 2009, 'BowlerOfTheYear', 43, '34 wkts @ 11');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (41, 2009, 'FielderOfTheYear', 1, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (42, 2009, 'MostImprovedPlayer', 62, NULL);

-- 2010
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (43, 2010, 'PlayersPlayerOfTheYear', 2, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (44, 2010, 'CaptainsPlayerOfTheYear', 65, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (45, 2010, 'BatsmanOfTheYear', 2, '665 runs @ 44');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (46, 2010, 'BowlerOfTheYear', 43, '33 wkts @ 14');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (47, 2010, 'FielderOfTheYear', 47, NULL);

-- 2011
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (48, 2011, 'PlayersPlayerOfTheYear', 97, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (49, 2011, 'CaptainsPlayerOfTheYear', 125, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (50, 2011, 'BatsmanOfTheYear', 97, '730 runs @ 91');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (51, 2011, 'BowlerOfTheYear', 65, '25 wkts @ 17');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (52, 2011, 'FielderOfTheYear', 213, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (53, 2011, 'MostImprovedPlayer', 45, NULL);

-- 2012
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (54, 2012, 'PlayersPlayerOfTheYear', 213, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (55, 2012, 'CaptainsPlayerOfTheYear', 97, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (56, 2012, 'BatsmanOfTheYear', 213, '696 runs @ 58');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (57, 2012, 'BowlerOfTheYear', 125, '29 wkts @ 14');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (58, 2012, 'FielderOfTheYear', 2, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (59, 2012, 'MostImprovedPlayer', 35, NULL);

-- 2013
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (60, 2013, 'PlayersPlayerOfTheYear', 125, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (61, 2013, 'CaptainsPlayerOfTheYear', 213, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (62, 2013, 'BatsmanOfTheYear', 97, '582 runs @ 66');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (63, 2013, 'BowlerOfTheYear', 65, '24 wkts @ 17');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (64, 2013, 'FielderOfTheYear', 2, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (65, 2013, 'MostImprovedPlayer', 47, NULL);

-- 2014
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (66, 2014, 'PlayersPlayerOfTheYear', 213, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (67, 2014, 'CaptainsPlayerOfTheYear', 171, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (68, 2014, 'BatsmanOfTheYear', 213, '464 runs @ 65');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (69, 2014, 'BowlerOfTheYear', 65, '19 wkts @ 15');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (70, 2014, 'FielderOfTheYear', 1, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (71, 2014, 'MostImprovedPlayer', 163, NULL);

-- 2015
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (72, 2015, 'PlayersPlayerOfTheYear', 213, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (73, 2015, 'CaptainsPlayerOfTheYear', 200, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (74, 2015, 'BatsmanOfTheYear', 213, '582 runs @ 48.5');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (75, 2015, 'BowlerOfTheYear', 65, '34 wkts @ 15');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (76, 2015, 'FielderOfTheYear', 2, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (77, 2015, 'MostImprovedPlayer', 87, NULL);

-- 2016
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (78, 2016, 'PlayersPlayerOfTheYear', 204, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (79, 2016, 'CaptainsPlayerOfTheYear', 2, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (80, 2016, 'BatsmanOfTheYear', 204, '492 runs @ 41');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (81, 2016, 'BowlerOfTheYear', 171, '31 wkts @ 7');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (82, 2016, 'FielderOfTheYear', 213, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (83, 2016, 'MostImprovedPlayer', 204, NULL);

-- 2017
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (84, 2017, 'PlayersPlayerOfTheYear', 171, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (85, 2017, 'CaptainsPlayerOfTheYear', 204, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (86, 2017, 'BatsmanOfTheYear', 221, '518 runs @ 86.33');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (87, 2017, 'BowlerOfTheYear', 171, '23 wkts @ 14');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (88, 2017, 'FielderOfTheYear', 163, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (89, 2017, 'MostImprovedPlayer', 163, NULL);

-- 2018
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (90, 2018, 'PlayersPlayerOfTheYear', 171, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (91, 2018, 'CaptainsPlayerOfTheYear', 200, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (92, 2018, 'BatsmanOfTheYear', 200, '567 runs @ 141.75');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (93, 2018, 'BowlerOfTheYear', 171, '22 wkts @ 18');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (94, 2018, 'FielderOfTheYear', 200, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (95, 2018, 'MostImprovedPlayer', 88, NULL);

-- 2019
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (96, 2019, 'PlayersPlayerOfTheYear', 88, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (97, 2019, 'CaptainsPlayerOfTheYear', 163, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (98, 2019, 'BatsmanOfTheYear', 163, '462 runs @ 35.54');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (99, 2019, 'BowlerOfTheYear', 88, '27 wkts @ 12');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (100, 2019, 'FielderOfTheYear', 47, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (101, 2019, 'MostImprovedPlayer', 163, NULL);

-- 2020 (skipped C. Ovid entries)
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (102, 2020, 'BatsmanOfTheYear', 2, '242 runs @ 24.2');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (103, 2020, 'BowlerOfTheYear', 88, '13 wkts @ 14');

-- 2021
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (104, 2021, 'PlayersPlayerOfTheYear', 47, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (105, 2021, 'CaptainsPlayerOfTheYear', 200, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (106, 2021, 'BatsmanOfTheYear', 2, '571 runs @ 33.59');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (107, 2021, 'BowlerOfTheYear', 47, '22 wkts @ 18');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (108, 2021, 'FielderOfTheYear', 1, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (109, 2021, 'MostImprovedPlayer', 47, NULL);

-- 2022
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (110, 2022, 'PlayersPlayerOfTheYear', 204, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (111, 2022, 'CaptainsPlayerOfTheYear', 204, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (112, 2022, 'BatsmanOfTheYear', 204, '449 runs @ 34.54');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (113, 2022, 'BowlerOfTheYear', 65, '23 wkts @ 17');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (114, 2022, 'FielderOfTheYear', 200, NULL);
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (115, 2022, 'MostImprovedPlayer', 204, NULL);

-- Hall of Fame -> CorridorOfUncertainty (Data is YouTube embed URL)
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (116, 2008, 'CorridorOfUncertainty', 21, 'https://www.youtube.com/embed/TfbYZxot8ek');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (117, 2009, 'CorridorOfUncertainty', 17, 'https://www.youtube.com/embed/JF9WgDY2bw8');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (118, 2010, 'CorridorOfUncertainty', 3,  'https://www.youtube.com/embed/_to1fIcc-cY');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (119, 2011, 'CorridorOfUncertainty', 1,  'https://www.youtube.com/embed/cm4u1irM9U4');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (120, 2012, 'CorridorOfUncertainty', 43, 'https://www.youtube.com/embed/w7_Gp1xPfuc');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (121, 2013, 'CorridorOfUncertainty', 9,  'https://www.youtube.com/embed/ffju3JkcbHQ');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (122, 2014, 'CorridorOfUncertainty', 125,'https://www.youtube.com/embed/F0Vqb7EJjng');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (123, 2014, 'CorridorOfUncertainty', 2,  'https://www.youtube.com/embed/HWeb-6s-whQ');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (124, 2014, 'CorridorOfUncertainty', 45, 'https://www.youtube.com/embed/T54xZvzu1xo');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (125, 2014, 'CorridorOfUncertainty', 12, 'https://www.youtube.com/embed/khbf4tOiNkM');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (126, 2015, 'CorridorOfUncertainty', 65, 'https://www.youtube.com/embed/bybkcHYajJI');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (127, 2016, 'CorridorOfUncertainty', 47, 'https://www.youtube.com/embed/Eko_ih__G8g');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (128, 2017, 'CorridorOfUncertainty', 213,'https://www.youtube.com/embed/TODO');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (129, 2018, 'CorridorOfUncertainty', 171,'https://www.youtube.com/embed/g1l6HAyCBMM');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (130, 2019, 'CorridorOfUncertainty', 163,'https://www.youtube.com/embed/sLHp4yUpFO4');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (131, 2021, 'CorridorOfUncertainty', 88, 'https://www.youtube.com/embed/gHN-UmjcWCM');
INSERT INTO dbo.Awards (award_id, Year, Award, player_id, Data) VALUES (132, 2022, 'CorridorOfUncertainty', 199,'https://www.youtube.com/embed/BcVdx84BtJ4');

COMMIT TRANSACTION;

