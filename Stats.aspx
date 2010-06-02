<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Stats.aspx.cs" Inherits="Stats" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>The Village Cricket Club Online | Stats</title>
    <CC:Styles runat=server ID=styles />    
    
   <script type="text/javascript">
       $(function () {
           $("#tabs").tabs({
               ajaxOptions: {
                   error: function (xhr, status, index, anchor) {
                       $(anchor.hash).html("Coming soon...");
                   }
               },
               spinner: '<img src="/img/ajax-loader.gif"/>',
               load: function(event, ui) { $( ".spinner" ).html(''); }
           });
       });
    </script>
 
</head>
<body>
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
            <div class=PageHeading>Club Statistics</div>
            <div id="tabs">
	            <ul>
		            <li><a href="ajax/content3-slow.php">Batsmen <span class=spinner></span></a></li>
		            <li><a href="ajax/content3-slow.php">Bowlers <span class=spinner></span></a></li>
		            <li><a href="ajax/content3-slow.php">Teams <span class=spinner></span></a></li>
		            <li><a href="ajax/content3-slow.php">Grounds</a></li>
		            <li><a href="ajax/content4-broken.php">Captains</a></li>
                    <li><a href="ajax/content4-broken.php">Keepers</a></li>

	            </ul>
	            
            </div>

        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>

