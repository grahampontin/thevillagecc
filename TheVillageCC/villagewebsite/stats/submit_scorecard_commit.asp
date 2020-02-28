<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>Submit Scorecard</title>
<meta name="GENERATOR" content="Microsoft FrontPage 6.0">
<meta name="ProgId" content="FrontPage.Editor.Document">
</head>
<!--#include virtual="/includes/functions.asp"-->
<!-- #INCLUDE FILE="../fantasyleague/includes/ff_functions.asp" -->
<SCRIPT LANGUAGE="JavaScript" SRC="./CalendarPopup.js"></SCRIPT>
<SCRIPT LANGUAGE="JavaScript">
	var cal = new CalendarPopup();
</SCRIPT>

<%		'On Error Resume Next
		'Get the data from the query string
		on error resume next
		which = request("which")
		
		if which = "Batting" then
			arrBowler = split(Request("bowler"), ",")
			arrFielder = split(Request("fielder"), ",")
			arr4s = split(Request("4s"), ",")
			arr6s = split(Request("6s"), ",")
		elseif which = "Bowling" then
			arrBowler = split(Request("bowler"), ",")
			arrFielder = split(Request("fielder"), ",")
			arrVCCBowlers = split(Request("vcc_bowler"), ",")
			arrOvers = split(Request("overs"), ",")
			arrMaidens = split(Request("maidens"), ",")
			arrWickets = split(Request("wickets"), ",")
			arrRuns = split(Request("runs"), ",")
		end if
		
		arrBatsman = split(Request("batsman1"), ",")
		arrDismissal = split(Request("how_out"), ",")
		arrScore = split(Request("score"), ",")
		
		
		arrMatch = split(request("match"), " ")
		temp = ubound(arrMatch)
		MatchDate = replace(replace(arrMatch(temp), ")", ""), "(", "")
		
		'### FOW Data
		
		arrFOWScore = split(Request("fow_score"), ",")
		arrFOWoutgoingbat = split(Request("fow_outgoingbat"), ",")
		arrFOWoutgoingbat_score = split(Request("fow_outgoingbat_score"), ",")
		arrFOWnobat = split(Request("fow_nobat"), ",")
		arrFOWnobat_score = split(Request("fow_nobat_score"), ",")
		arrFOWpartnership = split(Request("fow_partnership"), ",")
		arrFOWovers = split(Request("fow_over"), ",")
		fow_index = 0
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

		strQuery = "SELECT match_id from matches where cstr(match_date) = '"&MatchDate&"'"	
	
		'### Execute the SQL query
		'response.write strQuery & "<br>"
		Set RS = Connection.Execute(strQuery)

		While Not RS.EOF

			match_id = RS("match_id")
			'response.write(match_id & "<BR>")
			RS.MoveNext

		Wend
		
		'### insert extras and Fow Data
		If which = "Bowling" then
			strQuery = "insert into extras(byes,leg_byes,wides,no_balls,penalty,match_id) select "&Request("byes")&","&Request("leg_byes")&","&Request("wides")&","&Request("no_balls")&","&Request("penalty")&","&match_id	
		Else
			strQuery = "insert into oppo_extras(byes,leg_byes,wides,no_balls,penalty,match_id) select "&Request("byes")&","&Request("leg_byes")&","&Request("wides")&","&Request("no_balls")&","&Request("penalty")&","&match_id			
		End if
		'### Execute the SQL query
		'response.write strQuery & "<br>"
		Set RS = Connection.Execute(strQuery)
		if err.number <> 0 then
			Response.write("An error occurred while trying to update the extras table. The following statement failed:<BR>")
			response.write strQuery & "<br>"
			response.write ("The error was:<BR>")
			response.write err.description&"<BR>"
			call cleanUpMatch(match_id) 
			errorState = "yes"
		else
		
			For Each fowscore In arrFOWscore
				If fowscore <> "" and fowscore <> " " and errorState<>"yes" Then
					If which = "Batting" then
						strQuery = "insert into fow(match_id, wicket, outgoing_bat, outgoing_score, no_bat, no_score, score, partnership, over_no) select "&match_id&", "&fow_index&","&arrFOWoutgoingbat(fow_index)&","&arrFOWoutgoingbat_score(fow_index)&","&arrFOWnobat(fow_index)&","&arrFOWnobat_score(fow_index)&","&arrFOWscore(fow_index)&","&arrFOWpartnership(fow_index)&","&arrFOWovers(fow_index) 
					Else
						strQuery = "insert into oppo_fow(match_id, wicket, outgoing_bat, outgoing_score, no_bat, no_score, score, partnership, over_no) select "&match_id&", "&fow_index&","&arrFOWoutgoingbat(fow_index)&","&arrFOWoutgoingbat_score(fow_index)&","&arrFOWnobat(fow_index)&","&arrFOWnobat_score(fow_index)&","&arrFOWscore(fow_index)&","&arrFOWpartnership(fow_index)&","&arrFOWovers(fow_index) 
					End if
					fow_index = fow_index+1
					'### Execute the SQL query
					'response.write strQuery & "<br>"
					Set RS = Connection.Execute(strQuery)
					if err.number <> 0 then
						Response.write("An error occurred while trying to update the fall of wicket data. The following statement failed:<BR>")
						response.write strQuery & "<br>"
						response.write ("The error was:<BR>")
						response.write err.description
						response.write ("Attempting to roll back previous statements...")
						call cleanUpMatch(match_id) 
						errorState = "yes"
					end if
				End If
			Next
			
					
			'loop through all batsmen
			for counter = 0 to 10
			
				batsman = ltrim(arrBatsman(counter))
				fielder = ltrim(arrFielder(counter))
				score = ltrim(arrScore(counter))
				bowler = ltrim(arrBowler(counter))
				dismissal = ltrim(arrDismissal(counter))
				
				'check score is not empty
				If score = "" Then
					score = 0
				End If
				
				If which="Batting" Then
					'we only record 4s and 6s if its a batting card
					str4s = ltrim(arr4s(counter))
					str6s = ltrim(arr6s(counter))
					'check they're not empty
					If str4s = "" Then
						str4s = 0
					End If
					If str6s = "" Then
						str6s = 0
					End If	
				End if
				
				
				if which="Bowling" then
					fielder = ltrim(arrFielder(counter))
					'reset bower and fielder id's otherwise it holds onto the last numbers - there is not always both - think run outs  or clean bowled.
					bowler_id = 0
					fielder_id = 0
					'get bowler and fielder IDs
					bowler_id = playerIDFromName(bowler) 
					fielder_id = playerIDFromName(fielder) 
					if isnull(bowler_id) or bowler_id = "" then
					    bowler_id = 0
					end if
					if isnull(fielder_id) or fielder_id = "" then
					    fielder_id = 0
					end if
				end if
				
				if which="Batting" then
					'get the batsman's player_id
					player_id = playerIDFromName(batsman) 
				end if
				
				'Get the dismissal type
				dismissal_id = dismissalIDFromDescription(dismissal)
				
				if which = "Batting" then
					strQuery = "insert into batting_scorecards(player_id, dismissal_id, score, [batting at], match_id, bowler_name, fielder_name, 4s, 6s) select "&player_id&", "&dismissal_id&", "&score&", "&counter&", "&match_id&" , '"&bowler&"', '"&fielder&"',"&str4s&", "&str6s	
				end If
				
				If Not(fielder_id = 0 And bowler_id = 0 And batsman = "") AND errorState<>"yes" then
					if which = "Bowling" then
						if fielder_id = 0 then		
							strQuery = "insert into bowling_scorecards(player_name, dismissal_id, score, [batting at], match_id, bowler_id) select '"&batsman&"', "&dismissal_id&", "&score&", "&counter&", "&match_id&" , "&bowler_id	
						elseif bowler_id = 0 then
							strQuery = "insert into bowling_scorecards(player_name, dismissal_id, score, [batting at], match_id, fielder_id) select '"&batsman&"', "&dismissal_id&", "&score&", "&counter&", "&match_id&", " & fielder_id	
						else
							strQuery = "insert into bowling_scorecards(player_name, dismissal_id, score, [batting at], match_id, bowler_id, fielder_id) select '"&batsman&"', "&dismissal_id&", "&score&", "&counter&", "&match_id&" , "&bowler_id&", " & fielder_id	
						end if
					end If
					Set RS = Connection.Execute(strQuery)
					if err.number <> 0 then
						Response.write("An error occurred while trying to update the batting scorecard. The following statement failed:<BR>")
						response.write strQuery & "<br>"
						response.write ("The error was:<BR>")
						response.write err.description & "<BR>"
						response.write ("Attempting to roll back previous statements...<BR>")
						call cleanUpMatch(match_id) 
						errorState = "yes"
					end if
				End if
				
				if which = "Batting" AND errorState <> "yes" then
					strQuery = "insert into statement(player_id, debit, transaction_description, transaction_date, match_id, input_by) select "&player_id&", "&costOfMatch(match_id)&", 'Match on "&MatchDate&"', '"&now()&"', "&match_id&" , 'Stats System'"	
					Set RS = Connection.Execute(strQuery)
					if err.number <> 0 then
						Response.write("An error occurred while trying to update the bank statement. The following statement failed:<BR>")
						response.write strQuery & "<br>"
						response.write ("The error was:<BR>")
						response.write err.description & "<BR>"
						response.write ("Attempting to roll back previous statements...<BR>")
						call cleanUpMatch(match_id) 
						errorState = "yes"
					end if
				end If
			
			Next
			
			'ADD THE EXTRAS ENTRIES TO THE MAIN SCORE CARDS
			If which = "Batting" Then
				strQuery = "insert into batting_scorecards(player_id, dismissal_id, score, [batting at], match_id, bowler_name, 4s, 6s) select -1, -1, "&request("extras")&", 11, "&match_id&" , '', 0, 0"	
			End If
			if which = "Bowling" Then
				strQuery = "insert into bowling_scorecards(player_name, dismissal_id, score, [batting at], match_id, bowler_id) select '(Frank) Extras', -1, "&request("extras")&", 11, "&match_id&" , 0"	
			End If
			if errorState<>"yes" then
				Set RS = Connection.Execute(strQuery)
				if err.number <> 0 then
					Response.write("An error occurred while trying to add the extras to the scorecard. The following statement failed:<BR>")
					response.write strQuery & "<br>"
					response.write ("The error was:<BR>")
					response.write err.description
					response.write ("Attempting to roll back previous statements...")
					call cleanUpMatch(match_id) 
					errorState = "yes"
				end if
			end if
			
			If which = "Bowling" Then
			    i=0
				For Each bowler In arrVCCBowlers
					If Trim(bowler) <> ""  and errorState<>"yes" then
						'Get player_id
						strQuery = "SELECT player_id from players where player_name = '"&trim(bowler)&"'"	
						Set RS = Connection.Execute(strQuery)
						While Not RS.EOF
							player_id = RS("player_id")
							RS.MoveNext
						Wend
						strQuery = "insert into bowling_stats (player_id, match_id, overs, maidens, wickets, runs) select "&player_id&","&match_id&","&arrOvers(i)&","&arrMaidens(i)&","&arrWickets(i)&","&arrRuns(i)
						Set RS = Connection.Execute(strQuery)
						if err.number <> 0 then	
							Response.write("An error occurred while trying to update the bowling stats. The following statement failed:<BR>")
							response.write strQuery & "<br>"
							response.write ("The error was:<BR>")
							response.write err.description
							response.write ("Attempting to roll back previous statements...")
							call cleanUpMatch(match_id) 
							errorState = "yes"
						end if						
					End if
					i = i+1
				next
			End if
		end if
		
		on error goto 0
		'### FFs stuff
		if errorState<>"yes" then
		    'Check to see if we're updated the other card yet....
		    If which = "batting" then 
		        strQuery = "select * from bowling_scorecards where match_id = "&match_id
		        set rs = Connection.Execute(strQuery)
		        if not rs.eof then
		            call valuePlayers()
		            response.write("Completed valuePlayers routine. Updating FFs system")
		            call updateFFScores(match_id)
		            response.write("FF system updated")
		        end if
		    else
		        strQuery = "select * from batting_scorecards where match_id = "&match_id
		        set rs = Connection.Execute(strQuery)
		        if not rs.eof then
		            call valuePlayers()
		            response.write("Completed valuePlayers routine. Updating FFs system")
		            call updateFFScores(match_id)
		            response.write("FF system updated")
		        end if
		    end if 		
		end if
		
		
		'### Clean-up time
		
		on error resume next	
		RS.Close 
		Connection.Close
		set RS = Nothing 
		set Connection = Nothing
		on error goto 0
%>
<body>
<%if errorState <> "yes" then%>
<p align="center"><font face="Arial"><b>Scorecard Added Sucessfully</b></font></p>
<%else%>
<p align="center"><font face="Arial"><b>Failed to Add Score Card</b></font><BR>
Read the above error messages then go <A href=# onclick='history.back()'>back to the scorecard</a> and try again.
</p>
<%end if%>
</body>

</html>