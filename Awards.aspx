<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Awards.aspx.cs" Inherits="Stats" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html>

<html lang="en">
<head id="Head1" runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
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
            <div  class="HonorsBoard">
                <div class="HonorsBoardList">
                   <table>
                       <tr><th colspan="2">Captains</th></tr>
                       <tr><td>2003</td><td>AEMcC Richardson</td></tr>
                       
                   </table>
                </div>
                <div class="HonorsBoardList">
                   <table>
                       <tr><th colspan="2">Vice-Captains</th></tr>
                       <tr><td>2003</td><td>AEMcC Richardson</td></tr>
                       
                   </table>
                </div>
                <div class="HonorsBoardList">
                   <table>
                       <tr><th colspan="2">Player of the Year</th></tr>
                       <tr><td>2003</td><td>AEMcC Richardson</td></tr>
                       
                   </table>
                </div>
            </div>

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
                    <td class="style1">Oliver Morgans</td>
                    <td class="style1">Eklayva Gupte</td>
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
                <tr>
                    <th class="style1">2013</th>
                    <td class="style1">Matt Boa</td>
                    <td class="style1">Nick Troja</td>
                    <td class="style1">Steve Harty<br />
                        (582 runs @ 66)</td>
                    <td class="style1">Eklavya Gupte<br />
                        (24 wkts @ 17)</td>
                    <td class="style1">Oliver Morgans</td>
                    <td class="style1">Chris Pitcher</td>
                </tr>
                <tr>
                    <th class="style1">2014</th>
                    <td class="style1">Nick Troja</td>
                    <td class="style1">Nick Thompson</td>
                    <td class="style1">Nick Troja<br /> (464 runs @ 65)</td>
                    <td class="style1">Eklavya Gupte<br />(19 wkts @ 15)</td>
                    <td class="style1">Graham Pontin</td>
                    <td class="style1">James de Mellow</td>
                </tr>
                <tr>
                    <th class="style1">2015</th>
                    <td class="style1">Nick Troja</td>
                    <td class="style1">Toby de Mellow</td>
                    <td class="style1">Nick Troja<br /> (582 runs @ 48.5)</td>
                    <td class="style1">Eklavya Gupte<br />(34 wkts @ 15)</td>
                    <td class="style1">Oliver Morgans</td>
                    <td class="style1">Bilal Hussain</td>
                </tr>
            </table>
            <br />
            <span class="SectionHeading">The Hall of Fame (Corridor of Uncertainty):</span><br />
               <br />
               <table>
                <tr>
                    <td><strong>2008 - Andrew Richardson</strong><br />
                        <iframe width="480" height="315" src="//www.youtube.com/embed/TfbYZxot8ek" frameborder="0" allowfullscreen></iframe>
                    </td>
                    <td><strong>2009 - AA Page</strong><br />
                        <iframe width="480" height="315" src="//www.youtube.com/embed/JF9WgDY2bw8" frameborder="0" allowfullscreen></iframe>
                    </td>
                </tr> 
                <tr>
                    <td><strong>2010 - Alan White</strong><br />
                        <iframe width="480" height="315" src="//www.youtube.com/embed/_to1fIcc-cY" frameborder="0" allowfullscreen></iframe>
                    </td>
                    <td><strong>2011 - Graham Pontin</strong><br />
                        <iframe width="480" height="315" src="//www.youtube.com/embed/cm4u1irM9U4" frameborder="0" allowfullscreen></iframe>
                    </td>
                </tr>
                <tr>
                    <td><strong>2012 - Paul Bowman</strong><br />
                        <iframe width="480" height="315" src="//www.youtube.com/embed/w7_Gp1xPfuc" frameborder="0" allowfullscreen></iframe>
                    </td>
                    <td><strong>2013 - John Lucarotti</strong><br />
                        <iframe width="480" height="315" src="//www.youtube.com/embed/ffju3JkcbHQ" frameborder="0" allowfullscreen></iframe>
                    </td>
                </tr> 
                   <tr>
                    <td><strong>2014 - Matt Boa</strong><br />
                        <iframe width="480" height="315" src="//www.youtube.com/embed/F0Vqb7EJjng" frameborder="0" allowfullscreen></iframe>
                    </td>
                    <td><strong>2014 - Oli Morgans</strong><br />
                        <iframe width="480" height="315" src="//www.youtube.com/embed/HWeb-6s-whQ" frameborder="0" allowfullscreen></iframe>
                    </td>
                </tr> 
                <tr>
                    <td><strong>2014 - Louse</strong><br />
                        <iframe width="480" height="315" src="//www.youtube.com/embed/T54xZvzu1xo" frameborder="0" allowfullscreen></iframe>
                    </td>
                    <td><strong>2014 - Parp!</strong><br />
                        <iframe width="480" height="315" src="//www.youtube.com/embed/TODO" frameborder="0" allowfullscreen></iframe>
                    </td>
                </tr>
               </table>
               <br />
           </div>      
        </form>
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>
