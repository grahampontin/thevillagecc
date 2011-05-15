<%@ Page Language="C#" AutoEventWireup="true" CodeFile="BallByBall.aspx.cs" Inherits="MobileWeb_BallByBall" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta name="HandheldFriendly" content="true" />    
    <meta name="viewport" content="width=360px, height=device-height, user-scalable=no, target-densityDpi=device-dpi" />

    <link href="../CSS/reset.css" rel="stylesheet" type="text/css" media="screen" />
    <link href="../CSS/base.css" rel="stylesheet" type="text/css" media="screen" />
    <link href="../CSS/ui-smoothness/jquery-ui-1.8.1.custom.css" rel="stylesheet" type="text/css" media="screen" />
    <link href="css/mobile.css" rel="stylesheet" type="text/css" media="screen" />
    
    <script language="javascript" src="../Script/jquery-1.4.2.min.js" type="text/javascript"></script>
    <script language="javascript" src="../Script/jquery-ui-1.8.1.custom.min.js" type="text/javascript"></script>
    <script language="javascript" src="../Script/jquery.labelify.js" type="text/javascript"></script>
    
    <script language="javascript" src="script/ballbyball.js" type="text/javascript"></script>
    
    <title>The Village CC Mobile Web | Ball By Ball</title>
</head>
<body>
    <form id="form1" runat="server">
    <div id="OverSummary">
        | ? ? ? ? ? ? |
    </div>
    <div id="ScoreButtons">
        <div class="ButtonRow">
            <button name="0">0</button>
            <button name=1 value=1>1</button>
            <button name=2 value=2>2</button>
            <button name=3 value=3>3</button>
            <button name=4 value=4>4</button>
            <button name=5 value=5>5</button>
            <button name=6 value=6>6</button>
        </div>
        <div class="ButtonRow">
            <button name=Runs value="Runs">Runs</button>
            <button name=Wides value="Wides">Wides</button>
            <!-- runs for a no ball?! -->
            <button name="NoBalls" value="No Balls">No Balls</button>
            <button name="Wicket" value="OUT!">OUT!</button>
        </div>
    </div>
    </form>
</body>
</html>
