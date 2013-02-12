<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Awards.aspx.cs" Inherits="Stats" %>
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
           <div class=PageHeading>About Us</div>
           <div class=standardText>
            <span class="SectionHeading">Club Stats:</span>
            <table class=fullWidth>
                <tr>
                    <td>Formed: 
                    <span class=Bold>Feb 2004</span>
                    </td>
                    <td>Home Ground: 
                    <strong>Parliament Hill</strong></td>
                    <td>Capacity:
                    <span class=Bold>250,000 (standing); 5 (seated)</span>
                    </td>
                </tr>
            </table>
            
            <span class="SectionHeading">Leading Players:</span>
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
                    <td>Ed Thomas</td>
                    <td>Andy Richardson</td>
                    <td>Ed Thomas</td>
                    <td>?</td>
                    <td>?</td>
                </tr>
                <tr>
                    <th class="style1">2005</th>
                    <td class="style1">Alan White</td>
                    <td>?</td>
                    <td>?</td>
                    <td>?</td>
                    <td>?</td>
                    <td>?</td>
                </tr>
                <tr>
                    <th class="style1">2006</th>
                    <td class="style1">Toby Proctor</td>
                    <td>Oliver Morgans</td>
                    <td>Toby Proctor<br />
                        (388 runs @ 78)</td>
                    <td>Toby Proctor<br />
                        (16 wkts @ 8)</td>
                    <td>?</td>
                    <td>?</td>
                </tr>
                <tr>
                    <th class="style1">2007</th>
                    <td class="style1">Paul Bowman</td>
                    <td class="style1">John Lucarotti</td>
                    <td>Alan White<br />
                        (295 runs @ 74)</td>
                    <td>Andy Richardson<br />
                        (23 wkts @ 11)</td>
                    <td class="style1">Saul Reid</td>
                    <td>?</td>
                </tr>
                <tr>
                    <th class="style1">2008</th>
                    <td class="style1">Eklavya Gupte</td>
                    <td>?</td>
                    <td class="style1">Marcus Littlejohns
                        <br />
                        (204 runs @ 20.4)</td>
                    <td class="style1">Alan White
                        <br />
                        (23 wkts @ 12.8)</td>
                    <td class="style1">Graham Pontin</td>
                    <td>?</td>
                </tr>
                <tr>
                    <th class="style1">2009</th>
                    <td class="style1">Marcus Littlejohns</td>
                    <td class="style1">Craig Woodhouse</td>
                    <td class="style1">Marcus Littlejohns<br />
                        (479 runs @ 60)
                        <br />
                        </td>
                    <td class="style1">Paul Bowman<br />
                        (34 wkts @ 11)
                        <br />
                        </td>
                    <td class="style1">Graham Pontin</td>
                    <td class="style1">Martin Koder</td>
                </tr>
                <tr>
                    <th class="style1">2010</th>
                    <td class="style1">?</td>
                    <td class="style1">?</td>
                    <td class="style1">Oliver Morgans<br />
                        (665 runs @ 44)</td>
                    <td class="style1">Paul Bowman<br />
                        (33 wkts @ 14)</td>
                    <td class="style1">Chris Pitcher</td>
                    <td class="style1">?</td>
                </tr>
                <tr>
                    <th class="style1">2011</th>
                    <td class="style1">Steve Harty</td>
                    <td class="style1">Matt Boa</td>
                    <td class="style1">Steve Harty<br />
                        (730 runs @ 91)</td>
                    <td class="style1">Eklavya Gupte<br />
                        (25 wkts @ 17)</td>
                    <td class="style1">Nick Troja</td>
                    <td class="style1">Craig Woodhouse</td>
                </tr>
                <tr>
                    <th class="style1">2012</th>
                    <td class="style1">Nick Troja</td>
                    <td class="style1">Steve Harty</td>
                    <td class="style1">Nick Troja<br />
                        (696 runs @ 58)</td>
                    <td class="style1">Matt Boa<br />
                        (29 wkts @ 14)</td>
                    <td class="style1">Oliver Morgans</td>
                    <td class="style1">Ben Hampton</td>
                </tr>
            </table>
            <br />
            <span class="SectionHeading">Hall of Fame:</span>
            
           </div>      
        </form>
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>
