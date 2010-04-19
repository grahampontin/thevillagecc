<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<link rel="stylesheet" type="text/css" href="./css/default.css" />

<title>The Village CC | Players</title>
<!--#include virtual="./includes/functions.asp"-->
<SCRIPT LANGUAGE="JavaScript" SRC="./stats/CalendarPopup.js"></SCRIPT>
<SCRIPT LANGUAGE="JavaScript">
	var cal = new CalendarPopup();
	
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
		
		start_date = Request("start_date")
		If start_date = "" Then
			first_time = "yes"
			start_date = "1 April "&Year(Now())
		End If
		End_date = Request("end_date")
		If End_date = "" Then
			end_date = "1 April "&Year(Now())+1
		End If 
		
		comps = Request("match_type")
		'Response.Write comps
			  
		
		
		
		
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

		'strQuery = "SELECT a.player_id, player_name, count(*) as Matches, sum([4s]) as  [Fours hit], sum([6s]) as [Sixes hit], sum(score) as [Total Runs],  sum(score)/count(*) as [Batting Average], 0 as innings, 0 as average, round((sum([batting at]+1))/count(*)) as batting_at    from batting_scorecards a, players b, matches c where a.player_id = b.player_id and a.match_id = c.match_id and player_name <> '' and dismissal_id <> 7 and a.player_id > 0 and c.match_date between #"&start_date&"# and #"&end_date&"# group by  player_name,a.player_id order by sum(score)/count(*) desc"
		strQuery = "select player_id, player_name from players"
		'### Execute the SQL query
		'response.write strQuery & "<br>"
		Set objRS = Connection.Execute(strQuery)
		
		'needed for later - Dim them here rather than in the if statements.
		Dim arrPlayers (100, 17)
		Dim arrSorted(100, 16)
			  
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
		<td valign="top" height="440">
		<!-- page body starts here -->
		<DIV align=center>
		<span id="page_title">Player Stats</span><br><br>
		<div id="stats_filter">
			Select your filters
			<form name="main">
				<input type="radio" name="bowling" value="no" <%if request("bowling")<>"yes" then%>CHECKED<%end If%>>Batting &nbsp &nbsp <input type="radio" name="bowling" value="yes" <%if request("bowling")="yes" then%>CHECKED<%end If%>>Bowling<br>
				<span align=left><BR>
			<%
				strQuery = "select * from competitions"
				Set objcompRS = Connection.Execute(strQuery)
				While Not objcompRS.eof 
					arrComps = Split(comps, ",")
					checked = 0
					For Each comp In arrComps
						If objcompRS("competition") = trim(comp) Then
						checked = 1
						End if
					Next
				If checked = 1 or first_time="yes" Then
				%>
				<input CHECKED type=checkbox name="match_type" value="<%=objcompRS("competition")%>"><%=objcompRS("competition")%> &nbsp
				<%
				Else
				%>
				<input type=checkbox name="match_type" value="<%=objcompRS("competition")%>"><%=objcompRS("competition")%> &nbsp
				<%
				End if
				objcompRS.movenext
				Wend
				If first_time="yes" Then
					comps = "all"
				End if
			%><br><br>
			Between: 
			<input READONLY name=start_date value="<%=start_date%>"> 
			<A HREF="#" onClick="cal.select(document.forms['main'].start_date,'anchor1','d MMM y'); return false;"  NAME="anchor1" ID="anchor1">
				<img border="0" src="./stats/images/calendar.gif" width="34" height="21"></A>
	
			and 
			
			<input READONLY name=end_date value="<%=end_date%>">
			<A HREF="#" onClick="cal.select(document.forms['main'].end_date,'anchor1','d MMM y'); return false;"  NAME="anchor1" ID="anchor1">
				<img border="0" src="./stats/images/calendar.gif" width="34" height="21"></A>
	
			
			</span>
			<div class="right_aligned_small">
				<input type="submit" value="Filter Stats">
			</div>
			<input type=hidden name="sort_by" value='<%=request("sort_by")%>'>
			<input type=hidden name="order" value='<%=request("order")%>'>
			
			
			</form>
		</div>
		<%If request("bowling") <> "yes" Then%>
		<table border="1" style="border-collapse: collapse" width="90%" id="table1">
			<tr>
			    <td><b><font face="Arial" size=2>No.</font></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(0,'desc');>Name</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(1,'desc');>Bats</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(2,'asc');>Mat</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(8,'asc');>Inns</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(14,'asc');>NO</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(5,'asc');>Runs</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(15,'asc');>HS</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(6,'asc');>Ave</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(13,'asc');>100</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(7,'asc');>50</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(3,'asc');>4s</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(4,'asc');>6s</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(10,'asc');>Ct</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(11,'asc');>St</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(12,'asc');>RO</a></font></b></td>
				
			
			</tr>
			<%tmpIndex = 0
			  tmpAttribute = 0
			  while not objRS.eof
			  arrPlayers(tmpIndex, 0) = objRS("player_name")
			  arrPlayers(tmpIndex, 1) = getPlayerAttribute("bats", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 2) = getPlayerAttribute("matches", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 3) = getPlayerAttribute("4s", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 4) = getPlayerAttribute("6s", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 5) = getPlayerAttribute("runs", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 6) = getPlayerAttribute("ave", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 7) = getPlayerAttribute("50", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 8) = getPlayerAttribute("inns", start_date, end_date, objRS("player_id"), comps)
			  
			  arrPlayers(tmpIndex, 9) = objRS("player_id")
			  
			  arrPlayers(tmpIndex, 10) = getPlayerAttribute("Ct", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 11) = getPlayerAttribute("St", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 12) = getPlayerAttribute("RO", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 13) = getPlayerAttribute("100", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 14) = getPlayerAttribute("NO", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 15) = getPlayerAttribute("HS", start_date, end_date, objRS("player_id"), comps)
			  
			  
			  tmpIndex = tmpIndex+1
			  objRS.movenext
			  Wend
			  
			  max_player = tmpIndex 
			  
			 'sort the array (horrendous)
			  
			  'by
			  If request("sort_by") = "" Then
			  col = 6
			  Else
			  col = request("sort_by")
			  End If
			  
			  arrPlayers(99, col) = 10000
			  If sort_by = 0 then
			  arrPlayers(99, col) = "zzzzzzzzzz"
			  End if
			  For outer_index = 0 To max_player
			  If request("order")="desc" then
			  max_index = 99
			  Else
			  max_index = 100
			  End If
			  
			  For tmpIndex = 0 To max_player 
			   If request("order")="desc" Then
			       if arrPlayers(tmpindex, col) <= arrPlayers(max_index, col) and arrPlayers(tmpindex, 16) = 0 and arrPlayers(tmpindex, 0) <> "" Then
			       max_index = tmpIndex
                   End If
               else
                   if arrPlayers(tmpindex, col) >= arrPlayers(max_index, col) and arrPlayers(tmpindex, 16) = 0 and arrPlayers(tmpindex, 0) <> "" Then
                   max_index = tmpIndex
                   End If
               End if
              Next
               '16 is either 1 or 0 implying sorted or not 
               arrPlayers(max_index, 16) = 1
               arrSorted(outer_index, 0) = arrPlayers(max_index, 0)
               arrSorted(outer_index, 1) = arrPlayers(max_index, 1)
               arrSorted(outer_index, 2) = arrPlayers(max_index, 2)
               arrSorted(outer_index, 3) = arrPlayers(max_index, 3)
               arrSorted(outer_index, 4) = arrPlayers(max_index, 4)
               arrSorted(outer_index, 5) = arrPlayers(max_index, 5)
               arrSorted(outer_index, 6) = arrPlayers(max_index, 6)
               arrSorted(outer_index, 7) = arrPlayers(max_index, 7)
               arrSorted(outer_index, 8) = arrPlayers(max_index, 8)
               arrSorted(outer_index, 9) = arrPlayers(max_index, 9)
               arrSorted(outer_index, 10) = arrPlayers(max_index, 10)
               arrSorted(outer_index, 11) = arrPlayers(max_index, 11)
               arrSorted(outer_index, 12) = arrPlayers(max_index, 12)
               arrSorted(outer_index, 13) = arrPlayers(max_index, 13)
               arrSorted(outer_index, 14) = arrPlayers(max_index, 14)
               arrSorted(outer_index, 15) = arrPlayers(max_index, 15)
               
              next
                            			  
			  For tmpIndex = 0 To max_player 
			  If arrSorted(tmpIndex, 1) <> "" then
			  %>
			  		
			  <tr>
			    <td <%if tmpindex/2 = round(tmpindex/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=tmpIndex%></font></td>
				<td <%if tmpindex/2 = round(tmpindex/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><a href="./player_detail.asp?player_id=<%=arrSorted(tmpIndex, 9)%>"><%=arrSorted(tmpIndex, 0)%></a></font></td>
				<td <%if tmpindex/2 = round(tmpindex/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 1)%></font></td>
				<td <%if tmpindex/2 = round(tmpindex/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 2)%></font></td>
				<td <%if tmpindex/2 = round(tmpindex/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 8)%></font></td>
				<td <%if tmpindex/2 = round(tmpindex/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 14)%></font></td>
				<td <%if tmpindex/2 = round(tmpindex/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 5)%></font></td>
				<td <%if tmpindex/2 = round(tmpindex/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 15)%></font></td>
				<td <%if tmpindex/2 = round(tmpindex/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 6)%></font></td>
				<td <%if tmpindex/2 = round(tmpindex/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 13)%></font></td>
				<td <%if tmpindex/2 = round(tmpindex/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 7)%></font></td>
				<td <%if tmpindex/2 = round(tmpindex/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 3)%></font></td>
				<td <%if tmpindex/2 = round(tmpindex/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 4)%></font></td>
				<td <%if tmpindex/2 = round(tmpindex/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 10)%></font></td>
				<td <%if tmpindex/2 = round(tmpindex/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 11)%></font></td>
				<td <%if tmpindex/2 = round(tmpindex/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 12)%></font></td>
				
			</tr>
			  
			<%Else
				Response.Write(arrSorted(tmpIndex, 1)&"  ")
			  End if
			  next
			  %>
		</table>
		<%Else%>
		<table border="1" style="border-collapse: collapse" width="90%" id="table1">
			<tr>
			    <td><b><font face="Arial" size=2>No.</font></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(0,'desc');>Name</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(1,'desc');>Mat</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(2,'desc');>Ovs</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(3,'desc');>Runs</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(4,'desc');>Wkts</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(5,'desc');>BBM</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(6,'desc');>Ave</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(7,'desc');>Econ</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(8,'desc');>SR</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(9,'desc');>4</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(10,'desc');>5</a></font></b></td>
				<td><b><font face="Arial" size=2><a href=# onclick=sortStats(11,'desc');>10</a></font></b></td>
			</tr>
		<%tmpIndex = 0
			  tmpAttribute = 0
			  while not objRS.eof
			  arrPlayers(tmpIndex, 0) = objRS("player_name")
			  arrPlayers(tmpIndex, 1) = getPlayerAttribute("matches", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 2) = getPlayerAttribute("Ovs", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 3) = getPlayerAttribute("runs_conc", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 4) = getPlayerAttribute("Wkts", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 5) = getPlayerAttribute("BBM", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 6) = getPlayerAttribute("bowl_ave", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 7) = getPlayerAttribute("econ", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 8) = getPlayerAttribute("SR", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 9) = getPlayerAttribute("4fer", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 10) = getPlayerAttribute("5fer", start_date, end_date, objRS("player_id"), comps)
			  arrPlayers(tmpIndex, 11) = getPlayerAttribute("10fer", start_date, end_date, objRS("player_id"), comps)
			  
			  arrPlayers(tmpIndex, 12) = objRS("player_id")
			  
			  tmpIndex = tmpIndex+1
			  objRS.movenext
			  Wend
			  
			  max_player = tmpIndex 
			  
			  'sort the array (horrendous)
			  
			  'by
			  If request("sort_by") = "" Then
			  col = 7
			  Else
			  col = request("sort_by")
			  End If
			  
			  arrPlayers(99, col) = 10000
			  If sort_by = 0 then
			  arrPlayers(99, col) = "zzzzzzzzzz"
			  End if
			  For outer_index = 0 To max_player
			  If request("order")="desc" then
			  max_index = 99 
			  Else
			  max_index = 100
			  End If
			  
			  For tmpIndex = 0 To max_player 
			   If request("order")="desc" Then
			       if arrPlayers(tmpindex, col) <= arrPlayers(max_index, col) and arrPlayers(tmpindex, 14) = 0 And arrPlayers(tmpindex, 0) <> "" Then
			       max_index = tmpIndex
                   End If
               else
                   if arrPlayers(tmpindex, col) >= arrPlayers(max_index, col) and arrPlayers(tmpindex, 14) = 0 and arrPlayers(tmpindex, 0) <> "" Then
                   max_index = tmpIndex
                   End If
               End if
              Next
               '14 is either 1 or 0 implying sorted or not (fewer columns than the batting sort)
               arrPlayers(max_index, 14) = 1
               arrSorted(outer_index, 0) = arrPlayers(max_index, 0)
               arrSorted(outer_index, 1) = arrPlayers(max_index, 1)
               arrSorted(outer_index, 2) = arrPlayers(max_index, 2)
               arrSorted(outer_index, 3) = arrPlayers(max_index, 3)
               arrSorted(outer_index, 4) = arrPlayers(max_index, 4)
               arrSorted(outer_index, 5) = arrPlayers(max_index, 5)
               arrSorted(outer_index, 6) = arrPlayers(max_index, 6)
               arrSorted(outer_index, 7) = arrPlayers(max_index, 7)
               arrSorted(outer_index, 8) = arrPlayers(max_index, 8)
               arrSorted(outer_index, 9) = arrPlayers(max_index, 9)
               arrSorted(outer_index, 10) = arrPlayers(max_index, 10)
               arrSorted(outer_index, 11) = arrPlayers(max_index, 11)
         	   arrSorted(outer_index, 12) = arrPlayers(max_index, 12)
         	
               
              next
              displayed_player = 0              			  
			  For tmpIndex = 0 To max_player 
			  If arrSorted(tmpIndex, 2) <> "" and arrSorted(tmpIndex, 1) <> "" then
			  displayed_player = displayed_player+1
		%>
		<tr>
			 	<td <%if displayed_player/2 = round(displayed_player/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=displayed_player%></font></td>
				<td <%if displayed_player/2 = round(displayed_player/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><a href="./player_detail.asp?player_id=<%=arrSorted(tmpIndex, 12)%>"><%=arrSorted(tmpIndex, 0)%></a></font></td>
				<td <%if displayed_player/2 = round(displayed_player/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 1)%></font></td>
				<td <%if displayed_player/2 = round(displayed_player/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 2)%></font></td>
				<td <%if displayed_player/2 = round(displayed_player/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 3)%></font></td>
				<td <%if displayed_player/2 = round(displayed_player/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 4)%></font></td>
				<td <%if displayed_player/2 = round(displayed_player/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 5)%></font></td>
				<td <%if displayed_player/2 = round(displayed_player/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 6)%></font></td>
				<td <%if displayed_player/2 = round(displayed_player/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 7)%></font></td>
				<td <%if displayed_player/2 = round(displayed_player/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 8)%></font></td>
				<td <%if displayed_player/2 = round(displayed_player/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 9)%></font></td>
				<td <%if displayed_player/2 = round(displayed_player/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 10)%></font></td>
				<td <%if displayed_player/2 = round(displayed_player/2) Then%>bgcolor=#EEEEEE<%End If%>><font face="Arial" size=2><%=arrSorted(tmpIndex, 11)%></font></td>
				</tr>
		<%
			End if
			next
		%>
		</table>
		
		<%End If%>
		
		
		
		
		
		<!-- body of page ends here -->
		</td>
		<td valign="top" width="124">
			<!--#include virtual="./includes/news_shorts.asp"-->
		</td>
	</tr>
	<tr>
		<td valign="top" height="24" colspan="3" align="center">
			<font color="#000000" size="1" face="Arial">(c) The Village CC 2006. All Rights reserved<br>Best viewed at 1024 x 768 and above.</font>
		</td>
	</tr>
</table>

</body>

</html>

