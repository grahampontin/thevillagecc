var editBatsmanPopup;
var editExtrasPopup;
var editPenaltyPopup;
var editOversPopup;
var editBowlerStatsPopup;
var editFowPopup;
var scorecardData;
var requiresSave = false;
var fowToast;
//TODO: intercept navigation + refresh

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

    $("#save-scorecard-button").click(function() {
        app.preloader.show();
        //actually save it
        var postData = { 'command': "saveScorecard", 'matchId': matchId, "payload" : scorecardData };
        $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
                    JSON.stringify(postData),
                    function(data) {
                        scorecardData = data;
                        renderFullView(scorecardData);
                        var toastIcon = app.toast.create({
                            icon: '<i class="material-icons">cloud_done</i>',
                            text: "Scorecard Saved",
                            position: 'center',
                            closeButton: true,
                            closeTimeout: 2000
                        });
                        toastIcon.open();
                        app.preloader.hide();
                    },
                    "json")
                .fail(function(data) {
                    app.preloader.hide();
                    showToastCenter(data.responseText);
                })
            ;


        

    });

    editBatsmanPopup = app.popup.create({
        el: '.edit-batsman-entry-popup',
        closeByBackdropClick: false,
        on: {
            opened: function() {
                console.log('Popup opened');
            }
        }
    });      
    
    editFowPopup = app.popup.create({
        el: '.edit-fow-popup',
        closeByBackdropClick: false,
        on: {
            opened: function() {
                console.log('Fow Popup opened');
            }
        }
    });    
    
    editBowlerStatsPopup = app.popup.create({
        el: '.edit-bowler-stats-popup',
        closeByBackdropClick: false,
        on: {
            opened: function() {
                console.log('Bowler Popup opened');
            }
        }
    });

    editExtrasPopup = app.popup.create({
        el: '.edit-extras-popup',
        closeByBackdropClick: false,
        on: {
            opened: function() {
                console.log('Extras Popup opened');
            }
        }
    });
    
    editOversPopup = app.popup.create({
        el: '.edit-overs-popup',
        closeByBackdropClick: false,
        on: {
            opened: function() {
                console.log('Overs Popup opened');
            }
        }
    });
    
    editPenaltyPopup = app.popup.create({
        el: '.edit-penalty-popup',
        closeByBackdropClick: false,
        on: {
            opened: function() {
                console.log('Penalty Popup opened');
            }
        }
    });


    $("#save-batsman-entry-close-button").click(function() {
        editBatsmanPopup.close(false);
        if (activeBatsmanEntry.playerId == -1) {
            scorecardData.ourInnings.batting.entries.pop();
        }
        if (activeBatsmanEntry.playerId == 0) {
            scorecardData.theirInnings.batting.entries.pop();
        }
    });   
    
    $("#edit-fow-close-button").click(function() {
        editFowPopup.close(false);
        if (fowToast != undefined) {
            fowToast.close();
        }
        if (activeFoWEntry.isNew) {
            if (activeFoWEntry.isHome) {
                scorecardData.ourInnings.fow.entries.pop();
            }   
            else {
                scorecardData.theirInnings.fow.entries.pop();
            }
        }
    });    
    

    $("#save-batsman-entry-button").click(function() {
        editBatsmanPopup.close(false);
        activeBatsmanEntry.runs = parseInt($("#runs-input").val());
        activeBatsmanEntry.ballsFaced = parseInt($("#balls-input").val());
        activeBatsmanEntry.fours =parseInt( $("#fours-input").val());
        activeBatsmanEntry.sixes = parseInt($("#sixes-input").val());
        activeBatsmanEntry.modeOfDismissal = $("#dismissal-type-select").val();
        activeBatsmanEntry.playerId = parseInt($("#batter-select").val());
        if (activeBatsmanEntry.playerId > 0) {
            //Home team variation
            var player = allPlayers.filter(p => p.playerId == activeBatsmanEntry.playerId)[0];
            activeBatsmanEntry.playerName = player.shortName;
            activeBatsmanEntry.fielderName = $("#fielder-name-input").val();
            activeBatsmanEntry.bowlerName = $("#bowler-name-input").val();
        } else {
            //Away team
            activeBatsmanEntry.playerId = 0;
            activeBatsmanEntry.playerName = $("#batsman-name-input").val();
            activeBatsmanEntry.fielderId = parseInt($("#fielder-select").val());
            if (isNaN(activeBatsmanEntry.fielderId)) {
                activeBatsmanEntry.fielderId = 0;
            }
            activeBatsmanEntry.bowlerId = parseInt($("#bowler-select").val());
            if (isNaN(activeBatsmanEntry.bowlerId)) {
                activeBatsmanEntry.bowlerId = 0;
            }
            var bowler = allPlayers.filter(p => p.playerId == activeBatsmanEntry.bowlerId)[0];
            var fielder = allPlayers.filter(p => p.playerId == activeBatsmanEntry.fielderId)[0];
            if (fielder != undefined) {
                activeBatsmanEntry.fielderName = fielder.shortName;
            }
            if (bowler != undefined) {
                activeBatsmanEntry.bowlerName = bowler.shortName;
            }
            
        }
        
        renderFullView(scorecardData);


        requiresSave = true;
    });

    $("#save-fow-button").click(function() {
        activeFoWEntry.overs = $("#fow-overs-input").val();
        activeFoWEntry.score = $("#fow-score-input").val();
        activeFoWEntry.partnership = $("#fow-parnership-input").val();
        activeFoWEntry.outgoingPlayer.score = $("#fow-out-batsman-score-input").val();
        activeFoWEntry.notOutPlayer.score = $("#fow-not-out-batsman-score-input").val();
        activeFoWEntry.notOutPlayer.name = $("#fow-not-out-batsman-name-input").val();
        activeFoWEntry.notOutPlayer.id = $("#fow-not-out-batsman-name-input").attr("playerId");
        activeFoWEntry.notOutPlayer.battingAt = $("#fow-not-out-batsman-name-input").attr("battingAt");
        activeFoWEntry.outgoingPlayer.id = $("#fow-out-batsman-select").val();
        activeFoWEntry.outgoingPlayer.name = $('option:selected', $("#fow-out-batsman-select")).attr("playerName");
        activeFoWEntry.outgoingPlayer.battingAt = $('option:selected', $("#fow-out-batsman-select")).attr("battingAt");

       
        renderFullView(scorecardData);
        editFowPopup.close();
    });

   
    $("#home-batting-scorecard-add-row").click(function() {

        var battersArray = scorecardData.ourInnings.batting.entries;
        var newBatter = {
            playerId: "-1",
            battingAt: battersArray.map(e => e.battingAt).sort().reverse()[0] + 1,
            runs: 0,
            fours: 0,
            sixes: 0,
            ballsFaced: 0
        };
        battersArray.push(newBatter);
        activeBatsmanEntry = newBatter;
        openBatsmanEditor("Add New Innings", true);

    });
    
    $("#oppo-batting-scorecard-add-row").click(function() {

        var battersArray = scorecardData.theirInnings.batting.entries;
        var newBatter = {
            playerId: "0",
            battingAt: battersArray.map(e => e.battingAt).sort((a, b) => a - b).reverse()[0] + 1,
            runs: 0,
            fours: 0,
            sixes: 0,
            ballsFaced: 0
        };
        battersArray.push(newBatter);
        activeBatsmanEntry = newBatter;
        openBatsmanEditor("Add New Innings", false);

    });
    
    $("#home-bowling-scorecard-add-row").click(function() {

        var bowlersArray = scorecardData.ourInnings.bowling.entries;
        var newBowler = {
            playerId: "0",
            overs: 0,
            maidens: 0,
            runs: 0,
            wickets: 0
        };
        bowlersArray.push(newBowler);
        activeBowlerEntry = newBowler;
        openBowlerEditor("Add New Figures", false);
    });    
    
    $("#oppo-bowling-scorecard-add-row").click(function() {

        var bowlersArray = scorecardData.theirInnings.bowling.entries;
        var newBowler = {
            playerId: "-1",
            overs: 0,
            maidens: 0,
            runs: 0,
            wickets: 0
        };
        bowlersArray.push(newBowler);
        activeBowlerEntry = newBowler;
        openBowlerEditor("Add New Figures", true);
    }); 
    
    $("#home-fow-scorecard-add-row").click(function() {

        var fowData = scorecardData.ourInnings.fow;
        var previousWicket = fowData.entries.map(e=>e.wicket).sort((a,b)=>a-b).reverse()[0];
        if (isNaN(previousWicket)) {
            previousWicket = 0;
        }

        var outPlayers = fowData.entries.map(e => parseInt(e.outgoingPlayer.id));
        var availablePlayers = scorecardData.ourInnings.batting.entries.filter(e => outPlayers.indexOf(e.playerId)==-1).sort((a, b) => a.battingAt - b.battingAt).slice(0, 2);

        if (availablePlayers.length != 2) {
            showToastBottom("Whoops, there are no more batters in the scorecard - do you need to complete the batting card?");
            return;
        }

        var newFoW = {
            wicket : previousWicket+1,
            outgoingPlayer : {},
            notOutPlayer : {},
            availablePlayers : availablePlayers,
            isHome : true,
            isNew : true
        };
        fowData.entries.push(newFoW);
        activeFoWEntry = newFoW;
        openFowEditor("Enter Fall of Wicket " + newFoW.wicket, true, true);
    });

    var activeExtras;
    $("#home-batting-scorecard-edit-extras").click(function() {
        activeExtras = scorecardData.ourInnings.batting.extras;
        openExtrasEditor();
    });
    
    $("#oppo-batting-scorecard-edit-extras").click(function() {
        activeExtras = scorecardData.theirInnings.batting.extras;
        openExtrasEditor();
    });
    
    $("#home-batting-scorecard-edit-penalty").click(function() {
        activeExtras = scorecardData.ourInnings.batting.extras;
        openPenaltyEditor();
    });

    $("#oppo-batting-scorecard-edit-penalty").click(function() {
        activeExtras = scorecardData.theirInnings.batting.extras;
        openPenaltyEditor();
    });    
    
    var activeInnings;
    $("#home-batting-scorecard-edit-overs").click(function() {
        activeInnings = scorecardData.ourInnings;
        openOversEditor();
    });
    
    $("#oppo-batting-scorecard-edit-overs").click(function() {
        activeInnings = scorecardData.theirInnings;
        openOversEditor();
    });

    function openExtrasEditor() {
        $("#no-balls-input").val(activeExtras.noBalls);
        $("#wides-input").val(activeExtras.wides);
        $("#byes-input").val(activeExtras.byes);
        $("#leg-byes-input").val(activeExtras.legByes);
        editExtrasPopup.open();
    }
    
    function openPenaltyEditor() {
        $("#penalty-input").val(activeExtras.penalties);
        editPenaltyPopup.open();
    }
    
    function openOversEditor() {
        $("#overs-input").val(activeInnings.inningsLength);
        editOversPopup.open();
    }

    $("#edit-extras-close-button").click(function() {
        editExtrasPopup.close();
    });
    
    $("#edit-bowler-close-button").click(function() {
        editBowlerStatsPopup.close();
    });
    
    $("#edit-penalty-close-button").click(function() {
        editPenaltyPopup.close();
    });    
    
    $("#edit-overs-close-button").click(function() {
        editOversPopup.close();
    });

    $("#save-extras-button").click(function() {
        activeExtras.noBalls = parseInt($("#no-balls-input").val());
        activeExtras.wides = parseInt($("#wides-input").val());
        activeExtras.byes = parseInt($("#byes-input").val());
        activeExtras.legByes = parseInt($("#leg-byes-input").val());
        editExtrasPopup.close();
        renderFullView(scorecardData);
    });
    
    $("#save-penalty-button").click(function() {
        activeExtras.penalties = parseInt($("#penalty-input").val());
        editPenaltyPopup.close();
        renderFullView(scorecardData);
    });    
    
    $("#save-overs-button").click(function() {
        activeInnings.inningsLength = parseFloat($("#overs-input").val());
        editOversPopup.close();
        renderFullView(scorecardData);
    });
    
    $("#save-bowler-button").click(function() {
        activeBowlerEntry.runs = $("#bowler-runs-input").val();
        activeBowlerEntry.overs = $("#bowler-overs-input").val();
        activeBowlerEntry.maidens = $("#bowler-maidens-input").val();
        activeBowlerEntry.wickets = $("#bowler-wickets-input").val();
        activeBowlerEntry.playerId = parseInt($("#bowler-stats-select").val());
        if (activeBowlerEntry.playerId > 0) {
            //Home team variation
            var player = allPlayers.filter(p => p.playerId == activeBowlerEntry.playerId)[0];
            activeBowlerEntry.playerName = player.shortName;
        } else {
            //Away team
            activeBowlerEntry.playerId = 0;
            activeBowlerEntry.playerName = $("#bowler-stats-name-input").val();
        }

        editBowlerStatsPopup.close();
        renderFullView(scorecardData);
    });

    //Fow Behaviour
    
    $("#fow-not-out-batsman-score-input").change(fowValidator);
    $("#fow-overs-input").change(fowValidator);
    $("#fow-score-input").change(fowValidator);
    $("#fow-out-batsman-select").change(fowValidator);
    $("#fow-score-input").change(function() {
        //Set partnership value
        var previousFow = getFowDataForActionFowEntry().entries.filter(e => e.wicket == activeFoWEntry.wicket-1)[0];
        var scoreForTheWicket = parseInt($("#fow-score-input").val());
        var previousScore;
        if (previousFow == undefined) {
            previousScore = 0;
        } else {
            previousScore = previousFow.score;
        }
        $("#fow-parnership-input").val(scoreForTheWicket - previousScore);
    });
    
    $("#fow-out-batsman-select").change(function() {
        //Set not out batsman
        var thisPlayerId = $("#fow-out-batsman-select").val();
        var thisPlayerName = $('option:selected', this).attr("playerName");
        var otherPlayer = activeFoWEntry.availablePlayers.filter(p => p.playerId != thisPlayerId)[0];
        $("#fow-not-out-batsman-name-input").val(otherPlayer.playerName);
        $("#fow-not-out-batsman-name-input").attr("playerId", otherPlayer.playerId);
        $("#fow-not-out-batsman-name-input").attr("battingAt", otherPlayer.battingAt);
        //Set out batsman score
        var thisPlayer;
        if (activeFoWEntry.isHome) {
            thisPlayer = scorecardData.ourInnings.batting.entries.filter(e => e.playerId == thisPlayerId)[0];
        } else {
            thisPlayer = scorecardData.ourInnings.batting.entries.filter(e => e.playerName == thisPlayerName)[0];
        }
        $("#fow-out-batsman-score-input").val(thisPlayer.runs);

    });

    function getFowDataForActionFowEntry() {
        if (activeFoWEntry.notOutPlayer.id != 0) {
            return scorecardData.ourInnings.fow;
        } else {
            return scorecardData.theirInnings.fow;
        }
    }
    
    
    //once bound...

    loadAndProcessPlayers();
    app.preloader.show();
    var postData = { 'command': "getScorecard", 'matchId': matchId };
    $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
                JSON.stringify(postData),
                function(data) {
                    app.preloader.hide();
                    scorecardData = data;
                    //success
                    renderFullView(scorecardData);
                },
                "json")
            .fail(function(data) {
                app.preloader.hide();
                showToastCenter(data.responseText);
            })
        ;


});

var fowValidator = function validateFoW() {
        if (activeFoWEntry == undefined) {
            return;
        }

        $("#save-fow-button").hide();
        $("#fow-incomplete").show();
        if (isNaN(parseFloat($("#fow-overs-input").val()))) {
            fowToast = showToastBottom("When did the wicket fall?");
            return;
        }
        if (isNaN(parseInt($("#fow-score-input").val()))) {
            fowToast = showToastBottom("What was the score when it fell?");
            return;
        }

        var fowData = activeFoWEntry.isHome ? scorecardData.ourInnings.fow : scorecardData.theirInnings.fow;

        var playerRunsFromScoreCard;
       
        var outgoingPlayerName = $('option:selected', $("#fow-out-batsman-select")).attr("playerName");
        var outgoingPlayerId = $("#fow-out-batsman-select").val();
        if ((outgoingPlayerId == "" || outgoingPlayerId == undefined) && (outgoingPlayerName == "" || outgoingPlayerName == undefined)) {
            fowToast = showToastBottom("Who was out?");
            return;
        }

        var notOutPlayerId = $("#fow-not-out-batsman-name-input").attr("playerId");
        var notOutPlayerName = $("#fow-not-out-batsman-name-input").val();
        if (notOutPlayerId > 0) {
            playerRunsFromScoreCard =
                scorecardData.ourInnings.batting.entries.filter(e => e.playerId == notOutPlayerId)[0].runs;
        } else if(notOutPlayerName != "") {
            playerRunsFromScoreCard =
                scorecardData.theirInnings.batting.entries.filter(e => e.playerName == notOutPlayerName)[0].runs;
        }
        if (parseInt($("#fow-not-out-batsman-score-input").val()) > playerRunsFromScoreCard) {
            fowToast = showToastBottom(notOutPlayerName +
                " only scored " +
                playerRunsFromScoreCard +
                " in the match.");
            return;
        }

        var previousFow = fowData.entries.filter(e => e.wicket == activeFoWEntry.wicket-1)[0];
        var nextFow = fowData.entries.filter(e => e.wicket == activeFoWEntry.wicket+1)[0];
        if (previousFow != undefined) {
            if (parseInt($("#fow-score-input").val()) < previousFow.score) {
                fowToast = showToastBottom("Score must be >= previous wicket ("+previousFow.score+")");
                return;
            }
            if (parseFloat($("#fow-over-input").val()) <= previousFow.overs) {
                fowToast = showToastBottom("Overs must be >= previous wicket ("+previousFow.overs+")");
                return;
            }
        }
        if (nextFow != undefined) {
            if (parseInt($("#fow-score-input").val()) > nextFow.score) {
                fowToast = showToastBottom("Score must be <= next wicket ("+nextFow.score+")");
                return;
            }
            if (parseInt($("#fow-over-input").val()) >= nextFow.overs) {
                fowToast = showToastBottom("Overs must be < next wicket ("+nextFow.overs+")");
                return;
            }
        }

        if (isNaN(parseInt($("#fow-not-out-batsman-score-input").val()))) {
            fowToast = showToastBottom("What was the not out player's score when the wicket fell?");
            return;
        }

        if (fowToast != undefined) {
            fowToast.close();
        }
        $("#save-fow-button").show();
        $("#fow-incomplete").hide();
            
    };


function renderFullView(data) {
    renderBattingData(data.ourInnings.batting, "#home-batting-scorecard");
    renderBattingData(data.theirInnings.batting, "#oppo-batting-scorecard");
    renderExtras(data.ourInnings.batting.extras, "#home-batting-scorecard-extras-detail", "#home-batting-scorecard-extras-total", "#home-batting-scorecard-penalty-total");
    renderExtras(data.theirInnings.batting.extras, "#oppo-batting-scorecard-extras-detail", "#oppo-batting-scorecard-extras-total", "#oppo-batting-scorecard-penalty-total");
    renderTotalAndWickets(data.ourInnings, "#home-batting-scorecard-total", "#home-batting-scorecard-wickets-text", "#home-batting-scorecard-overs");
    renderTotalAndWickets(data.theirInnings, "#oppo-batting-scorecard-total", "#oppo-batting-scorecard-wickets-text", "#oppo-batting-scorecard-overs");
    renderBowlingData(data.ourInnings.bowling, "#home-bowling-scorecard");
    renderBowlingData(data.theirInnings.bowling, "#oppo-bowling-scorecard");
    renderFoWData(data.ourInnings.fow, "#home-fow-scorecard", true);
    renderFoWData(data.theirInnings.fow, "#oppo-fow-scorecard", false);
}

var activeBatsmanEntry;
function renderBattingData(battingData, scorecardTableId) {
    $(scorecardTableId + " .batsman-row").remove();
    battingData.entries.sort(function(a,b) {
        return b.battingAt - a.battingAt;
    });
    $.each(battingData.entries,
        function(i, entry) {
            $(scorecardTableId).prepend(makeBatsmanRow(entry));
        }
    );
    $(".scorecard-edit-item").click(function() {

        var playerId = $(this).attr("playerId");
        if (playerId == undefined) {
            activeBatsmanEntry = findOppoEntryFor($(this).attr("playerName"));
            openBatsmanEditor("Edit " + activeBatsmanEntry.playerName + "\'s Innings", false);
        } else {
            activeBatsmanEntry = findEntryFor(playerId);
            openBatsmanEditor("Edit " + activeBatsmanEntry.playerName + "\'s Innings", true);
        }

    });

}

var activeBowlerEntry;
function renderBowlingData(bowlingData, scorecardTableId) {
    $(scorecardTableId + " .bowler-row").remove();
    $.each(bowlingData.entries,
        function(i, entry) {
            $(scorecardTableId).prepend(makeBowlerRow(entry));
        }
    );
    $(".bowling-scorecard-edit-item").click(function() {

        var playerId = $(this).attr("playerId");
        if (playerId == undefined) {
            activeBowlerEntry = findOppoBowlingEntryFor($(this).attr("playerName"));
            openBowlerEditor("Edit " + activeBowlerEntry.playerName + "\'s Figures", false);
        } else {
            activeBowlerEntry = findBowlingEntryFor(playerId);
            openBowlerEditor("Edit " + activeBowlerEntry.playerName + "\'s Figures", true);
        }
    });
}

var activeFoWEntry;
function renderFoWData(fowData, scorecardTableId, isHome) {
    $(scorecardTableId + " .fow-row").remove();
    
    $.each(fowData.entries.sort((a, b) => a.wicket - b.wicket).reverse(),
        function(i, entry) {
            $(scorecardTableId).prepend(makeFoWRow(entry, isHome));
        }
    );
    $(".fow-scorecard-edit-item").click(function() {
        var wicket = $(this).attr("wicket");
        var isHome = $(this).attr("isHome");

        if (isHome) {
            activeFoWEntry = scorecardData.ourInnings.fow.entries.filter(f => f.wicket == wicket)[0];
            
        } else {
            activeFoWEntry = scorecardData.theirInnings.fow.entries.filter(f => f.wicket == wicket)[0];
        }
        activeFoWEntry.isHome = isHome;
        openFowEditor("Edit Fall of Wicket " + wicket, isHome, false);
    });
}

function openFowEditor(title, isHome, isAddNew) {
    $("#edit-fow-title").text(title);
    $("#fow-overs-input").val(activeFoWEntry.overs);
    $("#fow-score-input").val(activeFoWEntry.score);
    $("#fow-parnership-input").val(activeFoWEntry.partnership);
    $("#fow-out-batsman-score-input").val(activeFoWEntry.outgoingPlayer.score);
    $("#fow-not-out-batsman-score-input").val(activeFoWEntry.notOutPlayer.score);
    $("#fow-not-out-batsman-name-input").val(activeFoWEntry.notOutPlayer.name);
    $("#fow-not-out-batsman-name-input").attr("playerId", activeFoWEntry.notOutPlayer.id);

    $("#fow-add-new-entry-message").hide();
    $("#fow-edit-entry-message").hide();
    if (isAddNew) {
        //populate smart select based on available players
        $("#fow-out-batsman-select").empty();
        var playerOne = activeFoWEntry.availablePlayers[0];
        $("#fow-out-batsman-select").append($("<option></option>"));
        $("#fow-out-batsman-select").append(makePlayerOption(playerOne));

        var playerTwo = activeFoWEntry.availablePlayers[1];
        $("#fow-out-batsman-select").append(makePlayerOption(playerTwo));

        $("#fow-add-new-entry-message").show();

        editFowPopup.open(false);
        fowValidator();
    } else {
        $("#fow-edit-entry-message").show();
    }
}

function makePlayerOption(player) {
        return $("<option></option>")
            .attr("value", player.playerId)
            .attr("playerid", player.playerId)
            .attr("playerName", player.playerName)
            .attr("battingAt", player.battingAt)
            .text(player.playerName);
    }

    function openBatsmanEditor(title, isHomeBatsman) {
        $("#edit-batsman-title").text(title);
        $("#runs-input").val(activeBatsmanEntry.runs);
        $("#balls-input").val(activeBatsmanEntry.ballsFaced);
        $("#fours-input").val(activeBatsmanEntry.fours);
        $("#sixes-input").val(activeBatsmanEntry.sixes);
        $("#bowler-name-input").val(activeBatsmanEntry.bowlerName);
        $("#fielder-name-input").val(activeBatsmanEntry.fielderName);
        var smartSelect = app.smartSelect.get("#dismissal-type-smart-select");
        smartSelect.setValue(activeBatsmanEntry.modeOfDismissal);
        if (isHomeBatsman) {
            $("#batsman-select-element").show();
            $("#fielder-text-element").show();
            $("#bowler-text-element").show();
            $("#batsman-text-element").hide();
            $("#fielder-select-element").hide();
            $("#bowler-select-element").hide();
            var bmanSmartSelect = app.smartSelect.get("#batsman-smart-select");
            bmanSmartSelect.setValue(activeBatsmanEntry.playerId);
            app.smartSelect.get("#bowler-smart-select").setValue(0);
            app.smartSelect.get("#fielder-smart-select").setValue(0);

        } else {
            $("#batsman-select-element").hide();
            $("#fielder-text-element").hide();
            $("#bowler-text-element").hide();
            $("#batsman-text-element").show();
            $("#fielder-select-element").show();
            $("#bowler-select-element").show();
            $("#batsman-name-input").val(activeBatsmanEntry.playerName);
            var bowlerSmartSelect = app.smartSelect.get("#bowler-smart-select");
            bowlerSmartSelect.setValue(activeBatsmanEntry.bowlerId);
            var fielderSmartSelect = app.smartSelect.get("#fielder-smart-select");
            fielderSmartSelect.setValue(activeBatsmanEntry.fielderId);
            app.smartSelect.get("#batsman-smart-select").setValue(0);
        }


        editBatsmanPopup.open(false);
    }

    function openBowlerEditor(title, isHomeBowler) {
        $("#edit-bowler-title").text(title);
        $("#bowler-runs-input").val(activeBowlerEntry.runs);
        $("#bowler-overs-input").val(activeBowlerEntry.overs);
        $("#bowler-maidens-input").val(activeBowlerEntry.maidens);
        $("#bowler-wickets-input").val(activeBowlerEntry.wickets);
        $("#bowler-stats-name-input").val(activeBowlerEntry.playerName);
        if (isHomeBowler) {
            $("#bowler-stats-select-element").show();
            $("#bowler-stats-text-element").hide();
            var bowlerSmartSelect = app.smartSelect.get("#bowler-stats-smart-select");
            bowlerSmartSelect.setValue(activeBowlerEntry.playerId);
        } else {
            $("#bowler-stats-select-element").hide();
            $("#bowler-stats-text-element").show();
            app.smartSelect.get("#bowler-stats-smart-select").setValue(0);
        }
        editBowlerStatsPopup.open(false);
    }

    function findEntryFor(playerId) {
        return scorecardData.ourInnings.batting.entries.filter(e => e.playerId == playerId)[0];
    }

    function findBowlingEntryFor(playerId) {
        return scorecardData.theirInnings.bowling.entries.filter(e => e.playerId == playerId)[0];
    }

    function findOppoEntryFor(playerName) {
        return scorecardData.theirInnings.batting.entries.filter(e => e.playerName == playerName)[0];
    }

    function findOppoBowlingEntryFor(playerName) {
        return scorecardData.ourInnings.bowling.entries.filter(e => e.playerName == playerName)[0];
    }

    function makeBatsmanRow(entry) {
        var row = $("<tr></tr>");
        row.addClass("batsman-row");

        var actionCell = $("<td></td>");
        actionCell.addClass("actions-cell");
        actionCell.addClass("scorecard-edit-item");
        if (entry.playerId != undefined && entry.playerId > 0) {
            actionCell.attr("playerId", entry.playerId);
        } else {
            actionCell.attr("playerName", entry.playerName);
        }
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

        addNumericCell(entry.runs, row);
        addNumericCell(entry.ballsFaced, row);
        addNumericCell(entry.fours, row, "medium-only");
        addNumericCell(entry.sixes, row, "medium-only");

        return row;
    }

    function makeBowlerRow(entry) {
        var row = $("<tr></tr>");
        row.addClass("bowler-row");

        var actionCell = $("<td></td>");
        actionCell.addClass("actions-cell");
        actionCell.addClass("bowling-scorecard-edit-item");
        if (entry.playerId != undefined && entry.playerId > 0) {
            actionCell.attr("playerId", entry.playerId);
        } else {
            actionCell.attr("playerName", entry.playerName);
        }
        var editIcon = $("<i>edit</i>");
        editIcon.addClass("material-icons md-18");
        actionCell.append(editIcon);

        row.append(actionCell);

        var playerCell = $("<td></td>");
        playerCell.addClass("label-cell");
        playerCell.text(entry.playerName);
        row.append(playerCell);

        addNumericCell(entry.overs, row);
        addNumericCell(entry.maidens, row);
        addNumericCell(entry.runs, row);
        addNumericCell(entry.wickets, row);

        return row;
    }

    function makeFoWRow(entry, isHome) {
        var row = $("<tr></tr>");
        row.addClass("fow-row");

        var actionCell = $("<td></td>");
        actionCell.addClass("actions-cell");
        actionCell.addClass("fow-scorecard-edit-item");
        actionCell.attr("isHome", isHome);
        actionCell.attr("wicket", entry.wicket);
        var editIcon = $("<i>edit</i>");
        editIcon.addClass("material-icons md-18");
        actionCell.append(editIcon);

        row.append(actionCell);

        var scoreCell = $("<td></td>");
        scoreCell.addClass("label-cell");
        scoreCell.text(entry.score + "-" + entry.wicket);
        row.append(scoreCell);

        addNumericCell(entry.overs, row);
        addNumericCell(entry.partnership, row);

        var playerCell = $("<td></td>");
        playerCell.addClass("label-cell");
        playerCell.addClass("medium-only");
        playerCell.text(entry.notOutPlayer.name + " (" + entry.notOutPlayer.score + ")");
        row.append(playerCell);

        var otherPlayerCell = $("<td></td>");
        otherPlayerCell.addClass("label-cell");
        otherPlayerCell.text(entry.outgoingPlayer.name + " (" + entry.outgoingPlayer.score + ")");
        row.append(otherPlayerCell);


        return row;
    }

    function formatDismisal(data) {
        var fielderName = data.fielderName;
        if (fielderName == "" || fielderName == undefined) {
            fielderName = "not recorded";
        }
        switch (data.modeOfDismissal) {
        case "LBW":
            return "lbw " + data.bowlerName;
        case "NotOut":
            return "not out";
        case "Bowled":
            return "b " + data.bowlerName;
        case "Caught":
            return "ct " + fielderName + " b " + data.bowlerName;
        case "RunOut":
            return "run out (" + fielderName + ")";
        case "Stumped":
            return "stumped";
        case "HitWicket":
            return "hit wicket";
        case "DidNotBat":
            return "did not bat";
        case "Retired":
            return "retired (out)";
        case "RetiredHurt":
            return "retired hurt (not out)";
        case "CaughtAndBowled":
            return "c&b " + data.bowlerName;
        default:
        }
    }

    function addNumericCell(cellValue, row, additionalClass) {
        var cell = $("<td></td>");
        cell.addClass("numeric-cell");
        if (additionalClass != undefined) {
            cell.addClass(additionalClass);
        }
        cell.text(cellValue);
        row.append(cell);
    }

    function renderExtras(data, element, extrasTotalElement, penaltyElement) {
        $(element + " .no-balls").text(data.noBalls);
        $(element + " .wides").text(data.wides);
        $(element + " .byes").text(data.byes);
        $(element + " .leg-byes").text(data.legByes);
        $(extrasTotalElement).text(getTotalExtras(data));
        $(penaltyElement).text(data.penalties);
    }

    function renderTotalAndWickets(data, totalElement, wicketsElementName, oversElementName) {
        $(totalElement).text(getTotalExtras(data.batting.extras) + getTotalRuns(data.batting.entries));
        $(wicketsElementName).text("for " + getWickets(data.batting.entries) + " wickets");
        $(oversElementName).text(data.inningsLength);
    }

    function getTotalExtras(data) {
        return 0 + data.noBalls + data.wides + data.byes + data.legByes + data.penalties;
    }

    function getTotalRuns(battingEntries) {
        var runs = 0;
        $.each(battingEntries,
            function(i, entry) {
                runs = runs + parseInt(entry.runs);
            });
        return runs;
    }

    function getWickets(battingEntries) {
        var outs = 0;
        $.each(battingEntries,
            function(i, entry) {
                if (entry.modeOfDismissal == "DidNotBat" ||
                    entry.modeOfDismissal == "NotOut" ||
                    entry.modeOfDismissal == "RetiredHurt") {
                    //
                } else {
                    outs = outs + 1;
                }
            });
        return outs;
    }

    var allPlayers = [];

    function loadAndProcessPlayers() {
        if (allPlayers.length != 0) {
            populatePlayerSelects(allPlayers);
        } else {
            var postData = { 'command': "listPlayers" };
            $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
                    JSON.stringify(postData),
                    function(data) {
                        //success
                        populatePlayerSelects(data);
                    },
                    "json")
                .fail(function(data) {
                    showToastCenter("Failed to load player list: " + data.responseText);
                });
        }

    }

    function populatePlayerSelects(data) {
        addPlayersToSelect(data, "#batter-select");
        addPlayersToSelect(data, "#bowler-select");
        addPlayersToSelect(data, "#fielder-select");
        addPlayersToSelect(data, "#bowler-stats-select");
    }

    function addPlayersToSelect(data, elementSelector) {
        var select = $(elementSelector);
        $.each(data,
            function(i, o) {
                select.append($("<option></option>")
                    .attr("value", o.playerId)
                    .attr("playerid", o.playerId)
                    .text(o.shortName));
                allPlayers.push(o);

            }
        );
    }



