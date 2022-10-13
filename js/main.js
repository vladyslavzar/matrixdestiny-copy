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
      element.src = filename;
      document.body.appendChild(element);
    }
    const downloadCssAtOnload = (filename) => {
      let head = document.getElementsByTagName('HEAD')[0];
 
      let link = document.createElement('link');

      link.rel = 'stylesheet';
   
      link.type = 'text/css';
   
      link.href = filename;
      head.appendChild(link);
    }
    
    const aboutForms = document.querySelectorAll('.js-form-with-calculation');
    let renderedChild = false;
    
    aboutForms.forEach((item, i) => {
      item.querySelectorAll("input").forEach(elem => {
        elem.addEventListener('focus', () => {
          if (renderedChild) return;
          const baseUrl = window.location.pathname;
          downloadJSAtOnload(`https://code.jquery.com/jquery-3.6.1.min.js`);
          downloadJSAtOnload(`https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.19.5/jquery.validate.min.js`);
          downloadJSAtOnload(`https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js`);
          downloadJSAtOnload(`https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.2/js/bootstrap.min.js`);
          downloadJSAtOnload(`${baseUrl}/js/diagram.js`);
          downloadCssAtOnload(`${baseUrl}/css/diagram.css`);
          downloadCssAtOnload(`https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css`);
          
          renderedChild=true;
        }, { once: true })
      })
    })
  }

  formsContentRender();  
}

init();


