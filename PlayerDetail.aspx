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

    <title>The Village Cricket Club Online | Squad | <%=PlayerName %></title>
    <CC:Styles runat=server ID=styles />   
    <!--[if IE]><script language="javascript" type="text/javascript" src="Script/excanvas.min.js"></script><![endif]-->

    <script src="Script/jqplot/jquery.jqplot.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.barRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.categoryAxisRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.canvasAxisTickRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.canvasTextRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.enhancedLegendRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.canvasAxisLabelRenderer.min.js" type="text/javascript"></script>
    <script src="Script/jqplot/plugins/jqplot.pieRenderer.min.js" type="text/javascript"></script>


    <link href="/CSS/jqplot/jquery.jqplot.min.css" rel="stylesheet" type="text/css" media="screen" />


    <script language=javascript>
       
        $(function () {
            $('#fromDate').datetimepicker({
                defaultDate: new Date(new Date().getUTCFullYear(), 3, 1),
                format: 'DD MMMM YYYY'
            });
            $('#toDate').datetimepicker({
                defaultDate: new Date(new Date().getUTCFullYear()+1, 3, 1),
                format: 'DD MMMM YYYY'
            });

            $(".StatsTable tr:last").addClass('Bold');
            $("#FilterButton").button();
            $("#battingChartSelect").change(onBattingSelectChange);
            $("#bowlingChartSelect").change(onBowlingSelectChange);
            LoadBattingGraph(<%=p.ID %>, 'battingTimeline');
            LoadBowlingGraph(<%=p.ID %>, 'bowlingEconomyTimeline');
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
                LoadBattingGraph(<%=p.ID %>, selected.val());
            }
        }
        function onBowlingSelectChange(){
            var selected = $("#bowlingChartSelect option:selected");    
            if(selected.val() != 0){
                LoadBowlingGraph(<%=p.ID %>, selected.val());
            }
        }

    </script>
</head>
<body>
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
        <form id="form1" runat="server" class="form-horizontal">
                <h1 ><%=PlayerName %>&nbsp;<small>Player Profile</small></h1>
                <div class="col-sm-3">
                    <div class=playerProfileImageLarge>
                        <asp:Image ID=PlayerImage Width=220 Height=124 runat=server />
                    </div>
                    <div class="playerProfileStats">
                        <div class=playerProfileStat>
                            <strong>Full Name: </strong><br/><%=p.FullName %>
                        </div>
                        <div class=playerProfileStat>
                            <strong>Born: </strong><br /><%=p.DOB %>
                        </div>
                        <div class=playerProfileStat>
                            <strong>Current Age: </strong>
                        </div>
                        <div class=playerProfileStat>
                            <strong>Education: </strong><br /><%=p.Education %>
                        </div>
                        <div class=playerProfileStat>
                            <strong>Nickname: </strong><br /><%=p.Nickname %>
                        </div>
                        <div class=playerProfileStat>
                            <strong>Playing Role: </strong><br/><%=p.PlayingRole %>
                        </div>
                        <div class=playerProfileStat>
                            <strong>Batting Style: </strong><br /><%=p.BattingStyle %>
                        </div>
                        <div class=playerProfileStat>
                            <strong>Bowling Style: </strong><br /><%=p.BowlingStyle %>
                        </div>
                        <div class=playerProfileStat>
                            <strong>Debut: </strong><br /><%=p.Debut.ToString("dd MMM yyyy") %>
                        </div>
                        <div class=playerProfileStat>
                            <strong>Caps: </strong><br /><%=p.Caps %>
                        </div>
                    </div>
                    <div class="playerProfileStat">
                        <a href="javascript:EditPlayer(<%=p.ID %>,'<%=p.FullName %>')">Edit player details...</a>
                    </div>
                    
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Filter Data&nbsp;<small>(coming soon)</small>
                        </div>
                        <div class="panel-body">
                            <div class="form-group" style="padding-left: 10px; padding-right: 10px;">
                                <label>From</label>
                                <div class='input-group date datepicker' id='fromDate'>
                                <input type='text' class="form-control" />
                                <span class="input-group-addon">
                                    <span class="glyphicon glyphicon-calendar"></span>
                                </span>
                            </div>
                            </div>
                            <div class="form-group" style="padding-left: 10px; padding-right: 10px;">
                                <label>To</label>
                                <div class='input-group date datepicker' id='toDate'>
                                <input type='text' class="form-control" />
                                <span class="input-group-addon">
                                    <span class="glyphicon glyphicon-calendar"></span>
                                </span>
                            </div>
                            <div class="form-group" style="padding-left: 10px; padding-right: 10px;">
                                <label class=>At</label>
                                <asp:DropDownList ID=VenuesList runat=server CssClass="form-control"></asp:DropDownList>
                            </div>
                            <button id=FilterButton name="Go" class="btn btn-default"><span>Apply</span></button>
                        </div>
                        
                    </div>   
                    
                </div> 
                </div>
                <div class="col-sm-9">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Biography
                        </div>
                        <div class="panel-body">
                            <%=p.Bio %>
                        </div>
                    </div>
                
                    <%--Batting Stats--%>
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Batting and Fielding Stats
                        </div>
                        <asp:GridView ID=BattingStats runat=server AutoGenerateColumns="False" 
                            CssClass="table table-hover" 
                            onrowdatabound="BattingStats_RowDataBound">
                            <Columns>
                                <asp:BoundField HeaderText="" />
                                <asp:BoundField HeaderText="Mat" />
                                <asp:BoundField HeaderText="Inns" />
                                <asp:BoundField HeaderText="NO" />
                                <asp:BoundField HeaderText="Runs" /> 
                                <asp:BoundField HeaderText="HS" />
                                <asp:BoundField HeaderText="Ave" />
                                <asp:BoundField HeaderText="100s" />
                                <asp:BoundField HeaderText="50s" />
                                <asp:BoundField HeaderText="0s" />
                                <asp:BoundField HeaderText="4s" />
                                <asp:BoundField HeaderText="6s" />
                                <asp:BoundField HeaderText="Ct" />
                                <asp:BoundField HeaderText="St" />
                                <asp:BoundField HeaderText="RO" />
                            </Columns>
                        </asp:GridView>
                    </div>
                    
                    <!--Batting Graphs-->
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Batting Analysis
                            <div class=floatRight>
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
                                <div class='ChartLoadingMessage'>Computing stats, please wait...</div>
                                <div class='ChartLoadingIcon'><img src='Images/loading-icon.gif' /></div>

                            </div>
                            <div id=battingChart>
                                <!-- A place holder - gets AJAX filled -->
                            </div>    
                        </div>
                        
                    </div>
                    
                    <%--Bowling Stats--%>
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Bowling Stats
                        </div>
                            <asp:GridView ID=BowlingStats runat=server AutoGenerateColumns="False" 
                                CssClass="table table-hover" 
                                onrowdatabound="BowlingStats_RowDataBound">
                                <Columns>
                                    <asp:BoundField HeaderText="" />
                                    <asp:BoundField HeaderText="Mat" />
                                    <asp:BoundField HeaderText="Ovs" />
                                    <asp:BoundField HeaderText="Runs" />
                                    <asp:BoundField HeaderText="Wkts" />
                                    <asp:BoundField HeaderText="BBM" />
                                    <asp:BoundField HeaderText="Ave" />
                                    <asp:BoundField HeaderText="Econ" />
                                    <asp:BoundField HeaderText="SR" />
                                    <asp:BoundField HeaderText="3" />
                                    <asp:BoundField HeaderText="5" />
                                    <asp:BoundField HeaderText="10" />
                                </Columns>
                            </asp:GridView>    
                    </div>
                    
                    <!--Bowling Graphs-->
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Bowling Analysis
                            <div class=floatRight>
                                <select id = "bowlingChartSelect">
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
                                <div class='ChartLoadingMessage'>Computing stats, please wait...</div>
                                <div class='ChartLoadingIcon'><img src='Images/loading-icon.gif' /></div>
                            </div>
                            <div id=bowlingChart>
                                <!-- A place holder - gets AJAX filled -->
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


