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

    private Dictionary<int, Player> _allPlayers;
    private Dictionary<int, Player> AllPlayers
    {
        get
        {
            if (_allPlayers == null)
            {
                _allPlayers = Player.GetAll().Where(a => a.Id > 0).ToDictionary(p => p.Id, p => p);
            }
            return _allPlayers;
        }
    }

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
        var committeeData = dao.GetAllCommitteeData();

        // Group by post type
        CaptainsData = committeeData
            .Where(c => c.Post == Post.Captain)
            .OrderBy(c => c.Year)
            .Select(c => new CommitteeYearData
            {
                Year = c.Year,
                PlayerName = AllPlayers.ContainsKey(c.PlayerId) ? AllPlayers[c.PlayerId].Name : "Unknown"
            })
            .ToList();

        ViceCaptainsData = committeeData
            .Where(c => c.Post == Post.ViceCaptain)
            .OrderBy(c => c.Year)
            .Select(c => new CommitteeYearData
            {
                Year = c.Year,
                PlayerName = AllPlayers.ContainsKey(c.PlayerId) ? AllPlayers[c.PlayerId].Name : "Unknown"
            })
            .ToList();

        // PlayerOfTheYear is in Awards table, not Committee
        var awardsData = dao.GetAllAwardsData();
        PlayerOfYearData = awardsData
            .Where(a => a.Award == Award.PlayerOfTheYear)
            .OrderBy(a => a.Year)
            .Select(a => new CommitteeYearData
            {
                Year = a.Year,
                PlayerName = AllPlayers.ContainsKey(a.PlayerId) ? AllPlayers[a.PlayerId].Name : "Unknown"
            })
            .ToList();
    }

    private void LoadAwardsData()
    {
        var dao = new Dao();
        var awardsData = dao.GetAllAwardsData();

        // Group by year
        var awardsByYear = awardsData.GroupBy(a => a.Year).OrderBy(g => g.Key);

        AwardsData = awardsByYear.Select(yearGroup => new AwardYearData
        {
            Year = yearGroup.Key,
            PlayersPlayer = GetAwardWinner(yearGroup, Award.PlayerOfTheYear),
            CaptainsPlayer = GetAwardWinner(yearGroup, Award.CaptainsPlayerOfTheYear),
            BestBatsman = GetAwardWinner(yearGroup, Award.BatsmanOfTheYear),
            BestBowler = GetAwardWinner(yearGroup, Award.BowlerOfTheYear),
            BestFielder = GetAwardWinner(yearGroup, Award.FielderOfTheYear),
            MostImproved = GetAwardWinner(yearGroup, Award.MostImprovedPlayer)
        }).ToList();
    }

    private string GetAwardWinner(IGrouping<int, AwardData> yearGroup, Award awardType)
    {
        var award = yearGroup.FirstOrDefault(a => a.Award == awardType);
        if (award == null) return "";

        var playerName = AllPlayers.ContainsKey(award.PlayerId) ? AllPlayers[award.PlayerId].Name : "Unknown";
        
        // HTML encode to prevent XSS
        var encodedPlayerName = HttpUtility.HtmlEncode(playerName);
        
        if (!string.IsNullOrEmpty(award.Data))
        {
            var encodedData = HttpUtility.HtmlEncode(award.Data);
            return encodedPlayerName + "<br/>" + encodedData;
        }
        
        return encodedPlayerName;
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
