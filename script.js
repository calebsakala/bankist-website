"use strict";

///////////////////////////////////////

/*
// HOW TO SELECT ELEMENTS (all these always need parameters btw): 
// By class: 
  // Matches first element. Use a dot before class name.
  document.querySelector()
  // Matches all elements and returns a node list
  document.querySelectorAll()
  // Matches all elements and returns an HTML Live Collection
  document.getElementsByClassName()

// By ID
  // Matches first element. Use a hashtag before ID.
  document.querySelector()

// By what type of element they are
  // Matches all elements and returns an HTML Live Collection
  document.getElementsByTagName()
*/

// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const message = document.createElement("div");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const navHeight = nav.getBoundingClientRect().height;

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach(btn => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

message.classList.add("cookie-message");

message.innerHTML =
  'We use cookies for improved functionality and analytics. \
  <button class="btn btn--close-cookie">Got it!</button>';

header.append(message);

document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    message.remove();
  });

message.style.backgroundColor = "#37383d";
message.style.width = "120%";
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + "px";

// IMPLEMENTING PAGE NAVIGATION
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// Tabbed component

tabsContainer.addEventListener("click", function (e) {
  // The button contains a span element and so if we click on the span element,
  // it must select the whole button; and if we select the whole button,
  // it must not select anything else.
  const clicked = e.target.closest(".operations__tab");

  // 'Guard clause' that ignores any clicks that return null
  if (!clicked) return;

  // Remove the active class from each button
  tabs.forEach(tab => tab.classList.remove("operations__tab--active"));

  // Add it to the clicked button
  clicked.classList.add("operations__tab--active");

  // Activate content area by temoving the active class from all tabs
  document
    .querySelectorAll(".operations__content")
    .forEach(tab => tab.classList.remove("operations__content--active"));

  // Add it to the tab that corresponds to the clicked button
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// Menu fade animation
const handleHover = function (e, opacity) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach(sibling => {
      if (sibling !== link) sibling.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};

// Menu fade animation
nav.addEventListener("mouseover", function (e) {
  handleHover(e, 0.7);
});

nav.addEventListener("mouseout", function (e) {
  handleHover(e, 1);
});

// Implementing a sticky navigation bar
const stickyNav = function (entries) {
  const [entry] = entries;

  entry.isIntersecting
    ? nav.classList.remove("sticky")
    : nav.classList.add("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  // section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Lazy loading images
const imgTargets = document.querySelectorAll(".lazy-img");

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach(img => imgObserver.observe(img));

// BUILDING A SLIDER COMPONENT
const slider = function () {
  let curSlide = 0;
  const slides = document.querySelectorAll(".slide");
  const maxSlides = slides.length;
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector('.dots');

  // a function that creates the dots that tells users 
  // which slide they are looking at and how many there are in the slideshow  
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML('beforeend', 
      `<button class="dots__dot" data-slide="${i}"></button>`)
    });
  }


  // giving the dots their grey colour when one is clicked
  const activateDots = function (slide) {
    let curDot;
    document.querySelectorAll('.dots__dot').forEach((dot) => {
      if (dot.classList.contains('dots__dot--active')) dot.classList.remove('dots__dot--active');
      if (Number(dot.dataset.slide) === Number(slide)) curDot = dot;
    })

    curDot.classList.add('dots__dot--active');
  }


  // function that handles moving all the slides left and right.
  const goToSlide = function (currentSlide) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${(i - currentSlide) * 100}%)`;
    });
  }


  // a function that handles going to the previous slide  
  const previousSlide = function () {
    if (curSlide === 0) curSlide = maxSlides - 1;
    else curSlide--;

    activateDots(curSlide);
    goToSlide(curSlide)
  }


  // a function that handles going to the next slide 
  const nextSlide = function () {
    if (curSlide === maxSlides - 1) curSlide = 0;
    else curSlide++;

    activateDots(curSlide);
    goToSlide(curSlide);
  }


  
  // a function that initialises the page
  const init = function () {
    createDots();
    activateDots(0);
    goToSlide(0);
  }
  init();


  // an event listener allowing you to change slides by clicking on the dots
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {  
    const {slide} = e.target.dataset;
    activateDots(slide);
    goToSlide(slide);
    }
  })

  // event listeners for both the buttons and the keypresses
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", previousSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") previousSlide();
  })
}

// calling the slider function that initialises the page and all event listeners 
slider();


document.addEventListener('DOMContentLoaded', function (e) {
  
})



/* ATTEMPTING TO IMPLEMENT TABBED COMPONENTS ON MY OWN
const parentTab = document.querySelector('.operations');

parentTab.addEventListener('click', function (e) {
  const clickedButton = e.target;

  if (clickedButton.classList.contains('operations__tab')) {
    [...clickedButton.parentElement.children].forEach(function (child) {
      if (child !== e.target && child.classList.contains('operations__tab--active')) {
        child.classList.remove('operations__tab--active');
      }
    });
    clickedButton.classList.add('operations__tab--active');
    
    parentTab.querySelectorAll('.operations__content').forEach(function (tab) {
      if (!tab.classList.contains(`operations__content--${clickedButton.dataset.tab}`) && tab.classList.contains('operations__content--active')) 
        tab.classList.remove('operations__content--active');
    })
    parentTab.querySelector(`.operations__content--${clickedButton.dataset.tab}`).classList.add('operations__content--active');
  }
});
*/
// SMOOTH SCROLLING :)

btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: "smooth",
  });
});
