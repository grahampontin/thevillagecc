﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Results.aspx.cs" Inherits="Results" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>The Village Cricket Club Online | Results</title>
    <CC:Styles runat=server ID=styles />    
    
</head>
<body>
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
            <div class=PageHeading><a class="SmallLink" href=Results.aspx?season=<asp:Literal runat=server ID=PrevResultsYear></asp:Literal>> << previous</a> Season <asp:Literal runat=server ID=ResultsYear></asp:Literal> <a class="SmallLink" href=Results.aspx?season=<asp:Literal runat=server ID=NextResultsYear></asp:Literal>>next >></a></div>
        <form id="form1" runat="server">
             <asp:ListView ID="FixturesListView" runat="server" 
                 onitemdatabound="FixturesListView_ItemDataBound">
           <LayoutTemplate>
            <table id=resultsTable class=fullWidth>
                    
                        <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
                    
            </table>
           </LayoutTemplate>

           <ItemTemplate>
             <tr>
                <td><%#Eval("MatchDateString") %></td>
                <td id=HomeTeam runat=server><%#Eval("HomeTeamName") %> (<%#Eval("HomeTeamScore") %>)</td>
                <td align=center><a href=MatchReport.aspx?MatchID=<%#Eval("ID") %>><%#Eval("ResultText") %></a></td>
                <td id=AwayTeam runat=server> <%#Eval("AwayTeamName") %> (<%#Eval("AwayTeamScore") %>)</td>
                <td><%#Eval("ResultMargin") %></td>
                <td>at</td>
                <td><%#Eval("VenueName") %></td>
                <td align=center>(<%#Eval("Type") %>)</td>
                
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