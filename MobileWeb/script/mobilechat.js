var startDate = 0;
var previousLinkDate = 0;
var nextLinkDate = 0;



$('div[data-role*="page"]').live('pagebeforeshow', function (event, ui) {
    var page = $(this).attr("id");
    var startTime = 0;
    if (startDate != 0) {
        var mySplitResult = startDate.split("/")
        startTime = Date.UTC(mySplitResult[2], mySplitResult[1] - 1, mySplitResult[0], 0, 0, 0);
    }
    var now = new Date();
    var TodayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    if (startDate < TodayUtc && startDate != 0) {
        $("#hints").html("<li>You are looking at chat history - go back to today's chat to post</li>");
        $("#ChatInputArea").hide();
    }


    loadChat(startTime, startDate);
    

    if (page == 'mypage') {
        // do stuff
    }
});

function loadChat(startTime, startDate) {
    $.mobile.pageLoading();
    $.post("/ChatAjaxHandler.aspx", { timestamp: startTime, mobileView: true }, function (data) {
        if (data.length > 0) {
            $('.ChatContent').html(data);
            $(".ChatItem").addClass("ui-listview ui-listview-inset ui-corner-all ui-shadow");
            $.mobile.pageLoading(true);
            var now = new Date();
            var hours = now.getHours();
            var minutes = now.getMinutes();
            var seconds = now.getSeconds()
            if (nextLinkDate == 0) {
                //Tells you that it's the current day basically so we do things differently
                $(".footerMessage").html("Updated: " + hours + ":" + minutes + ":" + seconds);
                $(".next-button").hide();
                $(".post-button").show();
                $(".refresh-button").show();
                $(".home-button").hide();

            } else {
                //not the current day.
                $(".footerMessage").html("Chat on " + startDate);
                $(".next-button").attr("href", "javascript:changeDate('" + nextLinkDate + "', false)");
                $(".next-button").show();
                $(".post-button").hide();
                $(".refresh-button").hide();
                $(".home-button").show();


            }
            if (previousLinkDate != 0) {
                $(".previous-button").attr("href", "javascript:changeDate('" + previousLinkDate + "', true)");
            }
        }
    });
}

function post() {
    var name = $("#username").val();
    var comment = $("#comment").val();

    if (name == "" || comment == "") {
        $.mobile.changePage("chat.aspx", "slide", true, true);
        return true;
    }
    $.mobile.pageLoading();
    $.post("/ChatAjaxHandler.aspx", { action: 'post', name: name, comment: comment, imageUrl: "" }, 
        function (data) {
            $.mobile.changePage("chat.aspx", "slide", true, true);
        });
    };

function changeDate(date, isForward) {

    startDate = date;

    $.post("dateMover.aspx", { action: 'post', currentDate: startDate },
        function (data) {
            var response = jQuery.parseJSON(data);
            previousLinkDate = response.previousDate;
            nextLinkDate = response.nextDate;
            $.mobile.changePage("chat.aspx?"+date.replace(/\//g, ""), "slide", isForward, false);
        });

    }

function home() {
    startDate = 0;
    previousLinkDate = 0;
    nextLinkDate = 0;
    $.mobile.changePage("chat.aspx", "slideup");
}
