let nav = document.getElementById('nav');
let menu = document.getElementById('menu');
let mobileMenu = document.getElementById('mobile-menu');

let lastScrollY = window.scrollY;

function navUp() {
    nav.style.animationName = "navUp";
}
function navDown() {
    nav.style.animationName = "navDown";
}

window.addEventListener('scroll', (event) => {
    window.scrollY < lastScrollY || window.scrollY == 0 ? navUp() : navDown();
    lastScrollY = window.scrollY;
    putMenuUp();
})

let menuDown = false;

function putMenuDown() {
    mobileMenu.style.display = 'flex';
    menuDown = true;
}
function putMenuUp() {
    mobileMenu.style.display = 'none';
    menuDown = false;
}

menu.addEventListener('click', () => {
    if (menuDown) {
        putMenuUp();
    } else {
        putMenuDown();
    }
})

mobileMenu.addEventListener('click', () => {
    putMenuUp();
})