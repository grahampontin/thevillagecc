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
		Set RS_password = Connection.Execute(strQuery)
		logged_in="no"
		while not RS_password.eof
			if RS_password("password") = request("password") then
				logged_in="yes"
			end if
		RS_password.movenext
		wend
		
		
		


%>
<%if logged_in="yes" then%>
<p align = center><font face=arial size=2>
<%		if request("credit_debit") = "from" then
		strQuery = "insert into accounts (player_id, debit_credit, amount, description) select player_id, '"&request("credit_debit")&"',"&request("amount")&" , '"&request("comment")&"' from players where player_name = '"&request("player_name")&"'"
		else
		strQuery = "insert into accounts (player_id, debit_credit, amount, description) select player_id, '"&request("credit_debit")&"', -"&request("amount")&" , '"&request("comment")&"' from players where player_name = '"&request("player_name")&"'"
		end if
		Set RS = Connection.Execute(strQuery)
		
%>

Payment confirmed.







<br><BR>
<hr>
<p align=center>
<BR>
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
<form name=f3 action=player_balances.asp method=post>
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
<%
'### Clean-up time

 		RS_password.close
 		set RS_password=nothing
		Connection.Close
		set Connection = Nothing


%>
</body>

</html>
