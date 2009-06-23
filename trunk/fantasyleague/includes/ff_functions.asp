<%	Server.ScriptTimeout = 120
	
	Function getUserID(username)
		
		strQuery = "select user_id from users where username = '"&username&"'"
		set RS = connection.Execute(strQuery)
		While Not RS.eof
			getUserID = RS("user_id")
			rs.movenext
		Wend
		
	End Function
	
	Function getTeamName(user_id)
		
		strQuery = "select team_name from ff_team_overview where user_id = "&user_id
		set RS = connection.Execute(strQuery)
		While Not RS.eof
			getTeamName = RS("team_name")
			rs.movenext
		Wend
		
	End Function
    
    Function getUserName(user_id)
		
		strQuery = "select username from users where user_id = "&user_id
		set RS = connection.Execute(strQuery)
		While Not RS.eof
			getUserName = RS("username")
			rs.movenext
		Wend
		
	End Function
	
	
	
	Function listFFPlayers
		Set browserdetect = Server.CreateObject("MSWC.BrowserType")
		' find some properties of the browser being used to view this page
		browser=browserdetect.Browser
		strQuery = "select player_name, a.player_id, [value] from players a, ff_players b where a.player_id > 0 and a.player_id=b.player_id and [value] > 0 order by player_name"
		set RS = connection.Execute(strQuery)
		If browser = "IE" or browser="Netscape" Then
			label = "name"
		Else	
			label = "label"
		End if
		While Not RS.eof
			listFFPlayers = listFFPlayers&"<option "&label&"='"&rs("value")&"' value='"&rs("player_id")&"' price='price'>"&RS("player_name")&" ("&rs("value")&"m)</option>"
			rs.movenext
		Wend
	End Function
	
	
	Function pointsForMatch(match_id, player_id)
		if didHePlay(player_id, match_id) then
    		
		    On Error Resume next
		    'we don;t mind if this block fails - probably means the function as been run twice - no big deal
		    strSQL = "insert into ff_player_points(match_id, player_id) select "&match_id&","&player_id
		    set RSnothing = connection.Execute(strSQL)
		    On Error goto 0
		    'Get batting data for this match
		    strSQL = "select * from batting_scorecards where match_id = "&match_id&" and player_id = "&player_id
		    set RSbatting = connection.Execute(strSQL)
    		
		    'Get bowling data for this match
		    strSQL = "select * from bowling_stats where match_id = "&match_id&" and player_id = "&player_id
		    set RSbowling = connection.Execute(strSQL)
    		
    		
		    strSQL = "select * from ff_scoring_model"
		    Set RSmodel = connection.Execute(strSQL)
		    points_as_batsman = 0
		    points_as_bowler = 0
		    points_as_all_rounder = 0
		    While Not RSmodel.eof
			    raw_count = 0
			    metric =  RSmodel("metric")
			    multiplier_batsman = RSmodel("points_for_batsman")
			    multiplier_bowler = RSmodel("points_for_bowler")
			    multiplier_all_rounder = RSmodel("points_for_all_rounder")
    			
			    Select Case metric
				    Case "runs_scored"
					    If Not RSbatting.eof then
						    raw_count = RSbatting("score")
					    End if
				    Case "wickets"
					    If Not RSbowling.eof then
						    raw_count = RSbowling("wickets")
					    End if
				    Case "10s"
					    If Not RSbatting.eof then
						    raw_count=Int(RSbatting("score")/10)
					    End if
				    Case "50s"
					    If Not RSbatting.eof then
						    raw_count=Int(RSbatting("score")/50)
					    End if
				    Case "100s"
					    If Not RSbatting.eof then
						    raw_count=Int(RSbatting("score")/100)
					    End if
				    Case "maidens"
					    If Not RSbowling.eof then
						    raw_count= RSbowling("maidens")
					    End if
				    Case "catches"
					    strSQL="select count(*) as raw_count from bowling_scorecards where match_id = "&match_id&" and fielder_id = "&player_id& " and dismissal_id = 3"
					    set RSnothing = connection.Execute(strSQL)
					    While Not RSnothing.eof
						    raw_count = RSnothing("raw_count")
						    rsNothing.movenext
					    wend
				    Case "run_outs"
					    strSQL="select count(*) as raw_count from bowling_scorecards where match_id = "&match_id&" and fielder_id = "&player_id& " and dismissal_id = 4"
					    set RSnothing = connection.Execute(strSQL)
					    While Not RSnothing.eof
						    raw_count = RSnothing("raw_count")
						    rsNothing.movenext
					    wend
    				
				    Case "ducks"
					    'if they scored 0 and actually batted
					    If Not RSbatting.eof then
						    If RSbatting("score") = 0 And RSbatting("dismissal_id") <> 7 Then
							    raw_count = 1
						    Else
							    raw_count = 0
						    End If
					    End if
				    Case "goldies"
					    'we don't have this info currently.
					    raw_count = 0
				    Case "5fers"
					    If Not RSbowling.eof then
						    raw_count = Int(RSbowling("wickets")/5)
					    End if
				    Case "10fers"
					    If Not RSbowling.eof then
						    raw_count = Int(RSbowling("wickets")/10)
					    End If
					Case "3fers"
					    If Not RSbowling.eof then
						    raw_count = Int(RSbowling("wickets")/3)
					    End If
					Case "overs"
					    If Not RSbowling.eof then
						    raw_count = Int(RSbowling("overs"))
					    End If
					Case "runs_con"
					    If Not RSbowling.eof then
						    raw_count = Int(RSbowling("runs"))
					    End If
					Case "not_out"
					    If Not RSbatting.eof then
					        if RSbatting("dismissal_id") = 0 then
						    raw_count = 1
						    end if
					    End If    
				    Case "4s"
					    If Not RSbatting.eof then
						    raw_count = rsbatting("4s")
					    End if 
				    Case "6s"
					    If Not RSbatting.eof then
						    raw_count = rsbatting("6s")
					    End if 
    				
    				
			    End Select 
			    strSQL = "update ff_player_points set "&metric&"="&raw_count&" where match_id = "&match_id&" and player_id = "&player_id
			    'Response.Write(strSQL)	
			    Set RSnothing = connection.Execute(strSQL)
			    points_as_batsman = points_as_batsman + (raw_count * multiplier_batsman)
			    points_as_bowler = points_as_bowler + (raw_count * multiplier_bowler)
			    points_as_all_rounder = points_as_all_rounder + (raw_count * multiplier_all_rounder)
			    RSmodel.movenext
		    Wend
		    strSQL="update ff_player_points set score_as_batsman = "&points_as_batsman&" where match_id = "&match_id&" and player_id = "&player_id 
		    'Response.Write(strSQL)
		    RSnothing = connection.Execute(strSQL)
		    strSQL="update ff_player_points set score_as_bowler = "&points_as_bowler&" where match_id = "&match_id&" and player_id = "&player_id 
		    'Response.Write(strSQL)
		    Set RSnothing = connection.Execute(strSQL)
		    strSQL="update ff_player_points set score_as_all_rounder = "&points_as_all_rounder&" where match_id = "&match_id&" and player_id = "&player_id 
		    'Response.Write(strSQL)
		    Set RSnothing = connection.Execute(strSQL)
    		
		    'return the highest of the values
		    If points_as_batsman > points_as_bowler Then
			    If points_as_batsman > points_as_all_rounder then
				    pointsForMatch = points_as_batsman
			    Else
				    pointsForMatch = points_as_all_rounder
			    End if
		    Else
			    If points_as_bowler > points_as_all_rounder Then
				    pointsForMatch = points_as_bowler
			    Else
				    pointsForMatch = points_as_all_rounder
			    End if
		    End if
    		
		    Set RSnothing = Nothing
		    Set RSbatting = Nothing
		    Set RSbowling = Nothing
		    Set RSmodel = Nothing
        else
            pointsForMatch = 0
        end if
		
	End Function
	
	
	Function valuePlayers()
		strSql = "select * from players where player_id > 0 and active = 1"
		Set RSplayers = connection.Execute(strSQL)
		
		strSql = "select * from matches where match_date < now()"
		Set RSmatches = connection.Execute(strSQL)
		Dim matchCountArray(200)
		While Not RSplayers.eof
			points_for_player = 0
			player_id  = RSplayers("player_id")
			RSmatches.movefirst
			match_count = 0
			While Not RSmatches.eof
				match_id = RSmatches("match_id")
				if didHePlay(player_id, match_id) then
				    points_for_player = points_for_player + pointsForMatch(match_id, player_id)
				    match_count = match_count+1
				end if
				RSmatches.movenext
			Wend
			matchCountArray(player_id) = match_count
			On Error Resume Next
			'this is just to make sure htere's an entry. we don't mind if it fails.
			strSQL="insert into ff_players(player_id) select "&player_id
			RSnothing = connection.Execute(strSQL)
			On Error goto 0
			
			strSQL = "update ff_players set total_points = "&points_for_player&" where player_id = "&player_id
			RSnothing = connection.Execute(strSQL)
			strSQL = "update ff_players set matches_played = "&match_count&" where player_id = "&player_id
			RSnothing = connection.Execute(strSQL)
			
			
			RSplayers.movenext
		Wend
		
		'calculate averages
		strSql = "select * from ff_players where player_id > 0"
		Set RSplayers = connection.Execute(strSQL)
		While Not Rsplayers.eof
			player_id = RSplayers("player_id")
			player_points = RSplayers("total_points")
			player_matches = matchCountArray(player_id)
			if player_matches > 0 then
			    strSQL = "update ff_players set ave_points_per_game = "&round(player_points/player_matches,2)&" where player_id = "&player_id
			else
			    strSQL = "update ff_players set ave_points_per_game = 0 where player_id = "&player_id
			end if
			Response.Write(strSQL&"<BR>")
			RSnothing = connection.Execute(strSQL)
			RSplayers.movenext
		wend
		
		'value players
		strSQL = "select max(ave_points_per_game) as max_ave from ff_players where matches_played > 5"
		RSnothing = connection.Execute(strSQL)
		max_ave = rsnothing("max_ave")
		
		strSql = "select * from ff_players where player_id > 0"
		Set RSplayers = connection.Execute(strSQL)
		strSQL = "select player_id from ff_players where ave_points_per_game = "&max_ave
		Set RSnothing = connection.Execute(strSQL)
		
		While Not Rsplayers.eof
			player_id = RSplayers("player_id")
			player_ave = RSplayers("ave_points_per_game")
			
			player_value = 5000000*(player_ave/max_ave)
			if player_value > 5000000 then
			    player_value = 5000000
			end if
			RSnothing = connection.Execute(strSQL)
			strSQL = "update ff_players set [value] = "&round(player_value/1000000, 2)&" where player_id = "&player_id
			Response.Write(strSQL&"<BR>")
			RSnothing = connection.Execute(strSQL)
			
			RSplayers.movenext
		wend
		
		
	End Function
	
	function didHePlay(player_id, match_id)
	    strQuery = "select * from batting_scorecards where player_id = "&player_id &" and match_id = "&match_id
		set RS = connection.Execute(strQuery)
		if not RS.eof then
		    didHePlay = true
		else
		    didHePlay = false
		end if
	end function
	
	
	
	function getNextMatchID()
	
	    strQuery = "select match_id from matches where match_date in (select min(match_date) from matches where match_date > now())"
		set RS = connection.Execute(strQuery)
		While Not RS.eof
			getNextMatchID = RS("match_id")
			rs.movenext
		Wend
	
	end function
	
	function getLastUpdatedMatchID()
	
	    strQuery = "select match_id from matches where match_date = (select max(match_date) from batting_scorecards a, matches b where a.match_id = b.match_id )"
		set RS = connection.Execute(strQuery)
		While Not RS.eof
			getLastUpdatedMatchID = RS("match_id")
			rs.movenext
		Wend
	
	end function
	
	
	function getOpposition(match_id)
	    
	    strQuery = "select team from matches a, teams b where a.oppo_id=b.team_id and match_id = "&match_id
		set RS = connection.Execute(strQuery)
		While Not RS.eof
			getOpposition = RS("team")
			rs.movenext
		Wend
	    
	end function
	
	function getMatchDate(match_id)
	    strQuery = "select match_date from matches where match_id ="& match_id
		set RS = connection.Execute(strQuery)
		While Not RS.eof
			getMatchDate = RS("match_date")
			rs.movenext
		Wend
	end function
	
	function getCurrentTeam(user_id)
	    strQuery = "select * from ff_teams where user_id = "&user_id&" and added_date in (select max(added_date) from ff_teams where user_id = "&user_id&")"
	    set dictTeam = CreateObject("Scripting.Dictionary")
		set RS = connection.Execute(strQuery)
		batsman = 1
		bowler = 1
		While Not RS.eof
		    player_id = cstr(rs("player_id"))
            if rs("player_type_ID") = 0 then
                if batsman = 1 then
                    call dictTeam.Add("batsman1", player_id)
                    'response.Write("added :" & rs("player_id"))
                    batsman = 2
                else
                    'response.Write("added :" & rs("player_id"))
                    call dictTeam.Add("batsman2", player_id)
                end if
            end if
            
            if rs("player_type_ID") = 1 then
                if bowler = 1 then
                    'response.Write("added :" & rs("player_id"))
                    call dictTeam.Add("bowler1", player_id)
                    bowler = 2
                else
                    'response.Write("added :" & rs("player_id"))
                    call dictTeam.Add("bowler2", player_id)
                end if
            end if
            
            if rs("player_type_ID") = 2 then
                call dictTeam.Add("all_rounder", player_id)
            end if
            		   
			rs.movenext
		Wend
		set getCurrentTeam = dictTeam
	end function
	
		function getTeam(match_id, user_id)
	    strQuery = "select * from ff_teams where user_id = "&user_id&" and match_id = "&match_id&""
	    'response.Write(strQuery)
	    set dictTeam = CreateObject("Scripting.Dictionary")
		set RS = connection.Execute(strQuery)
		batsman = 1
		bowler = 1
		While Not RS.eof
		    'response.Write("hello")
		    player_id = cstr(rs("player_id"))
            if rs("player_type_ID") = 0 then
                if batsman = 1 then
                    call dictTeam.Add("batsman1", player_id)
                    'response.Write("added :" & rs("player_id"))
                    batsman = 2
                else
                    'response.Write("added :" & rs("player_id"))
                    call dictTeam.Add("batsman2", player_id)
                end if
            end if
            
            if rs("player_type_ID") = 1 then
                if bowler = 1 then
                    'response.Write("added :" & rs("player_id"))
                    call dictTeam.Add("bowler1", player_id)
                    bowler = 2
                else
                    'response.Write("added :" & rs("player_id"))
                    call dictTeam.Add("bowler2", player_id)
                end if
            end if
            
            if rs("player_type_ID") = 2 then
                call dictTeam.Add("all_rounder", player_id)
            end if
            		   
			rs.movenext
		Wend
		set getTeam = dictTeam
	end function
	
	function getPlayerValue(player_id)
	    strQuery = "select [value] from ff_players where player_id ="& player_id
		set RS = connection.Execute(strQuery)
		While Not RS.eof
			getPlayerValue = RS("value")
			rs.movenext
		Wend
	end function
	
    function getFFLeagueTable()
        strQuery = "select * from ff_team_overview a, ff_league b where a.user_id = b.user_id order by points desc"
		set getFFLeagueTable = connection.Execute(strQuery)
		
    end function
    
    function getFFScoreModel()
        strQuery = "select * from ff_scoring_model"
		set getFFScoreModel = connection.Execute(strQuery)
		
    end function

    Function listFFPlayersSelected(byval player_id)
        response.Write(player_id)
		Set browserdetect = Server.CreateObject("MSWC.BrowserType")
		' find some properties of the browser being used to view this page
		browser=browserdetect.Browser
		strQuery = "select player_name, a.player_id, [value] from players a, ff_players b where a.player_id > 0 and a.player_id=b.player_id and [value] > 0 order by player_name"
		set RS = connection.Execute(strQuery)
		If browser = "IE" or browser="Netscape" Then
			label = "name"
		Else	
			label = "label"
		End if
		While Not RS.eof
		    if cint(rs("player_id")) = cint(player_id) then
		        listFFPlayersSelected = listFFPlayersSelected&"<option SELECTED "&label&"='"&rs("value")&"' value='"&rs("player_id")&"' price='price'>"&RS("player_name")&" ("&rs("value")&"m)</option>"
		    else
			    listFFPlayersSelected = listFFPlayersSelected&"<option "&label&"='"&rs("value")&"' value='"&rs("player_id")&"' price='price'>"&RS("player_name")&" ("&rs("value")&"m)</option>"
			end if
			rs.movenext
		Wend
	End Function
    
    function getTeamValue(user_id)
        value = 0
        set dictTeam = getCurrentTeam(user_id)
        arrPlayerIDs = dictTeam.Items
        for each player_id in arrPlayerIDs
            value = value + getPlayerValue(player_id)
        next
        getTeamValue = value
    end function
    
    function getMoneyInTheBank(user_id)
        strQuery = "select money_in_bank from ff_team_overview where user_id = "&user_id
		set RS = connection.Execute(strQuery)
		While Not RS.eof
			getMoneyInTheBank = RS("money_in_bank")
			rs.movenext
		Wend
    end function
    
    function getTeamPoints(user_id)
        strQuery = "select points from ff_league where user_id = "&user_id
		set RS = connection.Execute(strQuery)
		getTeamPoints = ""
		While Not RS.eof
			getTeamPoints = RS("points")
			rs.movenext
		Wend
		if getTeamPoints = "" then
		    getTeamPoints = 0 
		end if
    end function
    
    function getTeamPointsForMatch(user_id, match_id)
        strQuery = "select sum(player_score) as score from ff_teams where user_id = "&user_id&" and match_id = "&match_id
		set RS = connection.Execute(strQuery)
		getTeamPointsForMatch = ""
		While Not RS.eof
			getTeamPointsForMatch = RS("score")
			rs.movenext
		Wend
		if getTeamPointsForMatch = "" then
		    getTeamPointsForMatch = 0 
		end if
    end function
    
    function getTransfers(user_id)
        strQuery = "select transfers from ff_team_overview where user_id = "&user_id
		set RS = connection.Execute(strQuery)
		While Not RS.eof
			getTransfers = RS("transfers")
			rs.movenext
		Wend
		if getTransfers = "" then
		    getTransfers = 0
		end if 
    end function
    
    function getTransfersThisWeek(user_id)
        strQuery = "select transfers_this_week from ff_team_overview where user_id = "&user_id
		set RS = connection.Execute(strQuery)
		While Not RS.eof
			getTransfersThisWeek = RS("transfers_this_week")
			rs.movenext
		Wend
		if getTransfersThisWeek = "" then
		    getTransfersThisWeek = 0
		end if 
    end function
    
    function updateFFScores(match_id)
        
        call completeTeams(match_id)
        strQuery = "select distinct player_id from ff_teams where match_id = "&match_id
        set RS = connection.Execute(strQuery)
		While Not RS.eof
		    player_id =RS("player_id")
		    strQuery = "update ff_teams set player_score = "&getPlayerPoints(player_id, match_id, 0)&" where player_type_id = 0 and match_id = "&match_id&" and player_id = "&player_id
		    '
		    set temp = connection.Execute(strQuery)
		    strQuery = "update ff_teams set player_score = "&getPlayerPoints(player_id, match_id, 1)&" where player_type_id = 1 and match_id = "&match_id&" and player_id = "&player_id
		    set temp = connection.Execute(strQuery)
		    strQuery = "update ff_teams set player_score = "&getPlayerPoints(player_id, match_id, 2)&" where player_type_id = 2 and match_id = "&match_id&" and player_id = "&player_id
		    set temp = connection.Execute(strQuery)
		    rs.movenext
		Wend
		
		strQuery = "select distinct user_id from ff_teams"
        set RS = connection.Execute(strQuery)
		While Not RS.eof
		    user_id = RS("user_id")
		    new_score = getTeamPoints(user_id) + getTeamPointsForMatch(user_id, match_id)
		    'response.Write("sa: " & new_score)
		    if isnull(new_score) then
		        new_score = 0
		    end if
		    strQuery = "update ff_league set points = "&new_score&" where user_id ="&user_id
			'response.Write(strQuery)
			setRS2 = connection.Execute(strQuery)
        rs.movenext
		Wend
		
		'## Reset transfers
		strQuery = "update ff_team_overview set transfers_this_week = 0"
		'response.Write(strQuery)
		setRS2 = connection.Execute(strQuery)
		
        
    end function
    
    function completeTeams(match_id)
        
        strQuery = "select distinct user_id from ff_teams"
        set RS = connection.Execute(strQuery)
		While Not RS.eof
			user_id = RS("user_id")
			strQuery = "select player_id from ff_teams where match_id = " & match_id & " and user_id = "&user_id
			set RS2 = connection.Execute(strQuery)
			if RS2.eof then
			    'no players available for this game week. look for the most recently updated team.
			    strSQL = "insert into ff_teams(user_id, match_id, player_type_id, player_id, added_date) select "&user_id&", "&match_id&", player_type_id, player_id, '"&getMatchDate(match_id)&"' from ff_teams where user_id = "&user_id&" and added_date = (select max(added_date) from ff_teams where user_id = "&user_id&" and added_date < #"&getMatchDate(match_id)&"#)" 
			    'response.Write(strSQL)
			    temp = connection.execute(strSQL)
			end if
			rs.movenext
		Wend
        
    end function
    
    function getPlayerPoints(player_id, match_id, player_type_id)
        select case player_type_id
        case 0
            column = "score_as_batsman"
        case 1
            column = "score_as_bowler"
        case 2
            column = "score_as_all_rounder"
        end select
        
        strSQL = "select "&column&" as score from ff_player_points where player_id = "&player_id &" and match_id = "&match_id
        'response.Write(strSQL+"<BR>")
        set RS = connection.execute(strSQL)
        while not RS.eof
            getPlayerPoints = RS("score")
        RS.movenext
        wend
        if getPlayerPoints = "" then
            getPlayerPoints = 0
        end if
    end function
    

%>