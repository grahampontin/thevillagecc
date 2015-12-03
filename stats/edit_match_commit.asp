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
<%If request("match") = "" Then%>
<p align="center"><font face="Arial">Doesn't like you picked a match</font></p>
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

		arrMatch = split(request("match"), " ")
		temp = ubound(arrMatch)
		MatchDate = replace(replace(arrMatch(temp), ")", ""), "(", "")

		'### Create a SQL query string

		strQuery = "SELECT match_id from matches where cstr(match_date) = '"&MatchDate&"'"	
	
		'### Execute the SQL query
		'response.write strQuery & "<br>"
		Set RS = Connection.Execute(strQuery)

		While Not RS.EOF

			match_id = RS("match_id")
			'response.write(match_id & "<BR>")
			RS.MoveNext

		Wend

		
		'### Create a SQL query String
		If Request("which") = "Mark as Abandoned" then
		strQuery = "update matches set abandoned  = 1 where match_id = " & match_id
		Set RS = Connection.Execute(strQuery)

		End If
		
		If Request("which") = "Village Won Toss and Batted First" then
		strQuery = "update matches set won_toss = 1 where match_id = " & match_id
		Set RS = Connection.Execute(strQuery)
        strQuery = "update matches set batted = 1 where match_id = " & match_id
		Set RS = Connection.Execute(strQuery)
		End If
		
		If Request("which") = "Village Won Toss and Bowled First" then
		strQuery = "update matches set won_toss = 1 where match_id = " & match_id
		Set RS = Connection.Execute(strQuery)
        strQuery = "update matches set batted = 0 where match_id = " & match_id
		Set RS = Connection.Execute(strQuery)
		End If
		
		If Request("which") = "Village Lost Toss and Batted First" then
		strQuery = "update matches set won_toss = 0 where match_id = " & match_id
		Set RS = Connection.Execute(strQuery)
        strQuery = "update matches set batted = 1 where match_id = " & match_id
		Set RS = Connection.Execute(strQuery)
		End If
		
		If Request("which") = "Village Lost Toss and Bowled First" then
		strQuery = "update matches set won_toss = 1 where match_id = " & match_id
		Set RS = Connection.Execute(strQuery)
        strQuery = "update matches set batted = 1 where match_id = " & match_id
		Set RS = Connection.Execute(strQuery)
		End If
		
		
		
		'### Execute the SQL query
		Set RS2 = Connection.Execute(strQuery)

'### Clean-up time

 
		Connection.Close
		set Connection = Nothing

%>

<p align="center"><font face="Arial">Successfully updated match
</font></p>

<%End If%>
</body>

</html>
