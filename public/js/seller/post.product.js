$('#input-drop1').fileinput({
	browseClass: 'btn btn-primary btn-block',
	showCaption: false,
	showRemove: false,
	showUpload: false
});

$('#input-drop2').fileinput({
	browseClass: 'btn btn-primary btn-block',
	showCaption: false,
	showRemove: false,
	showUpload: false
});

$('#datetimepicker').datetimepicker({
	format: 'YYYY-MM-DDTHH:mm:ssZ'
});

// function getExpDate() {
// 	$('#input_expdate').val(new Date(`${$('#datetimepicker')
//     .data('DateTimePicker')
//     .date()}`)

// 	);
// }

// getExpDate();
