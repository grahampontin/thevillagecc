using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Script.Serialization;
using CricketClubMiddle;
using TheVillageCC.Web.Domain;
using TheVillageCC.Web.Stats;

namespace TheVillageCC.Web.HttpHandlers
{
    // ReSharper disable once UnusedType.Global
    public class StatsHandler : HttpHandlerBase
    {
        private readonly JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();

        public override void ProcessRequest(IHandlerContext context)
        {
            try
            {
                var path = context.Request.Url.AbsolutePath.ToLower();

                if (path.Contains("/stats/query"))
                {
                    HandleStatsQuery(context);
                }
                else if (path.Contains("/stats/player/"))
                {
                    HandlePlayerStats(context);
                }
                else if (path.Contains("/stats/chart/"))
                {
                    HandleChartData(context);
                }
                else if (path.Contains("/stats/playermatches/"))
                {
                    HandlePlayerMatches(context);
                }
                else if (path.Contains("/stats/familytree"))
                {
                    HandleFamilyTree(context);
                }
                else
                {
                    context.Response.StatusCode = 404;
                    context.Response.ContentType = "text/plain";
                    context.Response.Write("Not Found");
                }
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = 500;
                context.Response.ContentType = "text/plain";
                context.Response.Write(ex.Message + Environment.NewLine + ex.StackTrace);
            }
            finally
            {
                context.Response.End();
            }
        }

        private void HandleStatsQuery(IHandlerContext context)
        {
            var stringReader = new StreamReader(context.Request.InputStream);
            string body = stringReader.ReadToEnd();
            var query = javaScriptSerializer.Deserialize<StatsQueryV1>(body);
            var statsData = StatsProvider.Query(query);
            context.Response.ContentType = "application/json";
            context.Response.Write(javaScriptSerializer.Serialize(statsData));
            context.Response.StatusCode = 200;
        }

        private void HandlePlayerStats(IHandlerContext context)
        {
            var match = Regex.Match(context.Request.Url.AbsolutePath, @"/stats/player/(\d+)/(.+)");
            if (!match.Success)
            {
                context.Response.StatusCode = 400;
                return;
            }

            var playerId = int.Parse(match.Groups[1].Value);
            var statsType = match.Groups[2].Value;

            var dataCollection = StatsProvider.GetPlayerStatsBreakDown(playerId, statsType);
            context.Response.ContentType = "application/json";
            context.Response.Write(javaScriptSerializer.Serialize(dataCollection));
            context.Response.StatusCode = 200;
        }

        private void HandleChartData(IHandlerContext context)
        {
            var match = Regex.Match(context.Request.Url.AbsolutePath, @"/stats/chart/(\d+)/(.+)");
            if (!match.Success)
            {
                context.Response.StatusCode = 400;
                return;
            }

            var playerId = int.Parse(match.Groups[1].Value);
            var chartType = match.Groups[2].Value;

            var chartData = StatsProvider.BuildChartData(playerId, chartType);
            context.Response.ContentType = "application/json";
            context.Response.Write(javaScriptSerializer.Serialize(chartData));
            context.Response.StatusCode = 200;
        }

        private void HandlePlayerMatches(IHandlerContext context)
        {
            var match = Regex.Match(context.Request.Url.AbsolutePath, @"/stats/playermatches/(\d+)");
            if (!match.Success)
            {
                context.Response.StatusCode = 400;
                return;
            }

            var playerId = int.Parse(match.Groups[1].Value);
            var data = StatsProvider.QueryPlayerMatches(playerId);
            context.Response.ContentType = "application/json";
            context.Response.Write(javaScriptSerializer.Serialize(data));
            context.Response.StatusCode = 200;
        }

        private void HandleFamilyTree(IHandlerContext context)
        {
            var familyTreeNodes = Player.GetAll().Select(p => new FamilyTreeNode()
            {
                id = p.Id,
                parentId = p.RingerOf == null ? -2 : p.RingerOf.Id,
                name = p.FirstName + " " + p.Surname,
                caps = p.Caps,
                responsibleCaps = Player.GetAll().Where(c => c.RingerOf != null && c.RingerOf.Id == p.Id).Sum(c => c.Caps) + p.Caps
            }).ToList();
            familyTreeNodes.Add(new FamilyTreeNode()
            {
                id = -2,
                name = "The Village CC"
            });

            context.Response.ContentType = "application/json";
            context.Response.Write(javaScriptSerializer.Serialize(familyTreeNodes));
            context.Response.StatusCode = 200;
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
}
