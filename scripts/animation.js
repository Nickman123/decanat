$(".dropdown-content").click(function() {
    let dropdown = $(this);  // Текущий dropdown
    if (dropdown.hasClass("closed"))
        openDropdown(dropdown);
    else
        closeDropdown(dropdown);
});

var openDropdown = function(dropdown) {
    let icon = $(dropdown).children(".fa-chevron-down");
    icon.removeClass("fa-chevron-down");
    dropdown.removeClass("closed");
    icon.addClass("fa-chevron-up");
    dropdown.addClass("opened");

    let content = $(dropdown).children(".dropdown-more");
    content.slideDown('fast');
}

var closeDropdown = function(dropdown) {
    let icon = $(dropdown).children(".fa-chevron-up");
    icon.removeClass("fa-chevron-up");
    dropdown.removeClass("opened");
    icon.addClass("fa-chevron-down");
    dropdown.addClass("closed");

    let content = $(dropdown).children(".dropdown-more");
    content.slideUp('fast');
}
