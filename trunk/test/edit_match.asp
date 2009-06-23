<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>New Page 1</title>
<meta name="GENERATOR" content="Microsoft FrontPage 6.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
</head>

<body>
<p align="center"><b><font face="Arial" size="4">Using this page you can either tell the computer who batted first (useful for matches where a team won with the
scores level) or mark a match as abandoned</font></b></p>
<p align="center"><font face="Arial">&nbsp;
<%
		'Get values for <select> statements below

		accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")

		'### Build a dsn-less connection string

		ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
		ConnectionString=ConnectionString & "DBQ=" & accessdb


		'### Create the ADO Connection object 

		Set Connection = Server.CreateObject("ADODB.Connection")
		Connection.Open ConnectionString
	

		'### Create a SQL query string

		strQuery = "SELECT 'vs ' + team + ' (' + cstr(match_date) + ')' as match from teams a, matches b where a.team_id=b.oppo_id"	
	
		'### Execute the SQL query
	
		Set RS = Connection.Execute(strQuery)

		While Not RS.EOF

			match_select = match_select&"<option>"&RS("match")&"</option>"

			RS.MoveNext

		Wend
		
		'### Clean-up time

		RS.Close 
		Connection.Close
		set RS = Nothing 
		set Connection = Nothing


%>
<form action=edit_match_commit.asp>
The Village CC 
<select name=match><option>Please Select...</option><%=match_select%></select>

</font>

</p>
<p align="center"><font face="Arial"><input type=submit name=which value="Mark as Abandoned"><BR><BR>
<input type=submit name=which value="Village Won Toss and Batted First">&nbsp &nbsp<input type=submit name=which value="Village Won Toss and Bowled First"><BR><BR>
<input type=submit name=which value="Village Lost Toss and Batted First">&nbsp &nbsp<input type=submit name=which value="Village Lost Toss and Bowled First">
</font></p>
</form>
</body>

</html>