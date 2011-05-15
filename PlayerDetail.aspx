<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PlayerDetail.aspx.cs" Inherits="PlayerDetail" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">

<head id="Head1" runat="server">
    <title>The Village Cricket Club Online | Squad | <%=PlayerName %></title>
    <CC:Styles runat=server ID=styles />   
    <!--[if IE]><script language="javascript" type="text/javascript" src="Script/excanvas.min.js"></script><![endif]-->

    <script src="Script/jquery.flot.js" type="text/javascript"></script>
    <script src="Script/jquery.flot.stack.js" type="text/javascript"></script>

    <script language=javascript>
    $(function () {
        $(".StatsTable tr:last").addClass('Bold');
        $("#FilterButton").button();
        });
        
        $(function () {
    var d1 = [];
    for (var i = 0; i <= 10; i += 1)
        d1.push([i, parseInt(Math.random() * 30)]);
 
    var d2 = [];
    for (var i = 0; i <= 10; i += 1)
        d2.push([i, parseInt(Math.random() * 30)]);
 
    var d3 = [];
    for (var i = 0; i <= 10; i += 1)
        d3.push([i, parseInt(Math.random() * 30)]);
 
    var stack = 0, bars = true, lines = false, steps = false;
    
    function plotWithOptions() {
        $.plot($("#placeholder"), [ d1, d2, d3 ], {
            series: {
                "stack": "stack",
                "bars": { "show": "bars", "barWidth": 0.6 }
            }
        });
    }
 
    plotWithOptions();
});
        
    </script>
</head>
<body>
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
        <form id="form1" runat="server">
            <div class="WidgetContainer ui-widget ui-widget-content">
                <div class="WidgetTitleBlock ui-widget-header ui-helper-clearfix"><%=PlayerName %></div>
                <div class="WidgetColumnLeft PlayerDetailsLeftColumn">
                    <div class=playerProfileImageLarge>
                        <asp:Image ID=PlayerImage Width=220 Height=124 runat=server />
                    </div>
                    <div class="playerProfileStats">
                        <div class=playerProfileStat>
                            <span>Full Name: </span><%=p.FullName %>
                        </div>
                        <div class=playerProfileStat>
                            <span>Born: </span><%=p.DOB %>
                        </div>
                        <div class=playerProfileStat>
                            <span>Current Age: </span>
                        </div>
                        <div class=playerProfileStat>
                            <span>Education: </span><%=p.Education %>
                        </div>
                        <div class=playerProfileStat>
                            <span>Nickname: </span><%=p.Nickname %>
                        </div>
                        <div class=playerProfileStat>
                            <span>Playing Role: </span><%=p.PlayingRole %>
                        </div>
                        <div class=playerProfileStat>
                            <span>Batting Style: </span><%=p.BattingStyle %>
                        </div>
                        <div class=playerProfileStat>
                            <span>Bowling Style: </span><%=p.BowlingStyle %>
                        </div>
                        <div class=playerProfileStat>
                            <span>Debut: </span><%=p.Debut.ToString("dd MMM yyyy") %>
                        </div>
                        <div class=playerProfileStat>
                            <span>Caps: </span><%=p.Caps %>
                        </div>
                    </div>
                    <div class="playerProfileStat">
                        <a href="javascript:EditPlayer(<%=p.ID %>,'<%=p.FullName %>')">Edit player details...</a>
                    </div>
                    
                    <div class="WidgetContainer ui-widget ui-widget-content">
                        <div class="WidgetTitleBlock ui-widget-header ui-helper-clearfix">
                            Filter Data
                        </div>
                        From<br /> <input id=FromDate class="datePicker" /><br /><br />
                        To<br /> <input id=ToDate class="datePicker" /><br /><br />
                        At<br /><asp:DropDownList ID=VenuesList runat=server></asp:DropDownList><br /><br />
                        <button id=FilterButton name="Go"><span>Go</span></button>
                        
                    </div>   
                    
                </div>
                <div class="WidgetColumnRight PlayerDetailsRightColumn">
                    <div class="WidgetContainer ui-widget ui-widget-content">
                        <div class="WidgetTitleBlock ui-widget-header ui-helper-clearfix">
                            Biography
                        </div>
                        <%=p.Bio %>
                    </div>
                
                    <%--Batting Stats--%>
                    <div class="WidgetContainer ui-widget ui-widget-content">
                        <div class="WidgetTitleBlock ui-widget-header ui-helper-clearfix">
                            Batting and Fielding Stats
                        </div>
                        <asp:GridView ID=BattingStats runat=server AutoGenerateColumns="False" 
                            CssClass="StatsTable" GridLines="None" 
                            onrowdatabound="BattingStats_RowDataBound">
                            <RowStyle CssClass="underlined_row" />
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
                            <HeaderStyle CssClass="ui-state-default" />
                            
                        </asp:GridView>
                    </div>
                    
                    <!--Batting Graphs-->
                    <div class="WidgetContainer ui-widget ui-widget-content">
                        <div class="WidgetTitleBlock ui-widget-header ui-helper-clearfix">
                            Batting Analysis
                            <div class=floatRight>
                                <select>
                                    <option>Timeline (Scores)</option>
                                    <option>Timeline (Modes of Dismissal)</option>
                                    <option>Positions</option>
                                    <option>Score Buckets</option>
                                    <option>Modes of Dismissal</option>
                                    <option>Scoring Types</option>
                                </select>
                            </div>
                        </div>
                        Graph Loads Here
                        <div id=placeholder style="height:200px"></div>
                    </div>
                    
                    <%--Bowling Stats--%>
                    <div class="WidgetContainer ui-widget ui-widget-content">
                        <div class="WidgetTitleBlock ui-widget-header ui-helper-clearfix">
                            Bowling Stats
                        </div>
                        <asp:GridView ID=BowlingStats runat=server AutoGenerateColumns="False" 
                            CssClass="StatsTable" GridLines="None" 
                            onrowdatabound="BowlingStats_RowDataBound">
                            <RowStyle CssClass="underlined_row" />
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
                            <HeaderStyle CssClass="ui-state-default" />
                            
                        </asp:GridView>
                    </div>
                    
                    <!--Bowling Graphs-->
                    <div class="WidgetContainer ui-widget ui-widget-content">
                        <div class="WidgetTitleBlock ui-widget-header ui-helper-clearfix">
                            Bowling Analysis
                            <div class=floatRight>
                                <select>
                                    <option>Timeline (Wickets)</option>
                                    <option>Timeline (Runs)</option>
                                    <option>Dismissal Types</option>
                                </select>
                            </div>
                        </div>
                        Graph Loads Here
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


