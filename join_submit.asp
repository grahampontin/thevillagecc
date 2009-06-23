<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<link rel="stylesheet" type="text/css" href="./css/default.css" />
<title>The Village CC | Join</title>
</head>

<body>
<%
From=request("Name")
FromAddr=request("E-Mail")
body=request("body")
ability = request("ability")

user_answer=request("user_answer")
actual_answer=request("actual_answer")

Function SendMail(fromAddr, fromName, body)

	Set myMail=CreateObject("CDO.Message")
	myMail.Subject=from & " wants to join the Village!"
	myMail.From="New Joiner<joiners@thevillagecc.org.uk>"
	myMail.To="thevillagecc@gmail.com"
	myMail.HTMLBody="Their email address is " & fromAddr & " and they said this: <BR>"&body&"<BR><BR>Oh and apparently they are " & ability & " at cricket. You can call them on " & request("phone")
	myMail.Send
	set myMail=nothing


End function 


%>
<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
	<tr>
		<td valign="top">
			&nbsp
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
			if user_answer = actual_answer then
			call SendMail(fromAddr, fromName, body)
			%>
			<span id="page_title">Thanks!</span>
			<br><br>
			<p align="left">
				We'll get back to you soon...
				
			</p>
			<%
			else
			'response.write user_answer
			'response.write actual_answer
			
			%>
			<span id="page_title">Whoops!</span>
			<br><br>
			<p align="left">
				Did your maths let you down? Or are you a spam bot trying to sell us porn?
			</p>
			<%
			end if
			%>
			
		<!--body of page ends here -->
		
		</td>
		
		<td valign="top" width="124" id=news_pane>
			<!--#include virtual="./includes/news_shorts.asp"-->
		</td>
	</tr>
	<tr>
		<td align="center" colspan="3">
			<font color="#000000" size="1" face="Arial">
				(c) The Village CC 2004. All Rights reserved
				<br>
				Best viewed at 1024 x 768
			</font>
		</td>
	</tr>
</table>

</body>

</html>