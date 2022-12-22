import {detectTypeOfForm} from '../detectTypeOfForm.js';
import {createForecastSlider} from '../slider/createForecastSlider.js';
import {buildAccordionItem} from './buildAccordionItem.js'; 
import {createSubAccordion} from './createSubAccordion.js';

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

export const createAccordionItem = (articleObject, index, language, sortedForecastArray, currentAge, calculationForm) => {

    let accordionItem = '',
        title = articleObject.title,
        accordionContent = '',
        bodyObject = articleObject.blocks,
        blockType = articleObject.blockType,
        positions = articleObject.positions === undefined ? null : articleObject.positions,
        itemIsLock = calculationForm.length && calculationForm[0].notFullFunctionality && !articleObject.trialAccess,
        emptySectionText = (bodyObject === null || bodyObject.length === 0),
        typeOfForm = detectTypeOfForm(calculationForm);

    if (bodyObject === null || bodyObject.length === 0) return;

    if (positions !== null && blockType !== 'health') {
        let positionsJoin = '';
        for (let i = 0; i < positions.length; i++) {
            positionsJoin += positions[i].join(',');
            if (i !== positions.length - 1) {
                positionsJoin += ","
            }
        }
        positions = positionsJoin
    }

    if (emptySectionText) return;
    
    switch (blockType) {
        case 'forecast':
            accordionContent += createForecastSlider(sortedForecastArray, currentAge, language, calculationForm)[0];
            accordionContent += createForecastSlider(sortedForecastArray, currentAge, language, calculationForm)[1];
            accordionItem = buildAccordionItem(title, accordionContent, index, itemIsLock, language, blockType, null, typeOfForm);
            break;
        case 'health':
            accordionContent += createSubAccordion(bodyObject, blockType, index, language, positions, typeOfForm);
            accordionItem = buildAccordionItem(title, accordionContent, index, itemIsLock, language, blockType, null, typeOfForm);
            break;
        default:
            let resultWithAboveTitle = calculationForm.getAttribute('data-result-type') === 'with-above-title';
            if (resultWithAboveTitle) {
                for (let i = 0; i < bodyObject.length; i++) {
                    let titleOfSection = bodyObject[i].title,
                        textOfSectionOriginal = bodyObject[i].content,
                        textOfSection = textToHtml(textOfSectionOriginal);
                    accordionContent = '';
                    if (typeOfForm = 'compatibility') {
                        if (index === 0 && i === 0) {
                            itemIsLock = false
                        } else {
                            itemIsLock = calculationForm.length && calculationForm[0].notFullFunctionality
                        }
                    }
                    accordionContent += '<div class="accordion__body-item">';
                    if (textOfSectionOriginal.length) {
                        accordionContent += textOfSection
                    }
                    accordionContent += '</div>';
                    if (i === 0) {
                        accordionItem = '<h5 class="mt-4">' + title + '</h5>' + buildAccordionItem(titleOfSection, accordionContent, (index + '-' + i), itemIsLock, language, blockType, null, typeOfForm)
                    } else {
                        accordionItem += buildAccordionItem(titleOfSection, accordionContent, (index + '-' + i), itemIsLock, language, blockType, null, typeOfForm)
                    }
                }
            } else {
                for (let i = 0; i < bodyObject.length; i++) {
                    let titleOfSection = bodyObject[i].title,
                        textOfSectionOriginal = bodyObject[i].content,
                        textOfSection = textToHtml(textOfSectionOriginal);
                    accordionContent += '<div class="accordion__body-item">';
                    if (titleOfSection.length && title !== titleOfSection) {
                        accordionContent += '<h5>' + titleOfSection + '</h5>'
                    }
                    if (textOfSectionOriginal.length) {
                        accordionContent += textOfSection
                    }
                    accordionContent += '</div>';
                    accordionItem = buildAccordionItem(title, accordionContent, index, itemIsLock, language, blockType, positions, typeOfForm)
                }
            }
            break
    }
    return accordionItem
}
