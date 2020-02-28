<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>New Page 1</title>
<meta name="GENERATOR" content="Microsoft FrontPage 6.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
</head>

<body>
<p align="center"><b><font face="Arial" size="4">Please Select the Match Below 
and Click &quot;Batting&quot; or &quot;Bowling&quot;</font></b></p>
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

		strQuery = "SELECT 'vs ' + team + ' (' + cstr(match_date) + ')' as match, b.match_id from teams a, matches b where a.team_id=b.oppo_id and b.match_id not in (select distinct match_id from batting_scorecards where match_id in (select distinct match_id from bowling_scorecards)) and match_date < now() and abandoned <> 1 order by match_date asc"	
	
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
<form action=submit_scorecard.asp>
The Village CC 
<select name=match><option>Please Select...</option><%=match_select%></select>

</font>

</p>
<p align="center"><font face="Arial"><input type=submit name=which value="Batting">&nbsp or &nbsp<input type=submit name=which value="Bowling"></font></p>
</form>
</body>

</html>