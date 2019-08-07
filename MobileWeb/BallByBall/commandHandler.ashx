<%@ WebHandler Language="C#" Class="CommandHandler" %>

using System;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
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
            if (genericBallByBallCommand.command == "listMatches")
            {
                var matchDescriptors = Match.GetInProgressGames().Union(Match.GetFixtures().Where(m=>m.MatchDate < DateTime.Today.AddDays(14))).Select(m => new MatchDescriptor(m)).ToList();
                context.Response.Write(javaScriptSerializer.Serialize(matchDescriptors));
                return;
            }
            if (genericBallByBallCommand.command == "listPlayers")
            {
                var players = Player.GetAll().Where(p => p.IsActive && p.ID > 0).OrderByDescending(p=>p.NumberOfMatchesPlayedThisSeason).ThenBy(p => p.FormalName).Select(p=>new PlayerDescriptor(p)).ToList();
                context.Response.Write(javaScriptSerializer.Serialize(players));
                return;
            }
            var match = new Match(genericBallByBallCommand.matchId);
            switch (genericBallByBallCommand.command)
            {
                case "startMatch":
                    if (match.GetIsBallByBallInProgress())
                    {
                        throw new InvalidOperationException("Coverage for match vs " + match.Opposition.Name + " has already been started");
                    }
                    match.StartBallByBallCoverage(GetMatchConditions(genericBallByBallCommand.payload));
                    context.Response.Write("{}");
                    break;
                case "matchState":
                    ReturnCurrentMatchState(context, match);
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
                    context.Response.Write("{}");
                    break;
                case "endInnings":
                    var inningsEndDetails = javaScriptSerializer.Deserialize<InningsEndDetails>(javaScriptSerializer.Serialize(genericBallByBallCommand.payload));
                    NextInnings nextInnings = match.EndInnings(inningsEndDetails);
                    context.Response.ContentType = "text/json";
                    context.Response.StatusCode = 200;
                    context.Response.Write("{ \"NextInnings\" : \""+nextInnings+"\" }");

                    break;
                case "deleteLastOver":
                    match.DeleteLastBallByBallOver();
                    ReturnCurrentMatchState(context, match);
                    break;
                default:
                    context.Response.ContentType = "text/plain";
                    context.Response.Write("Command: " + genericBallByBallCommand.command + " is not supported");
                    context.Response.StatusCode = 400;
                    break;
            }
        }
        catch(InvalidOperationException ex)
        {
            ReportInvalidInput(context, ex.Message + Environment.NewLine + ex.StackTrace);
        } catch(Exception ex)
        {
            ReportError(context, ex, 500);
        }



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

public class PlayerDescriptor
{
    public int playerId;
    public int matches;
    public string name;

    public PlayerDescriptor(Player player)
    {
        playerId = player.ID;
        name = player.FormalName;
        matches = player.NumberOfMatchesPlayedThisSeason;
    }
}

public class MatchDescriptor
{
    public readonly int matchId;
    public readonly string batOrBowl;
    public readonly string opponent;
    public readonly string dateString;
    public readonly int overs;

    public MatchDescriptor(Match m)
    {
        matchId = m.ID;
        var currentBallByBallState = m.GetCurrentBallByBallState();
        if (m.GetIsBallByBallInProgress())
        {
            if (m.OurInningsInProgress)
            {
                batOrBowl = "Bat";
                overs = currentBallByBallState.LastCompletedOver;
            }
            else if (m.TheirInningsInProgress)
            {
                batOrBowl = "Bowl";
                overs = currentBallByBallState.OppositionOver;
            }
        }
        else
        {
            batOrBowl = "";
            overs = 0;
        }

        opponent = m.HomeOrAway == HomeOrAway.Home ? m.AwayTeamName : m.HomeTeamName;
        dateString = m.MatchDate.ToShortDateString();
    }
}


public class GenericBallByBallCommand
{
    public string command;
    public object payload;
    public int matchId;
}