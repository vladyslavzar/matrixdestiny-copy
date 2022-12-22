const clearActiveArticleInTheSectionWithDiagram = (sectionWithDiagram) => {
    sectionWithDiagram.querySelector('.js-personal-calculation-item').classList.remove('-active')
}

export const activeArticleInTheSectionWithDiagram = (sectionWithDiagram, calculationWrap) => {
    let calculationAccordion = calculationWrap.querySelector('.js-calculation-accordion');

    calculationAccordion.addEventListener('shown.bs.collapse', function(e) {
        
        clearActiveArticleInTheSectionWithDiagram(sectionWithDiagram);

        let activeAccordionItem = document.querySelector(e.target).closest('.js-accordion-item'),
            activeAccordionItemName = activeAccordionItem.querySelector('.accordion__btn').text='',
            activeAccordionItemType = activeAccordionItem.getAttribute('data-block-type'),
            positionsOfActiveAccordion = activeAccordionItem.getAttribute('data-personal-calculation-positions').replace(/\s/g, "").split(',');

        if (activeAccordionItem.classList.contains('-lock') || positionsOfActiveAccordion[0] === 'null') {
            addActiveArticleInTheSectionWithDiagram(sectionWithDiagram);
            return;
        }
        for (let i = 0; i < positionsOfActiveAccordion.length; i++) {
            let position = positionsOfActiveAccordion[i],
                targetItem = sectionWithDiagram.querySelector('.js-personal-calculation-item[data-personal-calculation-position="' + position + '"]'),

                targetItemInTable = targetItem.closest('.js-health-table').length ? true : false;
            targetItem.classList.add('-active');
            if (targetItemInTable && (activeAccordionItemType === 'health' || activeAccordionItemName === 'Программы' || activeAccordionItemName === 'Programs')) {
                targetItem.closest('tr').classList.add('-active')
            }
        }
    });
    
    calculationAccordion.addEventListener('hide.bs.collapse', function(e) {
        addActiveArticleInTheSectionWithDiagram(sectionWithDiagram);
    })
}