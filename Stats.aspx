<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Stats.aspx.cs" Inherits="Stats" EnableViewStateMac="false" ViewStateEncryptionMode="Never" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>The Village Cricket Club Online | Stats</title>
    <CC:Styles runat=server ID=styles />    
    
   <script type="text/javascript">
       $(function () {
           $("#tabs").tabs({
               cookie: {},
               ajaxOptions: {
                   error: function (xhr, status, index, anchor) {
                       $(anchor.hash).html("Coming soon...");
                   }
               },
               spinner: '<img src="/img/ajax-loader.gif"/>',
               load: function (event, ui) {
                   $(".spinner").html('');
                   $("#tabs").find("#__VIEWSTATE").remove();
                   $("#TeamsGridView").tablesorter({ sortList: [[0, 0]] });
                   $("#VenuesGridView").tablesorter({ sortList: [[0, 0]] });
                   $("#CaptainsGridView").tablesorter({ sortList: [[0, 0]] });
                   $("#KeepersGridView").tablesorter({ sortList: [[0, 0]] });

                   $("#playersGV").tablesorter({ sortList: [[5, 1]] });


               }
           });
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
            <form runat=server id=StatsForm>
            <div class=PageHeading>Club Statistics</div>
            <div class="ui-widget ui-widget-content">
                 <div class=Centered>
                    <br />
                    <asp:CheckBox ID="LeagueCB" runat="server" Text="League" Checked="True"/>
                    <asp:CheckBox ID="FriendlyCB" runat="server" Text="Friendly" Checked="True" />
                    <asp:CheckBox ID="TourCB" runat="server" Text="Tour" Checked="True" />
                    <asp:CheckBox ID="DeclarationCB" runat="server" Text="Declaration" 
                        Checked="True" />
                    <asp:CheckBox ID="Twenty20CB" runat="server" Checked="True" Text="Twenty20" />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Between:                 
                    <input id="FromDate" class="datePicker" type="text" runat=server/> and <input id="ToDate" class="datePicker" type="text" runat=server/>&nbsp; 
                     at&nbsp;
                     <asp:DropDownList ID="VenuesDropDown" runat="server">
                     </asp:DropDownList>
                     <br />
                    <br />
                    <asp:Button ID="Button1" runat="server" Text="Filter Data" />
                    <br />
                    <br />
                </div>
            </div>
            <div id="tabs">
	            <ul>
		            <li><a href="stats/StatsGrid.Ajax.aspx?Tab=Batting<%=test %>" >Batsmen <span class=spinner></span></a></li>
		            <li><a href="stats/StatsGrid.Ajax.aspx?Tab=Bowling<%=test %>">Bowlers <span class=spinner></span></a></li>
		            <li><a href="stats/StatsGrid.Ajax.aspx?Tab=Teams<%=test %>">Teams <span class=spinner></span></a></li>
		            <li><a href="stats/StatsGrid.Ajax.aspx?Tab=Venues<%=test %>">Grounds <span class=spinner></span></a></li>
		            <li><a href="stats/StatsGrid.Ajax.aspx?Tab=Captains<%=test %>">Captains <span class=spinner></span></a></li>
                    <li><a href="stats/StatsGrid.Ajax.aspx?Tab=Keepers<%=test %>">Keepers <span class=spinner></span></a></li>

	            </ul>
	            
            </div>
            </form>
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>

