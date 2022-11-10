
const body = document.querySelector('body'),
    html = document.querySelector('html'),
    menu = document.querySelectorAll('.header__burger, .header__nav, body'),
    burger = document.querySelector('.header__burger'),
    header = document.querySelector('.header');


(function () {
  var FX = {
      easing: {
          linear: function (progress) {
              return progress;
          },
          quadratic: function (progress) {
              return Math.pow(progress, 2);
          },
          swing: function (progress) {
              return 0.5 - Math.cos(progress * Math.PI) / 2;
          },
          circ: function (progress) {
              return 1 - Math.sin(Math.acos(progress));
          },
          back: function (progress, x) {
              return Math.pow(progress, 2) * ((x + 1) * progress - x);
          },
          bounce: function (progress) {
              for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
                  if (progress >= (7 - 4 * a) / 11) {
                      return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
                  }
              }
          },
          elastic: function (progress, x) {
              return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
          }
      },
      animate: function (options) {
          var start = new Date;
          var id = setInterval(function () {
              var timePassed = new Date - start;
              var progress = timePassed / options.duration;
              if (progress > 1) {
                  progress = 1;
              }
              options.progress = progress;
              var delta = options.delta(progress);
              options.step(delta);
              if (progress == 1) {
                  clearInterval(id);
  
                  options.complete();
              }
          }, options.delay || 10);
      },
      fadeOut: function (element, options) {
          var to = 1;
          this.animate({
              duration: options.duration,
              delta: function (progress) {
                  progress = this.progress;
                  return FX.easing.swing(progress);
              },
              complete: options.complete,
              step: function (delta) {
                  element.style.opacity = to - delta;
              }
          });
      },
      fadeIn: function (element, options) {
          var to = 0;
          element.style.display = 'block';
          this.animate({
              duration: options.duration,
              delta: function (progress) {
                  progress = this.progress;
                  return FX.easing.swing(progress);
              },
              complete: options.complete,
              step: function (delta) {
                  element.style.opacity = to + delta;
              }
          });
      }
  };
  window.FX = FX;
})()

function Popup() {
  
  let body = document.querySelector('body'),
      html = document.querySelector('html'),
      duration = 200,
      popupCheck = true,
      popupCheckClose = true;

  const open = function (id) {
    if(popupCheck) {
      popupCheck = false;

      let popup = document.querySelector(id);

      if(popup) {

          body.classList.remove('_popup-active');
          html.style.setProperty('--popup-padding', window.innerWidth - body.offsetWidth + 'px');
          body.classList.add('_popup-active');

          popup.classList.add('_active');

          FX.fadeIn(popup, {
              duration: duration,
              complete: function () {
                popupCheck = true;
              }
          });

      } else {
        return new Error(`Not found "${id}"`)
      }
    }
  }

  const close = function (popupClose) {
    if (popupCheckClose) {
      popupCheckClose = false;

      let popup
      if(typeof popupClose === 'string') {
        popup = document.querySelector(popupClose)
      } else {
        popup = popupClose.closest('.popup');
      }

      FX.fadeOut(popup, {
          duration: duration,
          complete: function () {
              popup.style.display = 'none';

              body.classList.remove('_popup-active');
              html.style.setProperty('--popup-padding', '0px');
              popup.classList.remove('_active');

              popupCheckClose = true;
          }
      });
      
      }
  }

  return {
    
    open: function (id) {
      open(id);
    },

    close: function (popupClose) {
      close(popupClose)
    },

    init: function() {
      let thisTarget
      body.addEventListener('click', function(event) {
  
        thisTarget = event.target;

        let popupOpen = thisTarget.closest('.open-popup');
        if(popupOpen) {
            event.preventDefault();
            open(popupOpen.getAttribute('href'))
        }

        let popupClose = thisTarget.closest('.popup-close');
        if(popupClose) {
            close(popupClose)
        }
  
      });
    },
    
  }
}

const popup = new Popup();

popup.init()

let thisTarget;
body.addEventListener('click', function (event) {

    thisTarget = event.target;

    // =-=-=-=-=-=-=-=-=-=- <Бургер в шапке> -=-=-=-=-=-=-=-=-=-=-
    if (thisTarget.closest('.header__burger')) {
        menu.forEach(element => {
            element.classList.toggle('_active')
        })
    }
    // =-=-=-=-=-=-=-=-=-=- </Бургер в шапке> -=-=-=-=-=-=-=-=-=-=-

})

new ClipboardJS('.copy-btn');



// =-=-=-=-=-=-=-=-=-=-=-=- <scroll> -=-=-=-=-=-=-=-=-=-=-=-=


/* body.insertAdjacentHTML('beforeend', `<div class="offset-check-js"></div>`)
const offsetCheckJs = document.querySelector('.offset-check-js');
let coords = body.getBoundingClientRect();

function scroll() {
  coords = body.getBoundingClientRect();
  
  if(coords.top <= -300 && !header.classList.add('_fixed')) {
    header.style.opacity = 0;
    setTimeout(() => {
      header.classList.add('_fixed');
      header.style.opacity = 1;
    },200)
    
  } else if(coords.top > -300 && header.classList.contains('_fixed')) {
    header.style.opacity = 0;
    setTimeout(() => {
      header.classList.remove('_fixed');
      header.style.opacity = 1;
    },200)
  }
}

scroll();

window.onscroll = scroll; */

// =-=-=-=-=-=-=-=-=-=-=-=- <scroll> -=-=-=-=-=-=-=-=-=-=-=-=


// =-=-=-=-=-=-=-=-=-=-=-=- <slider> -=-=-=-=-=-=-=-=-=-=-=-=

let serversSlider;



let newsSlider = new Swiper('.news__slider', {
  
  slidesPerView: 1,
  spaceBetween: 15,

  navigation: {
      nextEl: '#news-slider-arrow-next',
      prevEl: '#news-slider-arrow-prev',
  },

  breakpoints: {
    992: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    600: {
      slidesPerView: 2,
    },
  }
  
});

// =-=-=-=-=-=-=-=-=-=-=-=- </slider> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <resize> -=-=-=-=-=-=-=-=-=-=-=-=

let resizeCheck = {}, windowSize;

function resizeCheckFunc(size, minWidth, maxWidth) {
  if (windowSize <= size && (resizeCheck[String(size)] == true || resizeCheck[String(size)] == undefined) && resizeCheck[String(size)] != false) {
    resizeCheck[String(size)] = false;
    maxWidth(); // < size
  }

  if (windowSize >= size && (resizeCheck[String(size)] == false || resizeCheck[String(size)] == undefined) && resizeCheck[String(size)] != true) {
    resizeCheck[String(size)] = true;
    minWidth(); // > size
  }
}

let slides, devSlides;

if(serversSlider.wrapperEl) {
  slides = serversSlider.wrapperEl.querySelectorAll('.swiper-slide'),
  devSlides = serversSlider.wrapperEl.querySelectorAll('.swiper-slide._dev-process');
}


function resize() {

  windowSize = window.innerWidth

  html.style.setProperty('--height-screen', window.innerHeight + 'px');
  html.style.setProperty('--height-header', header.offsetHeight + 'px');

  resizeCheckFunc(992,
    function () {  // screen > 992px

      if(serversSlider) serversSlider.destroy(true, true)

      serversSlider = new Swiper('.servers__slider', {
  
        slidesPerView: 4,
        grid: {
          rows: 2,
        },
    
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
      })

    },
    function () {  // screen < 992px

      if(serversSlider) serversSlider.destroy(true, true)

      serversSlider = new Swiper('.servers__slider', {
  
        slidesPerView: 1,
    
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    
        breakpoints: {
          768: {
            slidesPerView: 3,
          },
          500: {
            slidesPerView: 2,
          },
        }
      })
    });

      /* if(serversSlider.wrapperEl) {
        let slidesArray = [];
            
        slides.forEach(slide => {
          if(!slide.classList.contains('_dev-process')) {
            slidesArray.push(slide);
          }
        })
  
        for(let index = 0; index < devSlides.length; index++) {
          slidesArray[slidesArray.length-1].after(devSlides[index])
        }
      } */

    
  

}

resize();

window.onresize = resize;

// =-=-=-=-=-=-=-=-=-=-=-=- <resize> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <Анимации> -=-=-=-=-=-=-=-=-=-=-=-=

AOS.init({
  duration: 700,
  disable: "phone",
});

// =-=-=-=-=-=-=-=-=-=-=-=- </Анимации> -=-=-=-=-=-=-=-=-=-=-=-=


