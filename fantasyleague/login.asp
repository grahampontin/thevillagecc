<%@ Language = "VBScript" %>
<%
Option Explicit
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
If Request.Form("action") <> "validate_login" Then
	%>
	<span id="page_title">Village Fantasy Fives(tm)</span><BR><BR>Please login or 
	register if you've not played before 
	
	<form action="login.asp" method="post">
	<input type="hidden" name="action" value="validate_login" />
	<table border="0">
		<tr>
			<td align="right">Login:</td>
			<td><input type="text" name="login" /></td>
		</tr>
		<tr>
			<td align="right">Password:</td>
			<td><input type="password" name="password" /></td>
		</tr>
		<tr>
			<td align="right"></TD>
			<td><input type="submit" VALUE="Login" /></td>
		</tr>
	</table>
	</form>
	<a href="./register.asp">register now!</a><br />
	<a href="./reset_password.asp">reset password</a>
	<%
Else
	strSQL = "SELECT * FROM users " _
		& "WHERE username='" & Replace(Request.Form("login"), "'", "''") & "' " _
		& "AND password='" & Replace(Request.Form("password"), "'", "''") & "';"

	Set cnnLogin = Server.CreateObject("ADODB.Connection")
	cnnLogin.Open("DRIVER={Microsoft Access Driver (*.mdb)};" _
		& "DBQ=" & server.mappath("/App_Data/villagescorebook.mdb"))

	Set rstLogin = cnnLogin.Execute(strSQL)

	If Not rstLogin.EOF Then
	Session("username") = rstLogin("username")
	Session("user_id") = rstLogin("user_id")
	Session("authenticated") = true
		%>
		<p>
		<strong>Login Complete</strong>
		<BR><BR>You are logged in as <%=Session("username")%><BR><BR>
		<%Response.Redirect("./home.asp")%>
		<a href="./home.asp>
		</p>
		<%
	Else
		%>
		<p>
		<font size="4" face="arial,helvetica"><strong>
		Login Failed - Please verify username and password.
		</strong></font>
		</p>
		<p>
		<a href="login.asp">Try Again</a>
		</p>
		<%
		'Response.End
	End If

	' Clean Up
	rstLogin.Close
	Set rstLogin = Nothing
	cnnLogin.Close
	Set cnnLogin = Nothing
End If
%>
</p>
</body>
</html>
