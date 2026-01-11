using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using CricketClubMiddle;
using CricketClubDAL;
using CricketClubDomain;

public partial class Stats : System.Web.UI.Page
{
    protected List<CommitteeYearData> CaptainsData { get; set; }
    protected List<CommitteeYearData> ViceCaptainsData { get; set; }
    protected List<CommitteeYearData> PlayerOfYearData { get; set; }
    protected List<AwardYearData> AwardsData { get; set; }

    protected void Page_Load(object sender, EventArgs e)
    {
        Header1.PageID = "Awards";

        var players = Player.GetAll().Where(a=>a.Id >0);
        
        var mostRuns = players.Max(a => a.GetRunsScored());
        var leadingScorer = players.Where(a => a.GetRunsScored() == mostRuns).FirstOrDefault();
        LeadingRSName.Text = leadingScorer.Name;
        LeadingRSRuns.Text = mostRuns.ToString();

        var mostWickets = players.Max(a => a.GetWicketsTaken());
        var leadingWicketTaker = players.Where(a => a.GetWicketsTaken() == mostWickets).FirstOrDefault();
        LeadingWTName.Text = leadingWicketTaker.Name;
        LeadingWTWickets.Text = mostWickets.ToString();

        var mostCatches = players.Max(a => a.GetCatchesTaken());
        var leadingCatcher = players.Where(a => a.GetCatchesTaken() == mostCatches).FirstOrDefault();
        MostCatchesName.Text = leadingCatcher.Name;
        MostCatchesNumber.Text = mostCatches.ToString();

        // Load committee and awards data from database
        LoadCommitteeData();
        LoadAwardsData();
    }

    private void LoadCommitteeData()
    {
        var dao = new Dao();
        var allPlayers = Player.GetAll().Where(a => a.Id > 0).ToDictionary(p => p.Id, p => p);
        var committeeData = dao.GetAllCommitteeData();

        // Group by post type
        CaptainsData = committeeData
            .Where(c => c.Post == Post.Captain)
            .OrderBy(c => c.Year)
            .Select(c => new CommitteeYearData
            {
                Year = c.Year,
                PlayerName = allPlayers.ContainsKey(c.PlayerId) ? allPlayers[c.PlayerId].Name : "Unknown"
            })
            .ToList();

        ViceCaptainsData = committeeData
            .Where(c => c.Post == Post.ViceCaptain)
            .OrderBy(c => c.Year)
            .Select(c => new CommitteeYearData
            {
                Year = c.Year,
                PlayerName = allPlayers.ContainsKey(c.PlayerId) ? allPlayers[c.PlayerId].Name : "Unknown"
            })
            .ToList();

        PlayerOfYearData = committeeData
            .Where(c => c.Post == Post.PlayerOfTheYear)
            .OrderBy(c => c.Year)
            .Select(c => new CommitteeYearData
            {
                Year = c.Year,
                PlayerName = allPlayers.ContainsKey(c.PlayerId) ? allPlayers[c.PlayerId].Name : "Unknown"
            })
            .ToList();
    }

    private void LoadAwardsData()
    {
        var dao = new Dao();
        var allPlayers = Player.GetAll().Where(a => a.Id > 0).ToDictionary(p => p.Id, p => p);
        var awardsData = dao.GetAllAwardsData();

        // Group by year
        var awardsByYear = awardsData.GroupBy(a => a.Year).OrderBy(g => g.Key);

        AwardsData = awardsByYear.Select(yearGroup => new AwardYearData
        {
            Year = yearGroup.Key,
            PlayersPlayer = GetAwardWinner(yearGroup, Award.PlayersPlayerOfTheSeason, allPlayers),
            CaptainsPlayer = GetAwardWinner(yearGroup, Award.CaptainsPlayerOfTheSeason, allPlayers),
            BestBatsman = GetAwardWinner(yearGroup, Award.BatsmanOfTheYear, allPlayers),
            BestBowler = GetAwardWinner(yearGroup, Award.BowlerOfTheYear, allPlayers),
            BestFielder = GetAwardWinner(yearGroup, Award.FielderOfTheYear, allPlayers),
            MostImproved = GetAwardWinner(yearGroup, Award.MostImproved, allPlayers)
        }).ToList();
    }

    private string GetAwardWinner(IGrouping<int, AwardData> yearGroup, Award awardType, Dictionary<int, Player> players)
    {
        var award = yearGroup.FirstOrDefault(a => a.Award == awardType);
        if (award == null) return "";

        var playerName = players.ContainsKey(award.PlayerId) ? players[award.PlayerId].Name : "Unknown";
        
        if (!string.IsNullOrEmpty(award.Data))
        {
            return $"{playerName}<br/>{award.Data}";
        }
        
        return playerName;
    }

    public class CommitteeYearData
    {
        public int Year { get; set; }
        public string PlayerName { get; set; }
    }

    public class AwardYearData
    {
        public int Year { get; set; }
        public string PlayersPlayer { get; set; }
        public string CaptainsPlayer { get; set; }
        public string BestBatsman { get; set; }
        public string BestBowler { get; set; }
        public string BestFielder { get; set; }
        public string MostImproved { get; set; }
    }
}
