<%@ Page Language="C#" AutoEventWireup="false" Src="UploadImages.aspx.cs" Inherits="Secure_UploadImages" %>
<%@ Register TagPrefix="Upload" Namespace="Brettle.Web.NeatUpload" Assembly="Brettle.Web.NeatUpload" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Carousel" Src="~/UserControls/PictureCarousel.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>
<%@ Register TagPrefix="CC" TagName="Security" Src="~/UserControls/Security.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <CC:Security ID=security1 runat=server />
	<head id="Head1" runat="server">
		<title>The Village CC Online | Upload Your Match Photos</title>
		<style type="text/css">
		.ProgressBar {
			margin: 0px;
			border: 0px;
			padding: 0px;
			width: 500px;
			height: 2em;
		}
		</style>
		<CC:Styles runat=server ID=styles /> 
	</head>
	<body>
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
        <form id="uploadForm" runat="server">
		<Upload:UnloadConfirmer ID="UnloadConfirmer1" runat="server"/>
			<h1>Upload Photos for Match <asp:Literal ID=MatchText runat=server></asp:Literal> </h1>
			<p>Please note: The maximum photo size is 200kb. We have a limited amount of space 
                on the website so don&#39;t upload loads of photos. The page will change very 
                obviously when the upload is finished - be patient. You images will be re-sized 
                to fit the gallery.<p>&nbsp;Image(s) to upload for this match: 
			<Upload:MultiFile id="multiFile" runat="server" useFlashIfAvailable="true" flashFilterExtensions="*.jpg;*.gif;*.png">
				<asp:Button id="multiFileButton" Text="Select Images..." Enabled="<%# multiFile.Enabled %>" runat="server"/>
			</Upload:MultiFile>
			<asp:RegularExpressionValidator id="RegularExpressionValidator2" 
				ControlToValidate="multiFile"
				ValidationExpression="(([^.;]*[.])+(jpg|gif|png|JPG|GIF|PNG); *)*(([^.;]*[.])+(jpg|gif|png|JPG|GIF|PNG))?$"
				Display="Static"
				ErrorMessage="Only jpg, gif, and png extensions allowed"
				EnableClientScript="True" 
				runat="server"/><br />
			</p>
			<span id="submitButtonSpan" runat="server">
			<asp:Button id="submitButton" runat="server" Text="Upload Images" />
			<asp:Button id="cancelButton" runat="server" Text="Cancel" CausesValidation="False"/><br />
			</span>

			<pre id="bodyPre" runat="server">
			
			</pre>
			<div id="inlineProgressBarDiv" runat="server">
			<div style="display: none;">
			<Upload:ProgressBar id="inlineProgressBar" runat="server" inline="true" Triggers="submitButton linkButton commandButton htmlInputButtonButton htmlInputButtonSubmit" />
			</div>
			<div>
			When you have done Uploading Files click <a href="./PublishImages.aspx?MatchID=<asp:Literal ID=MatchIDLiteral runat=server></asp:Literal>">here</a> to publish to the gallery...
			</div>
			<script type="text/javascript">
window.onload = function()
{
	var inlineProgressBar = NeatUploadPB.prototype.Bars["inlineProgressBar"];
	var origDisplay = inlineProgressBar.Display;
	inlineProgressBar.Display = function()
	{
		var elem = document.getElementById(this.ClientID);
		elem.parentNode.style.display = "block";
		origDisplay.call(this);
	}
	inlineProgressBar.EvalOnClose = "NeatUploadMainWindow.document.getElementById('" 
		+ inlineProgressBar.ClientID + "').parentNode.style.display = \"none\";";
}
</script>
			</div>

			
		</form>
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>