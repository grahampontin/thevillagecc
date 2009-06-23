<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<link rel="stylesheet" type="text/css" href="./css/default.css" />

<title>The Village CC | Players</title>
<!--#include virtual="./includes/functions.asp"-->
<SCRIPT LANGUAGE="JavaScript" SRC="./stats/CalendarPopup.js"></SCRIPT>
<SCRIPT LANGUAGE="JavaScript" SRC="./includes/javascripts.js"></SCRIPT>

<SCRIPT LANGUAGE="JavaScript">
	var cal = new CalendarPopup();
	cal.showYearNavigation();
	function sortStats(field, order) {
		var current_sort = document.main.sort_by.value
		var current_order = document.main.order.value
		if (field == current_sort) {
			if (current_order == "asc") {
				document.main.order.value = "desc"
			} else {
				document.main.order.value = "asc"
			}
		} else {
			document.main.sort_by.value = field
			if (order == "desc") {
				document.main.order.value = "desc"
			} else {
				document.main.order.value = "asc"
			}
		}
		
		document.main.submit();
		
	}
	
</SCRIPT>


<%		'Get the query string data or set the defaults if there's none.
		
		player_id = Request("player_id")
		
		'Point at the database
		
		accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")
		
		'### Build a dsn-less connection String
		
		ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
		ConnectionString=ConnectionString & "DBQ=" & accessdb
		
		'### Create the ADO Connection object 
		
		Set Connection = Server.CreateObject("ADODB.Connection")
		Connection.Mode = 3
		Connection.Open ConnectionString
		
		If Request("edit_details") = "Save" Then
			Call updateStaticPlayerData("full_name",player_id, request("full_name"))
			Call updateStaticPlayerData("dob",player_id, request("dob"))
			Call updateStaticPlayerData("location",player_id, request("location"))
			Call updateStaticPlayerData("nickname",player_id, request("nickname"))
			Call updateStaticPlayerData("batting_style",player_id, request("batting_style"))
			Call updateStaticPlayerData("bowling_style",player_id, request("bowling_style"))
			Call updateStaticPlayerData("nickname",player_id, request("nickname"))
			Call updateStaticPlayerData("height",player_id, request("height"))
			Call updateStaticPlayerData("education",player_id, request("education"))
			edited = "yes"
		End If
%>
</head>

<body>
	<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
		<tr>
			<td valign="top">
			</td>
			<td valign="top" align=center>
				<IMG src=./images/untitled.jpg>
			</td>
			<td>
				<!--#include virtual="./includes/next_fixture.asp"-->
			</td>
		</tr>
	<tr>
		<td valign="top" rowspan="2" width="118" height="464">
			<!--#include virtual="./includes/sidebar.asp"-->
		</td>
		<td valign="top" height="440" align=center>
		<!-- page body starts here -->
		<%If edited = "yes" Then%>
			<span class=warning>You've just updated stuff, I wouldn't use the forward or back buttons if I were you.</span>
			<br><br>
		<%End If%>
		<div id="player_data">
			<div id="player_name">
			<%=getStaticPlayerAttribute("player_name", player_id)%>
			</div>
			<div id="team">
			The Village CC
			</div>
			<%dob = getStaticPlayerAttribute("dob", player_id)
			  If dob = "unknown" Then
			  years = dob
			  Else 
			  	years = DateDiff("yyyy", dob, Now())
			  	dateTemp = Day(dob)&"/"&Month(dob)&"/"&Year(Now())-1
			  	dateTemp2 = Day(dob)&"/"&Month(dob)&"/"&Year(Now())
			  	
			  	days = DateDiff("D", datetemp, Now())
			  	If days > 365 Then
			  		days = DateDiff("D", datetemp2, Now())
			  	End if
			  	
			  	If DateDiff("D", Day(dob)&"/"&Month(dob)&"/"&Year(Now()), Now()) < 0 Then
			  		years=years-1
			  	End If
			  	
			  End If
			
			%>
			<div id="player_details">
			<table class="small_text">
				<tr><td><b>Full name</b></td><td><%=getStaticPlayerAttribute("full_name", player_id)%></td></tr>
				<tr><td><b>Born</b></td><td><%=dob%>, <%=getStaticPlayerAttribute("location", player_id)%></td></tr>
				<tr><td><b>Current age</b></td><td><%=years&" years "&days&" days"%></td></tr>
				<tr><td><b>Nickname</b></td><td><%=getStaticPlayerAttribute("nickname", player_id)%></td></tr>
				<tr><td><b>Batting style</b></td><td><%=getStaticPlayerAttribute("batting_style", player_id)%></td></tr>
				<tr><td><b>Bowling style</b></td><td><%=getStaticPlayerAttribute("bowling_style", player_id)%></td></tr>
				<tr><td><b>Height</b></td><td><%=getStaticPlayerAttribute("height", player_id)%>cm</td></tr>
				<tr><td><b>Education</b></td><td><%=getStaticPlayerAttribute("education", player_id)%></td></tr>
			</table>
			
			</div>
			<div id="edit_player_details" style="display: none;">
				<form name="form" action="player_detail.asp" method="POST">
					<table class="small_text">
					<%
					full_name =getStaticPlayerAttribute("full_name", player_id)
					nicknames = getStaticPlayerAttribute("nickname", player_id)
					education =getStaticPlayerAttribute("education", player_id)
					
					%>
					<tr><td><b>Full name</b></td><td><input class="small_input" name="full_name" value="<%=full_name%>"></td></tr>
					<tr><td><b>Born</b></td><td><input READONLY class="small_input" name="dob" value='<%=dob%>'>
					<A HREF="#" onClick="cal.select(document.forms['form'].dob,'anchor1','d MMM y'); return false;"  NAME="anchor1" ID="anchor1">
				<img border="0" src="./stats/images/calendar.gif" width="21" height="15"></A>
					, <input class="small_input" size="40" name="location" value='<%=getStaticPlayerAttribute("location", player_id)%>'></td></tr>
					<tr><td><b>Current age</b></td><td><%=years&" years "&days&" days"%></td></tr>
					<tr><td><b>Nickname</b></td><td><input class="small_input" name="nickname" value="<%=nicknames%>"></td></tr>
					<tr><td><b>Batting style</b></td><td><input class="small_input" name="batting_style" value='<%=getStaticPlayerAttribute("batting_style", player_id)%>'></td></tr>
					<tr><td><b>Bowling style</b></td><td><input class="small_input" name="bowling_style" value='<%=getStaticPlayerAttribute("bowling_style", player_id)%>'></td></tr>
					<tr><td><b>Height</b></td><td><input class="small_input" name="height" value='<%=getStaticPlayerAttribute("height", player_id)%>'>cm</td></tr>
					<tr><td><b>Education</b></td><td><input class="small_input" name="education" size="50" value="<%=education%>"></td></tr>
					</table>
					<input type="hidden" name="player_id" value="<%=player_id%>">
					<input type="submit" value="Save" name="edit_details"><input type="button" value="Cancel" onclick="show_div('player_details'); hide_div('edit_player_details')">
				</form>
			</div>
		</div>
		
		<div id="player_photo">
			<img height=230px src='./images/<%=replace(getStaticPlayerAttribute("player_name", player_id)," ", "_")%>.jpg'><br>
			<a class=small_text href=# onclick="hide_div('player_details'); show_div('edit_player_details')">edit my details</a>
		</div>
		
		<div id="stats_tables">
		
		<table class="player_stats_table">
		 <tr class="head_row">
		 	<td colspan="14">Batting and Fielding Stats</td>
		 </tr>
		 <tr class="second_row">
		 	<td></td>
		 	<td>Mat</td>
		 	<td>Inns</td>
		 	<td>NO</td>
		 	<td>Runs</td>
		 	<td>HS</td>
		 	<td>Ave</td>
		 	<td>100</td>
		 	<td>50</td>
		 	<td>4s</td>
		 	<td>6s</td>
		 	<td>Ct</td>
		 	<td>St</td>
		 	<td>RO</td>
		 </tr>
		 
		 <%
			strSQL = "select competition from competitions"
			Set objCompRS = Connection.Execute(strSQL)
			While Not objCompRS.eof
				comp = objCompRS("competition")
			%>
			
		 <tr class="underlined_row">
		 	<td><b><%=comp%></b></td>
		 	<td><%=getPlayerAttribute("matches", "1 January 2000","1 January 2100", player_id, comp)%></td>
		 	<td><%=getPlayerAttribute("inns", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("NO", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("runs", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("HS", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("ave", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("100", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("50", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("4s", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("6s", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("Ct", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("St", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("RO", "1 January 2000","1 January 2100", player_id, comp)%>
		 </tr>
		<%objCompRS.movenext
			wend
		%>
		<tr class="underlined_row">
		 	<td><b>Total</b></td>
		 	<td><%=getPlayerAttribute("matches", "1 January 2000","1 January 2100", player_id, "all")%></td>
		 	<td><%=getPlayerAttribute("inns", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("NO", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("runs", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("HS", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("ave", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("100", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("50", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("4s", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("6s", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("Ct", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("St", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("RO", "1 January 2000","1 January 2100", player_id, "all")%>
		 </tr> 
		
		 
		</table>
		
		<table class="player_stats_table">
		 <tr class="head_row">
		 	<td colspan="14">Bowling Averages</td>
		 </tr>
		 <tr class="second_row">
		 	<td></td>
		 	<td>Mat</td>
		 	<td>Ovs</td>
		 	<td>Runs</td>
		 	<td>Wkts</td>
		 	<td>BBM</td>
		 	<td>Ave</td>
		 	<td>Econ</td>
		 	<td>SR</td>
		 	<td>4</td>
		 	<td>5</td>
		 	<td>10</td>
		 	
		 </tr>
		 
		 <%
			strSQL = "select competition from competitions"
			Set objCompRS = Connection.Execute(strSQL)
			While Not objCompRS.eof
				comp = objCompRS("competition")
			%>
			
		 <tr class="underlined_row">
		 	<td><b><%=comp%></b></td>
		 	<td><%=getPlayerAttribute("matches", "1 January 2000","1 January 2100", player_id, comp)%></td>
		 	<td><%=getPlayerAttribute("Ovs", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("runs_conc", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("Wkts", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("BBM", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("bowl_ave", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("econ", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("SR", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("4fer", "1 January 2000","1 January 2100", player_id, comp)%>
		 	<td><%=getPlayerAttribute("5fer", "1 January 2000","1 January 2100", player_id, comp)%>
			<td><%=getPlayerAttribute("10fer", "1 January 2000","1 January 2100", player_id, comp)%>
		 </tr>
		<%objCompRS.movenext
			wend
		%>
		<tr class="underlined_row">
		 	<td><b>Total</b></td>
		 	<td><%=getPlayerAttribute("matches", "1 January 2000","1 January 2100", player_id, "all")%></td>
		 	<td><%=getPlayerAttribute("Ovs", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("runs_conc", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("Wkts", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("BBM", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("bowl_ave", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("econ", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("SR", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("4fer", "1 January 2000","1 January 2100", player_id, "all")%>
		 	<td><%=getPlayerAttribute("5fer", "1 January 2000","1 January 2100", player_id, "all")%>
			<td><%=getPlayerAttribute("10fer", "1 January 2000","1 January 2100", player_id, "all")%>
		 </tr> 
		
		 
		</table>
		
		</div>
		
		<%'Graph Bit
		
		
		outs_total = 0
		tmpString = ""
		'### Create a SQL query String
		
		strQuery = "SELECT dismissal, count(*) as outs  from batting_scorecards a, how_out b where player_id = "&player_id&" and a.dismissal_id=b.dismissal_id and a.dismissal_id <> 7 group by dismissal"	
		
		'### Execute the SQL query
		Set RS = Connection.Execute(strQuery)
		While Not RS.eof
		  outs_total = outs_total + RS("outs")
		RS.movenext
		Wend
		
		strQuery = "SELECT dismissal, count(*) as outs  from batting_scorecards a, how_out b where player_id = "&player_id&" and a.dismissal_id=b.dismissal_id and a.dismissal_id <> 7 group by dismissal"	
		
		'### Execute the SQL query
		Set RS = Connection.Execute(strQuery)
		Dim arrOuts(10,3)
		counter = 0
		While Not RS.eof
		  arrOuts(counter, 0) = replace(replace(RS("dismissal"), " ", "_"),"not_out", "notout")
		  arrOuts(counter, 1) = Round((RS("outs")/outs_total)*100)
		  counter=counter+1
		RS.movenext
		Wend
		
		For a = 0 To counter
		isit100 = cint(arrOuts(a, 1)) + isit100
		Next
		
		If isit100 <> 100 Then
		arrOuts(counter-1, 1)= arrOuts(counter-1,1) + (100-isit100)
		End if
		
		For a = 0 To counter-1
		tmpString = tmpString & "&" & arrOuts(a, 0) & "=" & arrOuts(a, 1)
		Next
		
		'wickets taken graph
		strQuery = "SELECT dismissal, count(*) as wickets  from bowling_scorecards a, how_out b where bowler_id = "&player_id&" and a.dismissal_id=b.dismissal_id group by dismissal"
		Set RS = Connection.Execute(strQuery)
		wickets_total = 0
		While Not RS.eof
		  wickets_total = wickets_total + RS("wickets")
		RS.movenext
		Wend
		Set RS = Connection.Execute(strQuery)
		
		While Not RS.eof
		  strWicketsGraph = strWicketsGraph + "&" + RS("dismissal") + "=" + cstr(round(RS("wickets")/wickets_total*100, 2))
		RS.movenext
		Wend
		%>
		
<DIV class=stats_pane>
	Analysis
	
	<div class=graph_main>
		<DIV class=graph id=how_out>
  			<%=drawGraph("how_out", player_id)%>
  		</div>  
	</div>

	<div class=graph_main>
  		<DIV class=graph id=runs_scored>
			<%=drawGraph("runs_scored", player_id)%>
		</div>
  	</div>

	<div class=graph_main>
  		<DIV class=graph id=wickets_taken>
			<%=drawGraph("wickets_taken", player_id)%>
		</div>
  	</div>

</div>
		
		
		<!-- body of page ends here -->
		</td>
		<td valign="top" width="124">
			<!--#include virtual="./includes/news_shorts.asp"-->
		</td>
	</tr>
	<tr>
		<td valign="top" height="24" colspan="3" align="center">
			<font color="#000000" size="1" face="Arial">(c) The Village CC 2007, With thanks to Cricinfo.com for the layout. All Rights reserved<br>Best viewed at 1024 x 768 and above and in MS IE6 and above. Apologies to firefox lovers, but I'm not writing two style sheets.</font>
		</td>
	</tr>
</table>

</body>

</html>

