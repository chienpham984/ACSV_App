$(document).ready(function () {

    $(".menu-nav-toggle").on("click", function () {
        var hasBox1Class = $('.toggle-icon').hasClass('ik-toggle-right');
        if (hasBox1Class) {
            $('.toggle-icon').removeClass("ik-toggle-right").addClass("ik-toggle-left")
            $('.header-brand').addClass("hidden");
            $('.main-menu').addClass("hidden");
            $('.companyLogo').addClass("hidden");

            var pageWidth = $(window).width();
            if (pageWidth > 1024) {
                $(".sidebar").css("left", "-200px");
                $(".sidebar").css("padding-left", "200px");
                $(".main-content").css("padding-left", "60px");
                $(".header-top").css("padding-left", "60px");
            }
            else {
                $(".sidebar").css("left", "-250px");
                $(".main-content").css("padding-left", "0px");
                $(".header-top").css("padding-left", "0px");
            }
        } else {
            $('.header-brand').removeClass("hidden");
            $('.main-menu').removeClass("hidden");
            $('.companyLogo').removeClass("hidden");
            $('.toggle-icon').removeClass("ik-toggle-left").addClass("ik-toggle-right")
            var pageWidth = $(window).width();
            if (pageWidth > 1024) {
                $(".sidebar").css("left", "0px");
                $(".sidebar").css("padding-left", "0px");
                $(".main-content").css("padding-left", "260px");
                $(".header-top").css("padding-left", "260px");
            }
        }
    });
    $(".menubaricon").on("click", function () {
        var hasBox1Class = $('.toggle-icon').hasClass('ik-toggle-right');
        if (hasBox1Class) {
            $('.toggle-icon').removeClass("ik-toggle-right").addClass("ik-toggle-left");
            $('.header-brand').addClass("hidden");
            $('.main-menu').addClass("hidden");
            $('.companyLogo').addClass("hidden");

            $(".sidebar").css("left", "-250px");
            $(".main-content").css("padding-left", "0px");
            $(".header-top").css("padding-left", "0px");

        } else {
            $('.header-brand').removeClass("hidden");
            $('.main-menu').removeClass("hidden");
            $('.companyLogo').removeClass("hidden");
            $('.toggle-icon').removeClass("ik-toggle-left").addClass("ik-toggle-right");
            $(".sidebar").css("left", "0px");
            $(".sidebar").css("padding-left", "0px");
        }
    });
    $(".nav-close").on("click", function () {
        $(".app-sidebar").css("left", "-250px");
    });
    $(document).click(function (event) {
        var clickedElement = $(event.target);
        var closestSidebar = clickedElement.closest(".sidebar");
        if (clickedElement.hasClass("menubar")) {
            return;
        }

        //var pageWidth = $(window).width();
        //if (!$(event.target).closest(".sidebar").length && pageWidth < 1024) {
        //    $('.toggle-icon').removeClass("ik-toggle-right").addClass("ik-toggle-left");
        //    $(".sidebar").css("left", "-250px");
        //    $(".main-content").css("padding-left", "0px");
        //    $(".header-top").css("padding-left", "0px");
        //}

    });

   
});