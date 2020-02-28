using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class MobileWeb_dateMover : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string submittedDate = Request["currentDate"];
        DateTime currentDate = DateTime.Parse(submittedDate);
        Response.Write("{");
        Response.Write("\"previousDate\" : \"" + currentDate.AddDays(-1).ToString("dd/MM/yyyy") + "\",");
        DateTime nextDateTime = currentDate.AddDays(1);
        string nextDate = nextDateTime.ToString("dd/MM/yyyy");
        if (nextDateTime > DateTime.Today)
        {
            nextDate = "0";
        }

        Response.Write("\"nextDate\" : \"" + nextDate + "\"");
        Response.Write("}");
        
    }
}