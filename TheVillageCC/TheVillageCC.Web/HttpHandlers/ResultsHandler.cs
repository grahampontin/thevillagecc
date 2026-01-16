using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using CricketClubDAL;
using CricketClubMiddle;
using TheVillageCC.Web.Domain;

namespace TheVillageCC.Web.HttpHandlers
{
    public class ResultsHandler : HttpHandlerBase
    {
        private readonly IDao database;
        private readonly JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();

        public ResultsHandler() : this(new Dao())
        {
        }

        public ResultsHandler(IDao database)
        {
            this.database = database;
        }

        public override void ProcessRequest(IHandlerContext context)
        {
            switch (context.Request.HttpMethod)
            {
                case "GET":
                    GetResults(context);
                    break;
                default:
                    context.Response.StatusCode = 405; // Method Not Allowed
                    break;
            }
        }

        private void GetResults(IHandlerContext context)
        {
            // Parse season query parameter
            var queryString = context.Request.QueryString;
            var seasonParam = queryString["season"];

            // Default to current year if no season specified
            int season = DateTime.Now.Year;
            if (!string.IsNullOrEmpty(seasonParam) && int.TryParse(seasonParam, out var parsedSeason))
            {
                season = parsedSeason;
            }

            // Get results for the season (Jan 1 to Dec 31 of the specified year)
            var startDate = new DateTime(season, 1, 1);
            var endDate = new DateTime(season, 12, 31);
            var matches = Match.GetResults(database);

            // Filter matches by date range
            var filteredMatches = matches
                .Where(m => m.MatchDate >= startDate && m.MatchDate <= endDate)
                .ToList();

            // Convert to ResultV1
            var results = filteredMatches.Select(ResultV1.FromInternal).ToList();

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 200;
            context.Response.Write(javaScriptSerializer.Serialize(results));
        }
    }
}
