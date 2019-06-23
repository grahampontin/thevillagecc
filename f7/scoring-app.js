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
    $("#match-conditions-done").parent().click(function() {
        if (selectedPlayers === null) {
            showToastCenter("There don't seem to be any players which is weird. Go back to select the team again.");
            return;
        }
        //TODO: MAP VARIABLES
        var postData = { 'command': "startMatch", 'matchId': matchId, 'payload': 
            new MatchConditions(getPlayerIds(players), wicketKeeperId, captainId, weWonToss, tossWinnerBatted, wasDeclaration, numberOfOvers)
        };
        $.post('./CommandHandler.ashx', JSON.stringify(postData), function () {
                //success
                if ((weWonToss && tossWinnerBatted) || (!weWonToss && !tossWinnerBatted)) {
                    innings = "Batting";
                    //TODO: F7 Page Navigation?
                    $("body").pagecontainer("change", "NewOver.aspx", { transition: "slide" });
                } else {
                    innings = "Bowling";
                    $("body").pagecontainer("change", "OppositionInnings.aspx", { transition: "slide" });
                }
            
            }, 'json')
            .fail(function (data) {
                showToastCenter(data.responseText);
            });
    });
    

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
        $("#match-conditions-done").parent().show();
        $("#match-conditions-incomplete").parent().hide();
    }
    else
    {
        $("#match-conditions-done").parent().hide();
        $("#match-conditions-incomplete").parent().show();
    }
}
var toast;
function isMatchConditionsComplete() {
    if ($("#captainSelect option:selected").attr("playerId") === undefined) {
        toast = showToastBottom(
            "Every team needs a leader, a man to look up to, someone to stand up and be counted. At the very least someone should set the field don't you think?");
        return false;
    } else {
        toast.close();
    }
    if ($("#wicketKeeperSelect option:selected").attr("playerId") === undefined) {
        toast = showToastBottom(
            "Not having a wicket keeper seems pretty village, even for us. Did we forget the kit again? Go borrow some.");
        return false;
    } else {
        toast.close();
    }
    if ($("#matchFormatSelect option:selected").val() === "") {
        toast = showToastBottom(
            "What kind of a game is this? It's not a test match, etc.");
        return false;
    } else {
        toast.close();
    }
    if ($("#matchFormatSelect option:selected").val() === "Limited Overs") {
        var numberOfOvers = $("#numberOfOvers").val();
        if (!isNormalInteger(numberOfOvers)) {
            toast = showToastBottom(
                "If we're playing a limited overs game it would be tremendous to know how many overs each team is allowed. It should be a whole number, if that wasn't obvious.");
            return false;
        } else {
            toast.close();
        }
    }
    if ($("#tossWinnerSelect option:selected").val() === "") {
        toast = showToastBottom(
            "Who won the toss? Is it time for the Official Tosser clause to be enacted?");
        return false;
    } else {
        toast.close();
    }
    if ($("#tossWinnerBatBowlSelect option:selected").val() === "") {
        toast = showToastBottom(
            "Always bat first. Unless it looks like a bowling day, then think about bowling first, but bat first anyway.");
        return false;
    } else {
        toast.close();
    }
    
    return true;
}

function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
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
}

function showToastBottom(str) {
    var toastBottom = app.toast.create({
        text: str,
        closeButton: true
    });
    toastBottom.open();
    return toastBottom;
}
function showToastCenter(str) {
    var toastIcon = app.toast.create({
        icon: '<i class="material-icons">error</i>',
        text: str,
        position: 'center',
        closeButton: true
    });
    toastIcon.open();
    return toastIcon;
}

