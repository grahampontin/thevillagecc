<html>

<!-- #INCLUDE FILE="./securityInclude/security.asp" -->
<!-- #INCLUDE FILE="./includes/ff_functions.asp" -->
<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>Village Online | Fantasy Fives | Home</title>
<link rel="stylesheet" type="text/css" href="../css/default.css" />
<link rel="stylesheet" type="text/css" href="./css/ff.css" />
<%Set browserdetect = Server.CreateObject("MSWC.BrowserType")
  ' find some properties of the browser being used to view this page
  browser=browserdetect.Browser
  Response.Write("Browser has identified itself as: " & browser)
  If browser = "IE" or browser = "Netscape" Then
			label = "name"
	Else	
			label = "label"
	End if
%>	
<script language="JavaScript">
	function teamValue() {
		var cost = parseFloat(document.team.batsman1.options[document.team.batsman1.selectedIndex].<%=label%>);
		cost += parseFloat(document.team.batsman2.options[document.team.batsman2.selectedIndex].<%=label%>);
		cost += parseFloat(document.team.all_rounder.options[document.team.all_rounder.selectedIndex].<%=label%>);
		cost += parseFloat(document.team.bowler1.options[document.team.bowler1.selectedIndex].<%=label%>);
		cost += parseFloat(document.team.bowler2.options[document.team.bowler2.selectedIndex].<%=label%>);
		cost = parseInt(cost*100)/100
		
		document.getElementById('team_total_price').innerHTML = "Total Cost: £"+cost+"millon";
		document.getElementById('team_total_price_hidden').value = cost
	}
	
	function createTeam() {
		var batsman1 = document.team.batsman1.options[document.team.batsman1.selectedIndex].innerHTML
		var batsman2 = document.team.batsman2.options[document.team.batsman2.selectedIndex].innerHTML
		var all_rounder = document.team.all_rounder.options[document.team.all_rounder.selectedIndex].innerHTML
		var bowler1 = document.team.bowler1.options[document.team.bowler1.selectedIndex].innerHTML
		var bowler2 = document.team.bowler2.options[document.team.bowler2.selectedIndex].innerHTML
		if ((batsman1 != batsman2) && (batsman1 != all_rounder) && (batsman1 != bowler1) && (batsman1 != bowler2) && (batsman2 != all_rounder) && (batsman2 != bowler1) && (batsman2 != bowler2) && (all_rounder != bowler1) && (all_rounder!=bowler2)&&(bowler1!=bowler2)) {
			if (parseFloat(document.getElementById('team_total_price_hidden').value) < 10) {
				if (document.team.team_name.value != '') {
				document.team.submit();
				 } else {
				 alert("You might want a name for this bunch of world-beaters")
				 }
			} else {
				alert("LESS THAN TEN MILLION YOU FOOL!")
			}
		} else {
			alert("Umm... You know it has to be 5 different players, right?")
		}
	}

</script>
</head>

<body>
<%	'Response.Write(strSQL)
	accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")
	
	'### Build a dsn-less connection String
	
	ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
	ConnectionString=ConnectionString & "DBQ=" & accessdb
	
	'### Create the ADO Connection object 
	Set Connection = Server.CreateObject("ADODB.Connection")
	Connection.Mode = 3
	Connection.Open ConnectionString
	
	user_id = getUserID(Session("username"))
	team_name = getTeamName(user_id)
	next_matchid = getNextMatchID()
	oppo = getOpposition(next_matchid)
	match_date = getMatchDate(next_matchid)
	%>
<div id="ff_title">
<SPAN id="page_title">Fantasy Fives Home</span><br /><%=team_name %></div>
<DIV class=ff_leftnav>
	<!-- #INCLUDE FILE="./includes/ff_menu.asp" -->
	
</div>

<DIV class=ff_center>

<%
	If team_name = "" Then
	'no team created
%>
	<P align=center>Create A Team!</p>
	You have £10 million to spend on your ultimate VCC Fantasy Five. You must select 2 Batsmen, 2 Bowlers
	and 1 all-rounder. Each type of player scores differently so check the "scoring" section before
	committing...
	<BR><BR>
	The next match is against: <%=oppo %> on <%=match_date %>. This will be your team for that game.
	<br /><br />
	<span class="action_message">Transfers are currently free so you can make as many changes as you like until the start of the season.</span>
	<form action=./new_team.asp name=team>
		<TABLE class=input_table>
			<tr>
				<td>Team Name: <td><INPUT type=text name=team_name id=team_name>
			</tr>
			<tr>
				<td>Batsman 1: <td><select name=batsman1 id=batsman1 onchange=teamValue()><%=listFFPlayers()%></select>
			</tr>
			<tr>
				<td>Batsman 2: <td><select name=batsman2 id=batsman2 onchange=teamValue()><%=listFFPlayers()%></select>
			</tr>
			<tr>
				<td>All Rounder: <td><select name=all_rounder id=all_rounder onchange=teamValue()><%=listFFPlayers()%></select>
			</tr>
			<tr>
				<td>Bowler 1: <td><select name=bowler1 id=bowler1 onchange=teamValue()><%=listFFPlayers()%></select>
			</tr>
			<tr>
				<td>Bowler 2: <td><select name=bowler2 id=bowler2 onchange=teamValue()><%=listFFPlayers()%></select>
			</tr>
		</table>
		<BR><BR><div id=team_total_price name=team_total_price></div><BR>
		<INPUT name=team_total_price_hidden id=team_total_price_hidden type=hidden>
		<input type=hidden name="match_id" value=<%=next_matchid %> />
		<INPUT type=button name=create_team value="Create my Fantasy Team!" onclick=createTeam()>
		
	</form>  
	
<%
	Else
%>
Next match: Village VS <%=getOpposition(getNextMatchID()) %><br /><br />
Choose from the links on the left to manage your team.
<%End If%>
</div>

</body>

</html>