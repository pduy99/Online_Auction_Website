(function($) {
	'use strict';

	// NAVIGATION
	var responsiveNav = $('#responsive-nav'),
		catToggle = $('#responsive-nav .category-nav .category-header'),
		catList = $('#responsive-nav .category-nav .category-list'),
		menuToggle = $('#responsive-nav .menu-nav .menu-header'),
		menuList = $('#responsive-nav .menu-nav .menu-list');

	catToggle.on('click', function() {
		menuList.removeClass('open');
		catList.toggleClass('open');
	});

	menuToggle.on('click', function() {
		catList.removeClass('open');
		menuList.toggleClass('open');
	});

	$(document).click(function(event) {
		if (!$(event.target).closest(responsiveNav).length) {
			if (responsiveNav.hasClass('open')) {
				responsiveNav.removeClass('open');
				$('#navigation').removeClass('shadow');
			} else {
				if ($(event.target).closest('.nav-toggle > button').length) {
					if (
						!menuList.hasClass('open') &&
						!catList.hasClass('open')
					) {
						menuList.addClass('open');
					}
					$('#navigation').addClass('shadow');
					responsiveNav.addClass('open');
				}
			}
		}
	});

	// HOME SLICK
	$('#home-slick').slick({
		autoplay: true,
		infinite: true,
		speed: 300,
		arrows: true
	});

	// PRODUCTS SLICK
	$('#product-slick-1').slick({
		slidesToShow: 4,
		slidesToScroll: 3,
		autoplay: true,
		infinite: true,
		speed: 300,
		dots: true,
		arrows: false,
		appendDots: '.product-slick-dots-1',
		responsive: [
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 480,
				settings: {
					dots: false,
					arrows: true,
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});

	$('#product-slick-2').slick({
		slidesToShow: 4,
		slidesToScroll: 3,
		autoplay: true,
		infinite: true,
		speed: 300,
		dots: true,
		arrows: false,
		appendDots: '.product-slick-dots-2',
		responsive: [
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 480,
				settings: {
					dots: false,
					arrows: true,
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});

	$('#product-slick-3').slick({
		slidesToShow: 4,
		slidesToScroll: 3,
		autoplay: true,
		infinite: true,
		speed: 300,
		dots: true,
		arrows: false,
		appendDots: '.product-slick-dots-3',
		responsive: [
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 480,
				settings: {
					dots: false,
					arrows: true,
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});

	// PRODUCT DETAILS SLICK
	$('#product-main-view').slick({
		infinite: true,
		speed: 300,
		dots: false,
		arrows: true,
		fade: true,
		asNavFor: '#product-view'
	});

	$('#product-view').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		arrows: true,
		centerMode: true,
		focusOnSelect: true,
		asNavFor: '#product-main-view'
	});

	// PRODUCT ZOOM
	$('#product-main-view .product-view').zoom();

	// PRICE SLIDER
	var slider = document.getElementById('price-slider');
	if (slider) {
		noUiSlider.create(slider, {
			start: [1, 999],
			connect: true,
			tooltips: [true, true],
			format: {
				to: function(value) {
					return value.toFixed(2) + '$';
				},
				from: function(value) {
					return value;
				}
			},
			range: {
				min: 1,
				max: 999
			}
		});
	}

	// =========PAGINATION FOR PRODUCT PAGE==========//
	var numberOfProducts = $('.col-md-4 .product-single').length;
	//SO LUONG ITEM CUA SAN PHAM TRONG 1 TRANG NEN DE LA 3 6 Hoac 9
	var limitPerPageProduct = 6;
	$('.col-md-4 .product-single:gt(' + (limitPerPageProduct - 1) + ')').hide();
	var totalPagesProduct = Math.ceil(numberOfProducts / limitPerPageProduct);

	$('#productpage').append(
		"<li class='current-page'><a href='javascript:void(0)'>" +
			1 +
			'</a></li>'
	);
	for (var i = 2; i <= totalPagesProduct; i++) {
		$('#productpage').append(
			"<li class='current-page'><a href='javascript:void(0)'>" +
				i +
				'</a></li>'
		);
	}
	$('#productpage li.current-page').on('click', function() {
		var currentPage = $(this).index();
		$('.col-md-4 .product-single').hide();
		var grandTotal = limitPerPageProduct * currentPage;
		for (var i = grandTotal - limitPerPageProduct; i < grandTotal; i++) {
			$('.col-md-4 .product-single:eq(' + i + ')').show();
		}
	});

	//// SORTTINGGG /////

	$('#buttonorder').on('click', function() {
		var test = $('#inputsort option:selected').val();
		console.log(test);
		if (test == 1) {
			var $sorted_items,
				getSorted = function(selector, attrName) {
					return $(
						$(selector)
							.toArray()
							.sort(function(a, b) {
								var aVal = parseInt(a.getAttribute(attrName)),
									bVal = parseInt(b.getAttribute(attrName));
								return aVal - bVal;
							})
					);
				};
			$sorted_items = getSorted('#rowproduct .col-md-4', 'data-price');
			$('#rowproduct').html($sorted_items);
			var currentPage = 1;
			$('.col-md-4 .product-single').hide();
			var grandTotal = limitPerPageProduct * currentPage;
			for (
				var i = grandTotal - limitPerPageProduct;
				i < grandTotal;
				i++
			) {
				$('.col-md-4 .product-single:eq(' + i + ')').show();
			}
		} else {
			var $sorted_items,
				getSorted = function(selector, attrName) {
					return $(
						$(selector)
							.toArray()
							.sort(function(a, b) {
								var aVal1 = a.getAttribute(attrName),
									bVal1 = b.getAttribute(attrName);
								console.log(aVal1);
								var aVal = new Date(aVal1).getTime();
								console.log(aVal);
								var bVal = new Date(bVal1).getTime();
								return bVal - aVal;
							})
					);
				};
			$sorted_items = getSorted('#rowproduct .col-md-4', 'data-endate');
			$('#rowproduct').html($sorted_items);
			var currentPage = 1;
			$('.col-md-4 .product-single').hide();
			var grandTotal = limitPerPageProduct * currentPage;
			for (
				var i = grandTotal - limitPerPageProduct;
				i < grandTotal;
				i++
			) {
				$('.col-md-4 .product-single:eq(' + i + ')').show();
			}
		}
	});

	// TEST DATAMODAL
	$('#watchsellerdetail').on('click', function() {
		let html = `  <div id="MyModal" class="modal fade">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">TRINH</div>
                                <div class="modal-body">TAN</div>
                                <div class="modal-footer">TAI</div>
                            </div>
                        </div>
                    </div>`;
	});

	// PHAN TRANG CHO HISTORY BIDDER
	var numberOfHistory = $('.historyrow').length;
	console.log(numberOfHistory);
	//SO LUONG ITEM CUA HISTORY TRONG 1 TRANG NEN DE LA 3 6 Hoac 9
	var limitPerPageHistory = 3;
	$('.historyrow:gt(' + (limitPerPageHistory - 1) + ')').hide();
	var totalPagesHistory = Math.ceil(numberOfHistory / limitPerPageHistory);
	$('#historypage').append(
		"<li class='current-page'><a href='javascript:void(0)'>" +
			1 +
			'</a></li>'
	);
	for (var i = 2; i <= totalPagesHistory; i++) {
		$('#historypage').append(
			"<li class='current-page'><a href='javascript:void(0)'>" +
				i +
				'</a></li>'
		);
	}
	$('#historypage li.current-page').on('click', function() {
		var currentPage = $(this).index();
		$('.historyrow').hide();
		var grandTotal = limitPerPageHistory * currentPage;
		for (var i = grandTotal - limitPerPageHistory; i < grandTotal; i++) {
			$('.historyrow:eq(' + i + ')').show();
		}
	});

	// PHAN TRANG CHO CHECKOUT SAN PHAM DA DANG
	var numberOfCheckout = $('.check_out').length;
	console.log(numberOfCheckout);
	//SO LUONG ITEM CUA CHECKOUT TRONG 1 TRANG NEN DE LA 3 6 Hoac 9
	var limitPerPageCheckout = 6;
	$('.check_out:gt(' + (limitPerPageCheckout - 1) + ')').hide();
	var totalPagesCheckout = Math.ceil(numberOfCheckout / limitPerPageCheckout);
	$('#checkout').append(
		"<li class='current-page'><a href='javascript:void(0)'>" +
			1 +
			'</a></li>'
	);
	for (var i = 2; i <= totalPagesCheckout; i++) {
		$('#checkout').append(
			"<li class='current-page'><a href='javascript:void(0)'>" +
				i +
				'</a></li>'
		);
	}
	$('#checkout li.current-page').on('click', function() {
		var currentPage = $(this).index();
		$('.check_out').hide();
		var grandTotal = limitPerPageCheckout * currentPage;
		for (var i = grandTotal - limitPerPageCheckout; i < grandTotal; i++) {
			$('.check_out:eq(' + i + ')').show();
		}
	});

	// PHAN TRANG CHO CHECKOUT SAN PHAM DA DANG
	var numberOfWatchlist = $('.watch_list').length;
	//SO LUONG ITEM CUA CHECKOUT TRONG 1 TRANG NEN DE LA 3 6 Hoac 9
	var limitPerPageWatchlist = 2;
	$('.watch_list:gt(' + (limitPerPageWatchlist - 1) + ')').hide();
	var totalPagesWatchlist = Math.ceil(
		numberOfWatchlist / limitPerPageWatchlist
	);
	$('#watchlist').append(
		"<li class='current-page'><a href='javascript:void(0)'>" +
			1 +
			'</a></li>'
	);
	for (var i = 2; i <= totalPagesWatchlist; i++) {
		$('#watchlist').append(
			"<li class='current-page'><a href='javascript:void(0)'>" +
				i +
				'</a></li>'
		);
	}
	$('#watchlist li.current-page').on('click', function() {
		var currentPage = $(this).index();
		$('.watch_list').hide();
		var grandTotal = limitPerPageWatchlist * currentPage;
		for (var i = grandTotal - limitPerPageWatchlist; i < grandTotal; i++) {
			$('.watch_list:eq(' + i + ')').show();
		}
	});
})(jQuery);
