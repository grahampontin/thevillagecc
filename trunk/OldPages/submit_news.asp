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
function checkForm() {
   if (document.form.headline.value == "" || document.form.short_headline.value == "" || document.form.teaser.value == "") {
   alert("Please complete all fields")
   } else {
   document.form.submit();
   }

}
</script>
<meta name="Microsoft Theme" content="none, default">
</head>

<body onload="FP_preloadImgs(/*url*/'images/buttons/buttonA.jpg', /*url*/'images/buttons/buttonB.jpg', /*url*/'images/buttons/buttonD.jpg', /*url*/'images/buttons/buttonE.jpg', /*url*/'images/buttons/button13.jpg', /*url*/'images/buttons/button14.jpg', /*url*/'images/buttons/button16.jpg', /*url*/'images/buttons/button17.jpg', /*url*/'images/buttons/button19.jpg', /*url*/'images/buttons/button1A.jpg', /*url*/'images/buttons/button1C.jpg', /*url*/'images/buttons/button1D.jpg', /*url*/'images/buttons/button1F.jpg', /*url*/'images/buttons/button20.jpg', /*url*/'images/buttons/button22.jpg', /*url*/'images/buttons/button23.jpg', /*url*/'images/buttons/button25.jpg', /*url*/'images/buttons/button26.jpg', /*url*/'images/buttons/button28.jpg', /*url*/'images/buttons/button29.jpg', /*url*/'images/buttons/buttonB10.jpg', /*url*/'images/buttons/buttonC1.jpg', /*url*/'images/buttons/button1B.jpg', /*url*/'images/buttons/button2B1.jpg', /*url*/'images/buttons/button2C2.jpg')">
<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
	<tr>
		<td valign="top">
		&nbsp
		</td>
		<td valign="top" align="center">
			<img border="0" src="images\untitled.jpg" width="251" height="121">
		</td>
		<td valign="top"><!--#include virtual="./includes/next_fixture.asp"-->
		</td>
	</tr>
	<tr>
		<td valign="top" width="118">
		<!--#include virtual="./includes/sidebar.asp"-->
		</td>
		
		<td valign="top" height="440" align='center'>
		<form name=form action=submit_news_commit.asp method=post>
		<p align="center"><font face="Arial" size="4"><b>New!</b> Create a news Story.</font><p align="center">&nbsp;
			<table border="0" width="100%" id="table1">
				<tr>
					<td><font face="Arial">Headline:</font></td>
					<td> <input size=50 name=headline></td>
				</tr>
				<tr>
					<td><font face="Arial">Story:</font></td>
					<td><input type="hidden" id="FCKeditor1" name="story" value="" style="display:none" /><input type="hidden" id="FCKeditor1___Config" value="CustomConfigurationsPath=/fckeditor.config.js" style="display:none" /><iframe id="FCKeditor1___Frame" src="/plugins/fckeditor/editor/fckeditor.html?InstanceName=FCKeditor1&amp;Toolbar=Default" width="100%" height="400" frameborder="0" scrolling="no"></iframe>
					</td>
				</tr>
				<tr>
					<td><font face="Arial">Mini-Headline</font></td>
					<td><input size=50 name=short_headline></td>
				</tr>
				<tr>
					<td><font face="Arial">Teaser</font></td>
					<td><textarea name=teaser rows=3 cols=40></textarea></td>
				</tr>
			</table>
	    <img src="./captcha/aspcaptcha.asp" alt="Security Code" width="86" height="21" />
	    <input name="strCAPTCHA" type="text" id="strCAPTCHA" maxlength="8" />
	    <BR><br>
		<input type=button name=go value='Submit News Story' onclick='checkForm();'><br><BR>
		</form>
		<p align="left" >&nbsp;<br><br><br>&nbsp;</td>
		<td  width="124"><!--#include virtual="./includes/news_shorts.asp"--></td>
	</tr>
	
	<tr>
		<td valign="top" height="24" colspan=3>
		<p align="center"><font color="#000000" size="1" face="Arial">(c) The Village CC 
		2004. All Rights reserved<br>Best viewed at 1024 x 768</font></td>
		</tr>
</table></body>

</html>