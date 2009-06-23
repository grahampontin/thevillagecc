<html>

<!-- #INCLUDE FILE="./securityInclude/security.asp" -->
<!-- #INCLUDE FILE="./includes/ff_functions.asp" -->
<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>Village Online | Fantasy Fives | Home</title>
<link rel="stylesheet" type="text/css" href="../css/default.css" />
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
</head>

<body>
<div id="ff_title">
<SPAN id="page_title">Fantasy Fives Home</span><BR>
Your Team</div>
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
	batsman1 = Request("batsman1")
	batsman2 = Request("batsman2")
	all_rounder = Request("all_rounder")
	bowler1 = Request("bowler1")
	bowler2 = Request("bowler2")
	team_name = Request("team_name")
	team_value = Request("team_total_price_hidden")
	money_in_bank = 10 - team_value
	user_id = Session("user_id")
	match_id = request("match_id")
	
	strSQL = "select team_name from ff_team_overview where user_id  ="&user_id
	set rsNothing = connection.Execute(strSQL)
	if not rsNothing.eof then
	%>
	You've already got a team. Quit fucking around with the url.
	<%
	else
    	
	    on error resume next
	    errors = 0
	    strSQL = "insert into ff_team_overview(team_name, user_id, money_in_bank) select '"&replace(team_name,"'", "''")&"', "&user_id&", "&money_in_bank
	    set rsNothing = connection.Execute(strSQL)
	    errors = errors + err.number
	    
	    strSQL = "insert into ff_league(user_id, points) select "&user_id&", 0"
	    set rsNothing = connection.Execute(strSQL)
	    errors = errors + err.number
	    
	    
	    strSQL = "insert into ff_teams(user_id, match_id, player_type_id, player_id) select "&user_id&", "&match_id&", 0, "&batsman1 
	    set rsNothing = connection.Execute(strSQL)
	    errors = errors + err.number
	    strSQL = "insert into ff_teams(user_id, match_id, player_type_id, player_id) select "&user_id&", "&match_id&", 0, "&batsman2 
	    set rsNothing = connection.Execute(strSQL)
	    errors = errors + err.number
	    strSQL = "insert into ff_teams(user_id, match_id, player_type_id, player_id) select "&user_id&", "&match_id&", 2, "&all_rounder 
	    set rsNothing = connection.Execute(strSQL)
	    errors = errors + err.number
	    strSQL = "insert into ff_teams(user_id, match_id, player_type_id, player_id) select "&user_id&", "&match_id&", 1, "&bowler1 
	    set rsNothing = connection.Execute(strSQL)
	    errors = errors + err.number
	    strSQL = "insert into ff_teams(user_id, match_id, player_type_id, player_id) select "&user_id&", "&match_id&", 1, "&bowler2 
	    set rsNothing = connection.Execute(strSQL)
	    errors = errors + err.number
    	
	    if errors > 0 then
	       strSQL = "delete * from ff_teams where user_id = "&user_id&" and match_id = "&match_id
	       set rsNothing = connection.Execute(strSQL)   
	       strSQL = "delete * from ff_team_overview where user_id = "&user_id
	       set rsNothing = connection.Execute(strSQL)
	       strSQL = "delete * from ff_league where user_id = "&user_id
	       set rsNothing = connection.Execute(strSQL)
	          
	    end if
    	
    	
%>
	<P align=center>Create A Team!</p>

<%if errors = 0 then %>
    Congratulations! Your team has been created! Return to <a href=home.asp>home</a>.
<% else %>
    Shit it! Something went wrong. Changes have been rolled back.<br /><br />
    <%=err.Description %>
<%end if %>
    
    <%end if %>
</body>

</html>