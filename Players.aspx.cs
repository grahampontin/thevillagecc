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
using System.IO;

public partial class Players : System.Web.UI.Page
{

  
    protected void Page_Load(object sender, EventArgs e)
    {

        Header1.PageID = "Players";

        IEnumerable<Player> Players = Player.GetAll().Where(a => a.IsActive).Where(a=>a.Debut > new DateTime(2002,1,1)).Where(a=>a.ID>0);
        string OrderBy = Request["OrderBy"];
        switch (OrderBy)
        {
            case "Caps":
                Players = Players.OrderBy(a => a.Caps).Reverse();
                break;
            default:
                Players = Players.OrderBy(a=>a.GetBattingPosition()).OrderBy(a => a.Debut);
                break;
        }

        PlayersGrid.DataSource = Players;
        PlayersGrid.DataBind();
    }
    protected void PlayersGrid_ItemDataBound(object sender, ListViewItemEventArgs e)
    {
        Image img = (Image)e.Item.FindControl("PlayerImage");

        Player p = (Player)((ListViewDataItem)e.Item).DataItem;

        string imgSrc = "/players/pictures/";



        if (File.Exists(Server.MapPath(imgSrc + p.Name.Replace(" ", "_").Replace(",","").Replace("\"","") + ".jpg")))
        {
            imgSrc = imgSrc + p.Name.Replace(" ", "_") + ".jpg";
        }
        else
        {
            imgSrc = imgSrc + "noimage.gif";
        }

        img.ImageUrl = imgSrc;

        if (e.Item.DataItemIndex%4 == 0)
        {
            Literal newRowDiv = (Literal)e.Item.FindControl("newRowDiv");
            newRowDiv.Text = "<div class=\"container\" style=\"width: 1000px !important\">";
        }
        if (e.Item.DataItemIndex%4 == 3)
        {
            Literal newRowDiv = (Literal)e.Item.FindControl("newRowEndDiv");
            newRowDiv.Text = "</div>";
        }

    }
}
