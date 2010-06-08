<%@ Page Language="C#" AutoEventWireup="true" CodeFile="StatsGrid.AJAX.aspx.cs" Inherits="Stats_StatsGrid" EnableViewState="false" %>

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
            </asp:GridView>
    </div>
    </form>
</body>
</html>
