import {getSortedForecast} from './getSortedForecast.js';
import {detectTypeOfForm} from './detectTypeOfForm.js';
import {createAccordionItem} from './accordion/createAccordionItem.js';
import {initForecastSlider} from './slider/initForecastSlider.js';

export const createInfoFromServer = (dataJson, calculationWrap, language, currentAge) => {
    let sortedForecastArray = getSortedForecast(dataJson.data),
        calculationAccordion = calculationWrap.querySelector('.js-calculation-accordion'),
        calculationForm = calculationWrap.querySelector('.js-form-with-calculation'),
        typeOfForm = detectTypeOfForm(calculationForm);

    calculationAccordion.id=typeOfForm + '-accordion';

    for (let i = 0; i < dataJson.data.length; i++) {
        let accordionItem = createAccordionItem(dataJson.data[i], i, language, sortedForecastArray, currentAge, calculationForm);
        
        calculationAccordion.insertAdjacentHTML('beforeend', accordionItem);
        if (dataJson.data[i].blockType === 'forecast') initForecastSlider(calculationWrap)
    }
}