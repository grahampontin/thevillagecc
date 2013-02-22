<%@ WebHandler Language="C#" Class="CommandHandler" %>

using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Script.Serialization;
using CricketClubDomain;
using CricketClubMiddle;

public class CommandHandler : IHttpHandler
{
    private readonly JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();

    #region IHttpHandler Members

    public void ProcessRequest(HttpContext context)
    {
        var stringReader = new StreamReader(context.Request.InputStream);
        string postData = stringReader.ReadToEnd();
        var genericBallByBallCommand = javaScriptSerializer.Deserialize<GenericBallByBallCommand>(postData);
        try
        {
            var match = new Match(genericBallByBallCommand.matchId);
            switch (genericBallByBallCommand.command)
            {
                case "startMatch":
                    match.StartBallByBallCoverage(GetPlayerIds(genericBallByBallCommand.payload));
                    break;
                case "matchState":
                    MatchState state = match.GetCurrentBallByBallState();
                    string json = javaScriptSerializer.Serialize(state);
                    context.Response.ContentType = "text/json";
                    context.Response.StatusCode = 200;
                    context.Response.Write(json);
                    break;
                case "submitOver":
                    var stateFromClient = javaScriptSerializer.Deserialize<MatchState>(javaScriptSerializer.Serialize(genericBallByBallCommand.payload));
                    match.UpdateCurrentBallByBallState(stateFromClient);
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
            ReportError(context, ex, 400);
        } catch(Exception ex)
        {
            ReportError(context, ex, 500);
        }
        


    }

    private static void ReportError(HttpContext context, Exception ex, int statusCode)
    {
        context.Response.ContentType = "text/plain";
        context.Response.Write(ex.Message);
        context.Response.StatusCode = statusCode;
    }

    private IEnumerable<int> GetPlayerIds(object data)
    {
        var serialize = javaScriptSerializer.Serialize(data);
        var playerIds = javaScriptSerializer.Deserialize<int[]>(serialize);
        return playerIds;
    }

    public bool IsReusable
    {
        get { return false; }
    }

    #endregion
}

public class GenericBallByBallCommand
{
    public string command;
    public object payload;
    public int matchId;
}