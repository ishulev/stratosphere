import './styles.scss';

const ACTIVE_CLASS = 'active';

function clearActives(items) {
    items.forEach(function(item) {
        item.parentNode.classList.remove(ACTIVE_CLASS);
    });
}

document.addEventListener('DOMContentLoaded', function(event) {
    const navItems = document.querySelectorAll('nav a');
    navItems.forEach(function(ele) {
        ele.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            clearActives(navItems);
            this.parentElement.classList.add(ACTIVE_CLASS);
            window.scrollTo({
                top: document.documentElement.scrollTop + Math.round(document.getElementById(targetId).getBoundingClientRect().top),
                behavior: 'smooth'
            });
        });
    });
    // window.addEventListener('scroll', function(e) {
    //     console.log(body.height)
    // })
});