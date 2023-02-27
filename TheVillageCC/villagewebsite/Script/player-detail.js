var playerId;
var battingChart;
var bowlingChart;

function loadBattingChart(chartType) {
    loadChart(chartType, "careerBattingChart", playerId, function (data) {
        $("#battingChartSelector > button").text(data.options.plugins.title.text);
        if (battingChart !== undefined) {
            battingChart.destroy();
        }
    }, function (chart) {
        battingChart = chart;
    });
}
function loadBowlingChart(chartType) {
    loadChart(chartType, "careerBowlingChart", playerId, function (data) {
        $("#bowlingChartSelector > button").text(data.options.plugins.title.text);
        if (bowlingChart !== undefined) {
            bowlingChart.destroy();
        }
    }, function (chart) {
        bowlingChart = chart;
    });
}

$(function () {
    playerId =  $.url().param('playerid')
    var postData = {
        'command': "getPlayerDetail",
        "matchId": playerId
    }

    $.post("./MobileWeb/BallByBall/CommandHandler.ashx", JSON.stringify(postData), function (data) {
        //success
        playerDetailLoaded(data);
    }, 'json')
        .fail(function (data) {
            showError(data.responseText);
        });
    loadBattingChart("battingTimeline");
    loadBowlingChart("wicketsBySeason");
    
    $(".batting-chart-link").click(function (){
        loadBattingChart($(this).attr("chart-id")); 
    });
    $(".bowling-chart-link").click(function (){
        loadBowlingChart($(this).attr("chart-id")); 
    });

});

function loadChart(chartType, target, playerId, chartLoadedCallback, chartCreatedCallback) {
    var postData = {
        'command': "loadChart",
        'payload' : {
            playerId : playerId,
            chartType : chartType
        }
    }
    $.post("./MobileWeb/BallByBall/CommandHandler.ashx", JSON.stringify(postData), function (data) {
        //success
        var chartContainer = $("#"+target);
        chartContainer.removeClass("mx-auto");
        const ctx = document.getElementById(target);
        chartLoadedCallback(data);
        var chart = new Chart(ctx, data);
        chartContainer.addClass("mx-auto");
        chartCreatedCallback(chart);
    }, 'json')
        .fail(function (data) {
            showError(data.responseText);
        });
}

function playerDetailLoaded(data) {
    //do stuff
    new agGrid.Grid($("#careerBattingStatsGrid")[0], gridOptions);
    gridOptions.api.setRowData(data.battingStats.gridOptions.rowData);
    gridOptions.api.setPinnedBottomRowData([data.battingStats.gridOptions.footerRow]);
    gridOptions.api.setColumnDefs(data.battingStats.gridOptions.columnDefs);

    new agGrid.Grid($("#careerBowlingStatsGrid")[0], gridOptions);
    gridOptions.api.setRowData(data.bowlingStats.gridOptions.rowData);
    gridOptions.api.setPinnedBottomRowData([data.bowlingStats.gridOptions.footerRow]);
    gridOptions.api.setColumnDefs(data.bowlingStats.gridOptions.columnDefs);

    resizeGrids();
}

function resizeGrids() {
    $("#careerBattingStatsGrid").height((gridOptions.api.getDisplayedRowCount() + 2) * 50);
    $("#careerBowlingStatsGrid").height((gridOptions.api.getDisplayedRowCount() + 2) * 50);
    if (window.innerWidth < 990) {
        const allColumnIds = [];
        gridOptions.columnApi.getColumns().forEach((column) => {
            allColumnIds.push(column.getId());
        });

        gridOptions.columnApi.autoSizeColumns(allColumnIds, false);
    }
}

$(window).resize(function () {
    resizeGrids();
});

const gridOptions = {
    defaultColDef: {
        resizable: false,
        sortable: true,
        flex: 1,
        filter: false
    },
    columnDefs: null,
    rowData: null,
    suppressColumnVirtualisation: true,
    components: {
        // 'countryCellRenderer' is mapped to class CountryCellRenderer
        LinkToPlayerStatsRenderer: LinkToPlayerStatsRenderer,
    },
    getRowStyle: (params) => {
        if (params.node.rowPinned) {
            return {'font-weight': 'bold'};
        }
    }
};

function showError(text) {
    $("#errorModal .modal-body p").text(text);
    var errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {});
    errorModal.show();
}