<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PublishImages.aspx.cs" Inherits="Secure_PublishImages" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>
<%@ Register TagPrefix="CC" TagName="Security" Src="~/UserControls/Security.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <CC:Security ID=security1 runat=server />
    <title>The Village Cricket Club Online | Publish Images</title>
    <CC:Styles runat=server ID=styles />    
    
</head>
<body>
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
        <form id="form1" runat="server">
            <p>
                The following images are waiting to be published by you. Please note: You must give
                every image a title and commas are not supported in titles. These are the 
                resized images as they will appear in the gallery.</p>
            <asp:ListView ID="Pictures" runat="server" 
                onitemdatabound="Pictures_ItemDataBound">
           <LayoutTemplate>
                    <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
           </LayoutTemplate>

           <ItemTemplate>
              <li><asp:Image ID=Picture runat=server /><br /> Title: <input name=Title /><br /><br /><hr /></li>
           </ItemTemplate>
        </asp:ListView>
        
        <asp:Button ID=PublishImages runat=server onclick="PublishImages_Click" 
                Text="Publish Images" />
        
        </form>
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>
