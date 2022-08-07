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
        
        .over-commentary {
            border-top: solid 1px;
            border-color: rgb(221, 221, 221);
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
        }
        
    </style>
    <script src="Resources/jQuery/jquery-3.6.0.min.js"></script>
    <script src="Script/purl.js"></script>
    <script src="Script/wagonwheel-functions.js"></script>
    <script src="Script/live-scorecard.js"></script>
    <script src="Script/raphael-min.js"></script>
    <script src="Script/gRaphael/g.raphael.js"></script>
    <script src="Script/gRaphael/g.line-min.js"></script>
    <script src="Script/gRaphael/g.bar.js"></script>
    <script src="Script/vcc.charts.js"></script>
    <script src="MobileWeb/script/ballbyball.ball.js"></script>
</head>
<body>
<div class="container">
<!-- Head -->
<CC:Header ID="Header1" runat=server />
<!-- End Head -->
<main class="container">
<H1 class="mb-0">Village vs <span class="opposition"></span> <small class="hide-if-not-in-play">live!</small></H1>
<div class="fst-italic mb-1"><small><span id="toss-winner"></span> won the toss and elected to <span id="bat-or-bowl"></span>.</small></div>
<div class="float-start">
    
    The Village CC
    <span id="ourScoreSummary">
        <strong>
            <span id="teamScore"></span>/<span id="teamWickets"></span> (<span id="lastCompletedOver"></span> ov)
        </strong>
    </span>
    <span id="usYetToBat">
        <strong>Yet to bat</strong>
    </span>
    <br/>
    <span class="opposition"></span>
    <span id="oppositionScoreSummary">
        <strong>
            <span id="oppositionScore"></span>/<span id="oppositionWickets"></span> (<span id="oppositionLastCompletedOver"></span> ov)
        </strong>
    </span>
    <span id="oppositionYetToBat">
        <strong>Yet to bat</strong>
    </span>
    <br/>
    <div><small>Match Format: <span id="match-format"></span></small></div>
    <span id="scoreSummary">
        <small><span class="teamCurrentlyBatting"></span> <span class="leadOrTrail"></span> <span class="teamCorrentlyBowling"></span> by <span id="leadTrailByRuns"></span> runs with <span id="wicketsRemaining"></span> wickets remaining</small>
    </span>
    <span id="resultSummary">
        <small>
            <span id="resultSummaryText"></span>
        </small>
    </span>

</div>
<div class="float-end d-none d-sm-block">
    <small>
        Village RR: <span id="teamRunRate"></span><br/>
        <span class="opposition"></span> RR: <span id="oppositionRunRate"></span><br/>
        <span class="hide-if-not-in-play">Overs remaining: <span id="oversRemaining"></span><br/></span>
        <span class="hide-if-not-in-play">Required RR: <span id="requiredRunRate"></span></span>
    </small>
</div>
<div class="clearfix"></div>
<div id="live-batting-info" class="hide-if-not-in-play">
<table class="table table-striped" style="margin-top: 20px">
    <tr>
        <th>Batsmen</th>
        <th>R</th>
        <th>B</th>
        <th>4s</th>
        <th>6s</th>
        <th>SR</th>
        <th class="d-none d-sm-table-cell">This bowler</th>
        <th class="d-none d-sm-table-cell">Last 10ovs</th>
        <th class="d-none d-md-table-cell">Mat</th>
        <th class="d-none d-md-table-cell">Runs</th>
        <th class="d-none d-md-table-cell">HS</th>
        <th class="d-none d-md-table-cell">Ave</th>
    </tr>
    <tr>
        <td>
            <span id="onStrikeBatsmanName"/>
        </td>
        <td>
            <span id="onStrikeBatsmanScore"/>
        </td>
        <td>
            <span id="onStrikeBatsmanBalls"/>
        </td>
        <td>
            <span id="onStrikeBatsmanFours"/>
        </td>
        <td>
            <span id="onStrikeBatsmanSixes"/>
        </td>
        <td>
            <span id="onStrikeBatsmanStrikeRate"/>
        </td>
        <td class="d-none d-sm-table-cell">
            <span id="onStrikeBatsmanScoreForThisBowler"></span> (<span id="onStrikeBatsmanBallsFacedFromThisBowler"></span>b)
        </td>
        <td class="d-none d-sm-table-cell">
            <span id="onStrikeBatsmanScoreForLastTenOvers"></span> (<span id="onStrikeBatsmanBallsFacedInLastTenOvers"></span>b)
        </td>
        <td class="d-none d-md-table-cell">
            <span id="onStrikeBatsmanMatches"/>
        </td>
        <td class="d-none d-md-table-cell">
            <span id="onStrikeBatsmanCareerRuns"/>
        </td>
        <td class="d-none d-md-table-cell">
            <span id="onStrikeBatsmanCareerHighScore"/>
        </td>
        <td class="d-none d-md-table-cell">
            <span id="onStrikeBatsmanCareerAverage"/>
        </td>
    </tr>
    <tr>
        <td>
            <span id="otherBatsmanName"/>
        </td>
        <td>
            <span id="otherBatsmanScore"/>
        </td>
        <td>
            <span id="otherBatsmanBalls"/>
        </td>
        <td>
            <span id="otherBatsmanFours"/>
        </td>
        <td>
            <span id="otherBatsmanSixes"/>
        </td>
        <td>
            <span id="otherBatsmanStrikeRate"/>
        </td>
        <td class="d-none d-sm-table-cell">
            <span id="otherBatsmanScoreForThisBowler"></span> (<span id="otherBatsmanBallsFacedFromThisBowler"></span>b)
        </td>
        <td class="d-none d-sm-table-cell">
            <span id="otherBatsmanScoreForLastTenOvers"></span> (<span id="otherBatsmanBallsFacedInLastTenOvers"></span>b)
        </td>
        <td class="d-none d-md-table-cell">
            <span id="otherBatsmanMatches"/>
        </td>
        <td class="d-none d-md-table-cell">
            <span id="otherBatsmanCareerRuns"/>
        </td>
        <td class="d-none d-md-table-cell">
            <span id="otherBatsmanCareerHighScore"/>
        </td>
        <td class="d-none d-md-table-cell">
            <span id="otherBatsmanCareerAverage"/>
        </td>
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
        <th class="d-none d-sm-table-cell">0s</th>
        <th class="d-none d-sm-table-cell">4s</th>
        <th class="d-none d-sm-table-cell">6s</th>
        <th class="d-none d-md-table-cell">This spell</th>
    </tr>
    <tr>
        <td>
            <span id="bowlerOneName"></span>
        </td>
        <td>
            <span id="bowlerOneOvers"></span>
        </td>
        <td>
            <span id="bowlerOneMaidens"></span>
        </td>
        <td>
            <span id="bowlerOneRuns"></span>
        </td>
        <td>
            <span id="bowlerOneWickets"></span>
        </td>
        <td>
            <span id="bowlerOneEconomy"></span>
        </td>
        <td class="d-none d-sm-table-cell">
            <span id="bowlerOneDots"></span>
        </td>
        <td class="d-none d-sm-table-cell">
            <span id="bowlerOneFours"></span>
        </td>
        <td class="d-none d-sm-table-cell">
            <span id="bowlerOneSixes"></span>
        </td>
        <td class="d-none d-md-table-cell">
            <span id="bowlerOneThisSpell"></span>
        </td>
    </tr>
    <tr id="bowlerTwoRow">
        <td>
            <span id="bowlerTwoName"></span>
        </td>
        <td>
            <span id="bowlerTwoOvers"></span>
        </td>
        <td>
            <span id="bowlerTwoMaidens"></span>
        </td>
        <td>
            <span id="bowlerTwoRuns"></span>
        </td>
        <td>
            <span id="bowlerTwoWickets"></span>
        </td>
        <td>
            <span id="bowlerTwoEconomy"></span>
        </td>
        <td class="d-none d-sm-table-cell">
            <span id="bowlerTwoDots"></span>
        </td>
        <td class="d-none d-sm-table-cell">
            <span id="bowlerTwoFours"></span>
        </td>
        <td class="d-none d-sm-table-cell">
            <span id="bowlerTwoSixes"></span>
        </td>
        <td class="d-none d-md-table-cell">
            <span id="bowlerTwoThisSpell"></span>
        </td>
    </tr>
</table>
<div class="recent-overs d-flex">
    <div style="margin-right: 10px; margin-left: 10px; " class="text-nowrap">
        <strong>
            <small>Recent overs</small>
        </strong>
    </div>
    <div id="recentOvers" class="d-flex overflow-scroll" style="height: 1.8em; padding-bottom: 0.2em"></div>
    <div class="clearfix"></div>
</div>
<div class="current-partnership">
    <strong>
        <small>Current partnership </small>
    </strong>
    <small>
        <span id="currentPartnershipRuns"></span> runs,
        <span id="currentPartnershipOvers"></span> overs,
        RR: <span id="currentPartnershipRunRate"></span>
        (<span id="currentPartnershipPlayer1Name"></span> <span id="currentPartnershipPlayer1Runs"></span>, <span id="currentPartnershipPlayer2Name"></span> <span id="currentPartnershipPlayer2Runs"></span>)
    </small>
</div>
<div class="last-batsman hide-if-not-in-play">
    <strong>
        <small>Last bat </small>
    </strong>
    <small>
        <span id="lastBatsmanWicketText"></span>
    </small><br/>
    <strong>
        <small>Fall of wicket </small>
    </strong>
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
<div id="match-report" class="completed-only">
    <div id="match-report-conditions"></div>
    <div id="match-report-text"></div>
</div>
<div id="live-analysis">
    <nav class="d-none d-md-block">
        <div class="nav nav-tabs mb-3" id="pills-tab" role="tablist">
            <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#OurCommentary" type="button" role="tab" aria-controls="nav-home" aria-selected="true">VCC Commentary</button>
            <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#TheirCommentary" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Oppo Commentary</button>
            <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#Analysis" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Analysis</button>
            <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#Scorecard" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Scorecard</button>
            <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#Players" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Players</button>
        </div>
    </nav>
    
    <div class="tab-content d-none d-md-block border-bottom pb-1 mb-1">
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
            <nav>
                <div class="nav nav-pills nav-justified" id="analysisTabs" role="tablist">
                    <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#worm" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Worm</button>
                    <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#wagon" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Wagon Wheel</button>
                    <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#manhattan" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Manhattan</button>
                    <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#partnerships" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Partnerships</button>
                </div>
            </nav>
        </div>
        <div role="tabpanel" class="tab-pane" id="Scorecard">
            <div id="inPlayScorecardContainer">
                <strong>Village CC Batting (Match Currently In-Play)</strong>
                <table class="table table-striped" style="margin-top: 20px" id="inPlayScorecard">
                    
                </table>
    
                <strong><span class="opposition"></span> Bowling (Match Currently In-Play)</strong>
                <table class="table table-striped" style="margin-top: 20px" id="inPlayBowlingScorecard">
                </table>
    
                <small>Full scoreacard details for both innings will appear once the match is completed and reports submitted.</small>
    
    
            </div>
            <div id="matchCompletedScoreCards">
                <%--Todo--%>
            </div>
        </div>
        <div role="tabpanel" class="tab-pane" id="Players">
            <div class="mb-1" >
                <div class="d-flex justify-content-center" id="player-icons"></div>
                <div id="player-analysis-chart" class="mb-1"></div>
                <nav>
                    <div id="chart-types"  class="nav nav-pills nav-justified" role="tablist">
                        <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" chartType="wagon" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Wagon Wheel</button>
                        <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" chartType="zones" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Scoring Zones</button>
                        <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" chartType="worm" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Worm</button>
                    </div>
                </nav>
            </div>
    
        </div>
    </div>
    
    
    <div class="accordion d-md-none mb-3" id="mobile-accordian">
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Commentary
                </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#mobile-accordian">
                <div class="accordion-body" id="accordian-over-details">
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    Opposition Commentary
                </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#mobile-accordian">
                <div class="accordion-body" id="accordian-oppo-commentary">
    
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    Analysis
                </button>
            </h2>
            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#mobile-accordian">
                <div class="accordion-body">
                    <div id="accordian-chart-placeholder" style="margin-bottom: 1em"></div>
                    <nav>
                        <div class="nav nav-pills nav-justified" id="accordian-analysis-tabs" role="tablist">
                            <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#worm" type="button" role="tab" aria-controls="nav-home" aria-selected="true">
                                <i class="fa-solid fa-chart-line"></i>
                            </button>
                            <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#wagon" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">
                                <i class="fa-solid fa-dharmachakra"></i>
                            </button>
                            <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#manhattan" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">
                                <i class="fa-solid fa-chart-column"></i>
                            </button>
                            <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#partnerships" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">
                                <i class="fa-solid fa-people-arrows-left-right"></i>
                            </button>
                        </div>
                    </nav>
                </div>
            </div>
    
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingFour">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                    Scorecards
                </button>
            </h2>
            <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#mobile-accordian">
                <div class="accordion-body" id="accordian-scorecards">
                    <strong>Village CC Batting (Match Currently In-Play)</strong>
                    <table id="mobile-view-in-play-batting-scorecard" class="table table-striped"></table>
                    
                     <strong><span class="opposition"></span> Bowling (Match Currently In-Play)</strong>
                                    
                    <table class="table table-striped" style="margin-top: 20px" id="mobile-view-in-play-bowling-scorecard">
                    </table>
    
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingFive">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                    Players
                </button>
            </h2>
            <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#mobile-accordian">
                <div class="accordion-body" id="accordian-player-analysis">
                    <select class="form-select" id="mobile-player-analysis-select">
                      
                    </select>
                    <div id="player-analysis-chart-mobile" class="mb-1"></div>
                    <nav>
                        <div id="player-chart-types-mobile"  class="nav nav-pills nav-justified" role="tablist">
                            <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" chartType="wagon" type="button" role="tab" aria-controls="nav-home" aria-selected="true"><i class="fa-solid fa-dharmachakra"></i></button>
                            <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" chartType="zones" type="button" role="tab" aria-controls="nav-profile" aria-selected="false"><i class="fa-solid fa-record-vinyl"></i></button>
                            <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" chartType="worm" type="button" role="tab" aria-controls="nav-contact" aria-selected="false"><i class="fa-solid fa-chart-line"></i></button>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    
    
    </div>
    
</div>


<div id="errorModal" class="modal" tabindex="-1">
    <div class="modal-dialog modal-fullscreen-md-down">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Error!</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>Modal body text goes here.</p>
            </div>
        </div>
    </div>
</div>
</main>
<!-- Footer -->
<CC:Footer ID="Footer1" runat="server"/>
<!-- ENd Footer -->
</div>
</body>
</html>