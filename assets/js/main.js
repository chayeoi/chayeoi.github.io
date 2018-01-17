$(document).ready(function() {

  // Menu Settings
  $('.menu-icon, .menu-icon-close').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    $('.flex-container').toggleClass('active');
    // $('.nav-sub-lists').removeClass('collapse');
  });

  // Sub Menu Settings
  // $('.nav-sup-title').click(function(e) {
  //   $(this).siblings('.nav-sub-lists').toggleClass('collapse');
  // })

  // Search Settings
  $('.search-icon').on('click', function(e){
    e.preventDefault();
    $('.search-box').toggleClass('search-active');

    if ($('.search-box').hasClass('search-active')) {
      $('.search-icon-close').on('click', function(e){
  		e.preventDefault();
  		$('.search-box').removeClass('search-active');
  	});
  }
  });

});
