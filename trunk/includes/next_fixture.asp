<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>New Page 1</title>
</head>

<body>
<p align=center>
<font face="Arial"><b><font face=arial size=2>Next Fixture</b></font><br><br>
<%
		'Get values for <select> statements below

		accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")

		'### Build a dsn-less connection string

		ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
		ConnectionString=ConnectionString & "DBQ=" & accessdb


		'### Create the ADO Connection object 

		Set include_Connection = Server.CreateObject("ADODB.Connection")
		include_Connection.Open ConnectionString
	

		'### Create a SQL query string

		strQuery = "SELECT * from matches a, teams b, venues c where a.oppo_id = b.team_id and c.venue_id = a.venue_id and  match_date in (select min(match_date) from matches where match_date > now())"
	
		'### Execute the SQL query
	
		Set RS_next_fixture = include_Connection.Execute(strQuery)

		While Not RS_next_fixture.EOF

			response.write("<font face=arial size=2>The Village CC<BR>VS<BR>"&RS_next_fixture("team")&"<BR>At: "&RS_next_fixture("venue")&"<BR>"&RS_next_fixture("match_date")&"</font>")

			RS_next_fixture.MoveNext

		Wend
		
		'### Clean-up time

		RS_next_fixture.Close 
		include_Connection.Close
		set RS_next_fixture = Nothing 
		set include_Connection = Nothing

%>

</font>

</p>

</body>

</html>