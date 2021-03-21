$$(document).on('page:init', '.page[data-name="endOver"]', function (e) {
    
    //Bind handlers here
    $("#end-over-done").click(function() {
        var matchId = matchState.MatchId;
        var textEditor = app.textEditor.get('.chat-text-editor');

        matchState.Over.Commentary = textEditor.value;
        var postData = { 'command': "submitOver", 'matchId': matchId, 'payload': matchState };
        //Post to server and handle response.
        sendBallByBallCommand(postData);
    });
    
    //once bound...
    initializeMatchStateAndThen(false, function() {
        renderBallsList('#balls ul');

    });
});

/*
*       <div class="item-media"><i class="icon icon-f7"></i></div>
        <div class="item-inner">
          <div class="item-title">
            <div class="item-header">Name</div>
            | John Doe
          </div>
          <div class="item-after">Edit</div>
        </div>
 */

function renderBallsList(elementSelector) {
    var ballCounter = 1;
    $.each(matchState.Over.balls,
        function(i, ball) {
            var listItem = $("<li></li>");
            var itemContent = $("<div></div>");
            itemContent.addClass("item-content");

            var ballNumber = $("<div></div>");
            ballNumber.addClass("ball-number");
            ballNumber.addClass("item-media");
            var ballNumberBadge = $("<span></span>");
            ballNumberBadge.addClass("badge");
            ballNumberBadge.text(matchState.LastCompletedOver+1+"."+ballCounter);
            ballNumber.append(ballNumberBadge);
            
            var ballDescriptionInner =  $("<div></div>");
            ballDescriptionInner.addClass("ball-description");
            ballDescriptionInner.addClass("item-inner");

            var ballDescriptionTitle = $("<div></div>");
            ballDescriptionTitle.addClass("item-title");
            
            var ballDescriptionTitleHeader = $("<div></div>");
            ballDescriptionTitleHeader.addClass("item-header");
            ballDescriptionTitleHeader.text(ball.bowler + " to " + ball.batsmanName);
            ballDescriptionTitle.append(ballDescriptionTitleHeader);
            ballDescriptionTitle.append(ball.getBallDescription());

            ballDescriptionInner.append(ballDescriptionTitle);


            var ballEditAfter = $("<div></div>");
            ballEditAfter.addClass("item-after");

            var ballEditIcon = $("<i></i>");
            ballEditIcon.addClass("icon");
            ballEditIcon.addClass("material-icons");
            ballEditIcon.text("edit");

            ballEditAfter.append(ballEditIcon);

            itemContent.append(ballNumber);
            ballDescriptionInner.append(ballEditAfter);
            itemContent.append(ballDescriptionInner);

            listItem.append(itemContent);

            $(elementSelector).append(listItem);
            if (ball.isLegalDelivery()) {
                ballCounter++;
            }
        });
}
