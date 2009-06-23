<%@ Control Language="C#" AutoEventWireup="true" CodeFile="FoWScorecard.ascx.cs" Inherits="UserControls_FoWScorecard" %>

<table class="BowlingScoreCard">
    <tr class="scHeadingRow">
        <td colspan=2>Fall of Wicket</td>
        
    </tr>
    
    <asp:ListView ID=ScorecardLV runat=server Visible="True" 
        onitemdatabound="ScorecardLV_ItemDataBound">
                <LayoutTemplate>
                    <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
           </LayoutTemplate>

           <ItemTemplate>
              <tr id=TableRow runat=server>
                <td><%#Eval("Score")%></td>
                <td><%#Eval("OutgoingBatsman")%></td>
              </tr>              
           </ItemTemplate>
           <EmptyDataTemplate>
            <tr>
                <td colspan=2 class=scOddRow>
                    No data recorded
                </td>
            </tr>
           </EmptyDataTemplate>
     </asp:ListView>
                
</table>