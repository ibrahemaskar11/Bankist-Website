'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const h1 = document.querySelector('h1');
const btnsNavParent = document.querySelector('.nav__links');
const navContainer = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const intialCoords = section1.getBoundingClientRect();
const header = document.querySelector('.header');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  e.preventDefault();
  // const s1coords = section1.getBoundingClientRect()
  // console.log(s1coords);
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset)
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // })
  section1.scrollIntoView({ behavior: 'smooth' });
});

btnsNavParent.addEventListener('click', function (e) {
  e.preventDefault();
  if (!e.target.classList.contains('nav__link')) return;
  const id = e.target.getAttribute('href');
  const elPosition = document.querySelector(id);
  elPosition.scrollIntoView({ behavior: 'smooth' });
});

// tapped
tabContainer.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  tabs.forEach(el => el.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  const dataNum = clicked.dataset.tab;

  tabsContent.forEach(el => el.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${dataNum}`)
    .classList.add('operations__content--active');
});
// menu fade animiation
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = opacity;
      }
      logo.style.opacity = opacity;
    });
  }
};
navContainer.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});
navContainer.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});
// sticky navigation
// window.addEventListener('scroll', function(){
//   if(window.scrollY > intialCoords.top) {
//     navContainer.classList.add('sticky')}
//     else navContainer.classList.remove('sticky')
// })
// const obsCallback = function(entreis, observer){
//   entreis.forEach(entry => console.log(entry))
// }
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// }
// const observer = new IntersectionObserver(obsCallback, obsOptions)
// observer.observe(section1)
const navHeight = navContainer.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    navContainer.classList.add('sticky');
  } else {
    navContainer.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

const allSections = document.querySelectorAll('.section');
const revealSections = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(el => el.classList.add('section--hidden'));
allSections.forEach(el => sectionObserver.observe(el));

const imageTargets = document.querySelectorAll('img[data-src]');
const loadImages = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imagesObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});
let curSlide = 0;
const maxSlide = slides.length;
imageTargets.forEach(img => imagesObserver.observe(img));
// slider.style.transform = 'scale(0.4) translateX(-800px)';
// slider.style.overflow = 'visible';
slides.forEach(
  (slide, i) => (slide.style.transform = `translateX(${100 * i}%)`)
);
const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
const createDots = function () {
  slides.forEach((s, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide=${i}></button>`
    );
  });
};
const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};
init();
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};
sliderBtnRight.addEventListener('click', nextSlide);
sliderBtnLeft.addEventListener('click', prevSlide);
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    nextSlide();
  }
  if (e.key === 'ArrowLeft') {
    nextSlide();
  }
});
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
});

// btnsNavigation.forEach(function(el){
//   el.addEventListener('click', function(e){
//     e.preventDefault()
//     const id = this.getAttribute('href')
//     console.log(id);
//     const elPosition = document.querySelector(id)
//     elPosition.scrollIntoView({behavior: 'smooth'})
//   })
// })

// rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * Math.abs(max - min + 1 + min));
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   e.preventDefault();
//   this.style.backgroundColor = randomColor();
//   console.log("LINK", e.target, e.currentTarget);
//   e.stopPropagation()
// });
// document
//   .querySelector('.nav__links')
//   .addEventListener('click', function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log("CONTAINER", e.target, e.currentTarget);

//   });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("NAV", e.target, e.currentTarget);

// });

// // const alertH1 =  function(e){
//   alert('addEventListener: Great! You are reading the header :D')
//   h1.removeEventListener('mouseenter', alertH1)
// }

// h1.addEventListener('mouseenter',alertH1)

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');
// const allSections = document.querySelectorAll('.section')
// console.log(allSections);

// document.getElementById("section--1")
// const allButtons = document.getElementsByTagName('button')
// console.log(allButtons);

// const allButtons0 = document.getElementsByClassName('btn')
// console.log(allButtons0);

// const message = document.createElement('div')
// message.classList.add('cookie-message')
// message.innerHTML = `We use cookies for improved functionality and analytics.
// <button class = "btn btn--close-cookies"> Got it! </button>`

// // header.prepend(message)
// header.prepend(message);
// // header.before(message)
// header.after(message)

// document.querySelector('.btn--close-cookies').addEventListener('click', function(e){
//   message.remove()
// })

// message.style.backgroundColor = '#37383d'
// message.style.width = '120%'
// console.log(message.style.backgroundColor);
// console.log(message.style.color);
// console.log(getComputedStyle(message).height);

// message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

// // document.documentElement.style.setProperty('--color-primary', 'orangered')
// const logo = document.querySelector('.nav__logo')
// logo.alt = 'Beautiful minimalist logo'
// console.log(logo.src);
// console.log(logo.alt);
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'bankist')
// console.log(logo.getAttribute('company'));
// console.log(logo.getAttribute('src'));

// const link = document.querySelector('.nav__link--btn')
// console.log(link.href);
// console.log(link.getAttribute('href'));

// console.log(logo.dataset.versionNumber);

// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes)
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white'
// h1.lastElementChild.style.color = 'red'
// console.log(h1.parentNode);
// console.log(h1.parentElement);
// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function(el){
//   if(el !== h1) el.style.transform = 'scale(0.8)'
// })
