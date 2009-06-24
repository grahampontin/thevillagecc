<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Gallery.aspx.cs" Inherits="Gallery" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>The Village Cricket Club Online | Gallery</title>
    <CC:Styles runat=server ID=styles />    
    <link rel="stylesheet" href="CSS/gallery.css" type="text/css" />
    <script type="text/javascript" src="Script/jquery.galleriffic.min.js"></script>
    
</head>
<body>
        <form id="form1" runat="server">
    <div id="pageContainer">
        <!-- Head -->
        <CC:Header ID="Header1" runat=server />
        <!-- End Head -->
        <div class=clearer></div>
        <div id="mainContent">
            <h1>The Village CC &raquo; Gallery Beta 1</h1>
            <div id="gallery" class="content">

                <div id="controls" class="controls"></div>
                <div id="loading" class="loader">></div>
                <div id="slideshow" class="slideshow"></div>
                <div id="caption" class="embox"></div>
            </div>
            <div id="thumbs" class="navigation">
                <ul class="thumbs noscript">
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                        <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                        <li>
                        <a class="thumb" href="match_reports/images/113/Keevil.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    <li>
                        <a class="thumb" href="match_reports/images/113/Keevil2.jpg" title="your image title">
                            <img src="Handlers/ImageThumbnail.ashx?p=/match_reports/images/113/Keevil2.jpg" alt="your image title again for graceful degradation" />
                        </a>
                        <div class="caption">
                            (Any html can go here)
                        </div>
                    </li>
                    </li>
                    </li>
                </ul>

            </div>

        </div>
        <!-- Footer -->
        <CC:Footer ID="Footer1" runat="server" />
        <!-- ENd Footer -->
    </div>
        </form>
        <script language="javascript" type="text/javascript">
        // We only want these styles applied when javascript is enabled
			$('div.navigation').css({'width' : '250px', 'float' : 'left', 'margin' : '10px'});
			$('div.content').css('display', 'block');
 
			// Initially set opacity on thumbs and add
			// additional styling for hover effect on thumbs
			var onMouseOutOpacity = 0.67;
			$('#thumbs ul.thumbs li').css('opacity', onMouseOutOpacity)
				.hover(
					function () {
						$(this).not('.selected').fadeTo('fast', 1.0);
					}, 
					function () {
						$(this).not('.selected').fadeTo('fast', onMouseOutOpacity);
					}
				);

        $(document).ready(function() {
    var galleryAdv = $('#gallery').galleriffic('#thumbs', {
					delay:                  4000,
					numThumbs:              15,
					preloadAhead:           10,
					enableTopPager:         true,
					enableBottomPager:      true,
					imageContainerSel:      '#slideshow',
					controlsContainerSel:   '#controls',
					captionContainerSel:    '#caption',
					loadingContainerSel:    '#loading',
					renderSSControls:       true,
					renderNavControls:      true,
					playLinkText:           'Play Slideshow',
					pauseLinkText:          'Pause Slideshow',
					prevLinkText:           '&lsaquo; Previous Photo',
					nextLinkText:           'Next Photo &rsaquo;',
					nextPageLinkText:       'Next &rsaquo;',
					prevPageLinkText:       '&lsaquo; Prev',
					enableHistory:          true,
					autoStart:              false,
					onChange:               function(prevIndex, nextIndex) {
						$('#thumbs ul.thumbs').children()
							.eq(prevIndex).fadeTo('fast', onMouseOutOpacity).end()
							.eq(nextIndex).fadeTo('fast', 1.0);
					},
					onTransitionOut:        function(callback) {
						$('#caption').fadeOut('fast');
						$('#slideshow').fadeOut('fast', callback);
					},
					onTransitionIn:         function() {
						$('#slideshow, #caption').fadeIn('fast');
					},
					onPageTransitionOut:    function(callback) {
						$('#thumbs ul.thumbs').fadeOut('fast', callback);
					},
					onPageTransitionIn:     function() {
						$('#thumbs ul.thumbs').fadeIn('fast');
					}
				});

});

    </script>
        </body>
</html>

