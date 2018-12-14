$(document).ready(function () {

    var wrapper = $('body');

    // console.log($('.ad-slide-group').not('[_adConstructed]'));
    function scanDOM4media() {
        // scan for ad-slide-group
        if (wrapper.find('.ad-carousel').not('[_adConstructed]').length !== 0) {
            // console.log('slider found', $('.ad-slide-group').not('[_adConstructed]').length);
            constructCarousel();
        }

    }

    scanDOM4media();

    // Scan DOM Every 1s for unconstructed videos
    setInterval(function () {
        // console.log('scannning for media');
        scanDOM4media();
    }, 3000);

    // windowsResize
    $(window).resize(function () {
        $('.ad-carousel').each(function () {
            resizeCarousel($(this));
        });
    });

    function constructCarousel() {
        openConstruct =
            ' <div class="carousel-container"><div class="carousel-overflow">';
        closeConstruct = '</div></div>';

        prevNav =
            '<div  class="ad-carousel-previous hidden"><button class="ad-btn ad-sm ad-flat ad-round ad-icon"><i class="fa fa-angle-left "></i></button></div>';
        nextNav =
            '<div  class="ad-carousel-next "><button class="ad-btn ad-sm ad-flat ad-round ad-icon"><i class="fa fa-angle-right"></i></button></div>';

        $('.ad-carousel')
            .not('[_adConstructed]')
            .each(function () {
                // First check if it has the caursol-overflow, then skip wrap
                if ($(this).find('div.carousel-overflow').length == 0) {
                    if ($(this)[0].hasAttribute('items')) {
                        console.log('items found');
                        wrapped = $(this)
                            .find('.' + $(this).attr('items') + '')
                            .wrapAll('<div class="carousel-overflow"></div>');
                    } else {
                        console.log('items Not found, using default');
                        wrapped = $(this)
                            .find('.ad-carousel-item')
                            .wrapAll("<div class='carousel-overflow'></div>");
                    }

                    $(this)
                        .find('div.carousel-overflow')
                        .wrap("<div class='carousel-container'></div>");
                }
                // console.log('element wrapped',wrapped);
                // console.log('overflow or wrapper',$(this).find('div.carousel-overflow'));

                // $(this).addClass('is-loading');
                // let content = $(this).html();
                // $(this).html(openConstruct + content + closeConstruct);
                // $(this).prepend('<p>Yooo');
                // instead of taking and putting back, append and prepend
                if ($(this).find('.ad-carousel-previous').length == 0) {
                    // console.log('show navBTNS');
                    $(this).append(prevNav + nextNav);
                }
                resizeCarousel($(this));

                let spinner = $(this).find('.ad-spinner');

                // let spinnerDuration = duration < 5000 ? 1300 : duration / 2;
                // remove loader in 3ms
                if (spinner.length !== 0) {
                    // console.log('spinner found', spinner);
                    setTimeout(function () {
                        // console.log('fade spinner');
                        spinner.fadeOut('slow');
                    }, 500);
                }

                // $(this).removeClass('is-loading');

                // Mark as constructed
                $(this).attr('_adConstructed', true);
            });
    }

    function resizeCarousel(carousel) {
        $this = carousel.find('.carousel-container');
        // zero out the margin

        if (carousel[0].hasAttribute('items')) {
            item = $this.find('.' + carousel.attr('items') + '');
        } else {
            item = $this.find('.ad-carousel-item');
        }
        $this.height(item.height() + 5);
        // console.log('items is sanakjcbndjcscd', carousel.attr('items'));
        container = $this.find('.carousel-overflow');

        // Calculate the number of items to show
        numberOfItemstoShow = $this.width() / item.width();
        visibleItems =
            Math.round(numberOfItemstoShow) * item.width() > $this.width() ?
            Math.round(numberOfItemstoShow) - 1 :
            Math.round(numberOfItemstoShow);
        // console.log('number to shopwwwwwwwwwwwww', visibleItems);

        // Calculate the marign-right of the items, base on the items to show and the ad-carousel width

        console.log('flow is,', carousel[0].hasAttribute('flow'));
        if (!carousel[0].hasAttribute('flow')) {
            leftSpace = $this.width() - visibleItems * item.width();

            margin = leftSpace / visibleItems;
            // console.log('space, margin isssssssss', leftSpace, margin, 2.5.toFixed());

            item.css('margin', '0 ' + margin / 2 + 'px');
            // console.log((margin) + 'px');

            // create emoveby
            moveBy = item.width() + margin;
            consolidate = (margin * item.length) / 100 + $this.width() * 0.002; //rework here for compatibility
            carousel.attr('moveby', Math.round(moveBy + consolidate));
        } else {
            margin = 0;
            carousel.attr('moveby', item.width());
        }

        containerWidth = item.width() * item.length + item.width() * margin;
        container.css('width', containerWidth);
        // console.log('container withggggggggggggg', containerWidth, $this.width());

        // Default Container to margin 0
        container.css('margin-left', 0);
        // Then hide the prevoius btn, show the now
        carousel.find('.ad-carousel-previous').addClass('hidden');
        carousel.find('.ad-carousel-next').removeClass('hidden');

        // create hidden carousel for navigation
        // if (carousel[0].hasAttribute('caurosel_hidden-items')) {
        //     lHiddenItems = carousel.attr('caurosel_hidden-items');
        // } else {
        lHiddenItems = 0;
        // }

        carousel.attr('caurosel_hidden-items', lHiddenItems);
        carousel.attr('caurosel_shown-items', visibleItems);
        carousel.attr('caurosel_total-items', item.length);
        //Check if is-loaging is on, then remove it,
    }

    // When CAROUSEL previous BTN is clicked
    wrapper.on('click', '.ad-carousel-previous', function () {
        carouselNav($(this), 1);
    });

    // for touch event, lets wait for hammer.js

    wrapper.on('click', '.ad-carousel-next', function () {
        carouselNav($(this), -1);
    });

    function carouselNav(clicked, factor) {
        var parent = clicked.parents('.ad-carousel');
        // if (parent[0].hasAttribute('items')) {

        //     item = parent.find('.' + carousel.attr('items') + ':first');
        // } else {
        //     item = parent.find('.ad-carousel-item:first');
        // }
        // margin = 2 * item.attr('style').split(' ')[2].replace('px;', '');
        // moveBy = item.width() + margin;
        // console.log(parent.attr('moveby'));
        // math them out. get hidden, then see if the visible items plus hidden is total

        var lHiddenItems = parseInt(parent.attr('caurosel_hidden-items'));
        var visibleItems = parseInt(parent.attr('caurosel_shown-items'));
        var totalItems = parseInt(parent.attr('caurosel_total-items'));

        var moveFactor = -1;
        var moveby = parseInt(parent.attr('moveby')) * moveFactor;

        caltems = lHiddenItems + visibleItems;

        if (factor == -1 && caltems == totalItems) {
            // console.log('maximum reached, so dont move again, or hide it. Hidden, Visible, Total', lHiddenItems, visibleItems, totalItems);
        } else {
            if (factor === -1) {
                calMove = (lHiddenItems + 1) * moveby;
                updateHidden = lHiddenItems + 1;
            } else {
                //check if it not zero zero
                if (lHiddenItems) {
                    calMove = (lHiddenItems - 1) * moveby;
                    updateHidden = lHiddenItems - 1;
                } else {
                    //check if its zero
                    // console.log('nothing to move previous to');
                    calMove = 0;
                    updateHidden = lHiddenItems;
                }
            }

            parent.find('.carousel-overflow').animate({
                    'margin-left': calMove
                },
                300,
                'linear'
            );

            // console.log('Hidden, Visible, Plus, Total', lHiddenItems, visibleItems, caltems, totalItems);
            //update the hiddenItemsI
            parent.attr('caurosel_hidden-items', updateHidden);

            // now hide the prev. btn if its full
            if (updateHidden + visibleItems == totalItems) {
                parent.find('.ad-carousel-next').addClass('hidden');
                parent.find('.ad-carousel-previous').removeClass('hidden');
            } else {
                parent.find('.ad-carousel-next').removeClass('hidden');
                parent.find('.ad-carousel-previous').removeClass('hidden');
            }

            if (updateHidden == 0) {
                parent.find('.ad-carousel-next').removeClass('hidden');
                parent.find('.ad-carousel-previous').addClass('hidden');
            }
        }
    }

});