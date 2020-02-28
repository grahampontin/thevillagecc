<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>Create Match</title>
<meta name="GENERATOR" content="Microsoft FrontPage 6.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
</head>

<SCRIPT LANGUAGE="JavaScript" SRC="./CalendarPopup.js"></SCRIPT>
<SCRIPT LANGUAGE="JavaScript">
	var cal = new CalendarPopup();
</SCRIPT>

<%
'Get values for <select> statements below

		accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")

		'### Build a dsn-less connection string

		ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
		ConnectionString=ConnectionString & "DBQ=" & accessdb


		'### Create the ADO Connection object 

		Set Connection = Server.CreateObject("ADODB.Connection")
		Connection.Mode = 3
		Connection.Open ConnectionString
	    match_date = request("date1");

		'### Create a SQL query string

		strQuery = "SELECT team_id from teams where team = '"&replace(request("opponent"),"'","''")&"'"	
	
		'### Execute the SQL query
	
		Set RS = Connection.Execute(strQuery)

		While Not RS.EOF

			team_id = RS("team_id")

			RS.MoveNext

		Wend
		
		'### Create a SQL query string

		strQuery = "SELECT venue_id from venues where venue = '"&request("venue")&"'"	
	
		'### Execute the SQL query
	
		Set RS = Connection.Execute(strQuery)

		While Not RS.EOF

			venue_id = RS("venue_id")

			RS.MoveNext

		Wend
		
		'### Create a SQL query string

		strQuery = "SELECT comp_id from competitions where competition = '"&request("competition")&"'"	
	
		'### Execute the SQL query
	
		Set RS = Connection.Execute(strQuery)

		While Not RS.EOF

			comp_id = RS("comp_id")

			RS.MoveNext

		Wend		
		
		'### Create a SQL query string

		strQuery = "SELECT max(match_id)+1 as match from matches"	
	
		'### Execute the SQL query
		Set RS = Connection.Execute(strQuery)

		While Not RS.EOF
			on error resume next
			match_id = RS("match")
			if err.number <> 0 then
			response.write("error")
			match_id = 0
			end if
			on error goto 0
			
			RS.MoveNext

		Wend		
		
		
		'### Create another SQL query string

		if request("home_away") = "Home" then
		strQuery = "insert into matches(match_id, oppo_id, match_date, comp_id, venue_id, home_away) select "&match_id&", "&team_id&",'"&request("date1")&"',"&comp_id&","&venue_id&", 'H'"	
		Elseif request("home_away") = "Away" Then
		strQuery = "insert into matches(match_id, oppo_id, match_date, comp_id, venue_id, home_away) select "&match_id&", "&team_id&",'"&request("date1")&"',"&comp_id&","&venue_id&", 'A'"
		End if
		'response.write(strQuery)
		'### Execute the SQL query
	
		Set RS = Connection.Execute(strQuery)

		
		'### Clean-up time
		on error resume next	
		RS.Close 
		Connection.Close
		set RS = Nothing 
		set Connection = Nothing
		on error goto 0
%>
<body>

<p align="center"><font face="Arial"><b>Match Created</b></font></p>

</body>

</html>