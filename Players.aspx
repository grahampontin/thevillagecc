<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Players.aspx.cs" Inherits="Players" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html lang="en">
<head runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>The Village Cricket Club Online | Players</title>
    <CC:Styles runat=server ID=styles />    
    
    <link href="CSS/default.css" rel="stylesheet" type="text/css" />
    <script src="Plugins/Uploadify/jquery.uploadify.v2.1.0.min.js" type="text/javascript"></script>
    <link href="Plugins/Uploadify/uploadify.css" rel="stylesheet" type="text/css" />
    <script src="Plugins/Uploadify/swfobject.js" type="text/javascript"></script>
    <link href="CSS/jquery.Jcrop.min.css" rel="stylesheet" type="text/css" />
    <script src="Script/jquery.Jcrop.min.js" type="text/javascript"></script>

    <script>

        function OpenDetails(PlayerID, Name) 
        {
            $.post('PlayerProfileAJAX.aspx?random=' + new Date().getTime(), { PlayerID: PlayerID }, function (data) {
                BootstrapDialog.show({
                    title: Name,
                    message: $('<div></div>').html(data),
                    closable: false,
                    buttons: [{
                        label: 'Edit details',
                        cssClass: 'btn-primary',
                        action: function (dialogRef) {
                            dialogRef.close();
                            EditPlayer(PlayerID, Name);
                        }
                    }, {
                        label: 'Close',
                        cssClass: 'btn-default',
                        action: function (dialogRef) {
                            dialogRef.close();
                        }
                    } ]
                });
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
                BootstrapDialog.show({
                    title: Name,
                    message: $('<div></div>').html(data),
                    closable: false,
                    buttons: [{
                        label: 'Save',
                        cssClass: 'btn-primary',
                        action: function (dialogRef) {
                            $.post('PlayerProfileEditAJAX.aspx',
                            {
                                Action: 'save',
                                PlayerID: PlayerID,
                                Name: $("#name").val(),
                                DOB: $("#dob").val(),
                                Education: $("#education").val(),
                                Nickname: $("#nickname").val(),
                                Role: $("#role").val(),
                                BattingStyle: $("#battingstyle").val(),
                                BowlingStyle: $("#bowlingstyle").val(),
                                Bio: $("#bioInput").html()
                        },
                                function (data) {
                                    dialogRef.close();
                                    OpenDetails(PlayerID, Name);
                                }
                                  );
                            return false;

                        }
                    }, {
                        label: 'Cancel',
                        cssClass: 'btn-danger',
                        action: function (dialogRef) {
                            dialogRef.close();
                            OpenDetails(PlayerID, Name);
                        }
                    }],
                    onshown: function(dialogRef) {
                        $("#bioInput").wysihtml5();
                        bindPhotoEdit(PlayerID, Name, dialogRef);
                    }
                });
            });
        }

        function bindPhotoEdit(PlayerID, Name, dialogRef) {
            $(".playerProfileImageLarge").click(function () {
                $.post('PlayerImageUploaderAJAX.aspx', { PlayerID: PlayerID }, function (data) {
                    dialogRef.close();
                    BootstrapDialog.show({
                        title: Name,
                        message: $('<div></div>').html(data),
                        closable: false,
                        onshown: function(dialogRef) {
                            bindUploadify(dialogRef, PlayerID, Name);
                        }
                    });
                });
            });
        }

        function bindUploadify(dialogRef, PlayerID, Name) {
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
                    $.post('PlayerImageUploaderAJAX.aspx', { PlayerID: PlayerID, ImageName: fileObj.name, FilePath: fileObj.filePath, Action: 'uploadComplete' }, function (data) {
                        dialogRef.close();
                        BootstrapDialog.show({
                            title: 'Crop image',
                            message: $('<div></div>').html(data),
                            closable: false,
                            onshown: function (dialogRef) {
                                $("#tempImage").Jcrop({ aspectRatio: 16 / 9, setSelect: [0, 0, 160, 90], onSelect: updateCoords, onChange: updateCoords });
                            }, buttons: [{
                                label: 'Crop it',
                                cssClass: 'btn-primary',
                                action: function (dialogRef) {
                                    $.post('PlayerImageUploaderAJAX.aspx', { PlayerID: PlayerID, ImageName: fileObj.name, X: $("#X").val(), Y: $("#Y").val(), W: $("#W").val(), H: $("#H").val(), Action: 'CropAndSave' }, function (data) {
                                        dialogRef.close();
                                        OpenDetails(PlayerID, Name);
                                    });
                                }
                            }, {
                                label: 'Cancel',
                                cssClass: 'btn-danger',
                                action: function (dialogRef) {
                                    dialogRef.close();
                                    OpenDetails(PlayerID, Name);
                                }
                            }]
                        });
                    });
                }
            });
        }

    </script>
    <style>
        .modal-body {
            height: auto;
            width: 700px;
            overflow: auto;
        }
        .modal-content {
            width: 700px;
        }
    </style>
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
           <h1>Village CC Playing Squad</h1>

           <asp:ListView ID="PlayersGrid" runat="server" onitemdatabound="PlayersGrid_ItemDataBound">
           <LayoutTemplate>
                    <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
           </LayoutTemplate>

           <ItemTemplate>
               <asp:Literal ID="newRowDiv" runat="server"></asp:Literal>
               <div class="col-sm-3">
                   <div class="panel panel-default">
                        <div class="panel-heading">
                            <%#Eval("name") %>  
                        </div>
                        <div class="panel-body">
                            <div>
                                <asp:Image ID=PlayerImage runat=server Width=180px Height=100px /> 
                            </div>
                            <div class="playerProfileStats">
                                <div  class="playerProfileStat">
                                    <strong>Playing Role:&nbsp;</strong><%#Eval("PlayingRole") %></div>
                                <div class="playerProfileStat">
                                    <strong>Batting Style:&nbsp;</strong><%#Eval("BattingStyle") %></div>
                                <div class="playerProfileStat">
                                    <strong>Bowling Style:&nbsp;</strong><%#Eval("BowlingStyle") %></div>
                                <div class="playerProfileStat">
                                    <strong>Debut:&nbsp;</strong><%#Eval("Debut", "{0:dd MMM yyyy}") %></div>
                                <div class="playerProfileStat">
                                    <strong>Caps:&nbsp;</strong><%#Eval("Caps")%>
                                </div>
                            </div>
                            <div class="playerProfileMoreLink"><a href="javascript:OpenDetails(<%#Eval("ID") %>,'<%#Eval("FullName") %>' )">more...</a></div>    
                        </div>
                        
                    </div>
               </div>
               <asp:Literal ID="newRowEndDiv" runat="server"></asp:Literal>
               
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
