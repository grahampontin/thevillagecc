<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<link rel="stylesheet" type="text/css" href="./css/default.css" />
<link rel="stylesheet" type="text/css" href="./css/chat.css" />
<title>The Village CC | Chat</title>

<script language="JavaScript">

function checkForm() {
 if (document.form.security_code.value == "" || document.form.user.value == "" || document.form.user.value=="Type your name here") {
  alert('Please enter a name of some description and then the matching code below if you are not a bot trying to sell drugs to village cricketers.');
  } else {
  postComment();
  }
}
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

</script>

</head>


<body onload="FP_preloadImgs(/*url*/'images/buttons/buttonA.jpg',/*url*/'images/buttons/buttonB.jpg',/*url*/'images/buttons/buttonD.jpg',/*url*/'images/buttons/buttonE.jpg',/*url*/'images/buttons/button13.jpg',/*url*/'images/buttons/button14.jpg',/*url*/'images/buttons/button16.jpg',/*url*/'images/buttons/button17.jpg',/*url*/'images/buttons/button19.jpg',/*url*/'images/buttons/button1A.jpg',/*url*/'images/buttons/button1C.jpg',/*url*/'images/buttons/button1D.jpg',/*url*/'images/buttons/button1F.jpg',/*url*/'images/buttons/button20.jpg',/*url*/'images/buttons/button22.jpg',/*url*/'images/buttons/button23.jpg',/*url*/'images/buttons/button25.jpg',/*url*/'images/buttons/button26.jpg',/*url*/'images/buttons/button28.jpg',/*url*/'images/buttons/button29.jpg',/*url*/'images/buttons/button6.jpg',/*url*/'images/buttons/button7.jpg',/*url*/'images/buttons/buttonC1.jpg',/*url*/'images/buttons/buttonB10.jpg')">
<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">
	<tr>
		<td id=last_updated>
			<p align="center"><font color="#000000" size="2">Page Last Updated:</font></p>
			<p align="center"><font color="#000000" size="2"><!--webbot bot="Timestamp" S-Type="EDITED" S-Format="%d/%m/%Y" startspan -->01/02/2006<!--webbot bot="Timestamp" i-checksum="12522" endspan --></font>
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
		
			<span id="page_title">
				Village Chat (beta)
			</span><br><br>
			Welcome to the Village CC Chat. This new forum has replaced the old Guestbook. There are about 5 users currently online.
			<br><br>
			<div id="chat_input">
				<div class="comment_info">
				  <div class="comment_date"><%=FormatDateTime(Date(),1)%></div>
				  <div class="comment_time">(<%=FormatDateTime(Now(),3)%>)</div>
				  <div class="comment_name"><input name="annon_user_name"> says:</div>
				  <div class="comment_image"><img src="./images/annon.jpg" width="50px"></div>
			      <input type="button" value="Say It" id="say_it_button"> &nbsp <input type="button" value="Login..." id="login_button">
				</div>
				<div id="comment_input">
				<input type="hidden" id="FCKeditor1" name="comment" value="" style="display:none" /><input type="hidden" id="FCKeditor1___Config" value="CustomConfigurationsPath=/fckeditor.config.js" style="display:none" /><iframe id="FCKeditor1___Frame" src="/fckeditor/editor/fckeditor.html?InstanceName=FCKeditor1&amp;Toolbar=Basic" width="99%" height="160" frameborder="0" scrolling="no"></iframe>
				</div>
			</div>
			<hr>
			<!-- get chat comments -->
				
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