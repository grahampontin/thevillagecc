<html>

<!-- #INCLUDE FILE="./securityInclude/security.asp" -->
<!-- #INCLUDE FILE="./includes/ff_functions.asp" -->
<!-- #INCLUDE FILE="../includes/functions.asp" -->

<head>
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
<script language=javascript>
function transferPlayer(player) {
    var temp = "new_"+player+"_value"
    var temp3 = "new_"+player
    var temp2 = player+"_select"
    //alert(temp);
    var oldPlayerValue = parseFloat(document.getElementById(temp).value)
    var oldPlayer = document.getElementById(temp3).value
    
    var newPlayerValue = document.getElementById(temp2).options[document.getElementById(temp2).selectedIndex].<%=label%>
    var newPlayer = document.getElementById(temp2).options[document.getElementById(temp2).selectedIndex].value
    var batsman1 = document.getElementById("batsman1").value
    
    var batsman2 = document.getElementById("batsman2").value
    var all_rounder = document.getElementById("all_rounder").value
    var bowler1 = document.getElementById("bowler1").value
    var bowler2 = document.getElementById("bowler2").value
    if (newPlayer != batsman1 && newPlayer != batsman2 && newPlayer != all_rounder && newPlayer != bowler1 && newPlayer != bowler2) {
        document.getElementById("transfers").innerHTML = parseInt(document.getElementById("transfers_hidden").value)+1
        document.getElementById("transfers_hidden").value = parseInt(document.getElementById("transfers_hidden").value)+1
        
    } else {
        if (oldPlayer != batsman1 && oldPlayer != batsman2 && oldPlayer != all_rounder && oldPlayer != bowler1 && oldPlayer != bowler2) {
    //alert("bah")
        document.getElementById("transfers").innerHTML = parseInt(document.getElementById("transfers_hidden").value)-1
        document.getElementById("transfers_hidden").value = parseInt(document.getElementById("transfers_hidden").value)-1
        } 
    }
    
    
    
    
    document.getElementById(temp).value = newPlayerValue
    document.getElementById(temp3).value = newPlayer
    
    var price_difference =  oldPlayerValue-newPlayerValue
    document.getElementById("team_value").innerHTML = parseInt((parseFloat(document.getElementById("team_value_hidden").value)-price_difference)*100)/100
    document.getElementById("money_in_bank").innerHTML = parseInt((parseFloat(document.getElementById("money_in_bank_hidden").value)+price_difference)*100)/100
    document.getElementById("money_in_bank_hidden").value = parseFloat(document.getElementById("money_in_bank_hidden").value)+price_difference
    document.getElementById("team_value_hidden").value = parseFloat(document.getElementById("team_value_hidden").value)-price_difference
    
    if (parseFloat(document.getElementById("money_in_bank_hidden").value) < 0) {
        document.getElementById("money_in_bank").style.color = "red";
    } else {
        document.getElementById("money_in_bank").style.color = "black";
    }
}


function confirmTransfers() {
		var batsman1 = document.getElementById("new_batsman1").value
		var batsman2 = document.getElementById("new_batsman2").value
		var all_rounder = document.getElementById("new_all_rounder").value
		var bowler1 = document.getElementById("new_bowler1").value
		var bowler2 = document.getElementById("new_bowler2").value
		if ((batsman1 != batsman2) && (batsman1 != all_rounder) && (batsman1 != bowler1) && (batsman1 != bowler2) && (batsman2 != all_rounder) && (batsman2 != bowler1) && (batsman2 != bowler2) && (all_rounder != bowler1) && (all_rounder!=bowler2)&&(bowler1!=bowler2)) {
			if (parseFloat(document.getElementById('money_in_bank_hidden').value) >= 0) {
				var proceed = confirm("You are making:" + document.getElementById("transfers_hidden").value + " transfers. You get 1 free transfer a week, after which transfers cost 10 points each. Don you really want to make these changes?")
				if (proceed) {
				document.transfers.submit();
				 } 
			} else {
				alert("Whoops. You don't have enough cash for that.")
			}
		} else {
			alert("Umm... You know it still has to be 5 different players, right?")
		}
	}

</script>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>Village Online | Fantasy Fives | Home</title>
<link rel="stylesheet" type="text/css" href="../css/default.css" />
<link rel="stylesheet" type="text/css" href="./css/ff.css" />
<%Set browserdetect = Server.CreateObject("MSWC.BrowserType")
  ' find some properties of the browser being used to view this page
  browser=browserdetect.Browser
  If browser = "IE" or browser = "Netscape" Then
			label = "name"
	Else	
			label = "label"
	End if
%>	
</head>

<body>
<div id="ff_title">
<SPAN id="page_title">Fantasy Fives Home</span><BR>
Transfers</div>
<DIV class=ff_leftnav>
	<!-- #INCLUDE FILE="./includes/ff_menu.asp" -->
	
</div>

<DIV class=ff_center>
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
	team_name = Request("team_name")
	user_id = Session("user_id")
	
	if request("action") = "confirm" then
	    'get new team
	    batsman1 = request("batsman1_select")
	    batsman2 = request("batsman2_select")
	    all_rounder = request("all_rounder_select")
	    bowler1 = request("bowler1_select")
	    bowler2 = request("bowler2_select")
	    
	    'get number of transfers
	    transfers = request("transfers_hidden")
	    
	    'get money left
	    money_in_bank = request("money_in_bank_hidden")
	    'get next match id
	    
	    match_id = getNextMatchID()
	    
	    'try to insert the record, if any of them fail then update the existing records
	    
	    errors = 0
	    
	    'check to see if they already have a team for this match - i.e. have made transfers already...
	    strSQL = "delete * from ff_teams where match_id = "&match_id&" and user_id = "&user_id
	    set rs = Connection.execute(strSQL)
	    
	    errors = 0
	    strSQL = "insert into ff_teams(user_id, match_id, player_type_id, player_id) select "&user_id&", "&match_id&", 0, "&batsman1 
	    set rsNothing = connection.Execute(strSQL)
	    errors = errors + err.number
	    strSQL = "insert into ff_teams(user_id, match_id, player_type_id, player_id) select "&user_id&", "&match_id&", 0, "&batsman2 
	    set rsNothing = connection.Execute(strSQL)
	    errors = errors + err.number
	    strSQL = "insert into ff_teams(user_id, match_id, player_type_id, player_id) select "&user_id&", "&match_id&", 2, "&all_rounder 
	    set rsNothing = connection.Execute(strSQL)
	    errors = errors + err.number
	    strSQL = "insert into ff_teams(user_id, match_id, player_type_id, player_id) select "&user_id&", "&match_id&", 1, "&bowler1 
	    set rsNothing = connection.Execute(strSQL)
	    errors = errors + err.number
	    strSQL = "insert into ff_teams(user_id, match_id, player_type_id, player_id) select "&user_id&", "&match_id&", 1, "&bowler2 
	    set rsNothing = connection.Execute(strSQL)
	    errors = errors + err.number
	    
	    if errors <> 0 then
	        response.Write("Fuck it. Something went wrong. Like, properly wrong. You'd best talk to the webmaster.")
	        response.End
	    end if
        
        strSQL = "select transfers_this_week from ff_team_overview where user_id = "&user_id
        set rs = connection.execute(strSQL)
        transfers_this_week = rs("transfers_this_week")
        if transfers_this_week > 0 then
            points_deduction = transfers * 10
        else
            points_deduction = (transfers-1) * 10
        end if
        
        strSQL = "update ff_league set points = "&getTeamPoints(user_id)-points_deduction&" where user_id = "&user_id
        set rs = connection.execute(strSQL)
        
        strSQL = "update ff_team_overview set transfers_this_week = "&transfers+transfers_this_week&" where user_id = "&user_id
        set rs = connection.execute(strSQL)
        
        strSQL ="update ff_team_overview set transfers = "&getTransfers(user_id)+transfers&" where user_id = "&user_id
	    'response.Write strSQL
        set rs = connection.execute(strSQL)
        
        strSQL ="update ff_team_overview set money_in_bank = "&money_in_bank&" where user_id = "&user_id
	    'response.Write strSQL
        set rs = connection.execute(strSQL)
       
        
        response.Write("<font color='red'>Do NOT refresh this page or you will be billed again for your transfers - you have been warned!</font>")    
        
	end if
	
	
	set myTeam = getCurrentTeam(user_id)
	
	%>
	<p align=center>
	Current team value: £<span id="team_value"><%=getTeamValue(user_id) %></span>m<br />
	Money in the Bank: £<span id="money_in_bank"><%=getMoneyInTheBank(user_id) %></span>m<br />
	Transfers: <span id="transfers">0</span><br />
	Transfers made already this week (since last scores update): <%=getTransfersThisWeek(user_id) %> 
	<form action="transfers.asp" method="POST" name="transfers">
	<input name="action" value="confirm" type="hidden"/>
	<input type="hidden" name="money_in_bank_hidden" id="money_in_bank_hidden" value="<%=getMoneyInTheBank(user_id) %>" />
	<input type="hidden" name="team_value_hidden" id="team_value_hidden" value="<%=getTeamValue(user_id) %>" />
	<input type="hidden" name="transfers_hidden" id="transfers_hidden" value="0" />
	
    <table width="600">
    
	<%arrPlayers = myTeam.keys
	  for each player in arrPlayers %>
	  <input type="hidden" id=<%=player%> value=<%=myTeam.Item(player) %> />
	  <input type="hidden" id=<%=player%>_value value=<%=getPlayerValue(myTeam.Item(player)) %> />
	  <input type="hidden" id=new_<%=player%> value=<%=myTeam.Item(player) %> />
	  <input type="hidden" id="new_<%=player%>_value" value=<%=getPlayerValue(myTeam.Item(player)) %> />
	  
	  
	   
	    <%if player = "batsman1" or player = "bowler1" or player = "all_rounder" then%>
	    <tr>
	    <%end if %>
            <td align=center <% if player = "all_rounder" then %>colspan=2<%end if %>>
                <img height=100 src="<%=getPlayerPhotoURL(myTeam.Item(player)) %>" /><BR />
                <select onchange=transferPlayer('<%=player%>') id=<%=player%>_select name=<%=player%>_select>
                <%=listFFPlayersSelected(myTeam.Item(player)) %> 
                </select><br />
                
                <%if instr(player, "batsman") then %>
                <img src=./images/cricket_bat.png height=40/><br /></td>
                <%elseif instr(player, "bowler") then%>
                <img src=./images/cricket_ball.jpg height=40/><br />        
                <%else %>
                <img src=./images/cricket_bat.png height=40/><img src=./images/cricket_ball.jpg height=40/><br />        
                <%end if %>
            </td>
        <%if player = "batsman2" or player = "bowler2" or player = "all_rounder" then%>
	    </tr>
	    <%end if %>
	<%next %>
	
	</table>
	<input type=button name="confirm" value="Confirm Changes" onclick='confirmTransfers();' />
	</form>
	</p>
</DIV>	
</body>

</html>