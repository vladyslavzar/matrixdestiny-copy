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

const downloadJSAtOnload = (filename) => {
  let element = document.createElement("script");
  element.src = filename;
  element.type = 'module';
  document.body.appendChild(element);
}

const formsContentRender = () => {
  let isDone = false;
  const baseUrl = window.location.pathname;
  return () => {
    if(!isDone) {
      isDone = true;
      downloadJSAtOnload(`${baseUrl}/js/loadCalculation.js`);
    }
  }

}

const init = () => {
  anchorScroll();

  document.addEventListener('input', formsContentRender());  
}

init();
