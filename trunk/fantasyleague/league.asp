<html>

<!-- #INCLUDE FILE="./securityInclude/security.asp" -->
<!-- #INCLUDE FILE="./includes/ff_functions.asp" -->
<!-- #INCLUDE FILE="../includes/functions.asp" -->

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>Village Online | Fantasy Fives | Home</title>
<link rel="stylesheet" type="text/css" href="../css/default.css" />
<link rel="stylesheet" type="text/css" href="../css/sortabletable.css" />

<link rel="stylesheet" type="text/css" href="./css/ff.css" />
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
             $("#league_table").tablesorter( {sortList: [[2,1]]} );     
            } 
            );
</script>	
</head>

<body>
<div id="ff_title">
<SPAN id="page_title">Fantasy Fives</span><BR>
League Table</div>
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
	
	set rsTheLeague = getFFLeagueTable()%>
	<p align=center>
	<table class="tablesorter league_table" cellspacing=1 id="league_table">
	<thead>
	    <tr><th>pos</th><th>team</th><th>points</th></tr>
	</thead>
	<tbody>
	<%
	pos = 0
    while not rsTheLeague.eof
    pos = pos + 1	
	%>
	    <tr><td><%=pos %></td><td><a href=./latest_points.asp?user_id=<%=rsTheLeague("user_id")%>><%=rsTheLeague("team_name") %> ( <%=getUserName(rsTheLeague("user_id")) %> )</a></td><td><%=rsTheLeague("points") %></td></tr>
	<%
	    rsTheLeague.movenext
	wend %>
	</tbody>
	</table>
	</p>
</DIV>	
</body>

</html>