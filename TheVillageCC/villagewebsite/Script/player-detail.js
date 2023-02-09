$(function () {
    var postData = {
        'command': "getPlayerDetail",
        "matchId": $.url().param('playerid')
    }

    $.post("./MobileWeb/BallByBall/CommandHandler.ashx", JSON.stringify(postData), function (data) {
        //success
        playerDetailLoaded(data);
    }, 'json')
        .fail(function (data) {
            showError(data.responseText);
        });

    const ctx = document.getElementById("careerBattingChart");

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

});

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