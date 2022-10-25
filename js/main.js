const init = () => {
  const anchorScroll = () => {
    document.querySelectorAll('p[href^="#"]').forEach(anchor => {
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


