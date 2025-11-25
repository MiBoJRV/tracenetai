document.addEventListener('DOMContentLoaded', function () {

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