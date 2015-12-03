<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Stats.aspx.cs" Inherits="Stats" EnableViewStateMac="false" ViewStateEncryptionMode="Never" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
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
            $('#Batting').load(baseURL + 'Batting' + getFilter(), function () {
                $('#tabs').tab(); //initialize tabs
                sortTable();
            });
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var pattern = /#.+/gi //use regex to get anchor(==selector)
                var contentID = e.target.toString().match(pattern)[0]; //get anchor         
                loadTab($(contentID))
            });
            $('#filterButton').click(function () {
                var btn = $(this);
                btn.button('loading');
                var activeTab = $('.tab-pane.active');
                loadTab(activeTab);

            });
        });

       function loadTab(tab) {
           tab.html('<img alt="loading..." src="img/loading_big.gif"/>');
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
            <div class=PageHeading>Club Statistics</div>
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
		            </ul>
                    
                    <div class="tab-content">
                        <div role="tabpanel" class="tab-pane active" id="Batting"><img alt="loading..." src="img/loading_big.gif"/></div>
                        <div role="tabpanel" class="tab-pane" id="Bowling"><img alt="loading..." src="img/loading_big.gif"/></div>
                        <div role="tabpanel" class="tab-pane" id="Teams"><img alt="loading..." src="img/loading_big.gif"/></div>
                        <div role="tabpanel" class="tab-pane" id="Venues"><img alt="loading..." src="img/loading_big.gif"/></div>
                        <div role="tabpanel" class="tab-pane" id="Captains"><img alt="loading..." src="img/loading_big.gif"/></div>
                        <div role="tabpanel" class="tab-pane" id="Keepers"><img alt="loading..." src="img/loading_big.gif"/></div>
                    </div>

            </form>
        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
</body>
</html>

