<% @ LANGUAGE=VBScript %>
<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>The Village CC | Statistics</title>
<script language="JavaScript">
<!--
function FP_swapImg() {//v1.0
 var doc=document,args=arguments,elm,n; doc.$imgSwaps=new Array(); for(n=2; n<args.length;
 n+=2) { elm=FP_getObjectByID(args[n]); if(elm) { doc.$imgSwaps[doc.$imgSwaps.length]=elm;
 elm.$src=elm.src; elm.src=args[n+1]; } }
}

function FP_preloadImgs() {//v1.0
 var d=document,a=arguments; if(!d.FP_imgs) d.FP_imgs=new Array();
 for(var i=0; i<a.length; i++) { d.FP_imgs[i]=new Image; d.FP_imgs[i].src=a[i]; }
}

function FP_getObjectByID(id,o) {//v1.0
 var c,el,els,f,m,n; if(!o)o=document; if(o.getElementById) el=o.getElementById(id);
 else if(o.layers) c=o.layers; else if(o.all) el=o.all[id]; if(el) return el;
 if(o.id==id || o.name==id) return o; if(o.childNodes) c=o.childNodes; if(c)
 for(n=0; n<c.length; n++) { el=FP_getObjectByID(id,c[n]); if(el) return el; }
 f=o.forms; if(f) for(n=0; n<f.length; n++) { els=f[n].elements;
 for(m=0; m<els.length; m++){ el=FP_getObjectByID(id,els[n]); if(el) return el; } }
 return null;
}
// -->
</script>
<meta name="Microsoft Theme" content="none, default">
</head>

<body onload="FP_preloadImgs(/*url*/'images/buttons/buttonA.jpg',/*url*/'images/buttons/buttonB.jpg',/*url*/'images/buttons/buttonD.jpg',/*url*/'images/buttons/buttonE.jpg',/*url*/'images/buttons/button13.jpg',/*url*/'images/buttons/button14.jpg',/*url*/'images/buttons/button16.jpg',/*url*/'images/buttons/button17.jpg',/*url*/'images/buttons/button19.jpg',/*url*/'images/buttons/button1A.jpg',/*url*/'images/buttons/button1C.jpg',/*url*/'images/buttons/button1D.jpg',/*url*/'images/buttons/button1F.jpg',/*url*/'images/buttons/button20.jpg',/*url*/'images/buttons/button22.jpg',/*url*/'images/buttons/button23.jpg',/*url*/'images/buttons/button25.jpg',/*url*/'images/buttons/button26.jpg',/*url*/'images/buttons/button28.jpg',/*url*/'images/buttons/button29.jpg',/*url*/'images/buttons/button6.jpg',/*url*/'images/buttons/button7.jpg',/*url*/'images/buttons/buttonC1.jpg',/*url*/'images/buttons/buttonB10.jpg')"><table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
	<tr>
		<td valign="top" rowspan="3">
		<p align="center"><font color="#000000" size="2">Page Last Updated:</font></p>
		<p align="center"><font color="#000000" size="2">
		<td valign="top" rowspan="2">
		<p align="center">
		<font size="2">
		<img border="0" src="images\untitled.jpg" width="251" height="121"></font></td>
		<td height="1"></td>
		</tr>
	<tr>
		<td height="121" valign="top"><font color="#000000" size="2" face="Arial"><!--#include virtual="./includes/next_fixture.asp"--></font></td>
	</tr>
	<tr>
		<td></td>
		<td height="1"></td>
		</tr>
	<tr>
		<td valign="top" rowspan="2" width="118" height="464"><table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
			<tr>
				<td height="100%" width="100%"><table border="0" width="100%" height="100%" cellpadding="3" cellspacing="0">
					<tr>
						<td width="100%" height="100%" valign="top"><!--#include virtual="./includes/sidebar.asp"--></td>
					</tr>
				</table></td>
			</tr>
		</table></td>
		
		<%
		on error resume next
		accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")

		'### Build a dsn-less connection string

		ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
		ConnectionString=ConnectionString & "DBQ=" & accessdb


		'### Create the ADO Connection object 

		Set Connection = Server.CreateObject("ADODB.Connection")
		Connection.Open ConnectionString
	

		'### Create a SQL query string

		strQuery = "SELECT max(score) as high_score from batting_scorecards"	
	
		'### Execute the SQL query
	
		Set RS = Connection.Execute(strQuery)

		While Not RS.EOF

			high_score = RS("high_score")

			RS.MoveNext

		Wend
		
		'### Get Scorer of highest score
		
		strQuery = "SELECT player_name from batting_scorecards a, players b where a.player_id=b.player_id and score = " & high_score
		'response.write strQuery 
		Set RS = Connection.Execute(strQuery)

		While Not RS.EOF

			scorer = RS("player_name") & ", " & scorer

			RS.MoveNext

		Wend
		
		'### Create a SQL query string for most catches

		strQuery = "SELECT count(*) as catches FROM bowling_scorecards where dismissal_id = 3 and fielder_id>0 group by fielder_id"	
	
		'### Execute the SQL query
	
		Set RS = Connection.Execute(strQuery)
        
        number_of_catches = 0
		
		While Not RS.EOF
			If RS("catches") > number_of_catches then
			number_of_catches = RS("catches")
			End if
			RS.MoveNext
		Wend
		
		'### Get Players with most catches
		
		strQuery = "SELECT b.player_name, count(*) FROM bowling_scorecards a, players b where dismissal_id = 3 and a.fielder_id=b.player_id group by b.player_name having count(*) = " & number_of_catches
		'response.write strQuery 
		Set RS = Connection.Execute(strQuery)

		While Not RS.EOF

			catchers = RS("player_name") & ", " & catchers

			RS.MoveNext

		Wend
		'catchers = Replace(catchers, ", ", "<BR>")
		
		'### Create a SQL query string for most wickets

		strQuery = "SELECT count(*) as wickets FROM bowling_scorecards where bowler_id <> 0 group by bowler_id"	
	
		'### Execute the SQL query
	
		Set RS = Connection.Execute(strQuery)
        
        number_of_wickets = 0
		
		While Not RS.EOF
			If RS("wickets") > number_of_wickets then
			number_of_wickets = RS("wickets")
			End if
			RS.MoveNext
		Wend
		
		'### Get Players with most wickets
		
		strQuery = "SELECT b.player_name, count(*) FROM bowling_scorecards a, players b where a.bowler_id=b.player_id group by b.player_name having count(*) = " & number_of_wickets
		'response.write strQuery 
		Set RS = Connection.Execute(strQuery)

		While Not RS.EOF

			bowlers = RS("player_name") & ", " & bowlers

			RS.MoveNext

		Wend
		

		'### Clean-up time

		RS.Close 
		Connection.Close
		set RS = Nothing 
		set Connection = Nothing


		%>
		
		
		
		
		<td valign="top" height="440" align='center'>
		<p align="center"><font face="Arial"><font color="#000000" size="6">Key Statistics</font><br>&nbsp;
				</font>
				<table border="0" style="border-collapse: collapse" width="100%" id="table1" cellpadding=10>
			<tr>
				<td><b><font color="#000000" face="Arial">Formed:</font></b></td>
				<td><font color="#000000" face="Arial">Feb 2004</font></td>
			</tr>
			<tr>
				<td><b><font color="#000000" face="Arial">Highest Scorer:</font></b></td>
				<td><font color="#000000" face="Arial"><%=scorer%> (<%=high_score%>)</font></td>
			</tr>
			<tr>
				<td><b><font color="#000000" face="Arial">Leading Wicket Taker:</font></b></td>
				<td><font color="#000000" face="Arial"><%=bowlers%> (<%=number_of_wickets%>)</td>
			</tr>
			<tr>
				<td><b><font color="#000000" face="Arial">Most Catches:</font></b></td>
				<td><font color="#000000" face="Arial"><%=catchers%> (<%=number_of_catches%>)</td>
			</tr>
			<tr>
				<td>&nbsp;</td>
				<td>&nbsp;</td>
			</tr>
			<tr>
				<td><font color="#000000" face="Arial"><b>Home Ground</b></font></td>
				<td><font color="#000000" face="Arial">Springfield Park</font></td>
			</tr>
			<tr>
				<td width="174"><font color="#000000" face="Arial"><b>Capacity</b></font></td>
				<td><font color="#000000" face="Arial">~500,000 all standing</font></td>
			</tr>
		</table>
		<p><font face="Arial"><a href=# onClick="MyWindow=window.open('./stats/home.asp','MyWindow','toolbar=no,location=no,directories=no,status=no,menubar=no,resizable=yes,width=1024,height=768,scrollbars=yes'); return false;">Enter the Stats System</a></font></p>
		<p><font face="Arial"><a href=# onClick="MyWindow=window.open('./accounts/main.asp','MyWindow','toolbar=no,location=no,directories=no,status=no,menubar=no,resizable=yes,width=1024,height=768,scrollbars=yes'); return false;">Enter the Accounts System</a></font></p>
		
		</p>
		
		</td>
		<td valign="top" rowspan="2" width="124"><table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
			<tr>
				<td height="100%" width="100%"><table border="0" width="100%" height="100%" cellpadding="3" cellspacing="0">
					<tr>
						<td width="100%" height="100%" valign="top">
							<!--#include virtual="./includes/news_shorts.asp"-->
						</td>
					</tr>
				</table></td>
			</tr>
		</table></td>
	</tr>
	<tr>
		<td valign="top">
		<p align="center"><font face=arial color="#000000" size="1">(c) The Village CC 
		2004-2006. All Rights reserved<br>Best viewed at 1024 x 768</font></td>
		</tr>
</table></body>

</html>