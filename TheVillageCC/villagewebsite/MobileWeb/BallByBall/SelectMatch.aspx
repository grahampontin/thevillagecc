<%@ Page Title="" Language="C#" MasterPageFile="~/MobileWeb/mobile.master" AutoEventWireup="true" CodeFile="SelectMatch.aspx.cs" Inherits="MobileWeb_BallByBall_SelectMatch" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">

</asp:Content>

<asp:Content ID="Content4" ContentPlaceHolderID="page_name" Runat="Server">selectMatch</asp:Content>


<asp:Content ID="Content2" ContentPlaceHolderID="page_content" Runat="Server">
     <div data-role="header" data-position="fixed">
        <h1>Select Match</h1>
    </div><!-- /header -->
    
    <div data-role="content">
        <asp:ListView ID="InProgressMatchesListViewBatting" runat="server">
            <LayoutTemplate>
                <ul data-role="listview" data-inset="true">
                    <li data-role="list-divider">In-Progress Matches (VCC Batting)</li>
                    <li runat="server" id="itemPlaceholder" ></li>
                </ul>
            </LayoutTemplate>
            <ItemTemplate>
               <li><a href="NewOver.aspx"  data-transition="slide" onclick="setMatchId(<%#Eval("ID") %>)"><%#Eval("Opposition") %> (<%#Eval("BallByBallOver")%> ovs)</a></li> 
            </ItemTemplate>  
            <EmptyDataTemplate>
                <ul data-role="listview" data-inset="true">
                    <li data-role="list-divider">In-Progress Matches (VCC Batting)</li>
                    <li>None</li>
                </ul>
            </EmptyDataTemplate>     
        </asp:ListView>
        
        <asp:ListView ID="InProgressMatchesListViewBowling" runat="server">
            <LayoutTemplate>
                <ul data-role="listview" data-inset="true">
                    <li data-role="list-divider">In-Progress Matches (VCC Bowling)</li>
                    <li runat="server" id="itemPlaceholder" ></li>
                </ul>
            </LayoutTemplate>
            <ItemTemplate>
               <li><a href="OppositionInnings.aspx" onclick="setMatchId(<%#Eval("ID") %>)"><%#Eval("Opposition") %> (<%#Eval("OppositionBallByBallOver")%> ovs)</a></li> 
            </ItemTemplate>  
            <EmptyDataTemplate>
                <ul data-role="listview" data-inset="true">
                    <li data-role="list-divider">In-Progress Matches (VCC Bowling)</li>
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
               <li><a href="SelectTeam.aspx" onclick="setMatchId(<%#Eval("ID") %>)"><%#Eval("Opposition") %> (<%#Eval("MatchDateString")%>)</a></li> 
            </ItemTemplate>       
        </asp:ListView>
    </div>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="postPageScripts" Runat="Server">
</asp:Content>


