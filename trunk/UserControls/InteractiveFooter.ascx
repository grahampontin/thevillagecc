<%@ Control Language="C#" AutoEventWireup="true" CodeFile="InteractiveFooter.ascx.cs" Inherits="UserControls_InteractiveFooter" %>
<div id=InteractiveFooter>
    <div id=InteractiveUserName>
        <asp:Literal ID=LoggedOnUserName runat=server></asp:Literal>
    </div>
    
    <div class=InteractiveFooterLink>
        <asp:HyperLink ID=MyAccountLink runat=server></asp:HyperLink>
    </div>
    <div class=InteractiveFooterLink>
        <asp:Button ID=SignInOut runat=server onclick="SignInOut_Click"></asp:Button>
    </div>
    
    <div id=InteractiveNotifications>
        No New Notifications
    </div>
</div>