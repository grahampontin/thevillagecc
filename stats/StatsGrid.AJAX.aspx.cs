using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CricketClubDomain;
using CricketClubMiddle;
using CricketClubMiddle.Stats;

public partial class Stats_StatsGrid : System.Web.UI.Page
{

    private DateTime startDate;
    private DateTime endDate;
    private List<MatchType> MatchTypes = new List<MatchType>();
    private Venue venue = null;

    protected override void OnInit(EventArgs e)
    {
        this.EnableViewState = false;
        base.OnInit(e);
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!DateTime.TryParse(Request["fromDate"], out startDate))
        {
            startDate = new DateTime(DateTime.Today.Year, 4, 1);
        }
        if (!DateTime.TryParse(Request["toDate"], out endDate))
        {
            endDate = new DateTime(DateTime.Today.Year + 1, 3, 30);
        }
     
        

        if (Request["Friendly"]=="1")
        {
            MatchTypes.Add(MatchType.Friendly);
        }
        if (Request["Tour"] == "1")
        {
            MatchTypes.Add(MatchType.Tour);
        }
        if (Request["Declaration"] == "1")
        {
            MatchTypes.Add(MatchType.Declaration);
        }
        if (Request["League"] == "1")
        {
            MatchTypes.Add(MatchType.NELCL);
            MatchTypes.Add(MatchType.NELCL_Cup);
        }
        if (Request["Twenty20"] == "1")
        {
            MatchTypes.Add(MatchType.Twenty20);
        }

        if (Request["Venue"] != "")
        {
            venue = Venue.GetByName(Request["Venue"]);
        }

        string tab = Request["Tab"];
        if (tab == "") tab = "Batting";

        switch (tab) {
            case "Batting":
            case "Bowling":
                playersGV.DataSource = Player.GetAll().Where(a => a.GetMatchesPlayed(startDate, endDate, MatchTypes, venue) > 0);
                playersGV.DataBind();
                playersGV.CssClass = "fullWidth tablesorter";
                if (playersGV.Rows.Count > 0)
                {
                    playersGV.HeaderRow.TableSection = TableRowSection.TableHeader;
                    playersGV.FooterRow.TableSection = TableRowSection.TableFooter;
                }
                break;
            case "Teams":
                playersGV.Visible = false;
                TeamsGridView.DataSource = Team.GetAll().Select(a=>a.GetStats(startDate, endDate, MatchTypes, venue)).Where(a=>a.GetMatchesPlayed()>0);
                TeamsGridView.DataBind();
                TeamsGridView.CssClass = "fullWidth tablesorter";
                if (TeamsGridView.Rows.Count > 0)
                {
                    TeamsGridView.HeaderRow.TableSection = TableRowSection.TableHeader;
                    TeamsGridView.FooterRow.TableSection = TableRowSection.TableFooter;
                
                }
                break;
            case "Venues":
                VenuesGridView.DataSource = Venue.GetAll().Select(a=>a.GetStats(startDate, endDate, MatchTypes)).Where(a=>a.GetMatchesPlayed()>0);
                VenuesGridView.DataBind();
                VenuesGridView.CssClass = "fullWidth tablesorter";
                if (VenuesGridView.Rows.Count > 0)
                {
                    VenuesGridView.HeaderRow.TableSection = TableRowSection.TableHeader;
                    VenuesGridView.FooterRow.TableSection = TableRowSection.TableFooter;
                
                }
                break;
            case "Captains":
                CaptainsGridView.DataSource = CaptainStats.GetAll(startDate, endDate, MatchTypes, venue);
                CaptainsGridView.DataBind();
                CaptainsGridView.CssClass = "fullWidth tablesorter";
                if (CaptainsGridView.Rows.Count > 0)
                {
                    CaptainsGridView.HeaderRow.TableSection = TableRowSection.TableHeader;
                    CaptainsGridView.FooterRow.TableSection = TableRowSection.TableFooter;
                
                }
                break;
            case "Keepers":
                KeepersGridView.DataSource = KeeperStats.GetAll(startDate, endDate, MatchTypes, venue);
                KeepersGridView.DataBind();
                KeepersGridView.CssClass = "fullWidth tablesorter";
                if (KeepersGridView.Rows.Count > 0)
                {
                    KeepersGridView.HeaderRow.TableSection = TableRowSection.TableHeader;
                    KeepersGridView.FooterRow.TableSection = TableRowSection.TableFooter;
                
                }
                break;
    }


    }

    protected void playersGV_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.EmptyDataRow)
        {
            return;
        }
        TableCell number = e.Row.Cells[0];
        TableCell name = e.Row.Cells[1];
        TableCell BatsAt = e.Row.Cells[2];
        TableCell Matches = e.Row.Cells[3];
        TableCell Innings = e.Row.Cells[4];
        TableCell NotOuts = e.Row.Cells[5];
        TableCell Overs = e.Row.Cells[6];
        TableCell Runs = e.Row.Cells[7];
        TableCell Wickets = e.Row.Cells[8];
        TableCell HighScore = e.Row.Cells[9];
        TableCell BBM = e.Row.Cells[10];
        TableCell Average = e.Row.Cells[11];
        TableCell Hundreds = e.Row.Cells[12];
        TableCell Fifties = e.Row.Cells[13];
        TableCell Fours = e.Row.Cells[14];
        TableCell Sixes = e.Row.Cells[15];
        TableCell Catches = e.Row.Cells[16];
        TableCell Stumpings = e.Row.Cells[17];
        TableCell RunOuts = e.Row.Cells[18];
        TableCell Economy = e.Row.Cells[19];
        TableCell StrikeRate = e.Row.Cells[20];
        TableCell ThreeFers = e.Row.Cells[21];
        TableCell FiveFers = e.Row.Cells[22];
        number.Visible = false;
        if (e.Row.RowType == DataControlRowType.Header)
        {
            HighScore.CssClass = HighScore.CssClass + "{sorter: 'digit'}";
            foreach (TableCell cell in e.Row.Cells)
            {
                cell.HorizontalAlign = HorizontalAlign.Left;
            }
            if (Request["Tab"] == "Batting")
            {
                BBM.Visible = false;
                Economy.Visible = false;
                StrikeRate.Visible = false;
                Overs.Visible = false;
                FiveFers.Visible = false;
                ThreeFers.Visible = false;
                Wickets.Visible = false;
            }
            else if (Request["Tab"] == "Bowling")
            {
                BatsAt.Visible = false;
                Innings.Visible = false;
                Fours.Visible = false;
                Sixes.Visible = false;
                Catches.Visible = false;
                RunOuts.Visible = false;
                Stumpings.Visible = false;
                HighScore.Visible = false;
                Hundreds.Visible = false;
                Fifties.Visible = false;
                NotOuts.Visible = false;
            }
        }

        if (e.Row.RowType == DataControlRowType.DataRow)
        {

            Player CurrentPlayer = (Player)e.Row.DataItem;

            Matches.Text = CurrentPlayer.GetMatchesPlayed(startDate, endDate, MatchTypes, venue).ToString();
            name.Text = "<a href=PlayerDetail.aspx?playerid=" + CurrentPlayer.ID + ">" + CurrentPlayer.Name + "</a>";
            if (Request["Tab"] == "Batting")
            {
                BatsAt.Text = CurrentPlayer.GetBattingPosition(startDate, endDate, MatchTypes, venue).ToString();
                Average.Text = CurrentPlayer.GetBattingAverage(startDate, endDate, MatchTypes, venue).ToString();
                Innings.Text = CurrentPlayer.GetInnings(startDate, endDate, MatchTypes, venue).ToString();
                NotOuts.Text = CurrentPlayer.GetNotOuts(startDate, endDate, MatchTypes, venue).ToString();
                Hundreds.Text = CurrentPlayer.Get100sScored(startDate, endDate, MatchTypes, venue).ToString();
                Fifties.Text = CurrentPlayer.Get50sScored(startDate, endDate, MatchTypes, venue).ToString();
                Fours.Text = CurrentPlayer.Get4s(startDate, endDate, MatchTypes, venue).ToString();
                Sixes.Text = CurrentPlayer.Get6s(startDate, endDate, MatchTypes, venue).ToString();
                Catches.Text = CurrentPlayer.GetCatchesTaken(startDate, endDate, MatchTypes, venue).ToString();
                Stumpings.Text = CurrentPlayer.GetStumpings(startDate, endDate, MatchTypes, venue).ToString();
                RunOuts.Text = CurrentPlayer.GetRunOuts(startDate, endDate, MatchTypes, venue).ToString();
                HighScore.Text = CurrentPlayer.GetHighScore(startDate, endDate, MatchTypes, venue).ToString();
                Runs.Text = CurrentPlayer.GetRunsScored(startDate, endDate, MatchTypes, venue).ToString();
                if (CurrentPlayer.GetHighScoreWasNotOut())
                {
                    HighScore.Text += "*";
                }
                BBM.Visible = false;
                Economy.Visible = false;
                StrikeRate.Visible = false;
                Overs.Visible = false;
                FiveFers.Visible = false;
                ThreeFers.Visible = false;
                Wickets.Visible = false;
            }
            else
            {
                Average.Text = CurrentPlayer.GetBowlingAverage(startDate, endDate, MatchTypes, venue).ToString();
                Wickets.Text = CurrentPlayer.GetWicketsTaken(startDate, endDate, MatchTypes, venue).ToString();
                Economy.Text = CurrentPlayer.GetEconomy(startDate, endDate, MatchTypes, venue).ToString();
                FiveFers.Text = CurrentPlayer.GetFiveFers(startDate, endDate, MatchTypes, venue).ToString();
                StrikeRate.Text = CurrentPlayer.GetStrikeRate(startDate, endDate, MatchTypes, venue).ToString();
                Overs.Text = CurrentPlayer.GetOversBowled(startDate, endDate, MatchTypes, venue).ToString();
                Runs.Text = CurrentPlayer.GetRunsConceeded(startDate, endDate, MatchTypes, venue).ToString();
                BBM.Text = CurrentPlayer.GetBestMatchFigures(startDate, endDate, MatchTypes, venue).ToString();
                BatsAt.Visible = false;
                Innings.Visible = false;
                Fours.Visible = false;
                Sixes.Visible = false;
                Catches.Visible = false;
                RunOuts.Visible = false;
                Stumpings.Visible = false;
                HighScore.Visible = false;
                Hundreds.Visible = false;
                Fifties.Visible = false;
                NotOuts.Visible = false;
            }


        }
    }
    protected void TeamsGridView_RowDataBound(object sender, GridViewRowEventArgs e)
    {

        TableCell name = e.Row.Cells[0];
        TableCell matches = e.Row.Cells[1];
        TableCell wins = e.Row.Cells[2];
        TableCell losses = e.Row.Cells[3];
        TableCell draws = e.Row.Cells[4];
        TableCell aveBatScore = e.Row.Cells[5];
        TableCell aveBowlScore = e.Row.Cells[6];
        TableCell wicketsTaken = e.Row.Cells[7];
        TableCell wicketsLost = e.Row.Cells[8];
        TableCell lbwsGiven = e.Row.Cells[9];
        TableCell lbwsConceeded = e.Row.Cells[10];

        
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            TeamStats CurrentTeamStats = (TeamStats)e.Row.DataItem;
            name.Text = CurrentTeamStats.Team.Name;
            wins.Text = CurrentTeamStats.GetVictories().ToString();
            losses.Text = CurrentTeamStats.GetDefeats().ToString();
            draws.Text = CurrentTeamStats.GetDraws().ToString();
            aveBatScore.Text = CurrentTeamStats.GetAverageBattingScore().ToString();
            aveBowlScore.Text = CurrentTeamStats.GetAverageBowlingScore().ToString();
            wicketsTaken.Text = CurrentTeamStats.GetWicketsTaken().ToString();
            wicketsLost.Text = CurrentTeamStats.GetWicketsLost().ToString();
            lbwsGiven.Text = CurrentTeamStats.GetNumberOfDismissals(ModesOfDismissal.LBW).ToString();
            lbwsConceeded.Text = CurrentTeamStats.GetNumberOfWickets(ModesOfDismissal.LBW).ToString();
            matches.Text = CurrentTeamStats.GetMatchesPlayed().ToString();
        }
    }
    protected void VenuesGridView_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        TableCell venueName = e.Row.Cells[0];
        TableCell matches = e.Row.Cells[1];
        TableCell wins = e.Row.Cells[2];
        TableCell losses = e.Row.Cells[3];
        TableCell aveVccScore = e.Row.Cells[4];
        TableCell aveOppoScore = e.Row.Cells[5];
        TableCell pcTossWinnerBats = e.Row.Cells[6];
        TableCell pcBatFirstWins = e.Row.Cells[7];
        TableCell aveWicketsVCC = e.Row.Cells[8];
        TableCell aveWicketsOppo = e.Row.Cells[9];
        TableCell aveLBW = e.Row.Cells[10];
        TableCell aveCatch = e.Row.Cells[11];
        TableCell aveBowled = e.Row.Cells[12];

        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            VenueStats CurrentVenueStats = (VenueStats)e.Row.DataItem;
            venueName.Text = CurrentVenueStats.Venue.Name;
            wins.Text = CurrentVenueStats.GetVillagWins().ToString();
            losses.Text = CurrentVenueStats.GetVillagLosses().ToString();
            aveVccScore.Text = CurrentVenueStats.GetAverageVillageScore().ToString();
            aveOppoScore.Text = CurrentVenueStats.GetAverageOpponentScore().ToString();
            pcTossWinnerBats.Text = CurrentVenueStats.GetPercentageTossWinnerBats().ToString() + "%";
            pcBatFirstWins.Text = CurrentVenueStats.GetPercentageTeamBattingFirstWins().ToString() + "%";
            aveWicketsVCC.Text = CurrentVenueStats.GetAverageWicketsTakenByVillage().ToString();
            aveWicketsOppo.Text = CurrentVenueStats.GetAverageWicketsTakenByOpposition().ToString();
            aveLBW.Text = CurrentVenueStats.GetNumberOfWicketsPerInnings(ModesOfDismissal.LBW).ToString();
            aveCatch.Text = CurrentVenueStats.GetNumberOfWicketsPerInnings(ModesOfDismissal.Caught).ToString();
            aveBowled.Text = CurrentVenueStats.GetNumberOfWicketsPerInnings(ModesOfDismissal.Bowled).ToString();
            matches.Text = CurrentVenueStats.GetMatchesPlayed().ToString();
        }
    }
    protected void CaptainsGridView_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        TableCell playerName = e.Row.Cells[0];
        TableCell matches = e.Row.Cells[1];
        TableCell wins = e.Row.Cells[2];
        TableCell losses = e.Row.Cells[3];
        TableCell pcWins = e.Row.Cells[4];
        TableCell pcTossesWon = e.Row.Cells[5];
        TableCell pcChoseToBat = e.Row.Cells[6];
        TableCell aveAsCapt = e.Row.Cells[7];
        TableCell aveNotCapt = e.Row.Cells[8];

        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            CaptainStats CurrentStats = (CaptainStats)e.Row.DataItem;

            playerName.Text = CurrentStats.Player.FormalName;
            matches.Text = CurrentStats.GetGamesInCharge().ToString();
            wins.Text = CurrentStats.GetWins().ToString();
            losses.Text = CurrentStats.GetLosses().ToString();
            pcWins.Text = CurrentStats.GetPercentageGamesWon().ToString() + "%";
            pcTossesWon.Text = CurrentStats.GetPercentageTossWon().ToString() + "%";
            pcChoseToBat.Text = CurrentStats.GetPercentageChooseToBat().ToString() + "%";
            aveAsCapt.Text = CurrentStats.GetBattingAverageAsCaptain().ToString();
            aveNotCapt.Text = CurrentStats.GetBattingAverageNotAsCaptain().ToString();

        }
    }
    protected void KeepersGridView_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        TableCell playerName = e.Row.Cells[0];
        TableCell matches = e.Row.Cells[1];
        TableCell catches = e.Row.Cells[2];
        TableCell stumpings = e.Row.Cells[3];
        TableCell byes = e.Row.Cells[4];
        TableCell aveWithGloves = e.Row.Cells[5];
        TableCell aveWithoutGloves = e.Row.Cells[6];
        
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            KeeperStats CurrentStats = (KeeperStats)e.Row.DataItem;

            playerName.Text = CurrentStats.Player.FormalName;
            matches.Text = CurrentStats.GetGames().ToString();
            catches.Text = CurrentStats.GetCatchesPerMatch().ToString();
            stumpings.Text = CurrentStats.GetStumpingsPerMatch().ToString();
            byes.Text = CurrentStats.GetAverageByesPerMatch().ToString();
            aveWithGloves.Text = CurrentStats.GetBattingAverageAsKeeper().ToString();
            aveWithoutGloves.Text = CurrentStats.GetBattingAverageNotAsKeeper().ToString();
            

        }
    }
}