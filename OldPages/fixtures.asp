<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>The Village CC | Fixtures</title>
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
<base target="_self">
<meta name="Microsoft Theme" content="none, default">
</head>

<%		
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

		strQuery = "SELECT * from matches a, venues b, teams c, competitions d where a.venue_id = b.venue_id and a.oppo_id = c.team_id and a.comp_id=d.comp_id and match_date > now() order by match_date asc"	
	
		'### Execute the SQL query
		'response.write strQuery & "<br>"
		Set RS = Connection.Execute(strQuery)
%>

		





<body onload="FP_preloadImgs(/*url*/'images/buttons/buttonA.jpg',/*url*/'images/buttons/buttonB.jpg',/*url*/'images/buttons/buttonD.jpg',/*url*/'images/buttons/buttonE.jpg',/*url*/'images/buttons/button13.jpg',/*url*/'images/buttons/button14.jpg',/*url*/'images/buttons/button16.jpg',/*url*/'images/buttons/button17.jpg',/*url*/'images/buttons/button19.jpg',/*url*/'images/buttons/button1A.jpg',/*url*/'images/buttons/button1C.jpg',/*url*/'images/buttons/button1D.jpg',/*url*/'images/buttons/button1F.jpg',/*url*/'images/buttons/button20.jpg',/*url*/'images/buttons/button22.jpg',/*url*/'images/buttons/button23.jpg',/*url*/'images/buttons/button25.jpg',/*url*/'images/buttons/button26.jpg',/*url*/'images/buttons/button28.jpg',/*url*/'images/buttons/button29.jpg',/*url*/'images/buttons/button6.jpg',/*url*/'images/buttons/button7.jpg',/*url*/'images/buttons/buttonC1.jpg',/*url*/'images/buttons/buttonB10.jpg')"><table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
	<tr>
		<td valign="top" rowspan="3">
		<p align="center"><font color="#000000" size="2">Page Last Updated:</font></p>
		<p align="center"><font color="#000000" size="2">
		<!--webbot bot="Timestamp" S-Type="EDITED" S-Format="%d/%m/%Y" startspan -->02/05/2006<!--webbot bot="Timestamp" i-checksum="12572" endspan --></font></td>
		<td valign="top" rowspan="2">
		<p align="center">
		<font size="2">
		<img border="0" src="images\untitled.jpg" width="251" height="121"></font></td>
		<td height="1"></td>
		</tr>
	<tr>
		<td height="121" valign="top"><font face="Arial"><!--#include virtual="./includes/next_fixture.asp"-->
		</font></td>
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
						<td width="100%" height="100%" valign="top">
						<!--#include virtual="./includes/sidebar.asp"--></td>
					</tr>
				</table></td>
			</tr>
		</table></td>
		<td valign="top" height="440" align='center'>
		<p align="center"><b><font face="Arial" size="5">Fixtures 2006</font></b>&nbsp;<br><br><table cellSpacing="1" cellPadding="4" border="0" width="100%">
														
														<%
														While Not RS.EOF
														If rs("home_away") = "A" then
														%>
														    
															<tr>
															<td>
															<font color="#000000" size="2" face=arial>
															<%=FormatDateTime(rs("match_date"),1)%>&nbsp;</font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															<%=rs("team")%></font></td>
															<td>
															<p align="center">
															<font color="#000000" size="2" face=arial>
															vs</font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															<b><font color="#000000" size="2" face=arial>The Village CC</font></font></b></td>
															<td>
															<font color="#000000" size="2" face=arial>
															&nbsp</font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															at <%=rs("venue")%></font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															(<%=rs("competition")%>)</font></td>
															</tr>
															
														<%Else%>
														     <tr>
															<td>
															<font color="#000000" size="2" face=arial>
															<%=FormatDateTime(rs("match_date"),1)%>&nbsp;</font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															<b>The Village CC</b></font></td>
															<td>
															<p align="center">
															<font color="#000000" size="2" face=arial>
															vs</font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															<font color="#000000" size="2" face=arial>
															<%=rs("team")%></font></font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															&nbsp</font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															at <%=rs("venue")%></font></td>
															<td>
															<font color="#000000" size="2" face=arial>
															(<%=rs("competition")%>)</font></td>
															
															</tr>
														<%End if
															
															RS.MoveNext

														Wend
		
														%>

														</table>
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
		<td valign="top" height="24" width="560">
		<p align="center"><font color="#000000" size="1">(c) The Village CC 
		2004-2006. All Rights reserved<br>Best viewed at 1024 x 768</font></td>
		</tr>
</table></body>

		<%
			
		'### Clean-up time
		on error resume next	
		RS.Close 
		Connection.Close
		set RS = Nothing 
		set Connection = Nothing
		on error goto 0
		%>

</html>