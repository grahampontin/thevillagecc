<%
Response.CacheControl = "no-cache"
Response.AddHeader "Pragma", "no-cache"
Response.Expires = -1
%>
<%
Function CheckCAPTCHA(valCAPTCHA)
	SessionCAPTCHA = Trim(Session("CAPTCHA"))
	Session("CAPTCHA") = vbNullString
	if Len(SessionCAPTCHA) < 1 then
        CheckCAPTCHA = False
        Exit function
    end If
	if CStr(SessionCAPTCHA) = CStr(valCAPTCHA) then
	    CheckCAPTCHA = True
	else
	    CheckCAPTCHA = False
	end If
End Function
%>

<html>

<head>


<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>The Village CC | News</title>
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
</head><%
If Request.ServerVariables("REQUEST_METHOD") = "POST" Then
	strCAPTCHA = Trim(Request.Form("strCAPTCHA"))
	if CheckCAPTCHA(strCAPTCHA) = true Then
		
		'Point at the database
		
		accessdb=Server.MapPath("/App_Data/villagescorebook.mdb")

		'### Build a dsn-less connection string

		ConnectionString="DRIVER={Microsoft Access Driver (*.mdb)};"
		ConnectionString=ConnectionString & "DBQ=" & accessdb

		'### Create the ADO Connection object 

		Set Connection = Server.CreateObject("ADODB.Connection")
		Connection.Mode = 3
		Connection.Open ConnectionString
		
		'### Split the story into 3 parts
		story1 = Left(Request("story"), 255)
		story2 = Mid(Request("story"), 256, 255)
		story3 = Mid(Request("story"), 511, 255)
		story4 = Mid(Request("story"), 766, 255)
		story5 = Mid(Request("story"), 1021, 255)
		story6 = Mid(Request("story"), 1276, 255)
		story7 = Mid(Request("story"), 1531, 255)
		story8 = Mid(Request("story"), 1786, 255)
		story9 = Mid(Request("story"), 2041, 255)
		story10 = Mid(Request("story"), 2296, 255)
		
		'### Create a SQL query string

		strQuery = "insert into News(headline, story, story2, story3, story4,story5,story6,story7,story8,story9,story10, short_headline, teaser, news_id, item_date) select '" & replace(request("headline"), "'", "''") & "', '" & replace(story1, "'", "''") & "', '" & replace(story2, "'", "''") & "', '" & replace(story3, "'", "''") & "', '"& replace(story4, "'", "''") & "', '"& replace(story5, "'", "''") & "', '"& replace(story6, "'", "''") & "', '"& replace(story7, "'", "''") & "', '"& replace(story8, "'", "''") & "', '"& replace(story9, "'", "''") & "', '"& replace(story10, "'", "''") & "', '"& replace(request("short_headline"), "'", "''") & "', '"& replace(request("teaser"), "'", "''") & "', max(news_id)+1, now() from News" 	
	
		'### Execute the SQL query
		'response.write strQuery & "<br>"
		If request("headline") <> "" And instr(request("headline"), "</") = 0 and instr(request("teaser"), "</") = 0 And instr(request("short_headline"), "</") = 0 And instr(request("headline"), "[URL]") = 0 and instr(request("teaser"), "[URL]") = 0 And instr(request("short_headline"), "[URL]") = 0 Then
		Set RS2 = Connection.Execute(strQuery)
        End if
'### Clean-up time

 
		Connection.Close
		set Connection = Nothing
End If
End if
%>

<body onload="FP_preloadImgs(/*url*/'images/buttons/buttonA.jpg', /*url*/'images/buttons/buttonB.jpg', /*url*/'images/buttons/buttonD.jpg', /*url*/'images/buttons/buttonE.jpg', /*url*/'images/buttons/button13.jpg', /*url*/'images/buttons/button14.jpg', /*url*/'images/buttons/button16.jpg', /*url*/'images/buttons/button17.jpg', /*url*/'images/buttons/button19.jpg', /*url*/'images/buttons/button1A.jpg', /*url*/'images/buttons/button1C.jpg', /*url*/'images/buttons/button1D.jpg', /*url*/'images/buttons/button1F.jpg', /*url*/'images/buttons/button20.jpg', /*url*/'images/buttons/button22.jpg', /*url*/'images/buttons/button23.jpg', /*url*/'images/buttons/button25.jpg', /*url*/'images/buttons/button26.jpg', /*url*/'images/buttons/button28.jpg', /*url*/'images/buttons/button29.jpg', /*url*/'images/buttons/buttonB10.jpg', /*url*/'images/buttons/buttonC1.jpg', /*url*/'images/buttons/button1B.jpg', /*url*/'images/buttons/button2B1.jpg', /*url*/'images/buttons/button2C2.jpg')">
<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
	<tr>
		<td valign="top" rowspan="3">
		<p align="center"><font color="#000000" size="2" face="Arial">Page Last Updated:</font></p>
		<p align="center"><font color="#000000" size="2" face="Arial">
		<!--webbot bot="Timestamp" S-Type="EDITED" S-Format="%d/%m/%Y" startspan -->01/02/2006<!--webbot bot="Timestamp" i-checksum="12522" endspan --></font></td>
		<td valign="top" rowspan="2">
		<p align="center">
		<font size="2" face="Arial">
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
						<!--#include virtual="./includes/sidebar.asp"-->
						</td>
			</tr>
		</table></td>
		<td valign="top" height="440" align='center'>
		
		<p align="center"><font face="Arial" size="4">Thanks for your Submission.</font><p align="center">&nbsp;
		<table border="0s" width="100%" id="table1">
			<tr>
				<td><font face="Arial">Headline:</font></td>
				<td> <%=request("headline")%></td>
			</tr>
			<tr>
				<td><font face="Arial">Story:</font></td>
				<td><%=request("story")%></td>
			</tr>
			<tr>
				<td><font face="Arial">Mini-Headline</font></td>
				<td><%=request("short_headline")%></td>
			</tr>
			<tr>
				<td><font face="Arial">Teaser</font></td>
				<td><%=request("teaser")%></td>
			</tr>
		</table>
		<a href=./news.asp>Return to News</A>
		</form>
		<p align="left">&nbsp;<br><br><br>&nbsp;
		
		
		
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
		<td valign="top" height="24" width="560">
		<p align="center"><font color="#000000" size="1" face="Arial">(c) The Village CC 
		2004. All Rights reserved<br>Best viewed at 1024 x 768</font></td>
		</tr>
</table></body>

</html>