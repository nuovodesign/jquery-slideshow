(function ( $ ) {
    $.fn.slideshow = function() {
        var $slider = $(this);
        
        $slider.find('img').css({opacity:1});
        $slider.addClass('slidercontainer');
        
        var tl = new TimelineMax();
        var progress = 0;
        var paused = false;

        function setSlider(trgt) {
            paused = false;
            $slider.find('.slidercontrol').css({
                'background-position' : '-30px 0'
            });
            //TweenMax.resumeAll();
            tl.resume();
            tl.kill();
            tl.clear();
            TweenMax.killTweensOf(trgt);
            TweenMax.killDelayedCallsTo(nextSlider);
            trgt.children('div').removeClass('current');
            trgt.children('div:first-child').addClass('current');
            TweenMax.to(trgt.children('div'), 0, {
                autoAlpha : 0
            });
            TweenMax.to(trgt.children('.current'), 0.4, {
                autoAlpha : 1
            });
            tl.add(TweenMax.delayedCall(6, nextSlider, [trgt]));
            if (trgt.hasClass('slider')) {
                trgt.parent().find('.slidernav').remove();
                if (trgt.parent().find('.slider > div').length > 1) {
                    trgt.parent().prepend('<div class="slidernav"><div class="sliderprev"></div><div class="slidercontrol"><input type="text" value="0" class="dial" data-width="24" data-displayInput="false" data-thickness=".2" data-bgColor="#ffffff" data-fgColor="#808284" data-readOnly="true"></div><div class="slidernext"></div></div>');
                    $('.slidernext').on('click', function() {
                        TweenMax.killTweensOf(trgt);
                        nextSlider(trgt);
                        paused = true;
                        $slider.find('.slidercontrol').css({
                            'background-position' : '-30px -30px'
                        });
                        tl.pause();
                    });
                    $('.sliderprev').on('click', function() {
                        TweenMax.killTweensOf(trgt);
                        prevSlider(trgt);
                        paused = true;
                        $slider.find('.slidercontrol').css({
                            'background-position' : '-30px -30px'
                        });
                        tl.pause();
                    });
                    
                    $('.slidercontrol').on('click', function() {
                        if (paused == false) {
                            paused = true;
                            $slider.find('.slidercontrol').css({
                                'background-position' : '-30px -30px'
                            });
                            tl.pause();
                        } else {
                            paused = false;
                            $slider.find('.slidercontrol').css({
                                'background-position' : '-30px 0'
                            });
                            tl.resume();
                        }
                    });
                    $(".dial").knob();
                    var myObject = {
                        value1 : 0
                    };
                    tl.add(TweenMax.to(myObject, 6, {
                        value1 : 100,
                        startAt : {
                            value1 : 0
                        },
                        ease : Linear.easeNone,
                        onUpdate : applyValue,
                        onUpdateParams : ["{self}", 'value1']
                    }), 0);
                }
            }
            scrollWidth(trgt);
        }

        function nextSlider(trgt) {
            var crnt = trgt.children('.current');
            var nxt = crnt.next('div');
            crnt.removeClass('current');
            if (nxt.length) {
                nxt.addClass('current');
            } else {
                var nxt = trgt.children('div:first-child');
                nxt.addClass('current');
            }
            TweenMax.to(crnt, 0.4, {
                autoAlpha : 0
            });
            TweenMax.to(nxt, 0.4, {
                autoAlpha : 1
            });
            tl.add(TweenMax.delayedCall(6, nextSlider, [trgt]));
            if (trgt.hasClass('slider')) {
                var myObject = {
                    value1 : 0
                };
                tl.add(TweenMax.to(myObject, 6, {
                    value1 : 100,
                    startAt : {
                        value1 : 0
                    },
                    ease : Linear.easeNone,
                    onUpdate : applyValue,
                    onUpdateParams : ["{self}", 'value1']
                }), "-=6");
            }
            if (paused == true) {
                //TweenMax.pauseAll();
                tl.pause();
            }
            scrollWidth(trgt);
        }

        function prevSlider(trgt) {
            var crnt = trgt.children('.current');
            var prv = crnt.prev('div');
            crnt.removeClass('current');
            if (prv.length) {
                prv.addClass('current');
            } else {
                var prv = trgt.children('div:last-child');
                prv.addClass('current');
            }
            TweenMax.to(crnt, 0.4, {
                autoAlpha : 0
            });
            TweenMax.to(prv, 0.4, {
                autoAlpha : 1
            });
            tl.add(TweenMax.delayedCall(6, nextSlider, [trgt]));
            if (trgt.hasClass('slider')) {
                var myObject = {
                    value1 : 0
                };
                tl.add(TweenMax.to(myObject, 6, {
                    value1 : 100,
                    startAt : {
                        value1 : 0
                    },
                    ease : Linear.easeNone,
                    onUpdate : applyValue,
                    onUpdateParams : ["{self}", 'value1']
                }), "-=6");
            }
            scrollWidth(trgt);
        }

        function scrollWidth(trgt) {
            var imgWidth = trgt.find('.current img').width();
            if (imgWidth > $slider.width()) {
                TweenMax.to(trgt.find('.current img'), 6, {
                    x : -(imgWidth - $slider.width()),
                    startAt : {
                        x : 0
                    },
                    repeat : -1,
                    yoyo : true,
                    ease : Strong.easeInOut
                });
            } else {
                TweenMax.to(trgt.find('.current img'), 0, {
                    x : 0
                });
            }
        }

        function applyValue(tween, prop) {
            $slider.find('.dial').val(tween.target[prop]).change();
        }


        TweenMax.delayedCall(0, setSlider, [$slider.find('.slider')]);

        $(window).on('resize', function() {
            scrollWidth($slider.find('.slider'));
        });
    }        
}( jQuery ));    
