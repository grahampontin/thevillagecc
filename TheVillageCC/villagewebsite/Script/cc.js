$(document).ready(
		function() {
		    //Bind News Ticker
		    if ($("#news").length != 0) {
		        var options = {
		            newsList: "#news",
		            startDelay: 10,
		            placeHolder1: " "
		        }
		        $().newsTicker(options);
		    }
		    //Bind Picture Carousel
		    $('#rotateThis').innerfade({
		        animationtype: 'fade',
		        speed: 1000,
		        timeout: 5000,
		        type: 'sequence',
		        containerheight: '100px'
		    });

		    //Bind labels to input boxes
		    $("input").labelify();
		    var datePicker = $(".datePicker");
            if (datePicker != null) {
                datePicker.datetimepicker();
            }
		    
		}
	);


