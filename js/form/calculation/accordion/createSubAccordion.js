import {buildAccordionItem} from './buildAccordionItem.js'

const textToArray = (text) => {
    let textArray = [];

    function replaceNbsps(str) {
        let re = new RegExp(String.fromCharCode(160), "g");
        return str.replace(re, " ")
    }
    textArray = replaceNbsps(text).trim().split(/\n+/g);
    return textArray
}

const textToHtml = (text) => {
    let textArray = textToArray(text),
        textBlock = '<div class="text-block">';
    for (let i = 0; i < textArray.length; i++) {
        textBlock += '<p>' + textArray[i] + '</p>'
    }
    textBlock += '</div>';
    return textBlock
}

export const createSubAccordion = (articleBlocks, blockType, index, language, positions, typeOfForm) => {
    let subAccordion = '<div class="accordion js-second-level-accordion" id="' + typeOfForm + '-second-level-accordion">';

    for (let i = 0; i < articleBlocks.length; i++) {
        let accordionTitle = articleBlocks[i].title,
            accordionContent = '',
            accordionTextOriginal = articleBlocks[i].content,
            accordionText = textToHtml(accordionTextOriginal),
            subAccordionPositions = null;

        if (positions[i]) {
            subAccordionPositions = positions[i].join(',')
        }

        if (accordionTextOriginal.length) {
            accordionContent += '<div class="accordion__body-item">';
            accordionContent += accordionText;
            accordionContent += '</div>'
        }
        
        let isMty = articleBlocks[i].additiona && Object.keys(articleBlocks[i].additiona).length === 0 && Object.getPrototypeOf(articleBlocks[i].additiona) === Object.prototype

        if (blockType === 'health' && !isMty) {
            let accordionTextPersonalRecommendationsOriginal = articleBlocks[i].additional.personalRecommendations,
                accordionTextPersonalRecommendations = textToHtml(accordionTextPersonalRecommendationsOriginal),
                personalRecommendationsTitle = '';
            if (language === 'ru') {
                personalRecommendationsTitle = 'Личные рекомендации'
            } else if (language === 'en') {
                personalRecommendationsTitle = 'Personal recommendations'
            }
            if (accordionTextPersonalRecommendationsOriginal.length) {
                accordionContent += '<div class="accordion__body-item">';
                accordionContent += '<h5>' + personalRecommendationsTitle + '</h5>';
                accordionContent += accordionTextPersonalRecommendations;
                accordionContent += '</div>'
            }
        }
        if (accordionTitle.length && (accordionTextOriginal.length || accordionTextPersonalRecommendationsOriginal.length)) {
            subAccordion += buildAccordionItem(accordionTitle, accordionContent, index + '-' + i, false, language, blockType, subAccordionPositions, typeOfForm, true)
        }
    }
    subAccordion += '</div>';
    return subAccordion
}