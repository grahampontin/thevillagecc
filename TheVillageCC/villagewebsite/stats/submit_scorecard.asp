<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>New Page 1</title>
<meta name="GENERATOR" content="Microsoft FrontPage 6.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
<link rel="stylesheet" type="text/css" href="../css/default.css"> 
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

function calculateExtras() {
var total = 0;
    for (var i = 0; i<document.myform.elements.length; i++) {
        if (((document.myform.elements[i].name == 'byes') | (document.myform.elements[i].name == 'leg_byes')| (document.myform.elements[i].name == 'no_balls')| (document.myform.elements[i].name == 'penalty')) & (document.myform.elements[i].value != '')) {
            
            total = parseInt(document.myform.elements[i].value) + total;
        }
    }
    document.myform.total_extras.value = total;
	document.myform.extras.value = total;
	calculate();
	

}

function clearZero(thing) {
		if (thing.value == '0') {
			thing.value='';
		}		

}

function submitForm() {
	document.myForm.submit();
}

</script>
<body>

<%
'Get values for <select class=small_select> statements below

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


<p align="center"><b><font face="Arial" size="3"><%=request("which")%> Scorecard for the Village CC <%=request("match")%>
</font></b></p>
<font face="Arial" size=2>
<div class=small_table_text>
<form action=submit_scorecard_commit.asp name=myform method="post">
<input class=small_input type=hidden name=match value="<%=request("match")%>">
<input class=small_input type=hidden name=which value=<%=request("which")%>>
<%if request("which") = "Batting" then%>
<table class="stats_input_table"  width="100%">
	<tr>
		<td>Batsman</td>
		<td>&nbsp;</td>
		<td>Fielder</td>
		<td>Bowler</td>
		<td>Score</td>
		<td width="40">4s</td>
		<td width="40">6s</td>
	</tr>
	<%For i=0 To 10%>
	<tr>
		<td width="236"><select class=small_select name=batsman1><option>Please Select...</option><%=batsman_select%></select></td>
		<td width="122"><select class=small_select name=how_out><%=out_select%></select></td>
		<td width="336"><input class=small_input name=fielder></td>
		<td width="336">b. <input class=small_input name=bowler></td>
		<td><input class=small_input name=score size=10 onfocus="clearZero(this); calculate();" onfocusout="calculate();" value=0 ></td>
		<td width="40"><input class=small_input size =5 name=4s value=0 onfocus="clearZero(this);"></td>
		<td width="40"><input class=small_input size=5 name=6s value=0 onfocus="clearZero(this);"></td>
	</tr>
	<%Next%>
	<tr>
		<td width="236">(Frank) Extras</td>
		<td width="122"></td>
		<td width="336"></td>
		<td><input READONLY class=small_input name=extras size=10 onfocus='calculate()' ></td>
		<td width="40"></td>
		<td width="40"></td>
	</tr>
	<tr>
		<td width="236"><B>Total</b></td>
		<td width="122"></td>
		<td width="336"></td>
		<td colspan=3><input class=small_input READONLY name=total size=10><input class=small_input type=button name=calc Value='Calculate' onClick='calculate()'></td>
	</tr>
</table>
<div id="bowlingstats_input">
<table class="stats_input_table" width="80%">
<tr>
	<td>Bowler</td>
	<td>Overs</td>
	<td>Maidens</td>
	<td>Wickets</td>
	<td>Runs</td>
</tr>
<%For i=0 To 8%>
<tr>
	<td><input class=small_input name=oppo_bowler></td>
	<td><input class=small_input name=overs size="1"></td>
	<td><input class=small_input name=maidens size="1"></td>
	<td><input class=small_input name=wickets size="1"></td>
	<td><input class=small_input name=runs size="1"></td>
</tr>
<%NEXT%>
</table>
</div>
<%else%>
<table class="stats_input_table" width=100%>
	<tr>
		<td>Batsman</td>
		<td>&nbsp;</td>
		<td>Fielder</td>
		<td>Bowler</td>
		<td><font face="Arial">Score</td>
	</tr>
	<% For i=0 To 10%>
	<tr>
		<td><input class=small_input name=batsman1></td>
		<td><select class=small_select name=how_out><%=out_select%></select></td>
		<td><select class=small_select name=fielder><option></option><%=batsman_select%></select></td>
		<td>b. <select class=small_select name=bowler><option></option><%=batsman_select%></select></td>
		<td><input class=small_input name=score size=5 onfocus="clearZero(this); calculate();" onfocusout="calculate();" value=0 ></td>
	</tr>
	<%Next%>
	<tr>
		<td>(Frank) Extras</td>
		<td></td>
		<td ></td>
		
		<td ></td>
		<td ><input READONLY class=small_input name=extras size=5></td>
	</tr>
	<tr>
		<td ><B>Total</b></td>
		<td ></td>
		<td ></td>
		
		<td align=right><input class=small_input type=button name=calc Value='Calculate' onClick='calculate()'></td>
		<td><input class=small_input READONLY name=total size=5></td>
	</tr>
</table>
<div id="bowlingstats_input">
<table class="stats_input_table" width="80%">
<tr>
	<td>Bowler</td>
	<td>Overs</td>
	<td>Maidens</td>
	<td>Wickets</td>
	<td>Runs</td>
</tr>
<%For i=0 To 8%>
<tr>
	<td><select class=small_select name=vcc_bowler><option></option><%=batsman_select%></select></td>
	<td><input class=small_input name=overs size="1"></td>
	<td><input class=small_input name=maidens size="1"></td>
	<td><input class=small_input name=wickets size="1"></td>
	<td><input class=small_input name=runs size="1"></td>
</tr>
<%NEXT%>
</table>
</div>
<%end if%>

<div id="extras">
	<table class="stats_input_table" width="17%">
		<tr>
			<td>Byes</td>
			<td><input class=small_input name=byes size="1" value='0' onfocus="calculateExtras(); clearZero(this);" onfocusout="calculateExtras()"></td>
		</tr>
		<tr>
			<td>Leg Byes</td>
			<td><input class=small_input name=leg_byes size="1" value='0' onfocus="calculateExtras(); clearZero(this);" onfocusout="calculateExtras()"></td>
		</tr>
		<tr>
			<td>Wides</td>
			<td><input class=small_input name=wides size="1" value='0' onfocus="calculateExtras(); clearZero(this);" onfocusout="calculateExtras()"></td>
		</tr>
		<tr>
			<td>No Balls</td>
			<td><input class=small_input name=no_balls size="1" value='0' onfocus="calculateExtras(); clearZero(this);" onfocusout="calculateExtras()"></td>
		</tr>
		<tr>
			<td>Penalty</td>
			<td><input class=small_input name=penalty size="1" value='0' onfocus="calculateExtras(); clearZero(this);" onfocusout="calculateExtras()"></td>
		</tr>
				<tr>
			<td>Total</td>
			<td><input class=small_input name=total_extras size="1" value='0' onfocus="calculateExtras(); clearZero(this);" onfocusout="calculateExtras()"></td>
		</tr>

	</table>
</div>

<div id="fow">
	<table class="stats_input_table" width="100%">
		<tr>
			<td>Fall of Wkt</td>
			<% For i=1 To 10%>
			<td align="center"><%=i%></td>
			<%Next%>
		</tr>
		<tr>
			<td>Score</td>
			<% For i=1 To 10%>
			<td><input name="fow_score" size=1 class="small_input"></td>
			<%Next%>
		</tr>
		<tr>
			<td>Outgoing Bat & Score</td>
			<% For i=1 To 10%>
			<td><input name="fow_outgoingbat" size=1 class="small_input">/<input name="fow_outgoingbat_score" size=1 class="small_input"></td>
			<%Next%>
		</tr>
		<tr>
			<td>No Bat & Score</td>
			<% For i=1 To 10%>
			<td><input name="fow_nobat" size=1 class="small_input">/<input name="fow_nobat_score" size=1 class="small_input"></td>
			<%Next%>
		</tr>
		<tr>
			<td>Partnership</td>
			<% For i=1 To 10%>
			<td><input name="fow_partnership" size=1 class="small_input"></td>
			<%Next%>
		</tr>
		<tr>
			<td>Over No.</td>
			<% For i=1 To 10%>
			<td><input name="fow_over" size=1 class="small_input"></td>
			<%Next%>
		</tr>
	</table>
</div>

</div>

<p align="center"><input class=small_input type=submit name=finish value="Submit Scores" onclick="submitForm();"></form>
</body>

</html>