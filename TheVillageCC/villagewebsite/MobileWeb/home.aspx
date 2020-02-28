<%@ Page Title="" Language="C#" MasterPageFile="mobile.master" %>
<asp:Content runat="server" ID="Head" ContentPlaceHolderID="head"></asp:Content>
<asp:Content runat="server" ID="Page" ContentPlaceHolderID="page_content">

<div data-role="header">
    <h1>VCC Mobile Web</h1>
</div><!-- /header -->

<div data-role="content">	
		<ul data-role="listview" data-inset="true">
            <li><a href="Chat/chat.aspx">Chat</a></li>
            <li><a href="BallByBall/SelectMatch.aspx">Ball By Ball</a></li>
            <li><a href="/home.aspx?mobileRedirect=false">Main Website</a></li>
        </ul>
</div><!-- /content -->


</asp:Content>
