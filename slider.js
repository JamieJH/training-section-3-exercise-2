class SmallCarousel {
    constructor(carouselBlock) {
        this.carouselBlock = carouselBlock
        this.track = carouselBlock.querySelector(".carousel-blocks__track")
        this.slideItems = Array.from(this.track.children)           // array of slides
        this.prevBtn = carouselBlock.querySelector(".carousel-blocks__button.left")
        this.nextBtn = carouselBlock.querySelector(".carousel-blocks__button.right")
        this.setInitialTrackLeft()
    }

    setInitialTrackLeft() {
        let lastSlideIndex
        if (window.innerWidth >= 1380) {
            lastSlideIndex = this.slideItems.length - 3
        }
        else if (window.innerWidth >= 768) {
            lastSlideIndex = this.slideItems.length - 2
        }
        else {
            lastSlideIndex = this.slideItems.length - 1
        }
        this.setLastActive([], lastSlideIndex)
    }

    // on small screen (max 768), only slide right if there's at least 1 slide left; 
    // on medium ______(max 1200)______________________________________ 2 __________
    // on x-large _______(min 1300)______________________________________ 3 __________ 
    getAvailableSlides() {
        const viewWidth = window.innerWidth
        // last carousel area show max 1 slides on screen < 768, max 2 on screen < 1380
        return viewWidth < 768 ? 1 : (viewWidth >= 1380 ? 3 : 2)
    }

    // move the length of 1 slide
    moveCarousel(isPrev) {
        const active = this.track.querySelector(".active")
        const target = isPrev ? active.previousElementSibling : active.nextElementSibling

        // only slide right if there are at least 3 slides available
        const nextSiblings = this.track.querySelectorAll("li.active ~ li")
        const availableSlides = this.getAvailableSlides()

        if ((isPrev && target) || (!isPrev && nextSiblings.length >= availableSlides)) {
            this.track.style.left = -target.offsetLeft + 'px'
            // set the target class to active
            active.classList.remove("active")
            target.classList.add("active")
        }
    }

    setLastActive([...removeActiveIndices], newActiveIndex) {
        removeActiveIndices.forEach(index => {
            this.slideItems[index].classList.remove("active")
        })
        const marginRight = parseInt(getComputedStyle(Array.from(this.track.children)[0]).marginRight)
        this.slideItems[newActiveIndex].classList.add("active")

        setTimeout(() => {
            this.track.style.left = - (this.track.offsetWidth + marginRight) * newActiveIndex + 'px'
        }, 500)
    }

    execute() {
        let startPoint = 0
        let endPoint = 0
        let isMouseDown = false;
        let willSlide = false;
        const startEvents = ["mousedown", "touchstart"]
        const moveEvents = ["mousemove", "touchmove"]
        const stopEvents = ["mouseup", "mouseleave", "touchend", "touchcancel"]

        window.addEventListener("resize", () => {
            const slidesNum = this.slideItems.length
            const lastSlide = this.slideItems[slidesNum - 1]
            const secondLastSlide = this.slideItems[slidesNum - 2]
            if (window.innerWidth >= 1380 &&
                (lastSlide.classList.contains("active") || secondLastSlide.classList.contains("active"))) {
                this.setLastActive([slidesNum - 1, slidesNum - 2], slidesNum - 3)
            }
            else if ((window.innerWidth >= 768) && lastSlide.classList.contains("active")) {
                this.setLastActive([slidesNum - 1], slidesNum - 2)
            }
        })


        // next button
        this.nextBtn.addEventListener("click", () => { this.moveCarousel(false) })

        // prev button
        this.prevBtn.addEventListener("click", () => { this.moveCarousel(true) })

        startEvents.forEach(event => {
            this.track.addEventListener(event, (e) => {
                // avoid sliding when user attempt to select text
                const node = e.target.nodeName
                if (node !== "P" && node !== "H3" && node !== "I" && node !== "SPAN") {
                    isMouseDown = true
                    // e.clientX for mouse events, the other for touch events
                    startPoint = e.clientX || e.changedTouches[0].clientX
                }
            })
        })

        stopEvents.forEach(event => {
            // target the parent container because the track width (ul) does not cover all tiles
            this.track.parentElement.addEventListener(event, (e) => {
                if (isMouseDown && willSlide) {
                    // get the point where user stop dragging/swiping
                    endPoint = e.clientX || e.changedTouches[0].clientX

                    // if mouse end point < start point, then user swiped/draged left (previous)
                    // only move if user drag at least 50 px
                    if (Math.abs(endPoint - startPoint) >= 50) {
                        this.moveCarousel(endPoint > startPoint)
                    }
                }

                isMouseDown = false
                willSlide = false
                // enable text select (text highlighting) after dragging mouse
                document.body.style.userSelect = "auto"
            })
        })

        // Slide using mouse drag or phone swipe
        moveEvents.forEach(event => {
            this.track.addEventListener(event, () => {
                if (isMouseDown) {
                    willSlide = true

                    // disable text select (text highlighting) when dragging mouse
                    document.body.style.userSelect = "none"
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
    moveToSlide(currentSlide, targetSlide) {
        // move to the target slide
        this.track.style.transform = "translateX(-" + targetSlide.style.left + ")";

        // set nextSlide to be the active slide
        currentSlide.classList.remove("active")
        targetSlide.classList.add("active")
    }

    slideUsingBtns(isNext, useButtons = true) {
        if (useButtons) {
            // Cancel auto slide after change slide using btns
            this.cancelAutoSlide()
        }


        const currentSlide = this.track.querySelector(".active")
        let siblingSlide = isNext ? currentSlide.nextElementSibling : currentSlide.previousElementSibling

        // if there's no sibling, do infinite scroll (back to start or end) 
        if (!siblingSlide) {
            // if isNext true then go back to the first slide, if false go to last slide
            siblingSlide = isNext ? this.track.querySelector("li:first-child") : this.track.querySelector("li:last-child")
        }

        this.moveToSlide(currentSlide, siblingSlide)
        this.updateIndicator(currentSlide, isNext, null, null)

        if (useButtons) {
            // Set auto slide after change slide using btns
            this.setAutoSlide()
        }
    }

    setAutoSlide() {
        this.intervalId = setInterval(() => this.slideUsingBtns(true, false), 6000)
    }

    cancelAutoSlide() {
        clearInterval(this.intervalId)
    }


    execute() {
        // arrange the slides next to one another
        this.slides.forEach((slide, index) => {
            slide.style.left = index * 100 + '%'
        })

        // next button click
        this.nextBtn.addEventListener("click", () => this.slideUsingBtns(true))

        // prev button click
        this.prevBtn.addEventListener("click", () => this.slideUsingBtns(false))

        // when user click on a dot
        this.indicator.addEventListener("click", (e) => {
            const clickedDot = e.target.closest("button")
            if (clickedDot) {
                // Cancel auto slide after change slide using inidcators
                this.cancelAutoSlide()

                const currentSlide = this.track.querySelector(".active")
                const currentDot = this.indicator.querySelector(".active")

                // return the index of the clicked dot in the dots array
                const btnIndex = this.dots.findIndex(dot => dot === clickedDot)
                const targetSlide = this.slides[btnIndex]

                this.moveToSlide(currentSlide, targetSlide)
                this.updateIndicator(null, null, currentDot, clickedDot)

                // Set auto slide after done sliding
                this.setAutoSlide()
            }
        })

        this.setAutoSlide()
    }
}

export { SmallCarousel, BigCarousel }