import { SmallCarousel, BigCarousel } from './slider.js'

(function () {

    // Navigation
    const header = document.querySelector("header")
    const sidebarToggler = header.querySelector(".sidebar-toggler");
    const overlay = document.querySelector(".overlay")
    const navBarList = header.querySelector("#nav-bar > ul")

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


    // Down Arrows in side bars next to big carousels
    const downArrows = document.querySelectorAll(".side-note__arrow")
    const downTargets = [document.querySelector(".pixture-2"), document.querySelector(".text-section-2")]
    downArrows.forEach((arrow, index) => {
        arrow.addEventListener("click", () => {
            const targetTop = downTargets[index].getBoundingClientRect().top
            window.scrollBy(0, targetTop - 20);      // Scroll targetTop down
        })
    })


    // Carousels
    const bigCarousels = document.querySelectorAll(".carousel")
    bigCarousels.forEach(carousel => new BigCarousel(carousel).execute())

    const smallCarousels = document.querySelectorAll(".carousel-blocks")
    smallCarousels.forEach(carousel => new SmallCarousel(carousel).execute())

})()
