import './styles.scss';

const ACTIVE_CLASS = 'active';
const SECOND_SLIDER_IMG_URL = './assets/images/Pic_2.jpg'

function clearActives(items) {
    items.forEach(function (item) {
        item.parentNode.classList.remove(ACTIVE_CLASS);
    });
}

function downloadImage() {
    // const img = new Image();
    // img.addEventListener('load', function () {
    //     console.log(img);
    // });
    // img.src = SECOND_SLIDER_IMG_URL;
    // import(SECOND_SLIDER_IMG_URL).then(function(){
    //     console.log('LOADED!');
    // });
}

document.addEventListener('DOMContentLoaded', function (event) {
    const navItems = document.querySelectorAll('nav a');
    const nav = document.querySelector('nav');
    let thinClassToggled = false;
    navItems.forEach(function (ele) {
        ele.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            clearActives(navItems);
            this.parentElement.classList.add(ACTIVE_CLASS);
            window.scrollTo({
                top: Math.round(document.documentElement.scrollTop + document.getElementById(targetId).getBoundingClientRect().top),
                behavior: 'smooth'
            });
        });
    });
    downloadImage();
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
    })
});