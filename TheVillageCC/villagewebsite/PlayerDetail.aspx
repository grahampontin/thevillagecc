<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PlayerDetail.aspx.cs" Inherits="PlayerDetail" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html>

<html lang="en">
<head runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>The Village Cricket Club Online | Squad | <%= PlayerName %></title>
    <CC:Styles runat="server" ID="styles"></CC:Styles>

    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"/>

    <script src="Resources/jQuery/jquery-3.6.0.min.js"></script>
    <script src="Script/purl.js"></script>
    <script src="Resources/ag-grid/ag-grid-community.min.js"></script>
    <script src="Script/agGrid/linkToPlayerStatsRenderer.js"></script>
    <script src="Script/agGrid/linkToMatchReportRenderer.js"></script>
    <script src="Resources/chart-js/chart.js"></script>
    <script src="Script/utilities.js" type="text/javascript"></script>
    <script src="Script/player-detail.js" type="text/javascript"></script>


    <link href="/CSS/jqplot/jquery.jqplot.min.css" rel="stylesheet" type="text/css" media="screen"/>
    <link href="/CSS/ag-grid-custom.css" rel="stylesheet" type="text/css" media="screen"/>
    <link href="/CSS/chart-js-custom.css" rel="stylesheet" type="text/css" media="screen"/>
</head>
<body>
<div class="">
<!-- Head -->
<CC:Header ID="Header1" runat="server"></CC:Header>
<!-- End Head -->
<div class="d-lg-none" style="background-image: url('Images/newCarousel/slide1.jpg'); background-position: 50%; background-size: cover; background-repeat: no-repeat;">
    <div>
        <div class="d-flex justify-content-between align-items-center" style=" backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px)">
            <div style="color: white" class="ps-2">
                <h5 class="player-name"></h5>
                <div class="playing-role"></div>
                <div>Seasons <span class="debut-season"></span> - <span class="latest-season"></span></div>
            </div>
            <div class="justify-content-flex-end">
                <img class="player-image" src="Images/player_profiles/0.png"/>
            </div>
        </div>
    </div>
</div>
<nav class="d-block d-lg-none">
    <div class="nav nav-pills nav-justified underline-nav" id="pills-tab" role="tablist">
        <button class="nav-link active" id="overview-tab" data-bs-toggle="tab" data-bs-target="#overview" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Overview</button>
        <button class="nav-link" id="stats-tab" data-bs-toggle="tab" data-bs-target="#stats" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Stats</button>
        <button class="nav-link" id="matches-tab" data-bs-toggle="tab" data-bs-target="#matches" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Matches</button>
    </div>
</nav>

<main class="container">
    <form id="form1" runat="server" class="form-horizontal">
        <div class="d-flex">
            <div class="d-none d-lg-block me-4 mt-3" style="width: 230px">
                <%-- left gutter    --%>
                <div class="card" style="width: 230px; background-image: url('Images/newCarousel/slide1.jpg'); background-position: 50%; background-size: cover; background-repeat: no-repeat;">

                    <div class="card-body pb-0 pe-0" style="backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px)">
                        <h5 class="card-title player-name"></h5>
                        <h6 class="batting-role"></h6>
                        <div class="ms-auto" style="text-align: end">
                            <img class="player-image" src="Images/player_profiles/0.png"/>
                        </div>
                    </div>
                    <div class="bg-primary p-1 ps-3" style="border-bottom-left-radius: var(--bs-card-border-radius); border-bottom-right-radius: var(--bs-card-border-radius)">
                        <h5 class="text-white">Seasons <span class="debut-season"></span> - <span class="latest-season"></span></h5>
                    </div>
                </div>
                <div class="card mt-3">

                    <div class="card-body">
                        <h5 class="card-title">Other Players</h5>

                    </div>
                </div>
            </div>
            <div class="flex-fill">
                <div class="card mt-3 d-none d-lg-block">
                    <div class="card-body pt-0 pb-0">
                        <nav class="">
                            <div class="nav nav-pills nav-justified underline-nav-2 " id="pills-tab" role="tablist">
                                <button class="nav-link active" id="overview-tab" data-bs-toggle="tab" data-bs-target="#overview" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Overview</button>
                                <button class="nav-link" id="stats-tab" data-bs-toggle="tab" data-bs-target="#stats" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Stats</button>
                                <button class="nav-link" id="matches-tab" data-bs-toggle="tab" data-bs-target="#matches" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Matches</button>
                            </div>
                        </nav>
                    </div>
                </div>
                <div class="tab-content">
                    <div role="tabpanel" class="tab-pane active" id="overview">
                        <div class="card mt-3">
                            <div class="card-body">
                                <div class="row row-cols-md-2 row-cols-lg-3">
                                    <div class="col">
                                        <div class="text-nowrap">
                                            <strong>Batting Style: </strong><span class="player-batting-style"></span>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="text-nowrap">
                                            <strong>Bowling Style: </strong><span class="player-bowling-style"></span>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="text-nowrap">
                                            <strong>Debut: </strong><span class="player-debut"></span>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="text-nowrap">
                                            <strong>Caps: </strong><span class="player-caps"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card mt-3">
                            <div class="card-body">
                                <h5 class="card-title">
                                    Career Stats
                                </h5>
                                <div class="">
                                    <hr/>
                                    Batting and Fielding
                                </div>
                                <div id="careerBattingStatsGrid" class="ag-theme-material player-detail-grid mb-3"></div>
                                <div class="stats-chart">
                                    <div class="btn-group dropend" id="battingChartSelector">
                                        <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            ....
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <a class="dropdown-item batting-chart-link" chart-id="battingTimeline">Batting Timeline</a>
                                            </li>
                                            <li>
                                                <a class="dropdown-item batting-chart-link" chart-id="modesOfDismissal">Modes of Dismissal</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <canvas id="careerBattingChart"></canvas>
                                </div>
                                <div class="mt-3">
                                    <hr/>
                                    Bowling
                                </div>
                                <div id="careerBowlingStatsGrid" class="ag-theme-material player-detail-grid mb-3"></div>
                                <div class="stats-chart">
                                    <div class="btn-group dropend" id="bowlingChartSelector">
                                        <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            ....
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <a class="dropdown-item bowling-chart-link" chart-id="wicketsBySeason">Wickets by Season</a>
                                            </li>
                                            <li>
                                                <a class="dropdown-item bowling-chart-link" chart-id="averageBySeason">Average by Season</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <canvas id="careerBowlingChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="stats">
                        <div class="card mt-3">

                            <div class="card-body px-0">
                                <div class="card-title border-bottom px-3">
                                    <div class="d-flex justify-content-between pb-2">
                                        <h5 class="my-auto">Career Stats</h5>
                                        <div class="btn-group dropend" id="statsDetailSelector">
                                            <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                Batting
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <a class="dropdown-item stats-detail-link" stats-type="Batting">Batting</a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item stats-detail-link" stats-type="Bowling">Bowling</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div id="statsDetailGridsPlaceHolder"></div>
                            </div>
                        </div>

                    </div>
                    <div role="tabpanel" class="tab-pane" id="matches">
                        <div class="card mt-3">
                            <div class="card-body px-0">
                                <div class="card-title border-bottom px-3">
                                    <div class="d-flex justify-content-between pb-2">
                                        <h5 class="my-auto">Matches</h5>
                                    </div>
                                </div>
                                <div class="stats-grid-divider">All Matches</div>
                                <div id="statsAllMatchesGridContainer" class="ag-theme-material"></div>                                
                            </div>
                        </div>

                    </div>
                </div>


                <%-- main contents --%>
            </div>
        </div>
    </form>
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

</div><!-- Footer -->
<CC:Footer ID="Footer1" runat="server"/>
<!-- ENd Footer -->
</body>
</html>