const getAgeRange = (forecastArray) => {
    var ageRange = [];

    function getAgeWithoutDot(age) {
        var ageWithourDot = 0;
        if (age.indexOf('.') >= 0) {
            ageWithourDot = age.split('.')[0]
        } else {
            ageWithourDot = age
        }
        return ageWithourDot
    }

    function getLeftRange(age) {
        var leftRange = 0;
        if (age.indexOf('-') >= 0) {
            leftRange = getAgeWithoutDot(age.split('-')[0])
        } else {
            leftRange = getAgeWithoutDot(age)
        }
        return +leftRange
    }

    function getRightRange(age) {
        var rightRange = 0;
        if (age.indexOf('-') >= 0) {
            rightRange = getAgeWithoutDot(age.split('-')[1])
        } else {
            rightRange = getAgeWithoutDot(age)
        }
        return +rightRange
    }
    for (var i = 0; i < forecastArray.length; i++) {
        var age = forecastArray[i].title;
        if (i === 0) {
            ageRange.push(getLeftRange(age))
        } else if (i === (forecastArray.length - 1)) {
            ageRange.push(getRightRange(age))
        }
    }
    return ageRange
}

export const createForecastSlider = (forecastArray, currentAge, language, calculationForm) => {
    let notFullFunctionality = calculationForm[0].notFullFunctionality,
        ageRange = getAgeRange(forecastArray);
    let yearsSlider = '<div class="slider-forecast-years js-slider-forecast-years"><div class="slider-forecast-years-inner">',
        textSlider = '<div class="slider-forecast-text js-slider-forecast-text">';
    let notificationText = '';

    if (language === 'ru') {
        notificationText = 'Данный пункт будет доступен в платной версии'
    } else if (language === 'en') {
        notificationText = 'This article will be available in the paid version'
    }

    let activeSlide = true;

    for (let i = 0; i < forecastArray.length; i++) {
        let title = forecastArray[i].title,
            text = forecastArray[i].content.trim().replace(/\n+/g, '</p><p>');

        let titleWithFourOrNineInTheEnd = title.substr(title.length - 1) === '4' || title.substr(title.length - 1) === '9',
            age;

        if (currentAge.months <= 6) {
            age = currentAge.years
        } else if (currentAge.months > 6) {
            if (titleWithFourOrNineInTheEnd) {
                age = currentAge.years
            } else {
                age = (currentAge.years + 1).toString()
            }
        }

        let ageIsInRange = (currentAge.years >= ageRange[0] && currentAge.years <= ageRange[1]),
            suitableForActive = title === currentAge.years.toString() || (title.indexOf(age) !== -1 && title[title.indexOf(age) - 1] !== '.') ? true : false;
            
        if (ageIsInRange && suitableForActive && activeSlide) {
            activeSlide = false;
            yearsSlider += '<div><p class="forecast-years-item -active">' + title + '</p></div>';
            textSlider += '<div><p>' + text + '</p></div>'
        } else {
            yearsSlider += '<div><p class="forecast-years-item">' + title + '</p></div>';
            if (notFullFunctionality) {
                if (i === 0 && !ageIsInRange) {
                    textSlider += '<div><p>' + text + '</p></div>'
                } else {
                    textSlider += '<div><p>' + notificationText + '</p></div>'
                }
            } else {
                textSlider += '<div><p>' + text + '</p></div>'
            }
        }
    }
    yearsSlider += '</div></div>';
    textSlider += '</div>';
    return [yearsSlider, textSlider]
}