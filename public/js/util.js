function countDownTimer(expriry_date, id) {
	let current_date = new Date().getTime();

	let ex_date = new Date(expriry_date);

	let days, hours, minutes, seconds; // variables for time units

	let countdown = document.getElementById(id); // get tag element

	let seconds_left =
		(ex_date.getTime() +
			ex_date.getTimezoneOffset() * 60 * 1000 -
			current_date) /
		1000;
	// 	Het han
	console.log('Giay con lai : ' + seconds_left);
	if (seconds_left < 0) {
		console.log('Het han');
		countdown.innerHTML = `<h3>		
		<span class="label label-success">FINISHED</span>
	</h3>`;

		return;
	}

	let a = setInterval(function() {
		getCountdown(ex_date);
	}, 1000);

	function getCountdown(ex_date) {
		current_date = new Date().getTime();

		seconds_left =
			(ex_date.getTime() +
				ex_date.getTimezoneOffset() * 60 * 1000 -
				current_date) /
			1000;

		days = pad(parseInt(seconds_left / 86400));
		seconds_left = seconds_left % 86400;

		hours = pad(parseInt(seconds_left / 3600));
		seconds_left = seconds_left % 3600;

		minutes = pad(parseInt(seconds_left / 60));
		seconds = pad(parseInt(seconds_left % 60));

		// format countdown string + set tag value
		countdown.innerHTML = `<li><span>${days} D</span></li>
                <li><span>${hours} H</span></li>
                <li><span>${minutes} M</span></li>
                <li><span>${seconds} S</span></li>`;
	}

	function pad(n) {
		return (n < 10 ? '0' : '') + n;
	}
}

//
function transferDateFormat(start_date, id) {
	var time = document.getElementById(id); // get tag element
	getTime(start_date);

	function getTime(start_date) {
		// find the amount of "seconds" between now and target
		var Day = new Date(start_date).getDate();
		var Month = new Date(start_date).getMonth() + 1;
		var Year = new Date(start_date).getYear() + 1900;
		// format countdown string + set tag value
		time.innerHTML = `${Day}/${Month}/${Year}`;
	}
}

function transferDateFormat2(start_date, id) {
	var time = document.getElementById('timee' + id); // get tag element
	getTime(start_date);

	function getTime(start_date) {
		// find the amount of "seconds" between now and target
		var Day = new Date(start_date).getDate();
		var Month = new Date(start_date).getMonth() + 1;
		var Year = new Date(start_date).getYear() + 1900;
		// format countdown string + set tag value
		time.innerText = `${Day}/${Month}/${Year}`;
	}
}

function transferDateFormat3(start_date, id) {
	var time = document.getElementById('timeee' + id); // get tag element
	getTime(start_date);

	function getTime(start_date) {
		// find the amount of "seconds" between now and target
		var Day = new Date(start_date).getDate();
		var Month = new Date(start_date).getMonth() + 1;
		var Year = new Date(start_date).getYear() + 1900;
		// format countdown string + set tag value
		time.innerText = `${Day}/${Month}/${Year}`;
	}
}

// HAM TINH THOI GIAN CHO PRODUCTDETAIL

function countDownTimer1(expriry_date, id) {
	var days, hours, minutes, seconds; // variables for time units

	let current_date = new Date().getTime();
	var countdown = document.getElementById('time' + id); // get tag element
	console.log('tag :' + countdown);
	var buttonbid = document.getElementById('buttonbid');
	console.log('tag :' + buttonbid);
	let ex_date = new Date(expriry_date);
	let check = 1;

	let seconds_left =
		(ex_date.getTime() +
			ex_date.getTimezoneOffset() * 60 * 1000 -
			current_date) /
		1000;

	// 	Het han
	console.log('Giay con lai : ' + seconds_left);
	if (seconds_left < 0) {
		check = 0;
		console.log('Het han');
		countdown.innerHTML = `<h3>		
            <span class="label label-success">FINISHED</span>
        </h3>`;
		buttonbid.innerHTML = '';
		return;
	}

	let a = setInterval(function() {
		getCountdown(ex_date);
	}, 1000);

	function getCountdown(expriry_date) {
		// find the amount of "seconds" between now and target
		const check2 = 1;
		var current_date = new Date().getTime();
		var seconds_left =
			(new Date(expriry_date).getTime() - current_date) / 1000;

		days = pad(parseInt(seconds_left / 86400));
		seconds_left = seconds_left % 86400;

		hours = pad(parseInt(seconds_left / 3600));
		seconds_left = seconds_left % 3600;

		minutes = pad(parseInt(seconds_left / 60));
		seconds = pad(parseInt(seconds_left % 60));

		// format countdown string + set tag value
		countdown.innerHTML = `<div>
                    <span class="num">${days}</span>
                    <small>Days</small>
                </div>
                <div>
                    <span class="num">${hours}</span>
                    <small>Hours</small>
                </div>
                <div>
                    <span class="num">${minutes}</span>
                    <small>Min</small>
                </div>
                <div>
                    <span class="num">${seconds}</span>
                    <small>Sec</small>
                </div>`;
	}

	function pad(n) {
		return (n < 10 ? '0' : '') + n;
	}
}

// Thêm/Xóa thích sản phẩm trong Watch List

function doSomething(isBidder, isSeller, isOwner) {
	if (isBidder == true) {
		return;
	}
	if (isOwner == true) {
		document.getElementById(
			'buttonbid'
		).innerHTML = `<div class="alert alert-success" role="alert">Bạn là owner của product này</div>`;
		return;
	}
	if (isSeller == true) {
		document.getElementById(
			'buttonbid'
		).innerHTML = `<div class="alert alert-success" role="alert">Bạn là seller</div>`;
		return;
	}

	document.getElementById(
		'buttonbid'
	).innerHTML = `<div class="alert alert-success" role="alert">Hãy đăng nhập với tư cách Bidder để thực hiện chức năng này</div>`;
}
