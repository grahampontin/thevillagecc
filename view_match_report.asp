<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<link rel="stylesheet" type="text/css" href="./css/default.css" />
<link rel="stylesheet" type="text/css" href="./css/chat.css" />
<title>The Village CC | Match Report</title>
<!--#include virtual="./includes/functions.asp"-->

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
</script>

</head>

<%      on error resume next 	
'Point at the database
		
		accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")

		'### Build a dsn-less connection string

		ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
		ConnectionString=ConnectionString & "DBQ=" & accessdb

		'### Create the ADO Connection object 

		Set Connection = Server.CreateObject("ADODB.Connection")
		Connection.Mode = 3
		Connection.Open ConnectionString
	
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
		
			
			<%
			
			match_id = Request("match_id")
			strQuery  = "select * from match_reports a, matches b, teams c, venues d where a.match_id = b.match_id and b.oppo_id = c.team_id and d.venue_id = b.venue_id and a.match_id = "&match_id
			Set objRS = Connection.Execute(strQuery)
			
			While Not objRS.eof 
				oposition = objRS("team")
				venue = objRS("venue")
				match_date = objRS("match_date")
				filename = objRS("filename")
			objRS.movenext
			Wend
			
			village_score = getScore("village", match_id)
			oppo_score = getScore("", match_id) 
			result = getResult("home", match_id)
			
			
			Set objFSO = CreateObject("Scripting.FileSystemObject")
		    Set objFile = objFSO.OpenTextFile(Server.MapPath("./match_reports/"&filename), 1)
			match_report = objFile.ReadAll
			
			
			
			%>
			<span id="page_title">
			  The Village CC <%=village_score%>&nbsp <%=result%>&nbsp <%=oposition%>&nbsp <%=oppo_score%>
			</span><br><br>
			<%=match_report%>
			<div class="scorecards">
			<div class=report_title>
				Village innings
			</div>
			<div class="scorecard">
			<%=displayScorecard("village", match_id)%>
			</div>
			<div class="bowling_card">
			<%=displayScorecard("bowling", match_id)%>
			</div>
			<div class=report_title>
				<%=oposition%>&nbsp innings
			</div>
			<div class="scorecard">
			<%=displayScorecard("oposition", match_id)%>
			</div>
			</div>
			
			
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