<%@ Control Language="C#" AutoEventWireup="true" CodeFile="Head.ascx.cs" Inherits="UserControls_Head" %>
<%@ Register TagName="NextFixture" TagPrefix="CC" Src="~/UserControls/NextMatch.ascx" %>
<%@ Register TagName="LastResult" TagPrefix="CC" Src="~/UserControls/LastResult.ascx" %>
<%@ Register TagName="NewsTicker" TagPrefix="CC" Src="~/UserControls/NewsTicker.ascx" %>

<%@ Register TagName="Menu" TagPrefix="CC" Src="~/UserControls/TopMenu.ascx" %>

    

<div id=header>

    <div id=headerLeft>
        <CC:LastResult id="LastResult" runat=server />
    </div>
    <div id=headerCentral>
        <img src="./Images/logo.jpg" />
    </div>
    
    <div id=headerRight>
        <CC:NextFixture ID="NextFixture" runat=server />
    </div>
    <div id=headerMenu>
        <CC:Menu ID="TopMenu" runat="server" />
    </div>
    <div id=newsTicker>
        <div class=ntLatest>Latest:</div>
        <CC:NewsTicker ID=ticker runat="server" />
    </div>

</div>