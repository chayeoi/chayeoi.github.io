$(document).ready(function() {

  // Menu Settings
  $('.menu-icon, .menu-icon-close').click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    $('.flex-container').toggleClass('active');
    $('.nav-sub-lists').removeClass('nav-sub-lists--active');
  });

  $(document).click(function(e) {
    if ($('.flex-container').hasClass('active')) {
      $('.flex-container').removeClass('active');
    }
  })

  // Sub Menu Settings
  $('.nav-sup-title').click(function(e) {
    $(this).siblings('.nav-sub-lists').toggleClass('nav-sub-lists--active');
  })

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
