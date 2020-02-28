<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Test.aspx.cs" Inherits="Test" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Untitled Page</title>
    
    <script language="javascript" src="Script/jquery-1.2.6.js" type="text/javascript"></script>
    <script language="javascript" src="Script/jquery.newsTicker.js" type="text/javascript"></script>
    <script language="javascript" src="Script/pulse.jquery.js" type="text/javascript"></script>
    
    <script language="javascript" type="text/javascript">
        var lastupdate = new Date();
        
        function update() {
            $.post("ajax.aspx", {test: lastupdate.getTime()}, function(data){
            if(data.length >0) {
                $('#chat').prepend(data);
                $('.fadeIn').slideDown('slow').pulse({
                    speed: 500,
                    opacityRange: [0.4,0.9]
                });
                
            }
        });
           lastupdate = new Date();
           setTimeout("$('.fadeIn').recover(); recoverClearType($('.fadeIn')); $('.fadeIn').removeClass(\"fadeIn\");", 3000); 
        }
     
        $(document).ready(function() { window.setInterval("update()", 10000);});
        
        function recoverClearType(elements) {
            if (jQuery.browser.msie) {
               jQuery.each(elements, function() {
                    $(this).get(0).style.removeAttribute('filter');
               });
           }
        }    
           
        
        
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <ul id="chat">
            <li>test 1</li>
        </ul>
    </div>
    <input type=button value=update onclick="javascript:update();" />
    </form>
</body>
</html>
