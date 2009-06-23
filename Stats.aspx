<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Stats.aspx.cs" Inherits="Stats" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>The Village Cricket Club Online | Stats</title>
    <CC:Styles runat=server ID=styles />    
    
    <style type="text/css">
        .style1
        {
            text-align: center;
        }
    </style>
    
</head>
<body>
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
        <form id="form1" runat="server">
           <div class=PageHeading>Key Statistics</div>
           <div class=standardText>
            <span class="SectionHeading">Club Stats:</span>
            <table class=fullWidth>
                <tr>
                    <td>Formed: 
                    <span class=Bold>Feb 2004</span>
                    </td>
                    <td>Home Ground: 
                    <span class=Bold>The Albert Road Recreation Ground</span>
                    </td>
                    <td>Capacity:
                    <span class=Bold>250,000 (standing); 5 (seated)</span>
                    </td>
                </tr>
            </table>
            
            <span class="SectionHeading">Player Stats:</span>
            <table class=fullWidth>
                <tr>
                    <td>Leading Run Scorer:  
                    <span class=Bold><asp:Literal runat=server ID=LeadingRSName></asp:Literal>&nbsp;(<asp:Literal runat=server ID=LeadingRSRuns></asp:Literal>)</span>
                    </td>
                    <td>Leading Wicket Taker:  
                    <span class=Bold><asp:Literal runat=server ID=LeadingWTName></asp:Literal>&nbsp;(<asp:Literal runat=server ID=LeadingWTWickets></asp:Literal>)</span>
                    </td>
                    <td>Most Catches:
                    <span class=Bold><asp:Literal runat=server ID=MostCatchesName></asp:Literal>&nbsp;(<asp:Literal runat=server ID=MostCatchesNumber></asp:Literal>)</span>
                    </td>
                </tr>
            </table>
            
            <span class="SectionHeading">Awards:</span>
            <table class=fullWidth>
                <tr>
                    <th></th>
                    <th>Players' Player of The Season</th>
                    <th>Captain's Player of The Season</th>
                    <th>Best Batsman</th>
                    <th>Best Bowler</th>
                    <th>Best Fielder</th>
                    <th>Most Improved</th>
                </tr>
                <tr>
                    <th>2004</th>
                    <td class="style1">Graham Pontin</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <th class="style1">2005</th>
                    <td class="style1">Alan White</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <th class="style1">2006</th>
                    <td class="style1">Toby Proctor</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <th class="style1">2007</th>
                    <td class="style1">Paul Bowman</td>
                    <td class="style1">John Lucarotti</td>
                    <td></td>
                    <td></td>
                    <td class="style1">Saul Reid</td>
                    <td></td>
                </tr>
                <tr>
                    <th class="style1">2008</th>
                    <td class="style1">Eklavya Gupte</td>
                    <td></td>
                    <td class="style1">Marcus Littlejohns
                        <br />
                        (204 runs @ 20.4)</td>
                    <td class="style1">Alan White
                        <br />
                        (23 wkts @ 12.8)</td>
                    <td class="style1">Graham Pontin</td>
                    <td></td>
                </tr>
            </table>
            <br />
            <div class="Centered">
                <table>
                    <tr>
                        <td>
                            <a href="stats/home.asp">Enter the Stats Admin System</a>
                        </td>
                        <td>
                            <a href="stats/main.asp">Enter the Accounts Admin System</a>
                        </td>
                    </tr>
                </table>
            </div>
            
           </div>      
        </form>
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>
