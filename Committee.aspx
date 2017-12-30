<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Committee.aspx.cs" Inherits="Committee" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html lang="en">
<head runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

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
            <h1>Committee</h1>
            <p class=standardText>
                Here you have found the home page of the tedious bureaucracy that is the Village Cricket
                Club Committee. Its current occupants are as follows:
            </p>
            <div class="row">
                <div class="col-sm-3">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Captain
                        </div>
                        <div class="panel-body">
                            <img src="Images/committee/cressy.jpg" width="200" style="padding-bottom: 10px;"/>
                            <div class="Centered">Richard Cressey</div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Vice-Captain
                        </div>
                        <div class="panel-body">
                            <img src="Images/committee/jdm.jpg" width="200px" style="padding-bottom: 10px;"/>
                            <div class="Centered">James de Mellow</div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Director of Cricket
                        </div>
                        <div class="panel-body">
                            <img src="Images/committee/thommo.jpg" width="200px" style="padding-bottom: 10px;"/>
                            <div class="Centered">Nick Price-Thompson</div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Treasurer
                        </div>
                        <div class="panel-body">
                            <img src="Images/committee/eddie.jpg" width="200px" style="padding-bottom: 10px;"/>
                            <div class="Centered">Eddie Francis</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-3">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Fixtures Secretary
                        </div>
                        <div class="panel-body">
                            <img src="Images/committee/tdm.jpg" width="200" style="padding-bottom: 10px;"/>
                            <div class="Centered">Toby de Mellow</div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Tour Secretary
                        </div>
                        <div class="panel-body">
                            <img src="Images/committee/pitcher.jpg" width="200" style="padding-bottom: 10px;"/>
                            <div class="Centered">Chris Pitcher</div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Social Secretary
                        </div>
                        <div class="panel-body">
                            <img src="Images/committee/bosh.jpg" width="200" style="padding-bottom: 10px;"/>
                            <div class="Centered">Bosh</div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3">
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            Webmaster
                        </div>
                        <div class="panel-body">
                            <img src="Images/committee/graham.jpg" width="200" style="padding-bottom: 10px;"/>
                            <div class="Centered">Graham Pontin</div>
                        </div>
                    </div>
                </div>
            </div>    
            <div class="panel panel-default">
                <div class="panel-heading">Documents, minutes, meetings and such like</div>
                <div class="panel-body">
                    
		            <p align="center">
		                <a href = ./documents/constitutionSEPT2006.pdf>Constitution</a>
		            
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
                                    6th AGM - 3/12/2009<br />
                                    7th AGM - 2010 sometime<br />
                                    8th AGM - 2011 sometime<br />
                                    9th AGM - 2012 sometime<br />
                                    10th AGM - 24/11/2013<br />
                                    <a href="./documents/Review of the 2014 VCC season - FINAL.pptx">11th AGM and 10 year gala dinner - 3/12/2014</a><br />
                                    <a href = "./documents/Review%20of%20the%202015%20VCC%20season.pptx">12th AGM - 14/11/2015</a>
				                </td>
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
		            
                
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
        </form>
        </body>
</html>
