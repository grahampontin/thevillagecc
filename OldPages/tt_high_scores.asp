
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
		
		score = Request("score")
		username =Request("user_name")
		
		'### Create a SQL query String
		If len(score) > 0 And len(username) > 0 then
		strQuery = "insert into TT_Scores(user_name, score, when) select '"&username&"', "&score&" ,'" & now() & "'"
		
		'### Execute the SQL query
		Set RS2 = Connection.Execute(strQuery)
        End If
        
        strQuery = "select * from TT_Scores order by score asc"
        Set RS2 = Connection.Execute(strQuery)
        %>
        <TABLE cellpadding=10>
        <tr><th><th>User<th>Time Required<th>Date</tr>
        <%
        counter = 0
        While Not RS2.eof And counter < 11
        counter = counter+1
        %>
        <tr><td><%=counter%><td><%=RS2("user_name")%></td><td align=center><%=RS2("score")%>s</td><td><%=RS2("when")%></td></tr>
        <%
        RS2.movenext
		wend
'### Clean-up time

 
		Connection.Close
		set Connection = Nothing

%>
</table>
<BR><BR><BR>
<input type=button value="Start New Game!" onClick="window.location.reload( false );">