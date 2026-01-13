using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using CricketClubDAL;
using CricketClubDomain;
using CricketClubMiddle;
using TheVillageCC.Web.Domain;

namespace TheVillageCC.Web.HttpHandlers
{
    // ReSharper disable once UnusedType.Global
    public class MatchesHandler : EntityHttpHandlerBase<MatchV1>
    {
        public MatchesHandler() : base()
        {
        }

        public MatchesHandler(IDao database) : base(database)
        {
        }

        protected override MatchV1 UpdateEntity(MatchV1 entity)
        {
            var match = new Match(entity.Id, Database)
            {
                OppositionID = entity.Opposition.Id,
                VenueID = entity.Venue.Id,
                MatchDate = DateTime.Parse(entity.Date),
                HomeOrAway = entity.IsHome ? HomeOrAway.Home : HomeOrAway.Away,
                Type = (MatchType)Enum.Parse(typeof(MatchType), entity.Type, true)
            };
            match.Save();
            return entity;
        }

        protected override void DeleteEntity(int id)
        {
            throw new System.NotImplementedException();
        }

        protected override MatchV1 CreateEntity(MatchV1 deserializeRequestBody)
        {
            var matchType = (MatchType)Enum.Parse(typeof(MatchType), deserializeRequestBody.Type, true);
            var homeOrAway = deserializeRequestBody.IsHome ? HomeOrAway.Home : HomeOrAway.Away;
            var match = Match.CreateNewMatch(
                new Team(deserializeRequestBody.Opposition.Id, Database),
                DateTime.Parse(deserializeRequestBody.Date),
                new Venue(deserializeRequestBody.Venue.Id, Database),
                matchType,
                homeOrAway,
                Database);
            return MatchV1.FromInternal(match);
        }

        protected override List<MatchV1> GetAllEntities(NameValueCollection requestQueryString)
        {
            var season = requestQueryString["season"];
            
            if (season != null && int.TryParse(season, out var seasonAsInt))
            {
                return Match.GetAll(new DateTime(seasonAsInt, 1, 1), new DateTime(seasonAsInt, 12, 31), null, null, Database)
                    .OrderBy(m => m.MatchDate).Select(MatchV1.FromInternal).ToList();
            }

            // Default: return in-progress games and upcoming fixtures in MatchV1 format
            var matchDescriptors = Match.GetInProgressGames(Database)
                .Union(Match.GetFixtures(Database).Where(m =>
                    m.MatchDate < DateTime.Today.AddDays(14) &&
                    !m.GetCurrentBallByBallState().IsMatchComplete()))
                .Select(MatchV1.FromInternal)
                .ToList();
            return matchDescriptors;
        }

        protected override MatchV1 GetEntity(int id)
        {
            var match = new Match(id, Database);
            return MatchV1.FromInternal(match);
        }

        public override string GetTypeName()
        {
            return "matches";
        }
    }
}
