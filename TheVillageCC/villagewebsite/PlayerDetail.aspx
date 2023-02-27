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
    <script src="Script/jqplot/jquery.jqplot.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.barRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.categoryAxisRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.canvasAxisTickRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.canvasTextRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.enhancedLegendRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.canvasAxisLabelRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.pieRenderer.min.js" type="text/javascript"></script>

    <script src="Script/purl.js"></script>
    <script src="https://unpkg.com/ag-grid-community/dist/ag-grid-community.min.js"></script>
    <script src="Script/agGrid/linkToPlayerStatsRenderer.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="Script/player-detail.js" type="text/javascript"></script>


    <link href="/CSS/jqplot/jquery.jqplot.min.css" rel="stylesheet" type="text/css" media="screen"/>
    <link href="/CSS/ag-grid-custom.css" rel="stylesheet" type="text/css" media="screen"/>
    <link href="/CSS/chart-js-custom.css" rel="stylesheet" type="text/css" media="screen"/>


    <script language="javascript">
       
        $(function () {
            // $('#fromDate').datetimepicker({
            //     defaultDate: new Date(new Date().getUTCFullYear(), 3, 1),
            //     format: 'DD MMMM YYYY'
            // });
            // $('#toDate').datetimepicker({
            //     defaultDate: new Date(new Date().getUTCFullYear()+1, 3, 1),
            //     format: 'DD MMMM YYYY'
            // });

            $(".StatsTable tr:last").addClass('Bold');
            $("#FilterButton").button();
            $("#battingChartSelect").change(onBattingSelectChange);
            $("#bowlingChartSelect").change(onBowlingSelectChange);
        });

        function LoadBattingGraph(playerId, chartName) 
        {
            $('#battingChart').html('');
            $('#battingChartLoading').show();
            $.post('/ChartRendererAJAX.aspx', { 'chartName': chartName, 'playerid' : playerId }, function(data) {
                $('#battingChart').html(data);
                $('#battingChartLoading').hide();
            });
        }
        
        function LoadBowlingGraph(playerId, chartName) 
        {
            $('#bowlingChart').html('');
            $('#bowlingChartLoading').show();
            $.post('/ChartRendererAJAX.aspx', { 'chartName': chartName, 'playerid' : playerId }, function(data) {
                $('#bowlingChart').html(data);
                $('#bowlingChartLoading').hide();
            });
        }

        function onBattingSelectChange(){
            var selected = $("#battingChartSelect option:selected");    
            if(selected.val() != 0){
                LoadBattingGraph(<%= p.Id %>, selected.val());
            }
        }
        function onBowlingSelectChange(){
            var selected = $("#bowlingChartSelect option:selected");    
            if(selected.val() != 0){
                LoadBowlingGraph(<%= p.Id %>, selected.val());
            }
        }

    </script>
</head>
<body>
<div class="container">
    <!-- Head -->
    <CC:Header ID="Header1" runat="server"></CC:Header>
    <!-- End Head -->
    <main class="container">
        <form id="form1" runat="server" class="form-horizontal">
            <div class="d-flex">
                <div style="width: 230px">
                    <%-- left gutter    --%>
                    <div class="card" style="width: 230px;">
                        <div class="m-1">
                            <asp:Image ID="PlayerImage" Width="220" runat="server"></asp:Image>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title"><%= p.Name %></h5>
                        </div>
                    </div>
                </div>
                <div class="flex-fill ms-4">
                    <nav class="d-none d-md-block">
                        <div class="nav nav-pills nav-justified" id="pills-tab" role="tablist">
                            <button class="nav-link active" id="overview-tab" data-bs-toggle="tab" data-bs-target="#overview" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Overview</button>
                            <button class="nav-link" id="stats-tab" data-bs-toggle="tab" data-bs-target="#stats" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Stats</button>
                            <button class="nav-link" id="matches-tab" data-bs-toggle="tab" data-bs-target="#matches" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Matches</button>
                        </div>
                    </nav>
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="overview">
                            <div class="card mt-3">
                                <div class="card-body">
                                    <div class="row row-cols-md-2 row-cols-lg-3">
                                        <div class="col">
                                            <strong>Full Name: </strong><br/><span class="text-nowrap"><%= p.FullName %></span>
                                        </div>
                                        <div class="col">
                                            <strong>Born: </strong><br/><%= p.Dob %>
                                        </div>
                                        <div class="col">
                                            <strong>Current Age: </strong>
                                        </div>
                                        <div class="col">
                                            <strong>Playing Role: </strong><br/><%= p.PlayingRole %>
                                        </div>
                                        <div class="col">
                                            <strong>Batting Style: </strong><br/><%= p.BattingStyle %>
                                        </div>
                                        <div class="col">
                                            <strong>Bowling Style: </strong><br/><%= p.BowlingStyle %>
                                        </div>
                                        <div class="col">
                                            <strong>Debut: </strong><br/><%= p.Debut.ToString("dd MMM yyyy") %>
                                        </div>
                                        <div class="col">
                                            <strong>Caps: </strong><br/><%= p.Caps %>
                                        </div>
                                    </div>
                                    <div class="">
                                        <%= p.Bio %>
                                    </div>

                                </div>
                            </div>
                            <div class="card mt-3">

                                <div class="card-body">
                                    <h5 class="card-title">
                                        Career Stats
                                    </h5>
                                    <div class="">
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
                                    <div class="">
                                        Bowling
                                    </div>
                                    <div id="careerBowlingStatsGrid" class="ag-theme-material player-detail-grid"></div>
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
                        <div role="tabpanel" class="tab-pane" id="stats">

                        </div>
                        <div role="tabpanel" class="tab-pane" id="matches">

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
    <!-- Footer -->
    <CC:Footer ID="Footer1" runat="server"/>
    <!-- ENd Footer -->
</div>
</body>
</html>