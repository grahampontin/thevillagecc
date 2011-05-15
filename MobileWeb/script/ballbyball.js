$(document).ready(
		function () {
		    //Bind labels to input boxes
		    $("input").labelify();
		    $(".datePicker").datepicker({ dateFormat: 'dd MM yy' });
		    $("button").button();

		}
	);