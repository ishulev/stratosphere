import './styles.scss';
import images from './lazy-images.module';

const ACTIVE_CLASS = 'active';

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
    downloadImages().then(() => console.log('download RDY'));
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