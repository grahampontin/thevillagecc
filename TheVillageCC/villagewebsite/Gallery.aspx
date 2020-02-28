<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Gallery.aspx.cs" Inherits="Gallery" %>
<%@ Register TagPrefix="CC" TagName="Header" Src="~/UserControls/Head.ascx" %>
<%@ Register TagPrefix="CC" TagName="Footer" Src="~/UserControls/Footer.ascx" %>
<%@ Register TagPrefix="CC" TagName="Styles" Src="~/UserControls/Styles.ascx" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html lang="en">
<head runat="server">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

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
            <h3>The Village CC &raquo; Gallery Beta 1 &raquo; The Village vs <asp:Literal ID=oppo runat=server></asp:Literal> (<asp:Literal ID=matchdate runat=server></asp:Literal>)  </h3>
            <div id="gallery" class="content">

                <div id="controls" class="controls"></div>
                <div id="loading" class="loader">></div>
                <div id="slideshow" class="slideshow"></div>
                <div id="caption" class="embox"></div>
            </div>
            <div id="thumbs" class="navigation">
                <ul class="thumbs noscript">
                    <asp:ListView ID="Pictures" runat="server" 
                        onitemdatabound="Pictures_ItemDataBound">
                        <LayoutTemplate>
                            <asp:PlaceHolder runat="server" ID="itemPlaceholder"></asp:PlaceHolder>
                        </LayoutTemplate>

                       <ItemTemplate>
                          <li>
                                <a id=ThumbLink runat=server class="thumb" href="" title="">
                                    <img id=ImageTag runat=server src="" alt="" />
                                </a>
                                <div class="caption">
                                    <asp:Literal ID=ImageTitle runat=server></asp:Literal><br />
                                    by <asp:Literal ID=ImageAuthor runat=server></asp:Literal>
                                </div>
                            </li>
                          
                          
                          
                       </ItemTemplate>
                    </asp:ListView>
                    
                    
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

