using System.IO;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using CricketClubDAL;
using CricketClubDomain;
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
            if (matchId == null)
            {
                context.Response.ContentType = "text/plain";
                context.Response.Write("Match ID not specified in URL");
                context.Response.StatusCode = 400;
                return;
            }

            switch (context.Request.HttpMethod)
            {
                case "GET":
                    GetMatchReport(context, matchId.Value);
                    break;
                case "POST":
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
