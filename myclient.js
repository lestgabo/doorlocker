// pagecreate added to stop mobile jQuery firing multiple times
// https://www.gajotres.net/prevent-jquery-multiple-event-triggering/
/*
$(function() {
	$('#get-lock').on('click', function() {
		$.ajax({
			url: '/lock'
		});
	});

	$('#get-unlock').on('click', function() {
		$.ajax({
			url: '/unlock'
		});
	});
});

*/
$(document).on('pagebeforeshow', '#index', function() {
	$(document).off('click', '#get-lock').on('click', '#get-lock', function(e) {
		$.ajax({
			url: '/lock'
		});
	});	
	$(document).off('click', '#get-unlock').on('click', '#get-unlock', function(e) {
		$.ajax({
			url: '/unlock'
		});
	});
});