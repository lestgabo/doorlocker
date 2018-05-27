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

/*
$(document).on('pagebeforeshow', '#index', function() {
	$(document).off('click', '#get-lock').on('click', '#get-lock', function() {
		$.ajax({
			url: '/lock'
		});
	});	
	$(document).off('click', '#get-unlock').on('click', '#get-unlock', function() {
		$.ajax({
			url: '/unlock'
		});
	});
});
*/
/*
$('#index').on('pagecreate', function(e) {
	$(document).on('click', '#get-lock', function(e) {
		if (e.handled !== true) {
			e.handled = true;
			$.ajax({
				url: '/lock'
			});
		}
	});	
	$(document).on('click', '#get-unlock', function(e) {
		if (e.handled !== true) {
			e.handled = true;
			$.ajax({
				url: '/unlock'
			});
		}
	});
});
*/

$(function() {
	$('#get-lock').off('click').on('click', function(event) {
		$.get("http://192.168.2.165:3000/lock", function(){
		});
	});	
	$('#get-unlock').off('click').on('click', function(event) {
		$.get("http://192.168.2.165:3000/unlock", function(){
		});	
	});
});




