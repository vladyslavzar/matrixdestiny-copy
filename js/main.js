
window.addEventListener('scroll', headerResize);


function headerResize() {
  if (document.documentElement.scrollTop !== 0) {
    document.querySelector('.header').classList.add("-small");
  } else {
    document.querySelector('.header').classList.remove("-small");
  }
}

const burgerBtn = document.querySelector('.headerContainerBurgerMenu');

burgerBtn.addEventListener('click', () => {
	document.querySelector('.header').classList.toggle("-active")
	document.querySelector('.header__content-left-side').classList.toggle("-active")
	burgerBtn.classList.toggle("-active")
})
