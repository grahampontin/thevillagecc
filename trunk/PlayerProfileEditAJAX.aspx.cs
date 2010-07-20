using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CricketClubMiddle;
using System.IO;
using CricketClubDomain;

public partial class PlayerProfileEditAJAX : System.Web.UI.Page
{
    public Player p;

    protected void Page_Load(object sender, EventArgs e)
    {
        int PlayerID = int.Parse(Request["playerID"]);

        p = new Player(PlayerID);

        if (Request["Action"] == "save")
        {
            p.FullName = Request["Name"];
            p.DOB = DateTime.Parse(Request["DOB"]);
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