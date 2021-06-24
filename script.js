import { SmallCarousel, BigCarousel } from './slider.js'

(function () {

    // Navigation
    var header = document.querySelector("header")
    var sidebarToggler = header.querySelector(".sidebar-toggler");
    var overlay = document.querySelector(".overlay")
    var navBarList = header.querySelector("#nav-bar > ul")

    sidebarToggler.addEventListener("click", function () {
        overlay.classList.toggle("show")
        header.classList.toggle("open")
    });

    // Close side bar after clicking a nav item, or on the overlay
    [overlay, navBarList].forEach(element => {
        element.addEventListener("click", () => {
            overlay.classList.remove("show")
            header.classList.remove("open")
        })
    })


    // Carousels
    const bigCarousels = document.querySelectorAll(".carousel")
    bigCarousels.forEach(carousel => new BigCarousel(carousel).execute())

    const smallCarousels = document.querySelectorAll(".carousel-blocks")
    smallCarousels.forEach(carousel => new SmallCarousel(carousel).execute())

})()
