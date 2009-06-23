<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>Create Match</title>
<meta name="GENERATOR" content="Microsoft FrontPage 6.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
</head>

<SCRIPT LANGUAGE="JavaScript" SRC="./CalendarPopup.js"></SCRIPT>
<SCRIPT LANGUAGE="JavaScript">
	var cal = new CalendarPopup();
</SCRIPT>

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

		strQuery = "SELECT team from teams where team_id > 0"	
	
		'### Execute the SQL query
	
		Set RS = Connection.Execute(strQuery)

		While Not RS.EOF

			oppo_select = oppo_select&"<option>"&RS("team")&"</option>"

			RS.MoveNext

		Wend
		
		'### Create another SQL query string

		strQuery = "SELECT venue from venues"	
	
		'### Execute the SQL query
	
		Set RS = Connection.Execute(strQuery)

		While Not RS.EOF

			venue_select = venue_select&"<option>"&RS("venue")&"</option>"

			RS.MoveNext

		Wend

		'### Create another SQL query string

		strQuery = "SELECT competition from competitions"	
	
		'### Execute the SQL query
	
		Set RS = Connection.Execute(strQuery)

		While Not RS.EOF

			comp_select = comp_select&"<option>"&RS("competition")&"</option>"

			RS.MoveNext

		Wend



		'### Clean-up time

		RS.Close 
		Connection.Close
		set RS = Nothing 
		set Connection = Nothing

%>
<body>
<p align="center"><b><font face="Arial" size="4">Please Select Opponent, Date 
and Venue the click &quot;Create!&quot;</font></b></p>
<p align="center"><font face="Arial">&nbsp;

</font>

<form name=main action=CreateMatchCommit.aspx>

	<p align="center"><font face="Arial">The Village CC vs <select name=opponent><option>Please Select...</option><%=oppo_select%></select></font></p>
	<p align="center"><font face="Arial">at <select name=venue><option>Please Select...</option><%=venue_select%></select></font></p>
	<p align="center"><font face="Arial">on: <input name=date1 readonly>&nbsp&nbsp
	
	<A HREF="#" onClick="cal.select(document.forms['main'].date1,'anchor1','d MMM y'); return false;"  NAME="anchor1" ID="anchor1">
	<img border="0" src="images/calendar.gif" width="34" height="21">
	</A>
	
	</font></p>
	<p align="center"><font face="Arial">at <select name=home_away><option>Please Select...</option><OPTION >Home</option><OPTION >Away</option></select></font></p>
	<p align="center"><font face="Arial">Type of match: <select name=competition><option>Please Select...</option><%=comp_select%></select></font></p>
	<p align="center"><input type=submit name=go value=Create!></p>
	
</form></p>

</body>

</html>