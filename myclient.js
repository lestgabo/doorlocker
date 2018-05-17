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