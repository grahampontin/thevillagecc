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
            showToastCenter(data.responseText);
        });
}

