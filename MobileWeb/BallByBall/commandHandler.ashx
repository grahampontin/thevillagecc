<%@ WebHandler Language="C#" Class="CommandHandler" %>

using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Script.Serialization;
using CricketClubDomain;
using CricketClubMiddle;
using CricketClubMiddle.Logging;
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
        Logger.Log(ex.Message, ex, Severity.Error);
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



public class GenericBallByBallCommand
{
    public string command;
    public object payload;
    public int matchId;
}