<%@ Control Language="C#" AutoEventWireup="true" CodeFile="PictureCarousel.ascx.cs" Inherits="UserControls_PictureCarousel" %>
<%@ Import Namespace="System.ComponentModel" %>
<link rel="stylesheet" type="text/css" href="/Plugins/kenburns-carousel/css/style.css"/>
<div id="kenburns-slideshow"></div>

<script type="text/javascript" src="../Plugins/kenburns-carousel/js/kenburns.js"></script>
	
	<script type="text/javascript">
	
	$(document).ready(function() {
	    $('#kenburns-slideshow').Kenburns({
	    	images: [
	    		"Images/newCarousel/10553409_10153477334335190_8739570804864643916_n.jpg",
                "Images/newCarousel/IMG-20170429-WA0008.jpg",
	    		"Images/newCarousel/IMG-20170428-WA0039.jpg",
	    		"Images/newCarousel/IMG-20170428-WA0026.jpg",
	    		"Images/newCarousel/IMG-20170428-WA0004.jpg",
	    		"Images/newCarousel/IMG_20170507_204700.jpg",
	    		"Images/newCarousel/20170422_191723.jpg",
                "Images/newCarousel/IMG-20150621-WA0014.jpg",
	    		"Images/newCarousel/IMG-20150530-WA0007.jpg",
	    		"Images/newCarousel/IMG-20150704-WA0006.jpg",
	    		"Images/newCarousel/IMG-20150711-WA0000.jpg",
	    		"Images/newCarousel/IMG-20150426-WA0014.jpg",
	    		"Images/newCarousel/IMG-20150912-WA0003.jpg",
	    		"Images/newCarousel/IMG-20160204-WA0000.jpg",

	    	],
	    	scale:0.9,
	    	duration:8000,
	    	fadeSpeed:1200,
	    	ease3d:'cubic-bezier(0.445, 0.050, 0.550, 0.950)',

	    	onSlideComplete: function(){
	    		//$('#slide-title').html(titles[this.getSlideIndex()]);
	    	},
	    	onLoadingComplete: function(){
	    		//$('#status').html("Loading Complete");
	    	}

	    });
	});
    </script>
