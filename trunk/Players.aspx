<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Players.aspx.cs" Inherits="Players" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>The Village Cricket Club Online | Players</title>
    <CC:Styles runat=server ID=styles />    
    <script type="text/javascript">
    $(document).ready(function()     
           {
             $("#playersGV").tablesorter( {sortList: [[7,1]], widgets: ['zebra']} );     
            } 
            );
</script>
</head>
<body>
        <form id="form1" runat="server">
        
    <div id="pageContainer">
        <!-- Head -->
               
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer>
            
        </div>
        <div id="mainContent">
        
            <div class=Centered>
                <br />
                <asp:RadioButton ID="BattingCB" runat="server" Checked="True" Text="Batting" GroupName=BatBowl />
                <asp:RadioButton ID="BowlingCB" runat="server" Checked="False" Text="Bowling" GroupName=BatBowl />
                <br />
                <br />
                <asp:CheckBox ID="LeagueCB" runat="server" Text="League" Checked="True"/>
                <asp:CheckBox ID="FriendlyCB" runat="server" Text="Friendly" Checked="True" />
                <asp:CheckBox ID="TourCB" runat="server" Text="Tour" Checked="True" />
                <asp:CheckBox ID="DeclarationCB" runat="server" Text="Declaration" 
                    Checked="True" />
                <asp:CheckBox ID="Twenty20CB" runat="server" Checked="True" Text="Twenty20" />
                <br />
                <br />
                Between:                 
                <input id="FromDate" type="text" runat=server/> and <input id="ToDate" type="text" runat=server/><br />
                <br />
                <asp:Button ID="Button1" runat="server" Text="Filter Data" />
                <br />
                <br />
            </div>
            
            <div class=horizontalDivider></div>
            
            <asp:GridView ID=playersGV runat=server AutoGenerateColumns="False" 
                onrowdatabound="playersGV_RowDataBound">
                <Columns>
                    <asp:BoundField HeaderText="No." >
                        <HeaderStyle HorizontalAlign="Left" />
                    </asp:BoundField>
                    <asp:BoundField DataField="Name" HeaderText="Name" ReadOnly="True" 
                        SortExpression="Name" />
                    <asp:BoundField HeaderText="Bats" />
                    <asp:BoundField HeaderText="Mat" />
                    <asp:BoundField HeaderText="Inns" />
                    <asp:BoundField HeaderText="NO" />
                    <asp:BoundField HeaderText="Ovs" />
                    <asp:BoundField HeaderText="Runs" />
                    <asp:BoundField HeaderText="Wkts" />
                    <asp:BoundField HeaderText="HS" />
                    <asp:BoundField HeaderText="BBM" />
                    <asp:BoundField HeaderText="Ave" />
                    <asp:BoundField HeaderText="100s" />
                    <asp:BoundField HeaderText="50s" />
                    <asp:BoundField HeaderText="4s" />
                    <asp:BoundField HeaderText="6s" />
                    <asp:BoundField HeaderText="Ct" />
                    <asp:BoundField HeaderText="St" />
                    <asp:BoundField HeaderText="RO" />
                    <asp:BoundField HeaderText="Econ" />
                    <asp:BoundField HeaderText="SR" />
                    <asp:BoundField HeaderText="3fers" />
                    <asp:BoundField HeaderText="5fers" />
                </Columns>
            </asp:GridView>
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
        </form>
        </body>
</html>
