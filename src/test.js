$('.header').removeClass('fullwidth')
$(window).scroll(function() {	
  if ($('.header').offset().top <  150) {
  	$('.header').removeClass('fullwidth')
	} else {
  	$('.header').addClass('fullwidth')
  }
})



$('.header').removeClass('fullwidth')
let isScrolled = false;
$(window).scroll(function() {	
    const shouldAddClass = $(window).scrollTop() >= 150;    
    if (shouldAddClass && !isScrolled) {
        $('.header').addClass('fullwidth')
        $('.header').css('margin-bottom', `20px`);
        isScrolled = true;
    } else if (!shouldAddClass && isScrolled) {
        $('.header').removeClass('fullwidth')
        $('.header').css('margin-bottom', '0');
        isScrolled = false;
    }
})



function handleScroll() {
    const shouldAddClass = $(window).scrollTop() >= 150;
    
    if (shouldAddClass && !isScrolled) {
        $('.header').addClass('fullwidth')
        $('.header').css('margin-bottom', `20px`);
      isScrolled = true;
    } else if (!shouldAddClass && isScrolled) {
        $('.header').removeClass('fullwidth')
        $('.header').css('margin-bottom', '0');
        isScrolled = false;
    }
  }