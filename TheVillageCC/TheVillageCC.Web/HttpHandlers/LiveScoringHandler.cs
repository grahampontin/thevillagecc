using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using CricketClubDAL;
using CricketClubDomain;
using CricketClubMiddle;
using log4net;
using TheVillageCC.Web.Domain;

namespace TheVillageCC.Web.HttpHandlers
{
    // ReSharper disable once UnusedType.Global
    public class LiveScoringHandler : HttpHandlerBase
    {
        private readonly IDao Database;
        private readonly JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();
        private static readonly ILog Log = LogManager.GetLogger(typeof(LiveScoringHandler));

        public LiveScoringHandler() : this(new Dao())
        {
        }

        public LiveScoringHandler(IDao database)
        {
            Database = database;
        }

        public override void ProcessRequest(IHandlerContext context)
        {
            try
            {
                var path = context.Request.Url.AbsolutePath.ToLower();
                var method = context.Request.HttpMethod.ToUpper();

                // GET /api/livescoring/matches or GET /api/livescoring/matches?season=2023
                if (Regex.IsMatch(path, @"^/api/livescoring/matches/?$", RegexOptions.IgnoreCase) && method == "GET")
                {
                    HandleListMatches(context);
                }
                // GET /api/livescoring/{matchId}/scorecard
                else if (Regex.IsMatch(path, @"^/api/livescoring/\d+/scorecard/?$", RegexOptions.IgnoreCase) && method == "GET")
                {
                    var matchId = ExtractMatchId(path, @"^/api/livescoring/(\d+)/scorecard");
                    HandleLiveScorecard(context, matchId);
                }
                // GET /api/livescoring/{matchId}
                else if (Regex.IsMatch(path, @"^/api/livescoring/\d+/?$", RegexOptions.IgnoreCase) && method == "GET")
                {
                    var matchId = ExtractMatchId(path, @"^/api/livescoring/(\d+)");
                    HandleMatchState(context, matchId);
                }
                // POST /api/livescoring/{matchId}/start
                else if (Regex.IsMatch(path, @"^/api/livescoring/\d+/start/?$", RegexOptions.IgnoreCase) && method == "POST")
                {
                    var matchId = ExtractMatchId(path, @"^/api/livescoring/(\d+)/start");
                    HandleStartMatch(context, matchId);
                }
                // POST /api/livescoring/{matchId}/over
                else if (Regex.IsMatch(path, @"^/api/livescoring/\d+/over/?$", RegexOptions.IgnoreCase) && method == "POST")
                {
                    var matchId = ExtractMatchId(path, @"^/api/livescoring/(\d+)/over");
                    HandleSubmitOver(context, matchId);
                }
                // POST /api/livescoring/{matchId}/opposition-score
                else if (Regex.IsMatch(path, @"^/api/livescoring/\d+/opposition-score/?$", RegexOptions.IgnoreCase) && method == "POST")
                {
                    var matchId = ExtractMatchId(path, @"^/api/livescoring/(\d+)/opposition-score");
                    HandleUpdateOppositionScore(context, matchId);
                }
                // POST /api/livescoring/{matchId}/end-innings
                else if (Regex.IsMatch(path, @"^/api/livescoring/\d+/end-innings/?$", RegexOptions.IgnoreCase) && method == "POST")
                {
                    var matchId = ExtractMatchId(path, @"^/api/livescoring/(\d+)/end-innings");
                    HandleEndInnings(context, matchId);
                }
                // DELETE /api/livescoring/{matchId}/last-over
                else if (Regex.IsMatch(path, @"^/api/livescoring/\d+/last-over/?$", RegexOptions.IgnoreCase) && method == "DELETE")
                {
                    var matchId = ExtractMatchId(path, @"^/api/livescoring/(\d+)/last-over");
                    HandleDeleteLastOver(context, matchId);
                }
                // DELETE /api/livescoring/{matchId}/reset
                else if (Regex.IsMatch(path, @"^/api/livescoring/\d+/reset/?$", RegexOptions.IgnoreCase) && method == "DELETE")
                {
                    var matchId = ExtractMatchId(path, @"^/api/livescoring/(\d+)/reset");
                    HandleResetMatch(context, matchId);
                }
                // POST /api/livescoring/{matchId}/force-end
                else if (Regex.IsMatch(path, @"^/api/livescoring/\d+/force-end/?$", RegexOptions.IgnoreCase) && method == "POST")
                {
                    var matchId = ExtractMatchId(path, @"^/api/livescoring/(\d+)/force-end");
                    HandleForceEndMatch(context, matchId);
                }
                else
                {
                    context.Response.StatusCode = 404;
                    context.Response.ContentType = "text/plain";
                    context.Response.Write("Not Found");
                }
            }
            catch (BadRequestException ex)
            {
                Log.Error("Bad request error in LiveScoringHandler", ex);
                context.Response.StatusCode = 400;
                context.Response.ContentType = "text/plain";
                context.Response.Write(ex.Message);
                context.Response.End();
            }
            catch (Exception ex)
            {
                Log.Error("Error in LiveScoringHandler", ex);
                context.Response.StatusCode = 500;
                context.Response.ContentType = "text/plain";
                context.Response.Write(ex.Message + Environment.NewLine + ex.StackTrace);
                context.Response.End();
            }
        }

        private int ExtractMatchId(string path, string pattern)
        {
            var match = Regex.Match(path, pattern, RegexOptions.IgnoreCase);
            if (!match.Success)
            {
                throw new BadRequestException("Invalid match ID in URL");
            }
            return int.Parse(match.Groups[1].Value);
        }

        private void HandleListMatches(IHandlerContext context)
        {
            var seasonParam = context.Request.QueryString["season"];
            
            if (seasonParam != null && int.TryParse(seasonParam, out var season))
            {
                // matchesBySeason functionality
                var matchDescriptors = Match.GetAll(new DateTime(season, 1, 1), new DateTime(season, 12, 31), null, null, Database)
                    .OrderBy(m => m.MatchDate).Select(MatchV1.FromInternal).ToList();
                WriteJsonResponse(context, matchDescriptors);
            }
            else
            {
                // listMatches functionality
                var matchDescriptors = Match.GetInProgressGames()
                    .Union(Match.GetFixtures().Where(m =>
                        m.MatchDate < DateTime.Today.AddDays(14) &&
                        !m.GetCurrentBallByBallState().IsMatchComplete()))
                    .Select(m => new BallByBallMatchDescriptor(m))
                    .Distinct(BallByBallMatchDescriptor.MatchIdComparer).ToList();
                WriteJsonResponse(context, matchDescriptors);
            }
        }

        private void HandleMatchState(IHandlerContext context, int matchId)
        {
            var match = new Match(matchId, Database);
            ReturnCurrentMatchState(context, match);
        }

        private void HandleLiveScorecard(IHandlerContext context, int matchId)
        {
            var match = new Match(matchId, Database);
            var liveScorecard = FromLiveScorecard(match);
            WriteJsonResponse(context, liveScorecard);
        }

        private void HandleStartMatch(IHandlerContext context, int matchId)
        {
            var match = new Match(matchId, Database);
            if (match.GetIsBallByBallInProgress())
            {
                throw new BadRequestException("Coverage for match vs " + match.Opposition.Name + " has already been started");
            }

            var matchConditions = DeserializeRequestBody<BallByBallMatchConditions>(context);
            match.StartBallByBallCoverage(matchConditions);
            ReturnCurrentMatchState(context, match);
        }

        private void HandleSubmitOver(IHandlerContext context, int matchId)
        {
            var match = new Match(matchId, Database);
            var stateFromClient = DeserializeRequestBody<MatchState>(context);
            match.UpdateCurrentBallByBallState(stateFromClient);
            ReturnCurrentMatchState(context, match);
        }

        private void HandleUpdateOppositionScore(IHandlerContext context, int matchId)
        {
            var match = new Match(matchId, Database);
            var incoming = DeserializeRequestBody<OppositionInningsDetails>(context);
            match.UpdateOppositionScore(incoming);
            ReturnCurrentMatchState(context, match);
        }

        private void HandleEndInnings(IHandlerContext context, int matchId)
        {
            var match = new Match(matchId, Database);
            var inningsEndDetails = DeserializeRequestBody<InningsEndDetails>(context);
            match.EndInnings(inningsEndDetails);
            ReturnCurrentMatchState(context, match);
        }

        private void HandleDeleteLastOver(IHandlerContext context, int matchId)
        {
            var match = new Match(matchId, Database);
            match.DeleteLastBallByBallOver();
            ReturnCurrentMatchState(context, match);
        }

        private void HandleResetMatch(IHandlerContext context, int matchId)
        {
            var match = new Match(matchId, Database);
            match.ResetBallByBallData();
            context.Response.ContentType = "text/plain";
            context.Response.StatusCode = 204;
        }

        private void HandleForceEndMatch(IHandlerContext context, int matchId)
        {
            var match = new Match(matchId, Database);
            var nextInnings = EndInnings(match, match.GetCurrentBallByBallState().GetInningsStatus().OurInningsStatus == InningsStatus.InProgress
                ? "Batting"
                : "Bowling");
            match = new Match(matchId, Database);
            switch (nextInnings)
            {
                case NextInnings.Batting:
                    EndInnings(match, "Batting");
                    break;
                case NextInnings.Bowling:
                    EndInnings(match, "Bowling");
                    break;
                case NextInnings.GameOver:
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }
            context.Response.StatusCode = 204;
        }

        private static NextInnings EndInnings(Match match, string inningsType)
        {
            return match.EndInnings(new InningsEndDetails()
            {
                Commentary = "",
                InningsType = inningsType,
                WasDeclared = false
            });
        }

        private LiveScorecardV1 FromLiveScorecard(Match match)
        {
            var matchReportAndConditions = match.GetMatchReport();
            var external = new LiveScorecardV1
            {
                MatchData = MatchV1.FromInternal(match),
                InPlayData = match.GetLiveScorecard(),
                FinalScorecard = MatchScorecardV1.GetExternalScorecard(match),
                MatchReport = new MatchReportV1(matchReportAndConditions.Conditions,
                    matchReportAndConditions.Report, matchReportAndConditions.ReportImage),
                Result = ResultV1.FromInternal(match)
            };
            return external;
        }

        private void ReturnCurrentMatchState(IHandlerContext context, Match match)
        {
            BallByBallMatch ballByBallMatch = match.GetCurrentBallByBallState();
            MatchState matchState = ballByBallMatch.GetMatchState();
            var matchStateV1 = MatchStateMapper.MapToMatchStateV1(matchState);
            matchStateV1.LiveScorecard = FromLiveScorecard(match);
            WriteJsonResponse(context, matchStateV1);
        }

        private T DeserializeRequestBody<T>(IHandlerContext context)
        {
            var stringReader = new StreamReader(context.Request.InputStream);
            string body = stringReader.ReadToEnd();
            return javaScriptSerializer.Deserialize<T>(body);
        }

        private void WriteJsonResponse(IHandlerContext context, object data)
        {
            string json = javaScriptSerializer.Serialize(data);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 200;
            context.Response.Write(json);
        }
    }
}
