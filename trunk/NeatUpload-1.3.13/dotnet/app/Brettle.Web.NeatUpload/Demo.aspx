<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ Page language="c#" Src="Demo.aspx.cs" AutoEventWireup="false" Inherits="Brettle.Web.NeatUpload.Demo" %>
<%@ Register TagPrefix="Upload" Namespace="Brettle.Web.NeatUpload" Assembly="Brettle.Web.NeatUpload" %>
<html>
	<head runat="server">
		<title>Upload Your Match Photos</title>
		<style type="text/css">
		.ProgressBar {
			margin: 0px;
			border: 0px;
			padding: 0px;
			width: 100%;
			height: 2em;
		}
		</style>
	</head>
	<body>
		<form id="uploadForm" runat="server">
		<Upload:UnloadConfirmer runat="server"/>
			<h1>Upload Photos for Match <asp:Literal ID=MatchText runat=server></asp:Literal> </h1>
			<p>Image(s) to upload for this match: 
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
	</body>
</html>
