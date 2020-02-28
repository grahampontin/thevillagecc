<%@ Control Language="C#" AutoEventWireup="true" CodeFile="Head.ascx.cs" Inherits="UserControls_Head" %>
<%@ Register TagName="NextFixture" TagPrefix="CC" Src="~/UserControls/NextMatch.ascx" %>
<%@ Register TagName="LastResult" TagPrefix="CC" Src="~/UserControls/LastResult.ascx" %>
<%@ Register TagName="NewsTicker" TagPrefix="CC" Src="~/UserControls/NewsTicker.ascx" %>
<%@ Register TagName="Interactive" TagPrefix="CC" Src="~/UserControls/InteractiveFooter.ascx" %>


<%@ Register TagName="Menu" TagPrefix="CC" Src="~/UserControls/TopMenu.ascx" %>

    

<div id=header>

    <div id=headerLeft class="hidden-xs">
        <CC:LastResult id="LastResult" runat=server />
    </div>
    <div id=headerCentral class="hidden-xs">
        <img src="/Images/logo.jpg" />
    </div>
    
    <div id=headerRight class="hidden-xs">
        <CC:NextFixture ID="NextFixture" runat=server />
    </div>
    <div id=headerMenu>
        <CC:Menu ID="TopMenu" runat="server" />
    </div>
    <div id=newsTicker class="hidden-xs">
        <div class=ntLatest>Latest:</div>
        <CC:NewsTicker ID=ticker runat="server" />
    </div>

</div>
<%--<CC:Interactive runat=server ID=interactive />--%>