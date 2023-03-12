<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Results.aspx.cs" Inherits="Results" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <title>The Village Cricket Club Online | Results</title>
    <CC:Styles runat=server ID=styles />

</head>
<body>
<div class="">
    <!-- Head -->
    <CC:Header ID="Header1" runat=server />
    <!-- End Head -->
    <main class="container">
        <h1>
            <a class="btn" role="button" href=Results.aspx?season=<asp:Literal runat=server ID=PrevResultsYear>
                </asp:Literal>>
                <span class="material-icons  font-36px">
                    arrow_back_ios
                </span>
            </a>Results <asp:Literal runat=server ID=ResultsYear></asp:Literal>
            <a class="btn" role="button" href=Results.aspx?season=<asp:Literal runat=server ID=NextResultsYear>
                </asp:Literal>>
                <span class="material-icons font-36px ">
                    arrow_forward_ios
                </span>
            </a>
        </h1>
        <div class="row">
            <div class="col-sm-6">

            </div>
            <div class="col-sm-6">
                <div class="float-end">

                </div>
            </div>
        </div>

        <form id="form1" runat="server">
            <asp:ListView ID="FixturesListView" runat="server"
                          onitemdatabound="FixturesListView_ItemDataBound">
                <LayoutTemplate>
                    <div id=resultsTable class="list-group list-group-flush">

                        <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>

                    </div>
                </LayoutTemplate>

                <ItemTemplate>
                    <a href=LiveScorecard.aspx?matchId=<%#Eval("ID") %> class="list-group-item list-group-item-action" aria-current="true">
                        <div class="d-flex w-100 justify-content-between">
                            <div class="d-block">
                                <div class="mb-1">
                                    <small><%#Eval("MatchDateString") %></small>
                                </div>
                                <div class="w-75">
                                    <h5 class="mb-1 d-flex flex-row flex-wrap flex-lg-nowrap">
                                        <div class="text-nowrap pe-1" id=HomeTeam runat=server>
                                            <%#Eval("HomeTeamName") %>
                                        </div>
                                        <div class="text-nowrap pe-1">
                                            (<%#Eval("HomeTeamScore") %>)
                                        </div>
                                        <div class="text-nowrap pe-1">
                                            <%#Eval("ResultText") %>
                                        </div>
                                        <div class="text-nowrap pe-1" id=AwayTeam runat=server>
                                            <%#Eval("AwayTeamName") %>
                                        </div>
                                        <div class="text-nowrap pe-1">
                                            (<%#Eval("AwayTeamScore") %>)
                                        </div>
                                    </h5>
                                </div>
                                <p class="mb-1  fst-italic"><%#Eval("ResultMargin") %> at <%#Eval("VenueName") %></p>
                            </div>
                            <div class="my-auto">
                                <span class="material-icons">
                                    arrow_forward_ios
                                </span>
                            </div>
                        </div>
                    </a>
                    <%-- <li class="list-group-item"> --%>
                    <%--     <td><%#Eval("MatchDateString") %></td> --%>
                    <%--     <td id=HomeTeam runat=server><%#Eval("HomeTeamName") %> (<%#Eval("HomeTeamScore") %>)</td> --%>
                    <%--     <td align=center> --%>
                    <%--         <a href=MatchReport.aspx?MatchID=<%#Eval("ID") %>><%#Eval("ResultText") %></a> --%>
                    <%--     </td> --%>
                    <%--     <td id=AwayTeam runat=server> <%#Eval("AwayTeamName") %> (<%#Eval("AwayTeamScore") %>)</td> --%>
                    <%--     <td><%#Eval("ResultMargin") %></td> --%>
                    <%--     <td>at</td> --%>
                    <%--     <td><%#Eval("VenueName") %></td> --%>
                    <%--     <td align=center>(<%#Eval("Type") %>)</td> --%>
                    <%-- </li> --%>
                </ItemTemplate>
            </asp:ListView>
        </form>
    </main>
    <!-- Footer -->
    <CC:Footer ID="Footer1" runat="server"/>
    <!-- ENd Footer -->
</div>
</body>
</html>