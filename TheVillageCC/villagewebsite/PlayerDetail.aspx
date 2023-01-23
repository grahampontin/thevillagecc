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

    <script src="Resources/jQuery/jquery-3.6.0.min.js"></script>
    <script src="Script/jqplot/jquery.jqplot.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.barRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.categoryAxisRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.canvasAxisTickRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.canvasTextRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.enhancedLegendRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.canvasAxisLabelRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.pieRenderer.min.js" type="text/javascript"></script>


    <link href="/CSS/jqplot/jquery.jqplot.min.css" rel="stylesheet" type="text/css" media="screen"/>


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
            // LoadBattingGraph(<%= p.ID %>, 'battingTimeline');
            // LoadBowlingGraph(<%= p.ID %>, 'bowlingEconomyTimeline');
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
                LoadBattingGraph(<%= p.ID %>, selected.val());
            }
        }
        function onBowlingSelectChange(){
            var selected = $("#bowlingChartSelect option:selected");    
            if(selected.val() != 0){
                LoadBowlingGraph(<%= p.ID %>, selected.val());
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
                        <div class="card">
                            <div class="card-body">
                                <div class="row row-cols-md-2 row-cols-lg-3">
                                    <div class="col">
                                        <strong>Full Name: </strong><br/><span class="text-nowrap"><%= p.FullName %></span>
                                    </div>
                                    <div class="col">
                                        <strong>Born: </strong><br/><%= p.DOB %>
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
                        <div class="card">

                            <div class="card-body">
                                <h5 class="card-title">
                                    Career Averages
                                </h5>
                                <div class="">
                                    Batting and Fielding Stats
                                </div>
                                <asp:GridView ID="BattingStats" runat="server" AutoGenerateColumns="False"
                                              CssClass="table table-hover"
                                              onrowdatabound="BattingStats_RowDataBound">
                                    <Columns>
                                        <asp:BoundField HeaderText=""/>
                                        <asp:BoundField HeaderText="Mat"/>
                                        <asp:BoundField HeaderText="Inns"/>
                                        <asp:BoundField HeaderText="NO"/>
                                        <asp:BoundField HeaderText="Runs"/>
                                        <asp:BoundField HeaderText="HS"/>
                                        <asp:BoundField HeaderText="Ave"/>
                                        <asp:BoundField HeaderText="100s"/>
                                        <asp:BoundField HeaderText="50s"/>
                                        <asp:BoundField HeaderText="0s"/>
                                        <asp:BoundField HeaderText="4s"/>
                                        <asp:BoundField HeaderText="6s"/>
                                        <asp:BoundField HeaderText="Ct"/>
                                        <asp:BoundField HeaderText="St"/>
                                        <asp:BoundField HeaderText="RO"/>
                                    </Columns>
                                </asp:GridView>
                                 <div class="panel panel-default">
                                                <div class="panel-heading">
                                                    Batting Analysis
                                                    <div class="floatRight">
                                                        <select id="battingChartSelect">
                                                            <option value="battingTimeline">Timeline (Scores)</option>
                                                            <option value="battingTimelineDismissals">Timeline (Modes of Dismissal)</option>
                                                            <option value="positions">Positions</option>
                                                            <option value="averageBySeason">Ave By Season</option>
                                                            <option value="averageByPosition">Ave By Position</option>
                                                            <option value="scoreBuckets">Score Buckets</option>
                                                            <option value="battingDismissals">Modes of Dismissal</option>
                                                            <option value="scoringTypesTimeline">Scoring Types</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="panel-body">
                                                    <div id="battingChartLoading">
                                                        <div class="ChartLoadingMessage">Computing stats, please wait...</div>
                                                        <div class="ChartLoadingIcon">
                                                            <img src="Images/loading-icon.gif"/>
                                                        </div>
                                
                                                    </div>
                                                    <div id="battingChart">
                                                        <!-- A place holder - gets AJAX filled -->
                                                    </div>
                                                </div>
                                
                                            </div>
                                
                                            <%--Bowling Stats--%>
                                            <div class="panel panel-default">
                                                <div class="panel-heading">
                                                    Bowling Stats
                                                </div>
                                                <asp:GridView ID="BowlingStats" runat="server" AutoGenerateColumns="False"
                                                              CssClass="table table-hover"
                                                              onrowdatabound="BowlingStats_RowDataBound">
                                                    <Columns>
                                                        <asp:BoundField HeaderText=""/>
                                                        <asp:BoundField HeaderText="Mat"/>
                                                        <asp:BoundField HeaderText="Ovs"/>
                                                        <asp:BoundField HeaderText="Runs"/>
                                                        <asp:BoundField HeaderText="Wkts"/>
                                                        <asp:BoundField HeaderText="BBM"/>
                                                        <asp:BoundField HeaderText="Ave"/>
                                                        <asp:BoundField HeaderText="Econ"/>
                                                        <asp:BoundField HeaderText="SR"/>
                                                        <asp:BoundField HeaderText="3"/>
                                                        <asp:BoundField HeaderText="5"/>
                                                        <asp:BoundField HeaderText="10"/>
                                                    </Columns>
                                                </asp:GridView>
                                            </div>
                                
                                            <!--Bowling Graphs-->
                                            <div class="panel panel-default">
                                                <div class="panel-heading">
                                                    Bowling Analysis
                                                    <div class="floatRight">
                                                        <select id="bowlingChartSelect">
                                                            <option value="bowlingEconomyTimeline">Econ Timeline</option>
                                                            <option value="bowlingAverageTimeline">Average Timeline</option>
                                                            <option value="bowlingSRTimeline">Strike Rate Timeline</option>
                                                            <option value="bowlingDismissals">Dismissal Types</option>
                                                            <option value="bowlingBatsmenDismissed">Batsmen Dismissed</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="panel-body">
                                                    <div id="bowlingChartLoading">
                                                        <div class="ChartLoadingMessage">Computing stats, please wait...</div>
                                                        <div class="ChartLoadingIcon">
                                                            <img src="Images/loading-icon.gif"/>
                                                        </div>
                                                    </div>
                                                    <div id="bowlingChart">
                                                        <!-- A place holder - gets AJAX filled -->
                                                    </div>
                                                </div>
                                            </div>
                                
                                
                                
                                
                                
                                
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
</main>
<!-- Footer -->
<CC:Footer ID="Footer1" runat="server"/>
<!-- ENd Footer -->
</div>
</body>
</html>