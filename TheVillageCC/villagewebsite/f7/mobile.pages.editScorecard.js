$$(document).on('page:init', '.page[data-name="editScorecard"]', function (e) {
    if (e.detail.position != "next") {
        return;
    }
    app.toolbar.hide("#opposition-tabbar", false);

    //Bind handlers here
    $("#opposition-scorecard-link").click(function() {
        app.toolbar.show("#opposition-tabbar", false);
        app.toolbar.hide("#home-tabbar", false);        
        $(".tab").removeClass("tab-active");
        $(".tab-link-active").removeClass("tab-link-active");
        $("#oppositionBatting").addClass("tab-active");
        
        $("#opposition-scorecard-link").addClass("tab-link-active");
        $("#home-scorecard-link").removeClass("tab-link-active");
        
        app.toolbar.setHighlight('.toolbar-top');
        
        $(".opposition-scorecard-link").removeClass("tab-link-active");
        $(".home-scorecard-link").removeClass("tab-link-active");
        $("#opposition-batting-card-link").addClass("tab-link-active");
        app.toolbar.setHighlight('#opposition-tabbar');

    });
    $("#home-scorecard-link").click(function() {
        app.toolbar.hide("#opposition-tabbar", false);
        app.toolbar.show("#home-tabbar", false);
        $(".tab").removeClass("tab-active");
        $(".tab-link-active").removeClass("tab-link-active");
        $("#homeBatting").addClass("tab-active");

        $("#opposition-scorecard-link").removeClass("tab-link-active");
        $("#home-scorecard-link").addClass("tab-link-active");
        app.toolbar.setHighlight('.toolbar-top');
        $(".opposition-scorecard-link").removeClass("tab-link-active");
        $(".home-scorecard-link").removeClass("tab-link-active");
        $("#home-batting-card-link").addClass("tab-link-active");
        app.toolbar.setHighlight('#home-tabbar');


    });
    
    //once bound...
    app.preloader.show();
    var postData = { 'command': "getScorecard", 'matchId': matchId };
    $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
                JSON.stringify(postData),
                function(data) {
                    app.preloader.hide();
                    //success
                    renderBattingData(data.ourInnings.batting, "#home-batting-scorecard");
                },
                "json")
            .fail(function(data) {
                app.preloader.hide();
                showToastCenter(data.responseText);
            })
        ;


});

function renderBattingData(battingData, scorecardTableId) {
    $(scorecardTableId + " .batsman-row").remove();
    battingData.entries.sort(function(a,b) {
        return b.battingAt - a.battingAt;
    });
    $.each(battingData.entries,
        function(i, entry) {
            $(scorecardTableId).prepend(makeBatsmanRow(entry));
        });

}

/*
 <tr class="batsman-row">
    <td class="actions-cell scorecard-edit-item"><i class="material-icons md-18">edit</i></td>
    <td class="label-cell">P Mishra<br /><span class="scorecard-subtitle">ct. Fielder b. Bowler</span></td>
    <td class="numeric-cell">8</td>
    <td class="numeric-cell">5</td>
    <td class="numeric-cell medium-only">2</td>
    <td class="numeric-cell medium-only">0</td>
</tr>
*/
 

function makeBatsmanRow(entry) {
    var row = $("<tr></tr>");
    row.addClass("batsman-row");
    
    var actionCell = $("<td></td>");
    actionCell.addClass("actions-cell");
    actionCell.addClass("scorecard-edit-item");
    var editIcon = $("<i>edit</i>");
    editIcon.addClass("material-icons md-18");
    actionCell.append(editIcon);

    row.append(actionCell);

    var playerCell = $("<td></td>");
    playerCell.addClass("label-cell");
    playerCell.text(entry.playerName);
    playerCell.append($("<br/>"));

    var dismisalSpan = $("<span></span>");
    dismisalSpan.addClass("scorecard-subtitle");
    dismisalSpan.text(formatDismisal(entry));

    playerCell.append(dismisalSpan);

    row.append(playerCell);

    return row;
}

function formatDismisal(data) {
    return "not out";
}

