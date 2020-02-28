<%@ Control Language="C#" AutoEventWireup="true" CodeFile="BattingScorecard.ascx.cs" Inherits="UserControls_BattingScorecard" %>
<table class="table table-striped">
    <tr class="scHeadingRow">
        <td colspan=3></td>
        <td>Runs</td>
        <td>4s</td>
        <td>6s</td>
    </tr>
    <asp:ListView ID=ScorecardLV runat=server Visible="True" 
        onitemdatabound="ScorecardLV_ItemDataBound">
                <LayoutTemplate>
                    <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
           </LayoutTemplate>

           <ItemTemplate>
              <tr id=TableRow runat=server>
                <td><%#Eval("PlayerName") %> <asp:Literal ID=CaptainWK runat=server></asp:Literal></td>
                <td><%#Eval("FieldingDismissalText") %></td>
                <td><%#Eval("BowlingDismissalText") %></td>
                <td><%#Eval("Score") %></td>
                <td><%#Eval("Fours") %></td>
                <td><%#Eval("Sixes") %></td>
                
              </tr>              
           </ItemTemplate>
     </asp:ListView>
                <tr class="scExtrasRow">
                    <td>(Frank) Extras</td>
                    <td></td>
                    <td><asp:Literal ID=ExtrasDetail runat=server></asp:Literal></td>
                    <td><asp:Literal ID=ExtrasTotal runat=server></asp:Literal></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr class="scTotalRow">
                    <td>Total</td>
                    <td></td>
                    <td><asp:Literal ID=WicketsText runat=server></asp:Literal></td>
                    <td><asp:Literal ID=TotalScore runat=server></asp:Literal></td>
                    <td colspan=2>(<asp:Literal ID=Overs runat=server></asp:Literal> ovs)</td>
                    
                </tr>
</table>