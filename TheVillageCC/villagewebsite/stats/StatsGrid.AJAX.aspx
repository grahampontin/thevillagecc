﻿<%@ Page Language="C#" AutoEventWireup="true" CodeFile="StatsGrid.AJAX.aspx.cs" Inherits="Stats_StatsGrid" EnableViewState="false" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server" enableviewstate=false>
    <div>
        <asp:GridView ID=playersGV runat=server AutoGenerateColumns="False" 
                onrowdatabound="playersGV_RowDataBound" EnableViewState=false>
                <Columns>
                    <asp:BoundField HeaderText="No." >
                        <HeaderStyle HorizontalAlign="Left" />
                    </asp:BoundField>
                    <asp:BoundField DataField="Name" HeaderText="Name" ReadOnly="True" 
                        SortExpression="Name" />
                    <asp:BoundField HeaderText="Bats" />
                    <asp:BoundField HeaderText="Mat" />
                    <asp:BoundField HeaderText="Inns" />
                    <asp:BoundField HeaderText="NO" />
                    <asp:BoundField HeaderText="Ovs" />
                    <asp:BoundField HeaderText="Runs" />
                    <asp:BoundField HeaderText="Wkts" />
                    <asp:BoundField HeaderText="HS" />
                    <asp:BoundField HeaderText="BBM" />
                    <asp:BoundField HeaderText="Ave" />
                    <asp:BoundField HeaderText="100s" />
                    <asp:BoundField HeaderText="50s" />
                    <asp:BoundField HeaderText="4s" />
                    <asp:BoundField HeaderText="6s" />
                    <asp:BoundField HeaderText="Ct" />
                    <asp:BoundField HeaderText="St" />
                    <asp:BoundField HeaderText="RO" />
                    <asp:BoundField HeaderText="Econ" />
                    <asp:BoundField HeaderText="SR" />
                    <asp:BoundField HeaderText="3fers" />
                    <asp:BoundField HeaderText="5fers" />
                </Columns>
                <EmptyDataTemplate>
                    No data in the database matches your filters.
                </EmptyDataTemplate>
            </asp:GridView>

            <asp:GridView ID=TeamsGridView runat=server AutoGenerateColumns="False" 
            EnableModelValidation="True" onrowdatabound="TeamsGridView_RowDataBound">
                <Columns>
                    <asp:BoundField HeaderText="Team Name" />
                    <asp:BoundField HeaderText="Matches" />
                    <asp:BoundField HeaderText="Wins" />
                    <asp:BoundField HeaderText="Losses" />
                    <asp:BoundField HeaderText="Draws" />
                    <asp:BoundField HeaderText="Ave Batting Score" />
                    <asp:BoundField HeaderText="Ave Score Conceeded" />
                    <asp:BoundField HeaderText="Wickets Taken" />
                    <asp:BoundField HeaderText="Wickets Lost" />
                    <asp:BoundField HeaderText="LBWs Given" />
                    <asp:BoundField HeaderText="LBWs Conceeded" />
                </Columns>
                
            </asp:GridView>


            <asp:GridView ID=VenuesGridView runat=server AutoGenerateColumns="False" 
            EnableModelValidation="True" onrowdatabound="VenuesGridView_RowDataBound">
                <Columns>
                    <asp:BoundField HeaderText="Venue" />
                    <asp:BoundField HeaderText="Matches Played" />
                    <asp:BoundField HeaderText="Village Wins" />
                    <asp:BoundField HeaderText="Village Losses" />
                    <asp:BoundField HeaderText="Ave Village Score" />
                    <asp:BoundField HeaderText="Ave Oppo Score" />
                    <asp:BoundField HeaderText="Percent Toss Winner Bats" />
                    <asp:BoundField HeaderText="Percent Team Batting First Wins" />
                    <asp:BoundField HeaderText="Ave Wickets Taken By Village" />
                    <asp:BoundField HeaderText="Ave Wickets Taken By Oppo" />
                    <asp:BoundField HeaderText="Ave LBWs per Innings" />
                    <asp:BoundField HeaderText="Ave Catches per Innings" />
                    <asp:BoundField HeaderText="Ave Bowleds per Innings" />
                </Columns>
        </asp:GridView>

        <asp:GridView ID=CaptainsGridView runat=server AutoGenerateColumns="False" 
            EnableModelValidation="True" onrowdatabound="CaptainsGridView_RowDataBound">
            <Columns>
                <asp:BoundField HeaderText="Name" />
                <asp:BoundField HeaderText="Matches in charge" />
                <asp:BoundField HeaderText="Wins" />
                <asp:BoundField HeaderText="Losses" />
                <asp:BoundField HeaderText="% Won" />
                <asp:BoundField HeaderText="% Tosses won" />
                <asp:BoundField HeaderText="% Chose to Bat" />
                <asp:BoundField HeaderText="Batting ave as Captain" />
                <asp:BoundField HeaderText="Batting ave not as Capt" />
            </Columns>
        </asp:GridView>

        <asp:GridView ID=KeepersGridView runat=server AutoGenerateColumns="False" 
            EnableModelValidation="True" onrowdatabound="KeepersGridView_RowDataBound">
            <Columns>
                <asp:BoundField HeaderText="Name" />
                <asp:BoundField HeaderText="Matches" />
                <asp:BoundField HeaderText="Catches Per Game" />
                <asp:BoundField HeaderText="Stumpings Per Game" />
                <asp:BoundField HeaderText="Byes Conceeded Per Game" />
                <asp:BoundField HeaderText="Batting Average with Gloves" />
                <asp:BoundField HeaderText="Batting Average Witout Gloves" />
            </Columns>
        </asp:GridView> 
        
        <asp:GridView ID=MatchesGridView runat=server AutoGenerateColumns="False" 
            EnableModelValidation="True" onrowdatabound="MatchesGridView_RowDataBound">
            <Columns>
                <asp:BoundField HeaderText="Match" />
                <asp:BoundField HeaderText="Village Runs" />
                <asp:BoundField HeaderText="Opposition Runs" />
                <asp:BoundField HeaderText="Margin of Victory (defeat)" />
                <asp:BoundField HeaderText="No. of Catches (all)" />
                <asp:BoundField HeaderText="No. of Catches (vcc)" />
                <asp:BoundField HeaderText="No. of LBWs (all)" />
                <asp:BoundField HeaderText="No. of LBWs (vcc)" />
                <asp:BoundField HeaderText="No. of Bowleds (all)" />
                <asp:BoundField HeaderText="No. of Bowleds (vcc)" />
                <asp:BoundField HeaderText="No. of Stumpings (all)" />
                <asp:BoundField HeaderText="No. of Stumpings (vcc)" />
                <asp:BoundField HeaderText="No. of Runouts (all)" />
                <asp:BoundField HeaderText="No. of Runouts (vcc)" />
                <asp:BoundField HeaderText="Extras Conceeded (vcc)" />
                <asp:BoundField HeaderText="Extras Conceeded (oppo)" />
            </Columns>
        </asp:GridView>

    </div>
    </form>
</body>
</html>
