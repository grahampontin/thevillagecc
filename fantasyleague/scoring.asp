<html>

<!-- #INCLUDE FILE="./securityInclude/security.asp" -->
<!-- #INCLUDE FILE="./includes/ff_functions.asp" -->
<!-- #INCLUDE FILE="../includes/functions.asp" -->

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>Village Online | Fantasy Fives | Home</title>
<link rel="stylesheet" type="text/css" href="../css/default.css" />
<link rel="stylesheet" type="text/css" href="./css/ff.css" />
<link rel="stylesheet" type="text/css" href="../css/sortabletable.css" />

<%Set browserdetect = Server.CreateObject("MSWC.BrowserType")
  ' find some properties of the browser being used to view this page
  browser=browserdetect.Browser
  Response.Write("Browser has identified itself as: " & browser)
  If browser = "IE" or browser = "Netscape" Then
			label = "name"
	Else	
			label = "label"
	End if
%>	
<script type="text/javascript" src="/JavaScript/jquery-1.2.2.min.js"></script> 
<script type="text/javascript" src="/JavaScript/jquery.tablesorter.min.js"></script> 
<script type="text/javascript">
    $(document).ready(function()     
           {
             $("#league_table").tablesorter( {sortList: [[0,0]]} );     
            } 
            );
</script>	
</head>

<body>
<div id="ff_title">
<SPAN id="page_title">Fantasy Fives</span><BR>
Scoring Model</div>
<DIV class=ff_leftnav>
	<!-- #INCLUDE FILE="./includes/ff_menu.asp" -->
	
</div>

<DIV class=ff_center>
<%	'Response.Write(strSQL)
	accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")
	
	'### Build a dsn-less connection String
	
	ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
	ConnectionString=ConnectionString & "DBQ=" & accessdb
	
	'### Create the ADO Connection object 
	Set Connection = Server.CreateObject("ADODB.Connection")
	Connection.Mode = 3
	Connection.Open ConnectionString
	
	user_id = getUserID(Session("username"))
	team_name = Request("team_name")
	user_id = Session("user_id")
	
	set rsScores = getFFScoreModel()%>
	<p align=center>
	<table class="tablesorter league_table" id="league_table">
	<thead>
	    <tr><th>Metric</th><th>Points for Batsman</th><th>Points for Bowler</th><th>Points for All-Rounder</th></tr>
	</thead>
	<tbody>
	<%
	pos = 0
    while not rsScores.eof
    pos = pos + 1	
	%>
	    <tr><td><%=rsScores("display_name") %></td><td><%=rsScores("points_for_batsman") %></td><td><%=rsScores("points_for_bowler") %></td><td><%=rsScores("points_for_all_rounder") %></td></tr>
	<%
	    rsScores.movenext
	wend %>
	</tbody>
	</table>
	</p>
</DIV>	
</body>

</html>