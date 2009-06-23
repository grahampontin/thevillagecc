<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<link rel="stylesheet" type="text/css" href="./css/default.css" />
<!--#include virtual="./includes/functions.asp"-->

<title>The Village CC | Results</title>


</head>

<%
On Error Resume next		
		startDate = Request("startDate")
		If startDate = "" Then
		 startDate = "1/4/"&Year(Now())
		End if
		
		
		'On Error Resume Next
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

		strQuery = "SELECT * from matches a, venues b, teams c, competitions d, match_reports e where a.venue_id = b.venue_id and a.oppo_id = c.team_id and a.match_id = e.match_id and a.comp_id=d.comp_id and match_date between #"&startDate&"# and #"&dateadd("yyyy", 1, startDate)&"# and match_date < now() order by match_date asc"	
	
		'### Execute the SQL query
		'response.write strQuery & "<br>"
		Set RS = Connection.Execute(strQuery)
%>

		





<body>

<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
	<tr>
		<td valign="top" rowspan="3">
		<p align="center"><font color="#000000" size="2">Page Last Updated:</font></p>
		<p align="center"><font color="#000000" size="2">
		</font></td>
		<td valign="top" rowspan="2">
		<p align="center">
		<font size="2">
		<img border="0" src="images\untitled.jpg" width="251" height="121"></font></td>
		<td height="1"></td>
		</tr>
	<tr>
		<td height="121" valign="top"><font face="Arial"><!--#include virtual="./includes/next_fixture.asp"-->
		</font></td>
	</tr>
	<tr>
		<td></td>
		<td height="1"></td>
		</tr>
	<tr>
		<td valign="top" rowspan="2" width="118" height="464"><table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
			<tr>
				<td height="100%" width="100%"><table border="0" width="100%" height="100%" cellpadding="3" cellspacing="0">
					<tr>
						<td width="100%" height="100%" valign="top">
						<!--#include virtual="./includes/sidebar.asp"--></td>
					</tr>
				</table></td>
			</tr>
		</table></td>
		<td valign="top" height="440" align='center'>
		<p align="center"><b><font face="Arial" size="5">Results</font></b><br>
		<font size="2" face="arial"><a href=./results.asp?startDate=<%=DateAdd("yyyy", -1, startdate)%>>previous</a> &nbsp&nbsp&nbsp <%=startDate%> to <%=DateAdd("yyyy", 1, startdate)%> &nbsp&nbsp&nbsp <a href=./results.asp?startDate=<%=DateAdd("yyyy", 1, startdate)%>>next</a></font>
		<br>
		<br>
		
		
		<table cellSpacing="1" cellPadding="4" border="0" width="100%">
														
														<%
														While Not RS.EOF
														If rs("home_away") = "A" Then
														%>
														    
															<tr>
															<td>
															<font color="#000000" size="2" face=arial>
															<%=FormatDateTime(rs("match_date"),1)%>&nbsp;</font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															<%=rs("team")%> <%=getScore("other", rs("match_id"))%></font></td>
															<td>
															<p align="center">
															<font color="#000000" size="2" face=arial>
															<%=getResult("away", rs("match_id"))%>
															</font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															<b><font color="#000000" size="2" face=arial>The Village CC <%=getScore("village", rs("match_id"))%></font></font></b></td>
															<td>
															<font color="#000000" size="2" face=arial>
															&nbsp</font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															at <%=rs("venue")%></font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															(<%=rs("competition")%>)</font></td>
															<td><%If rs("photos") = 1 Then%>
															<a class="small_link" href='./match_photos.asp?match_id=<%=rs("match_id")%>'>photos</a>
															<%End if%></td>
															</tr>
															
														<%Else%>
														     <tr>
															<td>
															<font color="#000000" size="2" face=arial>
															<%=FormatDateTime(rs("match_date"),1)%>&nbsp;</font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															<b>The Village CC <%=getScore("village", rs("match_id"))%></b></font></td>
															<td>
															<p align="center">
															<font color="#000000" size="2" face=arial>
															<%=getResult("home", rs("match_id"))%>
															</font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															<font color="#000000" size="2" face=arial>
															<%=rs("team")%> &nbsp<%=getScore("other", rs("match_id"))%></font></font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															&nbsp</font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															at <%=rs("venue")%></font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															(<%=rs("competition")%>)</font></td>
															<td><%If rs("photos") = 1 Then%>
															<a class="small_link" href='./match_photos.asp?match_id=<%=rs("match_id")%>'>photos</a>
															<%End if%></td>

															</tr>
														<%End if
															
															RS.MoveNext

														Wend
		
														%>

														</table>
														<td valign="top" rowspan="2" width="124"><table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
			<tr>
				<td height="100%" width="100%"><table border="0" width="100%" height="100%" cellpadding="3" cellspacing="0">
					<tr>
						<td width="100%" height="100%" valign="top">
							<!--#include virtual="./includes/news_shorts.asp"-->
						</td>
					</tr>
				</table></td>
			</tr>
		</table></td>
	</tr>
	<tr>
		<td valign="top" height="24" width="560">
		<p align="center"><font color="#000000" size="1">(c) The Village CC 
		2004-2006. All Rights reserved<br>Best viewed at 1024 x 768</font></td>
		</tr>
</table></body>

		<%
			
		'### Clean-up time
		on error resume next	
		RS.Close 
		Connection.Close
		set RS = Nothing 
		set Connection = Nothing
		on error goto 0
		%>

</html>