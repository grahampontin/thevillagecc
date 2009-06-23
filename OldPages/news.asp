<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>The Village CC | News</title>
<link rel="stylesheet" type="text/css" href="./css/default.css" />

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

		strQuery = "select * from News order by item_date desc" 	
	
		'### Execute the SQL query
		'response.write strQuery & "<br>"
		Set RS2 = Connection.Execute(strQuery)
%>

<body onload="FP_preloadImgs(/*url*/'images/buttons/buttonA.jpg', /*url*/'images/buttons/buttonB.jpg', /*url*/'images/buttons/buttonD.jpg', /*url*/'images/buttons/buttonE.jpg', /*url*/'images/buttons/button13.jpg', /*url*/'images/buttons/button14.jpg', /*url*/'images/buttons/button16.jpg', /*url*/'images/buttons/button17.jpg', /*url*/'images/buttons/button19.jpg', /*url*/'images/buttons/button1A.jpg', /*url*/'images/buttons/button1C.jpg', /*url*/'images/buttons/button1D.jpg', /*url*/'images/buttons/button1F.jpg', /*url*/'images/buttons/button20.jpg', /*url*/'images/buttons/button22.jpg', /*url*/'images/buttons/button23.jpg', /*url*/'images/buttons/button25.jpg', /*url*/'images/buttons/button26.jpg', /*url*/'images/buttons/button28.jpg', /*url*/'images/buttons/button29.jpg', /*url*/'images/buttons/buttonB10.jpg', /*url*/'images/buttons/buttonC1.jpg', /*url*/'images/buttons/button1B.jpg', /*url*/'images/buttons/button2C2.jpg', /*url*/'images/buttons/button2B1.jpg')">
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
						<!--#include virtual="./includes/sidebar.asp"--></td>
					</tr>
				</table></td>
			</tr>
		</table></td>
		<td valign="top" height="440" align='center'>
		<p align="center"><font face="Arial"><font size="6" color="#000000">NEWS!</font></font><br>
		<a href="./submit_news.asp">Create a Story</a></p>
		<%counter=0
		While Not RS2.EOF
		counter=counter+1
		%>
		
		
		
		<p align="left">
		<u><b><font face="Arial" color="#000000"><%=cstr(RS2("item_date"))%>: <%=RS2("headline")%></font></b></u>
		<p align="left"><DIV align=left>
		<font size="2" color="#000000" face="Arial"><%=RS2("story")&RS2("story2")&RS2("story3")&RS2("story4")&RS2("story5")&RS2("story6")&RS2("story7")&RS2("story8")&RS2("story9")&RS2("story10")%> 
		</font></div>
		
		
		
		
		<% If counter = 10 Then%>
		   <div id=more_news style="display: 'none';">
		    <%End if
			RS2.MoveNext

		Wend
		%>
		<p align="left"><u><b>
		<font face="Arial" color="#000000">13/6</font></b><font color="#000000" face="Arial"><b>/05: 
		</b></font><b><font face="Arial" color="#000000">Kit inspires Victorious 
		Village</font></b></u><p align="left">
		<font size="2" color="#000000" face="Arial">No, not that Kit, <i>the</i> kit; Pundits 
		were speculating today about the possibility that all the the Village 
		were really lacking was some fine, hand-made cloth caps. Now they have 
		them. NELCL Beware. </font>
		
		
		
		<p align="left"><u><b>
		<font face="Arial" color="#000000">12/6</font></b><font color="#000000" face="Arial"><b>/05: 
		</b></font><b><font face="Arial" color="#000000">Village Destroy QCCC</font></b></u><p align="left">
		<font size="2" color="#000000" face="Arial">What a day it was for the Village. 
		Dressed in all their brand new finery the Village boldly took on the 13 
		men of Queens' Collage. Helped greatly by the attendance of some of the 
		ringers who refuse to answer Andy's constant stream of e-mails The 
		Village made light work of the 152 they were set to win.</font><p align="left"><u><b>
		<font face="Arial" color="#000000">11/6</font></b><font color="#000000" face="Arial"><b>/05: 
		</b></font><b><font face="Arial" color="#000000">Morgans Dismissed by 
		Minor</font></b></u><p align="left">
		<font size="2" color="#000000" face="Arial">The only highlight from a long day for 
		the Village was the sight of Morgans being clean bowled by an 11 year 
		old. Debate is still raging as to whether this was funnier than the time 
		he was out first ball to Page.</font><p align="left"><u><b>
		<font face="Arial" color="#000000">11/6</font></b><font color="#000000" face="Arial"><b>/05: 
		</b></font><b><font face="Arial" color="#000000">C&amp;S (317/8) too good 
		for Plucky Village (193/4)</font></b></u><p align="left">
		<font size="2" color="#000000" face="Arial">Says it all really. A battling 193 for 4 
		from the Village Batsmen did little to sooth the aches of 35 overs in 
		the field being tonked around.</font><p align="left"><u><b>
		<font face="Arial" color="#000000">10/6</font></b><font color="#000000" face="Arial"><b>/05: 
		</b></font><b><font face="Arial" color="#000000">Kit is here!</font></b></u><p align="left">
		<font size="2" color="#000000" face="Arial">The kit is here! Check out the
		<a href="gallery3.asp">Gallery</a> to see Page embarking on what will 
		hopefully be short modelling career...</font><p align="left"><u><b>
		<font face="Arial" color="#000000">15/5</font></b><font color="#000000" face="Arial"><b>/05: 
		</b></font><b><font face="Arial" color="#000000">Kit order finalised</font></b></u><p align="left">
		<font size="2" color="#000000" face="Arial">Page has finalised the kit order, so if 
		you want to change anything best phone him quick smart.</font><p align="left">
		<u><b><font face="Arial" color="#000000">14/5</font></b><font color="#000000" face="Arial"><b>/05: 
		</b></font><b><font face="Arial" color="#000000">&quot;Tail wags but the Head 
		didn't Bark&quot;</font></b></u><p align="left">
		<font color="#000000" size="2" face="Arial">Village CC enthusiasts were pleased not 
		to have to watch the usual capitulation of the Village batting line-up. 
		A strong contribution from Morgans and Thomas down the order saw the 
		Village set London Fields 112 to win. Sadly, it wasn't enough.</font><p align="left">
		<u><b><font face="Arial" color="#000000">7/5</font></b><font color="#000000" face="Arial"><b>/05: 
		</b></font><b><font face="Arial" color="#000000">Low Hall Square claims 
		more victims</font></b></u><p align="left">
		<font color="#000000" size="2" face="Arial">A tight first 20 overs from the Village 
		in the field were not enough to stop Coach and Horses posting what 
		turned out to be an insurmountable total of 200 ish. </font><p align="left">
		<u><b><font face="Arial" color="#000000">30/4</font></b><font color="#000000" face="Arial"><b>/05: 
		</b></font><b><font face="Arial" color="#000000">Village lose in tight 
		opener</font></b></u><p align="left">
		<font size="2" color="#000000" face="Arial">The plucky Village side were undone by 
		the narrowest of margins at Low Hall Farm. Check out the Match Report by 
		following the cleverly titled &quot;Match Report&quot; link over to your left... 
		For a more comprehensible account of events you could look at the 
		scorecards in the &quot;Results&quot; section.&nbsp; </font>
		<p align="left"><u><b>
		<font face="Arial" color="#000000">15/4</font></b><font color="#000000" face="Arial"><b>/05: 
		</b></font><b><font face="Arial" color="#000000">New Players take 
		note....</font></b></u><p align="left">
		<font size="2" color="#000000" face="Arial">New players are encouraged to send a 
		foolish snap of themselves and a few stats so that they might be added 
		to the world renowned &quot;Players Gallery&quot;. What better chance to be 
		ridiculed by your friends... Those enthusiastic few should forward a 
		photo to <a href="mailto:thevillageccDONTSPAMMEYOUBASTARD@gmail.com">
		thevillageccDONTSPAMMEYOUBASTARD@gmail.com</a>, taking care to remove 
		the bit in block capitals. </font><p align="left"><u><b>
		<font face="Arial" color="#000000">15/4</font></b><font color="#000000" face="Arial"><b>/05: 
		</b></font><b><font face="Arial" color="#000000">Kit!</font></b></u><p align="left">
		<font color="#000000" size="2" face="Arial">Once again the Village CC and in 
		particular the elusive Alex &quot;Navjot&quot; Page are trying to get some kit 
		sorted out. If you haven&#39;t already answered the Quiz, then check your 
		inbox for a link... The response has been excellent so far and rumour 
		has it the supplier is somewhat more reputable than last year&#39;s 
		shambles. </font><p align="left"><u><b>
		<font face="Arial" color="#000000">10/4</font></b><font color="#000000" face="Arial"><b>/05: 
		Outdoor nets</b></font></u><p align="left">
		<font color="#000000" face="Arial"><font size="2">Outdoor nets and fielding practice commence at 
		Victoria Park. 2pm. Be there</font>.</font><p align="left"><u>
		<font color="#000000" face="Arial"><b>08/2/05: More nets and New 
		Players!</b></font></u><p align="left">
		<font size="2" color="#000000" face="Arial">MMJ Lucarotti introduced two 
		new players to the crazy world of spam that is The Village CC at nets on 
		Tuesday. Sadly, and slightly embarrassingly, I can&#39;t remember their 
		names. A warm welcome anyhow. Andy then introduced a two week batting 
		rota. Consultation is ongoing as to whether this violates the clubs 
		constitutional obligations on involvement and enthusiasm grounds. Andy 
		also hit the first notional Six of this year. </font><p align="left"><u>
		<font color="#000000" face="Arial"><b>
		05/2/05: Fixtures Announced!</b></font></u><p align="left">
		<font size="2" face="Arial" color="#000000">Mr Page has supplied me with the 
		most recent set of fixtures which will be found shortly on the Results 
		page. They will also be marked on the calendar in red.</font><p align="left">
		<font color="#000000" face="Arial"><u><b>01/2/05: Nets begin at Bethnal Green Tech 
		College.</b></u></font><p align="left">
		<font size="2" color="#000000" face="Arial">
		The Village CC 2nd XI began their preparations for an assault on the NELCL 
		championship in suitably ramshackle style. Andy was none-the-less in 
		upbeat spirits, it is rumoured that some deliveries hit the stumps and 
		indeed some were hit by the batsmen. Sadly due to a 
		technical hitch there is no evidence of this and experience would teach 
		us to be sceptical.&nbsp;&nbsp; </font>
		<p align="left"><u><font color="#000000" face="Arial"><b>30/1/05: 2nd AGM and 1st 
		Annual Dinner goes ahead.</b></font></u><p align="left">
		<font color="#000000" size="2" face="Arial">The second AGM and 1st Annual Dinner of the Village CC 
		eventually took place. There were speeches, awards, curry, motions (not 
		curry related, thankfully) and even beer. The Club Committee was elected 
		as follows:</font><p align="left">
		<font size="2" color="#000000" face="Arial">
		<b>Captain</b>: Andy<br>
		<b>Miami-Vice</b>: Graham<br>
		<b>Treasurer</b>: Tomio<br>
		<b>Secretary</b>: Page<br>
		<b>Webmaster</b>*: Graham<br>
		<b>Social Secretary</b>*: Phil</font><p align="left">
		<font color="#000000" size="2" face="Arial">Notable awards were:</font><p align="left">
		<font face="Arial" color="#000000" size="2"><b>Captain's Player of the Season</b>: Ed T<br>
		<b>Players Wife's Player of the Season</b>: Ed T<br>
		<b>Player's Player of the Season</b>: Graham</font><p align="left">
		<font face="Arial" color="#000000" size="2">For more details the minutes will be posted as soon 
		as Page gives me them.</font><p align="left">
		<font size="1" color="#000000" face="Arial">*social secretary and webmaster are, for 
		obvious reasons, mutually exclusive..</font><p align="left"><u><b>
		<font color="#000000" face="Arial">
		15/1/05: AGM Booked</font></b></u><p align="left">
		<font color="#000000" size="2" face="Arial">The second AGM of the Village CC will be 
		taking place in the Lion on Church Street on Saturday the 29th of 
		January 2005. For further details contact the clubs acting social 
		secretary Mr Philip Stott. You can find his address on one of the 
		numerous pieces of SPAM you&#39;ve deleted.</font><p align="left">
		<font face="Arial"><u>
		<font color="#000000"><b>13</b></font><b><font color="#000000">/1/05:
		</font></b><font color="#000000"><b>Nets Booked</b></font></u></font><p align="left">
		<font color="#000000" size="2" face="Arial">Andy has booked winter nets at Hackney 
		Community College. These are indoor nets, so we wont get snowed on like 
		last year. Check the training page for details.</font><p align="left">
		<font face="Arial">
		<u><font color="#000000"><b>5</b></font><b><font color="#000000">/1/05:
		</font></b><font color="#000000"><b>New Website</b></font></u></font><p align="left">
		<font size="2" color="#000000" face="Arial">Thats it! You&#39;ve found it. There it is. 
		To paraphrase the magnificent MMJ Lucarotti.</font>
		
		</div>
		</div>
		</div>
		<BR><BR>
		<INPUT type=button name=show_all value="Show All News" onclick='document.getElementById("more_news").style.display="";'>
		</td>
		
		<td valign="top" rowspan="2" width="124"><table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">
			<tr>
				<td height="100%" width="100%"><table border="0" width="100%" height="100%" cellpadding="3" cellspacing="0">
					<tr>
						<td width="100%" height="100%" valign="top">
							<!--#include virtual="./includes/news_shorts.asp"-->
							<br>
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
<%
'### Clean-up time

		RS2.Close 
		Connection.Close
		set RS2 = Nothing 
		set Connection = Nothing

%>

</html>