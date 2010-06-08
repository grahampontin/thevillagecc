using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CricketClubDomain;
using CricketClubMiddle;

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

        playersGV.DataSource = Player.GetAll().Where(a => a.GetMatchesPlayed(startDate, endDate, MatchTypes, venue) > 0);
        playersGV.DataBind();
        playersGV.CssClass = "fullWidth tablesorter";
        if (playersGV.Rows.Count > 0)
        {
            playersGV.HeaderRow.TableSection = TableRowSection.TableHeader;
            playersGV.FooterRow.TableSection = TableRowSection.TableFooter;
        }


    }

    protected void playersGV_RowDataBound(object sender, GridViewRowEventArgs e)
    {
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
            name.Text = "<a href=Player_Detail.asp?player_id=" + CurrentPlayer.ID + ">" + CurrentPlayer.Name + "</a>";
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
}