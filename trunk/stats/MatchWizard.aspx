<%@ Page Language="C#" AutoEventWireup="true" CodeFile="MatchWizard.aspx.cs" Inherits="stats_MatchWizard" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>VCC Online | Stats Portal | Match Wizard</title>
    <CC:Styles runat=server ID=styles />    
    
    <SCRIPT language=javascript>
    $(document).ready(calculate());
    function calculate() {
    var total = 0;
        $( ".score" ).each(
             function( intIndex ){
                    if (this.value !=  '') {
                        total=total+ parseInt(this.value);
                    }  
                }
        );
        
        document.forms[0].total.value = total;

    }

    

    function clearZero(thing) {
		    if (thing.value == '0') {
			    thing.value='';
		    }		

    }

    function submitForm() {
	    document.myForm.submit();
    }

    </script>
</head>
<body>
    <div id="pageContainerSmall" class=WizardContainer>
        <form id="form1" runat="server">
        <div id=header>
            
            <div id=headerLeft>
               VCC Online | Stats Portal<br /><br />
               Match Wizard Version 1.0
            </div>
            <div id=headerCentral>
              <asp:Literal ID=WizardHeading runat=server></asp:Literal>
            </div>
            
            <div id=headerRight class=RightAlign>
                <br /><br />
                Step <asp:Literal ID=StepNumber runat=server></asp:Literal>: 
                <asp:Literal ID=StepTitle runat=server></asp:Literal>
            </div>
        </div>
        <div class="horizontalDivider"></div>
        <div runat=server id=Step1 class=WizardStep visible=false>
            Please choose a match from the following list:    
            <asp:DropDownList ID="MatchesDropDown" runat="server" 
                onselectedindexchanged="MatchesDropDown_SelectedIndexChanged" 
                AutoPostBack="True">
            </asp:DropDownList>
            <br /><br />
            Home Team: <asp:Literal id=HomeTeamCheck runat=server></asp:Literal><br />
            Away Team: <asp:Literal ID=AwayTeamCheck runat=server></asp:Literal><br />
            Date: <asp:Literal id=DateCheck runat=server></asp:Literal><br />
            Venue: <asp:Literal id=VenueCheck runat=server></asp:Literal><br />
            
        </div>
        <div runat=server id=Step2 class=WizardStep visible=false>
            
            <br />
            Match Type:
            <asp:RadioButton ID="OversMatch" runat="server" Checked="True" 
                GroupName="MatchType" Text="Overs" />
&nbsp;
            <asp:RadioButton ID="DeclarationMatch" runat="server" GroupName="MatchType" 
                Text="Declaration" />
&nbsp;&nbsp;&nbsp; Overs:
            <asp:TextBox ID="NumberOfOvers" runat="server" Width="48px">0</asp:TextBox>
            <br />
            <br />
            Match Abandonend?
            <asp:RadioButton ID="AbandonendYes" runat="server" GroupName="Abandoned" 
                Text="Yes" />
&nbsp;
            <asp:RadioButton ID="AbandonedNo" runat="server" Checked="True" 
                GroupName="Abandoned" Text="No" />
            <br />
            <br />
            Venue:
            <asp:DropDownList ID="VenueDropDown" runat="server">
            </asp:DropDownList>
            <br />
            <br />
            Date:
            <asp:TextBox ID="MatchDate" runat="server" ReadOnly="True"></asp:TextBox>
            <br />
            <br />
            Who won the toss?
            <asp:RadioButton ID="TossWinnerUs" runat="server" GroupName="TossWinner" 
                Text="We Did" />
&nbsp;<asp:RadioButton ID="TossWinnerThem" runat="server" GroupName="TossWinner" 
                Text="They Did" />
            <br />
            <br />
            What did they do?
            <asp:RadioButton ID="DescisionBatted" runat="server" GroupName="Descision" 
                Text="Elected to Bat" />
            <asp:RadioButton ID="DescisionBowled" runat="server" GroupName="Descision" 
                Text="Elected to Bowl" />
            <br />
            
        </div>
        <div id=Step3 class=WizardStep runat=server visible=false>
            <table class="stats_input_table"  width="100%">
	<tr>
		<td>Batsman</td>
		<td>&nbsp;</td>
		<td>Fielder</td>
		<td>Bowler</td>
		<td>Score</td>
		<td width="40">4s</td>
		<td width="40">6s</td>
	</tr>
	<asp:ListView ID=OurBattingScoreCardLV runat=server 
                        onitemdatabound="OurBattingScoreCardLV_ItemDataBound">
           <LayoutTemplate>
               <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
           </LayoutTemplate>

           <ItemTemplate>
              <tr>
		            <td width="236"><asp:DropDownList class=small_select name=batsman ID=batsmanSelect runat=server></asp:DropDownList></td>
		            <td width="122"><asp:DropDownList class=small_select name=how_out ID=howOutSelect runat=server></asp:DropDownList></td>
		            <td width="336"><input class=small_input name=fielder id="fielderTB" runat=server></td>
		            <td width="336">b. <input class=small_input name=bowler id=bowlerTB runat=server></td>
		            <td><input class="small_input score short_number" name=score size=10 onfocus="clearZero(this); calculate();" onfocusout="calculate();" value=0 id=scoreTB runat=server></td>
		            <td width="40"><input class="small_input short_number" size =5 name=4s value=0 onfocus="clearZero(this);" id="foursTB" runat=server></td>
		            <td width="40"><input class="small_input short_number" size=5 name=6s value=0 onfocus="clearZero(this);" id="sixesTB" runat=server></td>
	            </tr>
           </ItemTemplate>
           </asp:ListView>
	
	
	<tr>
		<td width="236">(Frank) Extras</td>
		<td width="122"></td>
		<td width="336"></td>
		<td><input class="small_input score short_number" name=extras size=10 onfocus='calculate()' value="<asp:Literal ID=step3Extras runat=server></asp:Literal>" ></td>
		<td width="40"></td>
		<td width="40"></td>
	</tr>
	<tr>
		<td width="236"><B>Total</b></td>
		<td width="122">
            <asp:TextBox ID="OurInningsOvers" runat="server" Width="43px"></asp:TextBox>
&nbsp;overs</td>
		<td width="336">
            <asp:CheckBox ID="OurInningsDeclared" runat="server" Text="Declared?" />
                        </td>
		<td colspan=3><input class=small_input READONLY name=total size=10><input class=small_input type=button name=calc Value='Calculate' onClick='calculate()'></td>
	</tr>
</table>
        </div>
        <div id=Step4 class=WizardStep runat=server>
            <table class="stats_input_table" width="17%">
		<tr>
			<td>Byes</td>
			<td><input runat=server class=small_input id=step4byes size="1" value='0' onfocus="calculateExtras(); clearZero(this);" onfocusout="calculateExtras()" /></td>
		</tr>
		<tr>
			<td>Leg Byes</td>
			<td><input runat=server class=small_input id=step4leg_byes size="1" value='0' onfocus="calculateExtras(); clearZero(this);" onfocusout="calculateExtras()" /></td>
		</tr>
		<tr>
			<td>Wides</td>
			<td><input runat=server class=small_input id=step4wides size="1" value='0' onfocus="calculateExtras(); clearZero(this);" onfocusout="calculateExtras()" /></td>
		</tr>
		<tr>
			<td>No Balls</td>
			<td><input runat=server class=small_input id=step4no_balls size="1" value='0' onfocus="calculateExtras(); clearZero(this);" onfocusout="calculateExtras()" /></td>
		</tr>
		<tr>
			<td>Penalty</td>
			<td><input runat=server class=small_input id=step4penalty size="1" value='0' onfocus="calculateExtras(); clearZero(this);" onfocusout="calculateExtras()" /></td>
		</tr>
				<tr>
			<td>Total</td>
			<td><input READONLY  class=small_input name=total_extras size="1" value="<asp:Literal ID=step4Extras runat=server></asp:Literal>" ></td>
		</tr>

	</table>
        </div>
        <div id=Step5 class=WizardStep runat=server>
            <table class="stats_input_table" width="80%">
                <tr>
	                <td>Bowler</td>
	                <td>Overs</td>
	                <td>Maidens</td>
	                <td>Wickets</td>
	                <td>Runs</td>
                </tr>
                <asp:ListView ID=TheirBowlingListView runat=server 
                        onitemdatabound="TheirBowlingListView_ItemDataBound">
           <LayoutTemplate>
               <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
           </LayoutTemplate>

           <ItemTemplate>
              <tr>
	                <td><input class=small_input name=bowler size="1" id=step5bowler runat=server></td>
	                <td><input class=small_input name=overs size="1" id=step5overs runat=server></td>
	                <td><input class=small_input name=maidens size="1" id=step5maidens runat=server></td>
	                <td><input class=small_input name=wickets size="1" id=step5wickets runat=server></td>
	                <td><input class=small_input name=runs size="1" id=step5runs runat=server></td>
                </tr>
           </ItemTemplate>
           </asp:ListView>
                
            </table>
         </div>
        <div id=Step6 class=WizardStep runat=server visible=false>
        
        <table class="stats_input_table" width="100%">
		<tr>
			<td>Fall of Wkt</td>
			<td align="center">1</td>
			<td align="center">2</td>
			<td align="center">3</td>
			<td align="center">4</td>
			<td align="center">5</td>
			<td align="center">6</td>
			<td align="center">7</td>
			<td align="center">8</td>
			<td align="center">9</td>
			<td align="center">10</td>
		</tr>
		<tr>
			<td>Score</td>
			<td><input name="fow_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowScore1 runat=server></asp:Literal>" ></td>
			<td><input name="fow_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowScore2 runat=server></asp:Literal>" ></td>
			<td><input name="fow_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowScore3 runat=server></asp:Literal>" ></td>
			<td><input name="fow_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowScore4 runat=server></asp:Literal>" ></td>
			<td><input name="fow_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowScore5 runat=server></asp:Literal>" ></td>
			<td><input name="fow_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowScore6 runat=server></asp:Literal>" ></td>
			<td><input name="fow_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowScore7 runat=server></asp:Literal>" ></td>
			<td><input name="fow_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowScore8 runat=server></asp:Literal>" ></td>
			<td><input name="fow_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowScore9 runat=server></asp:Literal>" ></td>
			<td><input name="fow_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowScore10 runat=server></asp:Literal>" ></td>
		</tr>
		<tr>
			<td>Outgoing Bat & Score</td>
			<td>
			    <input name="fow_outgoingbat" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBat1 runat=server></asp:Literal>" >
			    /
			    <input name="fow_outgoingbat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBatScore1 runat=server></asp:Literal>" >
			</td>
			<td>
			    <input name="fow_outgoingbat" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBat2 runat=server></asp:Literal>" >
			    /
			    <input name="fow_outgoingbat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBatScore2 runat=server></asp:Literal>" >
			</td><td>
			    <input name="fow_outgoingbat" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBat3 runat=server></asp:Literal>" >
			    /
			    <input name="fow_outgoingbat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBatScore3 runat=server></asp:Literal>" >
			</td><td>
			    <input name="fow_outgoingbat" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBat4 runat=server></asp:Literal>" >
			    /
			    <input name="fow_outgoingbat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBatScore4 runat=server></asp:Literal>" >
			</td><td>
			    <input name="fow_outgoingbat" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBat5 runat=server></asp:Literal>" >
			    /
			    <input name="fow_outgoingbat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBatScore5 runat=server></asp:Literal>" >
			</td><td>
			    <input name="fow_outgoingbat" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBat6 runat=server></asp:Literal>" >
			    /
			    <input name="fow_outgoingbat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBatScore6 runat=server></asp:Literal>" >
			</td><td>
			    <input name="fow_outgoingbat" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBat7 runat=server></asp:Literal>" >
			    /
			    <input name="fow_outgoingbat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBatScore7 runat=server></asp:Literal>" >
			</td><td>
			    <input name="fow_outgoingbat" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBat8 runat=server></asp:Literal>" >
			    /
			    <input name="fow_outgoingbat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBatScore8 runat=server></asp:Literal>" >
			</td><td>
			    <input name="fow_outgoingbat" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBat9 runat=server></asp:Literal>" >
			    /
			    <input name="fow_outgoingbat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBatScore9 runat=server></asp:Literal>" >
			</td><td>
			    <input name="fow_outgoingbat" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBat10 runat=server></asp:Literal>" >
			    /
			    <input name="fow_outgoingbat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowOutgoingBatScore10 runat=server></asp:Literal>" >
			</td>
		</tr>
		<tr>
			<td>No Bat & Score</td>
			<td>
			    <input name="fow_nobat" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBat1 runat=server></asp:Literal>" >
			    /
			    <input name="fow_nobat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBatScore1 runat=server></asp:Literal>" >
			</td>
			<td>
			    <input name="fow_nobat" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBat2 runat=server></asp:Literal>" >
			    /
			    <input name="fow_nobat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBatScore2 runat=server></asp:Literal>" >
			</td>
			<td>
			    <input name="fow_nobat" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBat3 runat=server></asp:Literal>" >
			    /
			    <input name="fow_nobat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBatScore3 runat=server></asp:Literal>" >
			</td>
			<td>
			    <input name="fow_nobat" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBat4 runat=server></asp:Literal>" >
			    /
			    <input name="fow_nobat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBatScore4 runat=server></asp:Literal>" >
			</td>
			<td>
			    <input name="fow_nobat" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBat5 runat=server></asp:Literal>" >
			    /
			    <input name="fow_nobat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBatScore5 runat=server></asp:Literal>" >
			</td>
			<td>
			    <input name="fow_nobat" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBat6 runat=server></asp:Literal>" >
			    /
			    <input name="fow_nobat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBatScore6 runat=server></asp:Literal>" >
			</td>
			<td>
			    <input name="fow_nobat" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBat7 runat=server></asp:Literal>" >
			    /
			    <input name="fow_nobat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBatScore7 runat=server></asp:Literal>" >
			</td>
			<td>
			    <input name="fow_nobat" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBat8 runat=server></asp:Literal>" >
			    /
			    <input name="fow_nobat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBatScore8 runat=server></asp:Literal>" >
			</td>
			<td>
			    <input name="fow_nobat" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBat9 runat=server></asp:Literal>" >
			    /
			    <input name="fow_nobat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBatScore9 runat=server></asp:Literal>" >
			</td>
			<td>
			    <input name="fow_nobat" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBat10 runat=server></asp:Literal>" >
			    /
			    <input name="fow_nobat_score" size=1 class="small_input short_number" value="<asp:Literal ID=fowNoBatScore10 runat=server></asp:Literal>" >
			</td>
			
			
		</tr>
		<tr>
			<td>Partnership</td>
			<td><input RAEDONLY name="fow_partnership" size=1 class="small_input short_number" value="<asp:Literal ID=fowPartnership1 runat=server></asp:Literal>" ></td>
			<td><input RAEDONLY name="fow_partnership" size=1 class="small_input short_number" value="<asp:Literal ID=fowPartnership2 runat=server></asp:Literal>" ></td>
			<td><input RAEDONLY name="fow_partnership" size=1 class="small_input short_number" value="<asp:Literal ID=fowPartnership3 runat=server></asp:Literal>" ></td>
			<td><input RAEDONLY name="fow_partnership" size=1 class="small_input short_number" value="<asp:Literal ID=fowPartnership4 runat=server></asp:Literal>" ></td>
			<td><input RAEDONLY name="fow_partnership" size=1 class="small_input short_number" value="<asp:Literal ID=fowPartnership5 runat=server></asp:Literal>" ></td>
			<td><input RAEDONLY name="fow_partnership" size=1 class="small_input short_number" value="<asp:Literal ID=fowPartnership6 runat=server></asp:Literal>" ></td>
			<td><input RAEDONLY name="fow_partnership" size=1 class="small_input short_number" value="<asp:Literal ID=fowPartnership7 runat=server></asp:Literal>" ></td>
			<td><input RAEDONLY name="fow_partnership" size=1 class="small_input short_number" value="<asp:Literal ID=fowPartnership8 runat=server></asp:Literal>" ></td>
			<td><input RAEDONLY name="fow_partnership" size=1 class="small_input short_number" value="<asp:Literal ID=fowPartnership9 runat=server></asp:Literal>" ></td>
			<td><input RAEDONLY name="fow_partnership" size=1 class="small_input short_number" value="<asp:Literal ID=fowPartnership10 runat=server></asp:Literal>" ></td>
			
		</tr>
		<tr>
			<td>Over No.</td>
			<td><input name="fow_over" size=1 class="small_input short_number" value="<asp:Literal ID=fowOver1 runat=server></asp:Literal>" ></td>
			<td><input name="fow_over" size=1 class="small_input short_number" value="<asp:Literal ID=fowOver2 runat=server></asp:Literal>" ></td>
			<td><input name="fow_over" size=1 class="small_input short_number" value="<asp:Literal ID=fowOver3 runat=server></asp:Literal>" ></td>
			<td><input name="fow_over" size=1 class="small_input short_number" value="<asp:Literal ID=fowOver4 runat=server></asp:Literal>" ></td>
			<td><input name="fow_over" size=1 class="small_input short_number" value="<asp:Literal ID=fowOver5 runat=server></asp:Literal>" ></td>
			<td><input name="fow_over" size=1 class="small_input short_number" value="<asp:Literal ID=fowOver6 runat=server></asp:Literal>" ></td>
			<td><input name="fow_over" size=1 class="small_input short_number" value="<asp:Literal ID=fowOver7 runat=server></asp:Literal>" ></td>
			<td><input name="fow_over" size=1 class="small_input short_number" value="<asp:Literal ID=fowOver8 runat=server></asp:Literal>" ></td>
			<td><input name="fow_over" size=1 class="small_input short_number" value="<asp:Literal ID=fowOver9 runat=server></asp:Literal>" ></td>
			<td><input name="fow_over" size=1 class="small_input short_number" value="<asp:Literal ID=fowOver10 runat=server></asp:Literal>" ></td>
			
		</tr>
	</table>
        
        </div>
        <div id=Step7 class=WizardStep runat=server visible=false>
            <table class="stats_input_table"  width="100%">
	            <tr>
		            <td>Batsman</td>
		            <td>&nbsp;</td>
		            <td>Fielder</td>
		            <td>Bowler</td>
		            <td>Score</td>
		            <td width="40">4s</td>
		            <td width="40">6s</td>
	            </tr>
	        <asp:ListView ID=TheirBattingScoreCardLV runat=server 
                        onitemdatabound="TheirBattingScoreCardLV_ItemDataBound">
           <LayoutTemplate>
               <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
           </LayoutTemplate>

           <ItemTemplate>
              <tr>
		            <td width="236"><input class=small_select name=batsman ID=batsmanTB runat=server /></td>
		            <td width="122"><asp:DropDownList class=small_select name=how_out ID=howOutSelect runat=server></asp:DropDownList></td>
		            <td width="336"><asp:DropDownList class=small_select name=fielder ID=fielderSelect runat=server></asp:DropDownList></td>
		            <td width="336">b. <asp:DropDownList class=small_select name=bowler ID=bowlerSelect runat=server></asp:DropDownList></td>
		            <td><input class="small_input score short_number" name=score size=10 onfocus="clearZero(this); calculate();" onfocusout="calculate();" value=0 id=scoreTB runat=server></td>
		            <td width="40"><input class="small_input short_number" size =5 name=4s value=0 onfocus="clearZero(this);" id="foursTB" runat=server></td>
		            <td width="40"><input class="small_input short_number" size=5 name=6s value=0 onfocus="clearZero(this);" id="sixesTB" runat=server></td>
	            </tr>
           </ItemTemplate>
           </asp:ListView>
	
	
	            <tr>
		            <td width="236">(Frank) Extras</td>
		            <td width="122"></td>
		            <td width="336"></td>
		            <td><input class="small_input score" name=extras size=10 onfocus='calculate()' value="<asp:Literal ID=step7Extras runat=server></asp:Literal>" ></td>
		            <td width="40"></td>
		            <td width="40"></td>
	            </tr>
	            <tr>
		            <td width="236"><B>Total</b></td>
		            <td width="122">
                        <asp:TextBox ID="TheirInningsOvers" runat="server" Width="38px"></asp:TextBox>
&nbsp;overs</td>
		            <td width="336">
                        <asp:CheckBox ID="TheirInningsDeclared" runat="server" Text="Declared?" />
                    </td>
		            <td colspan=3><input class=small_input READONLY name=total size=10><input class=small_input type=button name=calc Value='Calculate' onClick='calculate()'></td>
	            </tr>
            </table>
        </div>
        <div id=Step9 class=WizardStep runat=server visible=false>
            <table class="stats_input_table" width="80%">
                <tr>
	                <td>Bowler</td>
	                <td>Overs</td>
	                <td>Maidens</td>
	                <td>Wickets</td>
	                <td>Runs</td>
                </tr>
                <asp:ListView ID=OurBowlingListView runat=server 
                        onitemdatabound="OurBowlingListView_ItemDataBound">
           <LayoutTemplate>
               <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
           </LayoutTemplate>

           <ItemTemplate>
              <tr>
	                <td><asp:DropDownList class=small_input name=bowler size="1" id=bowler runat=server /></td>
	                <td><input class=small_input name=overs size="1" id=overs runat=server></td>
	                <td><input class=small_input name=maidens size="1" id=maidens runat=server></td>
	                <td><input class=small_input name=wickets size="1" id=wickets runat=server></td>
	                <td><input class=small_input name=runs size="1" id=runs runat=server></td>
                </tr>
           </ItemTemplate>
           </asp:ListView>
                
            </table>
        </div>
        <div id=Step11 class=WizardStep runat=server visible=false>
            
            Who kept wicket in the match?
            <asp:DropDownList ID="WicketKeeper" runat="server">
            </asp:DropDownList>
            <br />
            <br />
            Who captainen this match?
            <asp:DropDownList ID="Captain" runat="server">
            </asp:DropDownList>
            <br />
            <br />
            Please choose a password for the match report:
            <asp:TextBox ID="MatchReportPassword" runat="server" Width="229px"></asp:TextBox>
            <br />
            <br />
            Please enter the match report writer&#39;s email address:
            <asp:TextBox ID="WritersEmail" runat="server" Width="308px"></asp:TextBox>
            
        </div>
        <div id=Step12 class=WizardStep runat=server visible=false>
            <br /><br />
            Match data is now up to date and your email has been sent. You can close this now.
        </div>
        <div class="WizardStep ErrorMessage" id=ErrorMessage runat=server visible=false>
            
        </div>
        
        <div class=Centered id=ButtonDiv runat=server>
            <input type=submit name="Continue" value="Step <asp:Literal ID=NextStep runat=server></asp:Literal> >" />
        </div>
        </form>
    </div>
</body>
</html>
