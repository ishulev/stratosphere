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
            clearActives(navItems);
            this.parentElement.classList.toggle(ACTIVE_CLASS);
        });
    });
    window.addEventListener('scroll', function(e) {
        console.log(e);
    })
});