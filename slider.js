class SmallCarousel {
    constructor(carouselBlock) {
        this.carouselBlock = carouselBlock
        this.track = carouselBlock.querySelector(".carousel-blocks__track")
        this.slideItems = Array.from(this.track.children)           // number of slides
        this.prevBtn = carouselBlock.querySelector(".carousel-blocks__button.left")
        this.nextBtn = carouselBlock.querySelector(".carousel-blocks__button.right")
        this.itemWidth = this.slideItems[0].getBoundingClientRect().width
        this.trackWidth = this.itemWidth * this.slideItems.length
    }

    // move the length of 1 slide width
    slideCarousel(isPrev) {
        let changeWidth = this.itemWidth * (isPrev || -1)

        // when drag near the start, then press previous button
        if (this.track.offsetLeft + changeWidth > 0) {
            this.track.style.left = "0";
        }
        // when drag near the end, then press next button
        else if (this.track.offsetLeft + changeWidth < -this.trackWidth + this.itemWidth / 2) {
            this.track.style.left = -this.trackWidth + this.itemWidth / 2 + "px";
        }
        else {
            this.track.style.left = this.track.offsetLeft + changeWidth + "px";
        }
        setTimeout(() => this.toggleButtons(), 300)
    }

    // hide next or prev button if there's no next or prev slide
    toggleButtons() {
        this.prevBtn.classList.remove("hidden")
        this.nextBtn.classList.remove("hidden")

        if (this.track.offsetLeft >= -10) {
            this.prevBtn.classList.add("hidden")
        }
        else if (this.track.offsetLeft - window.innerWidth < -this.trackWidth) {
            this.nextBtn.classList.add("hidden")
        }
    }

    execute() {
        let offsetX = 0
        let mousePosX;
        let isMouseDown = false;
        const startEvents = ["mousedown", "touchstart"]
        const moveEvents = ["mousemove", "touchmove"]
        const stopEvents = ["mouseup", "mouseleave", "touchend", "touchcancel"]

        // next button
        this.nextBtn.addEventListener("click", () => { this.slideCarousel(false) })

        // prev button
        this.prevBtn.addEventListener("click", () => { this.slideCarousel(true) })

        startEvents.forEach(event => {
            this.track.addEventListener(event, (e) => {
                // avoid sliding when user attempt to select text
                const node = e.target.nodeName
                if (node !== "P" && node !== "H3" && node !== "I" && node !== "SPAN") {
                    isMouseDown = true
                    // e.clientX for mouse events, the other for touch events
                    offsetX = this.track.offsetLeft - (e.clientX || e.changedTouches[0].clientX)
                }
            })
        })

        stopEvents.forEach(event => {
            this.track.addEventListener(event, () => {
                isMouseDown = false
                // enable text select (text highlighting) after dragging mouse
                document.body.style.userSelect = "auto"
            })
        })

        moveEvents.forEach(event => {
            this.track.addEventListener(event, (e) => {
                if (isMouseDown) {
                    mousePosX = e.clientX || e.changedTouches[0].clientX
                    const newLeft = mousePosX + offsetX

                    // disable text select (text highlighting) when dragging mouse
                    document.body.style.userSelect = "none"

                    // change position
                    if (newLeft <= 0 && newLeft > -this.trackWidth + this.itemWidth / 2) {
                        this.track.style.left = newLeft + 'px'
                        this.toggleButtons()
                    }

                }
            })
        })



    }


}

class BigCarousel {
    constructor(carousel) {
        this.carousel = carousel
        this.track = carousel.querySelector(".carousel__track")
        this.slides = Array.from(this.track.children)           // number of slides
        this.prevBtn = carousel.querySelector(".carousel__button.left")
        this.nextBtn = carousel.querySelector(".carousel__button.right")
        this.indicator = carousel.querySelector(".carousel__dots")
        this.dots = Array.from(this.indicator.children)
    }

    updateIndicator(...args) {
        let [currentSlide, isNextSlide, currentDot, targetDot] = [...args]

        // change dots when next or prev button is clicked
        if (currentSlide) {
            const currentIndex = this.slides.findIndex(slide => slide === currentSlide)
            currentDot = this.dots[currentIndex]
            const nextIndex = currentIndex + (isNextSlide || -1)

            // infinite slide
            if (nextIndex === this.slides.length || nextIndex < 0) {
                targetDot = this.dots[isNextSlide ? 0 : this.slides.length - 1]
            }
            else {
                targetDot = this.dots[currentIndex + (isNextSlide || -1)]    // return 1 (true) is isNextSlide true else return -1
            }
        }

        currentDot.classList.remove('active')
        targetDot.classList.add('active')
    }


    // re-arrange slide function 
    moveToSlideBig(currentSlide, targetSlide) {
        // move to the target slide
        this.track.style.transform = "translateX(-" + targetSlide.style.left + ")";

        // set nextSlide to be the active slide
        currentSlide.classList.remove("active")
        targetSlide.classList.add("active")
    }

    slideBigCarousel(isNext) {
        const currentSlide = this.track.querySelector(".active")
        let siblingSlide = isNext ? currentSlide.nextElementSibling : currentSlide.previousElementSibling

        // if there's no sibling, do infinite scroll (back to start or end) 
        if (!siblingSlide) {
            // if isNext true then go back to the first slide, if false go to last slide
            siblingSlide = isNext ? this.track.querySelector("li:first-child") : this.track.querySelector("li:last-child")
        }

        this.moveToSlideBig(currentSlide, siblingSlide)
        this.updateIndicator(currentSlide, isNext, null, null)
    }


    execute() {
        // arrange the slides next to one another
        this.slides.forEach((slide, index) => {
            slide.style.left = index * 100 + '%'
        })

        // next button click
        this.nextBtn.addEventListener("click", () => this.slideBigCarousel(true))

        // prev button click
        this.prevBtn.addEventListener("click", () => this.slideBigCarousel(false))

        // when user click on a dot
        this.indicator.addEventListener("click", (e) => {
            const clickedDot = e.target.closest("button")
            if (clickedDot) {
                const currentSlide = this.track.querySelector(".active")
                const currentDot = this.indicator.querySelector(".active")

                // return the index of the clicked dot in the dots array
                const btnIndex = this.dots.findIndex(dot => dot === clickedDot)
                const targetSlide = this.slides[btnIndex]

                this.moveToSlideBig(currentSlide, targetSlide)
                this.updateIndicator(null, null, currentDot, clickedDot)
            }
        })

        // auto change slide every 5s
        setInterval(() => this.slideBigCarousel(true), 5000)
    }
}

export { SmallCarousel, BigCarousel }