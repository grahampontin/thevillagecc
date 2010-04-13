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

public partial class UserControls_Footer : System.Web.UI.UserControl
{
    protected void Page_Load(object sender, EventArgs e)
    {
        Random r = new Random();
        int rand = r.Next(3);
        switch (rand)
        {
            case 1:
                Advert.Text = "<iframe src=\"http://rcm-uk.amazon.co.uk/e/cm?t=thevillagecc-21&o=2&p=48&l=ur1&category=pcvideogames&banner=0ARHTTTPV6PH0V84N202&f=ifr\" width=\"728\" height=\"90\" scrolling=\"no\" border=\"0\" marginwidth=\"0\" style=\"border:none;\" frameborder=\"0\"></iframe>";
                break;
            case 2:
                Advert.Text = "<iframe src=\"http://rcm-uk.amazon.co.uk/e/cm?t=thevillagecc-21&o=2&p=26&l=ur1&category=dvd&banner=0TGDHRG8B7QM5GWTSXR2&f=ifr\" width=\"468\" height=\"60\" scrolling=\"no\" border=\"0\" marginwidth=\"0\" style=\"border:none;\" frameborder=\"0\"></iframe>";
                break;
            default:
                Advert.Text = "<iframe src=\"http://rcm-uk.amazon.co.uk/e/cm?t=thevillagecc-21&o=2&p=48&l=ur1&category=books&banner=1M2038RZZC2NMP3NZXG2&f=ifr\" width=\"728\" height=\"90\" scrolling=\"no\" border=\"0\" marginwidth=\"0\" style=\"border:none;\" frameborder=\"0\"></iframe>";
                break;
        }
    }
}
