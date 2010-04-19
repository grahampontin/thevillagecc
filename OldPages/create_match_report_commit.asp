<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<link rel="stylesheet" type="text/css" href="./css/default.css" />
<link rel="stylesheet" type="text/css" href="./css/chat.css" />
<title>The Village CC | Match Reports | Save</title>

<script language="JavaScript">
function checkForm() {
 if (document.form.security_code.value == "" || document.form.user.value == "" || document.form.user.value=="Type your name here") {
  alert('Please enter a name of some description and then the matching code below if you are not a bot trying to sell drugs to village cricketers.');
  } else {
  postComment();
  }
}
function clearDefault(el) {
  if (el.defaultValue==el.value) el.value = ""
}
function generateSecurityCode(security_code) {
  document.form.security_code.value= security_code;
}
function randomString(el) {
	var chars = "abcdefghiklmnopqrstuvwxyz";
	var string_length = 5;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	el.value = randomstring;
}
function showAllEntries() {
					     xmlHttp=GetXmlHttpObject()
                       if (xmlHttp==null)
                          {
                           alert ("Browser does not support HTTP Request")
                           return
                          } 
                          var url="./form/guestbook.htm"
                          xmlHttp.onreadystatechange=stateChanged
                          xmlHttp.open("GET",url,true)
                          xmlHttp.send(null)
      }
function postComment() {
                      xmlHttp=GetXmlHttpObject()
                       if (xmlHttp==null)
                          {
                           alert ("Browser does not support HTTP Request")
                           return
                          } 
                          var url="./guestbook_submit.asp"
                          url=url+"?comment="+document.form.Comment.value+"&user="+document.form.user.value
                          url=url+"&sid="+Math.random()
                          xmlHttp.onreadystatechange=stateChanged
                          xmlHttp.open("GET",url,true)
                          xmlHttp.send(null)
      }
function stateChanged() 
          { 
            
            if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
          { 
            document.getElementById('entries').innerHTML=xmlHttp.responseText;
          } 
          }
function GetXmlHttpObject(handler)

        { 
         var objXMLHttp=null
         if (window.XMLHttpRequest)
        {
         objXMLHttp=new XMLHttpRequest()
         
        }
         else if (window.ActiveXObject)
        {
         objXMLHttp=new ActiveXObject("Microsoft.XMLHTTP")
        }
           return objXMLHttp
     } 
     
function hide_div(div_id) {
   	mydiv = document.getElementById(div_id)
   	mydiv.style.display = 'none'
}

function show_div(div_id) {
   	mydiv = document.getElementById(div_id)
   	mydiv.style.display = ''
}
function clearDefaultContents(object) {
	myinput = document.getElementById(object)
	if (myinput.value == 'enter password') {
		myinput.value = ''
	}
}

function toggle_div(object) {
	mydiv = document.getElementById(object)
	if (mydiv.style.display == '') {
		hide_div(object)
	} else {
		show_div(object)
	}
}

function checkReport() {
	toss = document.getElementById('toss')
	abandoned = document.getElementById('abandoned')
	if (toss.selectedIndex == 0 && abandoned.checked == false) {
		alert("Who won the toss?")
		return
	} 
	bat_bowl = document.getElementById('bat_bowl')
	if (bat_bowl.selectedIndex == 0  && abandoned.checked == false) {
		alert("Umm, could you maybe remember what happened after the toss?")
		return
	}
	
	if (document.getElementById('weather').value == ''  && abandoned.checked == false) {
		alert("Was it a nice day? Or was it pissing it down?")
		return
	}
	if (document.getElementById('pitch').value == ''  && abandoned.checked == false) {
		alert("How about that wicket? Green top? Blowtorched?")
		return
	}
	
	document.form.submit()
	
}
</script>

</head>

<%  	report = Request("report")
		match_id = Request("match_id")
		bat_bowl = request("bat_bowl")
		toss = request("toss")
		weather = request("weather")
		pitch = request("pitch")
		abandoned = Request("abandoned")
%>		
    
		
<body>

<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">

	<tr>
		<td id=last_updated>
			
		</td>
		<td valign="top" align="center">
			<img border="0" src="images\untitled.jpg" width="251" height="121">
		</td>
		<td id=next_fixture>
				<!--#include virtual="./includes/next_fixture.asp"-->
		</td>
	</tr>
	
	<tr>
		<td valign="top" width="118" align="center" id="links_pane">
			<!--#include virtual="./includes/sidebar.asp"-->	
		</td>
		
		<td valign="top" align='center'>
		
		<!--Body of page starts here -->
		
			<span id="page_title">
				Create Match Report | Save
			</span><br><br>
			<%If report="" then%>
			It doesn't look like you typed anything in the report section. That was a touch foolish since
			you're supposed to be creating a match report. Try using you BACK button and telling us a little
			something about the game, or indeed what happened if it was abandoned.
			<%Else%>
			
	<%    'Point at the database
		
		accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")

		'### Build a dsn-less connection String

		ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
		ConnectionString=ConnectionString & "DBQ=" & accessdb

		'### Create the ADO Connection object 

		Set Connection = Server.CreateObject("ADODB.Connection")
		Connection.Mode = 3
		Connection.Open ConnectionString
	
		'### Create a SQL query String

		strQuery = "select * from match_reports a, matches b, teams c where a.match_id=b.match_id and b.oppo_id = c.team_id and a.match_id = " & match_id
	
		'### Execute the SQL query
		'response.write strQuery & "<br>"
		Set RS = Connection.Execute(strQuery)
		
		While Not RS.eof 
		 filename = RS("filename")
		 rs.movenext
		Wend
		
		If filename <> "" Then
		%>
		Whoops! Looks like this report has already been created. Did you push refresh by any chance? If not then please let the
		webmaster know at the usual village email address.
		<%Else%>
		<%'do the work here	
		  filename = "match_report_"&match_id&".html"
		  Set objFSO = CreateObject("Scripting.FileSystemObject")
		  Set objFile = objFSO.CreateTextFile(server.MapPath("./match_reports/"&filename))
		  objFile.WriteLine("<div id=main_report>")
		  objFile.WriteLine("<div class=report_title>Match Report</div>")
		  objFile.WriteLine(report)
		  objFile.WriteLine("</div><div id=weather_conditions>")
		  objFile.WriteLine("<div class=report_title>Weather Conditions</div>")
		  objFile.WriteLine(weather)
		  objFile.WriteLine("</div><div id=pitch_conditions>")
		  objFile.WriteLine("<div class=report_title>Pitch Condition</div>")
		  objFile.WriteLine(pitch)
		  objFile.WriteLine("</div>")
		  
		  	'update the database With the relevant info
		  	'### Create a SQL query String
			strQuery = "update match_reports set filename = '"&filename&"' where match_id = " & match_id
			'### Execute the SQL query
			Set RS = Connection.Execute(strQuery)
			
			If toss = "We did" Then
				strQuery = "update matches set won_toss = 1 where match_id = " & match_id
			Else
				strQuery = "update matches set won_toss = 0 where match_id = " & match_id
			End If
			Set RS = Connection.Execute(strQuery)
			
			If bat_bowl = "Had a bat" Then
				strQuery = "update matches set batted = 1 where match_id = " & match_id
			Else
				strQuery = "update matches set batted = 0 where match_id = " & match_id
			End If
			Set RS = Connection.Execute(strQuery)
			
			If abandoned = "Yes" Then
				strQuery = "update matches set abandoned = 1 where match_id = " & match_id
			Else
				strQuery = "update matches set abandoned = 0 where match_id = " & match_id
			End If
			
			Set RS = Connection.Execute(strQuery)
			
		%>
		
		
			Congratulations! Your report has been created! You can see it <A href="./view_match_report?match_id=<%=match_id%>">here</a>.	
		<%End If%>
		<%End If%>
		<!--body of page ends here -->
		
		</td>
		
		<td valign="top" width="124" id=news_pane>
			<!--#include virtual="./includes/news_shorts.asp"-->					
		</td>
	</tr>
	<tr>
		<td colspan="3 "valign="top" align="center">
				<font color="#000000" size="1">
					(c) The Village CC 2006. All Rights reserved<br>Best viewed at 1024 x 768 or higher
				</font>
		</td>
	</tr>
</table>

</body>

</html>