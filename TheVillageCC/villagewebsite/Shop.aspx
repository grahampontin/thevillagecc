﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Shop.aspx.cs" Inherits="Shop" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html lang="en">
<head runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>The Village Cricket Club Online | Shop Online!</title>
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
            <div id=Form runat=server visible=true class="standardText">
            New for the 2012 Season VCC Online has teamed up with <a target=_blank href="http://www.willowsportswearshop.co.uk/products/all/Village+Cricket+Club" target=_blank>
                Willow Sports</a>
            to bring you a streamlined online club kit ordering service. Just follow this 
                <a target=_blank href="http://www.willowsportswearshop.co.uk/products/all/Village+Cricket+Club">link</a>, use the password "VCC" and get ready for 2012 with some spanking new club kit.
                <br />
            <br />
            <i>&quot;Though a well-turned out team is not necessarily a good one, the best teams are 
                invariably well turned out.&quot;</i>
            <Br />
            <i>Know the Game: Rugby Union (1983)</i>
                <br />
                <br />
            VCC Online is also proud to recommend the shopping experience to be had with Amazon, you can use this handy search box
            to look for all your favourite things online!<br /><br />
            <iframe src="http://rcm-uk.amazon.co.uk/e/cm?t=thevillagecc-21&o=2&p=27&l=qs1&f=ifr" width="180" height="150" frameborder="0" scrolling="no"></iframe>

            </div>
            
            
        </form>
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>

