<%@ Page Language="C#" AutoEventWireup="true" CodeFile="LiveScorecard.aspx.cs" Inherits="LiveScorecard" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html>

<html>
<head id="Head1" runat="server">
    <title>The Village Cricket Club Online | Live Scores</title>
    <CC:Styles runat=server ID=styles /> 
    <style>
        table td {
            text-align: left !important;
        } 
        table th {
            padding: 8px !important;
        }
        .ball-score {
            float: left;
            padding-left: 5px;
            padding-right: 5px;
        }
        .recent-overs {
            border-top: solid 1px;
            padding-top: 8px;
            padding-bottom: 8px;
            margin-top: 10px;
            border-color: rgb(221, 221, 221);
        }
        .over-divider {
            border-right: solid 1px;
            float: left;
            margin-right: 5px;
        }
        .current-partnership {
            border-top: solid 1px;
            padding-top: 8px;
            padding-bottom: 8px;
            padding-left: 10px;
            border-color: rgb(221, 221, 221);
        }
        .last-batsman {
            border-top: solid 1px;
            border-bottom: solid 1px;
            padding-bottom: 8px;
            padding-left: 10px;
            padding-top: 8px;
            border-color: rgb(221, 221, 221);
            margin-bottom: 20px;
            
        }
        .over-comment {
            padding-bottom: 10px;
        }
    </style>
    <script src="Script/purl.js"></script>
    <script src="Script/live-scorecard.js"></script>
</head>
<body>
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
            <H1>Village vs <span class="opposition"></span> <small>live!</small></H1>
            <div class="row">
                <div class="col-sm-8">
                    <div class="pull-left">
                        The Village CC <strong>165/4 (<span id="lastCompletedOver"></span> ov)</strong><br />
                        <span class="opposition"></span> <strong>Yet to bat</strong><br />
                        <small>Village lead someone by 165 runs with 6 wickets remaining</small>
                    </div>
                    <div class="pull-right">
                        <small>
                        Village RR: 4.23<br />
                        <span class="opposition"></span> RR: TBC<br />
                        Overs remaining: <span id="oversRemaining"></span><br />
                        </small>
                    </div>
                    <div class="clearfix"></div>
                    <table class="table table-striped" style="margin-top: 20px">
                        <tr>
                            <th>Batsmen</th>
                            <th>R</th>
                            <th>B</th>
                            <th>4s</th>
                            <th>6s</th>
                            <th>SR</th>
                            <th>This bowler</th>
                            <th>Last 10ovs</th>
                            <th>Mat</th>
                            <th>Runs</th>
                            <th>HS</th>
                            <th>Ave</th>
                        </tr>
                        <tr>
                            <td><span id="onStrikeBatsmanName" /></td>
                            <td><span id="onStrikeBatsmanScore" /></td>
                            <td><span id="onStrikeBatsmanBalls" /></td>
                            <td><span id="onStrikeBatsmanFours" /></td>
                            <td><span id="onStrikeBatsmanSixes" /></td>
                            <td><span id="onStrikeBatsmanStrikeRate" /></td>
                            <td><span id="onStrikeBatsmanScoreForThisBowler" ></span> (<span id="onStrikeBatsmanBallsFacedFromThisBowler"></span>b)</td>
                            <td><span id="onStrikeBatsmanScoreForLastTenOvers" ></span> (<span id="onStrikeBatsmanBallsFacedInLastTenOvers"></span>b)</td>
                            <td><span id="onStrikeBatsmanMatches" /></td>
                            <td><span id="onStrikeBatsmanCareerRuns" /></td>
                            <td><span id="onStrikeBatsmanCareerHighScore" /></td>
                            <td><span id="onStrikeBatsmanCareerAverage" /></td>
                        </tr>
                        <tr>
                            <td><span id="otherBatsmanName" /></td>
                            <td><span id="otherBatsmanScore" /></td>
                            <td><span id="otherBatsmanBalls" /></td>
                            <td><span id="otherBatsmanFours" /></td>
                            <td><span id="otherBatsmanSixes" /></td>
                            <td><span id="otherBatsmanStrikeRate" /></td>
                            <td><span id="otherBatsmanScoreForThisBowler" ></span> (<span id="otherBatsmanBallsFacedFromThisBowler"></span>b)</td>
                            <td><span id="otherBatsmanScoreForLastTenOvers" ></span> (<span id="otherBatsmanBallsFacedInLastTenOvers"></span>b)</td>
                            <td><span id="otherBatsmanMatches" /></td>
                            <td><span id="otherBatsmanCareerRuns" /></td>
                            <td><span id="otherBatsmanCareerHighScore" /></td>
                            <td><span id="otherBatsmanCareerAverage" /></td>
                        </tr>
                    </table>
                    
                    <table class="table table-striped" style="margin-top: 20px">
                        <tr>
                            <th>Bowlers</th>
                            <th>O</th>
                            <th>M</th>
                            <th>R</th>
                            <th>W</th>
                            <th>Econ</th>
                            <th>0s</th>
                            <th>4s</th>
                            <th>6s</th>
                            <th>This spell</th>
                        </tr>
                        <tr>
                            <td>Some chap</td>
                            <td>10</td>
                            <td>15</td>
                            <td>1</td>
                            <td>0</td>
                            <td>23.45</td>
                            <td>2(1b)</td>
                            <td>10(15b)</td>
                            <td>68</td>
                            <td>1034</td>
                        </tr>
                        <tr>
                            <td>Another bloke</td>
                            <td>10</td>
                            <td>15</td>
                            <td>1</td>
                            <td>0</td>
                            <td>23.45</td>
                            <td>2(1b)</td>
                            <td>10(15b)</td>
                            <td>68</td>
                            <td>1034</td>
                        </tr>
                    </table>
                    <div class="recent-overs">
                        <div class="pull-left" style="margin-right: 10px; margin-left: 10px"><strong><small>Recent overs</small></strong></div>
                        <div class="ball-score">
                        •    
                        </div> 
                        <div class="ball-score">
                        <small>4</small>    
                        </div> 
                        <div class="ball-score">
                        <small>1</small>
                        </div> 
                        <div class=" ball-score">
                        •    
                        </div>
                        <div class="over-divider">
                        &nbsp;
                        </div>
                        <div class="ball-score">
                        <small>1</small>    
                        </div> 
                        <div class="clearfix"></div>                       
                    </div> 
                    <div class="current-partnership">
                        <strong><small>Current partnership </small> </strong><small>
                    16 runs,
                    6.0 overs,
                    RR: 2.66
                    (Cook 8, Hales 5)
                    </small>
                    </div>
                    <div class="last-batsman">
                        <strong><small>Last bat </small> </strong><small>
                        JWA Taylor c Bavuma b Piedt 27 (112m 84b 1x4 1x6) SR: 32.14
                        </small><br />
                        <strong><small>Fall of wicket </small> </strong>
                        <small>
                        116/6 (42.4 ov); Partnership: 1 runs, 1.4 overs, RR: 0.60 (Bairstow 1, Taylor 0)
                        </small>
                    </div>
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <small><strong>End of over 10</strong> (3 runs) <strong>Village 165/4</strong></small>
                        </div>
                        <div class="panel-body">
                            <div class="over-comment">Stuff happened in this over and it was totally incredible, yes it was.</div>
                            <div class="row">
                                <div class="col-sm-1"><strong>9.6</strong></div>
                                <div class="col-sm-11">
                                    A chap to GC Pontin <strong>FOUR</strong>
                                </div>
                            </div>
                        </div>
                    </div>   
                </div>
                <div class="col-sm-4">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Analysis
                        </div>
                        <div class="panel-body">
                            Stuff
                        </div>
                    </div>

                </div>    
            </div>
            
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>


