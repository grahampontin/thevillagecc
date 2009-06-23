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
arrLinkNames = array("Home", "League", "My Team", "My Account", "Transfers", "Scoring")
arrLinks = array("./home.asp", "./league.asp", "./my_team.asp", "./my_account.asp", "./transfers.asp", "./scoring.asp")
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
 		
<BR>
</body>

</html>