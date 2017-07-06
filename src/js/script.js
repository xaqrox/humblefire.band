(function ($) {
  // https://stackoverflow.com/questions/7717527/smooth-scrolling-when-clicking-an-nav-link
  $(document).ready(() => {
    const $root = $('html, body');
    $('.nav-link').click(function (e) {
      const href = $(this).attr('href');
      if (href.match(/^#/)) {
        e.preventDefault();
        $root.animate({
            scrollTop: $(href).offset().top
        }, 500, () => (window.location.hash = href));
      }
    })
    .hover(function (e) {
      const href = $(this).attr('href');
      if (href.match(/^#/)) {
        let $target = $(href);
        let scrollTop = $(window).scrollTop();
        if ($target.offset().top > scrollTop) {
          $(this).addClass('nav-down');
        }
        else {
          $(this).addClass('nav-up');
        }
      }
    })
    .mouseleave(function () {
      $(this).removeClass('nav-down nav-up');
    });
    sectionHeight();
    $('.container').fitVids();
  })

  $(window).resize(sectionHeight);

  function sectionHeight() {
    $('.section').last().css('min-height', $(window).height());
  }
})(jQuery);
