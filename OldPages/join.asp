<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<link rel="stylesheet" type="text/css" href="./css/default.css" />
<title>The Village CC | Join</title>
</head>

<body>
<%
randomize
rand1=round(rnd()*100)
rand2=round(rnd()*100)
answer=rand1+rand2

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
			
			<span id="page_title">So You Want to Join the Village?</span>
			<br><br>
			<p align="left">
				Just fill in our helpful form below and our esteemed captain will be on the phone. You may also be 
			    added to the official club spam list. Just so you know.
			    <form method="POST" action="./join_submit.asp">
					My name is: <input type="text" name="Name" size="41"><br><br>
					My e-mail address is: <input type="text" name="E-Mail" size="45"><br><br>
					My Phone Number is:<input type="text" name="Phone" size="33"><br><br>
					I am: 	<input type="radio" value="Great" name="Ability">Great
						  	<input type="radio" name="Ability" value="Reasonable">Reasonable
							<input type="radio" name="Ability" value="Poor">Poor
							<input checked type="radio" name="Ability" value="Shocking">Shockingly bad&nbsp;at cricket*<br><br>
					Oh, and I would also like to say:<br>
						<textarea rows="6" name="body" cols="41">
						</textarea><br><br>
						Please answer the following sum**: <%=rand1%>+<%=rand2%>=<input name="user_answer"><br><br>
						<input type=hidden name=actual_answer value=<%=answer%>>
					<input type="submit" value="Submit" name="B1"><input type="reset" value="Reset" name="B2">
				</form>
			<font size="1" color="#000000" face="Arial">
				* Ability is of no consequence to the Village CC<br>
				** This is not a maths test, it's to stop spam bots abusing us.
			</font>
		
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