var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'VCC Online',
    // App id
    id: 'com.villagecc.mobile',
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
            path: '/wicket/',
            url: 'wicket.html'
        },
        {
            name: 'oppositionScoring',
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
        },
        {
            name: 'newOver',
            path: '/newOver/',
            url: 'newOver.html'
        },
        {
            name: 'endOver',
            path: '/endOver/',
            url: 'endOver.html'
        },
        {
            name: 'endMatch',
            path: '/endMatch/',
            url: 'endMatch.html'
        },
        {
            name: 'endInnings',
            path: '/endInnings/:type',
            url: 'endInnings.html'
        },
        {
            name: 'index',
            path: '/index/',
            url: 'index.html'
        },
        {
            name: 'chooseMatch',
            path: '/chooseMatch/',
            url: 'chooseMatch.html'
        },
        {
            name: 'debug',
            path: '/debug/',
            url: 'debug.html'
        },
        {
            name: 'scorecards',
            path: '/scorecards/',
            url: 'scorecards.html'
        },
        {
            name: 'editScorecard',
            path: '/editScorecard/',
            url: 'editScorecard.html'
        },
        {
            name: 'matchReport',
            path: '/matchReport/',
            url: 'matchReport.html'
        },
        {
            name: 'editBall',
            path: '/editBall/',
            popup: {
                url: 'editBall.html'
            }
        }

    ],
    on: {
        smartSelectBeforeOpen: function() {
            if (toast != undefined && toast != null) {
                toast.close();
            }
        },
        dialogOpen: function() {
            if (toast != undefined && toast != null) {
                toast.close();
            }
        },
    }
    // ... other parameters
});

app.utils.colorThemeCSSProperties("#17801e");


var mainView = app.views.create('.view-main');
//First page setup


//End

$$(document).on('page:init', function (e) {
    //GENERIC HANDLERS APPLICABLE TO ALL PAGES
    $('.back-button').click(function() {
        if (toast != undefined && toast != null) {
            toast.close();
        }
        app.views.current.router.back();
    });
});






var toast;










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
        closeButton: true,
        closeTimeout: 10000
    });
    toastIcon.open();
    return toastIcon;
}




function initializeMatchStateAndThen(force, callback)
{
    if (matchId === undefined || matchId === null) {
        app.views.current.router.navigate("/index/");
    }
    if (matchState !== undefined && !force) {
        callback();
        return;
    }
    loadMatchState(matchId, callback);
}

function loadMatchState(matchId, callback) {
    var postData = { 'command': "matchState", 'matchId': matchId };
    $.post("/MobileWeb/ballbyball/CommandHandler.ashx",
            JSON.stringify(postData),
            function(data) {
                //success
                matchState = matchStateFromData(data);
                callback();
            },
            "json")
        .fail(function(data) {
            showToastCenter(data.responseText);
        });
}

function sendBallByBallCommand(postData, successCallback = null) {
    app.preloader.show();
    $.post('/MobileWeb/ballbyball/CommandHandler.ashx', JSON.stringify(postData), function (data) {
            //success
            matchState = matchStateFromData(data);
            app.preloader.hide();
            var pageName;
            switch (data.NextState) {
                case "BattingOver":
                    pageName = "newOver";
                    break;
                case "BowlingOver":
                    pageName = "oppositionScoring";
                    break;
                case "EndOfBattingInnings":
                    pageName = "endInnings/batting";
                    break;
                case "EndOfBowlingInnings":
                    pageName = "endInnings/bowling";
                    break;
                case "EndOfMatch":
                    pageName = "endMatch";
                    break;
                case "SelectTeam":
                    pageName = "selectTeam";
                    break;
                case "MatchConditions":
                    pageName = "matchConditions";
                    break;
                default:
                    pageName = "index";
            }
            if (successCallback != null) {
                successCallback();
            }
            app.views.current.router.navigate("/"+pageName+"/");
        }, 'json')
        .fail(function (data) {
            app.preloader.hide();
            showToastCenter(data.responseText);
        });
}

