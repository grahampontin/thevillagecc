$$(document).on('page:init', '.page[data-name="editScorecard"]', function (e) {
    if (e.detail.position != "next") {
        return;
    }
    app.toolbar.hide("#opposition-tabbar", false);

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
    //Bind handlers here

    //once bound...

});

