<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Home.aspx.cs" Inherits="Secure_StatsAdmin_Home" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>VCC Online Stats Admin</title>
    <CC:Styles runat=server ID=styles /> 
    <script>
        $(function() {
            $('#fromDate').datetimepicker({
                defaultDate: new Date(new Date().getUTCFullYear(), 3, 1),
                format: 'DD MMMM YYYY'
            });
        });
    </script>
    
</head>
<body>
    <div class=AdminPageHeader>
        <div class=AdminPageLogo>
            <a href="/Default.aspx">
            <img src="/Images/logo.jpg" width="200px" />
            </a>
        </div>
        <div class="AdminPageTitle">
            VCC Account System Admin
        </div>
    </div>
    <div class=AdminPageLeftMenu>
        <!-- MENU HERE -->
        <ul>
            <li>
               <a href=MatchWizard.aspx>Open Match Wizard</a>
            </li>
            <li>
                <a href=Home.aspx?action=editPlayer>Add / Edit Player</a>
            </li>
            <li>
                <a href=Home.aspx?action=editMatch>Add / Edit Match</a>
            </li>
            <li>
                <a href=Home.aspx?action=editVenue>Add / Edit Venue</a>
            </li>
            <li>
                <a href=Home.aspx?action=editOppo>Add / Edit Opposition</a>
            </li>
            <li>
                <a href="../Accounts/AccountAdmin.aspx">Go To Accounts Admin...</a>
            </li>
            
            
        </ul>
        <!-- END MENU -->
    </div>
    <div class=AdminPageBody>
        <form id="form1" runat="server">
            <!-- BODY CONTENT HERE -->
            
            
            <div id=Welcome runat=server>
                Welcome to the VCC Stats Admin System. Please choose from the options on
                the left.
            </div>
            
            <div id=EditPlayer runat=server visible=false>
                Select a player to edit, or fill in the fields to create a new player.<br /><br />
                <asp:DropDownList ID=EditPlayerListPlayers runat=server AutoPostBack="True" 
                    onselectedindexchanged="EditPlayerListPlayers_SelectedIndexChanged"></asp:DropDownList>
                <br /><br />
                First Name : <asp:TextBox ID=EditPlayerFirstName runat=server></asp:TextBox><br />
                Last Name : <asp:TextBox ID=EditPlayerLastName runat=server></asp:TextBox><br />
                Middle Initial(s) : <asp:TextBox ID=EditPlayerInitials runat=server></asp:TextBox><br />
                <br /><br />
                <asp:Button ID=EditPlayerSubmit runat=server Text="Create Player" 
                    onclick="EditPlayerSubmit_Click" />
            </div>
            
            <div id=EditMatch runat=server visible=false>
                Select a match to edit, or fill in the fields to create a new match.<br /><br />
                <asp:DropDownList ID=MatchesDownList runat=server AutoPostBack="True" onselectedindexchanged="MatchesDownList_SelectedIndexChanged" 
                    ></asp:DropDownList>
                <br /><br />
                The Village CC VS <asp:DropDownList ID=OppositionDropDown runat=server></asp:DropDownList><br />
                At: <asp:DropDownList ID=EditMatchVenuesDropDownList runat=server></asp:DropDownList><br />
                Home / Away: <asp:DropDownList ID=HomeAway runat=server></asp:DropDownList><br />
                Match Type: <asp:DropDownList ID=MatchType runat=server></asp:DropDownList><br />
                Date: 
                <div class='input-group date datepicker' id='fromDate'>
                                <asp:TextBox ID=MatchDate runat=server class=form-control></asp:TextBox>
                                <span class="input-group-addon">
                                    <span class="glyphicon glyphicon-calendar"></span>
                                </span>
                            </div>
                
                <br /><br />
                <asp:Button ID=MatchSubmitButton runat=server Text="Create Match" onclick="MatchSubmitButton_Click" 
                     />
            </div>
            
            <div id=EditVenue visible=false runat=server>
               Select a venue to edit, or fill in the fields to create a new venue.<br /><br />
                <asp:DropDownList ID=VenuesDropDownList runat=server AutoPostBack="True" onselectedindexchanged="VenuesDropDownList_SelectedIndexChanged" 
                    ></asp:DropDownList>
                <br /><br />
                Name : <asp:TextBox ID=VenueName runat=server></asp:TextBox><br />
                Google Maps URL : <asp:TextBox ID=VenueMapsUrl runat=server></asp:TextBox><br />
                <br /><br />
                <asp:Button ID=VenueSubmit runat=server Text="Create Venue" onclick="VenueSubmit_Click" 
                     />
            </div>
             <div id=EditOppo visible=false runat=server>
               Select a team to edit, or fill in the field to create a new team.<br /><br />
                <asp:DropDownList ID=OppositonDropDownList runat=server AutoPostBack="True" onselectedindexchanged="OppositonDropDownList_SelectedIndexChanged" 
                    ></asp:DropDownList>
                <br /><br />
                Name : <asp:TextBox ID=OppoName runat=server></asp:TextBox><br />
                <br /><br />
                <asp:Button ID=OppoSubmit runat=server Text="Create Opposition" onclick="OppoSubmit_Click" 
                     />
            </div>
            <div id=Message visible=false runat=server>
            
            </div>
            
            <!-- END BODY CONTENT -->
        </form>
    </div>
    
</body>
</html>
