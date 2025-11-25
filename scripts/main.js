document.addEventListener('DOMContentLoaded', function () {

    // Video loading functionality
    initVideoLoading();

    // logo scrollers
    const scrollers = document.querySelectorAll(".scroller");

    // Если пользователь не выбрал уменьшенное движение, добавляем анимацию
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        addAnimation();
    }

    function addAnimation() {
        scrollers.forEach((scroller) => {
            // добавляем data-animated="true" ко всем элементам .scroller на странице
            scroller.setAttribute("data-animated", true);

            // создаем массив из элементов внутри .scroller-inner
            const scrollerInner = scroller.querySelector(".scroller__inner");
            const scrollerContent = Array.from(scrollerInner.children);

            // Для каждого элемента в массиве клонируем его и добавляем три копии
            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute("aria-hidden", true);
                scrollerInner.appendChild(duplicatedItem.cloneNode(true)); // первая копия
            });
        });
    }







//mobile menu
const buttonMobileMenu = document.querySelector('.button-mobile-menu');
const mobileContent = document.querySelector('.mobile-content');
const mobileMenuLinks = document.querySelectorAll('.mobile-content a');

let isMobileMenuOpen = false;

// Функція для відкриття/закриття мобільного меню
function toggleMobileMenu() {
    if (mobileContent) {
        mobileContent.classList.toggle('open');
        document.body.style.overflow = mobileContent.classList.contains('open') ? 'hidden' : '';
    }
}

// Обробник кліку на кнопку мобільного меню
if (buttonMobileMenu) {
    buttonMobileMenu.addEventListener('click', function () {
        toggleMobileMenu();
        buttonMobileMenu.classList.toggle('open');
    });
}

// Обробник кліку на посилання в мобільному меню
if (mobileMenuLinks.length > 0) {
    mobileMenuLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            toggleMobileMenu();
            if (buttonMobileMenu) {
                buttonMobileMenu.classList.remove('open');
            }
            document.body.style.overflow = ''; // Забираємо overflow: hidden
        });
    });
}

    /*Tabs*/

        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const tabId = this.getAttribute('data-tab');
                activateTab(tabId);
            });
        });

        function activateTab(tabId) {
            tabBtns.forEach(btn => {
                btn.classList.remove('active');
            });

            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
            const activeContent = document.getElementById(tabId);

            activeBtn.classList.add('active');
            activeContent.classList.add('active');
        }

        // Activate the first tab by default
        // activateTab(tabBtns[0].getAttribute('data-tab'));


    /*Accordion*/

        const accordionItems = document.querySelectorAll('.accordion-item');

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            const icon = item.querySelector('.accordion_arr');

            header.addEventListener('click', function () {
                const isOpen = item.classList.contains('open');

                // Закриття всіх інших відкритих секцій
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('open')) {
                        otherItem.classList.remove('open');
                        otherItem.querySelector('.accordion-content').style.maxHeight = '0';
                        // Зміна іконки плюса на мінус
                        otherItem.querySelector('.accordion_arr').setAttribute('src', 'images/plus.svg');
                    }
                });

                if (!isOpen) {
                    // Відкриття поточної секції
                    item.classList.add('open');
                    content.style.maxHeight = content.scrollHeight + 'px';
                    // Зміна іконки плюса на мінус
                    icon.setAttribute('src', 'images/minus.svg');
                } else {
                    // Закриття поточної секції
                    item.classList.remove('open');
                    content.style.maxHeight = '0';
                    // Зміна іконки мінуса на плюс
                    icon.setAttribute('src', 'images/plus.svg');
                }
            });
        });

    // --------------- SWIPER ДЛЯ ВІДГУКІВ ---------------
    const reviewsSwiper = new Swiper('.review-items.swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            991: {
                slidesPerView: 1,
                spaceBetween: 0
            },
            1350: {
                slidesPerView: 'auto',
                spaceBetween: 0
            }
        }
    });

    const reviewsSwiperMobile = new Swiper('.review-items-mobile.swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            991: {
                slidesPerView: 1,
                spaceBetween: 0
            },
            1350: {
                slidesPerView: 'auto',
                spaceBetween: 0
            }
        }
    });

    const newsSwiperElement = document.querySelector('.news-swiper');
    if (newsSwiperElement) {
        const newsSwiper = new Swiper('.news-swiper', {
            loop: true,
            autoplay: { delay: 3000, disableOnInteraction: false },
            speed: 600,
            spaceBetween: 24,
            slidesPerView: 3,
            pagination: { el: '.news-swiper .swiper-pagination', clickable: true },
            breakpoints: {
                0: {
                    slidesPerView: 1,
                    spaceBetween: 12
                },
                576: {
                    slidesPerView: 1,
                    spaceBetween: 14
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 16
                },
                1200: {
                    slidesPerView: 3,
                    spaceBetween: 24
                }
            }
        });
    }

    // --------------- IMAGE SLIDER ---------------
    const imageSliderElement = document.querySelector('.image-slider');
    if (imageSliderElement) {
        const imageSlider = new Swiper('.image-slider', {
            loop: true,
            autoplay: { delay: 4000, disableOnInteraction: false },
            speed: 800,
            spaceBetween: 0,
            slidesPerView: 'auto',
            centeredSlides: false,
            allowTouchMove: true,
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
            breakpoints: {
                0: {
                    slidesPerView: 'auto',
                    spaceBetween: 0
                },
                480: {
                    slidesPerView: 'auto',
                    spaceBetween: 0
                },
                768: {
                    slidesPerView: 'auto',
                    spaceBetween: 0
                },
                1024: {
                    slidesPerView: 'auto',
                    spaceBetween: 0
                },
                1200: {
                    slidesPerView: 'auto',
                    spaceBetween: 0
                },
                1400: {
                    slidesPerView: 'auto',
                    spaceBetween: 0
                }
            }
        });
    }

    // --------------- COOKIE BANNER ---------------
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptAllCookiesBtn = document.getElementById('acceptAllCookies');
    const closeCookiesBtn = document.getElementById('closeCookies');
    
    function checkCookieConsent() {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent && cookieBanner) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }
    }
    
    function acceptAllCookies() {
        if (cookieBanner) {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookieConsent', 'accepted');
            localStorage.setItem('cookieConsentDate', new Date().toISOString());
        }
    }
    
    function closeCookies() {
        if (cookieBanner) {
            cookieBanner.classList.remove('show');
        }
    }
    
    if (acceptAllCookiesBtn) {
        acceptAllCookiesBtn.addEventListener('click', acceptAllCookies);
    }
    
    if (closeCookiesBtn) {
        closeCookiesBtn.addEventListener('click', closeCookies);
    }
    
    checkCookieConsent();
});