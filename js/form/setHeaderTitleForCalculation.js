export const setHeaderTitleForCalculation = (calculationWrap, title, subTitle) => {
    calculationWrap.querySelector('.js-calculation-header-title').innerText=title;
    calculationWrap.querySelector('.js-calculation-header-sub-title').innerText=subTitle;
}