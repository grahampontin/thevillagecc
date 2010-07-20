<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Players.aspx.cs" Inherits="Players" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>The Village Cricket Club Online | Players</title>
    <CC:Styles runat=server ID=styles />    
    
    <link href="CSS/default.css" rel="stylesheet" type="text/css" />
    <script src="Script/jHtmlArea-0.7.0.min.js" type="text/javascript"></script>
    <script src="Script/jHtmlArea.ColorPickerMenu-0.7.0.min.js" type="text/javascript"></script>
    <link href="Plugins/jHTMLArea/jHtmlArea.ColorPickerMenu.css" rel="stylesheet" type="text/css" />
    <link href="Plugins/jHTMLArea/jHtmlArea.Editor.css" rel="stylesheet" type="text/css" />
    <link href="Plugins/jHTMLArea/jHtmlArea.css" rel="stylesheet" type="text/css" />
    <script src="Plugins/Uploadify/jquery.uploadify.v2.1.0.min.js" type="text/javascript"></script>
    <link href="Plugins/Uploadify/uploadify.css" rel="stylesheet" type="text/css" />
    <script src="Plugins/Uploadify/swfobject.js" type="text/javascript"></script>
    <link href="CSS/jquery.Jcrop.css" rel="stylesheet" type="text/css" />
    <script src="Script/jquery.Jcrop.min.js" type="text/javascript"></script>

    <script language=javascript>

        $.fx.speeds._default = 1000;
        $(function () {
            $('#dialog').dialog({
                autoOpen: false,
                modal: 'true',
                width: 690,
                height: 490,
                resizable: false

            });

           
        });


        function OpenDetails(PlayerID, Name) 
        {
            $('#dialog').dialog("option", "title", Name);
            $('#dialog').html('<img src="/img/loading_big.gif">');
            $('#dialog').dialog('open');
            $.post('PlayerProfileAJAX.aspx', { PlayerID: PlayerID }, function(data) {
                $('#dialog').html(data);
            });


        }

        function updateCoords(c) {
            $('#X').val(c.x);
            $('#Y').val(c.y);
            $('#W').val(c.w);
            $('#H').val(c.h);
        };


        function EditPlayer(PlayerID, Name) {
            $.post('PlayerProfileEditAJAX.aspx', { PlayerID: PlayerID }, function (data) {
                $('#dialog').html(data);
                $("#bioInput").htmlarea({
                    toolbar: [
                    ["bold", "italic", "underline", "strikeThrough"],
                    ["orderedList", "unorderedList", "|", "superscript", "subscript"],
                    ["increaseFontSize", "decreaseFontSize", "|", "justifyLeft", "justifyCenter", "justifyRight"],
                    ["link", "unlink", "indent", "outdent", "html"]
                        ]
                }

                    );

                $("button").button();

                $('#saveButton').click(function () {
                    $.post('PlayerProfileEditAJAX.aspx',
                        { Action: 'save',
                            PlayerID: PlayerID,
                            Name: $("#name").val(),
                            DOB: $("#dob").val(),
                            Education: $("#education").val(),
                            Nickname: $("#nickname").val(),
                            Role: $("#role").val(),
                            BattingStyle: $("#battingstyle").val(),
                            BowlingStyle: $("#bowlingstyle").val(),
                            Bio: $("#bioInput").htmlarea("toHtmlString")
                        },
                        function (data) {
                            OpenDetails(PlayerID, Name);
                        }
                          );
                    return false;
                });

                $('#cancelButton').click(function () {
                    OpenDetails(PlayerID, Name);
                });

                $(".playerProfileImageLarge").click(function () {

                    $.post('PlayerImageUploaderAJAX.aspx', { PlayerID: PlayerID }, function (data) {
                        $('#dialog').html(data);
                        $('#uploader').uploadify({
                            'uploader': '/plugins/uploadify/uploadify.swf',
                            'script': '/Plugins/Uploadify/upload.ashx',
                            'folder': '/Players/pictures/uploads/',
                            'cancelImg': '/plugins/uploadify/cancel.png',
                            'auto': true,
                            'onError': function (event, queueID, fileObj, errorObj) {
                                alert('error');
                            },
                            'onComplete': function (event, queueID, fileObj, response, data) {
                                $.post('PlayerImageUploaderAJAX.aspx', { PlayerID: PlayerID, ImageName: fileObj.name, FilePath: fileObj.filepath, Action: 'uploadComplete' }, function (data) {
                                    $('#dialog').html(data);
                                    $("#tempImage").Jcrop({ aspectRatio: 16 / 9, setSelect: [0, 0, 160, 90], onSelect: updateCoords, onChange: updateCoords });
                                    $("#CropButton").button();
                                    $("#CancelButton").button();
                                    $("#CropButton").click(function () {
                                        $.post('PlayerImageUploaderAJAX.aspx', { PlayerID: PlayerID, ImageName: fileObj.name, X: $("#X").val(), Y: $("#Y").val(), W: $("#W").val(), H: $("#H").val(), Action: 'CropAndSave' }, function (data) {
                                            OpenDetails(PlayerID, Name);

                                        });
                                        return false;
                                    });

                                    $("#CancelButton").click(function () { OpenDetails(PlayerID, Name); });
                                });
                            }


                        });
                    });



                });

            });
            
        }

    </script>
</head>
<body>
        <form id="form1" runat="server">
        
    <div id="pageContainer">
        <!-- Head -->
               
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer>
            
        </div>
        <div id="mainContent">
            <div class="PageHeading">
                Village CC Playing Squad
            </div>

           <asp:ListView ID="PlayersGrid" runat="server" 
                onitemdatabound="PlayersGrid_ItemDataBound">
           <LayoutTemplate>
            <ul id="grid">
                    <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
            </ul>
           </LayoutTemplate>

           <ItemTemplate>
                  <li class=floatRight>
                    <div class="ui-widget ui-widget-content ui-corner-all playerProfileSmall">
                        <div class=playerProfileName>
                            <%#Eval("name") %>  
                        </div>
                        <div class=playerProfilePhoto>
                            <asp:Image ID=PlayerImage runat=server Width=154px Height=86px /> 
                        </div>
                        <div class="playerProfileStats">
                            <div class="playerProfileStat">
                                <span>Playing Role:</span><%#Eval("PlayingRole") %></div>
                            <div class="playerProfileStat">
                                <span>Batting Style:</span><%#Eval("BattingStyle") %></div>
                            <div class="playerProfileStat">
                                <span>Bowling Style:</span><%#Eval("BowlingStyle") %></div>
                            <div class="playerProfileStat">
                                <span>Debut:</span><%#Eval("Debut", "{0:dd MMM yyyy}") %></div>
                            <div class="playerProfileStat">
                                <span>Caps:</span><%#Eval("Caps")%>
                            </div>
                        </div>
                        <div class="playerProfileMoreLink"><a href="javascript:OpenDetails(<%#Eval("ID") %>,'<%#Eval("FullName") %>' )">more...</a></div>
                    </div> 
                  </li>
            </ItemTemplate>
        </asp:ListView>
            
            
        <div id=dialog></div>

        </div>
        <div class=clearer></div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
        </form>
        </body>
</html>
