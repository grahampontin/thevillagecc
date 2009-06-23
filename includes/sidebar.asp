<html>

<head>
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>Menu Bar Left</title>
<script src="http://www.google-analytics.com/urchin.js" type="text/javascript">
</script>
<script type="text/javascript">
_uacct = "UA-797039-1";
urchinTracker();
</script>
<style type="text/css">
.left_link {
  font-size: 10pt;
  font-family: arial;
}

.nostyle_link:hover {
  color: #717D7D;
  border-style: solid;
  
}

.nostyle_link{
  text-decoration: none;
  color: black; 
  margin-bottom: 5px;
  margin-top: 5px;
  padding: 2px;
  width: 124px;
  border-style: dashed;
  border-width: 1px;
  
}

#navcontainer ul
{
margin: 0;
padding: 0;
list-style-type: none;
text-align: center;
}

#navcontainer li { 
 margin: 0 0 .2em 0;
  
 }

#navcontainer a
{
display: block;
color: #000000;
background-color: #FFFFFF;
width: 9em;
padding: .2em .8em;
text-decoration: none;
font-size: 10pt;
font-family: arial;
}

#navcontainer a:hover
{
background-color: #CCCCCC;
color: #FFF;
}


</style>

</head>
<%
'Add new Page names and urls to the two arrays below to add links to the left menu bar.
arrLinkNames = array("Home", "Stats", "Fixtures", "Results", "Match Reports", "Nets", "Committee", "Join", "Players", "Wives", "Gallery", "News", "Chat", "Top Stumps", "Fantasy Fives!")
arrLinks = array("default.aspx", "stats.asp", "fixtures.asp", "results.asp", "match_reports.asp", "training.asp", "committee.asp", "join.asp", "players.asp", "wives.asp", "gallery.asp", "news.asp", "Chat.aspx", "top_trumps.asp", "/fantasyleague/home.asp")
link_counter = 0
%>
<div id="navcontainer">
<ul>

<%
For Each link In arrLinks
temp = Request.serverVariables("SCRIPT_NAME")
%>
<li><a href="<%=link%>"><%=arrLinkNames(link_counter)%></a></li>
<%
link_counter = link_counter + 1
Next
%>
</ul>
</div>

<p align="center"><font size="2" face="Arial"><a href="/sitemap.asp">site map</a></font></p>
<iframe src="http://rcm-uk.amazon.co.uk/e/cm?t=thevillagecc-21&o=2&p=6&l=st1&mode=books&search=Cricket&fc1=&lt1=&lc1=&bg1=&f=ifr" marginwidth="0" marginheight="0" width="120" height="150" border="0" frameborder="0" style="border:none;" scrolling="no"></iframe>
<BR><BR><A HREF="http://www.cricinfo.com/">
<IMG SRC="./images/CIblue150x40.gif" BORDER=0 ALT="CricInfo.com"></A> 		
<BR>
</body>

</html>