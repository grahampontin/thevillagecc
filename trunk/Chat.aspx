<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Chat.aspx.cs" Inherits="Chat"  %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>The Village Cricket Club Online | Chat</title>
    
    <script type="text/javascript" src="./plugins/fckeditor/fckeditor.js"></script>
    
    <script language="javascript" type="text/javascript">
        $(document).ready(function() {
                    var startDateQS = $.getQueryString({id:"startDate", defaultvalue:0}) 
                    var startDate;
                    if (startDateQS!=0) {
                        var mySplitResult = startDateQS.split("/")
                        startDate = Date.UTC(mySplitResult[2],mySplitResult[1]-1,mySplitResult[0],0,0,0);
                    } else {
                        startDate = 0;
                    }
                    var now = new Date();
                    var TodayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0);
                    if (startDate < TodayUtc && startDate != 0) 
                    {
                        $("#hints").html("<li>You are looking at chat history - go back to today's chat to post</li>");
                        $("#ChatInputArea").hide();
                    } else {
                        window.setInterval("update()", 10000);
                    }
                    
                    
                    $.post("ChatAjaxHandler.aspx", {timestamp: startDate}, function(data){
                        if(data.length >0) {
                            $('#Chat').html(data);
                            $('.fadeIn').show().removeClass("fadeIn");
                        }
                        checkPhotos();
                        resizeNewPhoto();
                    });
                    
                    $("#hints").innerfade({
                            speed: 1000,
				            timeout: 10000});
                });
    
        var lastupdate = new Date();
        
        function update() {
            $.post("ChatAjaxHandler.aspx", {timestamp: lastupdate.getTime()}, function(data){
            if(data.length >0) {
                $('#Chat').prepend(data);
                checkPhotos();
                ShowSayIt();
                $('.fadeIn').slideDown('slow').pulse({
                    speed: 500,
                    opacityRange: [0.4,0.9]
                });
                                
            }
        });
           lastupdate = new Date();
           setTimeout("$('.fadeIn').recover(); recoverClearType($('.fadeIn')); $('.fadeIn').removeClass(\"fadeIn\");", 3000); 
        }
     
        function recoverClearType(elements) {
            if (jQuery.browser.msie) {
               jQuery.each(elements, function() {
                    $(this).get(0).style.removeAttribute('filter');
               });
           }
        }
        
        function postComment()
        {
            ShowWaiting();
            var imageUrl = $('#ChatImage').attr("src");
            var oEditor = FCKeditorAPI.GetInstance('FCKeditor1') ;
            var comment = oEditor.GetHTML();
            var name = $('#ChatName').val();
            if (name == 'enter your name' || name == '') 
            {
                alert("Don't you have a name?");
                ShowSayIt();
            }
            else if (comment == '') 
            {
                alert("You've not said anything. You see that big box in the middle of the screen? Try typing something in there.");
                ShowSayIt();
                
            } else {
            $.post("ChatAjaxHandler.aspx", {action: 'post', name: name, comment: comment, imageUrl: imageUrl });
            }
        }
        
        function checkPhotos()
        {
            $('.CheckSize').each(
                    function( intIndex ){
                        if (this.height > 80) {
                            this.width = this.width * (80/this.height);
                            this.height = 80;
                            
                        }
            
            });
            
            $('.ChatItem img').each(
                    function( intIndex ){
                        var tolerance = 300;
                        if (this.height > tolerance) {
                            this.width = this.width * (tolerance/this.height);
                            this.height = tolerance;
                            
                        }
                        if (this.width > tolerance){
                            this.height = this.height * (tolerance/this.width);
                            this.width = tolerance;
                            
                        }
            
            });
            
        }
        
        function resizeNewPhoto() {
            $('#ChatImage').each(
                    function( intIndex ){
                        if (this.height > 120) {
                            this.width = this.width * (120/this.height);
                            this.height = 120;
                            
                        }
            
            });
            
        
        }
        
        function changePhoto() 
        {
            var urlPopup = $('#urlPopup');
            var bg = $('#backgroundFilter');
            bg.toggle();
            urlPopup.toggle();
            
        }

        function savePhoto()
        {
            var url = $('#newphotourl').val();
            $('#ChatInputPhoto').html('<a href=# onclick="changePhoto();"><img id="ChatImage" src="'+url+'" Width="150px"  alt="Click to Change" /></a>');
            resizeNewPhoto();
            changePhoto();
        }
        
        function ShowSayIt() 
        {
            $('#SayIt').show();
            $('#PostWaiting').hide();
        }
        
        function ShowWaiting() 
        {
            $('#SayIt').hide();
            $('#PostWaiting').show();
        }
        
        function clearDefaultText(text, element)
        {
            if ($(this).val() == text) 
            {
            
            }
        }
        
        function hideHints() {
            $("#hintsDiv").fadeOut();
        }
        
            
    </script>
    
</head>
<body>
    
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header" runat=server />
        <!-- End Head -->
        <div id="mainContent">
        <form id="form1" runat="server">
        <div class="standardText">
        Welcome to VCC online's finest Chat facility or "Guestbook 2" if you prefer. Post some comments, abuse your team mates,
        spend a whole day pretending to be Bomb: Whatever takes your fancy really.
        </div>
        <div class="horizontalDivider"></div>
        <div id="ChatInputArea">
            <div class=ChatLeftPanel>
                <div class="ChatPhoto" id="ChatInputPhoto">
                    <a href="javascript:changePhoto();">
                        <img id="ChatImage" src="<%=ImageUrl %>" width="150px"  alt="Click to Change" />
                    </a>
                </div>
                <div id="urlPopup">
                    Copy and paste the photo url here: <br />
                    <input id="newphotourl" size=200/><br />
                    <a href="javascript:savePhoto();">save</a>&nbsp;&nbsp;<a href=# onclick="changePhoto();">cancel</a>
                </div>
                <div id="backgroundFilter">
                </div>
                <div class="ChatName">
                    <input id="ChatName" title="enter your name"/><br />
                    <div id="SayIt">
                        <a href="javascript:postComment();">Say it, damn it!</a>
                    </div>
                    <div id="PostWaiting">
                        <img src="Images/ajax-loader.gif" width=120px />
                    </div>
                </div>
            </div>
            <div class="ChatInputBox">
                <script type="text/javascript">
                    var oFCKeditor = new FCKeditor( 'FCKeditor1' ) ;
                    oFCKeditor.BasePath	= "./plugins/fckeditor/";
                    oFCKeditor.Height	= 180;
                    oFCKeditor.Width = 840;
                    oFCKeditor.ToolbarSet = "Basic";
                    oFCKeditor.Value	= '' ;
                    oFCKeditor.Create() ;
		        </script>
            </div>
        
        </div>
        <div class="horizontalDivider"></div>
        <div class="standardText" id="hintsDiv">
        <div class="floatLeft">
            <img src="Images/information20x20.jpg" class="infoImage"/>
        </div>
        <ul id=hints>
            <li>Click on the photo to select a new image for yourself&nbsp;&nbsp;&nbsp;<a href="javascript:hideHints();">Hide hints</a> </li>
            <li>You can embed an image using the image button in the editor or you can use 
                special "guestbook markup" like this: [http://TheUrlOfMyImage.com/myImage.jpg@IMG]
            </li>
            <li>You can embed a youtube clip using some special "guestbook markup" like this: 
                [h8Ytghv@YouTube] where "h8Ytghv" is the id of the clip you want to embed.
            </li>
            <li>
                You can't use HTML in the editor anymore - post images using the markup or the link in the editor and 
                format text like you would in Word.
            </li>
            <li>
                Try not to paste stuff directly from Word into the editor - it tends to fuck things up.
            </li>
            <li>
                You should never need to refresh the page - it checks for new messages every 10 seconds.
                If things go screwy though - try a refresh.
            </li>
            <li>
                The Guestbook shows one day of chat at a time - use the links at the bottom to move between days.
            </li>
        </ul>
        </div>
        <div class="horizontalDivider"></div>
        <div id="ChatArea">
            <ul id="Chat">
            <!-- Chat Placeholder - Ajax Filled -->
            </ul>
        </div>
        <asp:HyperLink ID="previousDay" runat=server Text="< previous day"></asp:HyperLink>
        <asp:HyperLink ID="nextDay" runat=server Text="next day >"></asp:HyperLink>
        
        </form>
        </div>
        
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>

