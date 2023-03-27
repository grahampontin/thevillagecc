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

function updatePlayerDetails(player, image) {
    $(".player-name").text(player.firstName + " " + player.surname);
    $(".player-caps").text(player.matches);
    $(".player-batting-style").text(player.isRightHandBat ? "RHB" : "LHB");
    $(".player-bowling-style").text(player.bowlingStyle);
    $(".debut-season").text(new Date(player.debut).getFullYear());
    $(".latest-season").text(new Date(player.lastMatchDate).getFullYear());
    $(".playing-role").text(player.playingRole);
    $(".player-debut").text(new Date(player.debut).toDateString());
    $(".player-image").attr('src', "data:image/png ;base64, " + image);
}

function playerDetailLoaded(data) {
    

    updatePlayerDetails(data.player, data.playerImage);
    
    //do stuff
    new agGrid.Grid($("#careerBattingStatsGrid")[0], battingGridOptions);
    battingGridOptions.api.setRowData(data.battingStats.gridOptions.rowData);
    battingGridOptions.api.setPinnedBottomRowData([data.battingStats.gridOptions.footerRow]);
    battingGridOptions.api.setColumnDefs(data.battingStats.gridOptions.columnDefs);

    new agGrid.Grid($("#careerBowlingStatsGrid")[0], bowlingGridOptions);
    bowlingGridOptions.api.setRowData(data.bowlingStats.gridOptions.rowData);
    bowlingGridOptions.api.setPinnedBottomRowData([data.bowlingStats.gridOptions.footerRow]);
    bowlingGridOptions.api.setColumnDefs(data.bowlingStats.gridOptions.columnDefs);

    resizeGrids();
}

function resizeForOptions(options) {
    const allColumnIds = [];
    options.columnApi.getColumns().forEach((column) => {
        allColumnIds.push(column.getId());
    });

    options.columnApi.autoSizeColumns(allColumnIds, false);
}

function resizeGrids() {
    $("#careerBattingStatsGrid").height((battingGridOptions.api.getDisplayedRowCount() + 2) * 50);
    $("#careerBowlingStatsGrid").height((bowlingGridOptions.api.getDisplayedRowCount() + 2) * 50);
    if (window.innerWidth < 990) {
        resizeForOptions(battingGridOptions);
        resizeForOptions(bowlingGridOptions);
    }
}

$(window).resize(function () {
    resizeGrids();
});

function makeDefaultGridOptions() {
    return {
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
        }
    };
}

const battingGridOptions = makeDefaultGridOptions();
const bowlingGridOptions = makeDefaultGridOptions();

function showError(text) {
    $("#errorModal .modal-body p").text(text);
    var errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {});
    errorModal.show();
}