<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="SelectMatch.aspx.cs" Inherits="MobileWeb_BallByBall_SelectMatch" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
     <div data-role="header">
        <h1>Select Match</h1>
    </div><!-- /header -->
    
    <div data-role="content">
        <asp:ListView ID="InProgressMatchesListView" runat="server">
            <LayoutTemplate>
                <ul data-role="listview" data-inset="true">
                    <li data-role="list-divider">In-Progress Matches</li>
                    <li runat="server" id="itemPlaceholder" ></li>
                </ul>
            </LayoutTemplate>
            <ItemTemplate>
               <li><a href="BallByBall.aspx?matchId=<%#Eval("ID") %>" onclick=""><%#Eval("Opposition") %> (<%#Eval("BallByBallOver")%> ovs)</a></li> 
            </ItemTemplate>  
            <EmptyDataTemplate>
                <ul data-role="listview" data-inset="true">
                    <li data-role="list-divider">In-Progress Matches</li>
                    <li>None</li>
                </ul>
            </EmptyDataTemplate>     
        </asp:ListView>
        
        <asp:ListView ID="FutureMatchesListView" runat="server">
            <LayoutTemplate>
                <ul data-role="listview" data-inset="true">
                    <li data-role="list-divider">Future Matches</li>
                    <li runat="server" id="itemPlaceholder" ></li>
                </ul>
            </LayoutTemplate>
            <ItemTemplate>
               <li><a href="SelectTeam.aspx?matchId=<%#Eval("ID") %>" onclick=""><%#Eval("Opposition") %> (<%#Eval("MatchDateString")%>)</a></li> 
            </ItemTemplate>       
        </asp:ListView>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="postPageScripts" Runat="Server">
</asp:Content>


