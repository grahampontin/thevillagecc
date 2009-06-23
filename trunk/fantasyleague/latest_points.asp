<html>

<!-- #INCLUDE FILE="./securityInclude/security.asp" -->
<!-- #INCLUDE FILE="./includes/ff_functions.asp" -->
<!-- #INCLUDE FILE="../includes/functions.asp" -->

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
</head>

<body>
<div id="ff_title">
<SPAN id="page_title">Fantasy Fives Home</span><BR>
Your Team</div>
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
	user_id = request("user_id")
	match_id = getLastUpdatedMatchId()
	response.Write(match_id)
	set myTeam = getTeam(match_id, user_id)
	
	%>
	<p align=center>
    <table width=600>
    
	<%arrPlayers = myTeam.keys
	  for each player in arrPlayers %> 
	    <%if player = "batsman1" or player = "bowler1" or player = "all_rounder" then%>
	    <tr>
	    <%end if %>
            <td align=center <% if player = "all_rounder" then %>colspan=2<%end if %>>
                <img height=100 src="<%=getPlayerPhotoURL(myTeam.Item(player)) %>" /><BR />
                <%=getStaticPlayerAttribute("player_name", myTeam.Item(player)) %> <br />
                <%if instr(player, "batsman") then %>
                (<%=getPlayerPoints(myTeam.Item(player), getLastUpdatedMatchId(), 0) %>)<br />
                <img src=./images/cricket_bat.png height=40/><br /></td>
                <%elseif instr(player, "bowler") then%>
                (<%=getPlayerPoints(myTeam.Item(player), getLastUpdatedMatchId(), 1) %>)<br />
                <img src=./images/cricket_ball.jpg height=40/><br />        
                <%else %>
                (<%=getPlayerPoints(myTeam.Item(player), getLastUpdatedMatchId(), 2) %>)<br />
                <img src=./images/cricket_bat.png height=40/><img src=./images/cricket_ball.jpg height=40/><br />        
                <%end if %>
            </td>
        <%if player = "batsman2" or player = "bowler2" or player = "all_rounder" then%>
	    </tr>
	    <%end if %>
	<%next %>
	
	</table>
	</p>
</DIV>	
</body>

</html>