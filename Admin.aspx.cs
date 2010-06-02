using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CricketClubMiddle.Web;

public partial class Admin : SecurePage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Header1.PageID = "Admin";
    }
}