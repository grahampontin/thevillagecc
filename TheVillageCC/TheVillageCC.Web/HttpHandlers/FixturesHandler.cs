using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using CricketClubDAL;
using CricketClubMiddle;
using TheVillageCC.Web.Domain;

namespace TheVillageCC.Web.HttpHandlers
{
    public class FixturesHandler : HttpHandlerBase
    {
        private readonly IDao database;
        private readonly JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();

        public FixturesHandler() : this(new Dao())
        {
        }

        public FixturesHandler(IDao database)
        {
            this.database = database;
        }

        public override void ProcessRequest(IHandlerContext context)
        {
            switch (context.Request.HttpMethod)
            {
                case "GET":
                    GetFixtures(context);
                    break;
                default:
                    context.Response.StatusCode = 405; // Method Not Allowed
                    break;
            }
        }

        private void GetFixtures(IHandlerContext context)
        {
            // Parse season query parameter
            var queryString = context.Request.QueryString;
            var seasonParam = queryString["season"];

            // Get fixtures using Match.GetFixtures()
            var matches = Match.GetFixtures(database);

            // Filter by season if specified
            if (!string.IsNullOrEmpty(seasonParam) && int.TryParse(seasonParam, out var season))
            {
                var startDate = new DateTime(season, 1, 1);
                var endDate = new DateTime(season, 12, 31);
                matches = matches.Where(m => m.MatchDate >= startDate && m.MatchDate <= endDate).ToList();
            }

            // Convert to MatchV1
            var fixtures = matches.Select(MatchV1.FromInternal).ToList();

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 200;
            context.Response.Write(javaScriptSerializer.Serialize(fixtures));
        }
    }
}
