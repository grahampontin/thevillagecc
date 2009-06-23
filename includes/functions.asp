<%' A "connection Object should be globally available to use one of these functions.
  Function getPlayerAttribute(attribute, start_date, end_date, player_id, comps)
	If InStr(comps, ",") > 0 then
		arrComps = Split(comps, ",")
		strCompCondition = " and ("
		For Each comp In arrComps
			strCompCondition = strCompCondition & "or competition ='"&trim(comp)&"' "
		Next
		strCompCondition = strCompCondition & ")"
		strCompCondition = Replace(strCompCondition, "(or", "(")
		strCompCondition = Replace(strCompCondition, " )", ")")
	Else
		If comps = "all" Then
	 		strCompCondition = ""
	 	Else
	 		strCompCondition = " and competition = '"&comps&"' "
	 	End If
	End if
	
  	strEndSQL= "from batting_scorecards a, matches b, competitions c where a.match_id = b.match_id and b.comp_id = c.comp_id and player_id = "&player_id& strCompCondition & " and match_date between #"&start_date&"# and #"&End_date&"# "
  	
  	Select Case attribute  
  	Case "NO"
  		' 0 = not out, 9 = retired hurt
  		strSQL = "select count(*) as no "&strEndSQL&" and (dismissal_id = 0 or dismissal_id = 9)"
  		Set objstatRS = Connection.Execute(strSQL)
  	   getPlayerAttribute = 0 
		While Not objstatRS.eof
  			getPlayerAttribute = objstatRS("no")
  		objstatRS.movenext
  		wend
  	Case "ave"
  		On Error Resume next
  		getPlayerAttribute = round(getPlayerAttribute("runs", start_date, end_date, player_id, comps)/(getPlayerAttribute("inns", start_date, end_date, player_id, comps)-getPlayerAttribute("NO", start_date, end_date, player_id, comps)),2)
  		If Err.Number <> 0 Then
  			Err.Clear
  			getPlayerAttribute = 0
  		End If
  		On Error GoTo 0
  	Case "runs"
  		strSQL = "select sum(score) as runs "&strEndSQL
  		Set objstatRS = Connection.Execute(strSQL)
  		While Not objstatRS.eof
  			getPlayerAttribute = objstatRS("runs")
  		objstatRS.movenext
  		Wend
  			If isnull(getPlayerAttribute) Then
  				getPlayerAttribute = 0
  			End If
  	Case "inns"
  		'7 = did not bat
  		strSQL = "select count(*) as inns "&strEndSQL&" and dismissal_id <> 7"
  		Set objstatRS = Connection.Execute(strSQL)
  		getPlayerAttribute = 0 
		While Not objstatRS.eof
  			getPlayerAttribute = objstatRS("inns")
  		objstatRS.movenext
  		Wend
  	Case "100"
  		strSQL = "select count(*) as 100s "&strEndSQL&" and score >= 100"
  		Set objstatRS = Connection.Execute(strSQL)
  		getPlayerAttribute = 0 
		While Not objstatRS.eof
  			getPlayerAttribute = objstatRS("100s")
  		objstatRS.movenext
  		Wend
  	Case "50"
  		strSQL = "select count(*) as 50s "&strEndSQL&" and score >= 50"
  		Set objstatRS = Connection.Execute(strSQL)
  		getPlayerAttribute = 0 
		While Not objstatRS.eof
  			getPlayerAttribute = objstatRS("50s")
  		objstatRS.movenext
  		Wend
  	Case "HS"
  		strSQL = "select max(score) as HS "&strEndSQL
  		Set objstatRS = Connection.Execute(strSQL)
  		getPlayerAttribute = 0 
		While Not objstatRS.eof
  			getPlayerAttribute = objstatRS("HS")
  		objstatRS.movenext
  		Wend
  			If isnull(getPlayerAttribute) Then
  				getPlayerAttribute = 0
  			End if
	Case "4s"
		strSQL = "select sum([4s]) as total4s "&strEndSQL
		Set objstatRS = Connection.Execute(strSQL)
		getPlayerAttribute = 0 
		While Not objstatRS.eof
			getPlayerAttribute = objstatRS("total4s")
		objstatRS.movenext
		Wend
  			If isnull(getPlayerAttribute) Then
  				getPlayerAttribute = 0
  			End if
	Case "6s"
		strSQL = "select sum([6s]) as total6s "&strEndSQL
		Set objstatRS = Connection.Execute(strSQL)
		getPlayerAttribute = 0 
		While Not objstatRS.eof
			getPlayerAttribute = objstatRS("total6s")
		objstatRS.movenext
		Wend
  			If isnull(getPlayerAttribute) Then
  				getPlayerAttribute = 0
  			End If
	Case "bats"
		strSQL = "select sum([batting at]+1) as bats "&strEndSQL
		Set objstatRS = Connection.Execute(strSQL)
		While Not objstatRS.eof
			temp = objstatRS("bats")
		objstatRS.movenext
		Wend
		On Error Resume Next
		getPlayerAttribute = round(temp / getPlayerAttribute("matches", start_date, end_date, player_id, comps),0)
		If Err.number<>0 Then
			getPlayerAttribute = "12"
		End If
		On Error GoTo 0
		
	Case "matches"
		strSQL = "select count(*) as matches "&strEndSQL
		Set objstatRS = Connection.Execute(strSQL)
		getPlayerAttribute = 0 
		While Not objstatRS.eof
			getPlayerAttribute = objstatRS("matches")
		objstatRS.movenext
		Wend
	Case "Ct"
	    ' 3 = caught
		strSQL = "select count(*) as catches from bowling_scorecards a, matches b, competitions c where a.match_id = b.match_id and b.comp_id = c.comp_id and fielder_id = "&player_id& strCompCondition & " and dismissal_id = 3 and match_date between #"&start_date&"# and #"&End_date&"# "
		Set objstatRS = Connection.Execute(strSQL)
		
		getPlayerAttribute = 0 
		While Not objstatRS.eof
			getPlayerAttribute = objstatRS("catches")
		objstatRS.movenext
		Wend
	Case "St"
		' 5 = stumped
		strSQL = "select count(*) as stumpings from bowling_scorecards a, matches b, competitions c where a.match_id = b.match_id and b.comp_id = c.comp_id and fielder_id = "&player_id& strCompCondition & " and dismissal_id = 5 and match_date between #"&start_date&"# and #"&End_date&"# "
		Set objstatRS = Connection.Execute(strSQL)
		getPlayerAttribute = 0 
		While Not objstatRS.eof
			getPlayerAttribute = objstatRS("stumpings")
		objstatRS.movenext
		Wend
	Case "RO"
		' 4 = run out
		strSQL = "select count(*) as run_outs from bowling_scorecards a, matches b, competitions c where a.match_id = b.match_id and b.comp_id = c.comp_id and fielder_id = "&player_id& strCompCondition & " and dismissal_id = 4 and match_date between #"&start_date&"# and #"&End_date&"# "
		Set objstatRS = Connection.Execute(strSQL)
		getPlayerAttribute = 0 
		While Not objstatRS.eof
			getPlayerAttribute = objstatRS("run_outs")
		objstatRS.movenext
		Wend
	Case "Ovs"
		strSQL = "select sum(overs) as ovs from bowling_stats a, matches b, competitions c where a.match_id = b.match_id and b.comp_id = c.comp_id and player_id = "&player_id& strCompCondition & " and match_date between #"&start_date&"# and #"&End_date&"# "
		Set objstatRS = Connection.Execute(strSQL)
		getPlayerAttribute = 0 
		While Not objstatRS.eof
			getPlayerAttribute = objstatRS("ovs")
		objstatRS.movenext
		Wend
	Case "runs_conc"
		strSQL = "select sum(runs) as runs_conc from bowling_stats a, matches b, competitions c where a.match_id = b.match_id and b.comp_id = c.comp_id and player_id = "&player_id& strCompCondition & " and match_date between #"&start_date&"# and #"&End_date&"# "
		Set objstatRS = Connection.Execute(strSQL)
		getPlayerAttribute = 0 
		While Not objstatRS.eof
			getPlayerAttribute = objstatRS("runs_conc")
		objstatRS.movenext
		Wend
	Case "Wkts"
		strSQL = "select sum(wickets) as wkts from bowling_stats a, matches b, competitions c where a.match_id = b.match_id and b.comp_id = c.comp_id and player_id = "&player_id& strCompCondition & " and match_date between #"&start_date&"# and #"&End_date&"# "
		Set objstatRS = Connection.Execute(strSQL)
		getPlayerAttribute = 0 
		While Not objstatRS.eof
			getPlayerAttribute = objstatRS("wkts")
		objstatRS.movenext
		Wend
	Case "BBM"
		'best bowling figures - the M is for Match as opposed to I for Innings.
		strSQL = "select max(wickets) as how_many from bowling_stats a, matches b, competitions c where a.match_id = b.match_id and b.comp_id = c.comp_id and player_id = "&player_id& strCompCondition & " and match_date between #"&start_date&"# and #"&End_date&"#"
		Set objstatRS = Connection.Execute(strSQL)
		wickets = 0 
		While Not objstatRS.eof
			wickets = objstatRS("how_many")
		objstatRS.movenext
		Wend
		If isnull(wickets) Then
			
			wickets = 0
		End If
		strSQL = "select min(runs) as how_many from bowling_stats a, matches b, competitions c where a.match_id = b.match_id and b.comp_id = c.comp_id and player_id = "&player_id& strCompCondition & " and match_date between #"&start_date&"# and #"&End_date&"# and wickets = "&wickets
		'Response.Write strSQL
		Set objstatRS = Connection.Execute(strSQL)
		getPlayerAttribute = 0 
		While Not objstatRS.eof
			runs = objstatRS("how_many")
		objstatRS.movenext
		Wend
		
		If isnull(runs) Then
  				runs = 0
  		End If
		
		getPlayerAttribute = wickets&"/"&runs
		
	Case "bowl_ave"
		On Error Resume next
		getPlayerAttribute = round(getPlayerAttribute("runs_conc", start_date, end_date, player_id, comps)/getPlayerAttribute("Wkts", start_date, end_date, player_id, comps),2)
		If Err.Number <> 0 Then
			getPlayerAttribute = 0
		End If
		On Error GoTo 0
	Case "econ"
		On Error Resume next
		getPlayerAttribute = round(getPlayerAttribute("runs_conc", start_date, end_date, player_id, comps)/getPlayerAttribute("Ovs", start_date, end_date, player_id, comps),2)
		If Err.Number <> 0 Then
			getPlayerAttribute = 0
		End if
		On Error GoTo 0
	Case "SR"
		On Error Resume next
		getPlayerAttribute = round(getPlayerAttribute("Ovs", start_date, end_date, player_id, comps)*6/getPlayerAttribute("Wkts", start_date, end_date, player_id, comps),2)
		If Err.Number <> 0 Then
			getPlayerAttribute = 0
		End if
		On Error GoTo 0
	Case "4fer"
		strSQL = "select count(*) as how_many from bowling_stats a, matches b, competitions c where a.match_id = b.match_id and b.comp_id = c.comp_id and player_id = "&player_id& strCompCondition & " and match_date between #"&start_date&"# and #"&End_date&"# and wickets >= 4"
		Set objstatRS = Connection.Execute(strSQL)
		getPlayerAttribute = 0 
		While Not objstatRS.eof
			getPlayerAttribute = objstatRS("how_many")
		objstatRS.movenext
		Wend
	Case "5fer"
		strSQL = "select count(*) as how_many from bowling_stats a, matches b, competitions c where a.match_id = b.match_id and b.comp_id = c.comp_id and player_id = "&player_id& strCompCondition & " and match_date between #"&start_date&"# and #"&End_date&"# and wickets >= 5"
		Set objstatRS = Connection.Execute(strSQL)
		getPlayerAttribute = 0 
		While Not objstatRS.eof
			getPlayerAttribute = objstatRS("how_many")
		objstatRS.movenext
		Wend	
	Case "10fer"
		strSQL = "select count(*) as how_many from bowling_stats a, matches b, competitions c where a.match_id = b.match_id and b.comp_id = c.comp_id and player_id = "&player_id& strCompCondition & " and match_date between #"&start_date&"# and #"&End_date&"# and wickets >= 10"
		Set objstatRS = Connection.Execute(strSQL)
		getPlayerAttribute = 0 
		While Not objstatRS.eof
			getPlayerAttribute = objstatRS("how_many")
		objstatRS.movenext
		Wend	
	
	End Select
  	
  	If isnull(getPlayerAttribute) Then
  				getPlayerAttribute = 0
  	End If
  	
  End function 


  Function getStaticPlayerAttribute(attribute, player_id)
  		
  		strSQL = "select " & attribute & " from players where player_id = "&player_id
  		set objPaRS = connection.execute(strSQL)
  		While Not objPaRS.eof
  			getStaticPlayerAttribute = objPaRS(attribute)
  		objPaRS.movenext
  		Wend
  		
  		If IsNull(getStaticPlayerAttribute) Then
  			getStaticPlayerAttribute = "unknown"
  		End if
  		
  End Function


  Function updateStaticPlayerData(field, player_id, value)
  		On Error Resume next
  		strSQL = "update players set "&field&" = '"&replace(value, "'", "''")&"' where player_id = "&player_id 
  		If field = "dob" Then
  			'SPECIAL CASE: we need to use # not '  as the delimiter
  		strSQL = "update players set "&field&" = #"&value&"# where player_id = "&player_id 	
  		End If
  		connection.execute(strSQL)
  		If Err.Number <> 0 And field <> "dob" And value <> "unknown" Then
  			Response.write("Whoops. Something went a bit wrong there. Probably best tell the webmaster.")
  		End If
  		On Error GoTo 0
  End Function


  Function getScore(which, match_id)
	
	If which = "village" Then
		scoreQuery = "select sum(score) as total_score, count(*)-1 as total_out from batting_scorecards where match_id =" &match_id
		outQuery = "select count(*) as total_out from batting_scorecards a, how_out b where a.dismissal_id = b.dismissal_id and dismissal <> 'not out' and dismissal <> 'did not bat' and dismissal <> 'retired hurt' and match_id="&match_id
	Else
		scoreQuery = "select sum(score) as total_score, count(*)-1 as total_out from bowling_scorecards where match_id =" &match_id
		outQuery = "select count(*) as total_out from bowling_scorecards a, how_out b where a.dismissal_id = b.dismissal_id and dismissal <> 'not out' and dismissal <> 'did not bat' and dismissal <> 'retired hurt' and match_id="&match_id
	End If
	
	Set scoreRS = Connection.Execute(scoreQuery)
	Set outRS =  Connection.Execute(outQuery)
	
	While Not outRS.eof
		total_out = outRS("total_out")
	outRS.movenext
	Wend
	
	If Not scoreRS.EOF Then
		If cint(total_out) > 9 Then
			out = ""
		Else
		    out = " for " & CStr(total_out)
		End If
	getScore="(" & CStr(scoreRS("total_score"))& out & ")"
	Else
		getScore = ""
	End If
	
  End Function


  Function getResult(which, match_id)
	
	scoreQuery = "select sum(score) as total_score, count(*)-1 as total_out from batting_scorecards where match_id =" &match_id
	Set VillageScoreRS = Connection.Execute(scoreQuery)
	
	scoreQuery = "select sum(score) as total_score, count(*)-1 as total_out from bowling_scorecards where match_id =" &match_id
	Set OppoScoreRS = Connection.Execute(scoreQuery)
	
	mrQuery = "select filename from match_reports where match_id = "&match_id
	Set mrRS = Connection.Execute(mrQuery)
	
	While Not mrRS.eof
		filename = mrRS("filename")
	mrRS.movenext
	Wend
	
	abQuery = "select * from matches where match_id = "&match_id
	Set abRS = Connection.Execute(abQuery)
	abandoned=0
	While Not abRS.eof
		abandoned = abRS("abandoned")
	abRS.movenext
	Wend
	
	If abandoned <> "1" then
	
		If Not VillageScoreRS.EOF and not OppoScoreRS.EOF Then
		
			If VillageScoreRS("total_score") > OppoScoreRS("total_score") Then
				If which = "home" then
					getResult="beat"
				Else
					getResult="lost to"
				End If
			End If
		
			If VillageScoreRS("total_score") < OppoScoreRS("total_score") Then
				If which = "away" then
					getResult="beat"
				Else
					getResult="lost to"
				End If
			End If
		
			If filename <> "" Then
		 		getResult = "<A href=./view_match_report.asp?match_id="&match_id&" alt='Match Report'>"&getResult&"</a>"
			End If
		
		Else
			getResult = "vs"
		End If
	Else
		If filename <> "" Then
			getResult = "<A href=./view_match_report.asp?match_id="&match_id&" alt='Match Report'>abandoned</a>"
		Else
			getResult = "abandoned"
		End if
	End if
	
End Function


  Function displayScorecard(which, match_id)
	
	If which = "village" then
		strQuery = "SELECT *, 'unknown' as fielder from batting_scorecards a, players b, how_out c where a.player_id=b.player_id and a.dismissal_id=c.dismissal_id and match_id = " & match_id & " order by [batting at]"
	End If
	If which = "oposition" Then
		strQuery = "SELECT a.player_name, dismissal, score, d.player_name as fielder, b.player_name as bowler_name, 0 as 4s, 0 as 6s from bowling_scorecards a, how_out c, players b, players d where a.match_id = " & match_id & " and a.dismissal_id=c.dismissal_id and a.bowler_id=b.player_id and a.fielder_id=d.player_id order by [batting at]"	
	End if
	If which = "bowling" Then
		strQuery = "SELECT * from bowling_stats a, players b where a.player_id = b.player_id and a.match_id = "&match_id
	End if
	Set objRS = Connection.Execute(strQuery)
	
	If which = "village" Or which = "oposition" Then
	'On Error Resume Next
		%>
		<table class=scorecard>
		<tr><td></td><td></td><td></td><td>runs</td><td>4s</td><td>6s</td></tr>
		<%While Not objRS.eof
		If objRS("bowler_name") <> "" Then
		 bowler_name = "b. " & objRS("bowler_name")
		Else
		 bowler_name = ""
		End If
		
		If objRS("dismissal") <> "bowled"  and objRS("dismissal") <> "lbw" And objRS("dismissal") <> "not out" Then
			dismissal = objRS("dismissal") & " ("&objRS("fielder")&")"
		Else
		 	If objRS("dismissal") = "bowled" then
			dismissal = ""
			Else
			dismissal = objRS("dismissal")
			End if
		End If
		
		%>
	 	<tr><td><%=objRS("player_name")%></td><td><%=dismissal%></td><td><%=bowler_name%></td><td><%=objRS("score")%></td><td><%=objRS("4s")%></td><td><%=objRS("6s")%></td></tr>
		<%objRS.movenext
		wend%>
		</table>
		<%
	End If
	
	If which = "bowling" Then
		%><br>
		<table class="scorecard">
		<tr><td>Bowler</td><td>O</td><td>M</td><td>R</td><td>W</td></tr>
		<%
		While Not objRS.eof
		%>
			<tr><td><%=objRS("player_name")%></td><td><%=objRS("overs")%></td><td><%=objRS("maidens")%></td><td><%=objRS("runs")%></td><td><%=objRS("wickets")%></td></tr>
		<%
		objRS.movenext
		Wend
		%>
		</table>
		<%
	End If 
	
	
End Function

Function drawGraph(graph_type, pm_id)
%>	
  	<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	 codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" 
	 WIDTH="280" 
	 HEIGHT="220" 
	 id="charts" 
	 ALIGN="">
		<PARAM NAME=movie VALUE="./graphs/charts.swf?library_path=./graphs/charts_library&xml_source=graph.asp%3Fgraph_type=<%=graph_type%>%26pm_id=<%=pm_id%>">
		<PARAM NAME=quality VALUE=high>
		<PARAM NAME=bgcolor VALUE=#FFFFFF>
		 
		<EMBED src="./graphs/charts.swf?library_path=./graphs/charts_library&xml_source=graph.asp%3Fgraph_type=<%=graph_type%>%26pm_id=<%=pm_id%>" 
		       quality=high 
		       bgcolor=#FFFFFF
		       WIDTH="280" 
		       HEIGHT="220" 
		       NAME="charts" 
		       ALIGN="" 
		       swLiveConnect="true" 
		       TYPE="application/x-shockwave-flash" 
		       PLUGINSPAGE="http://www.macromedia.com/go/getflashplayer">
		</EMBED>
	</OBJECT>
<%	
End function

function playerIDFromName(playerName) 
	strQuery = "SELECT player_id from players where player_name = '"&playerName&"'"	
	Set RS = Connection.Execute(strQuery)
	While Not RS.EOF
		playerIDFromName = RS("player_id")
		RS.MoveNext
	Wend
end function

function dismissalIDFromDescription(dismissal)
	strQuery = "SELECT dismissal_id from how_out where dismissal = '"&dismissal&"'"	
	Set RS = Connection.Execute(strQuery)
	While Not RS.EOF
		dismissalIDFromDescription = RS("dismissal_id")
		RS.MoveNext
	Wend
end function

function costOfMatch(match_id)
	strQuery = "select comp_id from matches where match_id = "&match_id
	Set RS = connection.Execute(strQuery)
	while not RS.EOF
		comp_id = RS("comp_id")
		RS.movenext
	wend
	strQuery = "select priceGBP from competitions where comp_id = "&comp_id
	Set RS = connection.Execute(strQuery)
	while not RS.EOF
		costOfMatch = RS("priceGBP")
		RS.movenext
	wend
end function

function cleanUpMatch(match_id)
	err.clear
	errorsCount=0
	strQuery = "delete * from batting_scorecards where match_id = "&match_id
	'response.write(strQuery)
	Set RS = Connection.Execute(strQuery)
	errorsCount = errorsCount + err.number
	strQuery = "delete * from bowling_scorecards where match_id = "&match_id
	'response.write(strQuery)
	Set RS = Connection.Execute(strQuery)
	errorsCount = errorsCount + err.number
	strQuery = "delete * from extras where match_id = "&match_id
	'response.write(strQuery)
	Set RS = Connection.Execute(strQuery)
	errorsCount = errorsCount + err.number
	strQuery = "delete * from oppo_extras where match_id = "&match_id
	'response.write(strQuery)
	Set RS = Connection.Execute(strQuery)
	errorsCount = errorsCount + err.number
	strQuery = "delete * from fow where match_id = "&match_id
	'response.write(strQuery)
	Set RS = Connection.Execute(strQuery)
	errorsCount = errorsCount + err.number
	strQuery = "delete * from bowling_stats where match_id = "&match_id
	'response.write(strQuery)
	Set RS = Connection.Execute(strQuery)	
	errorsCount = errorsCount + err.number
	strQuery = "delete * from oppo_fow where match_id = "&match_id
	'response.write(strQuery)
	Set RS = Connection.Execute(strQuery)	
	errorsCount = errorsCount + err.number
	strQuery = "delete * from statement where match_id = "&match_id
	Set RS = Connection.Execute(strQuery)	
	'response.write(strQuery)
	errors = errors + err.number
	'response.write("hello")
	
	if errorsCount = 0 then
		response.write("Match Rolled Back Successfully")
	else
		response.write("Roll Back Failed. Fuck it. Best tell the webmaster")
		response.write err.description
	end if
end function

function getPlayerPhotoURL(player_id)
    urlStart = "/images/"
    player_name = getStaticPlayerAttribute("player_name", player_id)
    filename = replace(player_name, " ", "_")+".jpg"
    Set objFSO = CreateObject("Scripting.FileSystemObject")
    If objFSO.FileExists(server.MapPath(urlStart+filename)) then
        getPlayerPhotoURL = urlStart + filename
    else
        getPlayerPhotoURL = urlStart + "annon.jpg"
    end if
end function
%>

