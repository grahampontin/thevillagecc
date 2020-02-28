<%@ Control Language="C#" AutoEventWireup="true" CodeFile="BowlingScorecard.ascx.cs" Inherits="UserControls_BowlingScorecard" %>

<table class="BowlingScoreCard">
    <tr class="scHeadingRow">
        <td>Bowler</td>
        <td>O</td>
        <td>M</td>
        <td>R</td>
        <td>W</td>
    </tr>
    
    <asp:ListView ID=ScorecardLV runat=server Visible="True" 
        onitemdatabound="ScorecardLV_ItemDataBound">
                <LayoutTemplate>
                    <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
           </LayoutTemplate>

           <ItemTemplate>
              <tr id=TableRow runat=server>
                <td><%#Eval("BowlerName") %></td>
                <td><%#Eval("ReadableOvers") %></td>
                <td><%#Eval("Maidens") %></td>
                <td><%#Eval("Runs") %></td>
                <td><%#Eval("Wickets") %></td>
              </tr>              
           </ItemTemplate>
     </asp:ListView>
                
</table>