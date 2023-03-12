<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Fixtures.aspx.cs" Inherits="Fixtures" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <title>The Village Cricket Club Online | Fixtures</title>
    <CC:Styles runat=server ID=styles />
    <script type="text/javascript" src="https://addevent.com/libs/atc/1.6.1/atc.min.js" async defer></script>
</head>
<body>
<script type="text/javascript">(function () {
            if (window.addtocalendar)if(typeof window.addtocalendar.start == "function")return;
            if (window.ifaddtocalendar == undefined) { window.ifaddtocalendar = 1;
                var d = document, s = d.createElement('script'), g = 'getElementsByTagName';
                s.type = 'text/javascript';s.charset = 'UTF-8';s.async = true;
                s.src = ('https:' == window.location.protocol ? 'https' : 'http')+'://addtocalendar.com/atc/1.5/atc.min.js';
                var h = d[g]('body')[0];h.appendChild(s); }})();
    </script>

<div class="">
    <!-- Head -->
    <CC:Header ID="Header1" runat=server />
    <!-- End Head -->
    <main class="container">
        <h1>Fixtures</h1>
        <form id="form1" runat="server">
            <asp:ListView ID="FixturesListView" runat="server"
                          onitemdatabound="FixturesListView_ItemDataBound">
                <LayoutTemplate>
                    <table id=fixtureTable class="table table-striped">
                        <thead class="d-none d-md-table-head">
                        <th></th><th class="d-none d-md-table-cell">Home</th><th></th><th class="d-none d-md-table-cell">Away</th><th></th><th>Venue</th><th></th><th class="d-none d-md-table-cell"></th>
                        </thead>
                        <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>

                    </table>
                </LayoutTemplate>

                <ItemTemplate>
                    <tr>
                        <td class="d-md-none">
                            <table>
                                <tr>
                                    <td><h6><%#Eval("HomeTeamName") %> vs <%#Eval("AwayTeamName") %></h6></td>
                                </tr>
                                <tr>
                                    <td><i><%#Eval("MatchDateString") %> at <%#Eval("VenueName") %></i></td>
                                </tr>
                            </table>
                        </td>
                        <td class="d-none d-md-table-cell"><%#Eval("MatchDateString") %></td>
                        <td class="d-none d-md-table-cell" id=HomeTeam runat=server><%#Eval("HomeTeamName") %></td>
                        <td class="d-none d-md-table-cell">vs</td>
                        <td class="d-none d-md-table-cell" id=AwayTeam runat=server> <%#Eval("AwayTeamName") %></td>
                        <td class="d-none d-md-table-cell">at</td>
                        <td class="d-none d-md-table-cell"><%#Eval("VenueName") %></td>
                        <td class="d-none d-md-table-cell">(<%#Eval("Type") %>)</td>
                        <td>
                            <div title="Add to Calendar" class="addeventatc">
                                Add
                                <span class="start"><%#Eval("MatchDateString") %> 12:00</span>
                                <span class="end"><%#Eval("MatchDateString") %> 23:00</span>
                                <span class="timezone">United Kingdom/London</span>
                                <span class="title"><%#Eval("HomeTeamName") %> vs <%#Eval("AwayTeamName") %></span>
                                <span class="description"><%#Eval("HomeTeamName") %> vs <%#Eval("AwayTeamName") %> at <%#Eval("VenueName") %> </span>
                                <span class="location"><%#Eval("VenueName") %></span>
                            </div>
                        </td>
                    </tr>
                </ItemTemplate>
            </asp:ListView>
        </form>
    </main>
    <!-- Footer -->
    <CC:Footer ID="Footer1" runat="server" />
    <!-- ENd Footer -->
</div>
</body>
</html>