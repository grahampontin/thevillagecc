<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<link rel="stylesheet" type="text/css" href="./css/default.css" />
<link rel="stylesheet" type="text/css" href="./css/chat.css" />
<title>The Village CC | Match Reports</title>

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

<%  	On Error Resume next
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

		strQuery = "select * from match_reports a, matches b, teams c where a.match_id = b.match_id and b.oppo_id = c.team_id and a.password <> '' and a.filename is null" 	
	
		'### Execute the SQL query
		'response.write strQuery & "<br>"
		Set RS_matches_to_create = Connection.Execute(strQuery)
		
		strQuery = "select * from match_reports a, matches b, teams c where a.match_id = b.match_id and b.oppo_id = c.team_id and a.password <> '' and a.filename <> '' order by match_date asc" 	
	    Set RS_created_matches = Connection.Execute(strQuery)
		
		
		 If Request("enable") = "Set Password" and request("password") = "victushonor" Then
		  strSQL = "insert into match_reports (match_id, password) select "&Request("match_id")&", '"&Request("new_password")&"'"
		  connection.execute(strSQL)
		  If Err.number<> 0 Then
		  strSQL = "update match_reports set password = '"&Request("new_password")&"' where match_id = "&Request("match_id")
		  connection.execute(strSQL)
		  End If
		  'Response.Write strSQL
		 End If
			
		
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
				Match Reports
			</span><br><br>
			As if the page name didn't give it away, here you can find very exciting match reports for all our completed matches since
			the beginning of the 2007 season.
			<br><br>
			<% If Not (RS_matches_to_create.eof And RS_matches_to_create.bof) then
			Response.Write("<div id='matches_to_create'>Reports awaiting creation:")
			Response.Write("<table id='mtc_table'>")
			Response.Write("<TR><th>Fixture<th>Date<th> &nbsp </th></TR>")
			
			While Not RS_matches_to_create.eof
				Response.Write("<TR><td>The Village CC vs "&RS_matches_to_create("team")&"<td>"&RS_matches_to_create("match_date")&"<td><span id=create_link_"&RS_matches_to_create("match_id")&"><a href=# onclick=""show_div('input_"&RS_matches_to_create("match_id")&"'); hide_div('create_link_"&RS_matches_to_create("match_id")&"')"">create</a></span><span style='display: none; padding-left: 20px;' id=input_"&RS_matches_to_create("match_id")&"><form action=./create_match_report.asp method=POST><input type=hidden name=match_id value="&RS_matches_to_create("match_id")&"><input name=password type=password id=password_"&RS_matches_to_create("match_id")&" value='enter password' onfocus=clearDefaultContents('password_"&RS_matches_to_create("match_id")&"')><input type=submit value=go></form></span></td></TR>")
				
				RS_matches_to_create.movenext
			Wend
			
			Response.Write("</table><div class=right_aligned_small><a href=# onclick=hide_div('matches_to_create');>hide this</a></div></div>")
			
			End If
			%>
			<div id="created_matches">
			<% If Not (RS_created_matches.eof And RS_matches_to_create.bof) then
			Response.Write("<div id='created_matches'>")
			Response.Write("<table id='reports_table'>")
			Response.Write("<TR><th>Fixture<th>Date<th> &nbsp </th><th> &nbsp </th></TR>")
			
			While Not RS_created_matches.eof
				Response.Write("<TR><td>The Village CC vs "&RS_created_matches("team")&"<td>"&RS_created_matches("match_date")&"<td><span class=view_link><a class=small_link href=view_match_report.asp?match_id="&RS_created_matches("match_id")&">report</a></span></td><TD>")
				If RS_created_matches("photos") = 1 Then%>
				<a class="small_link" href='./match_photos.asp?match_id=<%=RS_created_matches("match_id")%>'>photos</a>
				<%End If
				
				Response.Write("</td></TR>")
				
				RS_created_matches.movenext
			Wend
			%>
			</table>
			<%Response.Write("<div class=right_aligned_small><a href=# onclick=show_div('admin');>admin</a></div></div>")%>
			
			<%			
			End If
			%>
				<div id="admin" style="display: none;">
					
					<form action="./match_reports.asp" method="post">
						Match:<Select name=match_id>
						<%
						  strSQL = "select match_id, team, match_date from matches a, teams b where a.oppo_id = b.team_id and match_date between #1 May 2007# and #"&formatDateTime(dateadd("d",7,Now()),1)&"# and match_id not in (select match_id from match_reports where password <> '') order by match_date asc"
						  
						  Set objMatches = connection.Execute(strSQL)
						  While Not objMatches.eof
						%>
						  <option value='<%=objMatches("match_id")%>'><%=objMatches("team")&" ("&objMatches("match_date")&")"%></option>
					<%
						  objMatches.movenext
						  Wend
					%>
						</select>
						<br>
						Set Password to:<input name="new_password"><br>
						Admin Password:<input name="password" type="password"><br>
						<input type="submit" name="enable" value="Set Password">
					</form>
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