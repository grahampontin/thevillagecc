<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Committee.aspx.cs" Inherits="Committee" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>The Village Cricket Club Online | Committee</title>
    <CC:Styles runat=server ID=styles />    
    
</head>
<body>
        <form id="form1" runat="server">
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
            <div class=standardText>
                Here you have found the home page of the tedious bureaucracy that is the Village Cricket
                Club Committee. Its current occupants are as follows:
                
                <br />
                <br />
                <table border="0" width="100%" id="table1" style="border-collapse: collapse" bordercolor="#000000">
			<tr>
				<td><b><font face="Arial" size="2">Captain</font></b></td>
				<td style="border-right-style: solid; border-right-width: 1px">
				<font face="Arial" size="2">Paul Bowman</font></td>
				<td style="border-left-style: solid; border-left-width: 1px"><b>
				<font face="Arial" size="2">&nbsp; (Miami) Vice Captain</font></b></td>
				<td>Eklavya Gupte</td>
			</tr>
			<tr>
				<td><b><font face="Arial" size="2">Director of Cricket</font></b></td>
				<td style="border-right-style: solid; border-right-width: 1px">
				    Alex Page</td>
				<td><b><font face="Arial" size="2">&nbsp; Secretary</font></b></td>
				<td>
				    Alan White</td>
			</tr>
			<tr>
				<td><b>
				<font face="Arial" size="2">Treasurer</font></b></td>
				<td><font face="Arial" size="2">Alex Hanson</font></td>
				<td style="border-left-style: solid; border-left-width: 1px"><b>
				<font face="Arial" size="2">&nbsp; Fixtures Secretary</font></b></td>
				<td>Alan White</td>
			</tr>
			<tr>
				<td><b><font face="Arial" size="2">Social Secretary</font></b></td>
				<td style="border-right-style: solid; border-right-width: 1px">
				    Craig Woodhouse<font face="Arial" size="2"> </font></td>
				<td style="border-left-style: solid; border-left-width: 1px"><b>
				<font face="Arial" size="2">&nbsp; Webmaster</font></b></td>
				<td><font face="Arial" size="2">Graham Pontin</font></td>
			</tr>
			
		</table>
                
                <p align="center">
                    And they look like this bunch of fools:
                </p>
		        <p align="center">
		            <img alt="Committee" src="Images/VCC%20Committee%202010.jpg" width=500px /><br>
		            Back Row(Left to Right): Parp!, PK Bowman, Craig Woodhouse, Alan White, Alex Page<BR>
		            Front Row: Eklavya Gupte, Graham Pontin
		            <BR>
		            <br>
		            <a href = ./documents/constitutionSEPT2006.pdf>Constitution</a>
		            
		            <p align="center">
		
		                <table border="0" width="100%" id="table2">
			                <tr>
				                <td align="center" width=50%>
		                            <u><b>
		                            AGMs
		                            </b></u>
		                        </td>
				                <td align="center" width=50%>		
				                    <u><b>
		                            Minutes
		                            </b></u>
		                        </td>
			                </tr>
			                <tr>
				                <td align="center" width=50%>
		                            <a href = ./documents/IGM_5_2_2004.doc>IGM - 05/02/2004</a>
		                            <br>
		                            <a href = ./documents/AGM_29_1_2005.doc>1st AGM - 29/01/2005</a>
		                            <br>
  		                            <a href = ./documents/AGM_12_10_2005.doc>2nd AGM - 12/10/2005</a>
                            		<br>
                            		<a href = ./documents/AGM2006.pdf>3rd AGM - 30/9/2006</a>
		                            <br>
		                            <a href = ./documents/AGM2007.pdf>4th AGM - 17/11/2007</a>
                                    <br />
                                    5th AGM - Lost to the mists of time<br />
                                    6th AGM - 3/12/2009</td>
				                <td align="center">
		                            <a href = ./documents/Minutes_18_4_2004.rtf>08/04/2004</a>
		                            <br>
		                            <a href = ./documents/Minutes_15_1_2006.doc>15/1/2006</a>
                            		<br>
                            		<a href = ./documents/endofseason2007mins_B.pdf>18/10/2007 (The infamous pre-AGM Meeting)</a>
                                    <br />
		                        </td>
		                	</tr>
		            </table>
		        </p>
                
            </div>
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
        </form>
        </body>
</html>
