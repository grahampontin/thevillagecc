<%@ WebHandler Language="C#" Class="CommandHandler" %>

using System;
using System.Collections.Generic;
using System.IdentityModel;
using System.IO;
using System.Linq;
using System.Runtime.Remoting;
using System.Web;
using System.Web.Script.Serialization;
using CricketClubDAL;
using CricketClubDomain;
using CricketClubMiddle;
using CricketClubMiddle.Stats;
using log4net;
using TheVillageCC.Web.Domain;
using TheVillageCC.Web.Stats;

public class CommandHandler : IHttpHandler
{
    private readonly Dao Database = new Dao();
    private readonly JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();
    
    private static readonly ILog Log = LogManager.GetLogger(typeof(CommandHandler));
    
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
                    var matchDescriptors = Match.GetInProgressGames()
                        .Union(Match.GetFixtures().Where(m =>
                            m.MatchDate < DateTime.Today.AddDays(14) &&
                            !m.GetCurrentBallByBallState().IsMatchComplete()))
                        .Select(m => new BallByBallMatchDescriptor(m))
                        .Distinct(BallByBallMatchDescriptor.MatchIdComparer).ToList();
                    context.Response.Write(javaScriptSerializer.Serialize(matchDescriptors));
                    return;
                }
                case "matchesBySeason":
                {
                    var season = (int)genericBallByBallCommand.payload;
                    var matchDescriptors =
                        Match.GetAll(new DateTime(season, 1, 1), new DateTime(season, 12, 31), null, null)
                            .OrderBy(m => m.MatchDate).Select(MatchV1.FromInternal).ToList();
                    context.Response.Write(javaScriptSerializer.Serialize(matchDescriptors));
                    return;
                }
                default:
                {
                    var match = new Match(genericBallByBallCommand.matchId);
                    switch (genericBallByBallCommand.command)
                    {
                        case "startMatch":
                            if (match.GetIsBallByBallInProgress())
                            {
                                throw new BadRequestException("Coverage for match vs " + match.Opposition.Name +
                                                                    " has already been started");
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
                            var stateFromClient =
                                javaScriptSerializer.Deserialize<MatchState>(
                                    javaScriptSerializer.Serialize(genericBallByBallCommand.payload));
                            match.UpdateCurrentBallByBallState(stateFromClient);
                            ReturnCurrentMatchState(context, match);
                            break;
                        case "liveScorecard":

                            string json = javaScriptSerializer.Serialize(FromLiveScorecard(match));
                            context.Response.ContentType = "text/json";
                            context.Response.StatusCode = 200;
                            context.Response.Write(json);
                            break;
                        case "updateOppositionScore":
                            var incoming =
                                javaScriptSerializer.Deserialize<OppositionInningsDetails>(
                                    javaScriptSerializer.Serialize(genericBallByBallCommand.payload));
                            match.UpdateOppositionScore(incoming);
                            ReturnCurrentMatchState(context, match);
                            break;
                        case "endInnings":
                            var inningsEndDetails =
                                javaScriptSerializer.Deserialize<InningsEndDetails>(
                                    javaScriptSerializer.Serialize(genericBallByBallCommand.payload));
                            match.EndInnings(inningsEndDetails);
                            context.Response.ContentType = "text/json";
                            context.Response.StatusCode = 200;
                            ReturnCurrentMatchState(context, match);

                            break;
                        case "deleteLastOver":
                            match.DeleteLastBallByBallOver();
                            ReturnCurrentMatchState(context, match);
                            break;
                        case "forceEndMatch":
                            var nextInnings = EndInnings(match, match.GetCurrentBallByBallState().GetInningsStatus().OurInningsStatus ==
                                                                InningsStatus.InProgress
                                ? "Batting"
                                : "Bowling");
                            match = new Match(genericBallByBallCommand.matchId);
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
                            break;
                        default:
                            context.Response.ContentType = "text/plain";
                            context.Response.Write("Command: " + genericBallByBallCommand.command +
                                                   " is not supported");
                            context.Response.StatusCode = 400;
                            break;
                    }

                    break;
                }
            }
        }
        catch (BadRequestException ex)
        {
            var payload = genericBallByBallCommand.payload ?? "no payload";
            Log.Error("Bad request error processing command " + genericBallByBallCommand.command + " : " + payload, ex);
            ReportInvalidInput(context, ex.Message);
        }
        catch (Exception ex)
        {
            var payload = genericBallByBallCommand.payload ?? "no payload";
            Log.Error("Error processing command " + genericBallByBallCommand.command + " : " + payload, ex);
            ReportError(context, ex, 200);
        }
    }

    

    private static LiveScorecardV1 FromLiveScorecard(Match match)
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

    private List<FamilyTreeNode> CreateFamilyTree()
    {
        var familyTreeNodes = Player.GetAll().Select(p => new FamilyTreeNode()
        {
            id = p.Id,
            parentId = p.RingerOf == null ? -2 : p.RingerOf.Id,
            name = p.FirstName + " " + p.Surname,
            caps = p.Caps,
            responsibleCaps = Player.GetAll().Where(c=>c.RingerOf!=null && c.RingerOf.Id == p.Id).Sum(c=>c.Caps) + p.Caps
                
        }).ToList();
        familyTreeNodes.Add(new FamilyTreeNode()
        {
            id = -2,
            name = "The Village CC"
        });
        return familyTreeNodes;
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
        return v.IsHome ? CricketClubDomain.HomeOrAway.Home : CricketClubDomain.HomeOrAway.Away;
    }

    private static MatchType ParseMatchType(MatchV1 v)
    {
        return (MatchType)Enum.Parse(typeof(MatchType), v.Type, true);
    }

    private void CreateOrUpdateStaticDataItem<T>(HttpContext context, GenericBallByBallCommand genericBallByBallCommand,
        Action<T> createOrUpdateAction)
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
        MatchState matchState = ballByBallMatch.GetMatchState();
        var matchStateV1 = MatchStateMapper.MapToMatchStateV1(matchState);
        matchStateV1.LiveScorecard = FromLiveScorecard(match);
        string json = javaScriptSerializer.Serialize(matchStateV1);
        context.Response.ContentType = "text/json";
        context.Response.StatusCode = 200;
        context.Response.Write(json);
    }

    private static void ReportError(HttpContext context, Exception ex, int statusCode)
    {
        context.Response.ContentType = "text/plain";
        context.Response.Write(ex.Message + Environment.NewLine + ex.StackTrace);
        context.Response.StatusCode = statusCode;
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

public class FamilyTreeNode
{
    public int id { get; set; }
    public int? parentId { get; set; }
    public string name { get; set; }
    public int caps { get; set; }
    public int responsibleCaps { get; set; }
}

public class ChartRequestV1
{
    public int playerId { get; set; }
    public string chartType { get; set; }
}












