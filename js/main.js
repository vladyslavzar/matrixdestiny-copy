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

  const formsContentRender = () => {
    const downloadJSAtOnload = (filename) => {
      var element = document.createElement("script");
      element.src = `js/${filename}.js`;
      document.body.appendChild(element);
    }
    
    const aboutForms = document.querySelectorAll('.aboutContainerForm');
    let renderedChild = [];
    
    aboutForms.forEach((item, i) => {
      item.querySelectorAll("input").forEach(elem => {
        elem.addEventListener('focus', () => {
          if (renderedChild.includes(i)) return;
          downloadJSAtOnload(`diagram${i}`);
          const hiddenElement = document.createElement("div");
          hiddenElement.className = "diagram hidden"
          item.appendChild(hiddenElement);
          renderedChild.push(i);
        })
      })
    })
  }

  formsContentRender();  
}

init();


