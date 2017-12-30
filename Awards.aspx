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
    <title>The Village Cricket Club Online | About</title>
    
    <CC:Styles runat=server ID=styles />    
    
</head>
<body>
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
        <form id="form1" runat="server">
           <h1>About us</h1>
            <div class="col-sm-12">
                <div class="panel panel-default">
                    <div class="panel-heading">Club Stats</div>
                    <div class="panel-body">
                        <div class="col-sm-3">
                            Formed: <span class=Bold>Feb 2004</span>
                        </div>
                        <div class="col-sm-4">
                            Home Ground: <strong>Parliament Hill</strong>
                        </div>
                        <div class="col-sm-5">
                            Capacity: <span class=Bold>250,000 (standing); 5 (seated)</span>
                        </div>
                    </div>
                </div>    
            </div>
            <div class="col-sm-12">
                <div class="panel panel-default">
                    <div class="panel-heading">History</div>
                    <div class="panel-body">
                        <p>The Village Cricket Club is a small club based loosely around its roots in North East London. We were formed in 2004 by a bunch of singularly talentless but enthusiastic cricketers who decided that they wanted to continue their summer pastime beyond the end of their university days.
                        </p><p>
                        One bizarre meeting in Stamford Hill's Birdcage later, the Village CC was formed and enrolled in the North East London Cricket League which sustained it for its first few seasons.
                        </p>
                        <p>
                        Since then, much has changed, the club has grown and left the league behind, perferring to follow its instincts in the world of friendly London cricket.
                        </p>
                        <p>
                        We play most of our matches in central London but we also make yearly trips to Cambridge, Oxford and the West Country. We are always on the lookout for new members of any ability - enthusiasm for the game is our only selection criteria. You can contact us via the "Join" link up above, or a few of us hang out in the "chat" section when work isn't keeping us too busy.
                        </p>
                    </div>
                </div>    
            </div>
            <div class="col-sm-4">
                <div class="panel panel-default">
                    <div class="panel-heading">Captains</div>
                    <table class="table table-striped">
                        <tr><td>2004</td><td>AEMcC Richardson</td></tr>
                        <tr><td>2005</td><td>AEMcC Richardson</td></tr>
                        <tr><td>2006</td><td>AEMcC Richardson</td></tr>
                        <tr><td>2007</td><td>Graham Pontin</td></tr>
                        <tr><td>2008</td><td>Paul Bowman</td></tr>
                        <tr><td>2009</td><td>Paul Bowman</td></tr>
                        <tr><td>2010</td><td>Paul Bowman</td></tr>
                        <tr><td>2011</td><td>Eklavya Gupte</td></tr>
                        <tr><td>2012</td><td>Eklavya Gupte</td></tr>
                        <tr><td>2013</td><td>Eklavya Gupte</td></tr>
                        <tr><td>2014</td><td>Nick Troja</td></tr>
                        <tr><td>2015</td><td>Nick Troja</td></tr>
                        <tr><td>2016</td><td>Nick Thompson</td></tr>
                        <tr><td>2017</td><td>Nick Thompson</td></tr>
                        <tr><td>2018</td><td>Richard Cressey</td></tr>
                    </table>
                </div>    
            </div>
            
            <div class="col-sm-4">
                <div class="panel panel-default">
                    <div class="panel-heading">Vice-Captains</div>
                    <table class="table table-striped">
                        <tr><td>2004</td><td>Ed Thomas</td></tr>
                        <tr><td>2005</td><td>Graham Pontin</td></tr>
                        <tr><td>2006</td><td>Oliver Morgans</td></tr>
                        <tr><td>2007</td><td>John Lucarotti</td></tr>
                        <tr><td>2008</td><td>Alan White</td></tr>
                        <tr><td>2009</td><td>Marcus Littlejohns</td></tr>
                        <tr><td>2010</td><td>Eklavya Gupte</td></tr>
                        <tr><td>2011</td><td>Steve Harty</td></tr>
                        <tr><td>2012</td><td>Steve Harty</td></tr>
                        <tr><td>2013</td><td>Nick Troja</td></tr>
                        <tr><td>2014</td><td>Oliver Morgans</td></tr>
                        <tr><td>2015</td><td>Nick Thompson</td></tr>
                        <tr><td>2016</td><td>Toby de Mellow</td></tr>
                        <tr><td>2017</td><td>Richard Cressey</td></tr>
                        <tr><td>2018</td><td>James de Mellow</td></tr>
                    </table>
                </div>    
            </div>
            
            <div class="col-sm-4">
                <div class="panel panel-default">
                    <div class="panel-heading">Player of the Year</div>
                    <table class="table table-striped">
                        <tr><td>2004</td><td>Graham Pontin</td></tr>
                        <tr><td>2005</td><td>Alan White</td></tr>
                        <tr><td>2006</td><td>Toby Proctor</td></tr>
                        <tr><td>2007</td><td>Paul Bowman</td></tr>
                        <tr><td>2008</td><td>Eklavya Gupte</td></tr>
                        <tr><td>2009</td><td>Marcus Littlejohns</td></tr>
                        <tr><td>2010</td><td>Oliver Morgans</td></tr>
                        <tr><td>2011</td><td>Steve Harty</td></tr>
                        <tr><td>2012</td><td>Nick Troja</td></tr>
                        <tr><td>2013</td><td>Matt Boa</td></tr>
                        <tr><td>2014</td><td>Nick Troja</td></tr>
                        <tr><td>2015</td><td>Nick Troja</td></tr>
                        <tr><td>2016</td><td>Prashant Mishra</td></tr>
                        <tr><td>2017</td><td>Nick Price-Thompson</td></tr>
                    </table>
                </div>    
            </div>
            
            <div class="col-sm-12">
                <div class="panel panel-default">
                    <div class="panel-heading">Leading Players</div>
                    <div  class="panel-body">
                        <div class="col-sm-4">
                            Leading Run Scorer:  
                            <span class=Bold><asp:Literal runat=server ID=LeadingRSName></asp:Literal>&nbsp;(<asp:Literal runat=server ID=LeadingRSRuns></asp:Literal>)</span>
                        </div>
                        <div class="col-sm-4">
                            Leading Wicket Taker:  
                            <span class=Bold><asp:Literal runat=server ID=LeadingWTName></asp:Literal>&nbsp;(<asp:Literal runat=server ID=LeadingWTWickets></asp:Literal>)</span>
                        </div>
                        <div class="col-sm-4">
                            Most Catches:
                            <span class=Bold><asp:Literal runat=server ID=MostCatchesName></asp:Literal>&nbsp;(<asp:Literal runat=server ID=MostCatchesNumber></asp:Literal>)</span>
                        </div>    
                    </div>
                </div>    
            </div>
            
            <div class="col-sm-12">
                <div class="panel panel-default">
                    <div class="panel-heading">Awards</div>
                        <table class="table table-striped">
                            <tr>
                                <th class="text-center"></th>
                                <th class="text-center">Players' Player of The Season</th>
                                <th class="text-center">Captain's Player of The Season</th>
                                <th class="text-center">Best Batsman</th>
                                <th class="text-center">Best Bowler</th>
                                <th class="text-center">Best Fielder</th>
                                <th class="text-center">Most Improved</th>
                            </tr>
                            <tr>
                                <th  class="text-center">2004</th>
                                <td>Graham Pontin</td>
                                <td>Ed Thomas</td>
                                <td>Andy Richardson</td>
                                <td>Ed Thomas</td>
                                <td>?</td>
                                <td>?</td>
                            </tr>
                            <tr>
                                <th  class="text-center">2005</th>
                                <td>Alan White</td>
                                <td>?</td>
                                <td>?</td>
                                <td>?</td>
                                <td>?</td>
                                <td>?</td>
                            </tr>
                            <tr>
                                <th  class="text-center">2006</th>
                                <td>Toby Proctor</td>
                                <td>Oliver Morgans</td>
                                <td>Toby Proctor<br />
                                    (388 runs @ 78)</td>
                                <td>Toby Proctor<br />
                                    (16 wkts @ 8)</td>
                                <td>?</td>
                                <td>?</td>
                            </tr>
                            <tr>
                                <th class="text-center">2007</th>
                                <td>Paul Bowman</td>
                                <td>John Lucarotti</td>
                                <td>Alan White<br />
                                    (295 runs @ 74)</td>
                                <td>Andy Richardson<br />
                                    (23 wkts @ 11)</td>
                                <td>Saul Reid</td>
                                <td>?</td>
                            </tr>
                            <tr>
                                <th class="text-center">2008</th>
                                <td>Eklavya Gupte</td>
                                <td>?</td>
                                <td>Marcus Littlejohns
                                    <br />
                                    (204 runs @ 20.4)</td>
                                <td>Alan White
                                    <br />
                                    (23 wkts @ 12.8)</td>
                                <td>Graham Pontin</td>
                                <td>?</td>
                            </tr>
                            <tr>
                                <th class="text-center" >2009</th>
                                <td>Marcus Littlejohns</td>
                                <td>Craig Woodhouse</td>
                                <td>Marcus Littlejohns<br />
                                    (479 runs @ 60)
                                    <br />
                                    </td>
                                <td>Paul Bowman<br />
                                    (34 wkts @ 11)
                                    <br />
                                    </td>
                                <td>Graham Pontin</td>
                                <td>Martin Koder</td>
                            </tr>
                            <tr>
                                <th class="text-center">2010</th>
                                <td>Oliver Morgans</td>
                                <td>Eklayva Gupte</td>
                                <td>Oliver Morgans<br />
                                    (665 runs @ 44)</td>
                                <td>Paul Bowman<br />
                                    (33 wkts @ 14)</td>
                                <td>Chris Pitcher</td>
                                <td>?</td>
                            </tr>
                            <tr>
                                <th class="text-center">2011</th>
                                <td>Steve Harty</td>
                                <td>Matt Boa</td>
                                <td>Steve Harty<br />
                                    (730 runs @ 91)</td>
                                <td>Eklavya Gupte<br />
                                    (25 wkts @ 17)</td>
                                <td>Nick Troja</td>
                                <td>Craig Woodhouse</td>
                            </tr>
                            <tr>
                                <th class="text-center">2012</th>
                                <td>Nick Troja</td>
                                <td>Steve Harty</td>
                                <td>Nick Troja<br />
                                    (696 runs @ 58)</td>
                                <td>Matt Boa<br />
                                    (29 wkts @ 14)</td>
                                <td>Oliver Morgans</td>
                                <td>Ben Hampton</td>
                            </tr>
                            <tr>
                                <th class="text-center">2013</th>
                                <td>Matt Boa</td>
                                <td>Nick Troja</td>
                                <td>Steve Harty<br />
                                    (582 runs @ 66)</td>
                                <td>Eklavya Gupte<br />
                                    (24 wkts @ 17)</td>
                                <td>Oliver Morgans</td>
                                <td>Chris Pitcher</td>
                            </tr>
                            <tr>
                                <th class="text-center">2014</th>
                                <td>Nick Troja</td>
                                <td>Nick Thompson</td>
                                <td>Nick Troja<br /> (464 runs @ 65)</td>
                                <td>Eklavya Gupte<br />(19 wkts @ 15)</td>
                                <td>Graham Pontin</td>
                                <td>James de Mellow</td>
                            </tr>
                            <tr>
                                <th class="text-center">2015</th>
                                <td>Nick Troja</td>
                                <td>Toby de Mellow</td>
                                <td>Nick Troja<br /> (582 runs @ 48.5)</td>
                                <td>Eklavya Gupte<br />(34 wkts @ 15)</td>
                                <td>Oliver Morgans</td>
                                <td>Bilal Hussain</td>
                            </tr>
                            <tr>
                                <th class="text-center">2016</th>
                                <td>Prashant Mishra</td>
                                <td>Oliver Morgans</td>
                                <td>Prashant Mishra<br/>(492 runs @ 41)</td>
                                <td>Nick Price-Thompson<br/>(31 wkts @ 7)</td>
                                <td>Nick Troja</td>
                                <td>Prashant Mishra</td>
                            </tr>
                            <tr>
                                <th class="text-center">2017</th>
                                <td>Nick Price-Thompson</td>
                                <td>Prashant Mishra</td>
                                <td>Daniel Slevenson<br />(518 runs @ 86.33)</td>
                                <td>Nick Price-Thompson<br/>(23 wkts @ 14)</td>
                                <td>James de Mellow</td>
                                <td>James de Mellow</td>
                            </tr>
                        </table>
                </div>    
            </div>
            
            <div class="col-sm-12">
                <div class="panel panel-default">
                    <div class="panel-heading">The Hall of Fame <small>(Corridor of Uncertainty)</small></div>
                        <div class="panel-body">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">2008 - Andrew Richardson</div>
                                        <div class="panel-body">
                                            <iframe width="420" height="280" src="//www.youtube.com/embed/TfbYZxot8ek" frameborder="0" allowfullscreen></iframe>
                                    
                                        </div>    
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">2009 - AA Page</div>
                                            <div class="panel-body">
                                                <iframe width="420" height="280" src="//www.youtube.com/embed/JF9WgDY2bw8" frameborder="0" allowfullscreen></iframe>    
                                            </div>    
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">2010 - Alan White</div>
                                        <div class="panel-body">
                                             <iframe width="420" height="280" src="//www.youtube.com/embed/_to1fIcc-cY" frameborder="0" allowfullscreen></iframe>
                                        </div>    
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">2011 - Graham Pontin</div>
                                            <div class="panel-body">
                                                <iframe width="420" height="280" src="//www.youtube.com/embed/cm4u1irM9U4" frameborder="0" allowfullscreen></iframe>
                                             </div>    
                                        </div>
                                    </div>
                                </div>    
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">2012 - Paul Bowman</div>
                                        <div class="panel-body">
                                            <iframe width="420" height="280" src="//www.youtube.com/embed/w7_Gp1xPfuc" frameborder="0" allowfullscreen></iframe>
                                        </div>    
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">2013 - John Lucarotti</div>
                                            <div class="panel-body">
                                                    <iframe width="420" height="280" src="//www.youtube.com/embed/ffju3JkcbHQ" frameborder="0" allowfullscreen></iframe>

                                            </div>    
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">2014 - Matt Boa</div>
                                        <div class="panel-body">
                                            <iframe width="420" height="280" src="//www.youtube.com/embed/F0Vqb7EJjng" frameborder="0" allowfullscreen></iframe>
                                        </div>    
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">2014 - Oli Morgans</div>
                                        <div class="panel-body">
                                           <iframe width="420" height="280" src="//www.youtube.com/embed/HWeb-6s-whQ" frameborder="0" allowfullscreen></iframe>
                                         </div>    
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">2014 - Louse</div>
                                        <div class="panel-body">
                                            <iframe width="420" height="280" src="//www.youtube.com/embed/T54xZvzu1xo" frameborder="0" allowfullscreen></iframe>
                                         </div>    
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">2014 - Parp!</div>
                                        <div class="panel-body">
                                            <iframe width="420" height="280" src="//www.youtube.com/embed/TODO" frameborder="0" allowfullscreen></iframe>
                                        </div>    
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">2015 - Klav</div>
                                        <div class="panel-body">
                                            <iframe width="420" height="280" src="//www.youtube.com/embed/TODO" frameborder="0" allowfullscreen></iframe>
                                         </div>    
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">2016 - Pitch</div>
                                        <div class="panel-body">
                                            <iframe width="420" height="280" src="//www.youtube.com/embed/TODO" frameborder="0" allowfullscreen></iframe>
                                        </div>    
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">2017 - Troja</div>
                                        <div class="panel-body">
                                            <iframe width="420" height="280" src="//www.youtube.com/embed/TODO" frameborder="0" allowfullscreen></iframe>
                                         </div>    
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                </div>
                            </div>    
                        </div>
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
