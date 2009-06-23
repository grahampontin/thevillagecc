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
using CricketClubDAL;

public partial class SQLAdmin : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }
    protected void TextBox1_TextChanged(object sender, EventArgs e)
    {


    }
    protected void Button1_Click(object sender, EventArgs e)
    {
        string SQL = TextBox1.Text;
        if (password.Text == "jsx833n")
        {
            DB myDB = new DB();
            try
            {
                SQlResults.DataSource = myDB.ExecuteSQLAndReturnAllRows(SQL);
                SQlResults.DataBind();
            }
            catch (Exception ex)
            {
                Message.Text = ex.Message;
            }
        }
    }
}
