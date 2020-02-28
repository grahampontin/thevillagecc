<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>New Page 1</title>
<meta name="GENERATOR" content="Microsoft FrontPage 6.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
</head>

<body>

<%
'Get values for <select> statements below

		accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")

		'### Build a dsn-less connection string

		ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
		ConnectionString=ConnectionString & "DBQ=" & accessdb


		'### Create the ADO Connection object 

		Set Connection = Server.CreateObject("ADODB.Connection")
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


		'### Create a SQL query string
		
		if request("which") = "Batting" then
		strQuery = "SELECT * from batting_scorecards a, players b, how_out c where a.player_id=b.player_id and a.dismissal_id=c.dismissal_id and match_id = " & match_id & " order by [batting at]"
		end if
		if request("which") = "Bowling" then
		strQuery = "SELECT a.player_name as batsman, dismissal, score, d.player_name as fielder, b.player_name as bowler from bowling_scorecards a, how_out c, players b, players d where a.match_id = " & match_id & " and a.dismissal_id=c.dismissal_id and a.bowler_id=b.player_id and a.fielder_id=d.player_id order by [batting at]"	
		end if
		'### Execute the SQL query
		'response.write strQuery
		Set RS = Connection.Execute(strQuery)

				
		


%>


<p align="center"><b><font face="Arial" size="4"><%=request("which")%> Scorecard for the Village CC <%=request("match")%>
</font></b></p>
<font face="Arial">
<form action=submit_scorecard_commit.asp>
<input type=hidden name=match value="<%=request("match")%>">
<input type=hidden name=which value=<%=request("which")%>>


<%if request("which") = "Batting" then%>
<table border="0" width="100%" id="table1" bordercolorlight="#000000" bordercolordark="#000000" style="border-collapse: collapse">
	<tr>
		<td width="236" style="border-bottom-style: solid; border-bottom-width: 1px">
		<b>Batsman</b></td>
		<td width="122" style="border-bottom-style: solid; border-bottom-width: 1px">&nbsp;</td>
		<td width="336" style="border-bottom-style: solid; border-bottom-width: 1px">
		<b>fielder/bowler</b></td>
		<td style="border-bottom-style: solid; border-bottom-width: 1px"><font face="Arial">
		<b>Score</b></td>
		<td width="40" style="border-bottom-style: solid; border-bottom-width: 1px">
		<b>4s</b></td>
		<td width="40" style="border-bottom-style: solid; border-bottom-width: 1px">
		<b>6s</b></td>
	</tr>
<% while not RS.eof %>

	<tr>
		<td width="236" style="border-top-style: solid; border-top-width: 1px"><%=rs("player_name")%></td>
		<td width="122" style="border-top-style: solid; border-top-width: 1px"><%=rs("dismissal")%></td>
		<td width="336" style="border-top-style: solid; border-top-width: 1px"><%=rs("bowler_name")%></td>
		<td width="40" style="border-top-style: solid; border-top-width: 1px"><%=rs("score")%></td>
		<td style="border-top-style: solid; border-top-width: 1px"><%=rs("4s")%></td>
		<td style="border-top-style: solid; border-top-width: 1px"><%=rs("6s")%></td>
	</tr>
	
<%RS.MoveNext
wend%>
	</table>
<%else%>
<table border="0" width="100%" id="table1" style="border-collapse: collapse" bordercolor="#000000" bordercolorlight="#000000" bordercolordark="#000000">
	<tr>
		<td style="border-bottom-style: solid; border-bottom-width: 1px"><b>Batsman</b></td>
		<td style="border-bottom-style: solid; border-bottom-width: 1px">&nbsp;</td>
		<td style="border-bottom-style: solid; border-bottom-width: 1px"><b>Fielder</b></td>
		<td style="border-bottom-style: solid; border-bottom-width: 1px"><b>Bowler</b></td>
		<td style="border-bottom-style: solid; border-bottom-width: 1px"><font face="Arial">
		<b>Score</b></td>
	</tr>
<% while not RS.eof %>	
	<tr>
		<td style="border-top-style: solid; border-top-width: 1px"><%=rs("batsman")%></td>
		<td style="border-top-style: solid; border-top-width: 1px"><%=rs("dismissal")%></td>
		<td style="border-top-style: solid; border-top-width: 1px"><%=rs("fielder")%></td>
		<td style="border-top-style: solid; border-top-width: 1px"><%=rs("bowler")%></td>
		<td style="border-top-style: solid; border-top-width: 1px"><%=rs("score")%></td>
	</tr>
<%RS.MoveNext
wend%>

</table>
<%end if%>
<%     '### Clean-up time

		RS.Close 
		Connection.Close
		set RS = Nothing 
		set Connection = Nothing
		
%>

</body>

</html>