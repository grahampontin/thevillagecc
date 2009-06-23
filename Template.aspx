<%@ Page Language="C#" AutoEventWireup="true"  CodeFile="Template.aspx.cs" Inherits="_Template" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Home</title>
    
    <link href="~/CSS/reset.css" rel="stylesheet" type="text/css" media="screen" />
    <link href="~/CSS/base.css" rel="stylesheet" type="text/css" media="screen" />
    <link href="~/CSS/default.css" rel="stylesheet" type="text/css" media="screen" />
    <link href="~/CSS/menu.css" rel="stylesheet" type="text/css" media="screen" />
    
    <script language="javascript" src="Script/jquery-1.2.6.js" type="text/javascript"></script>
    <script language="javascript" src="Script/jquery.newsTicker.js" type="text/javascript"></script>
    <script language="javascript" src="Script/cc.js" type="text/javascript"></script>
    
</head>
<body>
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header runat=server />
        <!-- End Head -->
        <div id="mainContent">
        <form id="form1" runat="server">
        <div>
        
        </div>
        </form>
        </div>
        <!-- Footer -->
        <CC:Footer runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>
