using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class MobileWeb_chat : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        DateTime startDate;
        try
        {
            startDate = DateTime.Parse(Request["startDate"]);
        }
        catch
        {
            startDate = DateTime.Today;
        }
        previousDay.NavigateUrl = "javascript:changeDate('" + startDate.AddDays(-1).ToString("dd/MM/yyyy")+"', true);";
        nextDay.NavigateUrl = "javascript:changeDate('" + startDate.AddDays(1).ToString("dd/MM/yyyy") + "', false);";
    }
}