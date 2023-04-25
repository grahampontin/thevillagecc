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

function loadPlayerDetailStats(statsType, loadedCallack, preloadCallback) {
    var postData = {
        'command': "loadPlayerStats",
        "matchId": playerId,
        "payload": statsType
    }

    preloadCallback();
    $.post("./MobileWeb/BallByBall/CommandHandler.ashx", JSON.stringify(postData), function (data) {
        //success
        loadedCallack(data, statsType);
    }, 'json')
        .fail(function (data) {
            showError(data.responseText);
        });
}

function renderPlayerStatsTables(data, type) {
    hidePreloader();
    $("#statsDetailSelector > button").text(type);
   let container = $("#statsDetailGridsPlaceHolder");
   container.empty();
    $.each(data, function (index, statsData){
       var title = $("<div></div>");
       title.text(statsData.statsType);
       title.addClass("stats-grid-divider");
       container.append(title);
       var gridContainer = $("<div></div>");
       gridContainer.addClass("ag-theme-material");
       gridContainer.addClass("player-stats-grid");
       container.append(gridContainer);
       let gridOptions = renderAgGrid(gridContainer, statsData.gridOptions);
       if (window.innerWidth < 990){
           resizeForOptions(gridOptions);
       }
   })
}

function renderAgGrid(containingDiv, gridOptions) {
    var theseGridOptions = makeDefaultGridOptions();
    new agGrid.Grid(containingDiv[0], theseGridOptions);
    gridOptions.columnDefs[0].pinned = "left";
    theseGridOptions.api.setRowData(gridOptions.rowData);
    theseGridOptions.api.setColumnDefs(gridOptions.columnDefs);
    let rows = gridOptions.rowData.length + 1; //rows + room for header
    if (rows > 10) {
        rows = 10;
    }
    containingDiv.height(rows * 55);
    return theseGridOptions;
}

function loadPlayerMatchDetails(loadedCallback, preloadCallback) {
    var postData = {
        'command': "loadPlayerMatches",
        "matchId": playerId
    }

    preloadCallback();
    $.post("./MobileWeb/BallByBall/CommandHandler.ashx", JSON.stringify(postData), function (data) {
        //success
        hidePreloader();
        loadedCallback(data);
    }, 'json')
        .fail(function (data) {
            showError(data.responseText);
        });
    
}

function renderAllMatchesTable(data) {
    let gridOptions = renderAgGrid($("#statsAllMatchesGridContainer"), data.gridOptions);
    if (window.innerWidth < 990){
        resizeForOptions(gridOptions);
    }
}

$(function () {
    $('button[data-bs-toggle="tab"]').each(function () {
        this.addEventListener('shown.bs.tab', function (event) {
            if (event.target.id === "stats-tab") {
                let gridsPlaceHolder = $("#statsDetailGridsPlaceHolder");
                if (gridsPlaceHolder.children(".player-stats-grid").children().length === 0) {
                    loadPlayerDetailStats("Batting", renderPlayerStatsTables, () => showPreloader(gridsPlaceHolder));
                } else {
                    resizeGrids();
                }
            } else if (event.target.id === "matches-tab") {
                let matchesGridContainer = $("#statsAllMatchesGridContainer");
                if (matchesGridContainer.children().length === 0) {
                    loadPlayerMatchDetails(renderAllMatchesTable, () => showPreloader(matchesGridContainer));
                } else {
                    resizeGrids();
                }
            }
        });
    })
    
    
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
    
    $(".stats-detail-link").click(function (){
        let statsType = $(this).attr("stats-type");
        loadPlayerDetailStats(statsType, renderPlayerStatsTables, ()=>showPreloader($("#statsDetailGridsPlaceHolder"))); 
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
            suppressMovable: true,
            flex: 1,
            filter: false
        },
        columnDefs: null,
        rowData: null,
        suppressColumnVirtualisation: true,
        suppressHorizontalScroll: true,
        components: {
            // 'countryCellRenderer' is mapped to class CountryCellRenderer
            LinkToPlayerStatsRenderer: LinkToPlayerStatsRenderer,
            LinkToMatchReportRenderer: LinkToMatchReportRenderer,
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