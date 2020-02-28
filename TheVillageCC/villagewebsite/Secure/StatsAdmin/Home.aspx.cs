using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using CricketClubMiddle;

public partial class Secure_StatsAdmin_Home : CricketClubMiddle.Web.SecurePage
{
    protected void Page_Load(object sender, EventArgs e)
    {
        string action = Request["action"];
        switch (action)
        {
            case "editPlayer":
                Welcome.Visible = false;
                EditPlayer.Visible = true;
                if (!IsPostBack)
                {
                    EditPlayerListPlayers.Items.Add(new ListItem("Please Select..."));
                    EditPlayerListPlayers.Items.AddRange(Player.GetAll().OrderBy(a => a.FormalName).Select(a => new ListItem(a.FormalName)).ToArray());
                }
                break;
            case "editVenue":
                EditVenue.Visible = true;
                Welcome.Visible = false;
                if (!IsPostBack)
                {
                    VenuesDropDownList.Items.Add(new ListItem("Please Select..."));
                    VenuesDropDownList.Items.AddRange(Venue.GetAll().OrderBy(a => a.Name).Select(a => new ListItem(a.Name)).ToArray());
                }
                break;
            case "editMatch":
                EditMatch.Visible = true;
                Welcome.Visible = false;

                if (!IsPostBack)
                {
                    MatchesDownList.Items.Add(new ListItem("Please Select..."));
                    MatchesDownList.Items.AddRange(Match.GetFixtures().Union(Match.GetResults()).OrderBy(a => a.MatchDate).Select(a => new ListItem(a.Opposition.Name + " (" + a.MatchDateString + ")")).ToArray());

                    HomeAway.DataSource = Enum.GetNames(typeof(CricketClubDomain.HomeOrAway));
                    MatchType.DataSource = Enum.GetNames(typeof(CricketClubDomain.MatchType));
                    HomeAway.DataBind();
                    MatchType.DataBind();

                    EditMatchVenuesDropDownList.Items.Add(new ListItem("Please Select..."));
                    EditMatchVenuesDropDownList.Items.AddRange(Venue.GetAll().OrderBy(a => a.Name).Select(a => new ListItem(a.Name)).ToArray());

                    OppositionDropDown.Items.Add(new ListItem("Please Select..."));
                    OppositionDropDown.Items.AddRange(Team.GetAll().OrderBy(a => a.Name).Select(a => new ListItem(a.Name)).ToArray());
                }

                break;
            case "editOppo":
                EditOppo.Visible = true;
                Welcome.Visible = false;
                if (!IsPostBack)
                {
                    OppositonDropDownList.Items.Add(new ListItem("Please Select..."));
                    OppositonDropDownList.Items.AddRange(Team.GetAll().OrderBy(a => a.Name).Where(a=>a.ID > 0).Select(a => new ListItem(a.Name)).ToArray());
                }
                break;
                
        }

    }
    protected void EditPlayerListPlayers_SelectedIndexChanged(object sender, EventArgs e)
    {
        Message.Visible = false;
        EditPlayerSubmit.Visible = true;
        if (EditPlayerListPlayers.SelectedValue != "Please Select...")
        {
            Player p = Player.GetAll().Where(a=>a.FormalName == EditPlayerListPlayers.SelectedValue).FirstOrDefault();
            EditPlayerFirstName.Text = p.FirstName;
            EditPlayerLastName.Text = p.Surname;
            EditPlayerInitials.Text = p.MiddleInitials;

            EditPlayerSubmit.Text = "Update Player";
        } else {
            EditPlayerFirstName.Text ="";
            EditPlayerLastName.Text = "";
            EditPlayerInitials.Text = "";
            EditPlayerSubmit.Text = "Create Player";
        }
    }
    protected void EditPlayerSubmit_Click(object sender, EventArgs e)
    {
        if (EditPlayerFirstName.Text.Length > 0 && EditPlayerLastName.Text.Length > 0)
        {
            Player p = null;
            if (EditPlayerListPlayers.SelectedValue != "Please Select...")
            {
                p = Player.GetAll().Where(a => a.FormalName == EditPlayerListPlayers.SelectedValue).FirstOrDefault();
                Message.InnerText = "Player Updated";
            }
            else
            {
                p = Player.CreateNewPlayer(EditPlayerFirstName.Text + " " + EditPlayerLastName.Text);
                Message.InnerText = "Player Created";
            }
            p.FirstName = EditPlayerFirstName.Text;
            p.Surname = EditPlayerLastName.Text;
            p.MiddleInitials = EditPlayerInitials.Text;
            p.Save();

            EditPlayerSubmit.Visible = false;
            Message.Visible = true;
        }
        else
        {
            Message.InnerText = "You must provide a first name and surname";
            Message.Visible = true;
        }

    }
    protected void VenuesDropDownList_SelectedIndexChanged(object sender, EventArgs e)
    {
        Message.Visible = false;
        VenueSubmit.Visible = true;

        if (VenuesDropDownList.SelectedValue != "Please Select...")
        {
            VenueSubmit.Text = "Update Venue";
            Venue v = Venue.GetByName(VenuesDropDownList.SelectedValue);
            VenueName.Text = v.Name;
            VenueMapsUrl.Text = v.GoogleMapsLocationURL;
        }
        else
        {
            VenueName.Text = "";
            VenueMapsUrl.Text = "";
            VenueSubmit.Text = "Create Venue";
        }

    }
    protected void VenueSubmit_Click(object sender, EventArgs e)
    {
        if (VenueName.Text.Length > 0)
        {
            Venue v = null;
            if (VenuesDropDownList.SelectedValue != "Please Select...")
            {
                v = Venue.GetByName(VenuesDropDownList.SelectedValue);
                Message.InnerText = "Venue Updated";
            }
            else
            {
                if (Venue.GetByName(VenueName.Text) == null)
                {
                    v = Venue.CreateNewVenue(VenueName.Text);
                    Message.InnerText = "Venue Created";
                }
                else
                {
                    v = Venue.GetByName(VenueName.Text);
                    Message.InnerText = "Venue Already Exists";
                }
                
            }
            v.Name = VenueName.Text;
            v.GoogleMapsLocationURL = VenueMapsUrl.Text;
            v.Save();

            VenueSubmit.Visible = false;
            Message.Visible = true;
        }
        else
        {
            Message.InnerText = "You must provide a venue name";
            Message.Visible = true;
        }
    }
    protected void MatchesDownList_SelectedIndexChanged(object sender, EventArgs e)
    {
        Message.Visible = false;
        MatchSubmitButton.Visible = true;
        if (MatchesDownList.SelectedValue != "Please Select...")
        {
            Match m = Match.GetFixtures().Union(Match.GetResults()).Where(a => MatchesDownList.SelectedValue == a.Opposition.Name + " (" + a.MatchDateString + ")").FirstOrDefault();
            EditMatchVenuesDropDownList.SelectedIndex = EditMatchVenuesDropDownList.Items.IndexOf(EditMatchVenuesDropDownList.Items.FindByValue(m.Venue.Name));
            OppositionDropDown.SelectedIndex = OppositionDropDown.Items.IndexOf(OppositionDropDown.Items.FindByValue(m.Opposition.Name));
            EditMatchVenuesDropDownList.SelectedIndex = EditMatchVenuesDropDownList.Items.IndexOf(EditMatchVenuesDropDownList.Items.FindByValue(m.Venue.Name));
            MatchDate.Text = m.MatchDate.ToString("dd MMMM yyyy");
            MatchType.SelectedIndex = MatchType.Items.IndexOf(MatchType.Items.FindByValue(m.Type.ToString()));
            HomeAway.SelectedIndex = HomeAway.Items.IndexOf(HomeAway.Items.FindByValue(m.HomeOrAway.ToString()));

            MatchSubmitButton.Text = "Update Match";
        }
        else
        {
            EditMatchVenuesDropDownList.SelectedIndex = 0;
            MatchType.SelectedIndex = 0;
            OppositionDropDown.SelectedIndex = 0;
            EditMatchVenuesDropDownList.SelectedIndex = 0;
            HomeAway.SelectedIndex = 0;
            MatchDate.Text = "";
            MatchSubmitButton.Text = "Create Match";
        }
    }
    protected void MatchSubmitButton_Click(object sender, EventArgs e)
    {
        Match m = null;
        if (MatchesDownList.SelectedValue != "Please Select...")
        {
            try
            {
                m = Match.GetFixtures().Union(Match.GetResults()).Where(a => MatchesDownList.SelectedValue == a.Opposition.Name + " (" + a.MatchDateString + ")").FirstOrDefault();
                m.VenueID = Venue.GetByName(EditMatchVenuesDropDownList.SelectedValue).ID;
                m.OppositionID = Team.GetByName(OppositionDropDown.SelectedValue).ID;
                m.MatchDate = DateTime.Parse(MatchDate.Text);
                m.HomeOrAway = CricketClubDomain.HomeOrAway.Home;
                if (HomeAway.SelectedValue == "Away")
                {
                    m.HomeOrAway = CricketClubDomain.HomeOrAway.Away;
                }
                m.Type = (CricketClubDomain.MatchType)Enum.Parse(typeof(CricketClubDomain.MatchType), MatchType.SelectedValue);
                m.Save();
                Message.InnerText = "Match Updated";
                MatchSubmitButton.Visible = false;
                Message.Visible = true;
            }
            catch
            {
                Message.InnerText = "Update Failed - Check Date format";
            }

        }
        else
        {
            try
            {
                Match.CreateNewMatch(Team.GetByName(OppositionDropDown.SelectedValue),
                                        DateTime.Parse(MatchDate.Text),
                                         Venue.GetByName(EditMatchVenuesDropDownList.SelectedValue),
                                        (CricketClubDomain.MatchType)Enum.Parse(typeof(CricketClubDomain.MatchType), MatchType.SelectedValue),
                                        (CricketClubDomain.HomeOrAway)Enum.Parse(typeof(CricketClubDomain.HomeOrAway), HomeAway.SelectedValue));
                Message.InnerText = "Match Created";
                Message.Visible = true;
                MatchSubmitButton.Visible = false;
            }
            catch
            {
                Message.InnerText = "Match Creation Failed - Check Date format";
            }
        }
    }
    protected void OppositonDropDownList_SelectedIndexChanged(object sender, EventArgs e)
    {
        Message.Visible = false;
        OppoSubmit.Visible = true;

        if (OppositonDropDownList.SelectedValue != "Please Select...")
        {
            OppoSubmit.Text = "Update Team";
            Team t = Team.GetByName(OppositonDropDownList.SelectedValue);
            OppoName.Text = t.Name;
        }
        else
        {
            OppoName.Text = "";
            OppoSubmit.Text = "Create Team";
        }
    }
    protected void OppoSubmit_Click(object sender, EventArgs e)
    {
        if (OppoName.Text.Length > 0)
        {
            Team t = null;
            if (OppositonDropDownList.SelectedValue != "Please Select...")
            {
                t = Team.GetByName(OppositonDropDownList.SelectedValue);
                Message.InnerText = "Team Updated";
            }
            else
            {
                if (Team.GetByName(OppoName.Text) == null)
                {
                    t = Team.CreateNewTeam(OppoName.Text);
                    Message.InnerText = "Team Created";
                }
                else
                {
                    t = Team.GetByName(OppoName.Text);
                    Message.InnerText = "Team Already Exists";
                }

            }
            t.Name = OppoName.Text;
            t.Save();

            OppoSubmit.Visible = false;
            Message.Visible = true;
        }
        else
        {
            Message.InnerText = "You must provide a team name";
            Message.Visible = true;
        }
    }
}
