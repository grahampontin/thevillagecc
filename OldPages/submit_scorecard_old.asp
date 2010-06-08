<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>New Page 1</title>
<meta name="GENERATOR" content="Microsoft FrontPage 6.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
</head>
<SCRIPT language=javascript>
function calculate() {
var total = 0;
    for (var i = 0; i<document.myform.elements.length; i++) {
        if (((document.myform.elements[i].name == 'score') | (document.myform.elements[i].name == 'extras')) & (document.myform.elements[i].value != '')) {
            
            total = parseInt(document.myform.elements[i].value) + total;
        }
    }
    document.myform.total.value = total;

}
</script>

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
	

		'### Create a SQL query string

		strQuery = "SELECT player_name from players where player_id >= 0 order by player_name"	
	
		'### Execute the SQL query
	
		Set RS = Connection.Execute(strQuery)

		While Not RS.EOF

			batsman_select = batsman_select&"<option>"&RS("player_name")&"</option>"

			RS.MoveNext

		Wend

		'### Create a SQL query string

		strQuery = "SELECT dismissal from how_out where dismissal_id >= 0 order by dismissal_id "	
	
		'### Execute the SQL query
	
		Set RS = Connection.Execute(strQuery)

		While Not RS.EOF

			out_select = out_select&"<option>"&RS("dismissal")&"</option>"

			RS.MoveNext

		Wend
		
		'### Clean-up time

		RS.Close 
		Connection.Close
		set RS = Nothing 
		set Connection = Nothing


%>


<p align="center"><b><font face="Arial" size="4"><%=request("which")%> Scorecard for the Village CC <%=request("match")%>
</font></b></p>
<font face="Arial">
<form action=submit_scorecard_commit.asp name=myform>
<input type=hidden name=match value="<%=request("match")%>">
<input type=hidden name=which value=<%=request("which")%>>
<%if request("which") = "Batting" then%>
<table border="0" width="100%" id="table1">
	<tr>
		<td width="236">Batsman</td>
		<td width="122">&nbsp;</td>
		<td width="336">fielder/bowler</td>
		<td><font face="Arial">Score</td>
		<td width="40">4s</td>
		<td width="40">6s</td>
	</tr>
	<tr>
		<td width="236"><select name=batsman1><option>Please Select...</option><%=batsman_select%></select></td>
		<td width="122"><select name=how_out><%=out_select%></select></td>
		<td width="336"><input name=fielder></td>
		<td><input name=score size=10 onfocus='calculate()'></td>
		<td width="40"><input size =5 name=4s></td>
		<td width="40"><input size=5 name=6s></td>
	</tr>
	<tr>
		<td width="236"><select name=batsman1><option>Please Select...</option><%=batsman_select%></select></td>
		<td width="122"><select name=how_out><%=out_select%></select></td>
		<td width="336"><input name=fielder></td>
		<td><input name=score size=10 onfocus='calculate()'></td>
		<td width="40"><input size =5 name=4s></td>
		<td width="40"><input size=5 name=6s></td>
	</tr>
	<tr>
		<td width="236"><select name=batsman1><option>Please Select...</option><%=batsman_select%></select></td>
		<td width="122"><select name=how_out><%=out_select%></select></td>
		<td width="336"><input name=fielder></td>
		<td><input name=score size=10 onfocus='calculate()'></td>
		<td width="40"><input size =5 name=4s></td>
		<td width="40"><input size=5 name=6s></td>
	<tr>
		<td width="236"><select name=batsman1><option>Please Select...</option><%=batsman_select%></select></td>
		<td width="122"><select name=how_out><%=out_select%></select></td>
		<td width="336"><input name=fielder></td>
		<td><input name=score size=10 onfocus='calculate()'></td>
		<td width="40"><input size =5 name=4s></td>
		<td width="40"><input size=5 name=6s></td>
	</tr>
	<tr>
		<td width="236"><select name=batsman1><option>Please Select...</option><%=batsman_select%></select></td>
		<td width="122"><select name=how_out><%=out_select%></select></td>
		<td width="336"><input name=fielder></td>
		<td><input name=score size=10 onfocus='calculate()'></td>
		<td width="40"><input size =5 name=4s></td>
		<td width="40"><input size=5 name=6s></td>
	</tr>
	<tr>
		<td width="236"><select name=batsman1><option>Please Select...</option><%=batsman_select%></select></td>
		<td width="122"><select name=how_out><%=out_select%></select></td>
		<td width="336"><input name=fielder></td>
		<td><input name=score size=10 onfocus='calculate()'></td>
		<td width="40"><input size =5 name=4s></td>
		<td width="40"><input size=5 name=6s></td>
	</tr>
	<tr>
	<td width="236"><select name=batsman1><option>Please Select...</option><%=batsman_select%></select></td>
		<td width="122"><select name=how_out><%=out_select%></select></td>
		<td width="336"><input name=fielder></td>
		<td><input name=score size=10 onfocus='calculate()'></td>
		<td width="40"><input size =5 name=4s></td>
		<td width="40"><input size=5 name=6s></td>
	</tr>
	<tr>
		<td width="236"><select name=batsman1><option>Please Select...</option><%=batsman_select%></select></td>
		<td width="122"><select name=how_out><%=out_select%></select></td>
		<td width="336"><input name=fielder></td>
		<td><input name=score size=10 onfocus='calculate()'></td>
		<td width="40"><input size =5 name=4s></td>
		<td width="40"><input size=5 name=6s></td>
	</tr>
	<tr>
		<td width="236"><select name=batsman1><option>Please Select...</option><%=batsman_select%></select></td>
		<td width="122"><select name=how_out><%=out_select%></select></td>
		<td width="336"><input name=fielder></td>
		<td><input name=score size=10 onfocus='calculate()'></td>
		<td width="40"><input size =5 name=4s></td>
		<td width="40"><input size=5 name=6s></td>
	</tr>
	<tr>
		<td width="236"><select name=batsman1><option>Please Select...</option><%=batsman_select%></select></td>
		<td width="122"><select name=how_out><%=out_select%></select></td>
		<td width="336"><input name=fielder></td>
		<td><input name=score size=10 onfocus='calculate()'></td>
		<td width="40"><input size =5 name=4s></td>
		<td width="40"><input size=5 name=6s></td>
	</tr>
	<tr>
		<td width="236"><select name=batsman1><option>Please Select...</option><%=batsman_select%></select></td>
		<td width="122"><select name=how_out><%=out_select%></select></td>
		<td width="336"><input name=fielder></td>
		<td><input name=score size=10 onfocus='calculate()'></td>
		<td width="40"><input size =5 name=4s></td>
		<td width="40"><input size=5 name=6s></td>
	</tr>
	<tr>
		<td width="236">(Frank) Extras</td>
		<td width="122"></td>
		<td width="336"></td>
		<td><input name=extras size=10 onfocus='calculate()'></td>
		<td width="40"></td>
		<td width="40"></td>
	</tr>
	<tr>
		<td width="236"><B>Total</b></td>
		<td width="122"></td>
		<td width="336"></td>
		<td colspan=3><input READONLY name=total size=10><INPUT type=button name=calc Value='Calculate' onClick='calculate()'></td>
	</tr>
</table>
<%else%>
<table border="0" width="100%" id="table1">
	<tr>
		<td>Batsman</td>
		<td>&nbsp;</td>
		<td>Fielder</td>
		<td>Bowler</td>
		<td><font face="Arial">Score</td>
	</tr>
	<tr>
		<td><input name=batsman1></td>
		<td><select name=how_out><%=out_select%></select></td>
		<td><select name=fielder><option></option><%=batsman_select%></select></td>
		<td>b. <select name=bowler><option></option><%=batsman_select%></select></td>
		<td><input name=score size=5></td>
	</tr>
	<tr>
		<td><input name=batsman1></td>
		<td><select name=how_out><%=out_select%></select></td>
		<td><select name=fielder><option></option><%=batsman_select%></select></td>
		<td>b. <select name=bowler><option></option><%=batsman_select%></select></td>
		<td><input name=score size=5></td>
	</tr>
	<tr>
		<td><input name=batsman1></td>
		<td><select name=how_out><%=out_select%></select></td>
		<td><select name=fielder><option></option><%=batsman_select%></select></td>
		<td>b. <select name=bowler><option></option><%=batsman_select%></select></td>
		<td><input name=score size=5></td>
		<tr>
		<td><input name=batsman1></td>
		<td><select name=how_out><%=out_select%></select></td>
		<td><select name=fielder><option></option><%=batsman_select%></select></td>
		<td>b. <select name=bowler><option></option><%=batsman_select%></select></td>
		<td><input name=score size=5></td>

	</tr>
	<tr>
		<td><input name=batsman1></td>
		<td><select name=how_out><%=out_select%></select></td>
		<td><select name=fielder><option></option><%=batsman_select%></select></td>
		<td>b. <select name=bowler><option></option><%=batsman_select%></select></td>
		<td><input name=score size=5></td>
	</tr>
	<tr>
		<td><input name=batsman1></td>
		<td><select name=how_out><%=out_select%></select></td>
		<td><select name=fielder><option></option><%=batsman_select%></select></td>
		<td>b. <select name=bowler><option></option><%=batsman_select%></select></td>
		<td><input name=score size=5></td>
	</tr>
	<tr>
	<td><input name=batsman1></td>
		<td><select name=how_out><%=out_select%></select></td>
		<td><select name=fielder><option></option><%=batsman_select%></select></td>
		<td>b. <select name=bowler><option></option><%=batsman_select%></select></td>
		<td><input name=score size=5></td>
	</tr>
	<tr>
		<td><input name=batsman1></td>
		<td><select name=how_out><%=out_select%></select></td>
		<td><select name=fielder><option></option><%=batsman_select%></select></td>
		<td>b. <select name=bowler><option></option><%=batsman_select%></select></td>
		<td><input name=score size=5></td>
	</tr>
	<tr>
		<td><input name=batsman1></td>
		<td><select name=how_out><%=out_select%></select></td>
		<td><select name=fielder><option></option><%=batsman_select%></select></td>
		<td>b. <select name=bowler><option></option><%=batsman_select%></select></td>
		<td><input name=score size=5></td>
	</tr>
	<tr>
		<td><input name=batsman1></td>
		<td><select name=how_out><%=out_select%></select></td>
		<td><select name=fielder><option></option><%=batsman_select%></select></td>
		<td>b. <select name=bowler><option></option><%=batsman_select%></select></td>
		<td><input name=score size=5></td>
	</tr>
	<tr>
		<td><input name=batsman1></td>
		<td><select name=how_out><%=out_select%></select></td>
		<td><select name=fielder><option></option><%=batsman_select%></select></td>
		<td>b. <select name=bowler><option></option><%=batsman_select%></select></td>
		<td><input name=score size=5></td>
	</tr>
		<tr>
		<td>(Frank) Extras</td>
		<td></td>
		<td ></td>
		
		<td ></td>
		<td ><input name=extras size=5 onfocus='calculate()'></td>
	</tr>
	<tr>
		<td ><B>Total</b></td>
		<td ></td>
		<td ></td>
		
		<td align=right><INPUT type=button name=calc Value='Calculate' onClick='calculate()'></td>
		<td><input READONLY name=total size=5></td>
	</tr>
</table>
<%end if%>
<p align="center"><input type=submit name=finish value="Submit Scores"></form>
</body>

</html>