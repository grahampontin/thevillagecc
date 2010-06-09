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
using CricketClubMiddle.Stats;
using CricketClubMiddle.Utility;
using System.Collections.Generic;
using CricketClubDomain;
using CricketClubAccounts;

public partial class stats_MatchWizard : System.Web.UI.Page
{
    Match selectedMatch;
    IEnumerable<Match> matches;
    int step;
    bool wasError;
    string errorText;
    public string batsman_select ="";

    protected void Page_Load(object sender, EventArgs e)
    {
        #region session maintenance
        if (Session["selectedMatch"] != null)
        {
            selectedMatch = (Match)Session["selectedMatch"];
        }
        if (Request["Continue"] != null)
        {
            step = int.Parse(Request["Continue"].Replace("Step ","").Replace(" >",""));
            
        }
        else
        {
            step = 1;
        }
        NextStep.Text = (step + 1).ToString();
        StepNumber.Text = step.ToString();

        //hacky, but makes life easier:
        InternalCache playersCache = InternalCache.GetInstance();
        if (playersCache.Get("players") == null)
        {
            playersCache.Insert("players", Player.GetAll().Where(a => a.IsActive).OrderBy(a => a.Name), new TimeSpan(0, 5, 0));
        }
        IEnumerable<Player> players = (IEnumerable<Player>)playersCache.Get("players");
        foreach (Player p in players)
        {
            batsman_select += "<option value='"+p.ID+"'>"+p.Name+"</option>";
        }

        #endregion

        #region step1
        if (step == 1)
        {
            Step1.Visible = true;
            StepTitle.Text = "Choose match";
            int currentYear = DateTime.Today.Year;
            DateTime startDate = new DateTime(currentYear, 4, 1);
            DateTime endDate = new DateTime(currentYear + 1, 3, 30);

            matches = from a in Match.GetResults(startDate, endDate) where a.MatchDate < DateTime.Today.AddMonths(1) select a;
            MatchesDropDown.DataSource = matches;
            if (!IsPostBack)
            {
                MatchesDropDown.DataBind();
            }
            if (matches.Any())
            {
                Match match = matches.First();
                HomeTeamCheck.Text = match.HomeTeamName;
                AwayTeamCheck.Text = match.AwayTeamName;
                VenueCheck.Text = match.VenueName;
                DateCheck.Text = match.MatchDate.ToShortDateString();
                Session.Add("selectedMatch", match);
            }


        }
        else
        {
            Step1.Visible = false;
        }
        #endregion

        #region step2
        if (step == 2)
        {
            if (selectedMatch != null)
            {
                Step2.Visible = true;
                StepTitle.Text = "Match Details";
                WizardHeading.Text = selectedMatch.HomeTeamName + " vs " + selectedMatch.AwayTeamName;
                List<Venue> venues = new List<Venue>();
                venues.Add(selectedMatch.Venue);
                venues.AddRange(Venue.GetAll());
                VenueDropDown.DataSource = venues;
                VenueDropDown.DataBind();
                MatchDate.Text = selectedMatch.MatchDate.ToLongDateString();
                if (selectedMatch.WasDeclaration)
                {
                    DeclarationMatch.Checked = true;
                    OversMatch.Checked = false;
                }
                if (selectedMatch.WonToss)
                {
                    TossWinnerUs.Checked = true;
                }
                else
                {
                    TossWinnerThem.Checked = true;
                }
                if (selectedMatch.TossWinnerBatted)
                {
                    DescisionBatted.Checked = true;
                }
                else
                {
                    DescisionBowled.Checked = true;
                }
                NumberOfOvers.Text = selectedMatch.Overs.ToString();
            }
            else
            {
                throw new ApplicationException("No Match Selected!");
            }

        }
        else
        {
            Step2.Visible = false;
        }
        #endregion

        #region step3
        if (step == 3)
        {
            Step3.Visible = true;
            StepTitle.Text = "Home Team Batting Data";
            //Deal with step 2 output:

            #region venue & date
            if (VenueDropDown.SelectedValue != selectedMatch.VenueName)
            {
                try
                {
                    selectedMatch.VenueID = Venue.GetByName(VenueDropDown.SelectedValue).ID;
                }
                catch (Exception ex)
                {
                    wasError = true;
                    errorText += "Problem asigning new venue!<BR>" + ex.Message + "<BR>";
                }
            }
            DateTime NewMatchDate;
            if (DateTime.TryParse(MatchDate.Text, out NewMatchDate))
            {
                selectedMatch.MatchDate = NewMatchDate;
            }
            else
            {
                wasError = true;
                errorText += "Match Date could not be parsed!<BR>";
            }
            #endregion

            #region match type
            int Overs;
            int.TryParse(NumberOfOvers.Text, out Overs);
            if (OversMatch.Checked)
            {
                if (Overs > 0)
                {
                    selectedMatch.Overs = Overs;
                    selectedMatch.WasDeclaration = false;
                }
                else
                {
                    wasError = true;
                    errorText += "Please input number of overs > 0<BR>";
                }
            }
            else if (DeclarationMatch.Checked)
            {
                selectedMatch.WasDeclaration = true;
            }

            #endregion

            if (AbandonendYes.Checked)
            {
                selectedMatch.Abandoned = true;
                step = 11;
                NextStep.Text = "12";
                Step3.Visible = false;
            }
            if (TossWinnerUs.Checked)
            {
                selectedMatch.WonToss = true;
            }
            else if (TossWinnerThem.Checked)
            {
                selectedMatch.WonToss = false;
            }
            else
            {
                wasError = true;
                errorText += "Please say who won the toss<BR>";
            }

            if (DescisionBatted.Checked)
            {
                selectedMatch.TossWinnerBatted = true;
            }
            else if (DescisionBowled.Checked)
            {
                selectedMatch.TossWinnerBatted = false;
            }
            else
            {
                wasError = true;
                errorText += "Please say if the toss winners batted or bowled<BR>";
            }
            if (!wasError)
            {
                try
                {
                    selectedMatch.Save();
                }
                catch (Exception ex)
                {
                    wasError = true;
                    errorText += "Something unexpected went wrong!<BR>" + ex.Message + "<BR>" + ex.StackTrace;
                }
            }

            if (!wasError)
            {
                selectedMatch.ClearCache();
                List<BattingCardLine> lines = selectedMatch.GetOurBattingScoreCard().ScorecardData;
                while (lines.Count < 11) {
                    lines.Add(new BattingCardLine(new BattingCardLineData()));
                }
                OurBattingScoreCardLV.DataSource = lines;
                OurBattingScoreCardLV.DataBind();

                step3Extras.Text = selectedMatch.GetOurBattingScoreCard().Extras.ToString();
                if (selectedMatch.WeDeclared)
                {
                    OurInningsDeclared.Checked = true;
                }
                else
                {
                    OurInningsDeclared.Checked = false;
                }
                OurInningsOvers.Text = selectedMatch.OurInningsLength.ToString();
                

            }
            else
            {
                Step3.Visible = false;
                ErrorMessage.Visible = true;
                ErrorMessage.InnerHtml = errorText;
                ButtonDiv.InnerHtml = "<BR><BR><input type=button value=\"Go Back\" onclick='javascript:history.back()' />";
            }

        }
        else
        {
            Step3.Visible = false;
        }
        #endregion

        #region step4
        if (step == 4)
        {
            Step4.Visible = true;
            var test = Request.Params.Keys.Cast<string>().Where(a => a.Contains("batsmanSelect"));
            List<Player> batsmen = new List<Player>();
            foreach (string key in test)
            {
                batsmen.Add(players.Where(a => a.Name == Request[key]).FirstOrDefault());
            }

            if (batsmen.Where(a => a.Name.Length > 0).Distinct().Count() != batsmen.Where(b => b.Name.Length > 0).Count())
            {
                wasError = true;
                errorText += "The Same Batsman cannot bat twice!!<BR>";
            }
            
            bool foundNullBatsman = false;

            foreach (Player batsman in batsmen)
            {
                if (!string.IsNullOrEmpty(batsman.Name) && foundNullBatsman)
                {
                    wasError = true;
                    errorText += "There was a batsman missing at position " + (int)(batsmen.IndexOf(batsman) + 1) + "<BR>";
                }
                if (string.IsNullOrEmpty(batsman.Name))
                {
                    foundNullBatsman = true;
                }
               
            }
            var howouts = Request.Params.Keys.Cast<string>().Where(a => a.Contains("howOutSelect"));

            List<ModesOfDismissal> BatsmenHowOuts = new List<ModesOfDismissal>();
            foreach (string howOut in howouts)
            {
                ModesOfDismissal mod = (ModesOfDismissal)Enum.Parse(typeof(ModesOfDismissal), Request[howOut]);
                BatsmenHowOuts.Add(mod);
            }

            List<string> Fielders = GetObjects("fielderTB");
            List<string> Bowlers = GetObjects("bowlerTB");

            List<string> strScores = GetObjects("scoreTB");
            List<string> strFours = GetObjects("foursTB");
            List<string> strSixes = GetObjects("sixesTB");

            List<int> Fours = new List<int>();
            List<int> Sixes = new List<int>();
            List<int> Scores = new List<int>();

            try
            {
                Fours = (from a in strFours select int.Parse(a)).ToList();
                Sixes = (from a in strSixes select int.Parse(a)).ToList();
                Scores = (from a in strScores select int.Parse(a)).ToList();

            }
            catch
            {
                wasError = true;
                errorText += "Could not parse one of the scores, 4s or 6s - please ensure all are numbers<BR>";
            }


            if (!wasError)
            {
                try
                {
                    if (OurInningsDeclared.Checked)
                    {
                        selectedMatch.WeDeclared = true;
                    }
                    else
                    {
                        selectedMatch.WeDeclared = false;
                    }
                    double ourOvers = 0.0;
                    if (!(double.TryParse(OurInningsOvers.Text, out ourOvers)))
                    {
                        wasError = true;
                        errorText += "Failed to parse length of our innings, please enter a valid double, eg 12.5<BR><BR>";
                    }
                    selectedMatch.OurInningsLength = ourOvers;
                    BattingCard OurBatting = new BattingCard(selectedMatch.ID, ThemOrUs.Us);
                    List<BattingCardLine> thisCard = new List<BattingCardLine>();
                    int batsmanNumber = 1;
                    foreach (Player player in batsmen)
                    {
                        if (player.Name.Length > 0)
                        {
                            BattingCardLineData bl = new BattingCardLineData();
                            bl.BattingAt = batsmanNumber;
                            bl.BowlerName = Bowlers[batsmanNumber-1];
                            bl.FielderName = Fielders[batsmanNumber-1];
                            bl.Score = Scores[batsmanNumber-1];
                            bl.Fours = Fours[batsmanNumber-1];
                            bl.Sixes = Sixes[batsmanNumber-1];
                            bl.ModeOfDismissal = (int)BatsmenHowOuts[batsmanNumber-1];
                            bl.PlayerID = player.ID;
                            thisCard.Add(new BattingCardLine(bl));
                            batsmanNumber++;
                        }
                    }
                    int extras = int.Parse(Request["extras"]);
                    OurBatting.ScorecardData = thisCard;
                    OurBatting.Extras = extras;
                    OurBatting.Save(BattingOrBowling.Batting);
                    selectedMatch.Save();
                }
                catch (Exception ex)
                {
                    wasError = true;
                    errorText += "Shit. Something went wrong unexpectedly<BR>" + ex.Message + "<BR><BR>" + ex.StackTrace;
                }

            }


            if (!wasError)
            {
                StepTitle.Text = selectedMatch.Us.Name + " extras data";
                step4Extras.Text = selectedMatch.GetOurBattingScoreCard().Extras.ToString();
                Extras extras = new Extras(selectedMatch.ID, ThemOrUs.Them);
                step4byes.Value = extras.Byes.ToString();
                step4leg_byes.Value = extras.LegByes.ToString();
                step4wides.Value = extras.Wides.ToString();
                step4no_balls.Value = extras.NoBalls.ToString();
                step4penalty.Value = extras.Penalty.ToString();

            }
            else
            {
                Step4.Visible = false;
                ErrorMessage.Visible = true;
                ErrorMessage.InnerHtml = errorText;
                ButtonDiv.InnerHtml = "<BR><BR><input type=button value=\"Go Back\" onclick='javascript:history.back()' />";

            }

        }
        else
        {
            Step4.Visible = false;
        }
        #endregion

        #region step5
        if (step == 5)
        {
            Step5.Visible = true;
            StepTitle.Text = selectedMatch.Opposition.Name + " bowling data";
            //Check step 4
            try
            {
                int Byes = int.Parse(step4byes.Value);
                int Wides = int.Parse(step4wides.Value);
                int NoBalls = int.Parse(step4no_balls.Value);
                int Penalty = int.Parse(step4penalty.Value);
                int LegByes = int.Parse(step4leg_byes.Value);
                Extras extras = new Extras(selectedMatch.ID, ThemOrUs.Them);
                extras.Byes = Byes;
                extras.Wides = Wides;
                extras.NoBalls = NoBalls;
                extras.Penalty = Penalty;
                extras.LegByes = LegByes;
                if (Byes + Wides + NoBalls + Penalty + LegByes == selectedMatch.GetOurBattingScoreCard().Extras)
                {
                    extras.Save();
                }
                else
                {
                    wasError = true;
                    errorText = "Values do not up to the total. Please check you maths";
                }
            }
            catch
            {
                wasError = true;
                errorText = "Failed to save extras - check all values are numbers";
            }

            if (!wasError)
            {
                BowlingStats bs = selectedMatch.GetThierBowlingStats();
                List<BowlingStatsLine> data = bs.BowlingStatsData;
                while (data.Count < 10)
                {
                    data.Add(new BowlingStatsLine(new BowlingStatsEntryData()));
                }
                TheirBowlingListView.DataSource = data;
                TheirBowlingListView.DataBind();
            }
            else
            {
                Step4.Visible = false;
                ErrorMessage.Visible = true;
                ErrorMessage.InnerHtml = errorText;
                ButtonDiv.InnerHtml = "<BR><BR><input type=button value=\"Go Back\" onclick='javascript:history.back()' />";
            }

        }
        else
        {
            Step5.Visible = false;

        }
        #endregion

        #region step6
        if (step == 6)
        {
            Step6.Visible = true;
            StepTitle.Text = selectedMatch.Us.Name + " FoW data (optional)";
            //Deal with step 5 data
            try
            {
                List<string> bowlerNames = GetObjects("step5bowler");
                List<string> overs = GetObjects("step5overs");
                List<string> maidens = GetObjects("step5maidens");
                List<string> runs = GetObjects("step5runs");
                List<string> wickets = GetObjects("step5wickets");
                selectedMatch.ClearCache();
                BowlingStats bs = selectedMatch.GetThierBowlingStats();
                List<BowlingStatsLine> data = new List<BowlingStatsLine>();
                int bowlerIndex = 0;

                foreach (string bowler in bowlerNames)
                {
                    if (!string.IsNullOrEmpty(bowler))
                    {
                        BowlingStatsEntryData dataline = new BowlingStatsEntryData();
                        dataline.PlayerName = bowler;
                        dataline.Maidens = int.Parse(maidens[bowlerIndex]);
                        dataline.Overs = int.Parse(overs[bowlerIndex]);
                        dataline.Runs = int.Parse(runs[bowlerIndex]);
                        dataline.Wickets = int.Parse(wickets[bowlerIndex]);
                        dataline.MatchID = selectedMatch.ID;

                        BowlingStatsLine line = new BowlingStatsLine(dataline);
                        data.Add(line);
                    }
                    bowlerIndex++;
                }
                bs.BowlingStatsData = data;
                if (data.Count > 0)
                {
                    bs.Save();
                }
                else
                {
                    wasError = true;
                    errorText = "You must specify at least 1 bowler.";
                }
            }
            catch (Exception ex)
            {
                wasError = true;
                errorText = "Something went wrong:<BR><BR>" + ex.Message + "<BR><BR>" + ex.StackTrace;
            }

            if (!wasError)
            {
                FoWStats fow = new FoWStats(selectedMatch.ID, ThemOrUs.Us);
                foreach (FoWStatsLine line in fow.Data)
                {
                    switch (line.Wicket)
                    {
                        case 1:
                            fowNoBat1.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore1.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat1.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore1.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore1.Text = line.Score.ToString();
                            fowPartnership1.Text = line.Partnership.ToString();
                            fowOver1.Text = line.Over.ToString();
                            break;
                        case 2:
                            fowNoBat2.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore2.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat2.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore2.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore2.Text = line.Score.ToString();
                            fowPartnership2.Text = line.Partnership.ToString();
                            fowOver2.Text = line.Over.ToString();
                            break;
                        case 3:
                            fowNoBat3.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore3.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat3.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore3.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore3.Text = line.Score.ToString();
                            fowPartnership3.Text = line.Partnership.ToString();
                            fowOver3.Text = line.Over.ToString();
                            break;
                        case 4:
                            fowNoBat4.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore4.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat4.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore4.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore4.Text = line.Score.ToString();
                            fowPartnership4.Text = line.Partnership.ToString();
                            fowOver4.Text = line.Over.ToString();
                            break;
                        case 5:
                            fowNoBat5.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore5.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat5.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore5.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore5.Text = line.Score.ToString();
                            fowPartnership5.Text = line.Partnership.ToString();
                            fowOver5.Text = line.Over.ToString();
                            break;
                        case 6:
                            fowNoBat6.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore6.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat6.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore6.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore6.Text = line.Score.ToString();
                            fowPartnership6.Text = line.Partnership.ToString();
                            fowOver6.Text = line.Over.ToString();
                            break;
                        case 7:
                            fowNoBat7.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore7.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat7.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore7.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore7.Text = line.Score.ToString();
                            fowPartnership7.Text = line.Partnership.ToString();
                            fowOver7.Text = line.Over.ToString();
                            break;
                        case 8:
                            fowNoBat8.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore8.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat8.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore8.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore8.Text = line.Score.ToString();
                            fowPartnership8.Text = line.Partnership.ToString();
                            fowOver8.Text = line.Over.ToString();
                            break;
                        case 9:
                            fowNoBat9.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore9.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat9.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore9.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore9.Text = line.Score.ToString();
                            fowPartnership9.Text = line.Partnership.ToString();
                            fowOver9.Text = line.Over.ToString();
                            break;
                        case 10:
                            fowNoBat10.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore10.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat10.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore10.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore10.Text = line.Score.ToString();
                            fowPartnership10.Text = line.Partnership.ToString();
                            fowOver10.Text = line.Over.ToString();
                            break;

                    }
                }
            }
            else
            {

                Step6.Visible = false;
                ErrorMessage.Visible = true;
                ErrorMessage.InnerHtml = errorText;
                ButtonDiv.InnerHtml = "<BR><BR><input type=button value=\"Go Back\" onclick='javascript:history.back()' />";

            }

        }
        else
        {
            Step6.Visible = false;
        }
        #endregion

        #region step7
        if (step == 7)
        {
            Step7.Visible = true;
            //Deal with step 6 data;
            List<string> strnoBatsmen = Request["fow_nobat"].Split(',').Where(a=>!string.IsNullOrEmpty(a)).ToList<string>();
            List<string> strnoBatsmenScores = Request["fow_nobat_score"].Split(',').Where(a => !string.IsNullOrEmpty(a)).ToList<string>();
            List<string> stroutBatsmen = Request["fow_outgoingbat"].Split(',').Where(a => !string.IsNullOrEmpty(a)).ToList<string>();
            List<string> stroutBatsmenScores = Request["fow_outgoingbat_score"].Split(',').Where(a => !string.IsNullOrEmpty(a)).ToList<string>();
            List<string> strScores = Request["fow_score"].Split(',').Where(a => !string.IsNullOrEmpty(a)).ToList<string>();
            List<string> strOvers = Request["fow_over"].Split(',').Where(a => !string.IsNullOrEmpty(a)).ToList<string>();

            if (strnoBatsmen.Count != strnoBatsmenScores.Count ||
                strnoBatsmen.Count != stroutBatsmen.Count ||
                strnoBatsmen.Count != stroutBatsmenScores.Count ||
                strScores.Count != strnoBatsmen.Count ||
                strOvers.Count != strnoBatsmen.Count)
            {
                wasError = true;
                errorText = "Mismatching numbers of entities: for every wicket you fill in, you must complete ALL values";
            }
            else
            {
                try
                {
                    List<int> noBatsmen = (from a in strnoBatsmen select int.Parse(a)).ToList();
                    List<int> noBatsmenScores = (from a in strnoBatsmenScores select int.Parse(a)).ToList();
                    List<int> outBatsmen = (from a in stroutBatsmen select int.Parse(a)).ToList();
                    List<int> outBatsmenScores = (from a in stroutBatsmenScores select int.Parse(a)).ToList();
                    List<int> Scores = (from a in strScores select int.Parse(a)).ToList();
                    List<int> Overs = (from a in strOvers select int.Parse(a)).ToList();

                    int index = 0;
                    FoWStats fow = new FoWStats(selectedMatch.ID, ThemOrUs.Us);
                    List<FoWStatsLine> stats = new List<FoWStatsLine>();
                    List<int> alreadyOut = new List<int>();
                    int previousOver = 0;
                    foreach (int i in noBatsmen)
                    {

                        FoWDataLine line = new FoWDataLine();
                        line.NotOutBatsman = i;
                        line.NotOutBatsmanScore = noBatsmenScores[index];
                        line.OutgoingBatsman = outBatsmen[index];
                        if (!alreadyOut.Contains(outBatsmen[index]))
                        {
                            alreadyOut.Add(outBatsmen[index]);
                        }
                        else
                        {
                            wasError = true;
                            errorText = "The same batsman cannot be out twice! (batsman: " + outBatsmen[index] + ")"; 
                        }
                        line.OutgoingBatsmanScore = outBatsmenScores[index];
                        line.Wicket = index+1;
                        line.Score = Scores[index];
                        if (index == 0)
                        {
                            line.Partnership = line.Score;
                        }
                        else
                        {
                            line.Partnership = line.Score - Scores[index - 1];
                        }
                        if (line.Partnership < 0)
                        {
                            wasError = true;
                            errorText = "The score can't go backwards! (wicket: " + (int)(index + 1) + ")";
                        }
                        line.OverNumber = Overs[index];
                        if (!(line.OverNumber >= previousOver))
                        {
                            wasError = true;
                            errorText = "The over number can't go backwards! (wicket: " + (int)(index + 1) + ")";
                        }
                        else
                        {
                            previousOver = line.OverNumber;
                        }
                        line.MatchID = selectedMatch.ID;
                        stats.Add(new FoWStatsLine(line));
                        index++;
                    }

                    if (stats.Count > 0 && !wasError)
                    {
                        try
                        {
                            fow.Data = stats;
                            fow.Save();
                        }
                        catch (Exception ex)
                        {
                            wasError = true;
                            errorText = "Something went wrong trying to save the stats: <BR><BR>" + ex.Message + "<BR><BR>" + ex.StackTrace;
                        }
                    }

                    
                }
                catch
                {
                    wasError = true;
                    errorText = "Looks like one of the values you entered wasn't a number.";
                }
            }

            if (!wasError)
            {
                //Step7 Stuff
                StepTitle.Text = selectedMatch.Opposition.Name + " Batting Data";

                selectedMatch.ClearCache();
                List<BattingCardLine> lines = selectedMatch.GetTheirBattingScoreCard().ScorecardData;
                while (lines.Count < 11)
                {
                    lines.Add(new BattingCardLine(new BattingCardLineData()));
                }
                TheirBattingScoreCardLV.DataSource = lines;
                TheirBattingScoreCardLV.DataBind();
                step7Extras.Text = selectedMatch.GetTheirBattingScoreCard().Extras.ToString();
                TheirInningsOvers.Text = selectedMatch.TheirInningsLength.ToString();
                if (selectedMatch.TheyDeclared)
                {
                    TheirInningsDeclared.Checked = true;
                }
                else
                {
                    TheirInningsDeclared.Checked = false;
                }

            }
            else
            {
                Step7.Visible = false;
                ErrorMessage.Visible = true;
                ErrorMessage.InnerHtml = errorText;
                ButtonDiv.InnerHtml = "<BR><BR><input type=button value=\"Go Back\" onclick='javascript:history.back()' />";

            }

        }
        else
        {
            Step7.Visible = false;
        }

        #endregion

        #region step8

        if (step == 8)
        {
            //4 & 8 are the same HTML
            Step4.Visible = true;
            StepTitle.Text = selectedMatch.Opposition.Name + " extras data";

            BattingCard thierBatting = selectedMatch.GetTheirBattingScoreCard();

            if (TheirInningsDeclared.Checked)
            {
                selectedMatch.TheyDeclared = true;
            }
            else
            {
                selectedMatch.TheyDeclared = false;
            }

            double thierOvers = 0.0;
            if (!(double.TryParse(TheirInningsOvers.Text, out thierOvers)))
            {
                wasError = true ;
                errorText += "Failed to parse length of their innings please enter a valid double, e.g 21.4)<BR><BR>";
            }
            selectedMatch.TheirInningsLength = thierOvers;
            List<string> FielderNames = GetObjects("fielderSelect");
            List<string> Batsmen = GetObjects("batsmanTB");
            List<string> BowlerNames = GetObjects("bowlerSelect");

            List<Player> Fielders = new List<Player>();
            foreach (string name in FielderNames)
            {
                Fielders.Add(players.Where(a => a.Name == name).FirstOrDefault());
            }

            List<Player> Bowlers = new List<Player>();
            foreach (string name in BowlerNames)
            {
                Bowlers.Add(players.Where(a => a.Name == name).FirstOrDefault());
            }

            var howouts = Request.Params.Keys.Cast<string>().Where(a => a.Contains("howOutSelect"));
            List<ModesOfDismissal> BatsmenHowOuts = new List<ModesOfDismissal>();
            foreach (string howOut in howouts)
            {
                ModesOfDismissal mod = (ModesOfDismissal)Enum.Parse(typeof(ModesOfDismissal), Request[howOut]);
                BatsmenHowOuts.Add(mod);
            }

            List<string> strScores = GetObjects("scoreTB");
            List<string> strFours = GetObjects("foursTB");
            List<string> strSixes = GetObjects("sixesTB");

            List<int> Fours = new List<int>();
            List<int> Sixes = new List<int>();
            List<int> Scores = new List<int>();

            try
            {
                Fours = (from a in strFours select int.Parse(a)).ToList();
                Sixes = (from a in strSixes select int.Parse(a)).ToList();
                Scores = (from a in strScores select int.Parse(a)).ToList();

            }
            catch
            {
                wasError = true;
                errorText += "Could not parse one of the scores, 4s or 6s - please ensure all are numbers<BR>";
            }

            if (!wasError)
            {
                try
                {
                    BattingCard theirBatting = new BattingCard(selectedMatch.ID, ThemOrUs.Them);
                    List<BattingCardLine> thisCard = new List<BattingCardLine>();
                    int batsmanNumber = 1;
                    foreach (string batsman in Batsmen)
                    {
                        if (!string.IsNullOrEmpty(batsman))
                        {
                            BattingCardLineData bl = new BattingCardLineData();
                            bl.BattingAt = batsmanNumber;
                            bl.BowlerID = Bowlers[batsmanNumber - 1].ID;
                            bl.FielderID = Fielders[batsmanNumber - 1].ID;
                            bl.Score = Scores[batsmanNumber - 1];
                            bl.Fours = Fours[batsmanNumber - 1];
                            bl.Sixes = Sixes[batsmanNumber - 1];
                            bl.ModeOfDismissal = (int)BatsmenHowOuts[batsmanNumber - 1];
                            bl.PlayerName = batsman;
                            thisCard.Add(new BattingCardLine(bl));
                            batsmanNumber++;
                        }
                    }
                    int extras = int.Parse(Request["extras"]);
                    theirBatting.ScorecardData = thisCard;
                    theirBatting.Extras = extras;
                    theirBatting.Save(BattingOrBowling.Bowling);
                    selectedMatch.Save();
                }
                catch (Exception ex)
                {
                    wasError = true;
                    errorText += "Shit. Something went wrong unexpectedly<BR>" + ex.Message + "<BR><BR>" + ex.StackTrace;
                }
            }

            if (!wasError)
            {
                //Step8 Stuff
                step4Extras.Text = selectedMatch.GetTheirBattingScoreCard().Extras.ToString();
                Extras extras = new Extras(selectedMatch.ID, ThemOrUs.Us);
                step4byes.Value = extras.Byes.ToString();
                step4leg_byes.Value = extras.LegByes.ToString();
                step4wides.Value = extras.Wides.ToString();
                step4no_balls.Value = extras.NoBalls.ToString();
                step4penalty.Value = extras.Penalty.ToString();

            }
            else
            {
                Step4.Visible = false;
                ErrorMessage.Visible = true;
                ErrorMessage.InnerHtml = errorText;
                ButtonDiv.InnerHtml = "<BR><BR><input type=button value=\"Go Back\" onclick='javascript:history.back()' />";

            }

        }
        else
        {
            if (step != 4)
            {
                Step4.Visible = false;
            }
        }


        #endregion

        #region step9

        if (step == 9)
        {
            Step9.Visible = true;
            StepTitle.Text = selectedMatch.Us.Name + " bowling data";
            //Check step 4
            try
            {
                int Byes = int.Parse(step4byes.Value);
                int Wides = int.Parse(step4wides.Value);
                int NoBalls = int.Parse(step4no_balls.Value);
                int Penalty = int.Parse(step4penalty.Value);
                int LegByes = int.Parse(step4leg_byes.Value);
                Extras extras = new Extras(selectedMatch.ID, ThemOrUs.Us);
                extras.Byes = Byes;
                extras.Wides = Wides;
                extras.NoBalls = NoBalls;
                extras.Penalty = Penalty;
                extras.LegByes = LegByes;
                if (Byes + Wides + NoBalls + Penalty + LegByes == selectedMatch.GetTheirBattingScoreCard().Extras)
                {
                    extras.Save();
                }
                else
                {
                    wasError = true;
                    errorText = "Values do not up to the total. Please check you maths";
                }
            }
            catch
            {
                wasError = true;
                errorText = "Failed to save extras - check all values are numbers";
            }

            if (!wasError)
            {
                BowlingStats bs = selectedMatch.GetOurBowlingStats();
                List<BowlingStatsLine> data = bs.BowlingStatsData;
                while (data.Count < 10)
                {
                    data.Add(new BowlingStatsLine(new BowlingStatsEntryData()));
                }
                OurBowlingListView.DataSource = data;
                OurBowlingListView.DataBind();
            }
            else
            {
                Step9.Visible = false;
                ErrorMessage.Visible = true;
                ErrorMessage.InnerHtml = errorText;
                ButtonDiv.InnerHtml = "<BR><BR><input type=button value=\"Go Back\" onclick='javascript:history.back()' />";
            }
        }
        else
        {
            Step9.Visible = false;
        }

        #endregion

        #region step10

        if (step == 10)
        {
            Step6.Visible = true;
            StepTitle.Text = selectedMatch.Opposition.Name + " FoW Stats (VERY optional)";
            //Deal with step 5 data
            try
            {
                List<string> bowlerNames = GetObjects("bowler");
                List<string> overs = GetObjects("overs");
                List<string> maidens = GetObjects("maidens");
                List<string> runs = GetObjects("runs");
                List<string> wickets = GetObjects("wickets");
                selectedMatch.ClearCache();
                BowlingStats bs = selectedMatch.GetOurBowlingStats();
                List<BowlingStatsLine> data = new List<BowlingStatsLine>();
                int bowlerIndex = 0;
                List<Player> bowlers = new List<Player>();
                foreach (string name in bowlerNames)
                {
                    bowlers.Add(players.Where(a => a.Name == name).FirstOrDefault());
                }

                foreach (Player bowler in bowlers)
                {
                    if (bowler!=null && bowler.Name.Length>0)
                    {
                        BowlingStatsEntryData dataline = new BowlingStatsEntryData();
                        dataline.PlayerID = bowler.ID;
                        dataline.Maidens = int.Parse(maidens[bowlerIndex]);
                        dataline.Overs = int.Parse(overs[bowlerIndex]);
                        dataline.Runs = int.Parse(runs[bowlerIndex]);
                        dataline.Wickets = int.Parse(wickets[bowlerIndex]);
                        dataline.MatchID = selectedMatch.ID;

                        BowlingStatsLine line = new BowlingStatsLine(dataline);
                        data.Add(line);
                    }
                    bowlerIndex++;
                }
                bs.BowlingStatsData = data;
                if (data.Count > 0)
                {
                    bs.Save();
                }
                else
                {
                    wasError = true;
                    errorText = "You must specify at least 1 bowler.";
                }
            }
            catch (Exception ex)
            {
                wasError = true;
                errorText = "Something went wrong:<BR><BR>" + ex.Message + "<BR><BR>" + ex.StackTrace;
            }

            if (!wasError)
            {
                FoWStats fow = new FoWStats(selectedMatch.ID, ThemOrUs.Them);
                List<FoWStatsLine> data = fow.Data;
                fowNoBat1.Text = "";
                fowNoBatScore1.Text = "";
                fowOutgoingBat1.Text = "";
                fowOutgoingBatScore1.Text = "";
                fowScore1.Text = "";
                fowPartnership1.Text = "";
                fowOver1.Text = "";
                fowNoBat2.Text = "";
                fowNoBatScore2.Text = "";
                fowOutgoingBat2.Text = "";
                fowOutgoingBatScore2.Text = "";
                fowScore2.Text = "";
                fowPartnership2.Text = "";
                fowOver2.Text = "";
                fowNoBat3.Text = "";
                fowNoBatScore3.Text = "";
                fowOutgoingBat3.Text = "";
                fowOutgoingBatScore3.Text = "";
                fowScore3.Text = "";
                fowPartnership3.Text = "";
                fowOver3.Text = "";
                fowNoBat4.Text = "";
                fowNoBatScore4.Text = "";
                fowOutgoingBat4.Text = "";
                fowOutgoingBatScore4.Text = "";
                fowScore4.Text = "";
                fowPartnership4.Text = "";
                fowOver4.Text = "";
                fowNoBat5.Text = "";
                fowNoBatScore5.Text = "";
                fowOutgoingBat5.Text = "";
                fowOutgoingBatScore5.Text = "";
                fowScore5.Text = "";
                fowPartnership5.Text = "";
                fowOver5.Text = "";
                fowNoBat6.Text = "";
                fowNoBatScore6.Text = "";
                fowOutgoingBat6.Text = "";
                fowOutgoingBatScore6.Text = "";
                fowScore6.Text = "";
                fowPartnership6.Text = "";
                fowOver6.Text = "";
                fowNoBat7.Text = "";
                fowNoBatScore7.Text = "";
                fowOutgoingBat7.Text = "";
                fowOutgoingBatScore7.Text = "";
                fowScore7.Text = "";
                fowPartnership7.Text = "";
                fowOver7.Text = "";
                fowNoBat8.Text = "";
                fowNoBatScore8.Text = "";
                fowOutgoingBat8.Text = "";
                fowOutgoingBatScore8.Text = "";
                fowScore8.Text = "";
                fowPartnership8.Text = "";
                fowOver8.Text = "";
                fowNoBat9.Text = "";
                fowNoBatScore9.Text = "";
                fowOutgoingBat9.Text = "";
                fowOutgoingBatScore9.Text = "";
                fowScore9.Text = "";
                fowPartnership9.Text = "";
                fowOver9.Text = "";
                fowNoBat10.Text = "";
                fowNoBatScore10.Text = "";
                fowOutgoingBat10.Text = "";
                fowOutgoingBatScore10.Text = "";
                fowScore10.Text = "";
                fowPartnership10.Text = "";
                fowOver10.Text = "";

                foreach (FoWStatsLine line in data)
                {
                    switch (line.Wicket)
                    {
                        case 1:
                            fowNoBat1.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore1.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat1.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore1.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore1.Text = line.Score.ToString();
                            fowPartnership1.Text = line.Partnership.ToString();
                            fowOver1.Text = line.Over.ToString();
                            break;
                        case 2:
                            fowNoBat2.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore2.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat2.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore2.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore2.Text = line.Score.ToString();
                            fowPartnership2.Text = line.Partnership.ToString();
                            fowOver2.Text = line.Over.ToString();
                            break;
                        case 3:
                            fowNoBat3.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore3.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat3.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore3.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore3.Text = line.Score.ToString();
                            fowPartnership3.Text = line.Partnership.ToString();
                            fowOver3.Text = line.Over.ToString();
                            break;
                        case 4:
                            fowNoBat4.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore4.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat4.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore4.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore4.Text = line.Score.ToString();
                            fowPartnership4.Text = line.Partnership.ToString();
                            fowOver4.Text = line.Over.ToString();
                            break;
                        case 5:
                            fowNoBat5.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore5.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat5.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore5.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore5.Text = line.Score.ToString();
                            fowPartnership5.Text = line.Partnership.ToString();
                            fowOver5.Text = line.Over.ToString();
                            break;
                        case 6:
                            fowNoBat6.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore6.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat6.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore6.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore6.Text = line.Score.ToString();
                            fowPartnership6.Text = line.Partnership.ToString();
                            fowOver6.Text = line.Over.ToString();
                            break;
                        case 7:
                            fowNoBat7.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore7.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat7.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore7.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore7.Text = line.Score.ToString();
                            fowPartnership7.Text = line.Partnership.ToString();
                            fowOver7.Text = line.Over.ToString();
                            break;
                        case 8:
                            fowNoBat8.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore8.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat8.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore8.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore8.Text = line.Score.ToString();
                            fowPartnership8.Text = line.Partnership.ToString();
                            fowOver8.Text = line.Over.ToString();
                            break;
                        case 9:
                            fowNoBat9.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore9.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat9.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore9.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore9.Text = line.Score.ToString();
                            fowPartnership9.Text = line.Partnership.ToString();
                            fowOver9.Text = line.Over.ToString();
                            break;
                        case 10:
                            fowNoBat10.Text = line.NotOutBatsmanPosition.ToString();
                            fowNoBatScore10.Text = line.NotOutBatsmanScore.ToString();
                            fowOutgoingBat10.Text = line.OutgoingBatsmanPosition.ToString();
                            fowOutgoingBatScore10.Text = line.OutgoingBatsmanScore.ToString();
                            fowScore10.Text = line.Score.ToString();
                            fowPartnership10.Text = line.Partnership.ToString();
                            fowOver10.Text = line.Over.ToString();
                            break;

                    }
                }
            }
            else
            {

                Step6.Visible = false;
                ErrorMessage.Visible = true;
                ErrorMessage.InnerHtml = errorText;
                ButtonDiv.InnerHtml = "<BR><BR><input type=button value=\"Go Back\" onclick='javascript:history.back()' />";

            }
        }
        else
        {
            if (step != 6)
            {
                Step6.Visible = false;
            }
        }


        #endregion

        #region step11

        if (step == 11)
        {
            Step11.Visible = true;
            StepTitle.Text = "Configure Match Report";
            if (!selectedMatch.Abandoned) {
            //Deal with step 10 data;
            List<string> strnoBatsmen = Request["fow_nobat"].Split(',').Where(a => !string.IsNullOrEmpty(a)).ToList<string>();
            List<string> strnoBatsmenScores = Request["fow_nobat_score"].Split(',').Where(a => !string.IsNullOrEmpty(a)).ToList<string>();
            List<string> stroutBatsmen = Request["fow_outgoingbat"].Split(',').Where(a => !string.IsNullOrEmpty(a)).ToList<string>();
            List<string> stroutBatsmenScores = Request["fow_outgoingbat_score"].Split(',').Where(a => !string.IsNullOrEmpty(a)).ToList<string>();
            List<string> strScores = Request["fow_score"].Split(',').Where(a => !string.IsNullOrEmpty(a)).ToList<string>();
            List<string> strOvers = Request["fow_over"].Split(',').Where(a => !string.IsNullOrEmpty(a)).ToList<string>();

            if (strnoBatsmen.Count != strnoBatsmenScores.Count ||
                strnoBatsmen.Count != stroutBatsmen.Count ||
                strnoBatsmen.Count != stroutBatsmenScores.Count ||
                strScores.Count != strnoBatsmen.Count ||
                strOvers.Count != strnoBatsmen.Count)
            {
                wasError = true;
                errorText = "Mismatching numbers of entities: for every wicket you fill in, you must complete ALL values";
            }
            else
            {
                try
                {
                    List<int> noBatsmen = (from a in strnoBatsmen select int.Parse(a)).ToList();
                    List<int> noBatsmenScores = (from a in strnoBatsmenScores select int.Parse(a)).ToList();
                    List<int> outBatsmen = (from a in stroutBatsmen select int.Parse(a)).ToList();
                    List<int> outBatsmenScores = (from a in stroutBatsmenScores select int.Parse(a)).ToList();
                    List<int> Scores = (from a in strScores select int.Parse(a)).ToList();
                    List<int> Overs = (from a in strOvers select int.Parse(a)).ToList();

                    int index = 0;
                    FoWStats fow = new FoWStats(selectedMatch.ID, ThemOrUs.Them);
                    List<FoWStatsLine> stats = new List<FoWStatsLine>();
                    List<int> alreadyOut = new List<int>();
                    int previousOver = 0;
                    foreach (int i in noBatsmen)
                    {

                        FoWDataLine line = new FoWDataLine();
                        line.NotOutBatsman = i;
                        line.NotOutBatsmanScore = noBatsmenScores[index];
                        line.OutgoingBatsman = outBatsmen[index];
                        if (!alreadyOut.Contains(outBatsmen[index]))
                        {
                            alreadyOut.Add(outBatsmen[index]);
                        }
                        else
                        {
                            wasError = true;
                            errorText = "The same batsman cannot be out twice! (batsman: " + outBatsmen[index] + ")";
                        }
                        line.OutgoingBatsmanScore = outBatsmenScores[index];
                        line.Wicket = index + 1;
                        line.Score = Scores[index];
                        if (index == 0)
                        {
                            line.Partnership = line.Score;
                        }
                        else
                        {
                            line.Partnership = line.Score - Scores[index - 1];
                        }
                        if (line.Partnership <= 0)
                        {
                            wasError = true;
                            errorText = "The score can't go backwards! (wicket: " + (int)(index + 1) + ")";
                        }
                        line.OverNumber = Overs[index];
                        if (!(line.OverNumber >= previousOver))
                        {
                            wasError = true;
                            errorText = "The over number can't go backwards! (wicket: " + (int)(index + 1) + ")";
                        }
                        else
                        {
                            previousOver = line.OverNumber;
                        }
                        line.MatchID = selectedMatch.ID;
                        stats.Add(new FoWStatsLine(line));
                        index++;
                    }

                    if (stats.Count > 0 && !wasError)
                    {
                        try
                        {
                            fow.Data = stats;
                            fow.Save();
                        }
                        catch (Exception ex)
                        {
                            wasError = true;
                            errorText = "Something went wrong trying to save the stats: <BR><BR>" + ex.Message + "<BR><BR>" + ex.StackTrace;
                        }
                    }


                }
                catch
                {
                    wasError = true;
                    errorText = "Looks like one of the values you entered wasn't a number.";
                }
            }
            }

            if (!wasError)
            {
                //Step11 Stuff
                WicketKeeper.DataSource = from a in selectedMatch.GetOurBattingScoreCard().ScorecardData select a.Batsman;
                Captain.DataSource = from a in selectedMatch.GetOurBattingScoreCard().ScorecardData select a.Batsman;
                WicketKeeper.DataBind();
                Captain.DataBind();


            }
            else
            {
                Step11.Visible = false;
                ErrorMessage.Visible = true;
                ErrorMessage.InnerHtml = errorText;
                ButtonDiv.InnerHtml = "<BR><BR><input type=button value=\"Go Back\" onclick='javascript:history.back()' />";

            }

        }
        else
        {
            Step11.Visible = false;
        }

        #endregion

        #region step12

        if (step == 12)
        {
            StepTitle.Text = "Finished!";
            IEnumerable<Player> p = (IEnumerable<Player>)playersCache.Get("players");
            try
            {
                string wkName = WicketKeeper.SelectedValue;
                Player wicketKeeper = (from a in p where a.Name == wkName select a).FirstOrDefault();
                string captainName = Captain.SelectedValue;
                Player captain = (from a in p where a.Name == captainName select a).FirstOrDefault();
                selectedMatch.Captain = captain;
                selectedMatch.WicketKeeper = wicketKeeper;
                selectedMatch.Save();
            }
            catch (Exception ex)
            {
                wasError = true;
                errorText = "There was a problem saving Wicket Keeper and Captain Data <BR><BR>" +ex.Message;
            }

            if (!wasError)
            {
                string emailAddress = WritersEmail.Text;
                string pass = MatchReportPassword.Text;
                MatchReport report = selectedMatch.GetMatchReport(Server.MapPath("../match_reports/"));
                report.Password = pass;
                report.Save();
                try
                {
                    System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage("thevillagecc@gmail.com", emailAddress);
                    mail.Subject = "Match Report Request";        // put subject here	
                    mail.Body = "You are requested to provide a match report for the match against " + selectedMatch.Opposition.Name + " on " + selectedMatch.MatchDate.ToLongDateString() + ". You can do this by visiting http://www.thevillagecc.org.uk/CreateMatchReport.aspx?MatchID="+selectedMatch.ID+ " and using the password: "+ pass;
                    mail.IsBodyHtml = true;
                    System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient("localhost");
                    smtp.Send(mail);
                }
                catch (Exception ex)
                {
                    wasError = true;
                    errorText = "Email was not sent!<BR><BR>" + ex.Message + "<BR><BR>" + ex.StackTrace;
                }

            }

            if (!wasError)
            {
                string sMatchFee = MatchFee.Text;
                double dMatchFee = 0.00;
                bool success = double.TryParse(sMatchFee, out dMatchFee);
                if (success && dMatchFee > 0.00)
                {
                    var PlayersInThisMatch = Player.GetAll().Where(a => a.PlayedInMatch(selectedMatch.ID)).Where(a=>a.ID>0);
                    foreach (Player PlayerToBeBilled in PlayersInThisMatch)
                    {
                        PlayerAccount pa = new PlayerAccount(PlayerToBeBilled);
                        pa.AddPayment(dMatchFee, "Match fees", selectedMatch.MatchDate, selectedMatch, PaymentStatus.Confirmed, PaymentType.MatchFee, CreditDebit.Debit);
                        List<MatchType> allMatches = new List<MatchType>();
                        allMatches.Add(MatchType.All);
                        if (PlayerToBeBilled.GetMatchesPlayed(new DateTime(DateTime.Now.Year, 4, 1), new DateTime(DateTime.Now.Year + 1, 4, 1), allMatches) == SettingsWrapper.GetSettingInt("SubsNumberOfGames", 3))
                        {
                            //this is the player's 3rd match of the season - charge subs.
                            pa.AddPayment(SettingsWrapper.GetSettingDouble("SubsAmount", 30.0), "Subs - 3 Matches played", DateTime.Today, null, PaymentStatus.Confirmed, PaymentType.Other, CreditDebit.Debit);
                        }
                        if (pa.GetBalance() < SettingsWrapper.GetSettingDouble("MaximDebtBeforeEmail", -20.0) )
                        {
                            //Player owes more than £20
                            if (PlayerToBeBilled.EmailAddress != null && PlayerToBeBilled.EmailAddress.Contains('@'))
                            {
                                //Player has what seems to be a valid email address
                                try
                                {
                                    System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage("thevillagecc@gmail.com", "thevillagecc@gmail.com");
                                    mail.Subject = "Village CC Payment Request";        // put subject here	
                                    mail.Body = "Hi " + PlayerToBeBilled.Name + ",<BR><BR> According to our records you now owe the club more than £" + SettingsWrapper.GetSettingString("MaximDebtBeforeEmail", "20") + ", in order for us to be able to meet payments through the season we would appreciate your payment. You can check the details of your account by visiting <a href=\"http://thevillagecc.org.uk/secure/Accounts/MyAccount.aspx\">My Account</a>.<BR><BR>If you do not currently have a VCC Online Account you will be directed to register for one in order to see your account. It is important that you register your account using <b>the email address that this mail was sent to.<\\B><BR><BR>Once you have transferred funds or sent a cheque, or indeed if you paid cash on the day please <b>complete the Register Payment form<\\b>, the Treasurer will then be notified and your account balance updated.<BR><BR>If you have any issues with this system, or want to delay payment for any reason please speak to the treasurer or email thevillagecc@gmail.com.<BR><BR>Thanks,<BR>The VCC Committee.";
                                    mail.IsBodyHtml = true;
                                    System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient("localhost");
                                    smtp.Send(mail);
                                }
                                catch (Exception ex)
                                {
                                    wasError = true;
                                    errorText += "Email to " + PlayerToBeBilled.Name + " ("+PlayerToBeBilled.EmailAddress+")  was not sent!<BR><BR>" + ex.Message + "<BR><BR>" + ex.StackTrace;
                                }
                            }

                        }
                    }
                }
                else
                {
                    wasError = true;
                    errorText += "Either the Match Fee amount could not be parsed (not a valid number) or it was <= 0<BR><BR>";
                }
                
            }


            if (wasError)
            {
                Step12.Visible = false;
                ErrorMessage.Visible = true;
                ErrorMessage.InnerHtml = errorText;
                ButtonDiv.InnerHtml = "<BR><BR><input type=button value=\"Go Back\" onclick='javascript:history.back()' />";

            }
            else
            {
                ButtonDiv.Visible = false;
            }

        }

        #endregion
    }
    protected void MatchesDropDown_SelectedIndexChanged(object sender, EventArgs e)
    {
        var matches2 = (IEnumerable<Match>)MatchesDropDown.DataSource;
        Match match = new Match(matches2.ToList()[MatchesDropDown.SelectedIndex].ID);
        HomeTeamCheck.Text = match.HomeTeamName;
        AwayTeamCheck.Text = match.AwayTeamName;
        VenueCheck.Text = match.VenueName;
        DateCheck.Text = match.MatchDate.ToShortDateString();
        Session.Add("selectedMatch", match);
    }


    protected void Continue_Click(object sender, EventArgs e)
    {
        if (step == 1)
        {
            Match match = matches.ToList()[MatchesDropDown.SelectedIndex];
            if (match!=null) 
            {
                Session.Add("selectedMatch", match);
            }
        }

        step = step + 1;
        Session.Add("step", step);
        StepNumber.Text = step.ToString();
    }
    protected void OurBattingScoreCardLV_ItemDataBound(object sender, ListViewItemEventArgs e)
    {
        DropDownList batsmen = (DropDownList)e.Item.FindControl("batsmanSelect");
        DropDownList howOut = (DropDownList)e.Item.FindControl("howOutSelect");
        InternalCache playersCache = InternalCache.GetInstance();
        if (playersCache.Get("players") == null)
        {
            playersCache.Insert("players", Player.GetAll().Where(a => a.IsActive).OrderBy(a => a.Name), new TimeSpan(0, 5, 0));
        }
        BattingCardLine line = (BattingCardLine)((ListViewDataItem)e.Item).DataItem;

        IEnumerable<Player> players = (IEnumerable<Player>)playersCache.Get("players");
        batsmen.DataSource = players;
        batsmen.DataBind();
        if (line.Batsman.Name != null)
        {
            batsmen.Items.FindByText(line.Batsman.Name).Selected = true;
        }
        howOut.DataSource = Enum.GetValues(typeof(ModesOfDismissal));
        howOut.DataBind();
        if ((int)line.Dismissal != -1)
        {
            howOut.Items.FindByText(line.Dismissal.ToString()).Selected = true;
        }
        else
        {
            howOut.Items.FindByText("DidNotBat").Selected = true;
        }

        HtmlInputText scorebox = (HtmlInputText)e.Item.FindControl("scoreTB");
        scorebox.Value = line.Score.ToString();
        HtmlInputText foursbox = (HtmlInputText)e.Item.FindControl("foursTB");
        foursbox.Value = line.Fours.ToString();
        HtmlInputText sixesbox = (HtmlInputText)e.Item.FindControl("sixesTB");
        sixesbox.Value = line.Sixes.ToString();
        HtmlInputText fielderbox = (HtmlInputText)e.Item.FindControl("fielderTB");
        fielderbox.Value = line.Fielder.Name;
        HtmlInputText bowlerbox = (HtmlInputText)e.Item.FindControl("bowlerTB");
        bowlerbox.Value = line.Bowler.Name;

    }

    protected void TheirBattingScoreCardLV_ItemDataBound(object sender, ListViewItemEventArgs e)
    {
        DropDownList bowlers = (DropDownList)e.Item.FindControl("bowlerSelect");
        DropDownList fielders = (DropDownList)e.Item.FindControl("fielderSelect");

        DropDownList howOut = (DropDownList)e.Item.FindControl("howOutSelect");
        InternalCache playersCache = InternalCache.GetInstance();
        if (playersCache.Get("players") == null)
        {
            playersCache.Insert("players", Player.GetAll().Where(a => a.IsActive).OrderBy(a => a.Name), new TimeSpan(0, 5, 0));
        }
        BattingCardLine line = (BattingCardLine)((ListViewDataItem)e.Item).DataItem;

        IEnumerable<Player> players = (IEnumerable<Player>)playersCache.Get("players");
        bowlers.DataSource = players;
        bowlers.DataBind();
        fielders.DataSource = players;
        fielders.DataBind();

        if (line.Bowler.Name != null)
        {
            bowlers.Items.FindByText(line.Bowler.Name).Selected = true;
        }
        if (line.Fielder!=null && line.Fielder.Name != null)
        {
            fielders.Items.FindByText(line.Bowler.Name).Selected = true;
        }
        howOut.DataSource = Enum.GetValues(typeof(ModesOfDismissal));
        howOut.DataBind();
        if ((int)line.Dismissal != -1)
        {
            howOut.Items.FindByText(line.Dismissal.ToString()).Selected = true;
        }
        else
        {
            howOut.Items.FindByText("DidNotBat").Selected = true;
        }

        HtmlInputText scorebox = (HtmlInputText)e.Item.FindControl("scoreTB");
        scorebox.Value = line.Score.ToString();
        HtmlInputText foursbox = (HtmlInputText)e.Item.FindControl("foursTB");
        foursbox.Value = line.Fours.ToString();
        HtmlInputText sixesbox = (HtmlInputText)e.Item.FindControl("sixesTB");
        sixesbox.Value = line.Sixes.ToString();
        HtmlInputText batsmanbox = (HtmlInputText)e.Item.FindControl("batsmanTB");
        batsmanbox.Value = line.Batsman.Name;
        

    }

    private List<string> GetObjects(string key)
    {
        List<string> thisList = new List<string>();
        var test = Request.Params.Keys.Cast<string>().Where(a => a.Contains(key));
        foreach (string k in test)
        {
            thisList.Add(Request[k]);
        }

        return thisList;
    }
    protected void TheirBowlingListView_ItemDataBound(object sender, ListViewItemEventArgs e)
    {
        BowlingStatsLine line = (BowlingStatsLine)((ListViewDataItem)e.Item).DataItem;
        HtmlInputText bowler = (HtmlInputText)e.Item.FindControl("step5bowler");
        bowler.Value = line.BowlerName;
        HtmlInputText overs = (HtmlInputText)e.Item.FindControl("step5overs");
        overs.Value = line.Overs.ToString();
        HtmlInputText runs = (HtmlInputText)e.Item.FindControl("step5runs");
        runs.Value = line.Runs.ToString();
        HtmlInputText maidens = (HtmlInputText)e.Item.FindControl("step5maidens");
        maidens.Value = line.Maidens.ToString();
        HtmlInputText wickets = (HtmlInputText)e.Item.FindControl("step5wickets");
        wickets.Value = line.Wickets.ToString();
    }

    protected void OurBowlingListView_ItemDataBound(object sender, ListViewItemEventArgs e)
    {
        BowlingStatsLine line = (BowlingStatsLine)((ListViewDataItem)e.Item).DataItem;
        DropDownList bowler = (DropDownList)e.Item.FindControl("bowler");
        InternalCache playersCache = InternalCache.GetInstance();
        if (playersCache.Get("players") == null)
        {
            playersCache.Insert("players", Player.GetAll().Where(a => a.IsActive).OrderBy(a => a.Name), new TimeSpan(0, 5, 0));
        }
        
        IEnumerable<Player> players = (IEnumerable<Player>)playersCache.Get("players");
        bowler.DataSource = players;
        bowler.DataBind();

        if (line.Bowler != null && !string.IsNullOrEmpty(line.Bowler.Name))
        {
            bowler.Items.FindByText(line.Bowler.Name).Selected = true;
        }
        HtmlInputText overs = (HtmlInputText)e.Item.FindControl("overs");
        overs.Value = line.Overs.ToString();
        HtmlInputText runs = (HtmlInputText)e.Item.FindControl("runs");
        runs.Value = line.Runs.ToString();
        HtmlInputText maidens = (HtmlInputText)e.Item.FindControl("maidens");
        maidens.Value = line.Maidens.ToString();
        HtmlInputText wickets = (HtmlInputText)e.Item.FindControl("wickets");
        wickets.Value = line.Wickets.ToString();
    }
}
