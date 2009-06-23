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

public partial class UserControls_TopMenu : System.Web.UI.UserControl
{

    public string PageID
    {
        get;
        set;
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        if (string.IsNullOrEmpty(PageID))
        {

            PageID = "Home";
        }

        HtmlControl active = (HtmlControl)FindControl(PageID);
        active.Attributes["class"] = "current";

        
    }
}
