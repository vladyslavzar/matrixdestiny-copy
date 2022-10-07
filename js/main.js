
window.addEventListener('scroll', headerResize);

const scrollBtn = document.querySelector('.scroll-top-btn');

function headerResize() {
  if (document.documentElement.scrollTop !== 0) {
    document.querySelector('.header').classList.add("-small");
    scrollBtn.classList.add("-show");
  } else {
    document.querySelector('.header').classList.remove("-small");
    scrollBtn.classList.remove("-show");
  }
}

const burgerBtn = document.querySelector('.headerContainerBurgerMenu');

burgerBtn.addEventListener('click', () => {
	document.querySelector('.header').classList.toggle("-active")
	document.querySelector('.header__content-left-side').classList.toggle("-active")
	burgerBtn.classList.toggle("-active")
})

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

const video = document.querySelector(".video-thumbnail");

video.addEventListener('click', () => {
  video.innerHTML = `<iframe class="video-thumbnail__media" allowfullscreen="" allow="autoplay" src="https://www.youtube.com/embed/xpWZH6--aC4?rel=0&amp;showinfo=0&amp;autoplay=1"></iframe>`
})