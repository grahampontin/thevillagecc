//First time initialization - these will be called ONCE when the page is loaded into the DOM. Bind event etc here.
$(document).on('pagecreate', '#main' ,function(){
    bindCoreHandlers();
});
$(document).on('pagecreate', '#wicket' ,function(){
    bindWicketPageHandlers();
});
$(document).on('pagecreate', '#endofover' ,function(){
    bindEndOfOverPageHandlers();
});
$(document).on('pagecreate', '#endofinnings' ,function(){
    bindEndOfInningsPageHandlers();
});
$(document).on('pagecreate', '#oppositioninnings' ,function(){
    bindOppositionInningsPageHandlers();
});
$(document).on('pagecreate', '#selectteam' ,function(){
    bindSelectTeamPageHandlers();
});
$(document).on('pagecreate', '#matchconditions' ,function(){
    bindMatchConditionsPageHandlers();
});
$(document).on('pagecreate', '#newover' ,function(){
    bindNewOverPageHandlers();
});

//On page show - these will be called just before the page is displayed. Setup/clean UI elements here. 
$(document).on('pagecontainershow',function () {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
    if (activePage === "") {
        return;
    }
    if (activePage !== "selectMatch") {
        assertMatchIdIsDefined();
    }
    hideWarning();
    hideInfo();
    switch (activePage) {
        case "main":
            initializeCoreView();
            break;
        case "wicket":
            refreshWicketPageView();
            break;
        case "endofover":
            refreshEndOfOverPageView();
            break;
        case "matchconditions":
            initializeMatchConditionsView();
            break;
        case "newover":
            refreshNewOverPageView();
            break;
        case "endofinnings":
            refreshEndOfInningsPageView();
            break;
        default:
    }

});


//        switch (toPage) {
//            case "HelpMenu.aspx":
//                initialiseHelp();
//                break;
