var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
        swipe: 'left',
    },
    // Add default routes
    routes: [
        {
            path: '/scoring/',
            url: 'scoring.html'
        },
        {
            path: '/oppositionScoring/',
            url: 'oppositionScoring.html'
        },
        {
            name: 'selectTeam',
            path: '/selectTeam/',
            url: 'selectTeam.html'
        },
        {
            name: 'matchConditions',
            path: '/matchConditions/',
            url: 'matchConditions.html'
        }
    ]
    // ... other parameters
});

var mainView = app.views.create('.view-main');
listMatches();

$$(document).on('page:init', function (e) {
    //GENERIC HANDLERS APPLICABLE TO ALL PAGES
    $('.back-button').click(function() {
        app.views.current.router.back();
    });
});

var selectedPlayers;
$$(document).on('page:init', '.page[data-name="selectTeam"]', function (e) {
    $("#selected-player-done").parent().hide();
    listAllPlayers();
    $("#selected-player-done").parent().click(function() {
        selectedPlayers = $('input[type="checkbox"]').map(function () {
            var playerId = $(this).val();
            var playerName = $(this).attr("playerName");
            if ($(this).is(':checked'))
                return new PlayerStub(playerId, playerName);

        });
    });
});

$$(document).on('page:init', '.page[data-name="matchConditions"]', function (e) {
    $("#numberOfOversInput").hide();
    enableDisableConfirmButton();
    $.each(selectedPlayers,
        function(i, o) {
            $("[name='captainSelect']").append(
                $("<option></option>")
                .attr("value", o.playerId)
                .attr("playerId", o.playerId)
                .text(o.playerName));
            $("[name='wicketKeeperSelect']").append(
                $("<option></option>")
                .attr("value", o.playerId)
                .attr("playerId", o.playerId)
                .text(o.playerName));
        });
    $("[name='matchFormatSelect']").change(function() {
        if ($("[name='matchFormatSelect'] :selected").text() === "Limited Overs") {
            $("#numberOfOversInput").show();
        } else {
            $("#numberOfOversInput").hide();
        }
    });
    $(".form-validation").change(function() {
        enableDisableConfirmButton();
    });
});

function enableDisableConfirmButton() {
    if (isMatchConditionsComplete()) {
        $("#match-conditions-done").show();
        $("#match-conditions-incomplete").hide();
    }
    else
    {
        $("#match-conditions-done").hide();
        $("#match-conditions-incomplete").show();
    }
}

function isMatchConditionsComplete() {
    if ($("#captainSelect option:selected").attr("playerId") === undefined) {
        return false;
    }
    if ($("#wicketKeeperSelect option:selected").attr("playerId") === undefined) {
        return false;
    }
    if ($("#tossWinnerSelect option:selected").val() === undefined) {
        return false;
    }
    if ($("#tossWinnerBatBowlSelect option:selected").val() === undefined) {
        return false;
    }
    if ($("#matchFormatSelect option:selected").val() === undefined) {
        return false;
    }
    if ($("#matchFormatSelect option:selected").val() === "Limited Overs") {
        if (parseInt($("#numberOfOvers").val()) < 0) {
            return false;
        }
    }

    return true;
}




function listMatches() {
    app.preloader.show();
    var postData = { 'command': "listMatches" };
    $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
            JSON.stringify(postData),
            function(data) {
                app.preloader.hide();
                //success
                $.each(data,
                    function(i, o) {
                        if (o.batOrBowl === "") {
                            $('#upcoming-matches ul').append('<li><a href="/selectTeam/" class="item-link item-content"><div class="item-inner"><div class="item-title">'+o.opponent+' ('+o.dateString+')</div><div class="item-after"><span class="badge bg-color-green">New</span></div></div></a></li>');
                        } else {
                            var page = o.batOrBowl === "Bat" ? "scoring" : "oppositionScoring";
                            $('#in-progress-matches ul').append('<li><a href="/'+page+'/" class="item-link item-content"><div class="item-inner"><div class="item-title">'+o.opponent+' ('+o.overs+' ovs)</div><div class="item-after"><span class="badge bg-color-green">'+o.batOrBowl+'</span></div></div></a></li>');
                        }
                        
                    });
            },
            "json")
        .fail(function(data) {
            app.preloader.hide();
            showError(data.responseText);
        });
};

var selectedPlayerCount = 0;
function listAllPlayers() {
    app.preloader.show();
    var postData = { 'command': "listPlayers" };
    $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
            JSON.stringify(postData),
            function(data) {
                app.preloader.hide();
                //success
                $.each(data,
                    function(i, o) {
                        //add player to list view
                        $('#players ul').append('<li>' +
                            '                       <label class="item-checkbox item-content">' +
                                                            '<input type="checkbox" name="player-checkbox" value="'+o.playerId+'" class="player-checkbox" playerName="'+o.name+'"/>' +
                                                            '<i class="icon icon-checkbox"></i><div class="item-inner">' +
                                                            '<div class="item-title">'+o.name+' ('+o.matches+')</div></div></label></li>');
                        $(".player-checkbox").change(function() {
                            selectedPlayerCount = 0;
                            $.each($(".player-checkbox"),
                                function(i, o) {
                                    if (o.checked) {
                                        selectedPlayerCount ++;
                                    }
                                });
                            if (selectedPlayerCount !== 11) {
                                $("#selected-player-count").parent().show();
                                $("#selected-player-done").parent().hide();
                                $("#selected-player-count span").text(selectedPlayerCount);
                            } else {
                                $("#selected-player-count").parent().hide();
                                $("#selected-player-done").parent().show();
                            }
                            
                        });
                        
                    });
            },
            "json")
        .fail(function(data) {
            app.preloader.hide();
            showError(data.responseText);
        });
};

