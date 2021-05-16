<%@ WebHandler Language="C#" Class="CommandHandler" %>

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using api.model;
using CricketClubDAL;
using CricketClubDomain;
using CricketClubMiddle;
using CricketClubMiddle.Stats;

public class CommandHandler : IHttpHandler
{
    private readonly JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();

    public void ProcessRequest(HttpContext context)
    {
        var stringReader = new StreamReader(context.Request.InputStream);
        string postData = stringReader.ReadToEnd();
        var genericBallByBallCommand = javaScriptSerializer.Deserialize<GenericBallByBallCommand>(postData);
        context.Response.ContentType = "text/json";
        context.Response.StatusCode = 200;

        try
        {
            switch (genericBallByBallCommand.command)
            {
                case "listMatches":
                    {
                        var matchDescriptors = Match.GetInProgressGames().Union(Match.GetFixtures().Where(m=>m.MatchDate < DateTime.Today.AddDays(14) && !m.GetCurrentBallByBallState().IsMatchComplete())).Select(m => new BallByBallMatchDescriptor(m)).Distinct(BallByBallMatchDescriptor.MatchIdComparer).ToList();
                        context.Response.Write(javaScriptSerializer.Serialize(matchDescriptors));
                        return;
                    }
                case "matchesBySeason":
                    {
                        var season = (int)genericBallByBallCommand.payload;
                        var matchDescriptors = Match.GetAll(new DateTime(season, 1,1), new DateTime(season,12,31), null, null).OrderBy(m=>m.MatchDate).Select(MatchV1.FromInternal).ToList();
                        context.Response.Write(javaScriptSerializer.Serialize(matchDescriptors));
                        return;
                    }
                case "listPlayers":
                {
                    var includeInactive = false;
                    var inactiveQueryParam = context.Request.Params.GetValues("includeInactive");
                    if (inactiveQueryParam != null && inactiveQueryParam.Length > 0 && inactiveQueryParam[0] == "true")
                    {
                        includeInactive = true;
                    }

                    var players = Player.GetAll().Where(p => (p.IsActive || includeInactive) && p.ID > 0)
                        .OrderByDescending(p => p.NumberOfMatchesPlayedThisSeason).ThenBy(p => p.FormalName)
                        .Select(PlayerV1.FromInternal).ToList();
                    context.Response.Write(javaScriptSerializer.Serialize(players));
                    return;
                }
                case "listTeams":
                    {
                        var teams = Team.GetAll().Where(t => !t.IsUs)
                            .Select(TeamV1.FromInternal).OrderBy(t => t.Name).ToList();
                        context.Response.Write(javaScriptSerializer.Serialize(teams));
                        return;
                    }
                case "listVenues":
                    {
                        var venues = Venue.GetAll()
                            .Select(VenueV1.FromInternal).OrderBy(t => t.Name).ToList();
                        context.Response.Write(javaScriptSerializer.Serialize(venues));
                        return;
                    }
                case "updateTeam":
                    CreateOrUpdateStaticDataItem<TeamV1>(context, genericBallByBallCommand, t =>
                    {
                        var team = new Team(t.Id) {Name = t.Name};
                        team.Save();
                    });
                    return;
                case "updateVenue":
                    CreateOrUpdateStaticDataItem<VenueV1>(context, genericBallByBallCommand, v =>
                    {
                        var venue = new Venue(v.Id) {Name = v.Name, GoogleMapsLocationURL = v.MapUrl};
                        venue.Save();
                    });
                    return;
                case "updateMatch":
                    CreateOrUpdateStaticDataItem<MatchV1>(context, genericBallByBallCommand, v =>
                    {
                        var venue = new Match(v.Id)
                        {
                            OppositionID = v.Opposition.Id,
                            VenueID = v.Venue.Id,
                            MatchDate = DateTime.Parse(v.Date),
                            HomeOrAway = HomeOrAway(v),
                            Type = ParseMatchType(v)
                        };
                        venue.Save();
                    });
                    return;
                case "updatePlayer":
                    CreateOrUpdateStaticDataItem<PlayerV1>(context, genericBallByBallCommand, p => UpdatePlayer(new Player(p.playerId), p));
                    return;
                case "createTeam":
                    CreateOrUpdateStaticDataItem<TeamV1>(context, genericBallByBallCommand, t => Team.CreateNewTeam(t.Name));
                    return;
                case "createVenue":
                    CreateOrUpdateStaticDataItem<VenueV1>(context, genericBallByBallCommand, v => Venue.CreateNewVenue(v.Name, v.MapUrl));
                    return;
                case "createMatch":
                    CreateOrUpdateStaticDataItem<MatchV1>(context, genericBallByBallCommand, v => Match.CreateNewMatch(new Team(v.Opposition.Id), DateTime.Parse(v.Date), new Venue(v.Venue.Id), ParseMatchType(v), HomeOrAway(v)));
                    return;
                case "createPlayer":
                    CreateOrUpdateStaticDataItem<PlayerV1>(context, genericBallByBallCommand, p => UpdatePlayer(Player.CreateNewPlayer(p.firstName + " " + p.surname), p));
                    return;
                default:
                    {
                        var match = new Match(genericBallByBallCommand.matchId);
                        switch (genericBallByBallCommand.command)
                        {
                            case "startMatch":
                                if (match.GetIsBallByBallInProgress())
                                {
                                    throw new InvalidOperationException("Coverage for match vs " + match.Opposition.Name + " has already been started");
                                }
                                match.StartBallByBallCoverage(GetMatchConditions(genericBallByBallCommand.payload));
                                ReturnCurrentMatchState(context, match);
                                break;
                            case "matchState":
                                ReturnCurrentMatchState(context, match);
                                break;
                            case "resetMatch":
                                match.ResetBallByBallData();
                                context.Response.ContentType = "text/plain";
                                context.Response.StatusCode = 204;
                                break;
                            case "submitOver":
                                var stateFromClient = javaScriptSerializer.Deserialize<MatchState>(javaScriptSerializer.Serialize(genericBallByBallCommand.payload));
                                match.UpdateCurrentBallByBallState(stateFromClient);
                                ReturnCurrentMatchState(context, match);
                                break;
                            case "liveScorecard":
                                //do stuff
                                if (!match.GetIsBallByBallInProgress())
                                {
                                    throw new InvalidOperationException("Match " + genericBallByBallCommand.matchId + " does not have any ball by ball coverage");
                                }

                                var liveScorecard = match.GetLiveScorecard();
                                string json = javaScriptSerializer.Serialize(liveScorecard);
                                context.Response.ContentType = "text/json";
                                context.Response.StatusCode = 200;
                                context.Response.Write(json);
                                break;
                            case "updateOppositionScore":
                                var incoming = javaScriptSerializer.Deserialize<OppositionInningsDetails>(javaScriptSerializer.Serialize(genericBallByBallCommand.payload));
                                match.UpdateOppositionScore(incoming);
                                ReturnCurrentMatchState(context, match);
                                break;
                            case "endInnings":
                                var inningsEndDetails = javaScriptSerializer.Deserialize<InningsEndDetails>(javaScriptSerializer.Serialize(genericBallByBallCommand.payload));
                                match.EndInnings(inningsEndDetails);
                                context.Response.ContentType = "text/json";
                                context.Response.StatusCode = 200;
                                ReturnCurrentMatchState(context, match);

                                break;
                            case "deleteLastOver":
                                match.DeleteLastBallByBallOver();
                                ReturnCurrentMatchState(context, match);
                                break;
                            case "getScorecard":
                                var scorecard = new MatchScorecardV1(match.GetOurBattingScoreCard(), match.GetThierBowlingStats(), new FoWStats(match.ID, ThemOrUs.Us), match.GetTheirBattingScoreCard(), match.GetOurBowlingStats(), new FoWStats(match.ID, ThemOrUs.Them), new Extras(match.ID, ThemOrUs.Them), new Extras(match.ID, ThemOrUs.Us), match);
                                context.Response.ContentType = "text/json";
                                context.Response.StatusCode = 200;
                                context.Response.Write(javaScriptSerializer.Serialize(scorecard));
                                break;
                            case "saveScorecard":
                                var unsavedScorecard = javaScriptSerializer.Deserialize<MatchScorecardV1>(javaScriptSerializer.Serialize(genericBallByBallCommand.payload));
                                if (unsavedScorecard.ourInnings.batting.entries.Any())
                                {
                                    var internalBattingCard = unsavedScorecard.ourInnings.batting.ToInternalBattingCard(match, ThemOrUs.Us);
                                    internalBattingCard.Save(BattingOrBowling.Batting);
                                }

                                if (unsavedScorecard.theirInnings.batting.entries.Any())
                                {
                                    var internalOppoBattingCard = unsavedScorecard.theirInnings.batting.ToInternalBattingCard(match, ThemOrUs.Them);
                                    internalOppoBattingCard.Save(BattingOrBowling.Bowling);
                                }
                                var internalExtras = unsavedScorecard.ourInnings.batting.ToInternalExtras(match.ID, ThemOrUs.Them);
                                internalExtras.Save();

                                var internalOppoExtras = unsavedScorecard.theirInnings.batting.ToInternalExtras(match.ID, ThemOrUs.Us);
                                internalOppoExtras.Save();

                                match.OurInningsLength = unsavedScorecard.ourInnings.inningsLength;
                                match.TheirInningsLength = unsavedScorecard.theirInnings.inningsLength;
                                match.Abandoned = unsavedScorecard.matchConditions.abandoned;
                                match.WasDeclaration = unsavedScorecard.matchConditions.declaration;
                                match.Overs = unsavedScorecard.matchConditions.overs;
                                match.Captain = new Player(unsavedScorecard.matchConditions.captainId);
                                match.WicketKeeper = new Player(unsavedScorecard.matchConditions.wicketKeeperId);
                                match.WonToss = unsavedScorecard.matchConditions.weWonTheToss;
                                match.TossWinnerBatted = unsavedScorecard.matchConditions.tossWinnerBatted;
                                match.Save();

                                if (unsavedScorecard.ourInnings.bowling.entries.Any())
                                {
                                    var theirBowlingStats = unsavedScorecard.ourInnings.bowling.ToInternal(match, ThemOrUs.Them);
                                    theirBowlingStats.Save();
                                }

                                if (unsavedScorecard.theirInnings.bowling.entries.Any())
                                {
                                    var ourBowlingStats = unsavedScorecard.theirInnings.bowling.ToInternal(match, ThemOrUs.Us);
                                    ourBowlingStats.Save();
                                }

                                if (unsavedScorecard.ourInnings.fow.entries.Any())
                                {
                                    var ourFowData = unsavedScorecard.ourInnings.fow.ToInternal(match, ThemOrUs.Us);
                                    ourFowData.Save();
                                }

                                var savedScorecard = new MatchScorecardV1(match.GetOurBattingScoreCard(), match.GetThierBowlingStats(), new FoWStats(match.ID, ThemOrUs.Us), match.GetTheirBattingScoreCard(), match.GetOurBowlingStats(), new FoWStats(match.ID, ThemOrUs.Them), new Extras(match.ID, ThemOrUs.Them), new Extras(match.ID, ThemOrUs.Us), match);
                                context.Response.ContentType = "text/json";
                                context.Response.StatusCode = 200;
                                context.Response.Write(javaScriptSerializer.Serialize(savedScorecard));
                                break;
                            case "saveMatchReport":
                                var report = javaScriptSerializer.Deserialize<MatchReportV1>(javaScriptSerializer.Serialize(genericBallByBallCommand.payload));
                                match.CreateOrUpdateMatchReport(report.Conditions, report.Report, report.Base64EncodedImage);
                                var updatedReport = match.GetMatchReport();
                                var updatedMatchReport = new MatchReportV1(updatedReport.Conditions, updatedReport.Report, updatedReport.ReportImage);
                                context.Response.ContentType = "text/json";
                                context.Response.StatusCode = 200;
                                context.Response.Write(javaScriptSerializer.Serialize(updatedMatchReport));
                                break;
                            case "getMatchReport":
                                var savedReport = match.GetMatchReport();
                                var matchReport = new MatchReportV1(savedReport.Conditions, savedReport.Report, savedReport.ReportImage);
                                context.Response.ContentType = "text/json";
                                context.Response.StatusCode = 200;
                                context.Response.Write(javaScriptSerializer.Serialize(matchReport));
                                break;
                            default:
                                context.Response.ContentType = "text/plain";
                                context.Response.Write("Command: " + genericBallByBallCommand.command + " is not supported");
                                context.Response.StatusCode = 400;
                                break;
                        }

                        break;
                    }
            }
        }
        catch(InvalidOperationException ex)
        {
            ReportInvalidInput(context, ex.Message);
        } catch(Exception ex)
        {
            ReportError(context, ex, 500);
        }



    }

    private static void UpdatePlayer(Player newPlayer, PlayerV1 p)
    {
        newPlayer.Nickname = p.nickname;
        newPlayer.BattingStyle = p.battingStyle;
        newPlayer.BowlingStyle = p.bowlingStyle;
        newPlayer.IsActive = p.isActive;
        newPlayer.FirstName = p.firstName;
        newPlayer.Surname = p.surname;
        newPlayer.MiddleInitials = p.middleInitials;
        newPlayer.RingerOf = new Player(p.clubConnection.playerId);
        newPlayer.IsRightHandBat = p.isRightHandBat;
        newPlayer.IsActive = p.isActive;
        newPlayer.Save();
    }

    private static HomeOrAway HomeOrAway(MatchV1 v)
    {
        return v.IsHome?CricketClubDomain.HomeOrAway.Home : CricketClubDomain.HomeOrAway.Away;
    }

    private static MatchType ParseMatchType(MatchV1 v)
    {
        return (MatchType) Enum.Parse(typeof(MatchType),v.Type, true);
    }

    private void CreateOrUpdateStaticDataItem<T>(HttpContext context, GenericBallByBallCommand genericBallByBallCommand, Action<T> createOrUpdateAction)
    {
        var staticDataItem =
            javaScriptSerializer.Deserialize<T>(javaScriptSerializer.Serialize(genericBallByBallCommand.payload));
        createOrUpdateAction(staticDataItem);
        context.Response.ContentType = "text/plain";
        context.Response.StatusCode = 204;
    }

    private void ReturnCurrentMatchState(HttpContext context, Match match)
    {
        BallByBallMatch ballByBallMatch = match.GetCurrentBallByBallState();
        string json = javaScriptSerializer.Serialize(ballByBallMatch.GetMatchState());
        context.Response.ContentType = "text/json";
        context.Response.StatusCode = 200;
        context.Response.Write(json);
    }

    private static void ReportError(HttpContext context, Exception ex, int statusCode)
    {
        context.Response.ContentType = "text/plain";
        context.Response.Write(ex.Message + Environment.NewLine + ex.StackTrace);
        context.Response.StatusCode = statusCode;
        DbLogger.Log(ex.Message, ex, Severity.Error);
    }

    private static void ReportInvalidInput(HttpContext context, string userMessage)
    {
        context.Response.ContentType = "text/plain";
        context.Response.Write(userMessage);
        context.Response.StatusCode = 400;
    }

    private BallByBallMatchConditions GetMatchConditions(object data)
    {
        var serialize = javaScriptSerializer.Serialize(data);
        return javaScriptSerializer.Deserialize<BallByBallMatchConditions>(serialize);
    }

    public bool IsReusable
    {
        get { return false; }
    }
}

public class MatchReportV1
{
    public MatchReportV1()
    {
    }

    public string Conditions { get; set; }
    public string Report { get; set; }
    public string Base64EncodedImage { get; set; }

    public MatchReportV1(string conditions, string report, string base64EncodedImage)
    {
        Conditions = conditions;
        Report = report;
        Base64EncodedImage = base64EncodedImage;
    }
}






