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
    <CC:Styles runat=server ID=styles /> 
       
    
   <script type="text/javascript">
       var baseURL = 'stats/StatsGrid.Ajax.aspx?Tab=';


       function getFilter() {
           var filterText = '&fromDate=' + $("#fromDate input").val().replace(' ', '%20').replace(' ', '%20');
           filterText += '&toDate=' + $("#toDate input").val().replace(' ', '%20').replace(' ', '%20');
           if ($('#friendlyCB').prop('checked')) {
               filterText += '&Friendly=1';
           }
           if ($('#tourCB').prop('checked')) {
               filterText += '&Tour=1';
           }
           if ($('#declarationCB').prop('checked')) {
               filterText += '&Declaration=1';
           }
           if ($('#leagueCB').prop('checked')) {
               filterText += '&League=1';
           }
           if ($('#twenty20CB').prop('checked')) {
               filterText += '&Twenty20=1';
           }
           filterText += '&Venue=' + replaceAll($("#VenuesDropDown option:selected").text(),' ', '%20');

           return filterText;
       }

       function replaceAll(str, find, replace) {
           return str.replace(new RegExp(find, 'g'), replace);
       }

       function sortTable() {
           applyTableSorter($("#TeamsGridView"), 0, 0);
           applyTableSorter($("#VenuesGridView") ,0, 0);
           applyTableSorter($("#CaptainsGridView"), 0, 0);
           applyTableSorter($("#KeepersGridView"), 0, 0);
           applyTableSorter($("#MatchesGridView"), 0, 0);
           applyTableSorter($("#playersGV"), 5, 1);
       }

       function applyTableSorter(table, sortColumn, sortOrder) {
           table.tablesorter({
               sortList: [[sortColumn, sortOrder]],
               theme: 'bootstrap',
               widthFixed: true,
               headerTemplate: '{content} {icon}',
               widgets: ["uitheme", "zebra"],
           });
       } 

       $(function () {
            $('#fromDate').datetimepicker({
                defaultDate: new Date(new Date().getUTCFullYear(), 3, 1),
                format: 'DD MMMM YYYY'
            });
            $('#toDate').datetimepicker({
                defaultDate: new Date(new Date().getUTCFullYear()+1, 3, 1),
                format: 'DD MMMM YYYY'
            });
            $('#tabs').tab();
            //load content for first tab and initialize
            loadTab($('#Batting'));

            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var pattern = /#.+/gi //use regex to get anchor(==selector)
                var contentID = e.target.toString().match(pattern)[0]; //get anchor         
                loadTab($(contentID));
            });
            $('#filterButton').click(function () {
                var activeTab = $('.tab-pane.active');
                loadTab(activeTab);

            });
        });

       function loadTab(tab) {
           $('#filterButton').button('loading');
           $('.tab-pane').each(function(index, value) {
               $(this).html('');
           });
           tab.html('<div class="table-bordered" style="padding: 50px;"><div class="progress" ><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><span class="sr-only">Loading</span></div></div></div>');
           //load content for selected tab
           tab.load(baseURL + tab.prop('id').replace('#','') + getFilter(), function () {
               $('#tabs').tab(); //reinitialize tabs
               sortTable();
               $('#filterButton').button('reset');

           });

       }
        
    </script>
 
</head>
<body>
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
            <form runat=server id=StatsForm class="form-horizontal">
            <H1>Club Statistics<small> for the cricket geek in all of us</small></H1>
            <div class="panel panel-default">
                <div class="panel-heading">
                    Filter Statistics
                </div>
                 <div class="panel-body">
                    <div class="form-group">
                        <label class="col-xs-3 control-label">Match type:</label>
                        <div class="col-xs-6">
                            <div class="input-group">
                                <label class="checkbox-inline"><input type="checkbox" id="leagueCB" checked="checked"/>League</label>
                                <label class="checkbox-inline"><input type="checkbox" id="friendlyCB" checked="checked"/>Friendly</label>
                                <label class="checkbox-inline"><input type="checkbox" id="tourCB" checked="checked"/>Tour</label>
                                <label class="checkbox-inline"><input type="checkbox" id="declarationCB" checked="checked"/>Declaration</label>
                                <label class="checkbox-inline"><input type="checkbox" id="twenty20CB" checked="checked"/>Twenty20</label>
                            </div>
                         </div>
                    </div>
                    <div class="form-group">
                         <label class="col-xs-3 control-label">Start date:</label>
                         <div class="col-xs-5">
                             <div class='input-group date datepicker' id='fromDate'>
                                <input type='text' class="form-control" />
                                <span class="input-group-addon">
                                    <span class="glyphicon glyphicon-calendar"></span>
                                </span>
                            </div>
                        </div>
                    </div>
                     <div class="form-group">
                         <label class="col-xs-3 control-label">End date:</label> 
                         <div class="col-xs-5">
                            <div class='input-group date datepicker' id='toDate'>
                                <input type='text' class="form-control" />
                                <span class="input-group-addon">
                                    <span class="glyphicon glyphicon-calendar"></span>
                                </span>
                            </div>    
                         </div>
                             
                     </div>                 
                     <div class="form-group">
                         <label class="col-xs-3 control-label">At:</label> 
                         <div class="col-xs-5">
                            <asp:DropDownList ID="VenuesDropDown" runat="server" class="form-control"></asp:DropDownList>    
                         </div>
                     </div>                 
                     <div class="Centered">
                        <button id="filterButton"  type="button" data-loading-text="Crunching the numbers..." class="btn btn-primary" autocomplete="off">Apply filter</button>                         
                     </div>
                </div>
            </div>
                    <ul id="tabs" class="nav nav-tabs">
		                <li class="active"><a href="#Batting" role="tab" data-toggle="tab">Batsmen</a></li>
		                <li><a href="#Bowling" role="tab" data-toggle="tab">Bowling</a></li>
		                <li><a href="#Teams" role="tab" data-toggle="tab">Teams</a></li>
		                <li><a href="#Venues" role="tab" data-toggle="tab">Venues</a></li>
		                <li><a href="#Captains" role="tab" data-toggle="tab">Captains</a></li>
		                <li><a href="#Keepers" role="tab" data-toggle="tab">Keepers</a></li>
		                <li><a href="#Matches" role="tab" data-toggle="tab">Matches</a></li>
		            </ul>
                    
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="Batting"></div>
                        <div role="tabpanel" class="tab-pane" id="Bowling"></div>
                        <div role="tabpanel" class="tab-pane" id="Teams"></div>
                        <div role="tabpanel" class="tab-pane" id="Venues"></div>
                        <div role="tabpanel" class="tab-pane" id="Captains"></div>
                        <div role="tabpanel" class="tab-pane" id="Keepers"></div>
                        <div role="tabpanel" class="tab-pane" id="Matches"></div>
                    </div>

            </form>
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>

