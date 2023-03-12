<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Stats.aspx.cs" Inherits="Stats" EnableViewStateMac="false" ViewStateEncryptionMode="Never" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html>

<html lang="en">
<head runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>The Village Cricket Club Online | Stats</title>
    <CC:Styles runat=server ID=styles></CC:Styles>

    <script src="Resources/jQuery/jquery-3.6.0.min.js"></script>
    <script src="https://unpkg.com/ag-grid-community/dist/ag-grid-community.min.js"></script>
    <script src="Script/agGrid/linkToPlayerStatsRenderer.js"></script>
    <script src="Script/stats.js"></script>
    <script type="text/javascript">
       
    </script>

</head>
<body>
<div class="">
    <!-- Head -->
    <CC:Header ID="Header1" runat=server></CC:Header>
    <!-- End Head -->
    <main class="container">
        <form runat=server id=StatsForm class="form-horizontal">
            <H1>Club Statistics</H1>

            <div class="accordion" id="accordionExample">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Filter Statistics
                        </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div class="accordion-body">

                            <div class="d-flex flex-wrap">
                                <div class="form-group  flex-grow-1 me-2 mt-2">
                                    <div class='input-group'>
                                        <span class="input-group-text">Start date:</span>
                                        <input type='date' class="form-control" id='fromDate' value="2000-01-01"/>
                                    </div>
                                </div>
                                <div class="form-group flex-grow-1 me-2 mt-2">
                                    <div class='input-group'>
                                        <span class="input-group-text">End date:</span>
                                        <input type='date' class="form-control" id='toDate' value="2100-01-01"/>
                                    </div>
                                </div>
                                <div class="form-group flex-grow-1 me-2 mt-2">
                                    <div class="input-group">
                                        <span class="input-group-text">At:</span>
                                        <asp:DropDownList ID="VenuesDropDown" runat="server" class="form-select"></asp:DropDownList>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-fill me-2">
                                <div class="input-group mt-2">
                                    <div class="form-check form-switch form-check-inline">
                                        <input class="form-check-input" type="checkbox" id="leagueCB" checked="checked" matchType="League"/>
                                        <label class="form-check-label" for="leagueCB">League</label>
                                    </div>
                                    <div class="form-check form-switch form-check-inline">
                                        <input class="form-check-input" type="checkbox" id="friendlyCB" checked="checked" matchType="Friendly"/>
                                        <label class="form-check-label" for="friendlyCB">Friendly</label>
                                    </div>
                                    <div class="form-check form-switch form-check-inline">
                                        <input class="form-check-input" type="checkbox" id="tourCB" checked="checked" matchType="Tour"/>
                                        <label class="form-check-label" for="tourCB">Tour</label>
                                    </div>
                                    <div class="form-check form-switch form-check-inline">
                                        <input class="form-check-input" type="checkbox" id="declarationCB" checked="checked" matchType="Declaration"/>
                                        <label class="form-check-label" for="declarationCB">Declaration</label>
                                    </div>
                                    <div class="form-check form-switch form-check-inline">
                                        <input class="form-check-input" type="checkbox" id="twenty20CB" checked="checked" matchType="T20"/>
                                        <label class="form-check-label" for="twenty20CB">Twenty20</label>
                                    </div>
                                </div>
                                <div class="mt-2 d-flex justify-content-end flex-column">
                                    <button id="filterButton" type="button" data-loading-text="Crunching the numbers..." class="btn btn-primary" autocomplete="off">
                                        <span class="text-nowrap">Apply filter</span>
                                    </button>
                                    <button id="loadingButton" class="btn btn-primary" type="button" style="display: none" disabled>
                                        <span class="text-nowrap">
                                            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Loading...
                                        </span>
                                    </button>
                                </div>

                            </div>


                        </div>

                    </div>
                </div>


            </div>
            <div id="tabFlexContainer">
                <nav id="tabs" class="nav  nav-pills nav-justified  p-2 mt-2 underline-nav-2" role="tablist">
                    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#Batting" type="button" role="tab" data-toggle="tab">Batting</button>
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#Bowling" type="button" role="tab" data-toggle="tab">Bowling</button>
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#Teams" type="button" role="tab" data-toggle="tab">Teams</button>
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#Venues" type="button" role="tab" data-toggle="tab">Venues</button>
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#Captains" type="button" role="tab" data-toggle="tab">Captains</button>
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#Keepers" type="button" role="tab" data-toggle="tab">Keepers</button>
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#Matches" type="button" role="tab" data-toggle="tab">Matches</button>
                </nav>
                <div class="tab-content">
                    <div role="tabpanel" class="tab-pane active" id="Batting">
                        <div id="battingGrid" class="ag-theme-balham stats-grid"></div>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="Bowling">
                        <div id="bowlingGrid" class="ag-theme-balham stats-grid"></div>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="Teams">
                        <div id="teamsGrid" class="ag-theme-balham stats-grid"></div>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="Venues">
                        <div id="venuesGrid" class="ag-theme-balham stats-grid"></div>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="Captains">
                        <div id="captainsGrid" class="ag-theme-balham stats-grid"></div>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="Keepers">
                        <div id="keepersGrid" class="ag-theme-balham stats-grid"></div>
                    </div>
                    <div role="tabpanel" class="tab-pane" id="Matches">
                        <div id="matchesGrid" class="ag-theme-balham stats-grid"></div>
                    </div>
                </div>
            </div>


        </form>
        <div id="errorModal" class="modal" tabindex="-1">
            <div class="modal-dialog modal-fullscreen-md-down">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Error!</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Modal body text goes here.</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>
<!-- Footer -->
<CC:Footer ID="Footer1" runat="server"/>
<!-- ENd Footer -->
</body>
</html>