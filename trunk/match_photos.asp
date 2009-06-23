<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<link rel="stylesheet" type="text/css" href="./css/default.css" />
<link rel="stylesheet" type="text/css" href="./css/chat.css" />
<title>The Village CC | Photos</title>


</head>


<body>
<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
	<tr>
		<td id=last_updated>
			
		</td>
		<td valign="top">
			<p align="center">
			<img border="0" src="images\untitled.jpg" width="251" height="121">
			</p>
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
		<%match_id=Request("match_id")%>
		<iframe src="http://www.thevillagecc.homechoice.co.uk/match_photos/<%=match_id%>/index.htm" frameborder=0 border=0 width="100%" height="80%"></iframe>		
		To use a photo on the news pages, browse for it using this <A href="http://www.thevillagecc.homechoice.co.uk/match_photos/<%=match_id%>/images/">link</a>
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