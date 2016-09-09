function setBigBannerCarousel() {
	var bigBannerCarouselElements = {
		root : 'big-banner--carousel',
		images : 'big-banner-images',
		image : 'big-banner-image',
		slides : 'big-banner-slides',
		slide : 'big-banner-slide',
		next : 'big-banner-next',
		prev : 'big-banner-prev',
		toggles : 'big-banner-toggles',
		toggle : 'big-banner-toggle'
	};

	var bigBannerCarouselStates = {
		ready : '__big-banner--carousel-ready',
		imageActive : '__big-banner-image--active',
		slideActive : '__big-banner-slide--active',
		toggleActive : '__big-banner-toggle--active'
	}

	var bigBannerCarouselDataAttributes = {
		autoplay : 'big-banner-carousel-autoplay',
		startAt : 'big-banner-carousel-start-from',
		toggleIndex : 'big-banner-carousel-toggle-index'
	}

	var bigBannerCarousel = $('.' + bigBannerCarouselElements.root).not('.' + bigBannerCarouselStates.ready);
	if(bigBannerCarousel.length > 0) {
		bigBannerCarousel.on({
			'tipi.bigBannerCarousel.switch' : function(event, bigBannerCarousel, index) {
				switchBigBannerCarouselslide(bigBannerCarousel, bigBannerCarouselElements, bigBannerCarouselStates, index);
				switchBigBannerCarouselImage(bigBannerCarousel, bigBannerCarouselElements, bigBannerCarouselStates, index);
				switchBigBannerCarouselToggle(bigBannerCarousel, bigBannerCarouselElements, bigBannerCarouselStates, index);
			},
			'tipi.bigBannerCarousel.resize' : function(event, bigBannerCarousel) {
				resizeBigBannerCarouselslides(bigBannerCarousel, bigBannerCarouselElements, bigBannerCarouselStates);
			}
		});

		var resize;
		$(window).on({
			resize : function() {
				clearTimeout(resize);
				resize = setTimeout(function() {
					bigBannerCarousel.trigger('tipi.bigBannerCarousel.resize', [bigBannerCarousel]);
				}, 100);
			}
		})

		bigBannerCarousel.each(function() {
			var bigBannerCarouselEach = $(this);
			var next = getBigBannerCarouselElement(bigBannerCarouselEach, bigBannerCarouselElements, 'next');
			var prev = getBigBannerCarouselElement(bigBannerCarouselEach, bigBannerCarouselElements, 'prev');
			var toggles = getBigBannerCarouselElement(bigBannerCarouselEach, bigBannerCarouselElements, 'toggles');

			if(getBigBannerCarouselElement(bigBannerCarouselEach, bigBannerCarouselElements, 'image').length == getBigBannerCarouselElement(bigBannerCarousel, bigBannerCarouselElements, 'slide').length) {
				var bigBannerCarouselOptions = {
					autoplay : 0,
					startFrom : 0
				}

				//Check if the current bigBannerCarousel has an autoplay option
				if(typeof bigBannerCarouselEach.data(bigBannerCarouselDataAttributes.autoplay) !== 'undefined' ) {
					if(parseInt(bigBannerCarouselEach.autoplay(bigBannerCarouselDataAttributes.startFrom)) != 'NaN') {
						bigBannerCarouselEach.autoplay = bigBannerCarouselEach.data(bigBannerCarouselDataAttributes.autoplay);
					}
				}

				if(typeof bigBannerCarouselEach.data(bigBannerCarouselDataAttributes.startFrom) !== 'undefined' ) {
					if(parseInt(bigBannerCarouselEach.data(bigBannerCarouselDataAttributes.startFrom)) != 'NaN') {
						bigBannerCarouselEach.startFrom = parseInt(bigBannerCarouselEach.data(bigBannerCarouselDataAttributes.startFrom));
					}
				}

				bigBannerCarouselEach.addClass(bigBannerCarouselStates.ready);
				bigBannerCarouselEach.trigger('tipi.bigBannerCarousel.switch', [bigBannerCarouselEach, bigBannerCarouselOptions.startFrom]);
				bigBannerCarouselEach.trigger('tipi.bigBannerCarousel.resize', [bigBannerCarouselEach]);

				//@TODO autoplay function
				// if(bigBannerCarouselOptions.autoplay > 0) {
				// 	var autoplay;
				// }

				if(next.length > 0) {
					next.on({
						click : function(event) {
							event.preventDefault();

							var bigBannerCarousel = getBigBannerCarouselElement($(this), bigBannerCarouselElements, 'root');

							var image = getBigBannerCarouselElement(bigBannerCarousel, bigBannerCarouselElements, 'image');
							if(image.length > 0) {
								var index = getBigBannerCarouselElementIndex(image, '.' + bigBannerCarouselStates.imageActive, true);
								bigBannerCarousel.trigger('tipi.bigBannerCarousel.switch', [bigBannerCarousel, index])
							}
						}
					});
				}

				if(prev.length > 0) {
					prev.on({
						click : function(event) {
							event.preventDefault();

							var bigBannerCarousel = getBigBannerCarouselElement($(this), bigBannerCarouselElements, 'root');

							var image = getBigBannerCarouselElement(bigBannerCarousel, bigBannerCarouselElements, 'image');
							if(image.length > 0) {
								var index = getBigBannerCarouselElementIndex(image, '.' + bigBannerCarouselStates.imageActive, false);
								bigBannerCarousel.trigger('tipi.bigBannerCarousel.switch', [bigBannerCarousel, index])
							}
						}
					});
				}

				if(toggles.length > 0) {
					toggles.each(function() {
						var togglesEach = $(this);
						setBigBannerCarouselToggle(togglesEach, bigBannerCarouselElements, bigBannerCarouselDataAttributes);
					});
				}
			}
		});
	}
}

function getBigBannerCarouselElement(origin, bigBannerCarouselElements, type) {
	var element;
	if(typeof origin != 'undefined' && typeof type != 'undefined') {
		switch(type) {
			case 'root' :
				element = origin.parents('.' + bigBannerCarouselElements.root);
			break;
			case 'images':
				element = origin.find('.' + bigBannerCarouselElements.images).first().siblings().addBack();
			break;
			case 'image':
				element = origin.find('.' + bigBannerCarouselElements.image).first().siblings().addBack();
			break;
			case 'slides':
				element = origin.find('.' + bigBannerCarouselElements.slides).first().siblings().addBack();
			break;
			case 'slide':
				element = origin.find('.' + bigBannerCarouselElements.slide).first().siblings().addBack();
			break;
			case 'next':
				element = origin.find('.' + bigBannerCarouselElements.next);
			break;
			case 'prev':
				element = origin.find('.' + bigBannerCarouselElements.prev);
			break;
			case 'toggles':
				element = origin.find('.' + bigBannerCarouselElements.toggles);
			break;
			case 'toggle':
				element = origin.find('.' + bigBannerCarouselElements.toggle);
			break;
			default:
				return;
		}
	}

	if(element.length > 0) {
		return element;
	} else {
		return false;
	}
}

function switchBigBannerCarouselslide(bigBannerCarousel, bigBannerCarouselElements, bigBannerCarouselStates, index) {
	var slide = getBigBannerCarouselElement(bigBannerCarousel, bigBannerCarouselElements, 'slide');
	if(typeof slide !== 'undefined') {
		if(slide.length > 0) {
			if(slide.eq(index).length == 0) {
				index = 0;
			}

			slide.removeClass(bigBannerCarouselStates.slideActive).eq(index).addClass(bigBannerCarouselStates.slideActive);
		}
	}
}

function switchBigBannerCarouselImage(bigBannerCarousel, bigBannerCarouselElements, bigBannerCarouselStates, index) {
	var image = getBigBannerCarouselElement(bigBannerCarousel, bigBannerCarouselElements, 'image');
	if(typeof image !== 'undefined') {
		if(image.length > 0) {
			if(image.eq(index).length == 0) {
				index = 0;
			}

			image.removeClass(bigBannerCarouselStates.imageActive).eq(index).addClass(bigBannerCarouselStates.imageActive);
		}
	}
}

function switchBigBannerCarouselToggle(bigBannerCarousel, bigBannerCarouselElements, bigBannerCarouselStates, index) {
	var toggles = getBigBannerCarouselElement(bigBannerCarousel, bigBannerCarouselElements, 'toggles');
	if (typeof toggles !== 'undefined') {
		if(toggles.length > 0) {
			toggles.each(function() {
				var toggle = getBigBannerCarouselElement(toggles, bigBannerCarouselElements, 'toggle');
				if(toggle.eq(index).length == 0) {
					index = 0;
				}

				toggle.removeClass(bigBannerCarouselStates.toggleActive).eq(index).addClass(bigBannerCarouselStates.toggleActive);
			});
		}
	}
}

function resizeBigBannerCarouselslides(bigBannerCarousel, bigBannerCarouselElements, bigBannerCarouselStates) {
	var slides = getBigBannerCarouselElement(bigBannerCarousel, bigBannerCarouselElements, 'slides');
	var slide = getBigBannerCarouselElement(bigBannerCarousel, bigBannerCarouselElements, 'slide');

	if(slide.length > 0) {
		slides.css({
			'height' : 'auto'
		});

		var slideHeight = [];

		slide.each(function() {
			slideHeight.push($(this).outerHeight());
		});

		slideHeight.sort(function(a, b) {
			return b - a;
		});

		slides.css({
			'height' : slideHeight[0]
		});
	}
}

function getBigBannerCarouselElementIndex(element, filter, forward) {
	if(typeof element != 'undefined') {
		if(typeof forward !== 'undefined') {
			var currentIndex = element.filter(filter).index();
			var newIndex = 0;

			if(forward) {
				newIndex = currentIndex + 1;
				if(currentIndex >= currentIndex.length - 1) {
					newIndex = 0;
				}
			} else {
				newIndex = currentIndex - 1;
				if(currentIndex <= 0) {
					newIndex = element.length - 1;
				}
			}

			return newIndex;
		} else {
			return 0;
		}
	}
}

function setBigBannerCarouselToggle(toggles, bigBannerCarouselElements, bigBannerCarouselDataAttributes) {
	var toggle = getBigBannerCarouselElement(toggles, bigBannerCarouselElements, 'toggle');

	if(toggle.length > 0) {
		toggle.each(function(i) {
			var toggle = $(this);
			if(typeof toggle.data(bigBannerCarouselDataAttributes.toggleIndex) === 'undefined') {
				toggle.data(bigBannerCarouselDataAttributes.toggleIndex, i);
			}
		});

		toggle.on({
			click : function(event) {
				event.preventDefault();

				var toggle = $(this);
				var index = toggle.data(bigBannerCarouselDataAttributes.toggleIndex);
				if(typeof index != 'undefined') {
					var bigBannerCarousel = getBigBannerCarouselElement(toggle, bigBannerCarouselElements, 'root');
					bigBannerCarousel.trigger('tipi.bigBannerCarousel.switch', [bigBannerCarousel, index]);
				}
			}
		});
	}
}