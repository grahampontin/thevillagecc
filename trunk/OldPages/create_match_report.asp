<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<link rel="stylesheet" type="text/css" href="./css/default.css" />
<link rel="stylesheet" type="text/css" href="./css/chat.css" />
<title>The Village CC | Match Reports | Create</title>

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

<%  	match_id = Request("match_id")
		password = Request("password")
		
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

		strQuery = "select password from match_reports where match_id = " & match_id
	
		'### Execute the SQL query
		'response.write strQuery & "<br>"
		Set RS_password = Connection.Execute(strQuery)
		
		While Not RS_password.eof 
		 correct_password = RS_password("password")
		rs_password.movenext
		Wend
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
				Create Match Report
			</span><br><br>
			<%If password = correct_password Then%>
			Welcome to the match report portal. Please complete the drop down menus then provide us with as rambling a match report as you like.
			You can use pictures in the same way as you would in the news, just make sure that any images you use are avaiable on a <i>publicly accessible</i> website.
			<br><br>
			<form action=create_match_report_commit.asp method="post" name="form">
			<input type="hidden" name="match_id" value="<%=match_id%>">
			<div id="match_details">
			Was the match abandoned?: <input id=abandoned type="checkbox" name=abandoned value='Yes' onclick=toggle_div('static_fields')>
			<div id="static_fields">
			<table>
			<tr><td>Who won the toss?:<td> <select id="toss" name="toss"><option>Please Select<option>We did<option>They did</select><br>
			<tr><td>What did they do?:<td> <select id="bat_bowl" name="bat_bowl"><option>Please Select<option>Had a bat<option>Had a bowl</select><br><br>
			<tr><td>Weather conditions?:<td> <textarea id="weather" name=weather rows="3" cols="40"></textarea><br>
			<tr><td>Pitch condition?:<td> <textarea id="pitch" name=pitch rows="3" cols="40"></textarea><br>
			</table>
			</div>
			</div>
			<div id="text_editor">
			And that match report...<br>
			<input type="hidden" id="FCKeditor1" name="report" value="" style="display:none" /><input type="hidden" id="FCKeditor1___Config" value="CustomConfigurationsPath=/fckeditor.config.js" style="display:none" /><iframe id="FCKeditor1___Frame" src="/fckeditor/editor/fckeditor.html?InstanceName=FCKeditor1&amp;Toolbar=Default" width="100%" height="500" frameborder="0" scrolling="no"></iframe>
			</div>
			<input type="button" name="go" value="Submit Report" onclick=checkReport()></form>
			<%Else%>
			Sorry, the password you entered is incorrect. If you would like to write this match report contact Village Online at the usual e-mail address.
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