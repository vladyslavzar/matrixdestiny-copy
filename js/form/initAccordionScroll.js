export const initAccordionScroll = () => {
    document.querySelector('body').addEventListener('click', function(e) {
        const notAccordion = !e.target.classList.contains('js-calculation-accordion') && !e.target.classList.contains('js-accordion-item.-with-collapse') && !e.target.classList.contains('accordion__btn')

        if (notAccordion) return;
        
        e.target.closest('.js-accordion-item').querySelector('.collapse').classList.toggle('show')
    })
    document.querySelector('.js-calculation-accordion').addEventListener('hidden.bs.collapse', function() {
        e.querySelector('.js-second-level-accordion.collapse').collapse('hide')
    })
}