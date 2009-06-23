<html>

<head>
<meta http-equiv="Content-Language" content="en-gb">
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">
<title>The Village CC | Top Trumps</title>
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

		strQuery = "select * from players  where player_id > 0 and player_id in (select player_id from batting_scorecards) order by player_id" 	
	
		'### Execute the SQL query
		'response.write strQuery & "<br>"
		Set RS2 = Connection.Execute(strQuery)
		
		While Not rs2.eof
		
		 player_names = player_names & "'"&rs2("player_name")&"', "
		
		rs2.movenext
		Wend
		player_names = Left(player_names, Len(player_names)-2)
		
		
		
		
		strQuery = "SELECT max(score) as high_score, player_id from batting_scorecards where player_id > 0 group by player_id order by player_id"
		
		Set RS2 = Connection.Execute(strQuery)
		
		While Not rs2.eof
		
		high_scores = high_scores & "'"&rs2("high_score")&"', "
		
		rs2.movenext
		Wend
		high_scores = Left(high_scores, Len(high_scores)-2)
		
		
		
		
		strQuery = "SELECT sum([4s]) as fours, player_id from batting_scorecards where player_id > 0 group by player_id order by player_id"
		
		Set RS2 = Connection.Execute(strQuery)
		
		While Not rs2.eof
		
		fours = fours & "'"&rs2("fours")&"', "
		
		rs2.movenext
		Wend
		fours = Left(fours, Len(fours)-2)
		
		
		
		
		strQuery = "SELECT sum([6s]) as sixes, player_id from batting_scorecards where player_id > 0 group by player_id order by player_id"
		
		Set RS2 = Connection.Execute(strQuery)
		
		While Not rs2.eof
		
		sixes = sixes & "'"&rs2("sixes")&"', "
		
		rs2.movenext
		Wend
		sixes = Left(sixes, Len(sixes)-2)
		
		
		
		strQuery = "select * from players  where player_id > 0 and player_id in (select player_id from batting_scorecards) order by player_id"
		
		Set RS2 = Connection.Execute(strQuery)
		
		While Not rs2.eof
		
		heights = heights & "'"&rs2("height")&"', "
		
		rs2.movenext
		Wend
		heights = Left(heights, Len(heights)-2)
		
'### Clean-up time

		RS2.Close 
		Connection.Close
		set RS2 = Nothing 
		set Connection = Nothing

%>

var whosgo = "player";
var difficulty = "";
var player_names=new Array(<%=player_names%>) 
var high_scores=new Array(<%=high_scores%>) 
var fours=new Array(<%=fours%>) 
var sixes=new Array(<%=sixes%>) 
var heights = new Array(<%=heights%>)
var now = new Date();
var start_time = now.getTime();

function startGame() {
 start_hour        = now.getHours();
 start_minute      = now.getMinutes();
 start_second      = now.getSeconds();


 if (parseInt(document.form.no_of_cards.value) > 34 ) {
 alert("Max 34. Can't you read?");
 return;
 }
 if (parseInt(document.form.no_of_cards.value) <= 0 || document.form.no_of_cards.value == "") {
 alert("That would be a very short game now wouldn't it?");
 return;
 }
 difficulty = document.form.difficulty.options[document.form.difficulty.selectedIndex].value;
// alert(difficulty); 
 var no_of_cards = parseInt(document.form.no_of_cards.value);
 var first_card = 0
 var temp = '';
 for (n=0; n<no_of_cards; n++) {
   var card_number = Math.round(Math.random()*(no_of_cards-1))+1; 
   while (temp.indexOf("-"+card_number+"-") > -1) {
   //alert(card_number);
   var card_number = card_number-1;
   if (card_number == 0) {
   card_number = card_number + no_of_cards;
   }
   
   }
   if (Math.round(n/2) == n/2) {
   document.form.player_cards.value = document.form.player_cards.value + ", " + card_number;
   } else {
   document.form.computer_cards.value = document.form.computer_cards.value + ", " + card_number;
   }
   temp=temp+','+"-"+card_number+"-";
   if (n==0) {
     first_card = card_number;
   }
 }
 
 revealPlayerCard(first_card);

 var vs = document.getElementById('vs');
 var deal  = document.getElementById('deal');
 
 vs.style.display = '';
 deal.style.display = 'none';
 
 
 updateCardsRemaining();
 
 
 
}

function updateCardsRemaining() {
 
 tmparray = document.form.player_cards.value.split(",");
 no_of_player_cards = tmparray.length;
 
 tmparray2 = document.form.computer_cards.value.split(",");
 no_of_computer_cards = tmparray2.length;
 
 tmparray2 = document.form.tied_cards.value.split(",");
 no_of_tied_cards = tmparray2.length;
 
 
 var player_cards_left = document.getElementById("player_cards_left");
 player_cards_left.innerHTML = no_of_player_cards-1+" cards remaining";
 
 var computer_cards_left = document.getElementById("computer_cards_left");
 computer_cards_left.innerHTML = no_of_computer_cards-1+" cards remaining";
 
 var cards_in_pot = document.getElementById("cards_in_pot");
 cards_in_pot.innerHTML = no_of_tied_cards-1
 
}

function playCard(field) {

 
 var tmp = document.form.player_cards.value.split(",");
 var player_card = parseInt(tmp[1])-1;
 //alert(player_card);
 var tmp = document.form.computer_cards.value.split(",");
 var computer_card = parseInt(tmp[1])-1;
  //alert(computer_card);
 revealComputerCard(computer_card+1);

 if (field == "1") {
   var player_score = parseInt(high_scores[player_card]);
   var computer_score = parseInt(high_scores[computer_card]);
   }
 if (field == "2") {
   var player_score = parseInt(fours[player_card]);
   var computer_score = parseInt(fours[computer_card]);
 }
 if (field == "3") {
   var player_score = parseInt(sixes[player_card]);
   var computer_score = parseInt(sixes[computer_card]);
 }
 if (field == "4") {
   var player_score = parseInt(heights[player_card]);
   var computer_score = parseInt(heights[computer_card]);
 }
  //alert(player_score);
  //alert(computer_score);
 
 if (whosgo == "computer") {
     pause(1000);
 }
 
 if (player_score > computer_score) {
    playerWins(player_card, computer_card);
 }
 
 if (player_score < computer_score) {
    computerWins(computer_card, player_card);
 }
 
 if (player_score == computer_score) {
    tieScore(player_card, computer_card);
 }

}

function playerWins(player_card, computer_card) {
  player_card = player_card + 1 +"";
  computer_card = computer_card + 1 +"";
  document.form.player_cards.value = document.form.player_cards.value.substr(document.form.player_cards.value.indexOf(",")+1)
  document.form.player_cards.value = document.form.player_cards.value.substr(document.form.player_cards.value.indexOf(","))
  document.form.player_cards.value = document.form.player_cards.value + ", " + player_card + ", " + computer_card 
  document.form.player_cards.value = document.form.player_cards.value + document.form.tied_cards.value 
  document.form.computer_cards.value = document.form.computer_cards.value.substr(document.form.computer_cards.value.indexOf(",")+1)
  document.form.computer_cards.value = document.form.computer_cards.value.substr(document.form.computer_cards.value.indexOf(","))
  
  document.form.tied_cards.value = '';
  
  
  if (document.form.computer_cards.value.indexOf(",") == -1) {
  setTimeout("endGame('winner');",2000);
  }
  
  var vs = document.getElementById("vs");
  var win = document.getElementById("win");
  
  vs.style.display = 'none';
  
  if (whosgo == "computer") {
  setTimeout("win.style.display = '';", 1000);
  } else {
  win.style.display = '';
  }
  
  
  whosgo = "player";
}

function computerWins(player_card, computer_card) {
  player_card = player_card + 1 +"";
  computer_card = computer_card + 1 + "";
  document.form.computer_cards.value = document.form.computer_cards.value.substr(document.form.computer_cards.value.indexOf(",")+1)
  document.form.computer_cards.value = document.form.computer_cards.value.substr(document.form.computer_cards.value.indexOf(","))  
  document.form.computer_cards.value = document.form.computer_cards.value + ", " + player_card + ", " + computer_card 
  document.form.computer_cards.value = document.form.computer_cards.value +  document.form.tied_cards.value 
  document.form.player_cards.value = document.form.player_cards.value.substr(document.form.player_cards.value.indexOf(",")+1)
  document.form.player_cards.value = document.form.player_cards.value.substr(document.form.player_cards.value.indexOf(","))
  
  document.form.tied_cards.value = '';
  
  var vs = document.getElementById("vs");
  var lose = document.getElementById("lose");
  
  vs.style.display = 'none';
  
  if (whosgo == "computer") {
  setTimeout("lose.style.display = '';", 1000);
  } else {
  lose.style.display = '';
  }
  
  whosgo="computer";
  
  if (document.form.player_cards.value.indexOf(",") == -1) {
  setTimeout("endGame('loser');",2000);}
  //computerPlay();
}

function tieScore (player_card, computer_card) {
  
  player_card = player_card + 1 +"";
  computer_card = computer_card + 1 + "";
  document.form.computer_cards.value = document.form.computer_cards.value.substr(document.form.computer_cards.value.indexOf(",")+1)
  document.form.computer_cards.value = document.form.computer_cards.value.substr(document.form.computer_cards.value.indexOf(","))  
  document.form.player_cards.value = document.form.player_cards.value.substr(document.form.player_cards.value.indexOf(",")+1)
  document.form.player_cards.value = document.form.player_cards.value.substr(document.form.player_cards.value.indexOf(","));
  
  document.form.tied_cards.value = document.form.tied_cards.value + ", " + player_card + ", " + computer_card 
  
  var vs = document.getElementById("vs");
  var draw = document.getElementById("draw");  
  vs.style.display = 'none';
  
  if (whosgo == "computer") {
  setTimeout("draw.style.display = '';", 1000);
  } else {
  draw.style.display = '';
  }
  
  if (document.form.player_cards.value.indexOf(",") == -1) {
  setTimeout("endGame('loser');",2000);
  }
   if (document.form.computer_cards.value.indexOf(",") == -1) {
  setTimeout("endGame('winner');",2000);}
  
  
  
}

function revealComputerCard (card_number) {
  
     var player_card_back = document.getElementById('computer_card_back');
     var player_card = document.getElementById('computer_card');
     
     player_card.style.display = '';
 	 player_card.innerHTML = player_card.innerHTML.replace("[player_name]",player_names[card_number-1]);
 	 player_card.innerHTML = player_card.innerHTML.replace("[photo]",player_names[card_number-1].replace(/ /g, "_"));
     player_card.innerHTML = player_card.innerHTML.replace("[highscore]",high_scores[card_number-1]);
     player_card.innerHTML = player_card.innerHTML.replace("[4shit]",fours[card_number-1]);
     player_card.innerHTML = player_card.innerHTML.replace("[6shit]",sixes[card_number-1]);
     player_card.innerHTML = player_card.innerHTML.replace("[height]",heights[card_number-1]);
     
     player_card_back.style.display = 'none';
     
}

function resetBoard () {
     var vs = document.getElementById("vs");
     var lose = document.getElementById("lose");
     var win = document.getElementById("win");
     var draw = document.getElementById("draw");
     
     vs.style.display = '';
     win.style.display = 'none';
     lose.style.display = 'none';
     draw.style.display = 'none';
     
     var test1 = document.getElementById('computer_chooses')
	 test1.innerHTML = ''
      
   var player_card = document.getElementById('player_card');
   var computer_card = document.getElementById('computer_card');
   var computer_card_back = document.getElementById('computer_card_back');
   player_card.innerHTML = "<IMG src=./images/card_blank.jpg><DIV id=player_cards_left></div><DIV id=player_card_photo>[player_name]<br><IMG src=./images/[photo].jpg width=150px><table><tr onclick='playCard(1);'><td>High Score:</td><td>[highscore]</td></tr><tr onclick='playCard(2);'><td>Fours Hit:</td><td>[4shit]</td></tr><tr onclick='playCard(3);'><td>Sixes Hit:</td><td>[6shit]</td></tr><tr onclick='playCard(4);'><td>Height:</td><td>[height]cm</td></tr></table></div></div>";
   computer_card.innerHTML = "<IMG src=./images/card_blank.jpg><DIV id=player_card_photo>[player_name]<br><IMG src=./images/[photo].jpg width=150px><table><tr onclick='playCard(1);'><td>High Score:</td><td>[highscore]</td></tr><tr onclick='playCard(2);'><td>Fours Hit:</td><td>[4shit]</td></tr><tr onclick='playCard(3);'><td>Sixes Hit:</td><td>[6shit]</td></tr><tr onclick='playCard(4);'><td>Height:</td><td>[height]cm</td></tr></table></div></div>";
   computer_card.style.display = 'none';
   computer_card_back.style.display = '';
   
   
    var tmp = document.form.player_cards.value.split(",");
    var player_card = parseInt(tmp[1]);
    //alert(player_card);
    if (player_card > 0) {
    revealPlayerCard(player_card);
     } else {
    player_card =document.form.player_cards.value.replace(", ", "");
    revealPlayerCard(player_card);
     }
     updateCardsRemaining();
     //alert(whosgo);
     if (whosgo == "computer") {
     var player_card = document.getElementById('player_card');
     var computer_card = document.getElementById('computer_card');
     player_card.innerHTML = player_card.innerHTML.replace(/onclick/g, "")
     computer_card.innerHTML = computer_card.innerHTML.replace(/onclick/g, "")
     computerTurn();
     }
   }

function revealPlayerCard (card_number) {

     var player_card_back = document.getElementById('player_card_back');
     var player_card = document.getElementById('player_card');
 
     player_card.style.display = '';
 	 player_card.innerHTML = player_card.innerHTML.replace("[player_name]",player_names[card_number-1]);
 	 player_card.innerHTML = player_card.innerHTML.replace("[photo]",player_names[card_number-1].replace(/ /g, "_"));
     player_card.innerHTML = player_card.innerHTML.replace("[highscore]",high_scores[card_number-1]);
     player_card.innerHTML = player_card.innerHTML.replace("[4shit]",fours[card_number-1]);
     player_card.innerHTML = player_card.innerHTML.replace("[6shit]",sixes[card_number-1]);
     player_card.innerHTML = player_card.innerHTML.replace("[height]",heights[card_number-1]);
     
     player_card_back.style.display = 'none';
}

function computerTurn() {
	var tmp = document.form.computer_cards.value.split(",");
    var computer_card = parseInt(tmp[1]);
	revealComputerCard(computer_card);
	var how_many = 0;
	var which = 1;
	if (difficulty == "easy") {
	factor = 1.5;
	}
	if (difficulty == "medium") {
	factor = 1;
	}
	if (difficulty == "hard") {
	factor = 0;
	}
	len = high_scores.length
	//alert("score: "+high_scores[computer_card-1])
	//alert("fours: "+fours[computer_card-1])
	//alert("sixes: "+sixes[computer_card-1])
	for (n = 0; n < len; n++) {
	//alert(high_scores[n])
	if (parseInt(high_scores[n])+(Math.random()*factor*high_scores[n]) > parseInt(high_scores[computer_card-1])) {
	 how_many = how_many+1
	 }
	}
	//alert("actual:"+how_many);
	var how_many_old = how_many-(Math.random()*factor*how_many)
	//alert("used:"+how_many_old);
	
	
	how_many =0;
	for (n = 0; n < len; n++) {
	
	if (parseInt(fours[n])+(Math.random()*factor*fours[n]) > parseInt(fours[computer_card-1])) {
	 how_many = how_many+1
	 }
	}
	//alert(how_many);
	if (how_many < how_many_old) {
	which = 2;
	how_many_old = how_many-(Math.random()*factor*how_many);
	}
	
	how_many =0;
	for (n = 0; n < len; n++) {
	if (parseInt(sixes[n])+(Math.random()*factor*sixes[n]) > parseInt(sixes[computer_card-1])) {
	 how_many = how_many+1
	 }
	}
	//alert(how_many);
	if (how_many < how_many_old) {
	which = 3;
	how_many_old = how_many-(Math.random()*factor*how_many);
	}
	
	how_many =0;
	for (n = 0; n < len; n++) {
	if ((parseInt(heights[n])+parseInt(Math.random()*factor*heights[n])) > parseInt(heights[computer_card-1])) {
		 how_many = how_many+1
	 }
	}
	//alert(how_many);
	if (how_many < how_many_old) {
	which = 4;
	how_many_old = how_many-(Math.random()*factor*how_many);
	}
	
	var test1 = document.getElementById('computer_chooses')
	if (which == 1) {
	setTimeout("document.getElementById('computer_chooses').innerHTML = 'Computer Chooses:<BR>High Score';",1000);
	
	}
	if (which == 2) {
	setTimeout("document.getElementById('computer_chooses').innerHTML = 'Computer Chooses:<BR>Fours Hit';",1000);
	
	}
	if (which == 3) {
	
	setTimeout("document.getElementById('computer_chooses').innerHTML = 'Computer Chooses:<BR>Sixes Hit';", 1000);
	}
	
	if (which == 4) {
	
	setTimeout("document.getElementById('computer_chooses').innerHTML = 'Computer Chooses:<BR>Height';", 1000);
	}
	playCard(which);
}

function sortNumber(a,b)
{
return a - b
}

function endGame(state) {
   pause(1000);
   if (state == "winner") {
   var now2 = new Date();
   var end_time = now2.getTime()
   if (document.form.no_of_cards.value == 34 && difficulty == "hard") {
   document.getElementById("game_space").innerHTML = '<BR><BR><font size=5>You are the WINNER!</font><BR><BR>You took: '+(end_time-start_time)/1000+' seconds<BR><BR><input type=button value="Submit High Score!" onClick="submitHighScore('+(end_time-start_time)/1000+');"><BR><BR><input type=button value="Play Again!" onClick="window.location.reload( false );">';
   } else {
   document.getElementById("game_space").innerHTML = '<BR><BR><font size=5>You are the WINNER!</font><BR><BR>You took: '+(end_time-start_time)/1000+' seconds<BR><BR><input type=button value="Play Again!" onClick="window.location.reload( false );"><BR><BR>You need to play on hard with all 34 cards to get on the high scores board.';
   }
   }
   if (state == "loser") {
   document.getElementById("game_space").innerHTML = '<BR><BR><font size=5>You are a LOSER!</font><BR><BR><input type=button value="Play Again!" onClick="window.location.reload( false );">';
   }
}

function pause(millis) 
{
var date = new Date();
var curDate = null;

do { curDate = new Date(); } 
while(curDate-date < millis);
} 

function updateDescription() {
  tmp = document.form.difficulty.options[document.form.difficulty.selectedIndex].value;
  if (tmp == "easy") {
  document.getElementById("description").innerHTML = "The Computer is little better than a random number machine, you'd have to be a fool to lose";
  }
  if (tmp == "medium") {
  document.getElementById("description").innerHTML = "The Computer will make the odd mistake, it's stats are still pretty solid though.";
  }
  if (tmp == "hard") {
  document.getElementById("description").innerHTML = "The Computer is ruthless statistical machine.";
  }
}

function submitHighScore(score) {
					if (score > 0) {
					username=prompt("Please enter your name","Enter your name here");  
                    }
                    else {
                    username = "";
                    }
                      xmlHttp=GetXmlHttpObject()
                       if (xmlHttp==null)
                          {
                           alert ("Browser does not support HTTP Request")
                           return
                          } 
                          var url="./tt_high_scores.asp"
                          url=url+"?score="+score
                          url=url+"&user_name="+username
                          url=url+"&sid="+Math.random()
                          xmlHttp.onreadystatechange=stateChanged
                          xmlHttp.open("GET",url,true)
                          xmlHttp.send(null)
      }

      function stateChanged() 
          { 
            
            if (xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
          { 
            document.getElementById('game_space').innerHTML=xmlHttp.responseText;
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
<link rel="stylesheet" type="text/css" href="./css/top_trumps.css"> 
<meta name="Microsoft Theme" content="none, default">
</head>




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
		<DIV align=center>
		Welcome to VCC Top Trumps! (beta)<BR><BR>
		<DIV align=center id=game_space>
		<FORM name=form>
		<Table width=100%>
		<TR valign=top>
			<TD width=33% align=center>
				<DIV id=player_card style='display: none;'>
				
				<IMG src=./images/card_blank.jpg>
				<DIV id=player_cards_left>
				</div>
				<DIV id=player_card_photo>
				[player_name]<br>
				<IMG src=./images/[photo].jpg height=150px>
				<table>
				  <tr id=player_1 onclick='playCard("1");'>
				       	<td >High Score:</td>
				    	<td>[highscore]</td>
				  </tr>
				  <tr id=player_2 onclick='playCard("2");'>
				    <td>Fours Hit:</td>
				    <td>[4shit]</td>
				  </tr>
				  <tr onclick='playCard("3");'>
				    <td>Sixes Hit:</td>
				    <td>[6shit]</td>
				    
				  </tr>
				  <tr onclick='playCard("4");'>
				    <td>Height:</td>
				    <td>[height]cm</td>
				    
				  </tr>
				  </table>
				  
				</div>
				</div>
				<div id=player_card_back>
				<IMG src=./images/card.jpg >
				</div>
				<INPUT type=hidden name=player_cards>
				<INPUT type=hidden name=tied_cards>
				
			</td>
			<TD width=33% align=center>
				<DIV id=center_space>
					<DIV id=deal>
						Enter number of cards for game:<br>(Max 34)
						<INPUT name=no_of_cards size=3><br><BR>
						Choose Difficulty:<br><Select name=difficulty onChange='updateDescription();'><option SELECTED value=hard>Hard</option><option value=medium>Medium</option><option value=easy>Easy</option></select>
						<BR><BR>
						<DIV id=description>The Computer is ruthless statistical machine.</div>
						<br><BR><INPUT type=button name=play value=Deal! onclick='startGame()'>
						<BR><BR><INPUT type=button name=high_scores value="View High Scores" onclick='submitHighScore()'>
					</div>
					<DIV id=vs style='display: none;'>
						VS<BR><BR>
						<FONT size=2>Tied Cards:</font><br>
						<SPAN id=cards_in_pot></span>
						
					</div>
					<DIV id=win style='display: none;'>
					You<br>Win!<BR><BR>
					<INPUT type=button value="Next" onclick='resetBoard();'>
					</div>
					<DIV id=lose style='display: none;'>
					You<br>Lose!<BR><BR>
					<INPUT type=button value="Next" onclick='resetBoard();'>
					</div>
					<DIV id=draw style='display: none;'>
					Its a<br>
					Tie!<BR><BR>
					<INPUT type=button value="Next" onclick='resetBoard();'>
					</div>
					<DIV id=computer_chooses></div>

				</div>
			<TD width=33% align=center>
			    <DIV id=computer_card style='display: none;'>
				
				<IMG src=./images/card_blank.jpg>
				
				<DIV id=player_card_photo>
				[player_name]<br>
				<IMG src=./images/[photo].jpg height=150px>
				<table>
				  <tr id=computer_1 onclick='playCard("1");'>
				    <td>High Score:</td>
				    <td>[highscore]</td>
				    
				  </tr>
				  <tr id=computer_2 onclick='playCard("2");'>
				    <td>Fours Hit:</td>
				    <td>[4shit]</td>
				  </tr>
				  <tr id=computer_3 onclick='playCard("3");'>
				    <td>Sixes Hit:</td>
				    <td>[6shit]</td>
				    
				  </tr>
				  <tr onclick='playCard("4");'>
				    <td>Height:</td>
				    <td>[height]cm</td>
				    
				  </tr>
				  </table>
				  
				</div>
				</div>
				<DIV id=computer_card_back>
				<IMG src=./images/card.jpg >
				<DIV id=computer_cards_left></div>
				</div>
				<INPUT type=hidden name=computer_cards>
			</td>
		</tr>
		</table>
		</div>
		</form>
		</div>
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