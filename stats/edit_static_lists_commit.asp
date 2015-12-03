<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>New Page 1</title>
<meta name="GENERATOR" content="Microsoft FrontPage 6.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
</head>

<body>
<p align="center"><b><font face="Arial" size="4">Welcome to the Village CC 
online Stats Portal</font></b></p>
<%If request("thing_to_add") = "" Then%>
<p align="center"><font face="Arial">You need to type something in the box you fool.</font></p>
<%Else%>

<%		
		'Point at the database
		
		accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")

		'### Build a dsn-less connection string

		ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
		ConnectionString=ConnectionString & "DBQ=" & accessdb

		'### Create the ADO Connection object 

		Set Connection = Server.CreateObject("ADODB.Connection")
		Connection.Mode = 3
		Connection.Open ConnectionString
		
		'### Create a SQL query String
		If Request("add") = "Add Villager" then
		strQuery = "insert into Players(player_name, player_id) select '"&request("thing_to_add")&"', max(player_id)+1 from Players"
		End If
		If Request("add") = "Add Venue" then
		strQuery = "insert into venues(venue, venue_id) select '"&request("thing_to_add")&"', max(venue_id)+1 from venues"
		End If
		If Request("add") = "Add Opponent" then
		strQuery = "insert into teams(team, team_id) select '"&request("thing_to_add")&"', max(team_id)+1 from teams"
		End If
		
		'### Execute the SQL query
		Set RS2 = Connection.Execute(strQuery)

'### Clean-up time

 
		Connection.Close
		set Connection = Nothing

%>

<p align="center"><font face="Arial">Successfully added "<%=request("thing_to_add")%>" 
</font></p>

<%End If%>
</body>

</html>
