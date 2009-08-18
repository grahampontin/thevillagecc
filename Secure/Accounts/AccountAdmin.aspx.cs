using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CricketClubMiddle.Security;

public partial class Secure_Accounts_AccountAdmin : CricketClubMiddle.Web.SecurePage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        if (LoggedOnUser.HasPermission(Permissions.Accountant))
        {

        }
        else
        {
            //... Not allowed.
        }
    }
}
