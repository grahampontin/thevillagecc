<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Fixtures.aspx.cs" Inherits="Fixtures" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html lang="en">
<head runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>The Village Cricket Club Online | Fixtures</title>
    <CC:Styles runat=server ID=styles />    
    <link href="http://addtocalendar.com/atc/1.5/atc-style-blue.css" rel="stylesheet" type="text/css">
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

    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
            <h1>Fixtures</h1>
        <form id="form1" runat="server">
             <asp:ListView ID="FixturesListView" runat="server" 
                 onitemdatabound="FixturesListView_ItemDataBound">
           <LayoutTemplate>
            <table id=fixtureTable class="table table-striped">
                    
                        <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
                    
            </table>
           </LayoutTemplate>

           <ItemTemplate>
             <tr>
                <td><%#Eval("MatchDateString") %></td>
                <td id=HomeTeam runat=server><%#Eval("HomeTeamName") %></td>
                <td>vs</td>
                <td id=AwayTeam runat=server> <%#Eval("AwayTeamName") %></td>
                <td>at</td>
                <td><%#Eval("VenueName") %></td>
                <td>(<%#Eval("Type") %>)</td>
                <td>    
                    <span class="addtocalendar">
                        <a class="atcb-link"><img src="/img/cal-bw-01.png" width="24"></a> <!-- You can change button title by adding this line -->
                        <var class="atc_event">
                            <var class="atc_date_start"><%#Eval("MatchDateStartString") %></var>
                            <var class="atc_date_end"><%#Eval("MatchDateEndString") %></var>
                            <var class="atc_timezone">Europe/London</var>
                            <var class="atc_title"><%#Eval("HomeTeamName") %> vs <%#Eval("AwayTeamName") %></var>
                            <var class="atc_description"><%#Eval("HomeTeamName") %> vs <%#Eval("AwayTeamName") %> at <%#Eval("VenueName") %></var>
                            <var class="atc_location"><%#Eval("VenueName") %></var>
                            <var class="atc_organizer">The Village CC</var>
                            <var class="atc_organizer_email">thevillagecc@gmail.com</var>
                        </var>
                    </span>

                </td>
                
            </tr>
           </ItemTemplate>
        </asp:ListView>  
        </form>
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>
