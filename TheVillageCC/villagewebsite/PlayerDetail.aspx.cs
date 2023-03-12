using System;
using CricketClubMiddle;
using System.IO;

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
        

    }
}
