<%@ Control Language="C#" AutoEventWireup="true" CodeFile="TopMenu.ascx.cs" Inherits="UserControls_TopMenu" %>
        <nav class="navbar navbar-default">   
            <div class="container-fluid"> 
            <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
                <a class="navbar-brand visible-xs" style="padding: 0;"><img src="/Images/logo_transparent.png" height="50px"/></a>
            </div>    
            <div id="navbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav">
	                <li runat=server id="Home"      ><a href="/" title=" " >Home</a></li>
	                <li runat=server id="Awards"    ><a href="/Awards.aspx" title=" ">Info & Awards</a></li>
	                <li runat=server id="Fixtures"  ><a href="/Fixtures.aspx" title="Fixtures" >Fixtures</a></li>
	                <li runat=server id="Results"   ><a href="/Results.aspx" title=" " >Results</a></li>
	                <li runat=server id="Tours"     ><a href="/Tours.aspx" title="Cisk fueled fun">Tours</a></li>
	                <li runat=server id="Committee" ><a href="/Committee.aspx" title="Committee & Official Docs" >Committee</a></li>
	                <li runat=server id="Players"   ><a href="/Players.aspx" title="Player Stats">Squad</a></li>
                    <li runat=server id="Stats"     ><a href="/Stats.aspx" title=" ">Stats</a></li>
	                <li runat=server id="News"      ><a href="/News.aspx" title=" ">News</a></li>
	                <li runat=server id="Chat"      ><a href="/Chat.aspx" title="Chat">Chat</a></li>
	                <li runat=server id="Join"      ><a href="/Join.aspx" title="Interested in Joining?" >Join</a></li>
	                <li runat=server id="Shop"      ><a href="/Shop.aspx" title="Buy Village kit online!">Shop!</a></li>
	                <li runat=server id="Admin"     ><a href="/Admin.aspx" title=" ">Admin</a></li>
	            </ul>
            </div>
            </div>
        </nav>
	    