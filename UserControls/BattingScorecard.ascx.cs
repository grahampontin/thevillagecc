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
using CricketClubMiddle.Stats;
using CricketClubMiddle;
using CricketClubDomain;

public partial class UserControls_BattingScorecard : System.Web.UI.UserControl
{
    public BattingCard Card;
    private Match match;
    protected void Page_Load(object sender, EventArgs e)
    {
        ThemOrUs who;
        if (Card != null)
        {

            match = new Match(Card.MatchID);
            if (Card.ScorecardData.Count >0 && Card.ScorecardData[0].Batsman.ID > 0)
            {
                Overs.Text = match.OurInningsLength.ToString();
                who=ThemOrUs.Us;
            }
            else
            {
                Overs.Text = match.TheirInningsLength.ToString();
                who=ThemOrUs.Them;
            }
            ThemOrUs who2 = ThemOrUs.Them;
            if (who == who2)
            {
                who2 = ThemOrUs.Us;
            }
            Extras extras = new Extras(match.ID, who2);
            ExtrasDetail.Text = extras.Byes.ToString() + "b " + extras.LegByes.ToString() + "lb " + extras.NoBalls.ToString() + "nb " + extras.Penalty.ToString() + "p " + extras.Wides.ToString() + "w";
            ExtrasTotal.Text = Card.Extras.ToString();
            TotalScore.Text = Card.Total.ToString();
            int wicketsDown;
            bool declared;
            if (who == ThemOrUs.Us) {
                wicketsDown = match.GetTeamWicketsDown(match.Us);
                declared = match.WeDeclared;
            } else {
                wicketsDown = match.GetTeamWicketsDown(match.Opposition);
                declared = match.TheyDeclared;
            }
            WicketsText.Text = "for " + wicketsDown.ToString();
            if (wicketsDown == 10)
            {
                WicketsText.Text = "all out";
            }
            if (declared)
            {
                WicketsText.Text += " declared";
            }
            ScorecardLV.DataSource = Card.ScorecardData;
            ScorecardLV.DataBind();
        }
    }
    protected void ScorecardLV_ItemDataBound(object sender, ListViewItemEventArgs e)
    {
        var test = (BattingCardLine)(((ListViewDataItem)e.Item).DataItem);
        if (test.BattingAt % 2 == 0)
        {
            ((HtmlTableRow)e.Item.FindControl("TableRow")).Attributes["class"] += "scEvenRow";
        }
        else
        {
            ((HtmlTableRow)e.Item.FindControl("TableRow")).Attributes["class"] += "scOddRow";
        }
        if (test.Batsman.ID == match.WicketKeeper.ID)
        {
            ((Literal)e.Item.FindControl("CaptainWK")).Text += "&#134".ToString();
        }
        if (test.Batsman.ID == match.Captain.ID)
        {
            ((Literal)e.Item.FindControl("CaptainWK")).Text += "*";
        }
    }
}
