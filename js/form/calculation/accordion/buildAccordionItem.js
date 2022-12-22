export const buildAccordionItem = (accordionTitle, accordionContent, index, itemIsLock, language, blockType, positions, typeOfForm, secondLevel) => {
    let accordionItem = '',
        collapseAccordionId = 'collapse-' + typeOfForm + '-' + index,
        secondLevelAccordion = '';
    if (secondLevel) {
        secondLevelAccordion = "-second-level"
    }
    
    if (positions === undefined) positions = null;

    if (itemIsLock) {
        let popoverText = '';

        if (language === 'ru') {
            popoverText = 'Данный пункт будет доступен в платной версии';
        } else if (language === 'en') {
            popoverText = 'This article will be available in the paid version';
        }
        accordionItem += '<div class="accordion__item -lock js-accordion-item" data-block-type="' + blockType + '">';
        accordionItem += '<button class="accordion__btn" type="button" data-toggle="popover" data-content="' + popoverText + '">' + accordionTitle + '</button>';
        accordionItem += '</div>'
    } else {
        accordionItem += '<div class="accordion__item -with-collapse js-accordion-item" data-block-type="' + blockType + '" data-personal-calculation-positions="' + positions + '">';
        accordionItem += '<button class="accordion__btn" type="button" data-toggle="collapse" data-target="#' + collapseAccordionId + '" aria-expanded="false" aria-controls="' + collapseAccordionId + '">' + accordionTitle + '</button>';
        accordionItem += '<div class="collapse" id="' + collapseAccordionId + '" data-parent="#' + typeOfForm + secondLevelAccordion + '-accordion">';
        accordionItem += '<div class="accordion__body">';
        accordionItem += accordionContent;
        accordionItem += '</div></div></div>'
    }
    return accordionItem
}