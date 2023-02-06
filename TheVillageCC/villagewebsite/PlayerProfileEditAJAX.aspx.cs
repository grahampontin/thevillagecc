using System;
using CricketClubMiddle;
using System.IO;
using CricketClubDomain;

public partial class PlayerProfileEditAJAX : System.Web.UI.Page
{
    public Player p;

    protected void Page_Load(object sender, EventArgs e)
    {
        int playerId = int.Parse(Request["playerID"]);

        p = new Player(playerId);

        if (Request["Action"] == "save")
        {
            p.FullName = Request["Name"];
            p.Dob = DateTime.Parse(Request["DOB"]);
            p.Education = Request["Education"];
            p.Bio = Request["bio"];
            p.BattingStyle = Request["BattingStyle"];
            p.BowlingStyle = Request["BowlingStyle"];
            p.PlayingRole = (PlayingRole)int.Parse(Request["Role"]);
            p.Nickname = Request["Nickname"];
            p.Save();
            Response.End();
        }

        string imgSrc = "/players/pictures/";



        if (File.Exists(Server.MapPath(imgSrc + p.Name.Replace(" ", "_").Replace(",", "").Replace("\"", "") + ".jpg")))
        {
            imgSrc = imgSrc + p.Name.Replace(" ", "_") + ".jpg";
        }
        else
        {
            imgSrc = imgSrc + "noimage.jpg";
        }

        PlayerImage.ImageUrl = imgSrc;
    }
}