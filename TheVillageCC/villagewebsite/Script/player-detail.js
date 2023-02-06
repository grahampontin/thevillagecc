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

});

function playerDetailLoaded(data) {
    //do stuff
    new agGrid.Grid($("#careerBattingStatsGrid")[0], gridOptions);
    gridOptions.api.setRowData(data.battingStats.gridOptions.rowData);
}


const gridOptions = {
    defaultColDef: {
        resizable: false,
        sortable: true,
        flex: 1,
        filter: "agNumberColumnFilter"
    },
    columnDefs: null,
    rowData: null,
    suppressColumnVirtualisation: true,
    components: {
        // 'countryCellRenderer' is mapped to class CountryCellRenderer
        LinkToPlayerStatsRenderer: LinkToPlayerStatsRenderer,
    },
};

function showError(text) {
    $("#errorModal .modal-body p").text(text);
    var errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {});
    errorModal.show();
}