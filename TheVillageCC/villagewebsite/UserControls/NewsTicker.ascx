<%@ Control Language="C#" AutoEventWireup="true" CodeFile="NewsTicker.ascx.cs" Inherits="UserControls_NewsTicker" %>
<ul id="news">
    <asp:ListView ID="NewsItems" runat="server">
           <LayoutTemplate>
                    <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
           </LayoutTemplate>

           <ItemTemplate>
              <li><a href="/news.asp"><%# Eval("ShortHeadline")%> - <%# Eval("Teaser")%> (<%# Eval("Date")%>)</a></li>
           </ItemTemplate>
        </asp:ListView>  
</ul>