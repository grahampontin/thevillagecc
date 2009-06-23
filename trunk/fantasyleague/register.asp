<%@ Language = "VBScript" %>
<%
'**********************************************************
' To make this script work you simply need to create a
' table named tblLoginInfo in your database with one
' column named username and another named password.  Put
' the values you want for username and password into a
' record in the table.  The advantages of this script are
' that it's more secure than if you hard-coded the
' username/password values directly in the script, and
' that you can change the username and password simply by
' changing the values in your login_table.
'
' NOTE: BE SURE TO EITHER MOVE THE INCLUDED SAMPLE
'       DATABASE TO A SECURE AREA OUTSIDE THE WEB SITE OR
'       USE A DIFFERENT SECURE DATABASE.  OTHERWISE ANYONE
'       CAN SIMPLY DOWNLOAD THE WHOLE DB AND RETREIVE YOUR
'       USERNAME AND PASSWORD FROM IT.
'**********************************************************

Dim cnnLogin
Dim rstLogin
Dim strUsername, strPassword
Dim strSQL

%>
<html>
<head><title>Village Online | Fanstay League | Login</title>
<link rel="stylesheet" type="text/css" href="../css/default.css" />

</head>
<body >
<P align=center>
<%
If Request.Form("action") <> "register_user" or request("email") <> request("confirm_email") Then
	%>
	<span id="page_title">Village Fantasy Fives(tm)</span>
	<BR>
	<BR>Create an account 
	
	<form action="register.asp" method="post">
	<input type="hidden" name="action" value="register_user" />
	<table border="0">
		<tr>
			<td align="right">Login Name:</td>
			<td><input type="text" name="username" /></td>
		</tr>
		<tr>
			<td align="right">Email Address:</td>
			<td><input type="text" name="email" /></td>
		</tr>
		<%If request("email") <> request("confirm_email") then%>
		<tr>
			<td align="center" colspan=2><FONT color=red>email addresses did not match</font></td>
		</tr>
		
		<%End If%>
		<tr>
			<td align="right">Confirm Email Address:</td>
			<td><input type="text" name="confirm_email" /></td>
		</tr>
		<tr>
			<td align="right"></TD>
			<td><input type="submit" VALUE="Register" /></td>
		</tr>
	</table>
	</form>
	<%
Else
	On Error Resume Next
	'generate random password
	Dim Randchar, password, StrL
	'Define the length of the password String
	StrL=8
	'Generate the password string
	DO UNTIL Len(password)=StrL
	Randomize
	Randchar = Int(Rnd*122)+1
	IF (Randchar>64 AND Randchar<91) OR (Randchar>96 AND Randchar<123) OR (Randchar>47 AND Randchar<58) THEN
	password=password & chr(Randchar)
	END IF
	LOOP
	
	strSQL = "insert into users(username, email_address, password) Select '"&request("username")&"','"&request("email")&"','"&password&"'"
	
	'Response.Write(strSQL)
	accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")
	
		'### Build a dsn-less connection string

		ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
		ConnectionString=ConnectionString & "DBQ=" & accessdb

		'### Create the ADO Connection object 

		Set Connection = Server.CreateObject("ADODB.Connection")
		Connection.Mode = 3
		Connection.Open ConnectionString

	Set rstLogin = connection.Execute(strSQL)
	If Err.Number <> 0 Then
		%>
		Something went wrong. Either your email address or usename are probably already in use. The following
		might, or might Not, help:<BR><BR>
		<%=Err.Description%>
	<%Else
		Call SendRegistrationMail(Request("email"),password)%>
		Your account has been created, check your emails for a password the return to <A href="./login.asp">login page</a> to sign in.
		<%
		' Clean Up
		connection.Close
		Set connection = Nothing
	End if
End If

Function SendRegistrationMail(email, password)

	Set myMail=CreateObject("CDO.Message")
	myMail.Subject="VCC Login Details"
	myMail.From="Fantasy Fives<fantasyfives@thevillagecc.org.uk>"
	myMail.To=email
	myMail.HTMLBody="Your VCC Account has been created.<BR>UserName: "&Request("username")&"<BR>Password: "&password
	myMail.Send
	set myMail=nothing


End Function 

%>
</p>
</body>
</html>
