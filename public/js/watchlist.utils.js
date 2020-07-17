function actOnPro(event) {
	let proId = event.target.dataset.proId;

	console.log(event.target.dataset.islike);

	let islike = event.target.dataset.islike;

	// axios.post('/bidders/watchlist/' + proId);

	$.ajax({
		url: '/bidders/watchlist/' + proId,
		method: 'POST',
		cache: false,
		success: function(data) {
			// data is the object that you send form the server by
			// res.jsonp();
			// here data = {success : true}
			// validate it
			if (data['success']) {
				if (data['type'] === 1) {
					bootbox.alert({
						message: 'Đã thêm sản phẩm vào Watch List',
						size: 'small'
					});

					console.log('vao set css');
					$(`[data-pro-id=${proId}]`).css({
						color: '#f8694a',
						'-webkit-box-shadow':
							'0px 0px 0px 1px #f8694a inset, 0px 0px 0px 0px #f8694a',
						'box-shadow':
							'0px 0px 0px 1px #f8694a inset, 0px 0px 0px 0px #f8694a'
					});
					event.target.dataset.islike = 'true';
				} else {
					bootbox.alert({
						message: 'Đã xóa sản phẩm khỏi Watch List',
						size: 'small'
					});
					console.log('vao xóa css');
					$(`[data-pro-id=${proId}]`).css({
						color: '#30323a',
						'background-color': '#fff',
						'-webkit-box-shadow':
							'0px 0px 0px 1px #dadada inset 0px 0px 0px 6px transparent',
						'box-shadow':
							'0px 0px 0px 1px #dadada inset, 0px 0px 0px 6px transparent'
					});
					event.target.dataset.islike = 'false';
				}

				console.log('Vao ham voi proid : ' + proId);
			} else {
				// bootbox.alert({
				// 	message:
				// 		'Chỉ bidder mới có thể thực hiện quyền này. Vui lòng thử lại với quyền bidder !!!',
				// 	size: 'small'
				// });
				alertify.alert(
					'Có biến',
					'Chỉ có bidder mới có quyền này.!',
					function() {
						alertify.success('Hãy đăng nhập với quyền bidder!');
					}
				);
			}
		},
		error: function() {
			// some error handling part
			alert('Oops! Something went wrong.');
		}
	});
}
