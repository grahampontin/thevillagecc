<%@ Page Language="C#" AutoEventWireup="true" CodeFile="LiveScorecard.aspx.cs" Inherits="LiveScorecard" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html>

<html lang="en">
<head runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

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
        .ball-row {
            padding-bottom: 5px;
        }
        .wicket-row {
            padding-bottom: 10px; 

        }
        .player-icon {
            background-color: #ff4500;
            width: 50px;
            color: #ffffff;
            font-weight: bold;
            height: 50px;
            margin-left: 10px;
            text-align: center;
            padding-top: 13px;
            margin-bottom: 5px;
        }
        .player-icon:hover {
            cursor: pointer;
        }

        .player-icon-row {
            overflow-x: scroll;
        }
        .player-icon-inner {
            
        }
        .player-icon-active {
            background-color: #000000 !important;
        }
        .chart-types {
            margin-left: 10px;
            margin-bottom: 10px;
        }
        .chart-type {
            margin: 5px;
            height: 40px;
            width: 40px;
            padding-top: 7px;
            background-color: #ddd;
            vertical-align: central;
            text-align: center;
        }
        .chart-type:hover {
            cursor: pointer;
        }

        .chart-type-active {
            background-color: #556b2f !important;
        }

        #tabs {
            margin-bottom: 20px;
        }
        #mainContent {
            margin-bottom: 20px;
        }
        
    </style>
    <script src="Script/purl.js"></script>
    <script src="Script/wagonwheel-functions.js"></script>
    <script src="Script/live-scorecard.js"></script>
    <script src="Script/gRaphael/g.raphael-min.js"></script>
    <script src="Script/gRaphael/g.line-min.js"></script>
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
                        The Village CC 
                            <span id="ourScoreSummary">
                                <strong>
                                <span id="teamScore"></span>/<span id="teamWickets"></span> (<span id="lastCompletedOver"></span> ov)
                                </strong>
                            </span>
                            <span id="usYetToBat">
                                <strong>Yet to bat</strong>
                            </span>
                        <br />
                        <span class="opposition"></span> 
                        <span id="oppositionScoreSummary">
                            <strong>
                                <span id="oppositionScore"></span>/<span id="oppositionWickets"></span> (<span id="oppositionLastCompletedOver"></span> ov)
                            </strong>
                        </span>
                        <span id="oppositionYetToBat">
                                <strong>Yet to bat</strong>
                        </span>
                        <br />
                        <small><span class="teamCurrentlyBatting"></span> <span class="leadOrTrail"></span> <span class="teamCorrentlyBowling"></span> by <span id="leadTrailByRuns"></span> runs with <span id="wicketsRemaining"></span> wickets remaining</small>
                    </div>
                    <div class="pull-right">
                        <small>
                        Village RR: <span id="teamRunRate"></span><br />
                        <span class="opposition"></span> RR: <span id="oppositionRunRate"></span><br />
                        Overs remaining: <span id="oversRemaining"></span><br />
                        Required RR: <span id="requiredRunRate"></span>
                        </small>
                    </div>
                    <div class="clearfix"></div>
                    <div id="live-batting-info">
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
                            <td><span id="bowlerOneName"></span></td>
                            <td><span id="bowlerOneOvers"></span></td>
                            <td><span id="bowlerOneMaidens"></span></td>
                            <td><span id="bowlerOneRuns"></span></td>
                            <td><span id="bowlerOneWickets"></span></td>
                            <td><span id="bowlerOneEconomy"></span></td>
                            <td><span id="bowlerOneDots"></span></td>
                            <td><span id="bowlerOneFours"></span></td>
                            <td><span id="bowlerOneSixes"></span></td>
                            <td><span id="bowlerOneThisSpell"></span></td>
                        </tr>
                        <tr id="bowlerTwoRow">
                            <td><span id="bowlerTwoName"></span></td>
                            <td><span id="bowlerTwoOvers"></span></td>
                            <td><span id="bowlerTwoMaidens"></span></td>
                            <td><span id="bowlerTwoRuns"></span></td>
                            <td><span id="bowlerTwoWickets"></span></td>
                            <td><span id="bowlerTwoEconomy"></span></td>
                            <td><span id="bowlerTwoDots"></span></td>
                            <td><span id="bowlerTwoFours"></span></td>
                            <td><span id="bowlerTwoSixes"></span></td>
                            <td><span id="bowlerTwoThisSpell"></span></td>
                        </tr>
                    </table>
                    <div class="recent-overs">
                        <div class="pull-left" style="margin-right: 10px; margin-left: 10px"><strong><small>Recent overs</small></strong></div>
                        <div id="recentOvers"></div>
                        <div class="clearfix"></div>                       
                    </div> 
                    <div class="current-partnership">
                        <strong><small>Current partnership </small> </strong><small>
                    <span id="currentPartnershipRuns"></span> runs,
                    <span id="currentPartnershipOvers"></span> overs,
                    RR: <span id="currentPartnershipRunRate"></span>
                    (<span id="currentPartnershipPlayer1Name"></span> <span id="currentPartnershipPlayer1Runs"></span>, <span id="currentPartnershipPlayer2Name"></span> <span id="currentPartnershipPlayer2Runs"></span>)
                    </small>
                    </div>
                    <div class="last-batsman">
                        <strong><small>Last bat </small> </strong><small>
                        <span id="lastBatsmanWicketText"></span>
                        </small><br />
                        <strong><small>Fall of wicket </small> </strong>
                        <small>
                        <span id="fallOfWicketTeamScore"></span>/<span id="fallOfWicketWicketNumber"></span> (<span id="fallOfWicketOver"></span> ov); 
                            Partnership: 
                            <span id="lastPartnershipRuns"></span> runs,
                            <span id="lastPartnershipOvers"></span> overs,
                            RR: <span id="lastPartnershipRunRate"></span>
                            (<span id="lastPartnershipPlayer1Name"></span> <span id="lastPartnershipPlayer1Runs"></span>, <span id="lastPartnershipPlayer2Name"></span> <span id="lastPartnershipPlayer2Runs"></span>)
                    
                        </small>
                    </div>    
                    </div>
                    
                    
                    <ul id="tabs" class="nav nav-tabs">
		                <li class="active"><a href="#OurCommentary" role="tab" data-toggle="tab">VCC Commentary</a></li>
		                <li><a href="#TheirCommentary" role="tab" data-toggle="tab">Oppo Commentary</a></li>
		                <li><a href="#Analysis" role="tab" data-toggle="tab">Analysis</a></li>
		                <li><a href="#Scorecard" role="tab" data-toggle="tab">Scorecard</a></li>
		                <li><a href="#Report" role="tab" data-toggle="tab">Report</a></li>
		            </ul>
                    
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="OurCommentary">
                            <div id="overDetails">
                                <!-- Populated by script -->
                            </div>        
                        </div>
                        <div role="tabpanel" class="tab-pane" id="TheirCommentary">
                            <div id="theirOverDetails">
                                <!-- Populated by script -->
                            </div>        
                        </div>
                        <div role="tabpanel" class="tab-pane" id="Analysis">
                            <div id="chartPlaceholder"></div>
                            <ul id="analysisTabs" class="nav nav-pills nav-justified">
		                        <li class="active"><a href="#worm" role="tab" data-toggle="tab">Worm</a></li>
		                        <li><a href="#wagon" role="tab" data-toggle="tab">Wagon Wheel</a></li>
		                        <li><a href="#manahttan" role="tab" data-toggle="tab">Manhattan</a></li>
		                        <li><a href="#partnerships" role="tab" data-toggle="tab">Partnerships</a></li>
		                    </ul>
                        </div>
                        <div role="tabpanel" class="tab-pane" id="Scorecard">
                            Coming soon
                        </div>
                        <div role="tabpanel" class="tab-pane" id="Report">
                            Report not yet available
                        </div>
                    </div>

                    
                       
                </div>
                <div class="col-sm-4">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Match Conditions
                        </div>
                        <div class="panel-body">
                            <span id="toss-winner"></span> won the toss and elected to <span id="bat-or-bowl"></span>.
                            <br/><br/>
                            Match format: <span id="match-format"></span>
                        </div>
                    </div>

                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Player Analysis
                        </div>
                        <div class="panel-body">
                            <div class="player-icon-row">
                                <div class="player-icon-inner" id="player-icons">
                                    
                                </div>
                            </div>
                            <div id="chart-types" class="hidden">
                                <div class="chart-type chart-type-active pull-left" chartType="wagon">
                                    <img src="Images/liveScorecard/wagon.png" />
                                </div>
                                <div class="chart-type pull-left" chartType="zones">
                                    <img src="Images/liveScorecard/zones.png" />
                                </div>
                                <div class="chart-type pull-left" chartType="worm">
                                    <img src="Images/liveScorecard/worm.png" />
                                </div>
                            </div>
                            <div id="wagon-wheel">
                            </div>
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


