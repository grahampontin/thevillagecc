﻿
function showPreloader(container) {
    container.empty();
    var preloadingContainer = $("<div></div>");
    preloadingContainer.addClass("preloader");
    preloadingContainer.html("<div class=\"text-center\">\n" +
        "  <div class=\"spinner-border\" role=\"status\">\n" +
        "    <span class=\"visually-hidden\">Loading...</span>\n" +
        "  </div>\n" +
        "</div>");
    container.append(preloadingContainer);
}

function hidePreloader() {
    $(".preloader").remove();
}


function showOnlyOnLargerScreens(dismissalPart1) {
    dismissalPart1.addClass("d-none");
    dismissalPart1.addClass("d-md-table-cell");
}