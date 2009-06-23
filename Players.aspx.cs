using System;
using System.Collections;
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
using CricketClubDomain;
using System.Collections.Generic;

public partial class Players : System.Web.UI.Page
{

    private DateTime startDate;
    private DateTime endDate;
    private List<MatchType> MatchTypes = new List<MatchType>();
    
    protected void Page_Load(object sender, EventArgs e)
    {
        

        string fromDate = FromDate.Value;
        string toDate = ToDate.Value;

        if (!DateTime.TryParse(fromDate, out startDate))
        {
            startDate = new DateTime(DateTime.Today.Year, 4, 1);
        }
        if (!DateTime.TryParse(toDate, out endDate))
        {
            endDate = new DateTime(DateTime.Today.Year+1, 3, 30);
        }

        FromDate.Value = startDate.ToLongDateString();
        ToDate.Value = endDate.ToLongDateString();

        if (FriendlyCB.Checked)
        {
            MatchTypes.Add(MatchType.Friendly);
        }
        if (TourCB.Checked)
        {
            MatchTypes.Add(MatchType.Tour);
        }
        if (DeclarationCB.Checked)
        {
            MatchTypes.Add(MatchType.Declaration);
        }
        if (LeagueCB.Checked)
        {
            MatchTypes.Add(MatchType.NELCL);
            MatchTypes.Add(MatchType.NELCL_Cup);
        }
        if (Twenty20CB.Checked)
        {
            MatchTypes.Add(MatchType.Twenty20);
        }

        playersGV.DataSource = Player.GetAll().Where(a => a.GetMatchesPlayed(startDate, endDate, MatchTypes) > 0);
        playersGV.DataBind();
        playersGV.CssClass = "fullWidth";

    }
    protected void playersGV_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        TableCell number = e.Row.Cells[0];
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
            foreach (TableCell cell in e.Row.Cells)
            {
                cell.HorizontalAlign = HorizontalAlign.Left;
            }
            if (BattingCB.Checked)
            {
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
            


            Matches.Text = CurrentPlayer.GetMatchesPlayed(startDate, endDate, MatchTypes).ToString();
            
            if (BattingCB.Checked)
            {
                BatsAt.Text = CurrentPlayer.GetBattingPosition(startDate,endDate,MatchTypes).ToString();
                Average.Text = CurrentPlayer.GetBattingAverage(startDate, endDate, MatchTypes).ToString();
                Innings.Text = CurrentPlayer.GetInnings(startDate, endDate, MatchTypes).ToString();
                NotOuts.Text = CurrentPlayer.GetNotOuts(startDate, endDate, MatchTypes).ToString();
                Hundreds.Text = CurrentPlayer.Get100sScored(startDate, endDate, MatchTypes).ToString();
                Fifties.Text = CurrentPlayer.Get50sScored(startDate, endDate, MatchTypes).ToString();
                Fours.Text = CurrentPlayer.Get4s(startDate, endDate, MatchTypes).ToString();
                Sixes.Text = CurrentPlayer.Get6s(startDate, endDate, MatchTypes).ToString();
                Catches.Text = CurrentPlayer.GetCatchesTaken(startDate, endDate, MatchTypes).ToString();
                Stumpings.Text = CurrentPlayer.GetStumpings(startDate, endDate, MatchTypes).ToString();
                RunOuts.Text = CurrentPlayer.GetRunOuts(startDate, endDate, MatchTypes).ToString();
                HighScore.Text = CurrentPlayer.GetHighScore(startDate, endDate, MatchTypes).ToString();
                Runs.Text = CurrentPlayer.GetRunsScored(startDate, endDate, MatchTypes).ToString();
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
                Average.Text = CurrentPlayer.GetBowlingAverage(startDate, endDate, MatchTypes).ToString();
                Wickets.Text = CurrentPlayer.GetWicketsTaken(startDate, endDate, MatchTypes).ToString();
                Economy.Text = CurrentPlayer.GetEconomy(startDate, endDate, MatchTypes).ToString();
                FiveFers.Text = CurrentPlayer.GetFiveFers(startDate, endDate, MatchTypes).ToString();
                StrikeRate.Text = CurrentPlayer.GetStrikeRate(startDate, endDate, MatchTypes).ToString();
                Overs.Text = CurrentPlayer.GetOversBowled(startDate, endDate, MatchTypes).ToString();
                Runs.Text = CurrentPlayer.GetRunsConceeded(startDate, endDate, MatchTypes).ToString();
                BBM.Text = CurrentPlayer.GetBestMatchFigures(startDate, endDate, MatchTypes).ToString();
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
