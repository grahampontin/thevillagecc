<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>Village Online | Accounts</title>
<meta name="GENERATOR" content="Microsoft FrontPage 6.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
</head>

<body>
<p align="center"><b><font face="Arial" size="4">Welcome to the Village CC 
online Accounts</b></p>
<%if request("login") = "" then%>
<p align="center"><font face="Arial" size="3">Please Login now</font></p>
<p align = center>
<form action=main.asp method=post>
Username: <input name=username><br><BR>
Password: <input type=password name=password><br><BR>
<input type=submit name=login value=login>
</form>
<%else%>
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
	
		'### Create a SQL query string

		strQuery = "select password from administrators where user_name = '"& request("username") & "'" 	
	
		'### Execute the SQL query
		'response.write strQuery & "<br>"
		Set RS = Connection.Execute(strQuery)
		logged_in="no"
		while not RS.eof
			if RS("password") = request("password") then
				logged_in="yes"
			end if
		RS.movenext
		wend

'### Clean-up time

 		RS.close
 		set RS=nothing
		Connection.Close
		set Connection = Nothing

%>
<%if logged_in="yes" then%>
<p align = center><font face=arial size=2>
You are now logged in. Please select from the options below.<br><BR><BR>
<form name=f1 action=add_payment.asp method=post>
<input type=hidden name=password value=<%=request("password")%>> 
<input type=hidden name=username value=<%=request("username")%>>
<input type=submit name=page value='Add Payment'>
</form>
<form name=f2 action=nets_session.asp method=post>
<input type=hidden name=password value=<%=request("password")%>>
<input type=hidden name=username value=<%=request("username")%>>
<input type=submit name=page value='Record Nets Attendence'>
</form>
<form name=f3 action=player_balances_new.asp method=post>
<input type=hidden name=password value=<%=request("password")%>>
<input type=hidden name=username value=<%=request("username")%>>
<input type=submit name=page value='View Player Balances'>
</form>
<form name=f4 action=view_accounts.asp method=post>
<input type=hidden name=password value=<%=request("password")%>>
<input type=hidden name=username value=<%=request("username")%>>
<input type=submit name=page value='View Accounts'>
</form>
<form name=f5 action=main.asp method=post>
<input type=submit name=page value='Log Out'>
</form>

<%else%>
<p align="center"><font face="Arial" size="3">Authentication failed. Please try again.</font></p>
<p align = center>
<form action=main.asp method=post>
Username: <input name=username><br><BR>
Password: <input type=password name=password><br><BR>
<input type=submit name=login value=login>
</form>
<%end if%>
</font>
</p>


<%end if%>

</body>

</html>
