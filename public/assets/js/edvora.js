let scrollLeftPrev = 0;
let $elem=$('#scrollable-row');

$($elem).scroll(function () {
    let newScrollLeft = $elem.scrollLeft(),
        width=$elem.width(),
        scrollWidth=$elem.get(0).scrollWidth;
    if (scrollWidth- newScrollLeft-width<=0) {
        alert('right end');
    }
    if (newScrollLeft === 0) {
        alert('left end');
    }
    scrollLeftPrev = newScrollLeft;
});


$(".right-arrow").click(function () {
    let leftPos = $elem.scrollLeft();
    $elem.animate({scrollLeft: leftPos + 345}, 800);
});

$(".left-arrow").click(function () {
    var leftPos = $elem.scrollLeft();
    $elem.animate({scrollLeft: leftPos + 345}, 800);
});
