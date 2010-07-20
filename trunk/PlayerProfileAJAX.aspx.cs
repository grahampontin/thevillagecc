using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CricketClubMiddle;
using System.IO;

public partial class PlayerProfileAJAX : System.Web.UI.Page
{
    public Player p;

    protected void Page_Load(object sender, EventArgs e)
    {
        int PlayerID = int.Parse(Request["playerID"]);

        p = new Player(PlayerID);

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