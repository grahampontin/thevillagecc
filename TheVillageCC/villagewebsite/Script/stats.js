var baseURL = 'stats/StatsGrid.Ajax.aspx?Tab=';


function loadStats(category, successCallback) {
    var from = $("#fromDate").val();
    var to = $("#toDate").val();
    var venue = $("#VenuesDropDown option:selected").text();
    var matchTypes = $(".form-check-input:checked").toArray().map(i => $(i).attr("matchType"));


    var postData = {
        'command': "loadStats",
        "payload": {
            'category': category,
            'from': from,
            'to': to,
            'venue': venue,
            'matchTypes': matchTypes
        }

    };

    $('#filterButton').hide();
    $('#loadingButton').show();
    $.post("./MobileWeb/BallByBall/CommandHandler.ashx", JSON.stringify(postData), function (data) {
        //success
        successCallback(data);
        $('#filterButton').show();
        $('#loadingButton').hide();
    }, 'json')
        .fail(function (data) {
            $('#filterButton').show();
            $('#loadingButton').hide();
            showError(data.responseText);
        });
}


$(window).resize(function () {
    resizeGrids();
});

const gridOptions = {
    defaultColDef: {
        resizable: true,
        sortable: true,
        suppressMovable: true,
        flex: 1,
        filter: "agNumberColumnFilter"
    },
    columnDefs: null,
    rowData: null,
    suppressColumnVirtualisation: true,
    components: {
        // 'countryCellRenderer' is mapped to class CountryCellRenderer
        LinkToPlayerStatsRenderer: LinkToPlayerStatsRenderer,
        ParameterizedLinkToMatchReportRenderer: ParameterizedLinkToMatchReportRenderer,
    },
};

function getGridContainerForStatsType(statsType) {
    var grid;
    switch (statsType) {
        case "batting":
            grid = $("#battingGrid");
            break;
        case "bowling":
            grid = $("#bowlingGrid");
            break;
        case "teams":
            grid = $("#teamsGrid");
            break;
        case "venues":
            grid = $("#venuesGrid");
            break;
        case "captains":
            grid = $("#captainsGrid");
            break;
        case "keepers":
            grid = $("#keepersGrid");
            break;
        case "matches":
            grid = $("#matchesGrid");
            break;
        case "innings":
            grid = $("#inningsGrid");
            break;
    }
    return grid;
}

function renderStatsTable(data) {
    var grid = getGridContainerForStatsType(data.statsType);
    hidePreloader()
    grid.html('');
    new agGrid.Grid(grid[0], gridOptions);
    gridOptions.api.setRowData(data.gridOptions.rowData);
    data.gridOptions.columnDefs[0].pinned = "left";
    data.gridOptions.columnDefs[0].sort = "asc";
    data.gridOptions.columnDefs[0].filter = "agTextColumnFilter";
    gridOptions.api.setColumnDefs(data.gridOptions.columnDefs);


    resizeGrids();
}


function resizeGrids() {
    $(".stats-grid").each(function (i) {
        $(this).height(window.innerHeight - $("#pageFooter").height() - $("#tabs").height() - $("header").height() - 40);
    });
    if (window.innerWidth < 990 && gridOptions.columnApi != undefined) {
        const allColumnIds = [];
        gridOptions.columnApi.getColumns().forEach((column) => {
            allColumnIds.push(column.getId());
        });
        gridOptions.columnApi.autoSizeColumns(allColumnIds, false);
    }
}

function showError(text) {
    $("#errorModal .modal-body p").text(text);
    var errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {});
    errorModal.show();
}

$(function () {
    var filterPanel = document.getElementById('collapseOne')
    filterPanel.addEventListener('hidden.bs.collapse', function () {
        resizeGrids();
    })
    filterPanel.addEventListener('shown.bs.collapse', function () {
        resizeGrids();
    })

    var currentYear = new Date().getFullYear();
    $("#fromDate").val(currentYear - 30 + "-01-01");
    $("#toDate").val(currentYear + "-12-31");
    showPreloader(getGridContainerForStatsType("batting"))
    loadStats("batting", renderStatsTable);
    resizeGrids();
    $("#filterButton").click(function () {
        var statsType = $(".nav-link.active").text().toLowerCase();
        //clear grids
        $(".stats-grid").empty();
        showPreloader(getGridContainerForStatsType(statsType));
        loadStats(statsType, renderStatsTable);
    });

    $('button[data-bs-toggle="tab"]').each(function () {
        this.addEventListener('shown.bs.tab', function (event) {
            if ($($(event.target).attr("data-bs-target")).children(".stats-grid").children().length === 0) {
                var statsType = $(".nav-link.active").text().toLowerCase();
                showPreloader(getGridContainerForStatsType(statsType));
                loadStats(statsType, renderStatsTable);
            } else {
                resizeGrids();
            }
        });
    })


});

function reloadTab(tab) {
    $('#filterButton').hide();
    $('#loadingButton').show();
    $('.tab-pane').each(function (index, value) {
        $(this).html('');
    });
    tab.html('<div class="table-bordered" style="padding: 50px;"><div class="progress" ><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><span class="sr-only">Loading</span></div></div></div>');
    //load content for selected tab
    tab.load(baseURL + tab.prop('id').replace('#', '') + getFilter(), function () {
        sortTable();
        $('#filterButton').show();
        $('#loadingButton').hide();

    });

}
        