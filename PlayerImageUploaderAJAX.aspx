<%@ Page Language="C#" AutoEventWireup="true" CodeFile="PlayerImageUploaderAJAX.aspx.cs" Inherits="PlayerImageUploaderAJAX" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div id=step1 runat=server>
        Click browse to upload a new image for this player<br />
        <div id=uploader></div>
    </div>
    <div id=step2 runat=server visible=false>
        <asp:Image ID=tempImage runat=server />

        <input type=hidden ID="X"/>        
        <input type=hidden ID="Y" />        
        <input type=hidden ID="W" />        
        <input type=hidden ID="H" />


    </div>

    </form>
</body>
</html>
