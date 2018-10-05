import './styles.scss';
import images from './lazy-images.module';
import './handle-form.php';
import './favicon.png';
import smoothscroll from 'smoothscroll-polyfill';

const ACTIVE_CLASS = 'active';
const SLIDER_CLASSES = ['slide-1', 'slide-2', 'slide-3', 'slide-4'];
const TRANSITION_CLASS = 'in-transition';
const MOBILE_MENU_CLASS = 'menu--open';
const BODY_SCROLL_HIDE_CLASS = 'scroll-y--hidden';
const SUBMIT_BUTTON_DISABLED_CLASS = 'submit--disabled';

let slideNumber = 1;
let slider = null;
let submitButton = null;

smoothscroll.polyfill();

function clearActives(items) {
    items.forEach(function (item) {
        item.parentNode.classList.remove(ACTIVE_CLASS);
    });
}

function downloadImages() {
    const promiseArray = [];
    Object.keys(images).forEach(key => {
        const newImg = new Image();
        promiseArray.push(new Promise(resolve => {
            newImg.addEventListener('load', () => resolve());
        }));
        newImg.src = images[key];
    });
    return Promise.all(promiseArray);
}

function cleanSliderClasses() {
    slider.classList.remove(...SLIDER_CLASSES);
}

function setNextSlide() {
    slider.classList.add(SLIDER_CLASSES[slideNumber - 1]);
}

function toggleMobileMenu() {
    const navElement = document.querySelector('nav');
    navElement.classList.toggle(MOBILE_MENU_CLASS);
    if (navElement.classList.contains(MOBILE_MENU_CLASS)) {
        document.body.classList.add(BODY_SCROLL_HIDE_CLASS);
    }
    else {
        document.body.classList.remove(BODY_SCROLL_HIDE_CLASS);
    }
}

function startSlider() {
    slider.addEventListener('transitionend', () => {
        if (slider.classList.contains(TRANSITION_CLASS)) {
            cleanSliderClasses();
            setNextSlide();
            slider.classList.remove(TRANSITION_CLASS);
        }
    });
    setInterval(() => {
        slider.classList.add(TRANSITION_CLASS);
        if (slideNumber === SLIDER_CLASSES.length) {
            slideNumber = 1;
        }
        else {
            slideNumber++;
        }
    }, 7000);
}

function sendLoading() {
    submitButton.setAttribute('value', 'Sending...');
    submitButton.classList.add(SUBMIT_BUTTON_DISABLED_CLASS);
}

function resetSend() {
    submitButton.setAttribute('value', 'Send');
    submitButton.classList.remove(SUBMIT_BUTTON_DISABLED_CLASS);
}

function sendSuccessful() {
    submitButton.setAttribute('value', 'Sent ✔');
    submitButton.classList.remove(SUBMIT_BUTTON_DISABLED_CLASS);
}

function isProcessingSubmit() {
    return submitButton.classList.contains(SUBMIT_BUTTON_DISABLED_CLASS);
}

function clearForm(clonedFormElements) {
    const form = document.querySelector('.contact-form');
    form.reset();
}

document.addEventListener('DOMContentLoaded', function (event) {
    const navItems = document.querySelectorAll('nav a');
    const nav = document.querySelector('nav');
    slider = document.querySelector('.slider');
    submitButton = document.querySelector('[name="submit"]');
    let thinClassToggled = false;
    navItems.forEach(function (ele) {
        ele.addEventListener('click', function (e) {
            if (this.getAttribute('href').substring(0, 1) !== '#') {
                return;
            }
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            clearActives(navItems);
            this.parentElement.classList.add(ACTIVE_CLASS);
            window.scroll({
                top: Math.round(document.getElementById(targetId).offsetTop),
                left: 0,
                behavior: 'smooth'
            });
            if (document.querySelector('nav').classList.contains(MOBILE_MENU_CLASS)) {
                toggleMobileMenu();
            }
        });
    });
    downloadImages().then(startSlider);

    window.addEventListener('scroll', function (e) {
        if (document.querySelector('body').getBoundingClientRect().top < -85) {
            if (thinClassToggled) {
                return;
            }
            thinClassToggled = true;
            nav.classList.add('thin');
        }
        else {
            if (!thinClassToggled) {
                return;
            }
            thinClassToggled = false;
            nav.classList.remove('thin');
        }
    });
    document.querySelector('.hamburger').addEventListener('click', function () {
        toggleMobileMenu();
    });
    document.querySelector('.contact-form').addEventListener('submit', function (e) {
        e.preventDefault();
        if (isProcessingSubmit()) {
            return;
        }
        const data = {};
        Array.from(this.elements).forEach(ele => {
            data[ele.name] = ele.value;
        });
        const postOptions = {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, *omit
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(data), // body data type must match 'Content-Type' header
        };
        sendLoading();
        fetch(e.target.getAttribute('action'), postOptions).then(function (response) {
            return response.json();
        }).then(function (data) {
            sendSuccessful();
            clearForm();
        }).catch(function (err) {
            console.log('err ==> ', err);
            resetSend();
        }).then(() => setTimeout(() => resetSend(), 3000));
    })

});