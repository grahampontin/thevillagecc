using System;
using System.Web.UI.WebControls;
using CricketClubMiddle;
using System.IO;
using CricketClubDomain;
using System.Collections.Generic;

public partial class PlayerDetail : System.Web.UI.Page
{
    protected string PlayerName;
    protected Player p;

    protected void Page_Load(object sender, EventArgs e)
    {
        int PlayerID = 0;
        //Check validity of player id
        if (!int.TryParse(Request["PlayerID"], out PlayerID))
        {
            throw new ApplicationException("Could not parse player id from string value: " + Request["PlayerID"]);
        }
        
        Player CurrentPlayer = new Player(PlayerID);
        if (CurrentPlayer == null)
        {
            throw new ApplicationException("Failed to collect player object for player id " + PlayerID.ToString());
        }
        p = CurrentPlayer;
        //Everything looks good

        PlayerName = CurrentPlayer.FirstName + " " + CurrentPlayer.Surname;
        string imgSrc = "/players/pictures/";
        if (File.Exists(Server.MapPath(imgSrc + CurrentPlayer.Name.Replace(" ", "_").Replace(",", "").Replace("\"", "") + ".jpg")))
        {
            imgSrc = imgSrc + CurrentPlayer.Name.Replace(" ", "_") + ".jpg";
        }
        else
        {
            imgSrc = imgSrc + "noimage.jpg";
        }
        PlayerImage.ImageUrl = imgSrc;

        BattingStats.DataSource = Enum.GetNames(typeof(MatchType));
        BattingStats.DataBind();


        BowlingStats.DataSource = Enum.GetNames(typeof(MatchType));
        BowlingStats.DataBind();

        VenuesList.DataSource = Venue.GetAll();
        VenuesList.DataBind();

        
        

    }
    protected void BattingStats_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            TableCell Type = e.Row.Cells[0];
            TableCell Matches = e.Row.Cells[1];
            TableCell Inns = e.Row.Cells[2];
            TableCell NotOuts = e.Row.Cells[3];
            TableCell Runs = e.Row.Cells[4];
            TableCell HS = e.Row.Cells[5];
            TableCell Ave = e.Row.Cells[6];
            TableCell Ducks = e.Row.Cells[9];
            TableCell Tons = e.Row.Cells[7];
            TableCell Fifties = e.Row.Cells[8];
            TableCell Fours = e.Row.Cells[10];
            TableCell Sixes = e.Row.Cells[11];
            TableCell Catches = e.Row.Cells[12];
            TableCell Stumpings = e.Row.Cells[13];
            TableCell Runouts = e.Row.Cells[14];
            
             
 
            MatchType MatchTypeName = (MatchType)Enum.Parse(typeof(MatchType), (string)e.Row.DataItem);
            List<MatchType> Match = new List<MatchType>();
            Match.Add(MatchTypeName);
            Type.Text = MatchTypeName.ToString();
            Matches.Text = p.GetMatchesPlayed(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Ave.Text = p.GetBattingAverage(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Inns.Text = p.GetInnings(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            NotOuts.Text = p.GetNotOuts(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Runs.Text = p.GetRunsScored(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            HS.Text = p.GetHighScore(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Ducks.Text = p.GetDucks(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();             
            Tons.Text = p.Get100sScored(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Fifties.Text = p.Get50sScored(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Fours.Text = p.Get4s(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Sixes.Text = p.Get6s(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Catches.Text = p.GetCatchesTaken(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Stumpings.Text = p.GetStumpings(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString(); ;
            Runouts.Text = p.GetRunOuts(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
         }
    }
    protected void BowlingStats_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            TableCell Type = e.Row.Cells[0];
            TableCell Matches = e.Row.Cells[1];
            TableCell Overs = e.Row.Cells[2];
            TableCell Runs = e.Row.Cells[3];
            TableCell Wkts = e.Row.Cells[4];
            TableCell BBM = e.Row.Cells[5];
            TableCell Ave = e.Row.Cells[6];
            TableCell Econ = e.Row.Cells[7];
            TableCell SR = e.Row.Cells[8];
            TableCell Fourfers = e.Row.Cells[9];
            TableCell Fivefers = e.Row.Cells[10];
            TableCell Tenfers = e.Row.Cells[11];
            


            MatchType MatchTypeName = (MatchType)Enum.Parse(typeof(MatchType), (string)e.Row.DataItem);
            List<MatchType> Match = new List<MatchType>();
            Match.Add(MatchTypeName);
            Type.Text = MatchTypeName.ToString();
            Matches.Text = p.GetMatchesPlayed(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Overs.Text = p.GetOversBowled(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Runs.Text = p.GetRunsConceeded(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Wkts.Text = p.GetWicketsTaken(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            BBM.Text = p.GetBestMatchFigures(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Ave.Text = p.GetBowlingAverage(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Econ.Text = p.GetEconomy(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString(); 
            SR.Text = p.GetStrikeRate(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Fourfers.Text = p.GetThreeFers(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Fivefers.Text = p.GetFiveFers(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
            Tenfers.Text = p.GetTenFers(new DateTime(2000, 1, 1), new DateTime(2112, 1, 1), Match, null).ToString();
        }
    }
}
