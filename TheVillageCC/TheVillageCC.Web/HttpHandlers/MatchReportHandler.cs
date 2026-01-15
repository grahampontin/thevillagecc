using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using CricketClubDAL;
using CricketClubDomain;
using CricketClubMiddle;
using TheVillageCC.Web.Domain;

namespace TheVillageCC.Web.HttpHandlers
{
    public class MatchReportHandler : HttpHandlerBase
    {
        private readonly IDao database;
        private readonly JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();

        public MatchReportHandler() : this(new Dao())
        {
        }

        public MatchReportHandler(IDao database)
        {
            this.database = database;
        }

        public override void ProcessRequest(IHandlerContext context)
        {
            var matchId = ExtractMatchIdFromUrl(context.Request.Url.ToString());

            switch (context.Request.HttpMethod)
            {
                case "GET":
                    if (matchId == null)
                    {
                        GetAllMatchReports(context);
                    }
                    else
                    {
                        GetMatchReport(context, matchId.Value);
                    }
                    break;
                case "POST":
                    if (matchId == null)
                    {
                        context.Response.ContentType = "text/plain";
                        context.Response.Write("Match ID not specified in URL");
                        context.Response.StatusCode = 400;
                        return;
                    }
                    SaveMatchReport(context, matchId.Value);
                    break;
                default:
                    context.Response.StatusCode = 405; // Method Not Allowed
                    break;
            }
        }

        private int? ExtractMatchIdFromUrl(string url)
        {
            var matchCollection = Regex.Matches(url, "/matchreports/([0-9]+)");
            if (matchCollection.Count == 1)
            {
                return int.Parse(matchCollection[0].Groups[1].Value);
            }
            return null;
        }

        private void GetMatchReport(IHandlerContext context, int matchId)
        {
            var match = new CricketClubMiddle.Match(matchId, database);
            var savedReport = match.GetMatchReport();
            var matchReport = new MatchReportV1(savedReport.Conditions, savedReport.Report,
                savedReport.ReportImage);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 200;
            context.Response.Write(javaScriptSerializer.Serialize(matchReport));
        }

        private void GetAllMatchReports(IHandlerContext context)
        {
            // Parse query parameters
            var queryString = context.Request.QueryString;
            var limitParam = queryString["limit"] ?? queryString["count"];
            var orderParam = queryString["order"] ?? queryString["orderBy"];

            // Default values
            int? limit = null;
            bool descending = true; // Default to most recent first

            if (!string.IsNullOrEmpty(limitParam) && int.TryParse(limitParam, out var parsedLimit))
            {
                limit = parsedLimit;
            }

            if (!string.IsNullOrEmpty(orderParam))
            {
                descending = orderParam.ToLower() == "desc" || orderParam.ToLower() == "descending";
            }

            // Get all matches with results
            var matches = Match.GetResults();
            
            // Order by date and filter for matches with reports
            var orderedMatches = descending 
                ? matches.OrderByDescending(m => m.MatchDate) 
                : matches.OrderBy(m => m.MatchDate);

            var matchReports = orderedMatches
                .Select(m => new { Match = m, Report = m.GetMatchReport() })
                .Where(mr => mr.Report != MatchReportAndConditions.None && !string.IsNullOrEmpty(mr.Report.Report))
                .Select(mr => MatchReportListItemV1.FromInternal(mr.Match, mr.Report));

            // Apply limit if specified
            if (limit.HasValue)
            {
                matchReports = matchReports.Take(limit.Value);
            }

            var result = matchReports.ToList();

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 200;
            context.Response.Write(javaScriptSerializer.Serialize(result));
        }

        private void SaveMatchReport(IHandlerContext context, int matchId)
        {
            var stringReader = new StreamReader(context.Request.InputStream);
            string postData = stringReader.ReadToEnd();
            var report = javaScriptSerializer.Deserialize<MatchReportV1>(postData);
            
            var match = new CricketClubMiddle.Match(matchId, database);
            match.CreateOrUpdateMatchReport(report.Conditions, report.Report, report.Base64EncodedImage);
            
            var updatedReport = match.GetMatchReport();
            var updatedMatchReport = new MatchReportV1(updatedReport.Conditions, updatedReport.Report,
                updatedReport.ReportImage);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 200;
            context.Response.Write(javaScriptSerializer.Serialize(updatedMatchReport));
        }
    }
}
