using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Script.Serialization;
using CricketClubDAL;
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
                else if (path.Contains("/stats/player/") && path.Contains("/detail"))
                {
                    HandlePlayerDetail(context);
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

        private void HandlePlayerDetail(IHandlerContext context)
        {
            var match = Regex.Match(context.Request.Url.AbsolutePath, @"/stats/player/(\d+)/detail");
            if (!match.Success)
            {
                context.Response.StatusCode = 400;
                return;
            }

            var playerId = int.Parse(match.Groups[1].Value);
            var playerDetailV1 = StatsProvider.QueryPlayer(playerId, (s) => HttpContext.Current.Server.MapPath(s));
            context.Response.ContentType = "application/json";
            context.Response.Write(javaScriptSerializer.Serialize(playerDetailV1));
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
            var allPlayers = Player.GetAll(true, new Dao());
            var familyTreeNodes = allPlayers.Select(p => new FamilyTreeNode()
            {
                Id = p.Id,
                ParentId = p.RingerOf == null ? -2 : p.RingerOf.Id,
                Name = p.FirstName + " " + p.Surname,
                Caps = p.Caps,
                ResponsibleCaps = allPlayers.Where(c => c.RingerOf != null && c.RingerOf.Id == p.Id).Sum(c => c.Caps) + p.Caps
            }).ToList();
            familyTreeNodes.Add(new FamilyTreeNode()
            {
                Id = -2,
                Name = "The Village CC"
            });

            context.Response.ContentType = "application/json";
            context.Response.Write(javaScriptSerializer.Serialize(familyTreeNodes));
            context.Response.StatusCode = 200;
        }
    }

    public class FamilyTreeNode
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public string Name { get; set; }
        public int Caps { get; set; }
        public int ResponsibleCaps { get; set; }
    }
}
