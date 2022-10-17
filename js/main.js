const init = () => {



  const ifStartedScrolling = () => {
    const scrollBtn = document.querySelector('.scroll-top-btn');

    const headerResize = () => {
      if (document.documentElement.scrollTop !== 0) {
        document.querySelector('.header').classList.add("-small");
        scrollBtn.classList.add("-show");
      } else {
        document.querySelector('.header').classList.remove("-small");
        scrollBtn.classList.remove("-show");
      }
    }
  
    window.addEventListener('scroll', headerResize);
  }

  ifStartedScrolling();

  const anchorScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        if(anchor.className.includes('js-save-diagram-in-pdf')) return;
          e.preventDefault();
          document.querySelector(this.getAttribute('href')).scrollIntoView({
              behavior: 'smooth'
          });
      });
    });
  }

  anchorScroll();

  const videoPlay = () => {
    const video = document.querySelector(".video-thumbnail");
  
    video.addEventListener('click', () => {
      video.innerHTML = `<iframe class="video-thumbnail__media" allowfullscreen="" allow="autoplay" src="https://www.youtube.com/embed/xpWZH6--aC4?rel=0&amp;showinfo=0&amp;autoplay=1"></iframe>`
    })
  }
  
  videoPlay();

  const downloadJSAtOnload = (filename) => {
    var element = document.createElement("script");
    element.src = filename;
    document.body.appendChild(element);
  }

  const formsContentRender = () => {
    const baseUrl = window.location.pathname;

    downloadJSAtOnload(`${baseUrl}/js/loadCalculation.js`)
  }

  formsContentRender();  
}

init();


