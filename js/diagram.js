
function initAccordionScroll() {
    document.querySelector('body').addEventListener('click', function(e) {
        if (!e.target.classList.contains('js-calculation-accordion') && !e.target.classList.contains('js-accordion-item.-with-collapse') && !e.target.classList.contains('accordion__btn')) {
            return
        }
        e.target.closest('.js-accordion-item').querySelector('.collapse').classList.toggle('show')
    })
    document.querySelector('.js-calculation-accordion').addEventListener('hidden.bs.collapse', function() {
        e.querySelector('.js-second-level-accordion.collapse').collapse('hide')
    })
}

function initCalculation() {
    initAccordionScroll();
    function initPopovers() {
        // function calculationAccordionPopover() {
        //     var calculationAccordionPopoverSelector = document.querySelector('.js-calculation-accordion [data-toggle="popover"]'),
        //         hideTimeout;
        //     var popover = new bootstrap.Popover(calculationAccordionPopoverSelector, {
        //         trigger: 'hover | focus',
        //         placement: 'right',
        //         offset: '0, -100% + 50px'
        //     })
        //     calculationAccordionPopoverSelector.addEventListener('shown.bs.popover', function(e) {
        //         clearTimeout(hideTimeout);
        //         hideTimeout = setTimeout(function() {
        //             document.querySelector(e.target).popover('hide')
        //         }, 2000)
        //     })
        // }
        // calculationAccordionPopover();
        // document.querySelector('.js-popover').popover({
        //     trigger: 'hover | focus',
        //     placement: 'right',
        //     offset: '0, 20px'
        // })
    }
    
    
    function initForecastSlider(calculationWrap) {

        var initialSlide = 0,
            forecastYearsSlider = calculationWrap.querySelector('.js-slider-forecast-years'),
            forecastTextSlider = calculationWrap.querySelector('.js-slider-forecast-text');
        if (!forecastYearsSlider) return;
        forecastYearsSlider.querySelectorAll('.forecast-years-item').forEach(function(e, index) {
            if (e.classList.contains('-active')) {
                initialSlide = index
            }
        });
        if (forecastYearsSlider) {
            forecastYearsSlider.innerHTML = ''
        }
        if (forecastTextSlider) {
            forecastTextSlider.innerHTML = ''
        }
    }


    function detectNotFullFunctionality() {
        var formWithCalculation = document.querySelectorAll('.js-form-with-calculation');
        if (!formWithCalculation.length) return;
        formWithCalculation.forEach(function(e) {
            if (e.classList.contains('js-not-full-functionality')) {
                e[0].notFullFunctionality = !0
            } else {
                e[0].notFullFunctionality = !1
            }
        })
    }
    detectNotFullFunctionality();

    function showPreloader() {
        document.querySelector('.js-preloader').classList.add('-show');
    }

    function hidePreloader() {
        document.querySelector('.js-preloader').classList.remove('-show')
    }

    function getSortedForecast(data) {
        var forecastArray = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].blockType === "forecast") {
                var allForecastBlocks = data[i];
                for (var j = 0; j < allForecastBlocks.blocks.length; j++) {
                    var title = allForecastBlocks.blocks[j].title,
                        firstYearValue = (title.indexOf("-") !== -1) ? +title.split("-")[0] : +title,
                        text = allForecastBlocks.blocks[j].content;
                    var skipParent = !1;
                    for (var k = 0; k < forecastArray.length; k++) {
                        if (forecastArray[k].title === title) {
                            skipParent = !0
                        }
                    }
                    if (skipParent) continue;
                    forecastArray.push({
                        title: title,
                        content: text,
                        id: firstYearValue
                    })
                }
            }
        }
        forecastArray.sort(function(a, b) {
            if (a.id > b.id) {
                return 1
            }
            if (a.id < b.id) {
                return -1
            }
            return 0
        });
        return forecastArray
    }

    function detectTypeOfForm(form) {
        var typeOfForm = "";
        switch (!0) {
            case (form.classList.contains('js-check-date-form')):
                typeOfForm = "check-date";
                break;
            case (form.classList.contains('js-compatibility-form')):
                typeOfForm = "compatibility";
                break;
            case (form.classList.contains('js-childrens-matrix-form')):
                typeOfForm = "childrens-matrix";
                break
        }
        return typeOfForm
    }

    function getAgeRange(forecastArray) {
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

    function getAgeFromBirthdate(birthDate, ageAtDate) {
        var daysInMonth = 30.436875,
            dob = new Date(birthDate.split('.').reverse().join('-')),
            aad;
        if (!ageAtDate) {
            aad = new Date()
        } else {
            aad = new Date(ageAtDate)
        }
        var yearAad = aad.getFullYear(),
            yearDob = dob.getFullYear(),
            years = yearAad - yearDob;
        dob.setFullYear(yearAad);
        var aadMillis = aad.getTime(),
            dobMillis = dob.getTime();
        if (aadMillis < dobMillis) {
            --years;
            dob.setFullYear(yearAad - 1);
            dobMillis = dob.getTime()
        }
        var days = (aadMillis - dobMillis) / 86400000,
            monthsDec = days / daysInMonth,
            months = Math.floor(monthsDec);
        days = Math.floor(daysInMonth * (monthsDec - months));
        var finalCalculations = {
            years: years,
            months: months,
            days: days
        };
        return finalCalculations
    }

    function scrollToBeginOfCalculation(calculationWrap) {
        var calculationAnchorSection = calculationWrap.querySelector('.js-anchor-section'),
            additionalOffset = 0;
        if (document.querySelectorAll('.blog-article').length) {
            additionalOffset = 50
        }
        // $('body, html').animate({
        //     scrollTop: calculationAnchorSection.offsetTop + additionalOffset
        // }, 500)
    }


    function resetForm(form) {
        form.querySelector('input[type="text"]').value = '';
        form.querySelectorAll('select').forEach(function(e) {
            e.querySelectorAll('option')[0].selected=true;
        })
    }

    function textToArray(text) {
        var textArray = [];

        function replaceNbsps(str) {
            var re = new RegExp(String.fromCharCode(160), "g");
            return str.replace(re, " ")
        }
        textArray = replaceNbsps(text).trim().split(/\n+/g);
        return textArray
    }

    function textToHtml(text) {
        var textArray = textToArray(text),
            textBlock = '<div class="text-block">';
        for (var i = 0; i < textArray.length; i++) {
            textBlock += '<p>' + textArray[i] + '</p>'
        }
        textBlock += '</div>';
        return textBlock
    }

    function findRightForecast(data, currentAge) {
        var rightForecast = [{}];
        var sortedForecastArray = getSortedForecast(data),
            ageRange = getAgeRange(sortedForecastArray),
            notSuitableAge = currentAge.years < ageRange[0] || currentAge.years > ageRange[1],
            activeAge = !0;
        if (notSuitableAge) return rightForecast;
        for (var i = 0; i < data.length; i++) {
            if (data[i].blockType === 'forecast') {
                for (var j = 0; j < sortedForecastArray.length; j++) {
                    var title = sortedForecastArray[j].title,
                        text = sortedForecastArray[j].content;
                    var titleWithFourOrNineInTheEnd = title.substr(title.length - 1) === '4' || title.substr(title.length - 1) === '9',
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
                    var suitableForActive = title === currentAge.years.toString() || (title.indexOf(age) !== -1 && title[title.indexOf(age) - 1] !== '.') ? !0 : !1;
                    if (suitableForActive && activeAge) {
                        activeAge = !1;
                        rightForecast = [{
                            'title': title,
                            'text': text
                        }]
                        if (j + 1 < sortedForecastArray.length) {
                            rightForecast.push({
                                title: sortedForecastArray[j + 1].title,
                                text: sortedForecastArray[j + 1].content
                            })
                        }
                        if (j + 2 < sortedForecastArray.length) {
                            rightForecast.push({
                                title: sortedForecastArray[j + 2].title,
                                text: sortedForecastArray[j + 2].content
                            })
                        }
                    }
                }
            }
        }
        return rightForecast
    }

    function createForecastSlider(forecastArray, currentAge, language, calculationForm) {
        var notFullFunctionality = calculationForm[0].notFullFunctionality,
            ageRange = getAgeRange(forecastArray);
        var yearsSlider = '<div class="slider-forecast-years js-slider-forecast-years">',
            textSlider = '<div class="slider-forecast-text js-slider-forecast-text">';
        var notificationText = '';
        if (language === 'ru') {
            notificationText = 'Данный пункт будет доступен в платной версии'
        } else if (language === 'en') {
            notificationText = 'This article will be available in the paid version'
        }
        var activeSlide = !0;
        for (var i = 0; i < forecastArray.length; i++) {
            var title = forecastArray[i].title,
                text = forecastArray[i].content.trim().replace(/\n+/g, '</p><p>');
            var titleWithFourOrNineInTheEnd = title.substr(title.length - 1) === '4' || title.substr(title.length - 1) === '9',
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
            var ageIsInRange = (currentAge.years >= ageRange[0] && currentAge.years <= ageRange[1]),
                suitableForActive = title === currentAge.years.toString() || (title.indexOf(age) !== -1 && title[title.indexOf(age) - 1] !== '.') ? !0 : !1;
            if (ageIsInRange && suitableForActive && activeSlide) {
                activeSlide = !1;
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
        yearsSlider += '</div>';
        textSlider += '</div>';
        return [yearsSlider, textSlider]
    }

    function buildAccordionItem(accordionTitle, accordionContent, index, itemIsLock, language, blockType, positions, typeOfForm, secondLevel) {
        var accordionItem = '',
            collapseAccordionId = 'collapse-' + typeOfForm + '-' + index,
            secondLevelAccordion = '';
        if (secondLevel) {
            secondLevelAccordion = "-second-level"
        }
        if (positions === undefined) positions = null;
        if (itemIsLock) {
            var popoverText = '';
            if (language === 'ru') {
                popoverText = 'Данный пункт будет доступен в платной версии'
            } else if (language === 'en') {
                popoverText = 'This article will be available in the paid version'
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

    function createSubAccordion(articleBlocks, blockType, index, language, positions, typeOfForm) {
        var subAccordion = '<div class="accordion js-second-level-accordion" id="' + typeOfForm + '-second-level-accordion">';
        for (var i = 0; i < articleBlocks.length; i++) {
            var accordionTitle = articleBlocks[i].title,
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
                var accordionTextPersonalRecommendationsOriginal = articleBlocks[i].additional.personalRecommendations,
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
                subAccordion += buildAccordionItem(accordionTitle, accordionContent, index + '-' + i, !1, language, blockType, subAccordionPositions, typeOfForm, !0)
            }
        }
        subAccordion += '</div>';
        return subAccordion
    }

    function createAccordionItem(articleObject, index, language, sortedForecastArray, currentAge, calculationForm) {
        var accordionItem = '',
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
            var positionsJoin = '';
            for (var i = 0; i < positions.length; i++) {
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
                var resultWithAboveTitle = calculationForm.getAttribute('data-result-type') === 'with-above-title';
                if (resultWithAboveTitle) {
                    for (var i = 0; i < bodyObject.length; i++) {
                        var titleOfSection = bodyObject[i].title,
                            textOfSectionOriginal = bodyObject[i].content,
                            textOfSection = textToHtml(textOfSectionOriginal);
                        accordionContent = '';
                        if (typeOfForm = 'compatibility') {
                            if (index === 0 && i === 0) {
                                itemIsLock = !1
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
                    for (var i = 0; i < bodyObject.length; i++) {
                        var titleOfSection = bodyObject[i].title,
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

    function createInfoFromServer(dataJson, calculationWrap, language, currentAge) {
        var sortedForecastArray = getSortedForecast(dataJson.data),
            calculationAccordion = calculationWrap.querySelector('.js-calculation-accordion'),
            calculationForm = calculationWrap.querySelector('.js-form-with-calculation'),
            typeOfForm = detectTypeOfForm(calculationForm);
        calculationAccordion.id=typeOfForm + '-accordion';
        for (var i = 0; i < dataJson.data.length; i++) {
            var accordionItem = createAccordionItem(dataJson.data[i], i, language, sortedForecastArray, currentAge, calculationForm);
            calculationAccordion.insertAdjacentHTML('beforeend', accordionItem);
            if (dataJson.data[i].blockType === 'forecast') initForecastSlider(calculationWrap)
        }
        initPopovers()
    }

    function getHeaderTitlesForCalculation(typeOfForm, language, name, dob, dob2) {
        var headerTitles = {
            title: '',
            subTitle: ''
        }
        if (language === 'ru') {
            switch (typeOfForm) {
                case 'check-date':
                    headerTitles.title = 'Информация о вас:';
                    break;
                case 'compatibility':
                    headerTitles.title = 'Ваша совместимость:';
                    break;
                case 'childrens-matrix':
                    headerTitles.title = 'Информация о ребёнке:';
                    break
            }
        } else if (language === 'en') {
            switch (typeOfForm) {
                case 'check-date':
                    headerTitles.title = 'Information about you:';
                    break;
                case 'compatibility':
                    headerTitles.title = 'Your compatibility:';
                    break;
                case 'childrens-matrix':
                    headerTitles.title = 'Information about the child:';
                    break
            }
        }
        switch (typeOfForm) {
            case 'check-date':
                headerTitles.subTitle = name + ' (' + dob + ')';
                break;
            case 'compatibility':
                headerTitles.subTitle = dob + ' + ' + dob2;
                break;
            case 'childrens-matrix':
                headerTitles.subTitle = name + ' (' + dob + ')';
                break
        }
        return headerTitles
    }

    function setHeaderTitleForCalculation(calculationWrap, title, subTitle) {
        calculationWrap.querySelector('.js-calculation-header-title').innerText=title;
        calculationWrap.querySelector('.js-calculation-header-sub-title').innerText=subTitle
    }

    function convertDataForEditorAndSave(response, age, language) {
        var data = response.data,
            formattedArray = [];

        function setDefaultSubTitleAndText(title = "", subTitle = "", text = "") {
            var textArray = textToArray(text);
            if (subTitle.length && subTitle !== title) {
                formattedArray.push({
                    type: 'header',
                    data: {
                        text: subTitle,
                        level: 5
                    }
                })
            }
            if (text.length > 10) {
                for (var i = 0; i < textArray.length; i++) {
                    formattedArray.push({
                        type: 'paragraph',
                        data: {
                            text: textArray[i]
                        }
                    })
                }
            }
        }
        for (var i = 0; i < data.length; i++) {
            var blockType = data[i].blockType,
                title = data[i].title,
                blocks = data[i].blocks;
            if (blocks === null) continue;
            if (blockType === 'forecast') {
                let fc = findRightForecast(data, age);
                fc.forEach((forecastContent, idx) => {
                    if (!fc[0].text) {
                        return
                    }
                    if (idx === 0) {
                        formattedArray.push({
                            type: 'header',
                            data: {
                                text: title,
                                level: 4
                            }
                        })
                    }
                    var forecastSubTitle = forecastContent.title,
                        forecastText = forecastContent.text;
                    setDefaultSubTitleAndText(title, forecastSubTitle, forecastText)
                })
            } else {
                formattedArray.push({
                    type: 'header',
                    data: {
                        text: title,
                        level: 4
                    }
                })
                for (var j = 0; j < blocks.length; j++) {
                    var subTitle = blocks[j].title,
                        text = blocks[j].content;
                    setDefaultSubTitleAndText(title, subTitle, text);
                    if (blockType === 'health') {
                        var personalRecommendationSubTitle = (language === 'ru' ? 'Личные рекомендации' : (language === 'en' ? 'Personal recommendations' : '')),
                            personalRecommendationText = blocks[j].additional.personalRecommendations;
                        setDefaultSubTitleAndText(title, personalRecommendationSubTitle, personalRecommendationText)
                    }
                }
            }
        }
        return formattedArray
    }

    function fillInTheDiagram(combinations, sectionWithDiagram) {
        var personalCalculationItems = sectionWithDiagram.querySelectorAll('.js-personal-calculation-item');
        personalCalculationItems.forEach(function(e) {
            var personalCalculationPosition = e.getAttribute('data-personal-calculation-position');
            e.innerText=combinations[personalCalculationPosition]
        })
    }

    function clearActiveArticleInTheSectionWithDiagram(sectionWithDiagram) {
        sectionWithDiagram.querySelector('.js-personal-calculation-item').classList.remove('-active')
    }

    function addActiveArticleInTheSectionWithDiagram(sectionWithDiagram) {
        sectionWithDiagram.querySelector('.js-personal-calculation-item').classList.add('-active')
    }

    function clearActiveRowInTable(sectionWithDiagram) {
        // sectionWithDiagram.querySelector('.js-health-table').classList.remove('-active')
    }

    function activeArticleInTheSectionWithDiagram(sectionWithDiagram, calculationWrap) {
        var calculationAccordion = calculationWrap.querySelector('.js-calculation-accordion');
        calculationAccordion.addEventListener('shown.bs.collapse', function(e) {
            clearActiveArticleInTheSectionWithDiagram(sectionWithDiagram);
            clearActiveRowInTable(sectionWithDiagram);
            var activeAccordionItem = document.querySelector(e.target).closest('.js-accordion-item'),
                activeAccordionItemName = activeAccordionItem.querySelector('.accordion__btn').text='',
                activeAccordionItemType = activeAccordionItem.getAttribute('data-block-type'),
                positionsOfActiveAccordion = activeAccordionItem.getAttribute('data-personal-calculation-positions').replace(/\s/g, "").split(',');
            if (activeAccordionItem.classList.contains('-lock') || positionsOfActiveAccordion[0] === 'null') {
                addActiveArticleInTheSectionWithDiagram(sectionWithDiagram);
                return
            }
            for (var i = 0; i < positionsOfActiveAccordion.length; i++) {
                var position = positionsOfActiveAccordion[i],
                    targetItem = sectionWithDiagram.querySelector('.js-personal-calculation-item[data-personal-calculation-position="' + position + '"]'),
                    targetItemInTable = targetItem.closest('.js-health-table').length ? !0 : !1;
                targetItem.classList.add('-active');
                if (targetItemInTable && (activeAccordionItemType === 'health' || activeAccordionItemName === 'Программы' || activeAccordionItemName === 'Programs')) {
                    targetItem.closest('tr').classList.add('-active')
                }
            }
        });
        calculationAccordion.addEventListener('hide.bs.collapse', function(e) {
            addActiveArticleInTheSectionWithDiagram(sectionWithDiagram);
            clearActiveRowInTable(sectionWithDiagram)
        })
    }

    function cloneDiagramSection(calculationWrap) {
        // var diagram = calculationWrap.querySelector('.js-section-with-diagram'),
        //     cloneWrapTarget = calculationWrap.querySelector('.js-print-diagram-wrap');
        // console.log(calculationWrap, 'cloneDiagramSection(calculationWrap)');
        // console.log(diagram, 'diagram(calculationWrap)');
        // console.log(cloneWrapTarget, 'cloneWrapTarget(calculationWrap)');
        // cloneWrapTarget.querySelector('.js-section-with-diagram').remove();
        // cloneWrapTarget.append(diagram.clone().classList.remove('.js-personal-calculation-item'))
    }
    // $.validator.addMethod("checkDate", function(value, element) {
    //     return value.match(/^(0?[0-9]|[12][0-9]|3[0-1])[/., -](0?[0-9]|1[0-2])[/., -](\d{4})$/)
    // }, "Пожалуйста введите корректную дату.");
    document.querySelector('.js-check-date-form').addEventListener('submit', (e) => {
            e.preventDefault();
            var form = e.target,
                typeOfForm = detectTypeOfForm(form),
                calculationWrap = form.closest('.js-calculation-wrap'),
                sectionWithDiagram = calculationWrap.querySelector('.js-section-with-diagram'),
                saveButton = calculationWrap.querySelector('.js-save-info-in-pdf'),
                saveFromEditorButton = calculationWrap.querySelector('.js-save-from-editor'),
                saveDiagramButton = calculationWrap.querySelector('.js-save-diagram-in-pdf'),
                formName = form.querySelector('#name').value,
                formDob = form.querySelector('#dob').value,
                age = getAgeFromBirthdate(formDob),
                appeal = form.querySelector('#appeal').value,
                gender = form.querySelector('#gender').value,
                product_id = +form.querySelector("#product_id").value,
                pid = form.querySelector("#pid").value,
                language = form.querySelector('#language').value,
                edw_var = '';
            if (document.querySelector('.js-check-date-form').classList.contains('js-not-full-functionality')) {
                edw_var = "&edw=1"
            }
            var queryString = formDob + "?gender=" + gender + "&language=" + language + "&appeal=" + (appeal || 'p') + edw_var;
            // saveButton.dataset.queryString=(queryString);
            // saveButton.dataset.nameString=(formName);
            // saveButton.dataset.dobString=(formDob);
            // saveButton.dataset.languageString=(language);
            saveFromEditorButton.dataset.nameString=(formName);
            saveFromEditorButton.dataset.dobString=(formDob);
            saveFromEditorButton.dataset.languageString=(language);
            saveDiagramButton.dataset.nameString=(formName);
            saveDiagramButton.dataset.dobString=(formDob);
            saveDiagramButton.dataset.languageString=(language);
            showPreloader();
            
            const response ={
                "ok": true,
                "data": [
                 {
                  "imageName": "personal_features",
                  "title": "Личные Качества",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 3276,
                    "content": "Человек может находиться в позитивном и негативном состоянии. В позитивном – у человека все хорошо, он прекрасно себя чувствует. Живет легко, всем доволен и счастлив. Когда проявляется негативное состояние – это означает, что человек “сбился с пути”. В жизни могут возникать негативные ситуации или трудности. Как только возвращается в “позитив”, неприятности заканчиваются, а жизнь налаживается.\n",
                    "created": "2020-09-02T01:12:49.838721Z",
                    "edited": "2020-09-02T01:12:49.838722Z",
                    "type_id": 101,
                    "language": "ru",
                    "personal": false,
                    "combination": "1",
                    "gender": "",
                    "type": "info",
                    "title": "Личные Качества",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 4702,
                    "content": "(1) Вам от рождения даны уникальные способности, острый ум, способный постигать суть любого явления. Вы очень чувствительны к разного рода энергиям и можете использовать их для продвижения своей деятельности. Ваши мысли и желания начинают материализоваться буквально на глазах. Вам важно самореализоваться в социуме. Этому способствует и ваш оптимистичный взгляд на мир, в хорошем значении этого понятия - даже несколько авантюрный. Вы легки на подъем, с готовностью идете на эксперименты и воспринимаете все новое. У вас всегда множество идей для новых проектов, которыми (как и своими знаниями) вы с готовностью делитесь. Вы стремитесь к яркой жизни, полной приключений и интересных открытий. Деятельный характер позволяет много путешествовать и обзаводиться знакомствами. Свободу вы цените превыше всего.",
                    "created": "2020-09-02T01:14:23.978758Z",
                    "edited": "2020-09-02T01:14:23.978759Z",
                    "type_id": 1,
                    "language": "ru",
                    "personal": true,
                    "combination": "1",
                    "gender": "",
                    "type": "expandable",
                    "title": "В позитиве",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 4580,
                    "content": "(1) Уникальные способности и особое видение мира дают вам много прав и возможностей. Иногда это реализуется в негативном ключе. Тогда вы можете признавать правым только себя, уважать исключительно свою личность, как ценную и значимую. Окружающих же стараетесь подавлять и использовать в своих интересах. Эгоизм может выражаться (в худшем случае) и в злоупотреблении своими способностями управления энергией. С другой стороны, может быть неверие в себя, различные комплексы. Вы не любите себя и не доверяете собственным способностям и ощущениям. Болезненно воспринимаете критику и не умеете дарить прощение, отпускать обиду. Не доводите начатое до логического завершения, бросая проекты почти сразу после начала.",
                    "created": "2020-09-02T01:14:16.607644Z",
                    "edited": "2020-09-02T01:14:16.607645Z",
                    "type_id": 2,
                    "language": "ru",
                    "personal": true,
                    "combination": "1",
                    "gender": "",
                    "type": "expandable",
                    "title": "В негативе",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 4626,
                    "content": "(8) Для вас свойственно выступать судьей или адвокатом в самых разных спорах. Не удивительно, что вы можете выбрать себе и схожую специальность. Однако важно научиться слушать обе стороны, не принимая поспешных решений и не делая быстрых выводов. Больше общайтесь с разными людьми и не замыкайтесь в себе. Получайте информацию разными способами, не только из книг. Старайтесь не отгораживаться от того, что не нравится или кажется несправедливым. Напротив, важно поддерживать контакт, чтобы изучить явление или мотивы человека в их глубинных причинах. Принимайте мир таким, какой он есть. Старайтесь сохранять в себе эмоциональную стабильность и мудрую невозмутимость.",
                    "created": "2020-09-02T01:14:19.326559Z",
                    "edited": "2020-09-02T01:14:19.326559Z",
                    "type_id": 3,
                    "language": "ru",
                    "personal": true,
                    "combination": "8",
                    "gender": "",
                    "type": "expandable",
                    "title": "В общении",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": true,
                  "positions": [
                   [
                    "a",
                    "b",
                    "e"
                   ]
                  ]
                 },
                 {
                  "imageName": "talents",
                  "title": "Таланты",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 4824,
                    "content": "Маги. (1)\nВаши таланты уникальны. Как первооткрыватель, способны повести за собой людей, быть лидером и указывать новые пути, в том числе и духовные.\nИзбирательность к окружению позволяет выбирать лучших среди своих последователей.\nСпособность к материализации энергии дает возможность создавать рабочие обереги и талисманы. Важно открыть для себя доступ к древним знаниям, благодаря которым сможете реализовать свой талант Учителя. \nВыдающийся интеллект способствует легкому усвоению огромных объёмов информации и именно вы способны передать эти знания другим.\nЧто может помешать развиться вашим талантам?\nЭто прежде всего эгоизм, нежелание делиться своими знаниями, некорректное отношение к равным, либо к братьям и сестрам в детстве.\n\nФортуна (10)\nВы способны управлять судьбой. Причем не только своей, но окружающих. Можете изменять реальность людей и событий. Умение быть в потоке позволяет управлять удачей и везением. Вы тот человек, которому всегда везет, а удача перепадает даже окружающим.\nРядом с вами другие смогут выйти на путь своего предназначения, изменить судьбу, поймать счастливую звезду. Такой талант обязательно должен быть реализован. Вы всегда знаете, когда, куда и с кем следует пойти, чтобы получить необходимый результат. Волшебным образом чувствуете свой счастливый поток и благодаря ему оказываетесь в нужное время, в нужном месте. Вам противопоказана работа от звонка от звонка. При такой работе удача просто не сможет встретиться с вами. Фриланс, необычные занятия — это для вас. Очень важно всецело довериться вселенной и Божественной энергии.\nЧто помешает реализоваться вашим талантам? Это зацикленность на деньгах, тяжелая работа. Слово «долг» для вас противопоказано.\n\nМудрец (9)\nВы — открыватель сокровенных знаний, мудрец. Философия, психология, эзотерика, история — те науки, где вы наверняка преуспеете. Для этого необязательно долго учиться. Даже после прочтения нескольких фраз из книги у вас может произойти озарение, сложиться концепция мироздания. Вы целостны, мудры и самодостаточны. Именно это позволяет вам гармонично вести уединенный образ жизни. Но не следует этого делать. Очень важно передать знания в мир, иначе талант останется нереализованным. Благодаря способности создавать вокруг себя целостность, можете исцелять людей и даже пространство. Изучая прошлый опыт человека, показываете другую сторону его ошибок, позволяете ему осознать, что данный опыт был полезен и для чего нужен. Таким образом возвращаете человеку целостность и исцеляете его. Таланты реализуются через преподавание, но не многим людям сразу, а «из рук в руки», ограниченному числу последователей. В создании отношений неторопливы и выборочны. Партнерские связи, которые создаете бережно и осторожно, чаще всего создаются навсегда.\nНельзя уходить в одиночество, несмотря на то, что вам весьма комфортно в этом состоянии. Реализация талантов заключается в передаче знаний другим.",
                    "created": "2020-12-24T18:15:17.953069Z",
                    "edited": "2020-12-24T18:15:17.953069Z",
                    "type_id": 30,
                    "language": "ru",
                    "personal": true,
                    "combination": "1",
                    "gender": "",
                    "type": "expandable",
                    "title": "Таланты от Бога",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 4834,
                    "content": "Плодородие (3)\nВокруг вас все оживает и радует глаз: распускаются цветы, прекрасно себя чувствуют животные. Особое энергетическое поле. Мужчина рядом с такой женщиной всегда преуспевает. Его таланты развиваются, он приносит в дом деньги и добывает другие материальные блага.  Дети растут умными и талантливыми. Дар получения благ от мира пассивным путем — ваша уникальная особенность. Если вы приняли свою энергию, умиротворены и спокойны, то материальный успех придет легко, как бы сам собой. Вдохновляете творцов. Именно эта энергия есть у женщин, рядом с которыми вырастают из матроса до адмирала. Талант к творчеству позволяет создавать вокруг красоту и гармонию. Хорошо ладите с детьми.\nЕсли вы мужчина, то вы хорошо понимаете женщин, легко улавливаете их чувства, желания, перепады настроения. Поэтому в дамском коллективе чувствуете себя гармонично. Так же бизнес, где целевая аудитория – женщины имеет все шансы на материальный успех.\nЧто блокирует ваш дар? Излишняя активность по принципу - «Я сама» и нежелание рожать и воспитывать детей. Это то, что противоречит самой природе энергии и не позволяет развиваться талантам. \n\nСвобода (22)\nВаш талант приспосабливаться к любым ситуациям и быть успешным даже в самых сложных обстоятельствах. Способны ощущать себя легко, расслабленно в условиях несвободы и ограничений. Умеете признавать свою некомпетентность и управлять ей. Работа с детьми для вас, ведь вы чувствуете себя таким же свободным как ребенок.\nНе нарушайте свободу воли других людей. Это блокирует ваш талант. Учитесь не причинять добро. У каждого человека свой путь и задачи.\n\nПроцветание (19)\nВы умеете быть счастливым здесь и сейчас. Способность радоваться всем проявлениям жизни делает вас позитивным человеком. Ваша энергия — энергия солнца. Как солнце вы освещаете все вокруг. Деятельность, приносящая радость и удовольствие принесет успех, богатство и процветание.  Всегда добиваетесь своего и никогда не сдаетесь.  Интересной особенностью является “правило третьей попытки”. Некоторые из начинаний удадутся только с третьего раза. Непосредственны, как ребенок и несете в себе заряд позитива, который помогает не отступать в сложных ситуациях.\nОбласти вашей реализации — это реклама, продажи, маркетинг, любая деятельность с детьми. \nВам противопоказано чувство вины. Злоупотребление властью тоже может помешать развиться таланту. И очень опасно светить в одну точку, на один объект. Как и Солнце, вы способны обжечь.",
                    "created": "2020-12-24T18:39:33.825085Z",
                    "edited": "2020-12-24T18:39:33.825085Z",
                    "type_id": 30,
                    "language": "ru",
                    "personal": true,
                    "combination": "3",
                    "gender": "",
                    "type": "expandable",
                    "title": "Таланты по линии матери",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 4828,
                    "content": "Гармония. (2)\nВы обладаете тонким слухом в физиологическом смысле этого качества. Умеете получать знания, информацию из пространства, интуитивно. Способность слышать то, что другие не слышат, отличает вас от остальных. А красивый голос помогает передавать информацию окружающим. Талант дипломата дает возможность примирять враждующие стороны. Чувствуя этот дар, окружающие тянутся к вам, когда им требуется найти гармонию или примириться с кем-то. Можете приспособиться к любой ситуации. Чувствуете чужую боль как свою (особенно если это боль близкого человека) и можете ее исцелить. Милосердны, сострадательны и готовы бескорыстно помогать людям. Дар перевоплощения, актерский талант. Одна из самых интересных способностей — управлять людьми через информацию.\nЧто блокирует ваши таланты? Это ложь, сплетни, любое искажение информации. Если есть обиды на маму, конфликты с ней или другими женщинами, таланты не раскроются.  При неправильном развитии таланта вы можете стать серым кардиналом-манипулятором и управлять людьми и ситуациями во вред им.\n\nРод (20)\nВы умеете взаимодействовать с тонкой материей и с помощью этой способности воссоединять семьи, усиливать род.  Создавая и развивая династические традиции, вы можете быть полезным Родине или стране.  Обязательно следует работать с родом, через яснознание, ясновидение, сновидения. Только у вас есть ресурс к его исцелению. Вы умеете восстанавливать энергополе людей, предметов и систем. Необходимо помогать родным для реализации своего таланта.\nТалант блокирует обида на родных и отказ им в помощи.\n\nМагия (18)\nВы умеете видеть знаки судьбы, контактировать с непроявленным миром. Ваша энергия — энергия Луны, магическая энергия. Чувствуете свой путь и можете идти по нему даже в одиночку, преодолевая преграды. Ваша сфера - духовность и вы материализуете что-либо через образы. Ясновидение, сновидение сопутствуют вашему таланту. Очень яркое видение образов может реализоваться в реальной жизни. Учтите, что могут реализоваться и ваши страхи. Магическая энергия Луны дает вам артистизм. Если вы проработали свои страхи, то сможете исцелять страхи других людей. Талантливый мастер-ремесленник. Дизайн, кулинария, рукоделие - то в чем может раскрыться ваш талант. \nПроявлению таланта могут помешать ваши непроработанные страхи.",
                    "created": "2020-12-24T18:33:01.678867Z",
                    "edited": "2020-12-24T18:33:01.678868Z",
                    "type_id": 30,
                    "language": "ru",
                    "personal": true,
                    "combination": "2",
                    "gender": "",
                    "type": "expandable",
                    "title": "Таланты по линии отца",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": false,
                  "positions": [
                   [
                    "b",
                    "b1",
                    "b2"
                   ],
                   [
                    "g",
                    "p1",
                    "p2"
                   ],
                   [
                    "s1",
                    "s2",
                    "f"
                   ]
                  ]
                 },
                 {
                  "imageName": "destiny",
                  "title": "Предназначение",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 3277,
                    "content": "В возрасте ориентировочно до 40 лет человеку необходимо определиться кто он, что любит, чем хочет заниматься. В помощь даются испытания, сложные ситуации, трудности, преодолевая которые он находит ответы на свои вопросы. Некоторые из задач могут быть очень тяжелыми. Это время для роста человека во всех сферах жизни. Важно помнить, что нужно соблюдать баланс между духовным, внутренним совершенствованием и развитием навыков, необходимых в материальном мире. С 20 до 40 лет наилучшее время для того, чтобы обзавестись семьей, окружить себя друзьями и единомышленниками. Хорошие отношения с близкими привносят в жизнь гармонию, положительные эмоции и счастье. После 40 лет наступает этап, когда необходимо начать делиться накопленным опытом и знаниями. Когда личность станет это делать, тогда к ней придет материальное благополучие. Если человек обрел целостность, нашел ответы на свои вопросы, знает кто он, чего хочет, развил в себе таланты и навыки, создал семью, то его жизнь складывается удачно и гармонично. В течение всего жизненного пути важно помнить и уделять внимание своему внутреннему и духовному развитию. Это поможет в трудные моменты находить в себе силы для их преодоления и чувствовать поддержку высших сил.",
                    "created": "2020-09-02T01:12:49.892581Z",
                    "edited": "2020-09-02T01:12:49.892582Z",
                    "type_id": 123,
                    "language": "ru",
                    "personal": false,
                    "combination": "1",
                    "gender": "",
                    "type": "info",
                    "title": "",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 3904,
                    "content": "(5) Ваша миссия в жизни открывать новое и обязательно передавать полученные знания. В этом вам помогает уникальный талант говорить просто и доступно о сложном самой широкой аудитории. Также важно передавать через поколение семейные традиции и создавать новые, поддерживать порядок в доме для укрепления родственных связей. В то же время необходимо отпускать детей в свободную жизнь, когда они готовы, не привязывать к себе. Занимайтесь только законной деятельностью. В работе и увлечениях стоит неизменно выбирать сотрудничество вместо борьбы и соперничества. Если не следовать своей миссии, вам грозит одиночество, постоянно отношения с несвободным человеком. Возможны конфликты с родными и сильные привязки в детско-родительских отношениях, которые будут приносить боль и дискомфорт. Плохая ситуация - навязывание знаний. Отсутствие порядка, традиций в доме приведет к бардаку во всех сферах: на работе, в голове, в душе, делах, отношениях.\n\n\n(3) Для вас просто необходимо стать истинным мужчиной, сильным, решительным, целеустремленным. Важно поддерживать хороший контакт с мамой. Ваши внутренние качества: мягкость, умение чувствовать и понимать прекрасную половину человечества, чувствительность - хорошо применять на профессиональном поприще. Вы можете с успехом реализовать себя в бизнесе, где большинство клиентов будут женщины, а также преуспеть в женском коллективе. При негативной ситуации, если не следовать своему предназначению, можно потерпеть неудачи в работе, остаться слабым и нереализованным человеком с обидами на всех вокруг. Важно создать семью, стать ее полноценным главой, защитником, разумно проявляя контроль без излишней властности. Иначе пустота в доме будет вести и к пустоте в душе, в жизни.\n\n(8) Вам по предназначению судьбой необходимо разбираться в глобальных причинно-следственных связях событий и поступков. Доносите ваш опыт и знания в этой области до других. Важно соблюдать правила общества и понимать всеобщие духовно-нравственные законы. Несите ответственность за свою жизнь и не перекладывайте вину за свои неудачи на неверные родительские установки, неправильное воспитание. Станьте сами разумным главой своей семьи, справедливым и заботливым, чаще проявляйте мудрость в отношении окружающих. Если не использовать свои способности к анализу для постижения важных законов справедливости и устройства жизни, то вы сами начнете попадать в конфликты и ситуации отстаивания правды. Могут возникать судебные разбирательства, в том числе даже с членами семьи. Будете искать правду посредством законов, но ее сложно будет найти в простых логических решениях, так как вопросы будут неоднозначные, за гранью обычного понимания законности и суда.",
                    "created": "2020-09-02T01:13:33.326065Z",
                    "edited": "2020-09-02T01:13:33.326065Z",
                    "type_id": 4,
                    "language": "ru",
                    "personal": true,
                    "combination": "5",
                    "gender": "",
                    "type": "expandable",
                    "title": "Предназначение 20-40",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 3900,
                    "content": "(8) Вам по предназначению судьбой необходимо разбираться в глобальных причинно-следственных связях событий и поступков. Доносите ваш опыт и знания в этой области до других. Важно соблюдать правила общества и понимать всеобщие духовно-нравственные законы. Несите ответственность за свою жизнь и не перекладывайте вину за свои неудачи на неверные родительские установки, неправильное воспитание. Станьте сами разумным главой своей семьи, справедливым и заботливым, чаще проявляйте мудрость в отношении окружающих. Если не использовать свои способности к анализу для постижения важных законов справедливости и устройства жизни, то вы сами начнете попадать в конфликты и ситуации отстаивания правды. Могут возникать судебные разбирательства, в том числе даже с членами семьи. Будете искать правду посредством законов, но ее сложно будет найти в простых логических решениях, так как вопросы будут неоднозначные, за гранью обычного понимания законности и суда.\n\n(16) Для вас важно материальное благополучие, и вы его обязательно достигнете, если не будет зацикливаться на деньгах. Ваше предназначение - духовное развитие, поиск баланса между материальными и высшими ценностями жизни. Для этого надо уметь быть внутренне свободным от денег, наслаждаться малым и жить скромными потребностями. Ваша роль - духовный лидер. Будете иметь последователей и учеников. Через это пройдет ваша реализация к материальному благополучию. Если будете заняты только жизненными заботами и сиюминутными интересами, настанут значительные финансовые потери, зависимость от денег, могут появиться серьезные болезни. Привязка к чему-либо грозит потерей именно этого самого дорогого в жизни - отношений, проектов или материальных ценностей.",
                    "created": "2020-09-02T01:13:32.77089Z",
                    "edited": "2020-09-02T01:13:32.770891Z",
                    "type_id": 4,
                    "language": "ru",
                    "personal": true,
                    "combination": "8",
                    "gender": "",
                    "type": "expandable",
                    "title": "Предназначение 40-60",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 3941,
                    "content": "(6) Вам важно активно взаимодействовать с социумом, много общаться с людьми. Обязательно развивайте свои таланты и используйте плоды творчества на благо многих людей. Если не реализовывать свои креативные возможности или злоупотреблять агрессивным продвижением, торговлей плодами своего искусства, то творческий канал закрывается. Нежелательно также уводить свои плоды творчества только в область развлечений и удовольствий. Они должны служить глобальным целям, быть на пользу обществу.",
                    "created": "2020-09-02T01:13:35.552446Z",
                    "edited": "2020-09-02T01:13:35.552446Z",
                    "type_id": 5,
                    "language": "ru",
                    "personal": true,
                    "combination": "6",
                    "gender": "",
                    "type": "expandable",
                    "title": "Предназначение общее",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": false,
                  "positions": [
                   [
                    "h",
                    "j",
                    "m",
                    "n",
                    "t",
                    "z",
                    "s"
                   ]
                  ]
                 },
                 {
                  "imageName": "money",
                  "title": "Деньги",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 3994,
                    "content": "(5) Стоит выбирать работу, связанную с получением информации и дальнейшей передачей знаний: преподавание, программирование, консультирование, психология. Также удачным будет занятие по созданию целостности (врач, целитель), созданию структуры и установлению законов в различных сферах (адвокат, судья, юрист, экономист, компьютерщик). Значимый успех придет лишь после 40 лет. До этого будет в основном идти накопление опыта, знаний, ресурсов, клиентской базы и имиджа. Деньги в вашу жизнь будут приходить именно на семейные нужды, например, в периоды рождения детей или при решении каких-то важных для всех близких задач.",
                    "created": "2020-09-02T01:13:38.941489Z",
                    "edited": "2020-09-02T01:13:38.94149Z",
                    "type_id": 6,
                    "language": "ru",
                    "personal": true,
                    "combination": "5",
                    "gender": "",
                    "type": "expandable",
                    "title": "Направление деятельности",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 4027,
                    "content": "(22) Финансовое благополучие придет через работу, связанную с развлечениями, освобождением. Для стабильности и денежного достатка важно убрать в себе зацикленность на финансах, работать легко и с удовольствием. Обращайтесь с деньгами свободно, позволяйте себе траты, дарите свободу от материальной и других видов зависимостей людям. Научитесь радоваться жизни, развлекаться, несите людям радость. Хорошо много путешествовать по миру, работать с человеческим сознанием, учить людей бороться с пищевыми пристрастиями, психологической зависимостью от другого человека. Раскрывайте свои таланты оратора, психолога и ведите людей за собой к внутренней свободе.\n\n(2) В работе наибольший приток доходов не столько благодаря вашим профессиональным качествам, сколько за счет коммуникации и умению правильно выстраивать отношения с партнерами, коллегами, клиентами. Вы отлично справляетесь с переговорами разного уровня, проявляя свои прирожденные дипломатические способности. Полезно понять свое истинное предназначение, желания, прислушиваться к интуиции. Занимайтесь саморазвитием, фокусируйтесь на уникальных (целительских, энергетических) и других способностях. А вот вносить дисгармонию в любые коллективы будет вредно для вас самих. Не клевещите, не плетите интриги и не распускайте сплетни. Избегайте эгоизма и лживости. Важно научиться доверять людям, но не следовать слепо и не делать себе кумиров из близких друзей. Искренне и без жалости делитесь своими знаниями.\n\n(10) Ваши деньги и процветание от удачливости по рождению. Важно жить и работать, не напрягаясь. Не находиться в постоянном ничегонеделании, но и не работать физическим изматывающим трудом. Принимайте обязанности, которые вам предоставляются, и выполняйте их на совесть. Важно получать удовольствие от того, что вы делаете. Для этого нужно уметь прислушиваться к себе, своей интуиции и доверять высшим силам, которые вам помогают. Не забывайте благодарить судьбу за успех и счастливые возможности. Очень важно поймать эту свою энергетическую волну и на успехе двигаться по ней. Будьте щедры и помогайте окружающим. На своем примере показывайте, как легко можно осуществлять задуманное и работать в удовольствие. Вам подойдут самые необычные профессии и новые области деятельности. Выбирайте фриланс или собственный несложный бизнес. Работа по графику под чьим-то руководством не для вас.\n\n(12) Ваше денежное благополучие возможно через помощь другим и благотворительность. Для этого нужно отказаться от привычной роли жертвы и перестать жалеть себя. Используйте свои ресурсы лучше для помощи людям. Не жалуйтесь, научитесь отказывать и не стесняйтесь брать деньги (достойную и справедливую оплату) за свой труд. Стремитесь к адекватной самооценке, делайте что-то приятное для себя ежедневно, пусть это и будут самые маленькие вещи. Научитесь меньше контролировать своих подопечных. Передавайте свои проекты и смело отпускайте в жизнь детей, как только они стали жизнеспособны и самостоятельны. Важно научиться отдавать любовь, не ожидая ничего взамен. А сделать вы это можете только при безусловном принятии себя, любви и самоуважении. Тогда, как счастливый человек, сможете поделиться добром и гармонией со многими. Для вас полезно научиться нормально воспринимать критику: не терять веру в себя, но и не впадать в гордыню.",
                    "created": "2020-09-02T01:13:41.075543Z",
                    "edited": "2020-09-02T01:13:41.075545Z",
                    "type_id": 7,
                    "language": "ru",
                    "personal": true,
                    "combination": "22",
                    "gender": "",
                    "type": "expandable",
                    "title": "Для достижения успеха важно",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5215,
                    "content": "- финансового потока\n\nНеискренность, осуждение и  сплетни в отношении коллег и партнёров блокируют деньги в матрице судьбы. Разглашение тайн производства, компании. Апатия, отсутствие целей, физического движения. Безответственность и непрактичность.\n\n+ финансового потока\n\nРазвитие интуиции и применение психологических знаний в общении с другими людьми. Повышение квалификации. Создание пассивного источника дохода. Спорт и физическая нагрузка\n\n- финансового  потока\n\nЖёсткий рабочий график, азартность,  долги и кредиты блокируют деньги в матрице судьбы. Зацикленность на деньгах, излишний материализм, скупость, неумение откладывать и создавать подушку безопасности. Отсутствие целей в жизни или проживание не своей жизни, а то как видят её родители или окружение, токсичное окружение. Страх и ограничивающие установки: на Любимом деле не заработаешь, деятельность должна быть одна и на всю жизнь и тд.\n\n+ финансового потока\n\nСлушать свою интуицию и осуществлять свои оригинальные идеи здесь и сейчас, не откладывая на потом. Бережно относиться к деньгам, создавая финансовую подушку безопасности, не спускать деньги на сомнительные авантюры. Найти мотивацию, команду, людей близких по духу. \nРаботать в удовольствие! Обращать внимание на знаки судьбы, вращаться в обществе. Заводить полезные знакомства, выстраивать «богатое» окружение!\n\n- финансового  потока\n\nОбесценивание своего труда, работа даром или за бесценок, долги и кредиты. Бесполезная деятельность, отсутствие благодарности. Ложные установки и ненужные обстоятельства, когда по рукам и ногам тебя связывают, состояние жертвы (лучше я посвящу себя детям - в итоге в нищете,  я не могу уйти с этой работы, я здесь нужен, при этом зарплату не платят уже полгода к примеру). Неумение отказать, зависимость от мнения других\nЗависание, стагнация в развитии, нерешительность.\n\n+ финансового потока\n\nНаучиться отказывать, если такой ваш внутренний отклик. Брать достойную оплату своего труда. Менять деятельность, если работа в ущерб себе. Выявить то, что можете предложить людям, демонстрируя полезность, уникальность и креативность, независимо от оценки окружения.\n\n- финансового потока\n\nФиксированный график работы, жёсткие правила, ограничения и требования. Безответственное отношение к деньгам, покупка ненужного, кредиты, транжирство, мелкие аферы, халатность. Привязка к месту жительства, работе, деятельности и нежелание двигаться с места.\n\n+ финансового потока\n\nСвободный график работы, фриланс, онлайн. Готовность поменять все и начать заново в любом месте на карте, проявлять спонтанность, но и ответственность. Изучать возможности и варианты пассивного дохода. Идти в свои страхи. Следить за своей речью. Хорошо работать с детьми или создавать что-то для них. Пробовать себя в юмористическом жанре. Тратить свои финансы на то что дарит ощущение лёгкости, веселья и свободы. \n\n- финансового  потока\n\nНеуверенность в себе и сомнения в своей компетенции. Нелегальные способы получения прибыли, несоблюдение законов. Консерватизм и шаблонность мышления, упрямство.\n\n+ финансового потока\n\nЗаконная деятельность и соблюдение правопорядка. Порядок в делах и документах, структура и автоматизация рабочего процесса. Применять приобретённые знания и навыки как можно скорее.",
                    "created": "0001-01-01T00:00:00Z",
                    "edited": "2022-08-12T13:52:53.551491922+03:00",
                    "type_id": 404,
                    "language": "ru",
                    "personal": false,
                    "combination": "2",
                    "gender": "",
                    "type": "expandable",
                    "title": "Финансовый поток",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": false,
                  "positions": [
                   [
                    "c",
                    "c1",
                    "c2",
                    "x",
                    "x2"
                   ]
                  ]
                 },
                 {
                  "imageName": "programs",
                  "title": "Программы",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 4165,
                    "content": "Ваши сильные стороны\nВы имеете поразительную стойкость в своих убеждениях, не идете на поводу у других. У вас весьма обширные и необычные интересы в нескольких областях. Вы открыты всему новому и легко принимаете изменения, которые преподносит жизнь. Вы умеете правильно воспринимать информацию и не мыслить шаблонами. Вы чувствуете свое внутреннее “Я” и способны заниматься любимым делом вопреки рассуждениям окружающих.\nВозможные проблемы:\nВ худших случаях вы можете проявлять по отношению к окружающим холодность и черты поведения тирана. Могут возникать постоянные позывы учить жизни других, заставлять жить по-вашему. Правильно только так, как считаете вы. Это лишает ваших близких самостоятельности и права выражать свое “Я”. Возможно, вы терпели тиранию подобного рода в детстве и теперь так же отыгрываетесь на детях.\nРекомендации:\nИщите похожего на себя человека. Только так вы сможете наблюдать себя со стороны и понять тщетность попыток заставить всех жить по одним правилам (вашим). Если не перестанете, жизнь предоставит вам похожего на вас, но еще более жесткого человека. Позвольте другим совершать их собственные ошибки и проживать свою жизнь. Тогда и давление обстоятельств на вас уйдет совсем.\n",
                    "created": "2020-09-02T01:13:50.009644Z",
                    "edited": "2020-09-02T01:13:50.009644Z",
                    "type_id": 12,
                    "language": "ru",
                    "personal": true,
                    "combination": "10-5-22",
                    "gender": "",
                    "type": "programs",
                    "title": "Инквизиция (10-5-22)",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 4717,
                    "content": "Ваши сильные стороны\nВы умеете очень красиво рассказывать, как говорят – заслушаешься. Обладаете даром убеждения. Можете преподнести себя в обществе с выгодной вам стороны.\nВозможные проблемы\nЧасто вы идеализируете настоящее. Выдаете желаемое за действительное, то, что только хотите - за то, что у вас уже есть. Возможно даже, у вас есть парадный наряд, в котором вы хотите казаться лучше, красивее, богаче, статуснее. Или вы покупаете вещь в магазине, которая вам не по карману, ради одного выхода в свет, чтобы произвести впечатление, а потом сдаете ее обратно в магазин. Вы можете вводить окружающих в заблуждение. В основном, для общества ваше приукрашательство безобидно, но могут быть случаи, когда от ваших слов и обязательств многое зависит (порой даже чья-то жизнь). В таких ситуациях крайне важно исполнять обещанное. В противном случае - это грозит для вас потерей доверия. Особенно обидно, когда вам очень хочется войти в какое-то определенное сообщество, а вас туда уже не принимают - люди в вас разочаровались.\nРекомендации\nДля вас важно не хвастаться, дав слово - держать его. Обещая что-то, адекватно оценивайте свои силы и возможности. Не берите на себя то, что не сможете выполнить. Помните, что доверие очень легко потерять, а вот обрести заново гораздо сложнее. Поверьте, восхищать результатами намного приятнее, чем просто болтать о своих желаниях и планах.\n",
                    "created": "2020-09-02T01:14:24.980091Z",
                    "edited": "2020-09-02T01:14:24.980092Z",
                    "type_id": 12,
                    "language": "ru",
                    "personal": true,
                    "combination": "16-8-6",
                    "gender": "",
                    "type": "programs",
                    "title": "Хвастовство (16-8-6)",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 4917,
                    "content": "НАРУШЕНИЕ ИЕРАРХИИ\nСильные стороны\nВы придерживаетесь классических семейных ценностей. Уважительно относитесь к старшим и их опыту, оказываете поддержку младшим. Предпочитаете работать в организациях с чёткой иерархической структурой, где каждый сотрудник понимает свою роль и стремится к общей цели, качественно выполняя личные задачи. Можете найти себя в работе реабилитологом, остеопатом, кинезиологом, помогать людям решать проблему комплексно.\nВозможные проблемы\u2028\nЧлены вашей семьи играют не свои роли. Теща любит зятя больше своей дочери, муж домохозяин, а жена карьеристка-добытчица и т.д. Вы можете ограждать себя от общения с кем-то из родственников. Часто не умеете делегировать. Можете работать без чёткого технического задания, не понимать своих обязанностей и целей своего труда. У вас могут быть заболевания связанные с нарушением работы систем: кровеносной, нервной и т.п.\nРекомендации\nНайти то, что мешает выстраивать здоровые отношения с близкими и соблюдать порядок распределения ролей в семье. Не возлагать на детей груз ваших ожиданий, давать им проживать свой опыт и совершать ошибки. Вы можете выбрать вид деятельности, связанный с систематизацией документов, организации распределения ролей в предприятии. Если есть системные заболевания, то искать специалиста, который будет искать корень проблемы, а не только лечить симптомы. ",
                    "created": "2021-02-02T09:30:00.156727Z",
                    "edited": "2021-02-02T09:30:00.156727Z",
                    "type_id": 12,
                    "language": "ru",
                    "personal": true,
                    "combination": "21-8-5",
                    "gender": "",
                    "type": "programs",
                    "title": "Нарушение иерархии (21-8-5)",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": false,
                  "positions": [
                   [
                    "x",
                    "x2",
                    "c1"
                   ],
                   [
                    "e",
                    "e1",
                    "e2"
                   ],
                   [
                    "k",
                    "p3",
                    "p4"
                   ]
                  ]
                 },
                 {
                  "imageName": "sexiness",
                  "title": "Сексуальность",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 3209,
                    "content": "(8-16-6) Вас тяготит отсутствие новизны, и в то же время вы не интересуетесь людьми, не стараетесь открыть для себя своего партнера. Все кажется вам похожим, надоевшим и предсказуемым. В отношениях ведете себя инертно и плывете по течению. Естественно, такое положение дел зачастую партнера не устраивает. Вы способны активизироваться только в чрезвычайной ситуации. Вас мотивируют трудности. Например, попадается холодный партнер или с проблемами в интимной сфере. И вот тогда вам хочется его «спасти» - помочь раскрыть чувственность и сексуальность. Вас трудно вовлечь во что-то новое, сдвинуть с привычного. Любые эксперименты и предложения вы воспринимаете без энтузиазма. Хотя внутренне и хотели бы свежести и перемен. Вы сами создаете в жизни катастрофы и проблемы, которые нужно решать. Только так появляется вкус к жизни и какие-то желания. На вас действуют часто отрицательные пиковые ситуации. Вы запускаете отношения с партнером до состояния разрыва и лишь потом готовы что-то менять, когда уже все потеряно. Вам нравится быть всемогущим, состояние, при котором вы обладаете уникальной силой вдруг решить все проблемы, которые месяцами пускались на самотек, одним днем. Хотите влиять на жизнь своего партнера, часто ставите свои отношения под угрозу только для кипения чувств, и чтобы проснуться самому из бездействия.",
                    "created": "2020-09-02T01:12:45.168353Z",
                    "edited": "2020-09-02T01:12:45.168353Z",
                    "type_id": 10,
                    "language": "ru",
                    "personal": true,
                    "combination": "8-16-6",
                    "gender": "",
                    "type": "expandable",
                    "title": "Сексуальность",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": true,
                  "positions": [
                   [
                    "e1",
                    "e2",
                    "e"
                   ]
                  ]
                 },
                 {
                  "imageName": "previous_life",
                  "title": "Прошлая жизнь",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 3432,
                    "content": "(12-16-4) Кармический долг из прошлой жизни\nВ прошлой жизни вы обладали исключительным влиянием и властью. Повелевали людьми и решали течение разных ситуаций. Вы направляли людей, влияли на принятие ими решений. Вы занимали главное место в определенной сфере, многое контролировали.\nВ настоящей жизни\nДуша помнит прежний опыт, и вы продолжаете всех учить, как правильно, все контролируете. Считаете себя самым ответственным, главным и умным человеком. Даже самому опытному человеку в этом случае жизнь готовит много сюрпризов. Вы попадаете в такие ситуации, что приходится признавать свое поражение. Каждая попытка управлять и манипулировать будет терпеть провал. Вы уже не имеете на это право, хотя и пользуетесь своими природными способностями видеть ситуацию глобально, контролировать. Вы сами замечаете, что чем больше пытаетесь контролировать людей и ситуации, тем сильнее все словно валится из рук. Случаются непредвиденные обстоятельства, форс - мажоры, как будто всё против вас. В таком поведении особенно тяжело приходится вашим близким. Не пытайтесь быть тираном и единовластным управителем в семье, если что-то не складывается на работе. Это часто приводит к еще более худшим последствиям вплоть до потери жилья и разлада отношений с близкими людьми.\nУрок и рекомендации\nЛучшее, что можно советовать в такой ситуации, это не предпринимать вообще ничего. Просто отпустите бразды правления и разрешите всему течь своим чередом. Как бы сложно это ни было именно в вашем случае, стоит научиться смиренно принимать разные обстоятельства жизни и не пытаться все контролировать. Иначе жизнь так и будет продолжать учить вас мудрости через неприятности.\n\n\n\n\n",
                    "created": "2020-09-02T01:13:00.739508Z",
                    "edited": "2020-09-02T01:13:00.739508Z",
                    "type_id": 11,
                    "language": "ru",
                    "personal": true,
                    "combination": "12-16-4",
                    "gender": "",
                    "type": "info",
                    "title": "Прошлая жизнь",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": true,
                  "positions": [
                   [
                    "d1",
                    "d2",
                    "d"
                   ]
                  ]
                 },
                 {
                  "imageName": "parents",
                  "title": "Родители",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 4664,
                    "content": "(2) Вы озлоблены на весь мир, не можете принять свое физическое тело с его особенностями. От такого психоэмоционального настроя возможно бесплодие без действительных физиологических отклонений.\n\n(6) Вы очень боитесь потерять партнера, но при этом отношения довольно поверхностные. Присутствует идеализация партнера, выбираете по внешности, ради лоска и престижа, создания красивой пары.\n\n(8) Для вашей жизни характерно повторение негативных ситуаций, которые уже были в роду. Возможны сильные разочарования, тяжелая судьба.\n\n(18) У вас много реальных страхов и надуманных фобий. Вы боитесь одиночества, и в то же время стараетесь не сближаться с людьми. Результат - частые депрессивные состояния.\n\n(20) Реализовать положительные родовые программы вы сможете, если переборете гордость, сможете обратиться за помощью к родным. Важно преодолеть обиду на родителей.\n\n(10) В негативном аспекте может быть очень тяжелая жизнь, когда невозможно даже расслабиться. Вся судьба делится на добрачную жизнь (когда все складывалось удачно) и тяжелую жизнь после.\n\n(22) В негативном проявлении вам может грозить несвобода и зависимости в разных проявлениях (алкоголь, другие люди). Возможна потеря своего жилья, тюремное заключение.",
                    "created": "2020-09-02T01:14:21.708234Z",
                    "edited": "2020-09-02T01:14:21.708235Z",
                    "type_id": 22,
                    "language": "ru",
                    "personal": true,
                    "combination": "2",
                    "gender": "",
                    "type": "expandable",
                    "title": "Родовые программы по мужской линии",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 3810,
                    "content": "(3) У вас существует недостаток мужской энергии. Отсюда проблемы с проявлением традиционного мужского поведения, принятием решений, ответственностью за других.\n\n(5) У вас есть проблемы с созданием семьи и ее сохранением. Вы несете в семью разрушение.\n\n\n(8) Для вашей жизни характерно повторение негативных ситуаций, которые уже были в роду. Возможны сильные разочарования, тяжелая судьба.\n\n(19) Вы зациклены на деньгах и профессиональной деятельности, при этом ваши финансы и реализация в работе оставляют желать лучшего. Есть риск проблем с рождением детей, а при их наличии - с взаимопониманием и воспитанием ребенка.\n\n(22) В негативном проявлении вам может грозить несвобода и зависимости в разных проявлениях (алкоголь, другие люди). Возможна потеря своего жилья, тюремное заключение.\n\n(21) В вашем роду могло быть отвержение веры, велись войны, проявлялась агрессия. Вы можете через свою жизнь проживать негативную программу рода, жить не по своему предназначению. Грозит тяжелая финансовая ситуация, следует избегать жизни в кредит.",
                    "created": "2020-09-02T01:13:26.935366Z",
                    "edited": "2020-09-02T01:13:26.935366Z",
                    "type_id": 22,
                    "language": "ru",
                    "personal": true,
                    "combination": "3",
                    "gender": "",
                    "type": "expandable",
                    "title": "Родовые программы по женской линии",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 4283,
                    "content": "(1) Вы можете считать, что родители вас недооценивали, не замечали, вели себя эгоистично по отношению к вам, занимались только собой. Вам приходилось бороться за их внимание. Вы старались оправдывать ожидания взрослых, думая, что это поможет завоевать теплые чувства и ощутить родительскую заботу. Если у вас есть братья или сестры, то возможно вам приходилось конкурировать с ними за любовь родителей.  К сожалению, или к счастью детство вернуть нельзя, но вы можете помочь себе излечиться от детских травм, заботясь о родителях и принимая их такими какие они есть.\n\n(10) Родители могли считать вас лентяем и неумехой. Вам не было доверия, постоянно говорили, что нужно сделать, подталкивали, пинали, всячески направляли. Можно сказать, что они, сами того не зная, оказали вам медвежью услугу. Вы разучились слышать себя и свои потребности. Сейчас вы живете чужой жизнью и не прислушиваетесь к особым знакам. Думаете, что всего можно добиться только дисциплиной и изматывающим трудом, а на самом деле именно вам под силу сделать хобби своей профессией. В этом случае вы будете гореть своим делом и при этом жить, достигая финансового процветания без изнурительной работы. Больше доверяйте своей интуиции и поддержке судьбы.\n\n(9) Ваши родители могли уделять вам мало внимания, отгораживаться или наоборот - чересчур нарушать ваши границы. Поэтому вы стремились раньше уйти из семьи и построить свою, где будут другие отношения. Не исключено, что вы, тем не менее, повторяете ошибки родителей. Для того, чтобы жить по-другому научитесь получать удовольствие от земных благ и не игнорируйте важность материального успеха в жизни. Найдите в жизни место для любви и дружбы. Научитесь выражать свои эмоции.",
                    "created": "2020-09-02T01:13:57.459624Z",
                    "edited": "2020-09-02T01:13:57.459624Z",
                    "type_id": 17,
                    "language": "ru",
                    "personal": true,
                    "combination": "1",
                    "gender": "",
                    "type": "expandable",
                    "title": "Обиды на родителей",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": false,
                  "positions": [
                   [
                    "a1",
                    "a2",
                    "a",
                    "f",
                    "y",
                    "o",
                    "g",
                    "k",
                    "u",
                    "s1",
                    "s2",
                    "s3",
                    "s4",
                    "p1",
                    "p2",
                    "p3",
                    "p4"
                   ]
                  ]
                 },
                 {
                  "imageName": "children",
                  "title": "Дети",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 4244,
                    "content": "(1) Вы можете построить с ребенком (или детьми) довольно близкие отношения, если будете правильно расшифровывать их подсказки. Просто отлично, если вы научитесь быть друзьями, общаться не свысока, а на равных. Так же, для гармоничных отношений вам нужно понимать потребности ребенка и не обесценивать их. Старайтесь уделять детям достаточно времени и внимания, а если что-то делаете, то только от чистого сердца. \n\n(10) Если не будете все время поддаваться власти логики и общепринятым нормам воспитания, а станете просто наслаждаться жизнью с детьми, то отношения с ними сложатся легкие и дружеские. Если ребенок живет достаточно расслабленно и справляется со своими делами всегда быстро и вовремя, ловя благоприятные моменты, то не стоит его ругать. Наоборот, вам нужно поучиться у него состоянию внутреннего спокойствия. Будьте наравне с детьми, проводите больше времени вместе, учитесь у них получать удовольствие от любимых занятий.\n\n\n\n\n(9) Ребенок привнесет в вашу жизнь настоящую любовь. Вам стоит быть искренним с ребенком. Выражайте свои эмоции и переживания открыто, чтобы между вами сложились доверительные и даже дружеские отношения. Постарайтесь обеспечить своих детей всем необходимым.\n\n\n\n",
                    "created": "2020-09-02T01:13:55.123295Z",
                    "edited": "2020-09-02T01:13:55.123295Z",
                    "type_id": 13,
                    "language": "ru",
                    "personal": true,
                    "combination": "1",
                    "gender": "",
                    "type": "info",
                    "title": "Дети",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": false,
                  "positions": [
                   [
                    "a1",
                    "a2",
                    "a"
                   ]
                  ]
                 },
                 {
                  "imageName": "relationships",
                  "title": "Отношения",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 3594,
                    "content": "(7) Наиболее подходящий вам партнер - прирожденный лидер и воин, активно и энергично строящий свою карьеру. Очень важна возможность самореализации для таких людей. Поэтому постоянно находится в движении, за рулем, любит путешествия. Такой партнер непременно будет завоевывать самыми щедрыми или фантастическими поступками.\n\n(12) Рядом с вами должен быть необыкновенно добрый и душевный человек, способный на широкие жесты. Такая личность имеет открытое сердце и способность дарить взаимопонимание и помогать сразу многим. Не исключено, что человек занимается благотворительностью, волонтерской деятельностью. Это прекрасный наставник, к которому всегда можно обратиться за помощью. Очень любит детей. Предпочитает работу с людьми, социальную активность (врачи, массажисты, психологи и т.д.).\n\n(22) Обожающий свободу и перемены партнер, который умеет шутить и отличается превосходным чувством юмора - замечательный вариант для вас. Веселый нрав и легкость на подъем способны сделать его душой любой компании. Ваш партнер много путешествует, не склонен привязываться к материальному, поэтому имеет мало вещей и может жить в съемной квартире или комнате. Характерен здоровый скептицизм и расчет во всем: ничего не принимает на веру. Успех в отношениях возможен, если ни в коем случае не удерживать такого человека, а дать ему полную свободу и так же заявить о своей независимости.",
                    "created": "2020-09-02T01:13:11.171559Z",
                    "edited": "2020-09-02T01:13:11.171559Z",
                    "type_id": 15,
                    "language": "ru",
                    "personal": true,
                    "combination": "7",
                    "gender": "",
                    "type": "info",
                    "title": "Отношения",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 4273,
                    "content": "(22-7) Вы надежный человек, готовый строить свободные и равноправные отношения. Хотите заботиться о близких, цените честность и открытость во всем. Не приемлете официальщины в отношениях. Готовы на компромиссы. Ответственно относитесь к выбору партнера для совместной жизни и длительных отношений, разборчивы в знакомствах. Вы не готовы вступить в официальный брак из-за внутренней установки о том, что по-настоящему честные и счастливые отношения могут быть только при свободном союзе. Обязательства, подкрепленные на бумаге, вы расцениваете как недоверие. Будто речь идет не о личном, а о рабочих отношениях. Масла в огонь при таких ситуациях обычно подливают друзья и ближайшие родственники, постоянно напоминая о том, что пора быть серьезнее и завести семью. Помните, вы имеете право жить так, как вам удобно, без оглядки на окружающих. Имеете полное моральное право на сожительство, ведь готовы заботиться о любимых и вне официальных обязательств. Вы действуете по совести и внутренним ощущениям. Счастье без свободы для вас немыслимо. А семью вы и так цените превыше всего. Лучшим вариантом станет найти партнера со схожими взглядами на жизнь и отношения.",
                    "created": "2020-09-02T01:13:56.910771Z",
                    "edited": "2020-09-02T01:13:56.910772Z",
                    "type_id": 15,
                    "language": "ru",
                    "personal": true,
                    "combination": "22-7",
                    "gender": "",
                    "type": "expandable",
                    "title": "Важно",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 4972,
                    "content": "В плюсе: Лидер, с активной жизненной позицией, любит рулить (и по-настоящему и в отношениях). С ним вы точно долго не усидите на одном месте, вдохновляясь новыми впечатлениями.\nВ минусе: Скандальный, ленивый, резкий. С таким партнёром чувствуешь себя на пороховой бочке из-за постоянных споров и выяснений.",
                    "created": "2022-01-22T11:45:37.207998Z",
                    "edited": "2022-01-22T11:45:37.207999Z",
                    "type_id": 131,
                    "language": "ru",
                    "personal": false,
                    "combination": "7",
                    "gender": "",
                    "type": "",
                    "title": "Идеальный партнер",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5031,
                    "content": "Важно бережно относится к деньгам, но не уходить в скупость. В отношениях возможна финансовая нестабильность, поэтому необходимо сопоставить доходы и расходы. Но обязательно выделять средства на развлечения и шопинг.",
                    "created": "2022-02-03T22:05:36.384786Z",
                    "edited": "2022-02-03T22:05:36.384787Z",
                    "type_id": 132,
                    "language": "ru",
                    "personal": false,
                    "combination": "22",
                    "gender": "",
                    "type": "",
                    "title": "Для гармоничных отношений важно",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": false,
                  "positions": [
                   [
                    "d1",
                    "x1",
                    "x"
                   ]
                  ]
                 },
                 {
                  "imageName": "health",
                  "title": "Здоровье",
                  "blockType": "health",
                  "blocks": [
                   {
                    "id": 4319,
                    "content": "Проблемы со здоровьем: Заболевания могут быть как косметического характера (проблемы с волосами), так и более серьезного уровня - проблемы со здоровьем в черепном отделе, нарушения функций мозга и так далее. В быту вы ведете себя хаотично, много беспокойства. Не понимаете отдельных вещей и постоянно требуете строгой конкретики.\nПричины: Жить полноценной жизнью вам мешают материальные привязки. Вы разочаровались в своих духовных идеалах и стали жестким прагматиком. Верите только себе и рассчитываете только на себя. К окружающим нередко проявляете злость и нетерпение, пытаетесь поучать и воспитывать в духе своих убеждений. Можете навязывать свое мнение и не принимаете позицию собеседника. Вы не видите своего пути и глобальной миссии, поэтому все силы направляете на достижение исключительного материального благополучия. При этом испытываете проблемы, отсутствие энергии, так как мыслите узко и не готовы принимать помощь от судьбы.\nРешение проблемы: Придется постигнуть высшие законы вселенной, разобраться в своем жизненном пути и предназначении. Так же хорошо помогать в этом другим людям со сходными проблемами. Определитесь со своей главной миссией и следуйте ей. Важно не просто зарабатывать ради своего комфорта и процветания, а выполнять работу, которая поможет и другим людям, будет служить важной идее. Относитесь к проблемам в жизни проще, воспринимая их как полезный опыт. Хорошо жить в режиме, питаться, заниматься физическими упражнениями, работой и отдыхать регулярно. Составьте график и следуйте ему. Полезно вести довольно строгий и умеренный образ жизни, не предаваться излишествам, заниматься энергетическими и духовными практиками.\n",
                    "created": "2020-09-02T01:13:59.838904Z",
                    "edited": "2020-09-02T01:13:59.838904Z",
                    "type_id": 25,
                    "language": "ru",
                    "personal": true,
                    "combination": "1",
                    "gender": "",
                    "type": "expandable",
                    "title": "Головной мозг, волосы, верхняя часть черепа",
                    "tintColor": "",
                    "additional": {
                     "personalRecommendations": "(1) Вы получаете жизненную энергию, которую необходимо использовать ради достижения важной глобальной идеи. Если не видите цели своей жизни, направления для приложения этой энергии, то она задерживается в организме. Происходят сбои в жизненно важных системах, особенно часто страдает опорно-двигательный аппарат, нередко ноги или нервная система.\n\n(2) Вы должны работать с информацией не глубоко, а достаточно поверхностно, передавая ее дальше. При невыполнении этого условия (слишком глубокое погружение в информацию, удерживание ее в себе, отсутствие передачи) страдают органы, которые принимают информацию из внешнего мира. Это глаза, нос, уши, язык, слизистые оболочки и кожные покровы. Для снятия проблемы не стоит углубляться в важные сведения, поглощать слишком много информации. Обязательно передавать важные сведения дальше. В целом стоит смотреть на жизнь проще, позволять себе больше развлечений, смотреть легкие фильмы и читать книжки популярного плана."
                    }
                   },
                   {
                    "id": 3708,
                    "content": "Проблемы со здоровьем: В вашей ситуации встречаются заболевания глаз, ушей, частые проблемы с зубами. Потеря здоровья может быть связана с затылочной областью или проблемами в зоне лица. В более широком плане это выражается в проблемах при общении, отсутствии друзей, недостатке логики, постоянных протестах против систем, в которых находитесь (работа, семья, страна).\nПричины: Вы живете собственными иллюзиями и сильно оторваны от реальности. Часто настолько отдаетесь выражению протеста против внешнего мира, что забываете о работе и семейных обязанностях. У вас не хватает времени часто даже на самое необходимое. При этом вы рассуждаете и мечтаете о глобальных вещах, которые не в силах поменять. Свою же жизнь не принимаете и не можете выстроить будущее, заняться своей судьбой. Живете как живется, словно плывете по течению. При этом вас тревожит ощущение существования не своей жизнью (в профессии, месте жительства, в личных отношениях). Вы словно раздвоены, так как ваш внутренний мир не соответствует внешним ценностям. Отсюда неустроенность жизни, разлад между глубинными желаниями (которые боитесь даже постигнуть) и навязанными стереотипами общества. Могут возникнуть проблемы с психическим состоянием. \nРешение проблемы: Вам нужно расширить свой кругозор и принимать информацию из разных источников. Помогайте благоустройству общества, работайте со своим внутренним “я” и глубинным сознанием. Важно найти свое предназначение в жизни, свой особый энергетический поток и следовать ему. Возможно, придется полностью сменить систему ценностей, отказаться от иллюзий, за которые держались раньше. Не бойтесь остаться наедине с собой для глубокого постижения своей миссии в жизни. Осознайте свою роль, откажитесь от вредных привычек, научитесь грамотно распределять время и деньги. Самодисциплина станет важным шагом к переустройству жизни. Не забывайте о постоянном развитии своей личности.\n",
                    "created": "2020-09-02T01:13:20.071236Z",
                    "edited": "2020-09-02T01:13:20.071237Z",
                    "type_id": 25,
                    "language": "ru",
                    "personal": true,
                    "combination": "2",
                    "gender": "",
                    "type": "expandable",
                    "title": "Затылочные и височные доли мозга, глаз, уши, нос, лицо, верхняя челюсть, зубы верхней челюсти, зрительный нерв, кора головного мозга",
                    "tintColor": "",
                    "additional": {
                     "personalRecommendations": "(10) Вам важно в жизни научиться принимать помощь извне от людей, коллег, приятелей, а особенно от своего рода, семьи. Если намеренно отгораживаться, проявлять свою независимость, могут начаться самые серьезные проблемы со здоровьем вплоть до образования злокачественных опухолей. Возможны и другие заболевания, которые ограничивают свободу передвижения, полноценность жизни, так что вам вынужденно придется научиться просить помощь близких. Научитесь доверять людям, осознавать себя частью семьи, чувствовать помощь и защиту. Не оставайтесь наедине с проблемами, принимайте помощь с благодарностью. Тогда здоровье начнет поправляться.\n\n(20) Вы можете проходить глубинные процессы изменений во всех системах. Для этого понадобится большая работа, длительная трансформация образа жизни и вашего сознания. Вас слишком многое тянет в прошлое. Плохо, если настанет момент, когда оглянетесь назад и поймете, что прожили правильную, но очень стандартную, скучную жизнь, не привнеся в мир ничего ценного, запоминающегося. Тогда начинаются проблемы с физическим и эмоциональным здоровьем. Вы можете освободиться от этого и излечиться при поддержке своих родных, сделав рывок и усилие над собой. С любовью близких вам доступны значительные трансформации жизни. Все в ваших руках (особенно когда терять становится нечего) от перемены места жительства до вероисповедания. С вашего перерождения начнется и новый этап жизни окружающих вас людей."
                    }
                   },
                   {
                    "id": 3709,
                    "content": "Проблемы со здоровьем: Часто повторяются заболевания горла, могут возникнуть проблемы с щитовидкой, нижней челюстью. Нередко болят плечи или руки. На бытовом уровне вы не говорите правду, лжете себе и другим, возможно неумение выражать мысли, некоммуникабельность или наоборот - постоянное перебивание собеседника.\nПричины: Вы боитесь говорить правду, даже ту информацию и знания, в которых уверены, пережили на собственном опыте. Делиться хочется и одновременно страшно, потому что последствия могут быть в будущем. Вы ведете себя шаблонно и так же мыслите, не готовы проявлять свое творческое начало, уникальную личность. Боитесь осуждения и неодобрения, а отсюда проблемы в общении, замкнутость, заниженная самооценка, неумение выражать себя и говорить в буквальном смысле (глотание слов, сбивчивый голос). Вы стараетесь следовать всем понятным догмам, имеете множество распространенных в обществе предрассудков, боитесь отличаться от других. При этом много фантазируете и говорите неправду, а отсюда сразу начинаются проблемы со здоровьем. Лжете не только другим, но даже себе.\nРешение проблемы: Нужно пересмотреть и проанализировать опыт прошлого. Передать всю его ценность и постигнутые вами истины людям в любой словесной, устной форме. Вам важно начать говорить, это может быть видео ролик на ютубе, песня в караоке, первый в жизни тост в большой компании. Высказывайтесь на собраниях и на работе при принятии коллективных решений, просто пойте в ванной, рассказывайте что-то в кругу друзей. Но обязательно начинать проговаривать свои мысли, опыт и мнение. Говорите правду и избегайте лжи в любой форме. Для успеха используйте подсказки жизни и больше прислушивайтесь к себе. Занимайтесь творческим самовыражением.\n\n",
                    "created": "2020-09-02T01:13:20.131459Z",
                    "edited": "2020-09-02T01:13:20.131459Z",
                    "type_id": 25,
                    "language": "ru",
                    "personal": true,
                    "combination": "3",
                    "gender": "",
                    "type": "expandable",
                    "title": "Щитовидная железа, трахея, бронхи, горло, голосовые связки, плечи, руки, седьмой шейный позвонок, все шейные позвонки, нижняя челюсть, зубы нижней челюсти",
                    "tintColor": "",
                    "additional": {
                     "personalRecommendations": "(9) Для вас характерно состояние уединения, внутренняя глубинная работа интеллекта и души, отсюда часто нежелание меняться. При этом вы и боитесь уединения, и одновременно ищете его. Интуитивно вы понимаете, что следует соблюдать баланс между спокойствием, одиночеством рабочего процесса и общением в другое время, передачей знаний и обмена опытом с людьми. Если вы считаете себя слишком самодостаточным, избегаете общения, то развития не происходит. Вам все сложнее открывать новые знания, так как глубина погружения в них не помогает, нужно расширять кругозор. Вы можете дойти до того, что начнете терять энергию, угасать, при этом не понимая, что происходит. Видимых причин вашим недомоганиям нет, а диагноз сразу поставить сложно. Проблемы, как правило, возникают с работой внутренних органов. Вам нужен круг единомышленников, который поможет разобраться в себе, выйти из замкнутости, понять свое предназначение и начать двигаться дальше, делясь полученными знаниями.\n\n(18) Необходимо ясное понимание желаний. Глубинные причины процессов, принятие двух мнений в единое целое - ваше кредо. Если происходит проявление на физическом уровне, значит человек “потерялся” (сегодня проснулся - одна картинка мира, завтра другая). Сегодня рука болит, а завтра нет, а послезавтра не понимает, болит или нет. Нет понимания того, что происходит, сложно выделить и нарисовать общую картину процессов. Всегда есть две стороны, два человека, которые что-то советуют: два родственника, две фазы, две болезни. В какой-то сфере жизни существует двоякость, непонятные ощущения, отчего в голове возникает путаница. В результате сегодня происходит так, завтра по-другому. Важно прислушаться к себе, найти силы услышать оба мнения и найти единственно верную золотую середину."
                    }
                   },
                   {
                    "id": 3710,
                    "content": "Проблемы со здоровьем: Проблемы обычно наблюдаются с сердцем, легкими, бронхами. Возможны травмы ребер и все заболевания, связанные с областью грудной клетки. Это проявляется и на бытовом уровне: вам словно что-то мешает расправить грудь и дышать в полную силу. Много планов, но нет энергии на их реализацию. \nПричины: Вы находитесь в глубочайшей депрессии и словно полностью обесточены. Нет сил двигаться вперед, все время обращаетесь к какому-то случаю в прошлом. Нередко испытываете чувство вины и раскаяния. Вы хотите словно застраховаться от неприятностей, но не знаете как. Поэтому страшно идти дальше, реализовывать свои идеи, помогать другим создавать лучшее будущее. В то же время и внутри вы недостаточно испытываете любви к окружающим, словно ничем не наполнены. Настоящее вас не радует, непонятно, как дальше жить и выходить из состояния глубокого физического и душевного упадка. Это может выражаться как в полном равнодушии и желании, чтобы вас все оставили в покое, так и в излишней жертвенности по отношению к другим. Вы много отдаете, но ничего не получаете взамен, энергия тратится впустую, вы не чувствуете удовлетворения. Порой сами ждете чудесной помощи извне, решения ваших проблем.\nРешение проблемы: Полезно проговорить все, что вас мучает с близкими, единомышленниками или психологом. Пусть это будет своеобразная исповедь, раскрытие своих плохих поступков и черт характера, за которые вам стыдно. Вы можете таким образом даже самостоятельно создавать группы для обмена знаниями и опытом в построении счастливых, гармоничных отношений. Вам необходимо построить для себя новую картину мира, научиться верить и любить взаимно и счастливо. Учитесь чему-то новому и всегда имейте пространство комфорта, где можно быть собой и просто расслабиться с близкими. Проанализируйте свое окружение и общайтесь с истинными друзьями, не тратя время на пустые контакты. Будьте настоящим, старайтесь выражать свои эмоции открыто. Переведите фокус со своих проблем на общие задачи своего круга общения. Научитесь принимать людей и себя со всеми светлыми и темными сторонами. Так в нужный момент вы сможете собраться и стать самодостаточным, без обвинений себя и окружающих, без зависимости от чужого одобрения или помощи.\n\n",
                    "created": "2020-09-02T01:13:20.186172Z",
                    "edited": "2020-09-02T01:13:20.186173Z",
                    "type_id": 25,
                    "language": "ru",
                    "personal": true,
                    "combination": "4",
                    "gender": "",
                    "type": "expandable",
                    "title": "Сердце, кровеносная система, органы дыхания, легкие, бронхи, грудной отдел позвоночника, рёбра, лопаточная зона спины, грудь",
                    "tintColor": "",
                    "additional": {
                     "personalRecommendations": "(17) Вы обладаете важной способностью верно оценивать любую ситуацию, понимать потенциал, но при этом многое замалчиваете. То же самое происходит и тогда, когда в вашей собственной жизни появляются проблемы. Выход из них становится возможным только при широкой огласке проблемы. Важно заявить о ней, привлечь внимание. Очень часто вы отказываетесь даже от реально действующей панацеи для организма, потому что точно знаете, как вам будет лучше. Важно консультироваться со специалистами, излагать свой взгляд на проблемы со здоровьем. Иначе при замалчивании и утаивании проблемы могут возникнуть серьезные осложнения и обострения течения заболеваний.\n\n(7) Для вас просто необходимо выбрать уникальный вектор своего развития и неуклонно следовать ему, поверить в себя и свое самоопределение. Иначе при отсутствии движения жизнь станет ставить вам препятствия в виде различных ограничений. Чаще всего проблемы связаны с ногами, могут возникать различные травмы. Также бывают нарушения зрения, функционирования головного мозга. Тогда, оказавшись временно без движения, которое раньше не ценилось, вы будете вынуждены побыть наедине с собой, углубиться в себя и прислушаться к внутреннему голосу интуиции. Переосмыслив таким образом свою жизнь, сможете начать ценить ее, свою особость, мысли и переживания, стремления. Обретя уверенность, начинайте двигаться вперед. Тогда станут решаться и проблемы со здоровьем."
                    }
                   },
                   {
                    "id": 3712,
                    "content": "Проблемы со здоровьем: Заболевания могут быть в области желудочно-кишечного тракта. Нередко поражается средняя часть позвоночника. На поведенческом уровне это выражается в агрессии, раздражительности, неадекватности. Равнодушие может резко переходить в злобу и требовательность. Вы теряете что-то важное и делаете все, чтобы удержать это, в том числе незаконными методами, нарушая все нормы морали и права. \nПричины: Вы испытываете слишком сильную привязанность в отношении к человеку, либо вещам, обстоятельствам, образу жизни. При этом сами наделяете их исключительными, ценными для себя свойствами. Для вас важно контролировать и обладать. Вы часто высокомерны и амбициозны, любите показывать свою парадную сторону жизни и гордиться успехами. Ради результата не видите недостойных средств. В то же время можете быть безответственны. С людьми ниже вас по социальной лестнице, зависимыми (например, подчиненные на работе) не контактируете совсем. В какой-то момент жизнь начинает отнимать самое важное, чтобы вы начали действовать, развиваться, выходить из привычной зоны комфорта. Но вместо этого вы жалуетесь или проявляете агрессию. Не хотите меняться и хватаетесь за то, что у вас отбирают, любыми путями. Придется столкнуться с собой внутренним и понять, что не все зависит от вас и подвластно вашему влиянию. Как только сможете отпустить это - угроза потери минует. \nРешение проблемы: Определите новые границы жизни, уберите прежние рамки, вы должны развиваться. Переоцените окружение и принимайте мир таким, как он есть, без гордости и высокомерия. Совершайте спонтанные поступки и избавляйтесь от собственных комплексов. Сделайте что-то несвойственное вам (неожиданное путешествие или кардинальная смена имиджа). Начните выстраивать отношения с разными людьми, а не только с теми, кто вам выгоден. Неплохо начать заниматься благотворительностью. Дисциплинируйте себя и развивайте волю через спорт, правильное питание, соблюдение режима. Так вы сможете освободиться от рамок и собственного недовольства, разочарования, агрессии. Станьте хозяином своего тела и эмоций.\n",
                    "created": "2020-09-02T01:13:20.295882Z",
                    "edited": "2020-09-02T01:13:20.295883Z",
                    "type_id": 25,
                    "language": "ru",
                    "personal": true,
                    "combination": "5",
                    "gender": "",
                    "type": "expandable",
                    "title": "ЖКТ, органы брюшной полости, поджелудочная железа, селезёнка, печень, желчный пузырь, тонкий кишечник, центральная часть позвоночника",
                    "tintColor": "",
                    "additional": {
                     "personalRecommendations": "(8) Для вас важно существование в рамках системы, от которой вы чувствуете стабильность и защиту. Это может быть, как большая семья, так и коллектив на работе. Если по какой-то причине вы живете уединенно, не принадлежа обществу, не входя в крупную систему, могут начаться проблемы со здоровьем. То же самое происходит, если вы вынуждено выпали из системы (развод, увольнение или сокращение на работе). Тогда случаются гормональные сбои, заболевания иммунной системы. Чтобы преодолеть это, необходимо осознать свое положение, свою важность и роль для системы, семейные ценности и родовые программы. Подумайте, для какой новой сферы вы можете быть полезны, применяя свои навыки и знания. Необходимо не чувствовать себя брошенным за борт, а принять, что лодка может быть другой, как и команда гребцов в ней. Найдите свое место в новой системе и живите дальше.\n\n(16) Для вас характерна жизнь по циклам спадов и подъемов, вы движетесь резкими рывками. Это неминуемо отражается и на вашем здоровье в виде частых травм, переломов. Рвутся самые тонкие и уязвимые места в организме очень внезапно. У вас есть что-то проблемное внутри, что мешает жить и двигаться нормально. Вы очень боитесь перемен, но периодически возникает необходимость в них. Если не следовать обновлению, нормальным циклам жизни, то организм сам запускает механизм саморазрушения, чтобы перевернуть жизнь с ног на голову. Важно своевременно отслеживать такие моменты необходимости перемен и причины, мешающие им. Двигайтесь вперед хотя бы маленькими шажками, если все новое пугает.\n   \n"
                    }
                   },
                   {
                    "id": 3713,
                    "content": "Проблемы со здоровьем: В физическом плане можно страдать от заболевания таких органов, как почки, печень, толстый кишечник, половая сфера, надпочечники, поясничный отдел. На бытовом уровне это отражается в чувстве постоянной вины, ощущения нехватки любви, раздражительности, отсутствии радости ото всего. Вы можете уходить от ответственности или чрезмерно искать выгоду во всем при недостатке плодов от вашей деятельности. Не повышают зарплату, нет заказов, вы начинаете экономить и выгадывать, впадаете в еще большую депрессию.\nПричины: Часто все идет из детства, когда родители недостаточно уделяли внимания, где-то недооценили, недолюбили. Когда во взрослой жизни сталкиваетесь с подобной ситуацией, внутри просыпается тот обиженный ребенок. И вы моментально ставите себе блок, отказываетесь от дальнейших действий. Вслед за этим возникает чувство вины, что не выполнили обязательства, поступили неправильно. И так повторяется много раз вплоть до серьезного крушения в жизни (как потеря работы). У вас нет сил для творчества, создания каких-то плодов деятельности. Не заводите детей, ведь внутренне еще сами довольно инфантильны и не дали достаточно ребенку в себе. Нет энергии, сил и знаний откуда взять вдохновение для жизненного толчка.\nРешение проблемы: Примите своих родителей и полюбите в себе того недолюбленного ребенка. Позвольте себе жить как хочется, реализуйте свои желания одно за другим. Найдите единомышленников, заведите друзей, с которыми можно проговаривать и решать свои эмоциональные проблемы. Откажитесь от крайностей - чрезмерного шопоголизма или фанатичного накопления ценностей. Избавьтесь от внутреннего стыда перед собой и близкими. Позвольте реализоваться себе творчески. Ищите источник энергии для себя в приятных вещах. Это может быть массаж, организация мероприятий, забота о внешности, любой вид отдыха. Важно найти любимое занятие и работать в комфортной зоне, где сможете максимально раскрыться.\n\n",
                    "created": "2020-09-02T01:13:20.351316Z",
                    "edited": "2020-09-02T01:13:20.351316Z",
                    "type_id": 25,
                    "language": "ru",
                    "personal": true,
                    "combination": "6",
                    "gender": "",
                    "type": "expandable",
                    "title": "Надпочечники, матка и яичники, почки, кишечник, предстательная железа у мужчин, поясничный район позвоночного столба",
                    "tintColor": "",
                    "additional": {
                     "personalRecommendations": "(12) Ваше физическое тело служит как некий инструмент для взаимодействия других, объединения людей, демонстрации общего состояния в группе и возможных проблем. Вы можете испытывать разные недуги, жаловаться на недомогание. При этом все сразу собираются вокруг вас и начинают проявлять лучшие качества, в том числе и друг к другу (не только к вам). Так вскрываются и решаются внутренние проблемы, выясняются сложности во взаимоотношениях. Вы являетесь своеобразным помощником людям, служите им, сигнализируя своими болезнями, что вокруг все плохо. Чтобы предотвратить собственные недомогания, надо работать с окружением, вовремя вскрывать и показывать проблемы.\n\n(10) Вам важно в жизни научиться принимать помощь извне от людей, коллег, приятелей, а особенно от своего рода, семьи. Если намеренно отгораживаться, проявлять свою независимость, могут начаться самые серьезные проблемы со здоровьем вплоть до образования злокачественных опухолей. Возможны и другие заболевания, которые ограничивают свободу передвижения, полноценность жизни, так что вам вынужденно придется научиться просить помощь близких. Научитесь доверять людям, осознавать себя частью семьи, чувствовать помощь и защиту. Не оставайтесь наедине с проблемами, принимайте помощь с благодарностью. Тогда здоровье начнет поправляться.\n\n(22) Вам необходимо проще относиться ко всему материальному, жить легче с открытым сердцем, не принимать близко к душе проблемы. Наслаждайтесь настоящим моментом, проводите время веселее, не привязывайтесь к материальному и помните о вечности духовного. Если слишком важное место отдавать материальному миру, то могут начаться потери именно того, на чем акцентируется внимание, в том числе и здоровья. Не исключены болезни, связанные с ограничением передвижения, инвалидность. Выйти за рамки физической несвободы поможет духовное освобождение. Нужно понять и принять свое состояние и прийти к тому, что у вас много возможностей для развития и нормальной жизни, вы свободны душой и разумом, а значит - границ не существует."
                    }
                   },
                   {
                    "id": 3714,
                    "content": "Проблемы со здоровьем: На физическом плане начинаются проблемы с ногами, мочеполовой системой, областью крестца. В жизненном плане сопровождается материальным голодом, крушением жизни, постоянной нехваткой денег, чувством брошенности и неоцененности. Вы испытываете усталость и чувство безнадежности ситуации. \nПричины: Вы слишком зациклены на прошлом, живете в нем, постоянно возвращаетесь туда воспоминаниями. Здесь возможно два варианта. Когда-то было очень хорошо - благополучие, счастье, достаток. А сейчас - плохо, и вы не можете принять ситуацию, живете воспоминаниями о прошлом. Или наоборот - в прошлом было несколько повторяющихся ситуаций с проблемами, неудачами, предательством. Вы не можете этого забыть и двигаться вперед. Постоянно крутитесь как белка в колесе, но ничего не меняется. От этого усталость, страх на грани выживания, вы экономите на всем и постоянно себя сдерживаете. Хочется просто уже отказаться от движения, так как нет энергии и результата. Ждете “волшебной палочки”, которая решит все за вас. \nРешение проблемы: Пересмотрите свои ценности и отношение к прошлому. Умейте видеть хорошее в настоящем. Даже в самом неудачном прошлом тоже найдите позитивные примеры и уроки. Нужно быть готовым к переменам. Сделайте для себя настоящее более ценным, чем прошлое. Все проблемы не навсегда, жизнь течет, а ситуации меняются. Будьте готовы поймать благоприятный момент. Полезно заняться чем-то по-настоящему увлекательным и интересным, пусть даже вначале не приносящим больших денег. Освободитесь от прошлого и на элементарном, бытовом уровне. По возможности, сделайте ремонт или поменяйте часть обстановки, уберите старые фото и вещи.\n\n\n",
                    "created": "2020-09-02T01:13:20.407303Z",
                    "edited": "2020-09-02T01:13:20.407303Z",
                    "type_id": 25,
                    "language": "ru",
                    "personal": true,
                    "combination": "7",
                    "gender": "",
                    "type": "expandable",
                    "title": "Мочеполовая система, нижние конечности, толстый кишечник, копчик, крестец, ноги",
                    "tintColor": "",
                    "additional": {
                     "personalRecommendations": "(4) Вам важно всегда контролировать ситуацию. Когда это невозможно, вы начинаете ставить блоки и ограничения для людей, обстоятельств. Обычно это не имеет желаемого результата, но отражается на физическом состоянии в виде возникновения нарывов, абсцесса, опухолей разного рода. Для вас бесполезно контролировать определенную узкую область, не отпускать что-то. Более правильным будет запуск проектов глобального масштаба, неких сверхзадач. Так можно чувствовать себя более комфортно и предсказуемо, не отвлекаясь на контроль текущих мелочей.\n\n(2) Вы должны работать с информацией не глубоко, а достаточно поверхностно, передавая ее дальше. При невыполнении этого условия (слишком глубокое погружение в информацию, удерживание ее в себе, отсутствие передачи) страдают органы, которые принимают информацию из внешнего мира. Это глаза, нос, уши, язык, слизистые оболочки и кожные покровы. Для снятия проблемы не стоит углубляться в важные сведения, поглощать слишком много информации. Обязательно передавать важные сведения дальше. В целом стоит смотреть на жизнь проще, позволять себе больше развлечений, смотреть легкие фильмы и читать книжки популярного плана.\n\n(6) Ваша задача в жизни - воссоединение, центрирование информации, энергии, усилий людей. Хорошо делать командную работу, направлять коллектив. В противном случае возможно возникновение сразу нескольких нарушений в организме. При этом понадобится консультация одновременно многих специалистов с разными взглядами. Важно выявить все проблемы со здоровьем и решать их централизованно, так как они идут от одного корня. В этом случае также поможет команда для устранения глубинной причины разнообразных проблем в организме."
                    }
                   },
                   {
                    "id": 0,
                    "content": "() ",
                    "created": "0001-01-01T00:00:00Z",
                    "edited": "0001-01-01T00:00:00Z",
                    "type_id": 0,
                    "language": "",
                    "personal": false,
                    "combination": "",
                    "gender": "",
                    "type": "expandable",
                    "title": "Кровеносная система, нервная система, лимфатическая система, имунная система, те органы, которые находятся по всему организму, общий сбой работы организма",
                    "tintColor": "",
                    "additional": {
                     "personalRecommendations": "(12) Ваше физическое тело служит как некий инструмент для взаимодействия других, объединения людей, демонстрации общего состояния в группе и возможных проблем. Вы можете испытывать разные недуги, жаловаться на недомогание. При этом все сразу собираются вокруг вас и начинают проявлять лучшие качества, в том числе и друг к другу (не только к вам). Так вскрываются и решаются внутренние проблемы, выясняются сложности во взаимоотношениях. Вы являетесь своеобразным помощником людям, служите им, сигнализируя своими болезнями, что вокруг все плохо. Чтобы предотвратить собственные недомогания, надо работать с окружением, вовремя вскрывать и показывать проблемы.\n\n(7) Для вас просто необходимо выбрать уникальный вектор своего развития и неуклонно следовать ему, поверить в себя и свое самоопределение. Иначе при отсутствии движения жизнь станет ставить вам препятствия в виде различных ограничений. Чаще всего проблемы связаны с ногами, могут возникать различные травмы. Также бывают нарушения зрения, функционирования головного мозга. Тогда, оказавшись временно без движения, которое раньше не ценилось, вы будете вынуждены побыть наедине с собой, углубиться в себя и прислушаться к внутреннему голосу интуиции. Переосмыслив таким образом свою жизнь, сможете начать ценить ее, свою особость, мысли и переживания, стремления. Обретя уверенность, начинайте двигаться вперед. Тогда станут решаться и проблемы со здоровьем.\n\n(10) Вам важно в жизни научиться принимать помощь извне от людей, коллег, приятелей, а особенно от своего рода, семьи. Если намеренно отгораживаться, проявлять свою независимость, могут начаться самые серьезные проблемы со здоровьем вплоть до образования злокачественных опухолей. Возможны и другие заболевания, которые ограничивают свободу передвижения, полноценность жизни, так что вам вынужденно придется научиться просить помощь близких. Научитесь доверять людям, осознавать себя частью семьи, чувствовать помощь и защиту. Не оставайтесь наедине с проблемами, принимайте помощь с благодарностью. Тогда здоровье начнет поправляться."
                    }
                   }
                  ],
                  "trialAccess": false,
                  "positions": [
                   [
                    "a",
                    "b",
                    "l"
                   ],
                   [
                    "a2",
                    "b2",
                    "l1"
                   ],
                   [
                    "a1",
                    "b1",
                    "l2"
                   ],
                   [
                    "a3",
                    "b3",
                    "l3"
                   ],
                   [
                    "e",
                    "e",
                    "l4"
                   ],
                   [
                    "c1",
                    "d1",
                    "l5"
                   ],
                   [
                    "c",
                    "d",
                    "l6"
                   ],
                   [
                    "d3",
                    "c3",
                    "e3"
                   ]
                  ]
                 },
                 {
                  "imageName": "life_guidance",
                  "title": "Руководство по жизни",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 4299,
                    "content": "(1) Для вас важно верить в себя и собственные способности, развиваться самостоятельно, не оглядываясь на других. Идите своим путем, доверяйте чудесам, происходящим в вашей жизни и знакам судьбы. Очень важно выработать позитивное мышление, контролировать силу мысли, которая очень влияет на обстоятельства вокруг вас. Будьте решительны и целеустремлены, не сомневайтесь в себе. Действуйте самостоятельно и не бойтесь проявлять активность. Не забывайте о душевной щедрости, милосердии и умении прощать. Хорошо найти свое дело по душе, которое еще при этом и будет нести блага для других. Заботьтесь о своем теле, так как физические способности нужны для воплощения всех ваших идей. Старайтесь больше бывать на природе для восстановления энергии.\n\n(8) Научитесь придерживаться во всем золотой середины и сохранять нейтралитет. Для вас важно не добиваться справедливости, а искать истину, скрытые мотивы и процессы, которые управляют людьми и событиями. Вырабатывайте в себе и окружающих позитивное мышление и в каждой сложной ситуации старайтесь разглядеть урок жизни и извлечь пользу для себя. Не вмешивайтесь в споры и разбирательства без необходимости. Перестаньте осуждать кого бы то ни было. Больше учитесь и развивайтесь, будьте открыты всему новому. Не старайтесь скорее передать только что полученную информацию. Вы должны пережить ее на собственном опыте и проработать через себя.",
                    "created": "2020-09-02T01:13:58.592327Z",
                    "edited": "2020-09-02T01:13:58.592328Z",
                    "type_id": 24,
                    "language": "ru",
                    "personal": true,
                    "combination": "1",
                    "gender": "",
                    "type": "info",
                    "title": "Руководство по жизни",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": false,
                  "positions": [
                   [
                    "a",
                    "b",
                    "e"
                   ]
                  ]
                 },
                 {
                  "imageName": "forecast",
                  "title": "Прогноз на год",
                  "blockType": "forecast",
                  "blocks": [
                   {
                    "id": 5032,
                    "content": "(1) Период для самореализации через обучение, новые знания, самосовершенствование и свежие контакты, идеи, в том числе творческие. Можно выразить себя самыми разными способами, используя активную жизненную позицию. Инициатива, повышение своего уровня и передача знаний, расширение круга знакомых - станут ключами к успеху.\nВ это время хорошо получать основное/дополнительное образование, проходить курсы и тренинги. Деятельность мозга становится более приспособленной для восприятия информации, вы буквально готовы впитывать всё как губка.\nТакже хорошо проявлять коммуникативные навыки, больше появляться в обществе, заводить полезные знакомства и находить контакт с окружающими. Это будет полезно в будущем.\nХорошо раскрепоститься и позволить себе заниматься любимым делом. Важно верить в себя и раскрыть свой потенциал. Для самореализации в общественной жизни необходимо проработать свою самооценку и уверенность в себе.\nВозможны ключевые события:\nПоложительные:\nХорошее и стабильное финансовое положение. Полезные связи и знакомства...Продолжение в платной версии\n\n(4) Мужчина в этот период должен максимально проявить свои мужские лидерские качества. Нужно развивать дисциплину, логичность, активность, реализовывать амбиции, мыслить стратегически, брать ответственность на себя и принимать решения. Основные события будут развиваться вокруг карьеры и социальной реализации. Обычно наблюдается повышение по службе или открытие собственного бизнеса, его развитие. Возможно участие в крупных проектах. Нередко этот период становится временем строительства, приобретения какой-либо недвижимости. В семье может появиться наследник мужского пола. Если родится девочка, то у неё будет мужской сильный характер.\nМужчине важно не конфликтовать с другими представителями своего пола. А особенно наладить отношения с отцом. Полезно поговорить по душам, простить друг другу прежние обиды и недопонимание. Даже если отец неправ, не стоит показывать свою значимость или самоутверждаться за его счёт. Гораздо полезнее будет потратить эту энергию для достижения успеха в работе.\nВозможны ключевые события:\nПоложительные:\nПризнание в обществе через получение высокой должности или какие-то другие достижения. Открытие своего дела или успешный рост существующего...Продолжение в платной версии\n\n(5) Время знаменует собой максимальный фокус на семью и дела близких. Благоприятно для вступления в брак, рождения детей. Ваша помощь может потребоваться близким, возможно решение каких-то семейных дел, установление новых традиций в роду. При этом необходимо соблюдать баланс в отношениях и взаимодействии с родными. Не стоит слишком цепляться за родственников (старших, младших), живя их жизнью, ставя себя в положение жертвы или излишне опекая. Подросших детей придётся отпустить в самостоятельную жизнь. Со старшими в роду важно поддерживать здоровые уважительные отношения, оказывая внимание и заботу. Но проживать свою жизнь и действовать по своему разумению, в рамках сформированной системы внутренних ценностей.\nЭтот период характеризуется расстановкой приоритетов. Возможно, захочется навести порядок как буквально (в быту), так и в разных сферах жизни. Действуйте экологично, соблюдая порядок не только в доме, но и в эмоциональном плане, в мыслях. Старайтесь не опаздывать и вообще серьезнее относиться к ресурсам времени (своего и чужого), полезно соблюдать режим дня и систематизировать свою жизнь, разложив всё по полочкам.\nПолезным будет обучение, самосовершенствование как в личном, так и в профессиональном плане. Хорошо пройти курсы, получать новые знания и использовать их на практике. Важно не только копить знания, но и делиться ими.\nОсобенное внимание стоит уделить бумагам, официальным документам. Придётся следить за их правильным оформлением.\nВозможны ключевые события:\nПоложительные:\nДля молодых людей - обучение, получение документов, отделение от родителей и начало самостоятельной жизни. Возможно вступление в брак с подходящим партнёром, который крепко стоит на ногах...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:34.176635Z",
                    "edited": "2022-02-05T09:51:39.054331Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "1",
                    "gender": "",
                    "type": "expandable",
                    "title": "20",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5046,
                    "content": "(6) Период максимально направлен на отношения с окружающими, внешнюю красоту и внутреннюю гармонию. Важно поддерживать все сферы в балансе и идти за своими ощущениями, не действуя по указке или желаниям, интересам других.\nОбустраивайте пространство вокруг себя и уделяйте себе особое внимания, балуя и украшая. В такое время особенно чувствуется потребность в тактильности, в любви.\nХочется самому проявлять нежность, ласку и получать в ответ от других. Важно внимание, уход, забота. Человек в такой период склонен влюбляться, стремится найти свою половинку. А если она уже есть, то максимально фокусируется на близости с партнером, на качестве отношений. Если не хватает внимания и ласки от близкого человека, на этом фоне могут возникать обиды и недопонимание. Не стоит уходить в себя и замалчивать проблемы. Проявляйтесь сами и открыто говорите о том, чего хотите. Есть возможность планирования появления детей в семье.\nАктивно раскрываются коммуникативные способности, есть потребность быть в хороших отношениях с окружающими, нравиться всем. Остро хочется наконец-то выделить время для хобби, особенно творческих (от цветоводства до дизайна).\nПри непонимании с окружающими, а особенно близкими, старайтесь сгладить острые конфликты и идти на примирение первыми. Это скажется положительно, прежде всего, на вас.\nВозможны ключевые события:\nПоложительные:\nМного новых знакомств, общения и приятных контактов. Флирт и влюбленность, благополучные новые отношения, помолвка, свадьба...Продолжение в платной версии\n\n(17) Отличное время для ярких и творческих особ со множеством увлечений и талантов. Даже если вы не любите бывать на публике, этот период станет возможностью сказать миру слово о себе, получить славу, признание популярность.\nВажно быть готовым к грядущим переменам. Хорошо сменить имидж, поработать с внешностью и самооценкой. Развивайте в себе таланты, харизму, природные данные. Чаще полезно бывать в общественных местах от шумных вечеринок до выставок. Вдохновение вы можете получить где угодно. Не исключено, что ваше хобби в данный период станет профессией и приятным способом получить не только известность, но и статус, комфорт, материальные блага. Используйте свои навыки, творчество, знания для этого.\nВажно развивать уверенность в себе, раскрыть свой внутренний мир людям. Публичные выступления, мероприятия, где вы будете в центре внимания - позволят добиться желаемого результата.\nВозможны ключевые события:\nПоложительные:\nЗанятие любимым делом, путешествия, творческий и духовный подъем, возможность зарабатывать, занимаясь искусством. Счастливые знаки судьбы и неожиданная важная помощь извне...Продолжение в платной версии\n\n(5) Время знаменует собой максимальный фокус на семью и дела близких. Благоприятно для вступления в брак, рождения детей. Ваша помощь может потребоваться близким, возможно решение каких-то семейных дел, установление новых традиций в роду. При этом необходимо соблюдать баланс в отношениях и взаимодействии с родными. Не стоит слишком цепляться за родственников (старших, младших), живя их жизнью, ставя себя в положение жертвы или излишне опекая. Подросших детей придётся отпустить в самостоятельную жизнь. Со старшими в роду важно поддерживать здоровые уважительные отношения, оказывая внимание и заботу. Но проживать свою жизнь и действовать по своему разумению, в рамках сформированной системы внутренних ценностей.\nЭтот период характеризуется расстановкой приоритетов. Возможно, захочется навести порядок как буквально (в быту), так и в разных сферах жизни. Действуйте экологично, соблюдая порядок не только в доме, но и в эмоциональном плане, в мыслях. Старайтесь не опаздывать и вообще серьезнее относиться к ресурсам времени (своего и чужого), полезно соблюдать режим дня и систематизировать свою жизнь, разложив всё по полочкам.\nПолезным будет обучение, самосовершенствование как в личном, так и в профессиональном плане. Хорошо пройти курсы, получать новые знания и использовать их на практике. Важно не только копить знания, но и делиться ими.\nОсобенное внимание стоит уделить бумагам, официальным документам. Придётся следить за их правильным оформлением.\nВозможны ключевые события:\nПоложительные:\nДля молодых людей - обучение, получение документов, отделение от родителей и начало самостоятельной жизни. Возможно вступление в брак с подходящим партнёром, который крепко стоит на ногах...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.382479Z",
                    "edited": "2022-02-05T09:51:40.536734Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "6",
                    "gender": "",
                    "type": "expandable",
                    "title": "21-22",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5044,
                    "content": "(5) Время знаменует собой максимальный фокус на семью и дела близких. Благоприятно для вступления в брак, рождения детей. Ваша помощь может потребоваться близким, возможно решение каких-то семейных дел, установление новых традиций в роду. При этом необходимо соблюдать баланс в отношениях и взаимодействии с родными. Не стоит слишком цепляться за родственников (старших, младших), живя их жизнью, ставя себя в положение жертвы или излишне опекая. Подросших детей придётся отпустить в самостоятельную жизнь. Со старшими в роду важно поддерживать здоровые уважительные отношения, оказывая внимание и заботу. Но проживать свою жизнь и действовать по своему разумению, в рамках сформированной системы внутренних ценностей.\nЭтот период характеризуется расстановкой приоритетов. Возможно, захочется навести порядок как буквально (в быту), так и в разных сферах жизни. Действуйте экологично, соблюдая порядок не только в доме, но и в эмоциональном плане, в мыслях. Старайтесь не опаздывать и вообще серьезнее относиться к ресурсам времени (своего и чужого), полезно соблюдать режим дня и систематизировать свою жизнь, разложив всё по полочкам.\nПолезным будет обучение, самосовершенствование как в личном, так и в профессиональном плане. Хорошо пройти курсы, получать новые знания и использовать их на практике. Важно не только копить знания, но и делиться ими.\nОсобенное внимание стоит уделить бумагам, официальным документам. Придётся следить за их правильным оформлением.\nВозможны ключевые события:\nПоложительные:\nДля молодых людей - обучение, получение документов, отделение от родителей и начало самостоятельной жизни. Возможно вступление в брак с подходящим партнёром, который крепко стоит на ногах...Продолжение в платной версии\n\n(13) Период кардинальных перемен и резких поворотов в судьбе. Грядут события, после которых жизнь уже не станет прежней. Они могут быть как положительными, так и горькими (вплоть до смерти кого-то из близкого окружения). Важно принять их, какими бы они ни были. Придётся следовать за событиями и процессами, которые становятся совсем неожиданными, но необходимыми.\nВаша роль - принятие, готовность к переменам, непротивление, мудрость. Необходимо самостоятельно начать отпускать всё старое, ненужное и изжившее себя в это время от работы, отношений, которые уже не устраивают, до вещей (например, заняться расхламлением). Придётся буквально подстраиваться под быстро меняющуюся обстановку и следовать за происходящим, не обдумывая долго и не погружаясь глубоко в события. Будет полезно научиться принимать решения быстро и при этом стратегически верно.\nТакой период нередко несёт изменения в самых разных сферах сразу: кризисные ситуации на работе, в отношениях, проблемы со здоровьем. Поэтому не стоит напрасно пускаться в авантюры, совершать рискованные поступки, излишне разбрасываясь временем и энергией. Хорошо начать здоровый образ жизни, отказаться от плохих привычек, следить за рационом.\nВажно не пытаться удерживать то, что уже стало лишним в вашей жизни, что не несет ничего нового, живительного, никакого движения. Это поможет впустить в жизнь свежую энергию и заложить основу для успешного будущего.\nВозможны ключевые события:\nПоложительные:\nПеремены в жизни, как правило, довольно кардинальные. В плане здоровья -хорошо прошедшая операция, избавление от серьезной болезни...Продолжение в платной версии\n\n(18) Период максимальной концентрации на личной жизни, саморазвитии, обустройстве дома. В это время усиливается эмоциональность, человек становится очень чувствительным. Важны люди, которые рядом, хорошие и гармоничные отношения. Полезно наводить порядок в доме и заниматься его благоустройством. Не менее важно уделить внимание своей подсознательной стороне личности. Развитие, возможность быть собой, способность прислушиваться к себе и действовать по своим желаниям - ключевые моменты при этом.\nНа данном этапе особую важность обретают взаимоотношения с матерью и женщинами рода. Важно наладить контакт и поддерживать хорошее общение. Ваша чуткость и эмпатия в этот период помогут буквально чувствовать непростой женский характер.\nОбразы, мысли становятся наиболее яркими и имеют силу воплощаться в реальность. Жить в такой период нужно максимально осознанно, выбирая то, о чём думаете. Легко можно реализовать планы и мечты благодаря способности позитивно мыслить. Но также могут сбыться негативные посылы и страхи.\nВозможны ключевые события:\nПоложительные:\nНовые приятные отношения, долгожданная беременность. В доме уют и покой, комфорт...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.265077Z",
                    "edited": "2022-02-05T09:51:40.325805Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "5",
                    "gender": "",
                    "type": "expandable",
                    "title": "22.5-23",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5052,
                    "content": "(9) Время для глубокой внутренней проработки своей личности. Хорошо переосмыслить прошлый и настоящий опыт, задать себе правильные вопросы. Нередко люди в такой период усиленно занимаются поиском смысла жизни и себя в мире. Не стоит опираться на других людей и чужие умозаключения - все ответы уже есть внутри вас. Именно к себе, своему внутреннему голосу и стоит обратиться. Полезно больше времени проводить в одиночестве, на природе, заниматься йогой, читать книги по психологии, изучать законы Вселенной и построения взаимоотношений.\nЗанимайтесь творчеством и старайтесь выстроить доверительные, более глубокие отношения со спутником жизни, выходя на новый уровень. Ваша креативность, глубина, внутренний потенциал станут помощниками и в этом.\nПериод, когда многие пересматривают свой жизненный уровень, положение в обществе, доходы. Не исключено, что многое захочется скорректировать. Главное быть во всем умеренным, не делать резких или необдуманных шагов. В погоне за благосостоянием не экономьте на себе и тем более на здоровье. Вам необходим качественный уровень жизни.\nВозможны ключевые события:\nПоложительные:\nОтдых от трудов и уединённое состояние, возможно посещение особых сакральных мест, мест силы или святых мест. Духовный рост, творческое развитие личности обретение себя через обучение или обретение наставника...Продолжение в платной версии\n\n(22) Период, несущий много динамизма с собой, придётся быть активным и действовать, даже если вы обычно жили довольно размеренно. Будет тянуть в путешествия, захочется перемены обстановки. Либо могут возникать такие ситуации, которые заставят двигаться. Путешествия, много общения принесут в жизнь свежий поток новых идей, знакомства с полезными и нужными людьми (возможно, новые отношения), нужную информацию, возможности и самореализацию. Важно не цепляться за мелочи, быт, материальное, уметь жить в потоке и наслаждаться состоянием здесь и сейчас. Могут появиться внезапные денежные поступления, большая прибыль.\nПри этом зацикленность на материальном, какие-то привязки могут принести сложности. Начаться может с бытовых проблем и поломок. Но если не изменить ничего в своей жизни, то деньги будут утекать, а неприятности расти, накатывая снежным комом. Как только заметите подобное - сразу в путь. Пусть это будет даже выезд на несколько часов на природу или в соседний город.\nПолезно будет настраивать себя позитивно, уметь замечать хорошее в мелочах, больше радоваться, быть свободным. Ощущение свободы должно быть и у вашего окружения (партнёра, детей, коллег). Нельзя давить, сковывать кого-то, важно принимать особенности, взгляды и позицию других. Уметь поставить себя на место другого человека.\nНе исключено, что придётся начать всё с нуля. Для успешного начинания важно иметь опору, стержень внутри себя и меньше зависеть ото всего внешнего.\nВозможны ключевые события:\nПоложительные:\nПриятные знакомства, лёгкие и интересные отношения. Ощущение свободы, удача в делах, хорошие шансы в жизни...Продолжение в платной версии\n\n(4) Мужчина в этот период должен максимально проявить свои мужские лидерские качества. Нужно развивать дисциплину, логичность, активность, реализовывать амбиции, мыслить стратегически, брать ответственность на себя и принимать решения. Основные события будут развиваться вокруг карьеры и социальной реализации. Обычно наблюдается повышение по службе или открытие собственного бизнеса, его развитие. Возможно участие в крупных проектах. Нередко этот период становится временем строительства, приобретения какой-либо недвижимости. В семье может появиться наследник мужского пола. Если родится девочка, то у неё будет мужской сильный характер.\nМужчине важно не конфликтовать с другими представителями своего пола. А особенно наладить отношения с отцом. Полезно поговорить по душам, простить друг другу прежние обиды и недопонимание. Даже если отец неправ, не стоит показывать свою значимость или самоутверждаться за его счёт. Гораздо полезнее будет потратить эту энергию для достижения успеха в работе.\nВозможны ключевые события:\nПоложительные:\nПризнание в обществе через получение высокой должности или какие-то другие достижения. Открытие своего дела или успешный рост существующего...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.727198Z",
                    "edited": "2022-02-05T09:51:41.175801Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "9",
                    "gender": "",
                    "type": "expandable",
                    "title": "23.5-24",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5042,
                    "content": "(4) Мужчина в этот период должен максимально проявить свои мужские лидерские качества. Нужно развивать дисциплину, логичность, активность, реализовывать амбиции, мыслить стратегически, брать ответственность на себя и принимать решения. Основные события будут развиваться вокруг карьеры и социальной реализации. Обычно наблюдается повышение по службе или открытие собственного бизнеса, его развитие. Возможно участие в крупных проектах. Нередко этот период становится временем строительства, приобретения какой-либо недвижимости. В семье может появиться наследник мужского пола. Если родится девочка, то у неё будет мужской сильный характер.\nМужчине важно не конфликтовать с другими представителями своего пола. А особенно наладить отношения с отцом. Полезно поговорить по душам, простить друг другу прежние обиды и недопонимание. Даже если отец неправ, не стоит показывать свою значимость или самоутверждаться за его счёт. Гораздо полезнее будет потратить эту энергию для достижения успеха в работе.\nВозможны ключевые события:\nПоложительные:\nПризнание в обществе через получение высокой должности или какие-то другие достижения. Открытие своего дела или успешный рост существующего...Продолжение в платной версии\n\n(9) Время для глубокой внутренней проработки своей личности. Хорошо переосмыслить прошлый и настоящий опыт, задать себе правильные вопросы. Нередко люди в такой период усиленно занимаются поиском смысла жизни и себя в мире. Не стоит опираться на других людей и чужие умозаключения - все ответы уже есть внутри вас. Именно к себе, своему внутреннему голосу и стоит обратиться. Полезно больше времени проводить в одиночестве, на природе, заниматься йогой, читать книги по психологии, изучать законы Вселенной и построения взаимоотношений.\nЗанимайтесь творчеством и старайтесь выстроить доверительные, более глубокие отношения со спутником жизни, выходя на новый уровень. Ваша креативность, глубина, внутренний потенциал станут помощниками и в этом.\nПериод, когда многие пересматривают свой жизненный уровень, положение в обществе, доходы. Не исключено, что многое захочется скорректировать. Главное быть во всем умеренным, не делать резких или необдуманных шагов. В погоне за благосостоянием не экономьте на себе и тем более на здоровье. Вам необходим качественный уровень жизни.\nВозможны ключевые события:\nПоложительные:\nОтдых от трудов и уединённое состояние, возможно посещение особых сакральных мест, мест силы или святых мест. Духовный рост, творческое развитие личности обретение себя через обучение или обретение наставника...Продолжение в платной версии\n\n(13) Период кардинальных перемен и резких поворотов в судьбе. Грядут события, после которых жизнь уже не станет прежней. Они могут быть как положительными, так и горькими (вплоть до смерти кого-то из близкого окружения). Важно принять их, какими бы они ни были. Придётся следовать за событиями и процессами, которые становятся совсем неожиданными, но необходимыми.\nВаша роль - принятие, готовность к переменам, непротивление, мудрость. Необходимо самостоятельно начать отпускать всё старое, ненужное и изжившее себя в это время от работы, отношений, которые уже не устраивают, до вещей (например, заняться расхламлением). Придётся буквально подстраиваться под быстро меняющуюся обстановку и следовать за происходящим, не обдумывая долго и не погружаясь глубоко в события. Будет полезно научиться принимать решения быстро и при этом стратегически верно.\nТакой период нередко несёт изменения в самых разных сферах сразу: кризисные ситуации на работе, в отношениях, проблемы со здоровьем. Поэтому не стоит напрасно пускаться в авантюры, совершать рискованные поступки, излишне разбрасываясь временем и энергией. Хорошо начать здоровый образ жизни, отказаться от плохих привычек, следить за рационом.\nВажно не пытаться удерживать то, что уже стало лишним в вашей жизни, что не несет ничего нового, живительного, никакого движения. Это поможет впустить в жизнь свежую энергию и заложить основу для успешного будущего.\nВозможны ключевые события:\nПоложительные:\nПеремены в жизни, как правило, довольно кардинальные. В плане здоровья -хорошо прошедшая операция, избавление от серьезной болезни...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.151642Z",
                    "edited": "2022-02-05T09:51:40.116503Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "4",
                    "gender": "",
                    "type": "expandable",
                    "title": "25",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5056,
                    "content": "(11) Время роста и успеха, но в то же время и больших энергозатрат. Можно преуспеть в карьере и обществе вплоть до сильного влияния на большое количество людей, создания новых направлений. Период позитивный и дарящий много отдачи при разумном использовании своей силы. Именно сейчас важно привести себя в форму, научиться эффективно работать, а не перегружаться. Хорошо нормализовать своей режим дня, регулярно заниматься спортом, чаще бывать на свежем воздухе. Отводите время и на увлечения, выделяя этому свободное время. Так ваша работоспособность будет гораздо выше, нежели если вы будете бросаться от одного проекта к другому, взваливать на себя всё разом, постоянно создавать кипучую деятельность и задерживаться на работе.\nНе пожалейте время на профилактику хронических заболеваний и плановый медосмотр, чтобы не упустить важное. В противном случае сопутствующий такому периоду трудоголизм может довести до полного физического и нервного истощения.\nВозможны ключевые события:\nПоложительные:\nПериод прохождения испытания на выносливость, максимальное напряжение сил с отдачей в спорт, работу, бизнес, какую-либо плодотворную деятельность. Ситуация в ваших руках, и вы получаете повышение, признание...Продолжение в платной версии\n\n(5) Время знаменует собой максимальный фокус на семью и дела близких. Благоприятно для вступления в брак, рождения детей. Ваша помощь может потребоваться близким, возможно решение каких-то семейных дел, установление новых традиций в роду. При этом необходимо соблюдать баланс в отношениях и взаимодействии с родными. Не стоит слишком цепляться за родственников (старших, младших), живя их жизнью, ставя себя в положение жертвы или излишне опекая. Подросших детей придётся отпустить в самостоятельную жизнь. Со старшими в роду важно поддерживать здоровые уважительные отношения, оказывая внимание и заботу. Но проживать свою жизнь и действовать по своему разумению, в рамках сформированной системы внутренних ценностей.\nЭтот период характеризуется расстановкой приоритетов. Возможно, захочется навести порядок как буквально (в быту), так и в разных сферах жизни. Действуйте экологично, соблюдая порядок не только в доме, но и в эмоциональном плане, в мыслях. Старайтесь не опаздывать и вообще серьезнее относиться к ресурсам времени (своего и чужого), полезно соблюдать режим дня и систематизировать свою жизнь, разложив всё по полочкам.\nПолезным будет обучение, самосовершенствование как в личном, так и в профессиональном плане. Хорошо пройти курсы, получать новые знания и использовать их на практике. Важно не только копить знания, но и делиться ими.\nОсобенное внимание стоит уделить бумагам, официальным документам. Придётся следить за их правильным оформлением.\nВозможны ключевые события:\nПоложительные:\nДля молодых людей - обучение, получение документов, отделение от родителей и начало самостоятельной жизни. Возможно вступление в брак с подходящим партнёром, который крепко стоит на ногах...Продолжение в платной версии\n\n(16) На данном этапе человек теряет самое ценное для него. Обычно это касается достижений материального мира: близкий человек, отношения, деньги, могущество, власть, работа. Чем сильнее человек цепляется за какую-то материальную сферу жизни, тем вероятнее в ней потеря. Это кризис даётся человеку, чтобы он изменил свои взгляды, очнулся от бега по кругу и начал жить иначе. Предстоит непростой период становления, пробуждения духовно из-за неприятных перемен.\nПридётся отказаться ото всего прежнего: образа жизни, привычек, мировоззрения - переосмыслить личные ценности. Помогут различные глубокие учения и знания об устройстве мира от психологии до астрологии. На пути познания себя и мира хорошо делать то, чем раньше не занимались, ввести некие ограничения, осмысленные и доступные аскезы (в еде, удовольствиях, например).\nПолезно также экспериментировать и начинать новое от путешествий до знакомств, хобби. Лучше всего поменять всю среду и выйти из зоны комфорта, как бы неприятно и неожиданно это ни было. Если что-то при этом не удаётся, не стоит переживать. Времени начать новый цикл жизни будет достаточно. Важно проработать свои амбиции и неумеренное эго, которое для будущего будет только во вред.\nВозможны ключевые события:\nПоложительные:\nХорошее положение в делах, развитие бизнеса, закладывание фундамента собственного дела. Резкие перемены, реорганизация устройства быта, жизни или на уровне работы, общественных связей...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.955788Z",
                    "edited": "2022-02-05T09:51:41.614405Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "11",
                    "gender": "",
                    "type": "expandable",
                    "title": "26-27",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5048,
                    "content": "(7) Особенность периода – это активное движение и новые возможности. Следует откликаться на все шансы и быть максимально мобильным. Это отличный этап для переездов и всего, что связано со сферой смены жилья. Хорошо просто путешествовать или отправляться в деловые командировки. Это даст новые полезные знакомства, вы обрастёте кругом единомышленников и новых друзей. Также возможно движение по карьерной лестнице, творческий и рабочий рост.\nХорошо не упускать все возможности проявить себя. Но еще более полезно будет наметить конкретную цель, выработать план и двигаться по нему.\nБудет возможность для открытия или долгожданного расширения бизнеса. Если есть сомнения, то стоит опереться на помощников и не бояться впускать в процесс как можно больше людей. Это именно то время, когда главными окажутся коллективные усилия. Вам с успехом удастся выполнять самые разные проекты и руководить коллективом.\nВозможны ключевые события:\nПоложительные:\nХорошие новости и предложения, новые идеи и возможности. Плодотворные поездки, движение по карьере, расширение своего дела...Продолжение в платной версии\n\n(14) Хороший период для познания себя, исследования своего глубинного внутреннего Я и тайников души. Нередко проявляется интерес к творчеству, искусству, красоте и тонким вещам. Могут возникнуть ситуации, которые помогут проявиться качествам характера, до этого не проявлявшимся. Особенно это касается смирения, терпеливости, способности принимать события и вещи такими, какие они есть. Часть из них будет просто не остановить и не изменить. Поэтому придётся взять на себя роль мудрого и смиренного наблюдателя, который отдаётся на волю своей судьбы. И это станет лучшим из возможных решений.\nНе проявляйте нетерпеливости: каждому событию своё время. Нельзя также жаловаться, жадничать или роптать на судьбу. Вам всё воздастся в свой определённый срок. Начните доверять хорошему течению жизни и благодарить её даже за мелочи.\nОтличный период для того, чтобы научиться быть в гармонии с собой. Займитесь делами, которые вам по душе или тем, о чём давно мечтали. Не бойтесь связанных с этим перемен. Вам будет дано именно столько, сколько нужно для спокойной, комфортной жизни и занятия хобби, творчеством, саморазвитием и т.д.\nПозаботиться захочется не только о душевном комфорте, но и о телесном. Полезно будет заняться своим питанием, очищением. Не исключено, что интерес появится в области натуральных средств, как травы, масла, минералы, вода. Используйте по максимуму возможности природных даров, но не переусердствуйте. В данный период важна умеренность во всём. Прислушивайтесь к сигналам организма. За что бы ни брались, доводите начатое до конца. Делайте упор на качество, а не количество. Уделяйте внимание и своим эмоциям, сглаживая острые углы и не позволяя накапливаться негативу.\nВозможны ключевые события:\nПоложительные:\nСтабильность в жизни и делах. Незначительный постепенный рост в карьере, бизнесе...Продолжение в платной версии\n\n(21) Идеальное время для путешествий и работы, связанной с переездами, командировками. Хорошо посещать новые места, города и даже другие страны, знакомиться с иностранцами, изучать новые языки, незнакомую культуру, расширяя свой кругозор и снимая собственные рамки, расширяя границы сознания.\nВообще в этот период будет много движения, всё будет способствовать тому, чтобы перемены и активность были максимально лёгкими и удачными.\nМожно реализовать себя, если быть активным. Достигнуть того, о чём давно и много мечталось. Хорошо открывать новые проекты, выходя на иной уровень жизни. Новые контакты и полезные связи помогут в продвижении, достижении успеха. Особенно во всех сферах, связанных со СМИ, социальными сетями, массовыми коммуникациями.\nПривести в гармоничное состояние удастся все области жизни. Вы будете испытывать удовлетворение, целостность жизни и личности. Гармония с миром и собой поможет достигнуть большего, так как не нужно отвлекаться на решение проблем. Более того, человек в такой период будет делиться своей внутренней гармонией и выступать в качестве миротворца. Но если нет внутренней целостности и гармонии, если человек агрессивно настроен к миру, традициям, устройству общества, хочет получить насилием всё и сразу, жизнь наказывает такое.\nВ этот год нужно быть осторожнее с финансами. Не давать в долг и не брать взаймы, иначе расплатиться потом будет очень сложно.\nВозможны ключевые события:\nПоложительные:\nИзучение иностранного языка, путешествия, новая работа или дела, связанные с контактами заграницей. Новые знакомства, отношения с иностранцами...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.49789Z",
                    "edited": "2022-02-05T09:51:40.749846Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "7",
                    "gender": "",
                    "type": "expandable",
                    "title": "27.5-28",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5054,
                    "content": "(10) Время принимать дары судьбы и почувствовать себя настоящим счастливчиком. В жизни могут произойти самые важные и приятные события от выигрыша в лотерею до крупной прибыли, удачи в деле, которое давно планировалось. Реализация мечты, судьбоносная встреча и счастливые отношения. Всё будет способствовать самым приятным переменам. Вы словно попали в свой поток и двигаетесь по течению, получая бонусы и при этом не прикладывая особенных усилий. Находятся средства, открываются все двери, а на жизненном пути попадаются именно нужные люди.\nВажно быть открытым этому потоку и новым возможностям, нести позитивное отношение к жизни, благодарить каждый новый день. Относитесь к событиям легко, ловите знаки судьбы и не бойтесь загадывать желания. Перестаньте всё излишне контролировать и просто получайте удовольствие от того, что происходит вокруг. Доверьтесь переменам и жизни, которые точно \"знают\", как лучше для вас.\nВ этот период особое внимание стоит уделить коммуникациям, общественным связям, друзьям и коллегам. Именно среди них можно встретить свою половинку или получить возможности, информацию для дальнейшего роста.\nЗастой в любых сферах вредит, так же как и излишнее самокопание, сомнения, подозрительность. Ведите максимально активный образ жизни: работайте и творите, путешествуйте и бывайте в людных местах. Не бойтесь проявлять себя.\nВозможны ключевые события:\nПоложительные:\nПоток удачи и денег, резкие перемены к лучшему, шанс от судьбы. Выигрыш в лотерею, повышение по работе или новая очень привлекательная должность...Продолжение в платной версии\n\n(19) В такое время человек может испытывать эмоциональный подъем, хочется наслаждаться простыми радостями, баловать своего внутреннего ребёнка или добрать то, чего не доставало в детстве. Хорошо идут контакты с детьми (в том числе в рабочей сфере). Отличный период, чтобы выстроить отношения с братьями или сёстрами, если они долгое время не были близкими.\nМожно позволить себе расслабиться и плыть по течению жизни, так как в самых разных сферах всё будет складываться само собой. Но это сработает только, когда человек не одержим некой идеей, не зациклен на чём либо (работа, деньги, отношения). Если в голове навязчивая мысль, например, выйти замуж во что бы то ни стало, навязчивый поиск отношений, маниакальная страсть к деньгам/власти, то это может привести к усложнению ситуации. Либо появляются болезни, зажимы на уровне психосоматики, либо серьезные проблемы, так что человек оказывается обездвиженным.\nЧтобы период стал изобильным и максимально благополучным, стоит чаще благодарить жизнь за то, что она даёт. Не проявлять чрезмерного контроля в работе и отношениях, дать больше свободы детям. Энергию нужно распределять плавно на самые разные дела и сферы жизни, уделяя времени понемногу самым разным делам. Тогда они будут идти легко.\nСамое важное в это время - простить себя и проработать чувство вины. Иначе оно будет съедать всю энергию, выжигать изнутри. А в жизни вновь и вновь будут приходить повторяющие ситуации, когда человека унижают, каким-то образом наказывают.\nВозможны ключевые события:\nПоложительные:\nСчастливые события в работе и семейной жизни, ощущение целостности бытия, наслаждение и радость каждый день. Налаживание отношений с братьями/сёстрами, с отцом, семейные праздники...Продолжение в платной версии\n\n(11) Время роста и успеха, но в то же время и больших энергозатрат. Можно преуспеть в карьере и обществе вплоть до сильного влияния на большое количество людей, создания новых направлений. Период позитивный и дарящий много отдачи при разумном использовании своей силы. Именно сейчас важно привести себя в форму, научиться эффективно работать, а не перегружаться. Хорошо нормализовать своей режим дня, регулярно заниматься спортом, чаще бывать на свежем воздухе. Отводите время и на увлечения, выделяя этому свободное время. Так ваша работоспособность будет гораздо выше, нежели если вы будете бросаться от одного проекта к другому, взваливать на себя всё разом, постоянно создавать кипучую деятельность и задерживаться на работе.\nНе пожалейте время на профилактику хронических заболеваний и плановый медосмотр, чтобы не упустить важное. В противном случае сопутствующий такому периоду трудоголизм может довести до полного физического и нервного истощения.\nВозможны ключевые события:\nПоложительные:\nПериод прохождения испытания на выносливость, максимальное напряжение сил с отдачей в спорт, работу, бизнес, какую-либо плодотворную деятельность. Ситуация в ваших руках, и вы получаете повышение, признание...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.841516Z",
                    "edited": "2022-02-05T09:51:41.386335Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "10",
                    "gender": "",
                    "type": "expandable",
                    "title": "28.5-29",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5044,
                    "content": "(5) Время знаменует собой максимальный фокус на семью и дела близких. Благоприятно для вступления в брак, рождения детей. Ваша помощь может потребоваться близким, возможно решение каких-то семейных дел, установление новых традиций в роду. При этом необходимо соблюдать баланс в отношениях и взаимодействии с родными. Не стоит слишком цепляться за родственников (старших, младших), живя их жизнью, ставя себя в положение жертвы или излишне опекая. Подросших детей придётся отпустить в самостоятельную жизнь. Со старшими в роду важно поддерживать здоровые уважительные отношения, оказывая внимание и заботу. Но проживать свою жизнь и действовать по своему разумению, в рамках сформированной системы внутренних ценностей.\nЭтот период характеризуется расстановкой приоритетов. Возможно, захочется навести порядок как буквально (в быту), так и в разных сферах жизни. Действуйте экологично, соблюдая порядок не только в доме, но и в эмоциональном плане, в мыслях. Старайтесь не опаздывать и вообще серьезнее относиться к ресурсам времени (своего и чужого), полезно соблюдать режим дня и систематизировать свою жизнь, разложив всё по полочкам.\nПолезным будет обучение, самосовершенствование как в личном, так и в профессиональном плане. Хорошо пройти курсы, получать новые знания и использовать их на практике. Важно не только копить знания, но и делиться ими.\nОсобенное внимание стоит уделить бумагам, официальным документам. Придётся следить за их правильным оформлением.\nВозможны ключевые события:\nПоложительные:\nДля молодых людей - обучение, получение документов, отделение от родителей и начало самостоятельной жизни. Возможно вступление в брак с подходящим партнёром, который крепко стоит на ногах...Продолжение в платной версии\n\n(3) Период, когда вы смело можете пожинать плоды своей деятельности во всех сферах жизни. Нередко следует продвижение по карьере. При этом может предстоять непростой выбор между интересами семьи и вашей социальной реализацией.\nУ семейных мужчин возможно рождение дочери. Если в этот период появится на свет мальчик, то он будет отличаться мягким складом характера.\nСвободный мужчина вероятнее всего встретит будущую супругу или ту, с которой сложатся серьезные прочные отношения. Такая партнерша сильно повлияет на вашу жизнь в будущем.\nВажно уделять достаточно внимания и заботы женщинам рода, прорабатывая свои мужские качества. Если есть обиды, недопонимания с родственницами, важно найти контакт с ними и наладить отношения.\nВозможны ключевые события:\nПоложительные:\nПродвижение дел, успех в бизнесе, начало новых амбициозных (и особенно творческих) проектов. Бизнес приносит прибыль, успех сопутствует не только в делах, но и в личной жизни...Продолжение в платной версии\n\n(8) Спокойный и относительно стабильный период, который многие склонны воспринимать как время застоя. На самом деле, в нём закладываются все возможные плоды для дальнейшего развития важных сфер жизни: от личной до карьеры и реализации в обществе. Важно осмыслить своё прошлое и настоящее на предмет, чего вы достигли и к чему хотели бы прийти, каковы ваши возможности и насколько вы себя реализуете в работе, творчестве.\nТакже придётся проработать отношения с партнёром. Подумайте, насколько вы счастливы и реализованы в отношениях, доставляют ли они радость; если есть проблемы, то в чём они. Нередко в эти периоды люди прибегают к совету профессиональных психологов, так как в застаревших проблемах или в себе самом сложно разобраться.\nНеобыкновенное время для действия, проявления кармических законов и воздействия судьбы. Не стоит пенят на жизнь, искать справедливость (по вашим понятиям и законам). Зато полезно поступать с другими, как хотели бы, чтобы обращались с вами. Старайтесь проявлять миролюбие, легкое отношение к жизни, при этом работая над своим характером, постигая жизненные законы.\nОбратите внимание на порядок в делах и документах, отдайте все долги, в какой бы форме они ни были (обязательства, налоги, кредиты, помощь в ответ на оказанную вам).\nВозможны ключевые события:\nПоложительные:\nОбучение и сдача экзаменов, получение диплома. Обращение в госструктуры, суды с успешным разрешением дел в вашу пользу...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.265077Z",
                    "edited": "2022-02-05T09:51:40.325805Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "5",
                    "gender": "",
                    "type": "expandable",
                    "title": "30",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5056,
                    "content": "(11) Время роста и успеха, но в то же время и больших энергозатрат. Можно преуспеть в карьере и обществе вплоть до сильного влияния на большое количество людей, создания новых направлений. Период позитивный и дарящий много отдачи при разумном использовании своей силы. Именно сейчас важно привести себя в форму, научиться эффективно работать, а не перегружаться. Хорошо нормализовать своей режим дня, регулярно заниматься спортом, чаще бывать на свежем воздухе. Отводите время и на увлечения, выделяя этому свободное время. Так ваша работоспособность будет гораздо выше, нежели если вы будете бросаться от одного проекта к другому, взваливать на себя всё разом, постоянно создавать кипучую деятельность и задерживаться на работе.\nНе пожалейте время на профилактику хронических заболеваний и плановый медосмотр, чтобы не упустить важное. В противном случае сопутствующий такому периоду трудоголизм может довести до полного физического и нервного истощения.\nВозможны ключевые события:\nПоложительные:\nПериод прохождения испытания на выносливость, максимальное напряжение сил с отдачей в спорт, работу, бизнес, какую-либо плодотворную деятельность. Ситуация в ваших руках, и вы получаете повышение, признание...Продолжение в платной версии\n\n(16) На данном этапе человек теряет самое ценное для него. Обычно это касается достижений материального мира: близкий человек, отношения, деньги, могущество, власть, работа. Чем сильнее человек цепляется за какую-то материальную сферу жизни, тем вероятнее в ней потеря. Это кризис даётся человеку, чтобы он изменил свои взгляды, очнулся от бега по кругу и начал жить иначе. Предстоит непростой период становления, пробуждения духовно из-за неприятных перемен.\nПридётся отказаться ото всего прежнего: образа жизни, привычек, мировоззрения - переосмыслить личные ценности. Помогут различные глубокие учения и знания об устройстве мира от психологии до астрологии. На пути познания себя и мира хорошо делать то, чем раньше не занимались, ввести некие ограничения, осмысленные и доступные аскезы (в еде, удовольствиях, например).\nПолезно также экспериментировать и начинать новое от путешествий до знакомств, хобби. Лучше всего поменять всю среду и выйти из зоны комфорта, как бы неприятно и неожиданно это ни было. Если что-то при этом не удаётся, не стоит переживать. Времени начать новый цикл жизни будет достаточно. Важно проработать свои амбиции и неумеренное эго, которое для будущего будет только во вред.\nВозможны ключевые события:\nПоложительные:\nХорошее положение в делах, развитие бизнеса, закладывание фундамента собственного дела. Резкие перемены, реорганизация устройства быта, жизни или на уровне работы, общественных связей...Продолжение в платной версии\n\n(9) Время для глубокой внутренней проработки своей личности. Хорошо переосмыслить прошлый и настоящий опыт, задать себе правильные вопросы. Нередко люди в такой период усиленно занимаются поиском смысла жизни и себя в мире. Не стоит опираться на других людей и чужие умозаключения - все ответы уже есть внутри вас. Именно к себе, своему внутреннему голосу и стоит обратиться. Полезно больше времени проводить в одиночестве, на природе, заниматься йогой, читать книги по психологии, изучать законы Вселенной и построения взаимоотношений.\nЗанимайтесь творчеством и старайтесь выстроить доверительные, более глубокие отношения со спутником жизни, выходя на новый уровень. Ваша креативность, глубина, внутренний потенциал станут помощниками и в этом.\nПериод, когда многие пересматривают свой жизненный уровень, положение в обществе, доходы. Не исключено, что многое захочется скорректировать. Главное быть во всем умеренным, не делать резких или необдуманных шагов. В погоне за благосостоянием не экономьте на себе и тем более на здоровье. Вам необходим качественный уровень жизни.\nВозможны ключевые события:\nПоложительные:\nОтдых от трудов и уединённое состояние, возможно посещение особых сакральных мест, мест силы или святых мест. Духовный рост, творческое развитие личности обретение себя через обучение или обретение наставника...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.955788Z",
                    "edited": "2022-02-05T09:51:41.614405Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "11",
                    "gender": "",
                    "type": "expandable",
                    "title": "31-32",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5050,
                    "content": "(8) Спокойный и относительно стабильный период, который многие склонны воспринимать как время застоя. На самом деле, в нём закладываются все возможные плоды для дальнейшего развития важных сфер жизни: от личной до карьеры и реализации в обществе. Важно осмыслить своё прошлое и настоящее на предмет, чего вы достигли и к чему хотели бы прийти, каковы ваши возможности и насколько вы себя реализуете в работе, творчестве.\nТакже придётся проработать отношения с партнёром. Подумайте, насколько вы счастливы и реализованы в отношениях, доставляют ли они радость; если есть проблемы, то в чём они. Нередко в эти периоды люди прибегают к совету профессиональных психологов, так как в застаревших проблемах или в себе самом сложно разобраться.\nНеобыкновенное время для действия, проявления кармических законов и воздействия судьбы. Не стоит пенят на жизнь, искать справедливость (по вашим понятиям и законам). Зато полезно поступать с другими, как хотели бы, чтобы обращались с вами. Старайтесь проявлять миролюбие, легкое отношение к жизни, при этом работая над своим характером, постигая жизненные законы.\nОбратите внимание на порядок в делах и документах, отдайте все долги, в какой бы форме они ни были (обязательства, налоги, кредиты, помощь в ответ на оказанную вам).\nВозможны ключевые события:\nПоложительные:\nОбучение и сдача экзаменов, получение диплома. Обращение в госструктуры, суды с успешным разрешением дел в вашу пользу...Продолжение в платной версии\n\n(11) Время роста и успеха, но в то же время и больших энергозатрат. Можно преуспеть в карьере и обществе вплоть до сильного влияния на большое количество людей, создания новых направлений. Период позитивный и дарящий много отдачи при разумном использовании своей силы. Именно сейчас важно привести себя в форму, научиться эффективно работать, а не перегружаться. Хорошо нормализовать своей режим дня, регулярно заниматься спортом, чаще бывать на свежем воздухе. Отводите время и на увлечения, выделяя этому свободное время. Так ваша работоспособность будет гораздо выше, нежели если вы будете бросаться от одного проекта к другому, взваливать на себя всё разом, постоянно создавать кипучую деятельность и задерживаться на работе.\nНе пожалейте время на профилактику хронических заболеваний и плановый медосмотр, чтобы не упустить важное. В противном случае сопутствующий такому периоду трудоголизм может довести до полного физического и нервного истощения.\nВозможны ключевые события:\nПоложительные:\nПериод прохождения испытания на выносливость, максимальное напряжение сил с отдачей в спорт, работу, бизнес, какую-либо плодотворную деятельность. Ситуация в ваших руках, и вы получаете повышение, признание...Продолжение в платной версии\n\n(19) В такое время человек может испытывать эмоциональный подъем, хочется наслаждаться простыми радостями, баловать своего внутреннего ребёнка или добрать то, чего не доставало в детстве. Хорошо идут контакты с детьми (в том числе в рабочей сфере). Отличный период, чтобы выстроить отношения с братьями или сёстрами, если они долгое время не были близкими.\nМожно позволить себе расслабиться и плыть по течению жизни, так как в самых разных сферах всё будет складываться само собой. Но это сработает только, когда человек не одержим некой идеей, не зациклен на чём либо (работа, деньги, отношения). Если в голове навязчивая мысль, например, выйти замуж во что бы то ни стало, навязчивый поиск отношений, маниакальная страсть к деньгам/власти, то это может привести к усложнению ситуации. Либо появляются болезни, зажимы на уровне психосоматики, либо серьезные проблемы, так что человек оказывается обездвиженным.\nЧтобы период стал изобильным и максимально благополучным, стоит чаще благодарить жизнь за то, что она даёт. Не проявлять чрезмерного контроля в работе и отношениях, дать больше свободы детям. Энергию нужно распределять плавно на самые разные дела и сферы жизни, уделяя времени понемногу самым разным делам. Тогда они будут идти легко.\nСамое важное в это время - простить себя и проработать чувство вины. Иначе оно будет съедать всю энергию, выжигать изнутри. А в жизни вновь и вновь будут приходить повторяющие ситуации, когда человека унижают, каким-то образом наказывают.\nВозможны ключевые события:\nПоложительные:\nСчастливые события в работе и семейной жизни, ощущение целостности бытия, наслаждение и радость каждый день. Налаживание отношений с братьями/сёстрами, с отцом, семейные праздники...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.61333Z",
                    "edited": "2022-02-05T09:51:40.964001Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "8",
                    "gender": "",
                    "type": "expandable",
                    "title": "32.5-33",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5060,
                    "content": "(13) Период кардинальных перемен и резких поворотов в судьбе. Грядут события, после которых жизнь уже не станет прежней. Они могут быть как положительными, так и горькими (вплоть до смерти кого-то из близкого окружения). Важно принять их, какими бы они ни были. Придётся следовать за событиями и процессами, которые становятся совсем неожиданными, но необходимыми.\nВаша роль - принятие, готовность к переменам, непротивление, мудрость. Необходимо самостоятельно начать отпускать всё старое, ненужное и изжившее себя в это время от работы, отношений, которые уже не устраивают, до вещей (например, заняться расхламлением). Придётся буквально подстраиваться под быстро меняющуюся обстановку и следовать за происходящим, не обдумывая долго и не погружаясь глубоко в события. Будет полезно научиться принимать решения быстро и при этом стратегически верно.\nТакой период нередко несёт изменения в самых разных сферах сразу: кризисные ситуации на работе, в отношениях, проблемы со здоровьем. Поэтому не стоит напрасно пускаться в авантюры, совершать рискованные поступки, излишне разбрасываясь временем и энергией. Хорошо начать здоровый образ жизни, отказаться от плохих привычек, следить за рационом.\nВажно не пытаться удерживать то, что уже стало лишним в вашей жизни, что не несет ничего нового, живительного, никакого движения. Это поможет впустить в жизнь свежую энергию и заложить основу для успешного будущего.\nВозможны ключевые события:\nПоложительные:\nПеремены в жизни, как правило, довольно кардинальные. В плане здоровья -хорошо прошедшая операция, избавление от серьезной болезни...Продолжение в платной версии\n\n(17) Отличное время для ярких и творческих особ со множеством увлечений и талантов. Даже если вы не любите бывать на публике, этот период станет возможностью сказать миру слово о себе, получить славу, признание популярность.\nВажно быть готовым к грядущим переменам. Хорошо сменить имидж, поработать с внешностью и самооценкой. Развивайте в себе таланты, харизму, природные данные. Чаще полезно бывать в общественных местах от шумных вечеринок до выставок. Вдохновение вы можете получить где угодно. Не исключено, что ваше хобби в данный период станет профессией и приятным способом получить не только известность, но и статус, комфорт, материальные блага. Используйте свои навыки, творчество, знания для этого.\nВажно развивать уверенность в себе, раскрыть свой внутренний мир людям. Публичные выступления, мероприятия, где вы будете в центре внимания - позволят добиться желаемого результата.\nВозможны ключевые события:\nПоложительные:\nЗанятие любимым делом, путешествия, творческий и духовный подъем, возможность зарабатывать, занимаясь искусством. Счастливые знаки судьбы и неожиданная важная помощь извне...Продолжение в платной версии\n\n(3) Период, когда вы смело можете пожинать плоды своей деятельности во всех сферах жизни. Нередко следует продвижение по карьере. При этом может предстоять непростой выбор между интересами семьи и вашей социальной реализацией.\nУ семейных мужчин возможно рождение дочери. Если в этот период появится на свет мальчик, то он будет отличаться мягким складом характера.\nСвободный мужчина вероятнее всего встретит будущую супругу или ту, с которой сложатся серьезные прочные отношения. Такая партнерша сильно повлияет на вашу жизнь в будущем.\nВажно уделять достаточно внимания и заботы женщинам рода, прорабатывая свои мужские качества. Если есть обиды, недопонимания с родственницами, важно найти контакт с ними и наладить отношения.\nВозможны ключевые события:\nПоложительные:\nПродвижение дел, успех в бизнесе, начало новых амбициозных (и особенно творческих) проектов. Бизнес приносит прибыль, успех сопутствует не только в делах, но и в личной жизни...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:36.18288Z",
                    "edited": "2022-02-05T09:51:42.044623Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "13",
                    "gender": "",
                    "type": "expandable",
                    "title": "33.5-34",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5044,
                    "content": "(5) Время знаменует собой максимальный фокус на семью и дела близких. Благоприятно для вступления в брак, рождения детей. Ваша помощь может потребоваться близким, возможно решение каких-то семейных дел, установление новых традиций в роду. При этом необходимо соблюдать баланс в отношениях и взаимодействии с родными. Не стоит слишком цепляться за родственников (старших, младших), живя их жизнью, ставя себя в положение жертвы или излишне опекая. Подросших детей придётся отпустить в самостоятельную жизнь. Со старшими в роду важно поддерживать здоровые уважительные отношения, оказывая внимание и заботу. Но проживать свою жизнь и действовать по своему разумению, в рамках сформированной системы внутренних ценностей.\nЭтот период характеризуется расстановкой приоритетов. Возможно, захочется навести порядок как буквально (в быту), так и в разных сферах жизни. Действуйте экологично, соблюдая порядок не только в доме, но и в эмоциональном плане, в мыслях. Старайтесь не опаздывать и вообще серьезнее относиться к ресурсам времени (своего и чужого), полезно соблюдать режим дня и систематизировать свою жизнь, разложив всё по полочкам.\nПолезным будет обучение, самосовершенствование как в личном, так и в профессиональном плане. Хорошо пройти курсы, получать новые знания и использовать их на практике. Важно не только копить знания, но и делиться ими.\nОсобенное внимание стоит уделить бумагам, официальным документам. Придётся следить за их правильным оформлением.\nВозможны ключевые события:\nПоложительные:\nДля молодых людей - обучение, получение документов, отделение от родителей и начало самостоятельной жизни. Возможно вступление в брак с подходящим партнёром, который крепко стоит на ногах...Продолжение в платной версии\n\n(6) Период максимально направлен на отношения с окружающими, внешнюю красоту и внутреннюю гармонию. Важно поддерживать все сферы в балансе и идти за своими ощущениями, не действуя по указке или желаниям, интересам других.\nОбустраивайте пространство вокруг себя и уделяйте себе особое внимания, балуя и украшая. В такое время особенно чувствуется потребность в тактильности, в любви.\nХочется самому проявлять нежность, ласку и получать в ответ от других. Важно внимание, уход, забота. Человек в такой период склонен влюбляться, стремится найти свою половинку. А если она уже есть, то максимально фокусируется на близости с партнером, на качестве отношений. Если не хватает внимания и ласки от близкого человека, на этом фоне могут возникать обиды и недопонимание. Не стоит уходить в себя и замалчивать проблемы. Проявляйтесь сами и открыто говорите о том, чего хотите. Есть возможность планирования появления детей в семье.\nАктивно раскрываются коммуникативные способности, есть потребность быть в хороших отношениях с окружающими, нравиться всем. Остро хочется наконец-то выделить время для хобби, особенно творческих (от цветоводства до дизайна).\nПри непонимании с окружающими, а особенно близкими, старайтесь сгладить острые конфликты и идти на примирение первыми. Это скажется положительно, прежде всего, на вас.\nВозможны ключевые события:\nПоложительные:\nМного новых знакомств, общения и приятных контактов. Флирт и влюбленность, благополучные новые отношения, помолвка, свадьба...Продолжение в платной версии\n\n(11) Время роста и успеха, но в то же время и больших энергозатрат. Можно преуспеть в карьере и обществе вплоть до сильного влияния на большое количество людей, создания новых направлений. Период позитивный и дарящий много отдачи при разумном использовании своей силы. Именно сейчас важно привести себя в форму, научиться эффективно работать, а не перегружаться. Хорошо нормализовать своей режим дня, регулярно заниматься спортом, чаще бывать на свежем воздухе. Отводите время и на увлечения, выделяя этому свободное время. Так ваша работоспособность будет гораздо выше, нежели если вы будете бросаться от одного проекта к другому, взваливать на себя всё разом, постоянно создавать кипучую деятельность и задерживаться на работе.\nНе пожалейте время на профилактику хронических заболеваний и плановый медосмотр, чтобы не упустить важное. В противном случае сопутствующий такому периоду трудоголизм может довести до полного физического и нервного истощения.\nВозможны ключевые события:\nПоложительные:\nПериод прохождения испытания на выносливость, максимальное напряжение сил с отдачей в спорт, работу, бизнес, какую-либо плодотворную деятельность. Ситуация в ваших руках, и вы получаете повышение, признание...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.265077Z",
                    "edited": "2022-02-05T09:51:40.325805Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "5",
                    "gender": "",
                    "type": "expandable",
                    "title": "35",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5058,
                    "content": "(12) Сложный судьбоносный период, испытания которого могут стать ключевыми, поворотными моментами для будущей жизни. Дела в бизнесе, какие-то вопросы, отношения в личной жизни, пройдя черед испытаний, могут выйти на новый (более сложный и совершенный) уровень. Либо наоборот - внезапно пойти на спад (крах, развод, потери). Всё зависит от вас только наполовину. Примерно наполовину - от вашего окружения, умения слушать и поступать правильно, ловить знаки судьбы, быть мудрым и глубоким. Впереди потери и обретения. Придется расстаться с кем-то или чем-то важным в жизни.\nВ такое время хорошо прислушиваться к себе и присматриваться к тому, что происходит вокруг. Иногда просто не будет возможности вмешаться в дела или изменить что-либо в происходящих ситуациях. Выигрышной станет позиция чуткого наблюдателя. Хорошо, если в окружении такое же состояние вы сможете внушить и передать другим. Это состояние и грядущие перемены нужны для чего-то важного.\nНе отказывайтесь от участия в благотворительности, помощи другим. Но при этом соблюдайте баланс своей способности дарить (отдавать) другим и получать взамен. Ваши интересы в этот период должны быть всё же на первом месте. Давайте кому-то от внутренней наполненности, от искреннего желания, а не ожидая награды, чего-то взамен или стараясь заслужить любовь.\nНе стоит забывать заботиться о своём физическом теле, соблюдая правильное питание, режим и поддерживая баланс во всём. Полезно обучаться новому, познавать другие точки зрения, постигать мудрость и знания о законах мироздания.\nВозможны ключевые события:\nПоложительные:\nОтносительно спокойное время с небольшими положительными движениями. Например, выход из кризисной ситуации, разрешение дел, небольшой рост бизнеса, привлекательные перспективы в самых разных жизненных сферах...Продолжение в платной версии\n\n(13) Период кардинальных перемен и резких поворотов в судьбе. Грядут события, после которых жизнь уже не станет прежней. Они могут быть как положительными, так и горькими (вплоть до смерти кого-то из близкого окружения). Важно принять их, какими бы они ни были. Придётся следовать за событиями и процессами, которые становятся совсем неожиданными, но необходимыми.\nВаша роль - принятие, готовность к переменам, непротивление, мудрость. Необходимо самостоятельно начать отпускать всё старое, ненужное и изжившее себя в это время от работы, отношений, которые уже не устраивают, до вещей (например, заняться расхламлением). Придётся буквально подстраиваться под быстро меняющуюся обстановку и следовать за происходящим, не обдумывая долго и не погружаясь глубоко в события. Будет полезно научиться принимать решения быстро и при этом стратегически верно.\nТакой период нередко несёт изменения в самых разных сферах сразу: кризисные ситуации на работе, в отношениях, проблемы со здоровьем. Поэтому не стоит напрасно пускаться в авантюры, совершать рискованные поступки, излишне разбрасываясь временем и энергией. Хорошо начать здоровый образ жизни, отказаться от плохих привычек, следить за рационом.\nВажно не пытаться удерживать то, что уже стало лишним в вашей жизни, что не несет ничего нового, живительного, никакого движения. Это поможет впустить в жизнь свежую энергию и заложить основу для успешного будущего.\nВозможны ключевые события:\nПоложительные:\nПеремены в жизни, как правило, довольно кардинальные. В плане здоровья -хорошо прошедшая операция, избавление от серьезной болезни...Продолжение в платной версии\n\n(7) Особенность периода – это активное движение и новые возможности. Следует откликаться на все шансы и быть максимально мобильным. Это отличный этап для переездов и всего, что связано со сферой смены жилья. Хорошо просто путешествовать или отправляться в деловые командировки. Это даст новые полезные знакомства, вы обрастёте кругом единомышленников и новых друзей. Также возможно движение по карьерной лестнице, творческий и рабочий рост.\nХорошо не упускать все возможности проявить себя. Но еще более полезно будет наметить конкретную цель, выработать план и двигаться по нему.\nБудет возможность для открытия или долгожданного расширения бизнеса. Если есть сомнения, то стоит опереться на помощников и не бояться впускать в процесс как можно больше людей. Это именно то время, когда главными окажутся коллективные усилия. Вам с успехом удастся выполнять самые разные проекты и руководить коллективом.\nВозможны ключевые события:\nПоложительные:\nХорошие новости и предложения, новые идеи и возможности. Плодотворные поездки, движение по карьере, расширение своего дела...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:36.069514Z",
                    "edited": "2022-02-05T09:51:41.831626Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "12",
                    "gender": "",
                    "type": "expandable",
                    "title": "36-37",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5048,
                    "content": "(7) Особенность периода – это активное движение и новые возможности. Следует откликаться на все шансы и быть максимально мобильным. Это отличный этап для переездов и всего, что связано со сферой смены жилья. Хорошо просто путешествовать или отправляться в деловые командировки. Это даст новые полезные знакомства, вы обрастёте кругом единомышленников и новых друзей. Также возможно движение по карьерной лестнице, творческий и рабочий рост.\nХорошо не упускать все возможности проявить себя. Но еще более полезно будет наметить конкретную цель, выработать план и двигаться по нему.\nБудет возможность для открытия или долгожданного расширения бизнеса. Если есть сомнения, то стоит опереться на помощников и не бояться впускать в процесс как можно больше людей. Это именно то время, когда главными окажутся коллективные усилия. Вам с успехом удастся выполнять самые разные проекты и руководить коллективом.\nВозможны ключевые события:\nПоложительные:\nХорошие новости и предложения, новые идеи и возможности. Плодотворные поездки, движение по карьере, расширение своего дела...Продолжение в платной версии\n\n(14) Хороший период для познания себя, исследования своего глубинного внутреннего Я и тайников души. Нередко проявляется интерес к творчеству, искусству, красоте и тонким вещам. Могут возникнуть ситуации, которые помогут проявиться качествам характера, до этого не проявлявшимся. Особенно это касается смирения, терпеливости, способности принимать события и вещи такими, какие они есть. Часть из них будет просто не остановить и не изменить. Поэтому придётся взять на себя роль мудрого и смиренного наблюдателя, который отдаётся на волю своей судьбы. И это станет лучшим из возможных решений.\nНе проявляйте нетерпеливости: каждому событию своё время. Нельзя также жаловаться, жадничать или роптать на судьбу. Вам всё воздастся в свой определённый срок. Начните доверять хорошему течению жизни и благодарить её даже за мелочи.\nОтличный период для того, чтобы научиться быть в гармонии с собой. Займитесь делами, которые вам по душе или тем, о чём давно мечтали. Не бойтесь связанных с этим перемен. Вам будет дано именно столько, сколько нужно для спокойной, комфортной жизни и занятия хобби, творчеством, саморазвитием и т.д.\nПозаботиться захочется не только о душевном комфорте, но и о телесном. Полезно будет заняться своим питанием, очищением. Не исключено, что интерес появится в области натуральных средств, как травы, масла, минералы, вода. Используйте по максимуму возможности природных даров, но не переусердствуйте. В данный период важна умеренность во всём. Прислушивайтесь к сигналам организма. За что бы ни брались, доводите начатое до конца. Делайте упор на качество, а не количество. Уделяйте внимание и своим эмоциям, сглаживая острые углы и не позволяя накапливаться негативу.\nВозможны ключевые события:\nПоложительные:\nСтабильность в жизни и делах. Незначительный постепенный рост в карьере, бизнесе...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.49789Z",
                    "edited": "2022-02-05T09:51:40.749846Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "7",
                    "gender": "",
                    "type": "expandable",
                    "title": "37.5-38",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5052,
                    "content": "(9) Время для глубокой внутренней проработки своей личности. Хорошо переосмыслить прошлый и настоящий опыт, задать себе правильные вопросы. Нередко люди в такой период усиленно занимаются поиском смысла жизни и себя в мире. Не стоит опираться на других людей и чужие умозаключения - все ответы уже есть внутри вас. Именно к себе, своему внутреннему голосу и стоит обратиться. Полезно больше времени проводить в одиночестве, на природе, заниматься йогой, читать книги по психологии, изучать законы Вселенной и построения взаимоотношений.\nЗанимайтесь творчеством и старайтесь выстроить доверительные, более глубокие отношения со спутником жизни, выходя на новый уровень. Ваша креативность, глубина, внутренний потенциал станут помощниками и в этом.\nПериод, когда многие пересматривают свой жизненный уровень, положение в обществе, доходы. Не исключено, что многое захочется скорректировать. Главное быть во всем умеренным, не делать резких или необдуманных шагов. В погоне за благосостоянием не экономьте на себе и тем более на здоровье. Вам необходим качественный уровень жизни.\nВозможны ключевые события:\nПоложительные:\nОтдых от трудов и уединённое состояние, возможно посещение особых сакральных мест, мест силы или святых мест. Духовный рост, творческое развитие личности обретение себя через обучение или обретение наставника...Продолжение в платной версии\n\n(8) Спокойный и относительно стабильный период, который многие склонны воспринимать как время застоя. На самом деле, в нём закладываются все возможные плоды для дальнейшего развития важных сфер жизни: от личной до карьеры и реализации в обществе. Важно осмыслить своё прошлое и настоящее на предмет, чего вы достигли и к чему хотели бы прийти, каковы ваши возможности и насколько вы себя реализуете в работе, творчестве.\nТакже придётся проработать отношения с партнёром. Подумайте, насколько вы счастливы и реализованы в отношениях, доставляют ли они радость; если есть проблемы, то в чём они. Нередко в эти периоды люди прибегают к совету профессиональных психологов, так как в застаревших проблемах или в себе самом сложно разобраться.\nНеобыкновенное время для действия, проявления кармических законов и воздействия судьбы. Не стоит пенят на жизнь, искать справедливость (по вашим понятиям и законам). Зато полезно поступать с другими, как хотели бы, чтобы обращались с вами. Старайтесь проявлять миролюбие, легкое отношение к жизни, при этом работая над своим характером, постигая жизненные законы.\nОбратите внимание на порядок в делах и документах, отдайте все долги, в какой бы форме они ни были (обязательства, налоги, кредиты, помощь в ответ на оказанную вам).\nВозможны ключевые события:\nПоложительные:\nОбучение и сдача экзаменов, получение диплома. Обращение в госструктуры, суды с успешным разрешением дел в вашу пользу...Продолжение в платной версии\n\n(17) Отличное время для ярких и творческих особ со множеством увлечений и талантов. Даже если вы не любите бывать на публике, этот период станет возможностью сказать миру слово о себе, получить славу, признание популярность.\nВажно быть готовым к грядущим переменам. Хорошо сменить имидж, поработать с внешностью и самооценкой. Развивайте в себе таланты, харизму, природные данные. Чаще полезно бывать в общественных местах от шумных вечеринок до выставок. Вдохновение вы можете получить где угодно. Не исключено, что ваше хобби в данный период станет профессией и приятным способом получить не только известность, но и статус, комфорт, материальные блага. Используйте свои навыки, творчество, знания для этого.\nВажно развивать уверенность в себе, раскрыть свой внутренний мир людям. Публичные выступления, мероприятия, где вы будете в центре внимания - позволят добиться желаемого результата.\nВозможны ключевые события:\nПоложительные:\nЗанятие любимым делом, путешествия, творческий и духовный подъем, возможность зарабатывать, занимаясь искусством. Счастливые знаки судьбы и неожиданная важная помощь извне...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.727198Z",
                    "edited": "2022-02-05T09:51:41.175801Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "9",
                    "gender": "",
                    "type": "expandable",
                    "title": "38.5-39",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5032,
                    "content": "(1) Период для самореализации через обучение, новые знания, самосовершенствование и свежие контакты, идеи, в том числе творческие. Можно выразить себя самыми разными способами, используя активную жизненную позицию. Инициатива, повышение своего уровня и передача знаний, расширение круга знакомых - станут ключами к успеху.\nВ это время хорошо получать основное/дополнительное образование, проходить курсы и тренинги. Деятельность мозга становится более приспособленной для восприятия информации, вы буквально готовы впитывать всё как губка.\nТакже хорошо проявлять коммуникативные навыки, больше появляться в обществе, заводить полезные знакомства и находить контакт с окружающими. Это будет полезно в будущем.\nХорошо раскрепоститься и позволить себе заниматься любимым делом. Важно верить в себя и раскрыть свой потенциал. Для самореализации в общественной жизни необходимо проработать свою самооценку и уверенность в себе.\nВозможны ключевые события:\nПоложительные:\nХорошее и стабильное финансовое положение. Полезные связи и знакомства...Продолжение в платной версии\n\n(2) Интересный период загадок и тайн. Прислушайтесь к своей интуиции, внутреннему голосу. Судьба сама приведет вас к нужным людям в своё время. Даже если вы всю жизнь считали себя творцом судьбы и активным в своих позициях, в это время стоит довериться жизненному потоку, прислушаться к происходящему и включить своё шестое чувство.\nЧрезмерная рассудительность и логика в такое время может стать вашим врагом. Гораздо полезнее занять пассивную позицию и использовать свои внутренние ресурсы, обращать внимание на знаки судьбы и \"простые совпадения\". Помочь раскрыть своё внутренне Я может увлечение психологией, астрологией, нумерологией и другими науками.\nОсобенно важно в этот период наладить отношения с матерью и другими женщинами рода, также со своими половинками (и даже бывшими, чтобы отпустили и не держали обиды).\nДля гармонизации своего состояния стоит быть более гибким, проявлять заботу о других, сохранять спокойствие в любых обстоятельствах. Полезными для жизненного и физического баланса станут также забота о теле: здоровый образ жизни, полезные привычки. Чаще стоит бывать на природе, использовать натуральные продукты.\nВозможны ключевые события:\nПоложительные:\nГармоничная и спокойная в целом жизнь в достатке и успехе. Интерес к тайным знаниям, обучение, сбор важной информации, также её использование или передача...Продолжение в платной версии\n\n(3) Период, когда вы смело можете пожинать плоды своей деятельности во всех сферах жизни. Нередко следует продвижение по карьере. При этом может предстоять непростой выбор между интересами семьи и вашей социальной реализацией.\nУ семейных мужчин возможно рождение дочери. Если в этот период появится на свет мальчик, то он будет отличаться мягким складом характера.\nСвободный мужчина вероятнее всего встретит будущую супругу или ту, с которой сложатся серьезные прочные отношения. Такая партнерша сильно повлияет на вашу жизнь в будущем.\nВажно уделять достаточно внимания и заботы женщинам рода, прорабатывая свои мужские качества. Если есть обиды, недопонимания с родственницами, важно найти контакт с ними и наладить отношения.\nВозможны ключевые события:\nПоложительные:\nПродвижение дел, успех в бизнесе, начало новых амбициозных (и особенно творческих) проектов. Бизнес приносит прибыль, успех сопутствует не только в делах, но и в личной жизни...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:34.176635Z",
                    "edited": "2022-02-05T09:51:39.054331Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "1",
                    "gender": "",
                    "type": "expandable",
                    "title": "40",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5058,
                    "content": "(12) Сложный судьбоносный период, испытания которого могут стать ключевыми, поворотными моментами для будущей жизни. Дела в бизнесе, какие-то вопросы, отношения в личной жизни, пройдя черед испытаний, могут выйти на новый (более сложный и совершенный) уровень. Либо наоборот - внезапно пойти на спад (крах, развод, потери). Всё зависит от вас только наполовину. Примерно наполовину - от вашего окружения, умения слушать и поступать правильно, ловить знаки судьбы, быть мудрым и глубоким. Впереди потери и обретения. Придется расстаться с кем-то или чем-то важным в жизни.\nВ такое время хорошо прислушиваться к себе и присматриваться к тому, что происходит вокруг. Иногда просто не будет возможности вмешаться в дела или изменить что-либо в происходящих ситуациях. Выигрышной станет позиция чуткого наблюдателя. Хорошо, если в окружении такое же состояние вы сможете внушить и передать другим. Это состояние и грядущие перемены нужны для чего-то важного.\nНе отказывайтесь от участия в благотворительности, помощи другим. Но при этом соблюдайте баланс своей способности дарить (отдавать) другим и получать взамен. Ваши интересы в этот период должны быть всё же на первом месте. Давайте кому-то от внутренней наполненности, от искреннего желания, а не ожидая награды, чего-то взамен или стараясь заслужить любовь.\nНе стоит забывать заботиться о своём физическом теле, соблюдая правильное питание, режим и поддерживая баланс во всём. Полезно обучаться новому, познавать другие точки зрения, постигать мудрость и знания о законах мироздания.\nВозможны ключевые события:\nПоложительные:\nОтносительно спокойное время с небольшими положительными движениями. Например, выход из кризисной ситуации, разрешение дел, небольшой рост бизнеса, привлекательные перспективы в самых разных жизненных сферах...Продолжение в платной версии\n\n(5) Время знаменует собой максимальный фокус на семью и дела близких. Благоприятно для вступления в брак, рождения детей. Ваша помощь может потребоваться близким, возможно решение каких-то семейных дел, установление новых традиций в роду. При этом необходимо соблюдать баланс в отношениях и взаимодействии с родными. Не стоит слишком цепляться за родственников (старших, младших), живя их жизнью, ставя себя в положение жертвы или излишне опекая. Подросших детей придётся отпустить в самостоятельную жизнь. Со старшими в роду важно поддерживать здоровые уважительные отношения, оказывая внимание и заботу. Но проживать свою жизнь и действовать по своему разумению, в рамках сформированной системы внутренних ценностей.\nЭтот период характеризуется расстановкой приоритетов. Возможно, захочется навести порядок как буквально (в быту), так и в разных сферах жизни. Действуйте экологично, соблюдая порядок не только в доме, но и в эмоциональном плане, в мыслях. Старайтесь не опаздывать и вообще серьезнее относиться к ресурсам времени (своего и чужого), полезно соблюдать режим дня и систематизировать свою жизнь, разложив всё по полочкам.\nПолезным будет обучение, самосовершенствование как в личном, так и в профессиональном плане. Хорошо пройти курсы, получать новые знания и использовать их на практике. Важно не только копить знания, но и делиться ими.\nОсобенное внимание стоит уделить бумагам, официальным документам. Придётся следить за их правильным оформлением.\nВозможны ключевые события:\nПоложительные:\nДля молодых людей - обучение, получение документов, отделение от родителей и начало самостоятельной жизни. Возможно вступление в брак с подходящим партнёром, который крепко стоит на ногах...Продолжение в платной версии\n\n(17) Отличное время для ярких и творческих особ со множеством увлечений и талантов. Даже если вы не любите бывать на публике, этот период станет возможностью сказать миру слово о себе, получить славу, признание популярность.\nВажно быть готовым к грядущим переменам. Хорошо сменить имидж, поработать с внешностью и самооценкой. Развивайте в себе таланты, харизму, природные данные. Чаще полезно бывать в общественных местах от шумных вечеринок до выставок. Вдохновение вы можете получить где угодно. Не исключено, что ваше хобби в данный период станет профессией и приятным способом получить не только известность, но и статус, комфорт, материальные блага. Используйте свои навыки, творчество, знания для этого.\nВажно развивать уверенность в себе, раскрыть свой внутренний мир людям. Публичные выступления, мероприятия, где вы будете в центре внимания - позволят добиться желаемого результата.\nВозможны ключевые события:\nПоложительные:\nЗанятие любимым делом, путешествия, творческий и духовный подъем, возможность зарабатывать, занимаясь искусством. Счастливые знаки судьбы и неожиданная важная помощь извне...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:36.069514Z",
                    "edited": "2022-02-05T09:51:41.831626Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "12",
                    "gender": "",
                    "type": "expandable",
                    "title": "41-42",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5054,
                    "content": "(10) Время принимать дары судьбы и почувствовать себя настоящим счастливчиком. В жизни могут произойти самые важные и приятные события от выигрыша в лотерею до крупной прибыли, удачи в деле, которое давно планировалось. Реализация мечты, судьбоносная встреча и счастливые отношения. Всё будет способствовать самым приятным переменам. Вы словно попали в свой поток и двигаетесь по течению, получая бонусы и при этом не прикладывая особенных усилий. Находятся средства, открываются все двери, а на жизненном пути попадаются именно нужные люди.\nВажно быть открытым этому потоку и новым возможностям, нести позитивное отношение к жизни, благодарить каждый новый день. Относитесь к событиям легко, ловите знаки судьбы и не бойтесь загадывать желания. Перестаньте всё излишне контролировать и просто получайте удовольствие от того, что происходит вокруг. Доверьтесь переменам и жизни, которые точно \"знают\", как лучше для вас.\nВ этот период особое внимание стоит уделить коммуникациям, общественным связям, друзьям и коллегам. Именно среди них можно встретить свою половинку или получить возможности, информацию для дальнейшего роста.\nЗастой в любых сферах вредит, так же как и излишнее самокопание, сомнения, подозрительность. Ведите максимально активный образ жизни: работайте и творите, путешествуйте и бывайте в людных местах. Не бойтесь проявлять себя.\nВозможны ключевые события:\nПоложительные:\nПоток удачи и денег, резкие перемены к лучшему, шанс от судьбы. Выигрыш в лотерею, повышение по работе или новая очень привлекательная должность...Продолжение в платной версии\n\n(4) Мужчина в этот период должен максимально проявить свои мужские лидерские качества. Нужно развивать дисциплину, логичность, активность, реализовывать амбиции, мыслить стратегически, брать ответственность на себя и принимать решения. Основные события будут развиваться вокруг карьеры и социальной реализации. Обычно наблюдается повышение по службе или открытие собственного бизнеса, его развитие. Возможно участие в крупных проектах. Нередко этот период становится временем строительства, приобретения какой-либо недвижимости. В семье может появиться наследник мужского пола. Если родится девочка, то у неё будет мужской сильный характер.\nМужчине важно не конфликтовать с другими представителями своего пола. А особенно наладить отношения с отцом. Полезно поговорить по душам, простить друг другу прежние обиды и недопонимание. Даже если отец неправ, не стоит показывать свою значимость или самоутверждаться за его счёт. Гораздо полезнее будет потратить эту энергию для достижения успеха в работе.\nВозможны ключевые события:\nПоложительные:\nПризнание в обществе через получение высокой должности или какие-то другие достижения. Открытие своего дела или успешный рост существующего...Продолжение в платной версии\n\n(14) Хороший период для познания себя, исследования своего глубинного внутреннего Я и тайников души. Нередко проявляется интерес к творчеству, искусству, красоте и тонким вещам. Могут возникнуть ситуации, которые помогут проявиться качествам характера, до этого не проявлявшимся. Особенно это касается смирения, терпеливости, способности принимать события и вещи такими, какие они есть. Часть из них будет просто не остановить и не изменить. Поэтому придётся взять на себя роль мудрого и смиренного наблюдателя, который отдаётся на волю своей судьбы. И это станет лучшим из возможных решений.\nНе проявляйте нетерпеливости: каждому событию своё время. Нельзя также жаловаться, жадничать или роптать на судьбу. Вам всё воздастся в свой определённый срок. Начните доверять хорошему течению жизни и благодарить её даже за мелочи.\nОтличный период для того, чтобы научиться быть в гармонии с собой. Займитесь делами, которые вам по душе или тем, о чём давно мечтали. Не бойтесь связанных с этим перемен. Вам будет дано именно столько, сколько нужно для спокойной, комфортной жизни и занятия хобби, творчеством, саморазвитием и т.д.\nПозаботиться захочется не только о душевном комфорте, но и о телесном. Полезно будет заняться своим питанием, очищением. Не исключено, что интерес появится в области натуральных средств, как травы, масла, минералы, вода. Используйте по максимуму возможности природных даров, но не переусердствуйте. В данный период важна умеренность во всём. Прислушивайтесь к сигналам организма. За что бы ни брались, доводите начатое до конца. Делайте упор на качество, а не количество. Уделяйте внимание и своим эмоциям, сглаживая острые углы и не позволяя накапливаться негативу.\nВозможны ключевые события:\nПоложительные:\nСтабильность в жизни и делах. Незначительный постепенный рост в карьере, бизнесе...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.841516Z",
                    "edited": "2022-02-05T09:51:41.386335Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "10",
                    "gender": "",
                    "type": "expandable",
                    "title": "42.5-43",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5070,
                    "content": "(18) Период максимальной концентрации на личной жизни, саморазвитии, обустройстве дома. В это время усиливается эмоциональность, человек становится очень чувствительным. Важны люди, которые рядом, хорошие и гармоничные отношения. Полезно наводить порядок в доме и заниматься его благоустройством. Не менее важно уделить внимание своей подсознательной стороне личности. Развитие, возможность быть собой, способность прислушиваться к себе и действовать по своим желаниям - ключевые моменты при этом.\nНа данном этапе особую важность обретают взаимоотношения с матерью и женщинами рода. Важно наладить контакт и поддерживать хорошее общение. Ваша чуткость и эмпатия в этот период помогут буквально чувствовать непростой женский характер.\nОбразы, мысли становятся наиболее яркими и имеют силу воплощаться в реальность. Жить в такой период нужно максимально осознанно, выбирая то, о чём думаете. Легко можно реализовать планы и мечты благодаря способности позитивно мыслить. Но также могут сбыться негативные посылы и страхи.\nВозможны ключевые события:\nПоложительные:\nНовые приятные отношения, долгожданная беременность. В доме уют и покой, комфорт...Продолжение в платной версии\n\n(7) Особенность периода – это активное движение и новые возможности. Следует откликаться на все шансы и быть максимально мобильным. Это отличный этап для переездов и всего, что связано со сферой смены жилья. Хорошо просто путешествовать или отправляться в деловые командировки. Это даст новые полезные знакомства, вы обрастёте кругом единомышленников и новых друзей. Также возможно движение по карьерной лестнице, творческий и рабочий рост.\nХорошо не упускать все возможности проявить себя. Но еще более полезно будет наметить конкретную цель, выработать план и двигаться по нему.\nБудет возможность для открытия или долгожданного расширения бизнеса. Если есть сомнения, то стоит опереться на помощников и не бояться впускать в процесс как можно больше людей. Это именно то время, когда главными окажутся коллективные усилия. Вам с успехом удастся выполнять самые разные проекты и руководить коллективом.\nВозможны ключевые события:\nПоложительные:\nХорошие новости и предложения, новые идеи и возможности. Плодотворные поездки, движение по карьере, расширение своего дела...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:36.753497Z",
                    "edited": "2022-02-05T09:51:43.10518Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "18",
                    "gender": "",
                    "type": "expandable",
                    "title": "43.5-44",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5050,
                    "content": "(8) Спокойный и относительно стабильный период, который многие склонны воспринимать как время застоя. На самом деле, в нём закладываются все возможные плоды для дальнейшего развития важных сфер жизни: от личной до карьеры и реализации в обществе. Важно осмыслить своё прошлое и настоящее на предмет, чего вы достигли и к чему хотели бы прийти, каковы ваши возможности и насколько вы себя реализуете в работе, творчестве.\nТакже придётся проработать отношения с партнёром. Подумайте, насколько вы счастливы и реализованы в отношениях, доставляют ли они радость; если есть проблемы, то в чём они. Нередко в эти периоды люди прибегают к совету профессиональных психологов, так как в застаревших проблемах или в себе самом сложно разобраться.\nНеобыкновенное время для действия, проявления кармических законов и воздействия судьбы. Не стоит пенят на жизнь, искать справедливость (по вашим понятиям и законам). Зато полезно поступать с другими, как хотели бы, чтобы обращались с вами. Старайтесь проявлять миролюбие, легкое отношение к жизни, при этом работая над своим характером, постигая жизненные законы.\nОбратите внимание на порядок в делах и документах, отдайте все долги, в какой бы форме они ни были (обязательства, налоги, кредиты, помощь в ответ на оказанную вам).\nВозможны ключевые события:\nПоложительные:\nОбучение и сдача экзаменов, получение диплома. Обращение в госструктуры, суды с успешным разрешением дел в вашу пользу...Продолжение в платной версии\n\n(3) Период, когда вы смело можете пожинать плоды своей деятельности во всех сферах жизни. Нередко следует продвижение по карьере. При этом может предстоять непростой выбор между интересами семьи и вашей социальной реализацией.\nУ семейных мужчин возможно рождение дочери. Если в этот период появится на свет мальчик, то он будет отличаться мягким складом характера.\nСвободный мужчина вероятнее всего встретит будущую супругу или ту, с которой сложатся серьезные прочные отношения. Такая партнерша сильно повлияет на вашу жизнь в будущем.\nВажно уделять достаточно внимания и заботы женщинам рода, прорабатывая свои мужские качества. Если есть обиды, недопонимания с родственницами, важно найти контакт с ними и наладить отношения.\nВозможны ключевые события:\nПоложительные:\nПродвижение дел, успех в бизнесе, начало новых амбициозных (и особенно творческих) проектов. Бизнес приносит прибыль, успех сопутствует не только в делах, но и в личной жизни...Продолжение в платной версии\n\n(11) Время роста и успеха, но в то же время и больших энергозатрат. Можно преуспеть в карьере и обществе вплоть до сильного влияния на большое количество людей, создания новых направлений. Период позитивный и дарящий много отдачи при разумном использовании своей силы. Именно сейчас важно привести себя в форму, научиться эффективно работать, а не перегружаться. Хорошо нормализовать своей режим дня, регулярно заниматься спортом, чаще бывать на свежем воздухе. Отводите время и на увлечения, выделяя этому свободное время. Так ваша работоспособность будет гораздо выше, нежели если вы будете бросаться от одного проекта к другому, взваливать на себя всё разом, постоянно создавать кипучую деятельность и задерживаться на работе.\nНе пожалейте время на профилактику хронических заболеваний и плановый медосмотр, чтобы не упустить важное. В противном случае сопутствующий такому периоду трудоголизм может довести до полного физического и нервного истощения.\nВозможны ключевые события:\nПоложительные:\nПериод прохождения испытания на выносливость, максимальное напряжение сил с отдачей в спорт, работу, бизнес, какую-либо плодотворную деятельность. Ситуация в ваших руках, и вы получаете повышение, признание...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.61333Z",
                    "edited": "2022-02-05T09:51:40.964001Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "8",
                    "gender": "",
                    "type": "expandable",
                    "title": "45",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5078,
                    "content": "(22) Период, несущий много динамизма с собой, придётся быть активным и действовать, даже если вы обычно жили довольно размеренно. Будет тянуть в путешествия, захочется перемены обстановки. Либо могут возникать такие ситуации, которые заставят двигаться. Путешествия, много общения принесут в жизнь свежий поток новых идей, знакомства с полезными и нужными людьми (возможно, новые отношения), нужную информацию, возможности и самореализацию. Важно не цепляться за мелочи, быт, материальное, уметь жить в потоке и наслаждаться состоянием здесь и сейчас. Могут появиться внезапные денежные поступления, большая прибыль.\nПри этом зацикленность на материальном, какие-то привязки могут принести сложности. Начаться может с бытовых проблем и поломок. Но если не изменить ничего в своей жизни, то деньги будут утекать, а неприятности расти, накатывая снежным комом. Как только заметите подобное - сразу в путь. Пусть это будет даже выезд на несколько часов на природу или в соседний город.\nПолезно будет настраивать себя позитивно, уметь замечать хорошее в мелочах, больше радоваться, быть свободным. Ощущение свободы должно быть и у вашего окружения (партнёра, детей, коллег). Нельзя давить, сковывать кого-то, важно принимать особенности, взгляды и позицию других. Уметь поставить себя на место другого человека.\nНе исключено, что придётся начать всё с нуля. Для успешного начинания важно иметь опору, стержень внутри себя и меньше зависеть ото всего внешнего.\nВозможны ключевые события:\nПоложительные:\nПриятные знакомства, лёгкие и интересные отношения. Ощущение свободы, удача в делах, хорошие шансы в жизни...Продолжение в платной версии\n\n(8) Спокойный и относительно стабильный период, который многие склонны воспринимать как время застоя. На самом деле, в нём закладываются все возможные плоды для дальнейшего развития важных сфер жизни: от личной до карьеры и реализации в обществе. Важно осмыслить своё прошлое и настоящее на предмет, чего вы достигли и к чему хотели бы прийти, каковы ваши возможности и насколько вы себя реализуете в работе, творчестве.\nТакже придётся проработать отношения с партнёром. Подумайте, насколько вы счастливы и реализованы в отношениях, доставляют ли они радость; если есть проблемы, то в чём они. Нередко в эти периоды люди прибегают к совету профессиональных психологов, так как в застаревших проблемах или в себе самом сложно разобраться.\nНеобыкновенное время для действия, проявления кармических законов и воздействия судьбы. Не стоит пенят на жизнь, искать справедливость (по вашим понятиям и законам). Зато полезно поступать с другими, как хотели бы, чтобы обращались с вами. Старайтесь проявлять миролюбие, легкое отношение к жизни, при этом работая над своим характером, постигая жизненные законы.\nОбратите внимание на порядок в делах и документах, отдайте все долги, в какой бы форме они ни были (обязательства, налоги, кредиты, помощь в ответ на оказанную вам).\nВозможны ключевые события:\nПоложительные:\nОбучение и сдача экзаменов, получение диплома. Обращение в госструктуры, суды с успешным разрешением дел в вашу пользу...Продолжение в платной версии\n\n(3) Период, когда вы смело можете пожинать плоды своей деятельности во всех сферах жизни. Нередко следует продвижение по карьере. При этом может предстоять непростой выбор между интересами семьи и вашей социальной реализацией.\nУ семейных мужчин возможно рождение дочери. Если в этот период появится на свет мальчик, то он будет отличаться мягким складом характера.\nСвободный мужчина вероятнее всего встретит будущую супругу или ту, с которой сложатся серьезные прочные отношения. Такая партнерша сильно повлияет на вашу жизнь в будущем.\nВажно уделять достаточно внимания и заботы женщинам рода, прорабатывая свои мужские качества. Если есть обиды, недопонимания с родственницами, важно найти контакт с ними и наладить отношения.\nВозможны ключевые события:\nПоложительные:\nПродвижение дел, успех в бизнесе, начало новых амбициозных (и особенно творческих) проектов. Бизнес приносит прибыль, успех сопутствует не только в делах, но и в личной жизни...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:37.208376Z",
                    "edited": "2022-02-05T09:51:43.9592Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "22",
                    "gender": "",
                    "type": "expandable",
                    "title": "46-47",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5062,
                    "content": "(14) Хороший период для познания себя, исследования своего глубинного внутреннего Я и тайников души. Нередко проявляется интерес к творчеству, искусству, красоте и тонким вещам. Могут возникнуть ситуации, которые помогут проявиться качествам характера, до этого не проявлявшимся. Особенно это касается смирения, терпеливости, способности принимать события и вещи такими, какие они есть. Часть из них будет просто не остановить и не изменить. Поэтому придётся взять на себя роль мудрого и смиренного наблюдателя, который отдаётся на волю своей судьбы. И это станет лучшим из возможных решений.\nНе проявляйте нетерпеливости: каждому событию своё время. Нельзя также жаловаться, жадничать или роптать на судьбу. Вам всё воздастся в свой определённый срок. Начните доверять хорошему течению жизни и благодарить её даже за мелочи.\nОтличный период для того, чтобы научиться быть в гармонии с собой. Займитесь делами, которые вам по душе или тем, о чём давно мечтали. Не бойтесь связанных с этим перемен. Вам будет дано именно столько, сколько нужно для спокойной, комфортной жизни и занятия хобби, творчеством, саморазвитием и т.д.\nПозаботиться захочется не только о душевном комфорте, но и о телесном. Полезно будет заняться своим питанием, очищением. Не исключено, что интерес появится в области натуральных средств, как травы, масла, минералы, вода. Используйте по максимуму возможности природных даров, но не переусердствуйте. В данный период важна умеренность во всём. Прислушивайтесь к сигналам организма. За что бы ни брались, доводите начатое до конца. Делайте упор на качество, а не количество. Уделяйте внимание и своим эмоциям, сглаживая острые углы и не позволяя накапливаться негативу.\nВозможны ключевые события:\nПоложительные:\nСтабильность в жизни и делах. Незначительный постепенный рост в карьере, бизнесе...Продолжение в платной версии\n\n(5) Время знаменует собой максимальный фокус на семью и дела близких. Благоприятно для вступления в брак, рождения детей. Ваша помощь может потребоваться близким, возможно решение каких-то семейных дел, установление новых традиций в роду. При этом необходимо соблюдать баланс в отношениях и взаимодействии с родными. Не стоит слишком цепляться за родственников (старших, младших), живя их жизнью, ставя себя в положение жертвы или излишне опекая. Подросших детей придётся отпустить в самостоятельную жизнь. Со старшими в роду важно поддерживать здоровые уважительные отношения, оказывая внимание и заботу. Но проживать свою жизнь и действовать по своему разумению, в рамках сформированной системы внутренних ценностей.\nЭтот период характеризуется расстановкой приоритетов. Возможно, захочется навести порядок как буквально (в быту), так и в разных сферах жизни. Действуйте экологично, соблюдая порядок не только в доме, но и в эмоциональном плане, в мыслях. Старайтесь не опаздывать и вообще серьезнее относиться к ресурсам времени (своего и чужого), полезно соблюдать режим дня и систематизировать свою жизнь, разложив всё по полочкам.\nПолезным будет обучение, самосовершенствование как в личном, так и в профессиональном плане. Хорошо пройти курсы, получать новые знания и использовать их на практике. Важно не только копить знания, но и делиться ими.\nОсобенное внимание стоит уделить бумагам, официальным документам. Придётся следить за их правильным оформлением.\nВозможны ключевые события:\nПоложительные:\nДля молодых людей - обучение, получение документов, отделение от родителей и начало самостоятельной жизни. Возможно вступление в брак с подходящим партнёром, который крепко стоит на ногах...Продолжение в платной версии\n\n(19) В такое время человек может испытывать эмоциональный подъем, хочется наслаждаться простыми радостями, баловать своего внутреннего ребёнка или добрать то, чего не доставало в детстве. Хорошо идут контакты с детьми (в том числе в рабочей сфере). Отличный период, чтобы выстроить отношения с братьями или сёстрами, если они долгое время не были близкими.\nМожно позволить себе расслабиться и плыть по течению жизни, так как в самых разных сферах всё будет складываться само собой. Но это сработает только, когда человек не одержим некой идеей, не зациклен на чём либо (работа, деньги, отношения). Если в голове навязчивая мысль, например, выйти замуж во что бы то ни стало, навязчивый поиск отношений, маниакальная страсть к деньгам/власти, то это может привести к усложнению ситуации. Либо появляются болезни, зажимы на уровне психосоматики, либо серьезные проблемы, так что человек оказывается обездвиженным.\nЧтобы период стал изобильным и максимально благополучным, стоит чаще благодарить жизнь за то, что она даёт. Не проявлять чрезмерного контроля в работе и отношениях, дать больше свободы детям. Энергию нужно распределять плавно на самые разные дела и сферы жизни, уделяя времени понемногу самым разным делам. Тогда они будут идти легко.\nСамое важное в это время - простить себя и проработать чувство вины. Иначе оно будет съедать всю энергию, выжигать изнутри. А в жизни вновь и вновь будут приходить повторяющие ситуации, когда человека унижают, каким-то образом наказывают.\nВозможны ключевые события:\nПоложительные:\nСчастливые события в работе и семейной жизни, ощущение целостности бытия, наслаждение и радость каждый день. Налаживание отношений с братьями/сёстрами, с отцом, семейные праздники...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:36.297684Z",
                    "edited": "2022-02-05T09:51:42.258699Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "14",
                    "gender": "",
                    "type": "expandable",
                    "title": "47.5-48",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5074,
                    "content": "(20) Время будет правильно использовать для налаживания связей с членами рода, особенно с родителями. Именно в этот период чаще всего проявляются скрытые проблемы и застарелые обиды родом из детства. Важно отследить это в себе и принять, а не прятать. Обиды следует проработать и отпустить, приняв родителей, такими, какие они есть, со всеми ошибками.\nВ налаживании семейных связей поможет общение со старшими членами рода, будет полезно узнать историю семьи и составить генеалогическое древо.\nВ общественном, глобальном уровне можно выйти на новую ступень развития, поучаствовать в крупном проекте, стать востребованным профессионалом в своей сфере. Но такое случится только в том случае, если вам комфортно в своей среде, на своём месте и вы абсолютно принимаете себя, довольны своей жизнью, работой, состоянием. Тогда жизнь может подарить уникальные возможности для того, чтобы человек проявил себя и получил славу, известность, рост и успех. В противном случае, если человек критикует всё вокруг, не любит свою работу, страну, город, не наладил отношения с близкими - все возможности закрываются.\nВозможны ключевые события:\nПоложительные:\nХорошие семейные отношения, укрепление рода, воссоединение семьи. Возможно объединение родов, удачный прочный брак и поддержка от членов семьи, основание и успешное ведение семейного бизнеса...Продолжение в платной версии\n\n(7) Особенность периода – это активное движение и новые возможности. Следует откликаться на все шансы и быть максимально мобильным. Это отличный этап для переездов и всего, что связано со сферой смены жилья. Хорошо просто путешествовать или отправляться в деловые командировки. Это даст новые полезные знакомства, вы обрастёте кругом единомышленников и новых друзей. Также возможно движение по карьерной лестнице, творческий и рабочий рост.\nХорошо не упускать все возможности проявить себя. Но еще более полезно будет наметить конкретную цель, выработать план и двигаться по нему.\nБудет возможность для открытия или долгожданного расширения бизнеса. Если есть сомнения, то стоит опереться на помощников и не бояться впускать в процесс как можно больше людей. Это именно то время, когда главными окажутся коллективные усилия. Вам с успехом удастся выполнять самые разные проекты и руководить коллективом.\nВозможны ключевые события:\nПоложительные:\nХорошие новости и предложения, новые идеи и возможности. Плодотворные поездки, движение по карьере, расширение своего дела...Продолжение в платной версии\n\n(9) Время для глубокой внутренней проработки своей личности. Хорошо переосмыслить прошлый и настоящий опыт, задать себе правильные вопросы. Нередко люди в такой период усиленно занимаются поиском смысла жизни и себя в мире. Не стоит опираться на других людей и чужие умозаключения - все ответы уже есть внутри вас. Именно к себе, своему внутреннему голосу и стоит обратиться. Полезно больше времени проводить в одиночестве, на природе, заниматься йогой, читать книги по психологии, изучать законы Вселенной и построения взаимоотношений.\nЗанимайтесь творчеством и старайтесь выстроить доверительные, более глубокие отношения со спутником жизни, выходя на новый уровень. Ваша креативность, глубина, внутренний потенциал станут помощниками и в этом.\nПериод, когда многие пересматривают свой жизненный уровень, положение в обществе, доходы. Не исключено, что многое захочется скорректировать. Главное быть во всем умеренным, не делать резких или необдуманных шагов. В погоне за благосостоянием не экономьте на себе и тем более на здоровье. Вам необходим качественный уровень жизни.\nВозможны ключевые события:\nПоложительные:\nОтдых от трудов и уединённое состояние, возможно посещение особых сакральных мест, мест силы или святых мест. Духовный рост, творческое развитие личности обретение себя через обучение или обретение наставника...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:36.983781Z",
                    "edited": "2022-02-05T09:51:43.528848Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "20",
                    "gender": "",
                    "type": "expandable",
                    "title": "48.5-49",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5046,
                    "content": "(6) Период максимально направлен на отношения с окружающими, внешнюю красоту и внутреннюю гармонию. Важно поддерживать все сферы в балансе и идти за своими ощущениями, не действуя по указке или желаниям, интересам других.\nОбустраивайте пространство вокруг себя и уделяйте себе особое внимания, балуя и украшая. В такое время особенно чувствуется потребность в тактильности, в любви.\nХочется самому проявлять нежность, ласку и получать в ответ от других. Важно внимание, уход, забота. Человек в такой период склонен влюбляться, стремится найти свою половинку. А если она уже есть, то максимально фокусируется на близости с партнером, на качестве отношений. Если не хватает внимания и ласки от близкого человека, на этом фоне могут возникать обиды и недопонимание. Не стоит уходить в себя и замалчивать проблемы. Проявляйтесь сами и открыто говорите о том, чего хотите. Есть возможность планирования появления детей в семье.\nАктивно раскрываются коммуникативные способности, есть потребность быть в хороших отношениях с окружающими, нравиться всем. Остро хочется наконец-то выделить время для хобби, особенно творческих (от цветоводства до дизайна).\nПри непонимании с окружающими, а особенно близкими, старайтесь сгладить острые конфликты и идти на примирение первыми. Это скажется положительно, прежде всего, на вас.\nВозможны ключевые события:\nПоложительные:\nМного новых знакомств, общения и приятных контактов. Флирт и влюбленность, благополучные новые отношения, помолвка, свадьба...Продолжение в платной версии\n\n(2) Интересный период загадок и тайн. Прислушайтесь к своей интуиции, внутреннему голосу. Судьба сама приведет вас к нужным людям в своё время. Даже если вы всю жизнь считали себя творцом судьбы и активным в своих позициях, в это время стоит довериться жизненному потоку, прислушаться к происходящему и включить своё шестое чувство.\nЧрезмерная рассудительность и логика в такое время может стать вашим врагом. Гораздо полезнее занять пассивную позицию и использовать свои внутренние ресурсы, обращать внимание на знаки судьбы и \"простые совпадения\". Помочь раскрыть своё внутренне Я может увлечение психологией, астрологией, нумерологией и другими науками.\nОсобенно важно в этот период наладить отношения с матерью и другими женщинами рода, также со своими половинками (и даже бывшими, чтобы отпустили и не держали обиды).\nДля гармонизации своего состояния стоит быть более гибким, проявлять заботу о других, сохранять спокойствие в любых обстоятельствах. Полезными для жизненного и физического баланса станут также забота о теле: здоровый образ жизни, полезные привычки. Чаще стоит бывать на природе, использовать натуральные продукты.\nВозможны ключевые события:\nПоложительные:\nГармоничная и спокойная в целом жизнь в достатке и успехе. Интерес к тайным знаниям, обучение, сбор важной информации, также её использование или передача...Продолжение в платной версии\n\n(8) Спокойный и относительно стабильный период, который многие склонны воспринимать как время застоя. На самом деле, в нём закладываются все возможные плоды для дальнейшего развития важных сфер жизни: от личной до карьеры и реализации в обществе. Важно осмыслить своё прошлое и настоящее на предмет, чего вы достигли и к чему хотели бы прийти, каковы ваши возможности и насколько вы себя реализуете в работе, творчестве.\nТакже придётся проработать отношения с партнёром. Подумайте, насколько вы счастливы и реализованы в отношениях, доставляют ли они радость; если есть проблемы, то в чём они. Нередко в эти периоды люди прибегают к совету профессиональных психологов, так как в застаревших проблемах или в себе самом сложно разобраться.\nНеобыкновенное время для действия, проявления кармических законов и воздействия судьбы. Не стоит пенят на жизнь, искать справедливость (по вашим понятиям и законам). Зато полезно поступать с другими, как хотели бы, чтобы обращались с вами. Старайтесь проявлять миролюбие, легкое отношение к жизни, при этом работая над своим характером, постигая жизненные законы.\nОбратите внимание на порядок в делах и документах, отдайте все долги, в какой бы форме они ни были (обязательства, налоги, кредиты, помощь в ответ на оказанную вам).\nВозможны ключевые события:\nПоложительные:\nОбучение и сдача экзаменов, получение диплома. Обращение в госструктуры, суды с успешным разрешением дел в вашу пользу...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.382479Z",
                    "edited": "2022-02-05T09:51:40.536734Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "6",
                    "gender": "",
                    "type": "expandable",
                    "title": "50",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5078,
                    "content": "(22) Период, несущий много динамизма с собой, придётся быть активным и действовать, даже если вы обычно жили довольно размеренно. Будет тянуть в путешествия, захочется перемены обстановки. Либо могут возникать такие ситуации, которые заставят двигаться. Путешествия, много общения принесут в жизнь свежий поток новых идей, знакомства с полезными и нужными людьми (возможно, новые отношения), нужную информацию, возможности и самореализацию. Важно не цепляться за мелочи, быт, материальное, уметь жить в потоке и наслаждаться состоянием здесь и сейчас. Могут появиться внезапные денежные поступления, большая прибыль.\nПри этом зацикленность на материальном, какие-то привязки могут принести сложности. Начаться может с бытовых проблем и поломок. Но если не изменить ничего в своей жизни, то деньги будут утекать, а неприятности расти, накатывая снежным комом. Как только заметите подобное - сразу в путь. Пусть это будет даже выезд на несколько часов на природу или в соседний город.\nПолезно будет настраивать себя позитивно, уметь замечать хорошее в мелочах, больше радоваться, быть свободным. Ощущение свободы должно быть и у вашего окружения (партнёра, детей, коллег). Нельзя давить, сковывать кого-то, важно принимать особенности, взгляды и позицию других. Уметь поставить себя на место другого человека.\nНе исключено, что придётся начать всё с нуля. Для успешного начинания важно иметь опору, стержень внутри себя и меньше зависеть ото всего внешнего.\nВозможны ключевые события:\nПоложительные:\nПриятные знакомства, лёгкие и интересные отношения. Ощущение свободы, удача в делах, хорошие шансы в жизни...Продолжение в платной версии\n\n(7) Особенность периода – это активное движение и новые возможности. Следует откликаться на все шансы и быть максимально мобильным. Это отличный этап для переездов и всего, что связано со сферой смены жилья. Хорошо просто путешествовать или отправляться в деловые командировки. Это даст новые полезные знакомства, вы обрастёте кругом единомышленников и новых друзей. Также возможно движение по карьерной лестнице, творческий и рабочий рост.\nХорошо не упускать все возможности проявить себя. Но еще более полезно будет наметить конкретную цель, выработать план и двигаться по нему.\nБудет возможность для открытия или долгожданного расширения бизнеса. Если есть сомнения, то стоит опереться на помощников и не бояться впускать в процесс как можно больше людей. Это именно то время, когда главными окажутся коллективные усилия. Вам с успехом удастся выполнять самые разные проекты и руководить коллективом.\nВозможны ключевые события:\nПоложительные:\nХорошие новости и предложения, новые идеи и возможности. Плодотворные поездки, движение по карьере, расширение своего дела...Продолжение в платной версии\n\n(11) Время роста и успеха, но в то же время и больших энергозатрат. Можно преуспеть в карьере и обществе вплоть до сильного влияния на большое количество людей, создания новых направлений. Период позитивный и дарящий много отдачи при разумном использовании своей силы. Именно сейчас важно привести себя в форму, научиться эффективно работать, а не перегружаться. Хорошо нормализовать своей режим дня, регулярно заниматься спортом, чаще бывать на свежем воздухе. Отводите время и на увлечения, выделяя этому свободное время. Так ваша работоспособность будет гораздо выше, нежели если вы будете бросаться от одного проекта к другому, взваливать на себя всё разом, постоянно создавать кипучую деятельность и задерживаться на работе.\nНе пожалейте время на профилактику хронических заболеваний и плановый медосмотр, чтобы не упустить важное. В противном случае сопутствующий такому периоду трудоголизм может довести до полного физического и нервного истощения.\nВозможны ключевые события:\nПоложительные:\nПериод прохождения испытания на выносливость, максимальное напряжение сил с отдачей в спорт, работу, бизнес, какую-либо плодотворную деятельность. Ситуация в ваших руках, и вы получаете повышение, признание...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:37.208376Z",
                    "edited": "2022-02-05T09:51:43.9592Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "22",
                    "gender": "",
                    "type": "expandable",
                    "title": "51-52",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5066,
                    "content": "(16) На данном этапе человек теряет самое ценное для него. Обычно это касается достижений материального мира: близкий человек, отношения, деньги, могущество, власть, работа. Чем сильнее человек цепляется за какую-то материальную сферу жизни, тем вероятнее в ней потеря. Это кризис даётся человеку, чтобы он изменил свои взгляды, очнулся от бега по кругу и начал жить иначе. Предстоит непростой период становления, пробуждения духовно из-за неприятных перемен.\nПридётся отказаться ото всего прежнего: образа жизни, привычек, мировоззрения - переосмыслить личные ценности. Помогут различные глубокие учения и знания об устройстве мира от психологии до астрологии. На пути познания себя и мира хорошо делать то, чем раньше не занимались, ввести некие ограничения, осмысленные и доступные аскезы (в еде, удовольствиях, например).\nПолезно также экспериментировать и начинать новое от путешествий до знакомств, хобби. Лучше всего поменять всю среду и выйти из зоны комфорта, как бы неприятно и неожиданно это ни было. Если что-то при этом не удаётся, не стоит переживать. Времени начать новый цикл жизни будет достаточно. Важно проработать свои амбиции и неумеренное эго, которое для будущего будет только во вред.\nВозможны ключевые события:\nПоложительные:\nХорошее положение в делах, развитие бизнеса, закладывание фундамента собственного дела. Резкие перемены, реорганизация устройства быта, жизни или на уровне работы, общественных связей...Продолжение в платной версии\n\n(5) Время знаменует собой максимальный фокус на семью и дела близких. Благоприятно для вступления в брак, рождения детей. Ваша помощь может потребоваться близким, возможно решение каких-то семейных дел, установление новых традиций в роду. При этом необходимо соблюдать баланс в отношениях и взаимодействии с родными. Не стоит слишком цепляться за родственников (старших, младших), живя их жизнью, ставя себя в положение жертвы или излишне опекая. Подросших детей придётся отпустить в самостоятельную жизнь. Со старшими в роду важно поддерживать здоровые уважительные отношения, оказывая внимание и заботу. Но проживать свою жизнь и действовать по своему разумению, в рамках сформированной системы внутренних ценностей.\nЭтот период характеризуется расстановкой приоритетов. Возможно, захочется навести порядок как буквально (в быту), так и в разных сферах жизни. Действуйте экологично, соблюдая порядок не только в доме, но и в эмоциональном плане, в мыслях. Старайтесь не опаздывать и вообще серьезнее относиться к ресурсам времени (своего и чужого), полезно соблюдать режим дня и систематизировать свою жизнь, разложив всё по полочкам.\nПолезным будет обучение, самосовершенствование как в личном, так и в профессиональном плане. Хорошо пройти курсы, получать новые знания и использовать их на практике. Важно не только копить знания, но и делиться ими.\nОсобенное внимание стоит уделить бумагам, официальным документам. Придётся следить за их правильным оформлением.\nВозможны ключевые события:\nПоложительные:\nДля молодых людей - обучение, получение документов, отделение от родителей и начало самостоятельной жизни. Возможно вступление в брак с подходящим партнёром, который крепко стоит на ногах...Продолжение в платной версии\n\n(21) Идеальное время для путешествий и работы, связанной с переездами, командировками. Хорошо посещать новые места, города и даже другие страны, знакомиться с иностранцами, изучать новые языки, незнакомую культуру, расширяя свой кругозор и снимая собственные рамки, расширяя границы сознания.\nВообще в этот период будет много движения, всё будет способствовать тому, чтобы перемены и активность были максимально лёгкими и удачными.\nМожно реализовать себя, если быть активным. Достигнуть того, о чём давно и много мечталось. Хорошо открывать новые проекты, выходя на иной уровень жизни. Новые контакты и полезные связи помогут в продвижении, достижении успеха. Особенно во всех сферах, связанных со СМИ, социальными сетями, массовыми коммуникациями.\nПривести в гармоничное состояние удастся все области жизни. Вы будете испытывать удовлетворение, целостность жизни и личности. Гармония с миром и собой поможет достигнуть большего, так как не нужно отвлекаться на решение проблем. Более того, человек в такой период будет делиться своей внутренней гармонией и выступать в качестве миротворца. Но если нет внутренней целостности и гармонии, если человек агрессивно настроен к миру, традициям, устройству общества, хочет получить насилием всё и сразу, жизнь наказывает такое.\nВ этот год нужно быть осторожнее с финансами. Не давать в долг и не брать взаймы, иначе расплатиться потом будет очень сложно.\nВозможны ключевые события:\nПоложительные:\nИзучение иностранного языка, путешествия, новая работа или дела, связанные с контактами заграницей. Новые знакомства, отношения с иностранцами...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:36.526066Z",
                    "edited": "2022-02-05T09:51:42.681754Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "16",
                    "gender": "",
                    "type": "expandable",
                    "title": "52.5-53",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5050,
                    "content": "(8) Спокойный и относительно стабильный период, который многие склонны воспринимать как время застоя. На самом деле, в нём закладываются все возможные плоды для дальнейшего развития важных сфер жизни: от личной до карьеры и реализации в обществе. Важно осмыслить своё прошлое и настоящее на предмет, чего вы достигли и к чему хотели бы прийти, каковы ваши возможности и насколько вы себя реализуете в работе, творчестве.\nТакже придётся проработать отношения с партнёром. Подумайте, насколько вы счастливы и реализованы в отношениях, доставляют ли они радость; если есть проблемы, то в чём они. Нередко в эти периоды люди прибегают к совету профессиональных психологов, так как в застаревших проблемах или в себе самом сложно разобраться.\nНеобыкновенное время для действия, проявления кармических законов и воздействия судьбы. Не стоит пенят на жизнь, искать справедливость (по вашим понятиям и законам). Зато полезно поступать с другими, как хотели бы, чтобы обращались с вами. Старайтесь проявлять миролюбие, легкое отношение к жизни, при этом работая над своим характером, постигая жизненные законы.\nОбратите внимание на порядок в делах и документах, отдайте все долги, в какой бы форме они ни были (обязательства, налоги, кредиты, помощь в ответ на оказанную вам).\nВозможны ключевые события:\nПоложительные:\nОбучение и сдача экзаменов, получение диплома. Обращение в госструктуры, суды с успешным разрешением дел в вашу пользу...Продолжение в платной версии\n\n(16) На данном этапе человек теряет самое ценное для него. Обычно это касается достижений материального мира: близкий человек, отношения, деньги, могущество, власть, работа. Чем сильнее человек цепляется за какую-то материальную сферу жизни, тем вероятнее в ней потеря. Это кризис даётся человеку, чтобы он изменил свои взгляды, очнулся от бега по кругу и начал жить иначе. Предстоит непростой период становления, пробуждения духовно из-за неприятных перемен.\nПридётся отказаться ото всего прежнего: образа жизни, привычек, мировоззрения - переосмыслить личные ценности. Помогут различные глубокие учения и знания об устройстве мира от психологии до астрологии. На пути познания себя и мира хорошо делать то, чем раньше не занимались, ввести некие ограничения, осмысленные и доступные аскезы (в еде, удовольствиях, например).\nПолезно также экспериментировать и начинать новое от путешествий до знакомств, хобби. Лучше всего поменять всю среду и выйти из зоны комфорта, как бы неприятно и неожиданно это ни было. Если что-то при этом не удаётся, не стоит переживать. Времени начать новый цикл жизни будет достаточно. Важно проработать свои амбиции и неумеренное эго, которое для будущего будет только во вред.\nВозможны ключевые события:\nПоложительные:\nХорошее положение в делах, развитие бизнеса, закладывание фундамента собственного дела. Резкие перемены, реорганизация устройства быта, жизни или на уровне работы, общественных связей...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.61333Z",
                    "edited": "2022-02-05T09:51:40.964001Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "8",
                    "gender": "",
                    "type": "expandable",
                    "title": "53.5-54",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5054,
                    "content": "(10) Время принимать дары судьбы и почувствовать себя настоящим счастливчиком. В жизни могут произойти самые важные и приятные события от выигрыша в лотерею до крупной прибыли, удачи в деле, которое давно планировалось. Реализация мечты, судьбоносная встреча и счастливые отношения. Всё будет способствовать самым приятным переменам. Вы словно попали в свой поток и двигаетесь по течению, получая бонусы и при этом не прикладывая особенных усилий. Находятся средства, открываются все двери, а на жизненном пути попадаются именно нужные люди.\nВажно быть открытым этому потоку и новым возможностям, нести позитивное отношение к жизни, благодарить каждый новый день. Относитесь к событиям легко, ловите знаки судьбы и не бойтесь загадывать желания. Перестаньте всё излишне контролировать и просто получайте удовольствие от того, что происходит вокруг. Доверьтесь переменам и жизни, которые точно \"знают\", как лучше для вас.\nВ этот период особое внимание стоит уделить коммуникациям, общественным связям, друзьям и коллегам. Именно среди них можно встретить свою половинку или получить возможности, информацию для дальнейшего роста.\nЗастой в любых сферах вредит, так же как и излишнее самокопание, сомнения, подозрительность. Ведите максимально активный образ жизни: работайте и творите, путешествуйте и бывайте в людных местах. Не бойтесь проявлять себя.\nВозможны ключевые события:\nПоложительные:\nПоток удачи и денег, резкие перемены к лучшему, шанс от судьбы. Выигрыш в лотерею, повышение по работе или новая очень привлекательная должность...Продолжение в платной версии\n\n(3) Период, когда вы смело можете пожинать плоды своей деятельности во всех сферах жизни. Нередко следует продвижение по карьере. При этом может предстоять непростой выбор между интересами семьи и вашей социальной реализацией.\nУ семейных мужчин возможно рождение дочери. Если в этот период появится на свет мальчик, то он будет отличаться мягким складом характера.\nСвободный мужчина вероятнее всего встретит будущую супругу или ту, с которой сложатся серьезные прочные отношения. Такая партнерша сильно повлияет на вашу жизнь в будущем.\nВажно уделять достаточно внимания и заботы женщинам рода, прорабатывая свои мужские качества. Если есть обиды, недопонимания с родственницами, важно найти контакт с ними и наладить отношения.\nВозможны ключевые события:\nПоложительные:\nПродвижение дел, успех в бизнесе, начало новых амбициозных (и особенно творческих) проектов. Бизнес приносит прибыль, успех сопутствует не только в делах, но и в личной жизни...Продолжение в платной версии\n\n(13) Период кардинальных перемен и резких поворотов в судьбе. Грядут события, после которых жизнь уже не станет прежней. Они могут быть как положительными, так и горькими (вплоть до смерти кого-то из близкого окружения). Важно принять их, какими бы они ни были. Придётся следовать за событиями и процессами, которые становятся совсем неожиданными, но необходимыми.\nВаша роль - принятие, готовность к переменам, непротивление, мудрость. Необходимо самостоятельно начать отпускать всё старое, ненужное и изжившее себя в это время от работы, отношений, которые уже не устраивают, до вещей (например, заняться расхламлением). Придётся буквально подстраиваться под быстро меняющуюся обстановку и следовать за происходящим, не обдумывая долго и не погружаясь глубоко в события. Будет полезно научиться принимать решения быстро и при этом стратегически верно.\nТакой период нередко несёт изменения в самых разных сферах сразу: кризисные ситуации на работе, в отношениях, проблемы со здоровьем. Поэтому не стоит напрасно пускаться в авантюры, совершать рискованные поступки, излишне разбрасываясь временем и энергией. Хорошо начать здоровый образ жизни, отказаться от плохих привычек, следить за рационом.\nВажно не пытаться удерживать то, что уже стало лишним в вашей жизни, что не несет ничего нового, живительного, никакого движения. Это поможет впустить в жизнь свежую энергию и заложить основу для успешного будущего.\nВозможны ключевые события:\nПоложительные:\nПеремены в жизни, как правило, довольно кардинальные. В плане здоровья -хорошо прошедшая операция, избавление от серьезной болезни...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.841516Z",
                    "edited": "2022-02-05T09:51:41.386335Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "10",
                    "gender": "",
                    "type": "expandable",
                    "title": "55",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5046,
                    "content": "(6) Период максимально направлен на отношения с окружающими, внешнюю красоту и внутреннюю гармонию. Важно поддерживать все сферы в балансе и идти за своими ощущениями, не действуя по указке или желаниям, интересам других.\nОбустраивайте пространство вокруг себя и уделяйте себе особое внимания, балуя и украшая. В такое время особенно чувствуется потребность в тактильности, в любви.\nХочется самому проявлять нежность, ласку и получать в ответ от других. Важно внимание, уход, забота. Человек в такой период склонен влюбляться, стремится найти свою половинку. А если она уже есть, то максимально фокусируется на близости с партнером, на качестве отношений. Если не хватает внимания и ласки от близкого человека, на этом фоне могут возникать обиды и недопонимание. Не стоит уходить в себя и замалчивать проблемы. Проявляйтесь сами и открыто говорите о том, чего хотите. Есть возможность планирования появления детей в семье.\nАктивно раскрываются коммуникативные способности, есть потребность быть в хороших отношениях с окружающими, нравиться всем. Остро хочется наконец-то выделить время для хобби, особенно творческих (от цветоводства до дизайна).\nПри непонимании с окружающими, а особенно близкими, старайтесь сгладить острые конфликты и идти на примирение первыми. Это скажется положительно, прежде всего, на вас.\nВозможны ключевые события:\nПоложительные:\nМного новых знакомств, общения и приятных контактов. Флирт и влюбленность, благополучные новые отношения, помолвка, свадьба...Продолжение в платной версии\n\n(7) Особенность периода – это активное движение и новые возможности. Следует откликаться на все шансы и быть максимально мобильным. Это отличный этап для переездов и всего, что связано со сферой смены жилья. Хорошо просто путешествовать или отправляться в деловые командировки. Это даст новые полезные знакомства, вы обрастёте кругом единомышленников и новых друзей. Также возможно движение по карьерной лестнице, творческий и рабочий рост.\nХорошо не упускать все возможности проявить себя. Но еще более полезно будет наметить конкретную цель, выработать план и двигаться по нему.\nБудет возможность для открытия или долгожданного расширения бизнеса. Если есть сомнения, то стоит опереться на помощников и не бояться впускать в процесс как можно больше людей. Это именно то время, когда главными окажутся коллективные усилия. Вам с успехом удастся выполнять самые разные проекты и руководить коллективом.\nВозможны ключевые события:\nПоложительные:\nХорошие новости и предложения, новые идеи и возможности. Плодотворные поездки, движение по карьере, расширение своего дела...Продолжение в платной версии\n\n(13) Период кардинальных перемен и резких поворотов в судьбе. Грядут события, после которых жизнь уже не станет прежней. Они могут быть как положительными, так и горькими (вплоть до смерти кого-то из близкого окружения). Важно принять их, какими бы они ни были. Придётся следовать за событиями и процессами, которые становятся совсем неожиданными, но необходимыми.\nВаша роль - принятие, готовность к переменам, непротивление, мудрость. Необходимо самостоятельно начать отпускать всё старое, ненужное и изжившее себя в это время от работы, отношений, которые уже не устраивают, до вещей (например, заняться расхламлением). Придётся буквально подстраиваться под быстро меняющуюся обстановку и следовать за происходящим, не обдумывая долго и не погружаясь глубоко в события. Будет полезно научиться принимать решения быстро и при этом стратегически верно.\nТакой период нередко несёт изменения в самых разных сферах сразу: кризисные ситуации на работе, в отношениях, проблемы со здоровьем. Поэтому не стоит напрасно пускаться в авантюры, совершать рискованные поступки, излишне разбрасываясь временем и энергией. Хорошо начать здоровый образ жизни, отказаться от плохих привычек, следить за рационом.\nВажно не пытаться удерживать то, что уже стало лишним в вашей жизни, что не несет ничего нового, живительного, никакого движения. Это поможет впустить в жизнь свежую энергию и заложить основу для успешного будущего.\nВозможны ключевые события:\nПоложительные:\nПеремены в жизни, как правило, довольно кардинальные. В плане здоровья -хорошо прошедшая операция, избавление от серьезной болезни...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.382479Z",
                    "edited": "2022-02-05T09:51:40.536734Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "6",
                    "gender": "",
                    "type": "expandable",
                    "title": "56-57",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5062,
                    "content": "(14) Хороший период для познания себя, исследования своего глубинного внутреннего Я и тайников души. Нередко проявляется интерес к творчеству, искусству, красоте и тонким вещам. Могут возникнуть ситуации, которые помогут проявиться качествам характера, до этого не проявлявшимся. Особенно это касается смирения, терпеливости, способности принимать события и вещи такими, какие они есть. Часть из них будет просто не остановить и не изменить. Поэтому придётся взять на себя роль мудрого и смиренного наблюдателя, который отдаётся на волю своей судьбы. И это станет лучшим из возможных решений.\nНе проявляйте нетерпеливости: каждому событию своё время. Нельзя также жаловаться, жадничать или роптать на судьбу. Вам всё воздастся в свой определённый срок. Начните доверять хорошему течению жизни и благодарить её даже за мелочи.\nОтличный период для того, чтобы научиться быть в гармонии с собой. Займитесь делами, которые вам по душе или тем, о чём давно мечтали. Не бойтесь связанных с этим перемен. Вам будет дано именно столько, сколько нужно для спокойной, комфортной жизни и занятия хобби, творчеством, саморазвитием и т.д.\nПозаботиться захочется не только о душевном комфорте, но и о телесном. Полезно будет заняться своим питанием, очищением. Не исключено, что интерес появится в области натуральных средств, как травы, масла, минералы, вода. Используйте по максимуму возможности природных даров, но не переусердствуйте. В данный период важна умеренность во всём. Прислушивайтесь к сигналам организма. За что бы ни брались, доводите начатое до конца. Делайте упор на качество, а не количество. Уделяйте внимание и своим эмоциям, сглаживая острые углы и не позволяя накапливаться негативу.\nВозможны ключевые события:\nПоложительные:\nСтабильность в жизни и делах. Незначительный постепенный рост в карьере, бизнесе...Продолжение в платной версии\n\n(4) Мужчина в этот период должен максимально проявить свои мужские лидерские качества. Нужно развивать дисциплину, логичность, активность, реализовывать амбиции, мыслить стратегически, брать ответственность на себя и принимать решения. Основные события будут развиваться вокруг карьеры и социальной реализации. Обычно наблюдается повышение по службе или открытие собственного бизнеса, его развитие. Возможно участие в крупных проектах. Нередко этот период становится временем строительства, приобретения какой-либо недвижимости. В семье может появиться наследник мужского пола. Если родится девочка, то у неё будет мужской сильный характер.\nМужчине важно не конфликтовать с другими представителями своего пола. А особенно наладить отношения с отцом. Полезно поговорить по душам, простить друг другу прежние обиды и недопонимание. Даже если отец неправ, не стоит показывать свою значимость или самоутверждаться за его счёт. Гораздо полезнее будет потратить эту энергию для достижения успеха в работе.\nВозможны ключевые события:\nПоложительные:\nПризнание в обществе через получение высокой должности или какие-то другие достижения. Открытие своего дела или успешный рост существующего...Продолжение в платной версии\n\n(18) Период максимальной концентрации на личной жизни, саморазвитии, обустройстве дома. В это время усиливается эмоциональность, человек становится очень чувствительным. Важны люди, которые рядом, хорошие и гармоничные отношения. Полезно наводить порядок в доме и заниматься его благоустройством. Не менее важно уделить внимание своей подсознательной стороне личности. Развитие, возможность быть собой, способность прислушиваться к себе и действовать по своим желаниям - ключевые моменты при этом.\nНа данном этапе особую важность обретают взаимоотношения с матерью и женщинами рода. Важно наладить контакт и поддерживать хорошее общение. Ваша чуткость и эмпатия в этот период помогут буквально чувствовать непростой женский характер.\nОбразы, мысли становятся наиболее яркими и имеют силу воплощаться в реальность. Жить в такой период нужно максимально осознанно, выбирая то, о чём думаете. Легко можно реализовать планы и мечты благодаря способности позитивно мыслить. Но также могут сбыться негативные посылы и страхи.\nВозможны ключевые события:\nПоложительные:\nНовые приятные отношения, долгожданная беременность. В доме уют и покой, комфорт...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:36.297684Z",
                    "edited": "2022-02-05T09:51:42.258699Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "14",
                    "gender": "",
                    "type": "expandable",
                    "title": "57.5-58",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5070,
                    "content": "(18) Период максимальной концентрации на личной жизни, саморазвитии, обустройстве дома. В это время усиливается эмоциональность, человек становится очень чувствительным. Важны люди, которые рядом, хорошие и гармоничные отношения. Полезно наводить порядок в доме и заниматься его благоустройством. Не менее важно уделить внимание своей подсознательной стороне личности. Развитие, возможность быть собой, способность прислушиваться к себе и действовать по своим желаниям - ключевые моменты при этом.\nНа данном этапе особую важность обретают взаимоотношения с матерью и женщинами рода. Важно наладить контакт и поддерживать хорошее общение. Ваша чуткость и эмпатия в этот период помогут буквально чувствовать непростой женский характер.\nОбразы, мысли становятся наиболее яркими и имеют силу воплощаться в реальность. Жить в такой период нужно максимально осознанно, выбирая то, о чём думаете. Легко можно реализовать планы и мечты благодаря способности позитивно мыслить. Но также могут сбыться негативные посылы и страхи.\nВозможны ключевые события:\nПоложительные:\nНовые приятные отношения, долгожданная беременность. В доме уют и покой, комфорт...Продолжение в платной версии\n\n(5) Время знаменует собой максимальный фокус на семью и дела близких. Благоприятно для вступления в брак, рождения детей. Ваша помощь может потребоваться близким, возможно решение каких-то семейных дел, установление новых традиций в роду. При этом необходимо соблюдать баланс в отношениях и взаимодействии с родными. Не стоит слишком цепляться за родственников (старших, младших), живя их жизнью, ставя себя в положение жертвы или излишне опекая. Подросших детей придётся отпустить в самостоятельную жизнь. Со старшими в роду важно поддерживать здоровые уважительные отношения, оказывая внимание и заботу. Но проживать свою жизнь и действовать по своему разумению, в рамках сформированной системы внутренних ценностей.\nЭтот период характеризуется расстановкой приоритетов. Возможно, захочется навести порядок как буквально (в быту), так и в разных сферах жизни. Действуйте экологично, соблюдая порядок не только в доме, но и в эмоциональном плане, в мыслях. Старайтесь не опаздывать и вообще серьезнее относиться к ресурсам времени (своего и чужого), полезно соблюдать режим дня и систематизировать свою жизнь, разложив всё по полочкам.\nПолезным будет обучение, самосовершенствование как в личном, так и в профессиональном плане. Хорошо пройти курсы, получать новые знания и использовать их на практике. Важно не только копить знания, но и делиться ими.\nОсобенное внимание стоит уделить бумагам, официальным документам. Придётся следить за их правильным оформлением.\nВозможны ключевые события:\nПоложительные:\nДля молодых людей - обучение, получение документов, отделение от родителей и начало самостоятельной жизни. Возможно вступление в брак с подходящим партнёром, который крепко стоит на ногах...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:36.753497Z",
                    "edited": "2022-02-05T09:51:43.10518Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "18",
                    "gender": "",
                    "type": "expandable",
                    "title": "58.5-59",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5042,
                    "content": "(4) Мужчина в этот период должен максимально проявить свои мужские лидерские качества. Нужно развивать дисциплину, логичность, активность, реализовывать амбиции, мыслить стратегически, брать ответственность на себя и принимать решения. Основные события будут развиваться вокруг карьеры и социальной реализации. Обычно наблюдается повышение по службе или открытие собственного бизнеса, его развитие. Возможно участие в крупных проектах. Нередко этот период становится временем строительства, приобретения какой-либо недвижимости. В семье может появиться наследник мужского пола. Если родится девочка, то у неё будет мужской сильный характер.\nМужчине важно не конфликтовать с другими представителями своего пола. А особенно наладить отношения с отцом. Полезно поговорить по душам, простить друг другу прежние обиды и недопонимание. Даже если отец неправ, не стоит показывать свою значимость или самоутверждаться за его счёт. Гораздо полезнее будет потратить эту энергию для достижения успеха в работе.\nВозможны ключевые события:\nПоложительные:\nПризнание в обществе через получение высокой должности или какие-то другие достижения. Открытие своего дела или успешный рост существующего...Продолжение в платной версии\n\n(1) Период для самореализации через обучение, новые знания, самосовершенствование и свежие контакты, идеи, в том числе творческие. Можно выразить себя самыми разными способами, используя активную жизненную позицию. Инициатива, повышение своего уровня и передача знаний, расширение круга знакомых - станут ключами к успеху.\nВ это время хорошо получать основное/дополнительное образование, проходить курсы и тренинги. Деятельность мозга становится более приспособленной для восприятия информации, вы буквально готовы впитывать всё как губка.\nТакже хорошо проявлять коммуникативные навыки, больше появляться в обществе, заводить полезные знакомства и находить контакт с окружающими. Это будет полезно в будущем.\nХорошо раскрепоститься и позволить себе заниматься любимым делом. Важно верить в себя и раскрыть свой потенциал. Для самореализации в общественной жизни необходимо проработать свою самооценку и уверенность в себе.\nВозможны ключевые события:\nПоложительные:\nХорошее и стабильное финансовое положение. Полезные связи и знакомства...Продолжение в платной версии\n\n(5) Время знаменует собой максимальный фокус на семью и дела близких. Благоприятно для вступления в брак, рождения детей. Ваша помощь может потребоваться близким, возможно решение каких-то семейных дел, установление новых традиций в роду. При этом необходимо соблюдать баланс в отношениях и взаимодействии с родными. Не стоит слишком цепляться за родственников (старших, младших), живя их жизнью, ставя себя в положение жертвы или излишне опекая. Подросших детей придётся отпустить в самостоятельную жизнь. Со старшими в роду важно поддерживать здоровые уважительные отношения, оказывая внимание и заботу. Но проживать свою жизнь и действовать по своему разумению, в рамках сформированной системы внутренних ценностей.\nЭтот период характеризуется расстановкой приоритетов. Возможно, захочется навести порядок как буквально (в быту), так и в разных сферах жизни. Действуйте экологично, соблюдая порядок не только в доме, но и в эмоциональном плане, в мыслях. Старайтесь не опаздывать и вообще серьезнее относиться к ресурсам времени (своего и чужого), полезно соблюдать режим дня и систематизировать свою жизнь, разложив всё по полочкам.\nПолезным будет обучение, самосовершенствование как в личном, так и в профессиональном плане. Хорошо пройти курсы, получать новые знания и использовать их на практике. Важно не только копить знания, но и делиться ими.\nОсобенное внимание стоит уделить бумагам, официальным документам. Придётся следить за их правильным оформлением.\nВозможны ключевые события:\nПоложительные:\nДля молодых людей - обучение, получение документов, отделение от родителей и начало самостоятельной жизни. Возможно вступление в брак с подходящим партнёром, который крепко стоит на ногах...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.151642Z",
                    "edited": "2022-02-05T09:51:40.116503Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "4",
                    "gender": "",
                    "type": "expandable",
                    "title": "60",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5068,
                    "content": "(17) Отличное время для ярких и творческих особ со множеством увлечений и талантов. Даже если вы не любите бывать на публике, этот период станет возможностью сказать миру слово о себе, получить славу, признание популярность.\nВажно быть готовым к грядущим переменам. Хорошо сменить имидж, поработать с внешностью и самооценкой. Развивайте в себе таланты, харизму, природные данные. Чаще полезно бывать в общественных местах от шумных вечеринок до выставок. Вдохновение вы можете получить где угодно. Не исключено, что ваше хобби в данный период станет профессией и приятным способом получить не только известность, но и статус, комфорт, материальные блага. Используйте свои навыки, творчество, знания для этого.\nВажно развивать уверенность в себе, раскрыть свой внутренний мир людям. Публичные выступления, мероприятия, где вы будете в центре внимания - позволят добиться желаемого результата.\nВозможны ключевые события:\nПоложительные:\nЗанятие любимым делом, путешествия, творческий и духовный подъем, возможность зарабатывать, занимаясь искусством. Счастливые знаки судьбы и неожиданная важная помощь извне...Продолжение в платной версии\n\n(6) Период максимально направлен на отношения с окружающими, внешнюю красоту и внутреннюю гармонию. Важно поддерживать все сферы в балансе и идти за своими ощущениями, не действуя по указке или желаниям, интересам других.\nОбустраивайте пространство вокруг себя и уделяйте себе особое внимания, балуя и украшая. В такое время особенно чувствуется потребность в тактильности, в любви.\nХочется самому проявлять нежность, ласку и получать в ответ от других. Важно внимание, уход, забота. Человек в такой период склонен влюбляться, стремится найти свою половинку. А если она уже есть, то максимально фокусируется на близости с партнером, на качестве отношений. Если не хватает внимания и ласки от близкого человека, на этом фоне могут возникать обиды и недопонимание. Не стоит уходить в себя и замалчивать проблемы. Проявляйтесь сами и открыто говорите о том, чего хотите. Есть возможность планирования появления детей в семье.\nАктивно раскрываются коммуникативные способности, есть потребность быть в хороших отношениях с окружающими, нравиться всем. Остро хочется наконец-то выделить время для хобби, особенно творческих (от цветоводства до дизайна).\nПри непонимании с окружающими, а особенно близкими, старайтесь сгладить острые конфликты и идти на примирение первыми. Это скажется положительно, прежде всего, на вас.\nВозможны ключевые события:\nПоложительные:\nМного новых знакомств, общения и приятных контактов. Флирт и влюбленность, благополучные новые отношения, помолвка, свадьба...Продолжение в платной версии\n\n(5) Время знаменует собой максимальный фокус на семью и дела близких. Благоприятно для вступления в брак, рождения детей. Ваша помощь может потребоваться близким, возможно решение каких-то семейных дел, установление новых традиций в роду. При этом необходимо соблюдать баланс в отношениях и взаимодействии с родными. Не стоит слишком цепляться за родственников (старших, младших), живя их жизнью, ставя себя в положение жертвы или излишне опекая. Подросших детей придётся отпустить в самостоятельную жизнь. Со старшими в роду важно поддерживать здоровые уважительные отношения, оказывая внимание и заботу. Но проживать свою жизнь и действовать по своему разумению, в рамках сформированной системы внутренних ценностей.\nЭтот период характеризуется расстановкой приоритетов. Возможно, захочется навести порядок как буквально (в быту), так и в разных сферах жизни. Действуйте экологично, соблюдая порядок не только в доме, но и в эмоциональном плане, в мыслях. Старайтесь не опаздывать и вообще серьезнее относиться к ресурсам времени (своего и чужого), полезно соблюдать режим дня и систематизировать свою жизнь, разложив всё по полочкам.\nПолезным будет обучение, самосовершенствование как в личном, так и в профессиональном плане. Хорошо пройти курсы, получать новые знания и использовать их на практике. Важно не только копить знания, но и делиться ими.\nОсобенное внимание стоит уделить бумагам, официальным документам. Придётся следить за их правильным оформлением.\nВозможны ключевые события:\nПоложительные:\nДля молодых людей - обучение, получение документов, отделение от родителей и начало самостоятельной жизни. Возможно вступление в брак с подходящим партнёром, который крепко стоит на ногах...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:36.639939Z",
                    "edited": "2022-02-05T09:51:42.894171Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "17",
                    "gender": "",
                    "type": "expandable",
                    "title": "61-62",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5060,
                    "content": "(13) Период кардинальных перемен и резких поворотов в судьбе. Грядут события, после которых жизнь уже не станет прежней. Они могут быть как положительными, так и горькими (вплоть до смерти кого-то из близкого окружения). Важно принять их, какими бы они ни были. Придётся следовать за событиями и процессами, которые становятся совсем неожиданными, но необходимыми.\nВаша роль - принятие, готовность к переменам, непротивление, мудрость. Необходимо самостоятельно начать отпускать всё старое, ненужное и изжившее себя в это время от работы, отношений, которые уже не устраивают, до вещей (например, заняться расхламлением). Придётся буквально подстраиваться под быстро меняющуюся обстановку и следовать за происходящим, не обдумывая долго и не погружаясь глубоко в события. Будет полезно научиться принимать решения быстро и при этом стратегически верно.\nТакой период нередко несёт изменения в самых разных сферах сразу: кризисные ситуации на работе, в отношениях, проблемы со здоровьем. Поэтому не стоит напрасно пускаться в авантюры, совершать рискованные поступки, излишне разбрасываясь временем и энергией. Хорошо начать здоровый образ жизни, отказаться от плохих привычек, следить за рационом.\nВажно не пытаться удерживать то, что уже стало лишним в вашей жизни, что не несет ничего нового, живительного, никакого движения. Это поможет впустить в жизнь свежую энергию и заложить основу для успешного будущего.\nВозможны ключевые события:\nПоложительные:\nПеремены в жизни, как правило, довольно кардинальные. В плане здоровья -хорошо прошедшая операция, избавление от серьезной болезни...Продолжение в платной версии\n\n(5) Время знаменует собой максимальный фокус на семью и дела близких. Благоприятно для вступления в брак, рождения детей. Ваша помощь может потребоваться близким, возможно решение каких-то семейных дел, установление новых традиций в роду. При этом необходимо соблюдать баланс в отношениях и взаимодействии с родными. Не стоит слишком цепляться за родственников (старших, младших), живя их жизнью, ставя себя в положение жертвы или излишне опекая. Подросших детей придётся отпустить в самостоятельную жизнь. Со старшими в роду важно поддерживать здоровые уважительные отношения, оказывая внимание и заботу. Но проживать свою жизнь и действовать по своему разумению, в рамках сформированной системы внутренних ценностей.\nЭтот период характеризуется расстановкой приоритетов. Возможно, захочется навести порядок как буквально (в быту), так и в разных сферах жизни. Действуйте экологично, соблюдая порядок не только в доме, но и в эмоциональном плане, в мыслях. Старайтесь не опаздывать и вообще серьезнее относиться к ресурсам времени (своего и чужого), полезно соблюдать режим дня и систематизировать свою жизнь, разложив всё по полочкам.\nПолезным будет обучение, самосовершенствование как в личном, так и в профессиональном плане. Хорошо пройти курсы, получать новые знания и использовать их на практике. Важно не только копить знания, но и делиться ими.\nОсобенное внимание стоит уделить бумагам, официальным документам. Придётся следить за их правильным оформлением.\nВозможны ключевые события:\nПоложительные:\nДля молодых людей - обучение, получение документов, отделение от родителей и начало самостоятельной жизни. Возможно вступление в брак с подходящим партнёром, который крепко стоит на ногах...Продолжение в платной версии\n\n(18) Период максимальной концентрации на личной жизни, саморазвитии, обустройстве дома. В это время усиливается эмоциональность, человек становится очень чувствительным. Важны люди, которые рядом, хорошие и гармоничные отношения. Полезно наводить порядок в доме и заниматься его благоустройством. Не менее важно уделить внимание своей подсознательной стороне личности. Развитие, возможность быть собой, способность прислушиваться к себе и действовать по своим желаниям - ключевые моменты при этом.\nНа данном этапе особую важность обретают взаимоотношения с матерью и женщинами рода. Важно наладить контакт и поддерживать хорошее общение. Ваша чуткость и эмпатия в этот период помогут буквально чувствовать непростой женский характер.\nОбразы, мысли становятся наиболее яркими и имеют силу воплощаться в реальность. Жить в такой период нужно максимально осознанно, выбирая то, о чём думаете. Легко можно реализовать планы и мечты благодаря способности позитивно мыслить. Но также могут сбыться негативные посылы и страхи.\nВозможны ключевые события:\nПоложительные:\nНовые приятные отношения, долгожданная беременность. В доме уют и покой, комфорт...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:36.18288Z",
                    "edited": "2022-02-05T09:51:42.044623Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "13",
                    "gender": "",
                    "type": "expandable",
                    "title": "62.5-63",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5078,
                    "content": "(22) Период, несущий много динамизма с собой, придётся быть активным и действовать, даже если вы обычно жили довольно размеренно. Будет тянуть в путешествия, захочется перемены обстановки. Либо могут возникать такие ситуации, которые заставят двигаться. Путешествия, много общения принесут в жизнь свежий поток новых идей, знакомства с полезными и нужными людьми (возможно, новые отношения), нужную информацию, возможности и самореализацию. Важно не цепляться за мелочи, быт, материальное, уметь жить в потоке и наслаждаться состоянием здесь и сейчас. Могут появиться внезапные денежные поступления, большая прибыль.\nПри этом зацикленность на материальном, какие-то привязки могут принести сложности. Начаться может с бытовых проблем и поломок. Но если не изменить ничего в своей жизни, то деньги будут утекать, а неприятности расти, накатывая снежным комом. Как только заметите подобное - сразу в путь. Пусть это будет даже выезд на несколько часов на природу или в соседний город.\nПолезно будет настраивать себя позитивно, уметь замечать хорошее в мелочах, больше радоваться, быть свободным. Ощущение свободы должно быть и у вашего окружения (партнёра, детей, коллег). Нельзя давить, сковывать кого-то, важно принимать особенности, взгляды и позицию других. Уметь поставить себя на место другого человека.\nНе исключено, что придётся начать всё с нуля. Для успешного начинания важно иметь опору, стержень внутри себя и меньше зависеть ото всего внешнего.\nВозможны ключевые события:\nПоложительные:\nПриятные знакомства, лёгкие и интересные отношения. Ощущение свободы, удача в делах, хорошие шансы в жизни...Продолжение в платной версии\n\n(9) Время для глубокой внутренней проработки своей личности. Хорошо переосмыслить прошлый и настоящий опыт, задать себе правильные вопросы. Нередко люди в такой период усиленно занимаются поиском смысла жизни и себя в мире. Не стоит опираться на других людей и чужие умозаключения - все ответы уже есть внутри вас. Именно к себе, своему внутреннему голосу и стоит обратиться. Полезно больше времени проводить в одиночестве, на природе, заниматься йогой, читать книги по психологии, изучать законы Вселенной и построения взаимоотношений.\nЗанимайтесь творчеством и старайтесь выстроить доверительные, более глубокие отношения со спутником жизни, выходя на новый уровень. Ваша креативность, глубина, внутренний потенциал станут помощниками и в этом.\nПериод, когда многие пересматривают свой жизненный уровень, положение в обществе, доходы. Не исключено, что многое захочется скорректировать. Главное быть во всем умеренным, не делать резких или необдуманных шагов. В погоне за благосостоянием не экономьте на себе и тем более на здоровье. Вам необходим качественный уровень жизни.\nВозможны ключевые события:\nПоложительные:\nОтдых от трудов и уединённое состояние, возможно посещение особых сакральных мест, мест силы или святых мест. Духовный рост, творческое развитие личности обретение себя через обучение или обретение наставника...Продолжение в платной версии\n\n(4) Мужчина в этот период должен максимально проявить свои мужские лидерские качества. Нужно развивать дисциплину, логичность, активность, реализовывать амбиции, мыслить стратегически, брать ответственность на себя и принимать решения. Основные события будут развиваться вокруг карьеры и социальной реализации. Обычно наблюдается повышение по службе или открытие собственного бизнеса, его развитие. Возможно участие в крупных проектах. Нередко этот период становится временем строительства, приобретения какой-либо недвижимости. В семье может появиться наследник мужского пола. Если родится девочка, то у неё будет мужской сильный характер.\nМужчине важно не конфликтовать с другими представителями своего пола. А особенно наладить отношения с отцом. Полезно поговорить по душам, простить друг другу прежние обиды и недопонимание. Даже если отец неправ, не стоит показывать свою значимость или самоутверждаться за его счёт. Гораздо полезнее будет потратить эту энергию для достижения успеха в работе.\nВозможны ключевые события:\nПоложительные:\nПризнание в обществе через получение высокой должности или какие-то другие достижения. Открытие своего дела или успешный рост существующего...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:37.208376Z",
                    "edited": "2022-02-05T09:51:43.9592Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "22",
                    "gender": "",
                    "type": "expandable",
                    "title": "63.5-64",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5052,
                    "content": "(9) Время для глубокой внутренней проработки своей личности. Хорошо переосмыслить прошлый и настоящий опыт, задать себе правильные вопросы. Нередко люди в такой период усиленно занимаются поиском смысла жизни и себя в мире. Не стоит опираться на других людей и чужие умозаключения - все ответы уже есть внутри вас. Именно к себе, своему внутреннему голосу и стоит обратиться. Полезно больше времени проводить в одиночестве, на природе, заниматься йогой, читать книги по психологии, изучать законы Вселенной и построения взаимоотношений.\nЗанимайтесь творчеством и старайтесь выстроить доверительные, более глубокие отношения со спутником жизни, выходя на новый уровень. Ваша креативность, глубина, внутренний потенциал станут помощниками и в этом.\nПериод, когда многие пересматривают свой жизненный уровень, положение в обществе, доходы. Не исключено, что многое захочется скорректировать. Главное быть во всем умеренным, не делать резких или необдуманных шагов. В погоне за благосостоянием не экономьте на себе и тем более на здоровье. Вам необходим качественный уровень жизни.\nВозможны ключевые события:\nПоложительные:\nОтдых от трудов и уединённое состояние, возможно посещение особых сакральных мест, мест силы или святых мест. Духовный рост, творческое развитие личности обретение себя через обучение или обретение наставника...Продолжение в платной версии\n\n(4) Мужчина в этот период должен максимально проявить свои мужские лидерские качества. Нужно развивать дисциплину, логичность, активность, реализовывать амбиции, мыслить стратегически, брать ответственность на себя и принимать решения. Основные события будут развиваться вокруг карьеры и социальной реализации. Обычно наблюдается повышение по службе или открытие собственного бизнеса, его развитие. Возможно участие в крупных проектах. Нередко этот период становится временем строительства, приобретения какой-либо недвижимости. В семье может появиться наследник мужского пола. Если родится девочка, то у неё будет мужской сильный характер.\nМужчине важно не конфликтовать с другими представителями своего пола. А особенно наладить отношения с отцом. Полезно поговорить по душам, простить друг другу прежние обиды и недопонимание. Даже если отец неправ, не стоит показывать свою значимость или самоутверждаться за его счёт. Гораздо полезнее будет потратить эту энергию для достижения успеха в работе.\nВозможны ключевые события:\nПоложительные:\nПризнание в обществе через получение высокой должности или какие-то другие достижения. Открытие своего дела или успешный рост существующего...Продолжение в платной версии\n\n(13) Период кардинальных перемен и резких поворотов в судьбе. Грядут события, после которых жизнь уже не станет прежней. Они могут быть как положительными, так и горькими (вплоть до смерти кого-то из близкого окружения). Важно принять их, какими бы они ни были. Придётся следовать за событиями и процессами, которые становятся совсем неожиданными, но необходимыми.\nВаша роль - принятие, готовность к переменам, непротивление, мудрость. Необходимо самостоятельно начать отпускать всё старое, ненужное и изжившее себя в это время от работы, отношений, которые уже не устраивают, до вещей (например, заняться расхламлением). Придётся буквально подстраиваться под быстро меняющуюся обстановку и следовать за происходящим, не обдумывая долго и не погружаясь глубоко в события. Будет полезно научиться принимать решения быстро и при этом стратегически верно.\nТакой период нередко несёт изменения в самых разных сферах сразу: кризисные ситуации на работе, в отношениях, проблемы со здоровьем. Поэтому не стоит напрасно пускаться в авантюры, совершать рискованные поступки, излишне разбрасываясь временем и энергией. Хорошо начать здоровый образ жизни, отказаться от плохих привычек, следить за рационом.\nВажно не пытаться удерживать то, что уже стало лишним в вашей жизни, что не несет ничего нового, живительного, никакого движения. Это поможет впустить в жизнь свежую энергию и заложить основу для успешного будущего.\nВозможны ключевые события:\nПоложительные:\nПеремены в жизни, как правило, довольно кардинальные. В плане здоровья -хорошо прошедшая операция, избавление от серьезной болезни...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.727198Z",
                    "edited": "2022-02-05T09:51:41.175801Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "9",
                    "gender": "",
                    "type": "expandable",
                    "title": "65",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5044,
                    "content": "(5) Время знаменует собой максимальный фокус на семью и дела близких. Благоприятно для вступления в брак, рождения детей. Ваша помощь может потребоваться близким, возможно решение каких-то семейных дел, установление новых традиций в роду. При этом необходимо соблюдать баланс в отношениях и взаимодействии с родными. Не стоит слишком цепляться за родственников (старших, младших), живя их жизнью, ставя себя в положение жертвы или излишне опекая. Подросших детей придётся отпустить в самостоятельную жизнь. Со старшими в роду важно поддерживать здоровые уважительные отношения, оказывая внимание и заботу. Но проживать свою жизнь и действовать по своему разумению, в рамках сформированной системы внутренних ценностей.\nЭтот период характеризуется расстановкой приоритетов. Возможно, захочется навести порядок как буквально (в быту), так и в разных сферах жизни. Действуйте экологично, соблюдая порядок не только в доме, но и в эмоциональном плане, в мыслях. Старайтесь не опаздывать и вообще серьезнее относиться к ресурсам времени (своего и чужого), полезно соблюдать режим дня и систематизировать свою жизнь, разложив всё по полочкам.\nПолезным будет обучение, самосовершенствование как в личном, так и в профессиональном плане. Хорошо пройти курсы, получать новые знания и использовать их на практике. Важно не только копить знания, но и делиться ими.\nОсобенное внимание стоит уделить бумагам, официальным документам. Придётся следить за их правильным оформлением.\nВозможны ключевые события:\nПоложительные:\nДля молодых людей - обучение, получение документов, отделение от родителей и начало самостоятельной жизни. Возможно вступление в брак с подходящим партнёром, который крепко стоит на ногах...Продолжение в платной версии\n\n(11) Время роста и успеха, но в то же время и больших энергозатрат. Можно преуспеть в карьере и обществе вплоть до сильного влияния на большое количество людей, создания новых направлений. Период позитивный и дарящий много отдачи при разумном использовании своей силы. Именно сейчас важно привести себя в форму, научиться эффективно работать, а не перегружаться. Хорошо нормализовать своей режим дня, регулярно заниматься спортом, чаще бывать на свежем воздухе. Отводите время и на увлечения, выделяя этому свободное время. Так ваша работоспособность будет гораздо выше, нежели если вы будете бросаться от одного проекта к другому, взваливать на себя всё разом, постоянно создавать кипучую деятельность и задерживаться на работе.\nНе пожалейте время на профилактику хронических заболеваний и плановый медосмотр, чтобы не упустить важное. В противном случае сопутствующий такому периоду трудоголизм может довести до полного физического и нервного истощения.\nВозможны ключевые события:\nПоложительные:\nПериод прохождения испытания на выносливость, максимальное напряжение сил с отдачей в спорт, работу, бизнес, какую-либо плодотворную деятельность. Ситуация в ваших руках, и вы получаете повышение, признание...Продолжение в платной версии\n\n(16) На данном этапе человек теряет самое ценное для него. Обычно это касается достижений материального мира: близкий человек, отношения, деньги, могущество, власть, работа. Чем сильнее человек цепляется за какую-то материальную сферу жизни, тем вероятнее в ней потеря. Это кризис даётся человеку, чтобы он изменил свои взгляды, очнулся от бега по кругу и начал жить иначе. Предстоит непростой период становления, пробуждения духовно из-за неприятных перемен.\nПридётся отказаться ото всего прежнего: образа жизни, привычек, мировоззрения - переосмыслить личные ценности. Помогут различные глубокие учения и знания об устройстве мира от психологии до астрологии. На пути познания себя и мира хорошо делать то, чем раньше не занимались, ввести некие ограничения, осмысленные и доступные аскезы (в еде, удовольствиях, например).\nПолезно также экспериментировать и начинать новое от путешествий до знакомств, хобби. Лучше всего поменять всю среду и выйти из зоны комфорта, как бы неприятно и неожиданно это ни было. Если что-то при этом не удаётся, не стоит переживать. Времени начать новый цикл жизни будет достаточно. Важно проработать свои амбиции и неумеренное эго, которое для будущего будет только во вред.\nВозможны ключевые события:\nПоложительные:\nХорошее положение в делах, развитие бизнеса, закладывание фундамента собственного дела. Резкие перемены, реорганизация устройства быта, жизни или на уровне работы, общественных связей...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.265077Z",
                    "edited": "2022-02-05T09:51:40.325805Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "5",
                    "gender": "",
                    "type": "expandable",
                    "title": "66-67",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5062,
                    "content": "(14) Хороший период для познания себя, исследования своего глубинного внутреннего Я и тайников души. Нередко проявляется интерес к творчеству, искусству, красоте и тонким вещам. Могут возникнуть ситуации, которые помогут проявиться качествам характера, до этого не проявлявшимся. Особенно это касается смирения, терпеливости, способности принимать события и вещи такими, какие они есть. Часть из них будет просто не остановить и не изменить. Поэтому придётся взять на себя роль мудрого и смиренного наблюдателя, который отдаётся на волю своей судьбы. И это станет лучшим из возможных решений.\nНе проявляйте нетерпеливости: каждому событию своё время. Нельзя также жаловаться, жадничать или роптать на судьбу. Вам всё воздастся в свой определённый срок. Начните доверять хорошему течению жизни и благодарить её даже за мелочи.\nОтличный период для того, чтобы научиться быть в гармонии с собой. Займитесь делами, которые вам по душе или тем, о чём давно мечтали. Не бойтесь связанных с этим перемен. Вам будет дано именно столько, сколько нужно для спокойной, комфортной жизни и занятия хобби, творчеством, саморазвитием и т.д.\nПозаботиться захочется не только о душевном комфорте, но и о телесном. Полезно будет заняться своим питанием, очищением. Не исключено, что интерес появится в области натуральных средств, как травы, масла, минералы, вода. Используйте по максимуму возможности природных даров, но не переусердствуйте. В данный период важна умеренность во всём. Прислушивайтесь к сигналам организма. За что бы ни брались, доводите начатое до конца. Делайте упор на качество, а не количество. Уделяйте внимание и своим эмоциям, сглаживая острые углы и не позволяя накапливаться негативу.\nВозможны ключевые события:\nПоложительные:\nСтабильность в жизни и делах. Незначительный постепенный рост в карьере, бизнесе...Продолжение в платной версии\n\n(7) Особенность периода – это активное движение и новые возможности. Следует откликаться на все шансы и быть максимально мобильным. Это отличный этап для переездов и всего, что связано со сферой смены жилья. Хорошо просто путешествовать или отправляться в деловые командировки. Это даст новые полезные знакомства, вы обрастёте кругом единомышленников и новых друзей. Также возможно движение по карьерной лестнице, творческий и рабочий рост.\nХорошо не упускать все возможности проявить себя. Но еще более полезно будет наметить конкретную цель, выработать план и двигаться по нему.\nБудет возможность для открытия или долгожданного расширения бизнеса. Если есть сомнения, то стоит опереться на помощников и не бояться впускать в процесс как можно больше людей. Это именно то время, когда главными окажутся коллективные усилия. Вам с успехом удастся выполнять самые разные проекты и руководить коллективом.\nВозможны ключевые события:\nПоложительные:\nХорошие новости и предложения, новые идеи и возможности. Плодотворные поездки, движение по карьере, расширение своего дела...Продолжение в платной версии\n\n(21) Идеальное время для путешествий и работы, связанной с переездами, командировками. Хорошо посещать новые места, города и даже другие страны, знакомиться с иностранцами, изучать новые языки, незнакомую культуру, расширяя свой кругозор и снимая собственные рамки, расширяя границы сознания.\nВообще в этот период будет много движения, всё будет способствовать тому, чтобы перемены и активность были максимально лёгкими и удачными.\nМожно реализовать себя, если быть активным. Достигнуть того, о чём давно и много мечталось. Хорошо открывать новые проекты, выходя на иной уровень жизни. Новые контакты и полезные связи помогут в продвижении, достижении успеха. Особенно во всех сферах, связанных со СМИ, социальными сетями, массовыми коммуникациями.\nПривести в гармоничное состояние удастся все области жизни. Вы будете испытывать удовлетворение, целостность жизни и личности. Гармония с миром и собой поможет достигнуть большего, так как не нужно отвлекаться на решение проблем. Более того, человек в такой период будет делиться своей внутренней гармонией и выступать в качестве миротворца. Но если нет внутренней целостности и гармонии, если человек агрессивно настроен к миру, традициям, устройству общества, хочет получить насилием всё и сразу, жизнь наказывает такое.\nВ этот год нужно быть осторожнее с финансами. Не давать в долг и не брать взаймы, иначе расплатиться потом будет очень сложно.\nВозможны ключевые события:\nПоложительные:\nИзучение иностранного языка, путешествия, новая работа или дела, связанные с контактами заграницей. Новые знакомства, отношения с иностранцами...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:36.297684Z",
                    "edited": "2022-02-05T09:51:42.258699Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "14",
                    "gender": "",
                    "type": "expandable",
                    "title": "67.5-68",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5072,
                    "content": "(19) В такое время человек может испытывать эмоциональный подъем, хочется наслаждаться простыми радостями, баловать своего внутреннего ребёнка или добрать то, чего не доставало в детстве. Хорошо идут контакты с детьми (в том числе в рабочей сфере). Отличный период, чтобы выстроить отношения с братьями или сёстрами, если они долгое время не были близкими.\nМожно позволить себе расслабиться и плыть по течению жизни, так как в самых разных сферах всё будет складываться само собой. Но это сработает только, когда человек не одержим некой идеей, не зациклен на чём либо (работа, деньги, отношения). Если в голове навязчивая мысль, например, выйти замуж во что бы то ни стало, навязчивый поиск отношений, маниакальная страсть к деньгам/власти, то это может привести к усложнению ситуации. Либо появляются болезни, зажимы на уровне психосоматики, либо серьезные проблемы, так что человек оказывается обездвиженным.\nЧтобы период стал изобильным и максимально благополучным, стоит чаще благодарить жизнь за то, что она даёт. Не проявлять чрезмерного контроля в работе и отношениях, дать больше свободы детям. Энергию нужно распределять плавно на самые разные дела и сферы жизни, уделяя времени понемногу самым разным делам. Тогда они будут идти легко.\nСамое важное в это время - простить себя и проработать чувство вины. Иначе оно будет съедать всю энергию, выжигать изнутри. А в жизни вновь и вновь будут приходить повторяющие ситуации, когда человека унижают, каким-то образом наказывают.\nВозможны ключевые события:\nПоложительные:\nСчастливые события в работе и семейной жизни, ощущение целостности бытия, наслаждение и радость каждый день. Налаживание отношений с братьями/сёстрами, с отцом, семейные праздники...Продолжение в платной версии\n\n(10) Время принимать дары судьбы и почувствовать себя настоящим счастливчиком. В жизни могут произойти самые важные и приятные события от выигрыша в лотерею до крупной прибыли, удачи в деле, которое давно планировалось. Реализация мечты, судьбоносная встреча и счастливые отношения. Всё будет способствовать самым приятным переменам. Вы словно попали в свой поток и двигаетесь по течению, получая бонусы и при этом не прикладывая особенных усилий. Находятся средства, открываются все двери, а на жизненном пути попадаются именно нужные люди.\nВажно быть открытым этому потоку и новым возможностям, нести позитивное отношение к жизни, благодарить каждый новый день. Относитесь к событиям легко, ловите знаки судьбы и не бойтесь загадывать желания. Перестаньте всё излишне контролировать и просто получайте удовольствие от того, что происходит вокруг. Доверьтесь переменам и жизни, которые точно \"знают\", как лучше для вас.\nВ этот период особое внимание стоит уделить коммуникациям, общественным связям, друзьям и коллегам. Именно среди них можно встретить свою половинку или получить возможности, информацию для дальнейшего роста.\nЗастой в любых сферах вредит, так же как и излишнее самокопание, сомнения, подозрительность. Ведите максимально активный образ жизни: работайте и творите, путешествуйте и бывайте в людных местах. Не бойтесь проявлять себя.\nВозможны ключевые события:\nПоложительные:\nПоток удачи и денег, резкие перемены к лучшему, шанс от судьбы. Выигрыш в лотерею, повышение по работе или новая очень привлекательная должность...Продолжение в платной версии\n\n(11) Время роста и успеха, но в то же время и больших энергозатрат. Можно преуспеть в карьере и обществе вплоть до сильного влияния на большое количество людей, создания новых направлений. Период позитивный и дарящий много отдачи при разумном использовании своей силы. Именно сейчас важно привести себя в форму, научиться эффективно работать, а не перегружаться. Хорошо нормализовать своей режим дня, регулярно заниматься спортом, чаще бывать на свежем воздухе. Отводите время и на увлечения, выделяя этому свободное время. Так ваша работоспособность будет гораздо выше, нежели если вы будете бросаться от одного проекта к другому, взваливать на себя всё разом, постоянно создавать кипучую деятельность и задерживаться на работе.\nНе пожалейте время на профилактику хронических заболеваний и плановый медосмотр, чтобы не упустить важное. В противном случае сопутствующий такому периоду трудоголизм может довести до полного физического и нервного истощения.\nВозможны ключевые события:\nПоложительные:\nПериод прохождения испытания на выносливость, максимальное напряжение сил с отдачей в спорт, работу, бизнес, какую-либо плодотворную деятельность. Ситуация в ваших руках, и вы получаете повышение, признание...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:36.868591Z",
                    "edited": "2022-02-05T09:51:43.316418Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "19",
                    "gender": "",
                    "type": "expandable",
                    "title": "68.5-69",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5036,
                    "content": "(3) Период, когда вы смело можете пожинать плоды своей деятельности во всех сферах жизни. Нередко следует продвижение по карьере. При этом может предстоять непростой выбор между интересами семьи и вашей социальной реализацией.\nУ семейных мужчин возможно рождение дочери. Если в этот период появится на свет мальчик, то он будет отличаться мягким складом характера.\nСвободный мужчина вероятнее всего встретит будущую супругу или ту, с которой сложатся серьезные прочные отношения. Такая партнерша сильно повлияет на вашу жизнь в будущем.\nВажно уделять достаточно внимания и заботы женщинам рода, прорабатывая свои мужские качества. Если есть обиды, недопонимания с родственницами, важно найти контакт с ними и наладить отношения.\nВозможны ключевые события:\nПоложительные:\nПродвижение дел, успех в бизнесе, начало новых амбициозных (и особенно творческих) проектов. Бизнес приносит прибыль, успех сопутствует не только в делах, но и в личной жизни...Продолжение в платной версии\n\n(5) Время знаменует собой максимальный фокус на семью и дела близких. Благоприятно для вступления в брак, рождения детей. Ваша помощь может потребоваться близким, возможно решение каких-то семейных дел, установление новых традиций в роду. При этом необходимо соблюдать баланс в отношениях и взаимодействии с родными. Не стоит слишком цепляться за родственников (старших, младших), живя их жизнью, ставя себя в положение жертвы или излишне опекая. Подросших детей придётся отпустить в самостоятельную жизнь. Со старшими в роду важно поддерживать здоровые уважительные отношения, оказывая внимание и заботу. Но проживать свою жизнь и действовать по своему разумению, в рамках сформированной системы внутренних ценностей.\nЭтот период характеризуется расстановкой приоритетов. Возможно, захочется навести порядок как буквально (в быту), так и в разных сферах жизни. Действуйте экологично, соблюдая порядок не только в доме, но и в эмоциональном плане, в мыслях. Старайтесь не опаздывать и вообще серьезнее относиться к ресурсам времени (своего и чужого), полезно соблюдать режим дня и систематизировать свою жизнь, разложив всё по полочкам.\nПолезным будет обучение, самосовершенствование как в личном, так и в профессиональном плане. Хорошо пройти курсы, получать новые знания и использовать их на практике. Важно не только копить знания, но и делиться ими.\nОсобенное внимание стоит уделить бумагам, официальным документам. Придётся следить за их правильным оформлением.\nВозможны ключевые события:\nПоложительные:\nДля молодых людей - обучение, получение документов, отделение от родителей и начало самостоятельной жизни. Возможно вступление в брак с подходящим партнёром, который крепко стоит на ногах...Продолжение в платной версии\n\n(8) Спокойный и относительно стабильный период, который многие склонны воспринимать как время застоя. На самом деле, в нём закладываются все возможные плоды для дальнейшего развития важных сфер жизни: от личной до карьеры и реализации в обществе. Важно осмыслить своё прошлое и настоящее на предмет, чего вы достигли и к чему хотели бы прийти, каковы ваши возможности и насколько вы себя реализуете в работе, творчестве.\nТакже придётся проработать отношения с партнёром. Подумайте, насколько вы счастливы и реализованы в отношениях, доставляют ли они радость; если есть проблемы, то в чём они. Нередко в эти периоды люди прибегают к совету профессиональных психологов, так как в застаревших проблемах или в себе самом сложно разобраться.\nНеобыкновенное время для действия, проявления кармических законов и воздействия судьбы. Не стоит пенят на жизнь, искать справедливость (по вашим понятиям и законам). Зато полезно поступать с другими, как хотели бы, чтобы обращались с вами. Старайтесь проявлять миролюбие, легкое отношение к жизни, при этом работая над своим характером, постигая жизненные законы.\nОбратите внимание на порядок в делах и документах, отдайте все долги, в какой бы форме они ни были (обязательства, налоги, кредиты, помощь в ответ на оказанную вам).\nВозможны ключевые события:\nПоложительные:\nОбучение и сдача экзаменов, получение диплома. Обращение в госструктуры, суды с успешным разрешением дел в вашу пользу...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:34.806838Z",
                    "edited": "2022-02-05T09:51:39.695678Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "3",
                    "gender": "",
                    "type": "expandable",
                    "title": "70",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5066,
                    "content": "(16) На данном этапе человек теряет самое ценное для него. Обычно это касается достижений материального мира: близкий человек, отношения, деньги, могущество, власть, работа. Чем сильнее человек цепляется за какую-то материальную сферу жизни, тем вероятнее в ней потеря. Это кризис даётся человеку, чтобы он изменил свои взгляды, очнулся от бега по кругу и начал жить иначе. Предстоит непростой период становления, пробуждения духовно из-за неприятных перемен.\nПридётся отказаться ото всего прежнего: образа жизни, привычек, мировоззрения - переосмыслить личные ценности. Помогут различные глубокие учения и знания об устройстве мира от психологии до астрологии. На пути познания себя и мира хорошо делать то, чем раньше не занимались, ввести некие ограничения, осмысленные и доступные аскезы (в еде, удовольствиях, например).\nПолезно также экспериментировать и начинать новое от путешествий до знакомств, хобби. Лучше всего поменять всю среду и выйти из зоны комфорта, как бы неприятно и неожиданно это ни было. Если что-то при этом не удаётся, не стоит переживать. Времени начать новый цикл жизни будет достаточно. Важно проработать свои амбиции и неумеренное эго, которое для будущего будет только во вред.\nВозможны ключевые события:\nПоложительные:\nХорошее положение в делах, развитие бизнеса, закладывание фундамента собственного дела. Резкие перемены, реорганизация устройства быта, жизни или на уровне работы, общественных связей...Продолжение в платной версии\n\n(11) Время роста и успеха, но в то же время и больших энергозатрат. Можно преуспеть в карьере и обществе вплоть до сильного влияния на большое количество людей, создания новых направлений. Период позитивный и дарящий много отдачи при разумном использовании своей силы. Именно сейчас важно привести себя в форму, научиться эффективно работать, а не перегружаться. Хорошо нормализовать своей режим дня, регулярно заниматься спортом, чаще бывать на свежем воздухе. Отводите время и на увлечения, выделяя этому свободное время. Так ваша работоспособность будет гораздо выше, нежели если вы будете бросаться от одного проекта к другому, взваливать на себя всё разом, постоянно создавать кипучую деятельность и задерживаться на работе.\nНе пожалейте время на профилактику хронических заболеваний и плановый медосмотр, чтобы не упустить важное. В противном случае сопутствующий такому периоду трудоголизм может довести до полного физического и нервного истощения.\nВозможны ключевые события:\nПоложительные:\nПериод прохождения испытания на выносливость, максимальное напряжение сил с отдачей в спорт, работу, бизнес, какую-либо плодотворную деятельность. Ситуация в ваших руках, и вы получаете повышение, признание...Продолжение в платной версии\n\n(9) Время для глубокой внутренней проработки своей личности. Хорошо переосмыслить прошлый и настоящий опыт, задать себе правильные вопросы. Нередко люди в такой период усиленно занимаются поиском смысла жизни и себя в мире. Не стоит опираться на других людей и чужие умозаключения - все ответы уже есть внутри вас. Именно к себе, своему внутреннему голосу и стоит обратиться. Полезно больше времени проводить в одиночестве, на природе, заниматься йогой, читать книги по психологии, изучать законы Вселенной и построения взаимоотношений.\nЗанимайтесь творчеством и старайтесь выстроить доверительные, более глубокие отношения со спутником жизни, выходя на новый уровень. Ваша креативность, глубина, внутренний потенциал станут помощниками и в этом.\nПериод, когда многие пересматривают свой жизненный уровень, положение в обществе, доходы. Не исключено, что многое захочется скорректировать. Главное быть во всем умеренным, не делать резких или необдуманных шагов. В погоне за благосостоянием не экономьте на себе и тем более на здоровье. Вам необходим качественный уровень жизни.\nВозможны ключевые события:\nПоложительные:\nОтдых от трудов и уединённое состояние, возможно посещение особых сакральных мест, мест силы или святых мест. Духовный рост, творческое развитие личности обретение себя через обучение или обретение наставника...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:36.526066Z",
                    "edited": "2022-02-05T09:51:42.681754Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "16",
                    "gender": "",
                    "type": "expandable",
                    "title": "71-72",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5056,
                    "content": "(11) Время роста и успеха, но в то же время и больших энергозатрат. Можно преуспеть в карьере и обществе вплоть до сильного влияния на большое количество людей, создания новых направлений. Период позитивный и дарящий много отдачи при разумном использовании своей силы. Именно сейчас важно привести себя в форму, научиться эффективно работать, а не перегружаться. Хорошо нормализовать своей режим дня, регулярно заниматься спортом, чаще бывать на свежем воздухе. Отводите время и на увлечения, выделяя этому свободное время. Так ваша работоспособность будет гораздо выше, нежели если вы будете бросаться от одного проекта к другому, взваливать на себя всё разом, постоянно создавать кипучую деятельность и задерживаться на работе.\nНе пожалейте время на профилактику хронических заболеваний и плановый медосмотр, чтобы не упустить важное. В противном случае сопутствующий такому периоду трудоголизм может довести до полного физического и нервного истощения.\nВозможны ключевые события:\nПоложительные:\nПериод прохождения испытания на выносливость, максимальное напряжение сил с отдачей в спорт, работу, бизнес, какую-либо плодотворную деятельность. Ситуация в ваших руках, и вы получаете повышение, признание...Продолжение в платной версии\n\n(8) Спокойный и относительно стабильный период, который многие склонны воспринимать как время застоя. На самом деле, в нём закладываются все возможные плоды для дальнейшего развития важных сфер жизни: от личной до карьеры и реализации в обществе. Важно осмыслить своё прошлое и настоящее на предмет, чего вы достигли и к чему хотели бы прийти, каковы ваши возможности и насколько вы себя реализуете в работе, творчестве.\nТакже придётся проработать отношения с партнёром. Подумайте, насколько вы счастливы и реализованы в отношениях, доставляют ли они радость; если есть проблемы, то в чём они. Нередко в эти периоды люди прибегают к совету профессиональных психологов, так как в застаревших проблемах или в себе самом сложно разобраться.\nНеобыкновенное время для действия, проявления кармических законов и воздействия судьбы. Не стоит пенят на жизнь, искать справедливость (по вашим понятиям и законам). Зато полезно поступать с другими, как хотели бы, чтобы обращались с вами. Старайтесь проявлять миролюбие, легкое отношение к жизни, при этом работая над своим характером, постигая жизненные законы.\nОбратите внимание на порядок в делах и документах, отдайте все долги, в какой бы форме они ни были (обязательства, налоги, кредиты, помощь в ответ на оказанную вам).\nВозможны ключевые события:\nПоложительные:\nОбучение и сдача экзаменов, получение диплома. Обращение в госструктуры, суды с успешным разрешением дел в вашу пользу...Продолжение в платной версии\n\n(19) В такое время человек может испытывать эмоциональный подъем, хочется наслаждаться простыми радостями, баловать своего внутреннего ребёнка или добрать то, чего не доставало в детстве. Хорошо идут контакты с детьми (в том числе в рабочей сфере). Отличный период, чтобы выстроить отношения с братьями или сёстрами, если они долгое время не были близкими.\nМожно позволить себе расслабиться и плыть по течению жизни, так как в самых разных сферах всё будет складываться само собой. Но это сработает только, когда человек не одержим некой идеей, не зациклен на чём либо (работа, деньги, отношения). Если в голове навязчивая мысль, например, выйти замуж во что бы то ни стало, навязчивый поиск отношений, маниакальная страсть к деньгам/власти, то это может привести к усложнению ситуации. Либо появляются болезни, зажимы на уровне психосоматики, либо серьезные проблемы, так что человек оказывается обездвиженным.\nЧтобы период стал изобильным и максимально благополучным, стоит чаще благодарить жизнь за то, что она даёт. Не проявлять чрезмерного контроля в работе и отношениях, дать больше свободы детям. Энергию нужно распределять плавно на самые разные дела и сферы жизни, уделяя времени понемногу самым разным делам. Тогда они будут идти легко.\nСамое важное в это время - простить себя и проработать чувство вины. Иначе оно будет съедать всю энергию, выжигать изнутри. А в жизни вновь и вновь будут приходить повторяющие ситуации, когда человека унижают, каким-то образом наказывают.\nВозможны ключевые события:\nПоложительные:\nСчастливые события в работе и семейной жизни, ощущение целостности бытия, наслаждение и радость каждый день. Налаживание отношений с братьями/сёстрами, с отцом, семейные праздники...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.955788Z",
                    "edited": "2022-02-05T09:51:41.614405Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "11",
                    "gender": "",
                    "type": "expandable",
                    "title": "72.5-73",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5068,
                    "content": "(17) Отличное время для ярких и творческих особ со множеством увлечений и талантов. Даже если вы не любите бывать на публике, этот период станет возможностью сказать миру слово о себе, получить славу, признание популярность.\nВажно быть готовым к грядущим переменам. Хорошо сменить имидж, поработать с внешностью и самооценкой. Развивайте в себе таланты, харизму, природные данные. Чаще полезно бывать в общественных местах от шумных вечеринок до выставок. Вдохновение вы можете получить где угодно. Не исключено, что ваше хобби в данный период станет профессией и приятным способом получить не только известность, но и статус, комфорт, материальные блага. Используйте свои навыки, творчество, знания для этого.\nВажно развивать уверенность в себе, раскрыть свой внутренний мир людям. Публичные выступления, мероприятия, где вы будете в центре внимания - позволят добиться желаемого результата.\nВозможны ключевые события:\nПоложительные:\nЗанятие любимым делом, путешествия, творческий и духовный подъем, возможность зарабатывать, занимаясь искусством. Счастливые знаки судьбы и неожиданная важная помощь извне...Продолжение в платной версии\n\n(13) Период кардинальных перемен и резких поворотов в судьбе. Грядут события, после которых жизнь уже не станет прежней. Они могут быть как положительными, так и горькими (вплоть до смерти кого-то из близкого окружения). Важно принять их, какими бы они ни были. Придётся следовать за событиями и процессами, которые становятся совсем неожиданными, но необходимыми.\nВаша роль - принятие, готовность к переменам, непротивление, мудрость. Необходимо самостоятельно начать отпускать всё старое, ненужное и изжившее себя в это время от работы, отношений, которые уже не устраивают, до вещей (например, заняться расхламлением). Придётся буквально подстраиваться под быстро меняющуюся обстановку и следовать за происходящим, не обдумывая долго и не погружаясь глубоко в события. Будет полезно научиться принимать решения быстро и при этом стратегически верно.\nТакой период нередко несёт изменения в самых разных сферах сразу: кризисные ситуации на работе, в отношениях, проблемы со здоровьем. Поэтому не стоит напрасно пускаться в авантюры, совершать рискованные поступки, излишне разбрасываясь временем и энергией. Хорошо начать здоровый образ жизни, отказаться от плохих привычек, следить за рационом.\nВажно не пытаться удерживать то, что уже стало лишним в вашей жизни, что не несет ничего нового, живительного, никакого движения. Это поможет впустить в жизнь свежую энергию и заложить основу для успешного будущего.\nВозможны ключевые события:\nПоложительные:\nПеремены в жизни, как правило, довольно кардинальные. В плане здоровья -хорошо прошедшая операция, избавление от серьезной болезни...Продолжение в платной версии\n\n(3) Период, когда вы смело можете пожинать плоды своей деятельности во всех сферах жизни. Нередко следует продвижение по карьере. При этом может предстоять непростой выбор между интересами семьи и вашей социальной реализацией.\nУ семейных мужчин возможно рождение дочери. Если в этот период появится на свет мальчик, то он будет отличаться мягким складом характера.\nСвободный мужчина вероятнее всего встретит будущую супругу или ту, с которой сложатся серьезные прочные отношения. Такая партнерша сильно повлияет на вашу жизнь в будущем.\nВажно уделять достаточно внимания и заботы женщинам рода, прорабатывая свои мужские качества. Если есть обиды, недопонимания с родственницами, важно найти контакт с ними и наладить отношения.\nВозможны ключевые события:\nПоложительные:\nПродвижение дел, успех в бизнесе, начало новых амбициозных (и особенно творческих) проектов. Бизнес приносит прибыль, успех сопутствует не только в делах, но и в личной жизни...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:36.639939Z",
                    "edited": "2022-02-05T09:51:42.894171Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "17",
                    "gender": "",
                    "type": "expandable",
                    "title": "73.5-74",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5046,
                    "content": "(6) Период максимально направлен на отношения с окружающими, внешнюю красоту и внутреннюю гармонию. Важно поддерживать все сферы в балансе и идти за своими ощущениями, не действуя по указке или желаниям, интересам других.\nОбустраивайте пространство вокруг себя и уделяйте себе особое внимания, балуя и украшая. В такое время особенно чувствуется потребность в тактильности, в любви.\nХочется самому проявлять нежность, ласку и получать в ответ от других. Важно внимание, уход, забота. Человек в такой период склонен влюбляться, стремится найти свою половинку. А если она уже есть, то максимально фокусируется на близости с партнером, на качестве отношений. Если не хватает внимания и ласки от близкого человека, на этом фоне могут возникать обиды и недопонимание. Не стоит уходить в себя и замалчивать проблемы. Проявляйтесь сами и открыто говорите о том, чего хотите. Есть возможность планирования появления детей в семье.\nАктивно раскрываются коммуникативные способности, есть потребность быть в хороших отношениях с окружающими, нравиться всем. Остро хочется наконец-то выделить время для хобби, особенно творческих (от цветоводства до дизайна).\nПри непонимании с окружающими, а особенно близкими, старайтесь сгладить острые конфликты и идти на примирение первыми. Это скажется положительно, прежде всего, на вас.\nВозможны ключевые события:\nПоложительные:\nМного новых знакомств, общения и приятных контактов. Флирт и влюбленность, благополучные новые отношения, помолвка, свадьба...Продолжение в платной версии\n\n(5) Время знаменует собой максимальный фокус на семью и дела близких. Благоприятно для вступления в брак, рождения детей. Ваша помощь может потребоваться близким, возможно решение каких-то семейных дел, установление новых традиций в роду. При этом необходимо соблюдать баланс в отношениях и взаимодействии с родными. Не стоит слишком цепляться за родственников (старших, младших), живя их жизнью, ставя себя в положение жертвы или излишне опекая. Подросших детей придётся отпустить в самостоятельную жизнь. Со старшими в роду важно поддерживать здоровые уважительные отношения, оказывая внимание и заботу. Но проживать свою жизнь и действовать по своему разумению, в рамках сформированной системы внутренних ценностей.\nЭтот период характеризуется расстановкой приоритетов. Возможно, захочется навести порядок как буквально (в быту), так и в разных сферах жизни. Действуйте экологично, соблюдая порядок не только в доме, но и в эмоциональном плане, в мыслях. Старайтесь не опаздывать и вообще серьезнее относиться к ресурсам времени (своего и чужого), полезно соблюдать режим дня и систематизировать свою жизнь, разложив всё по полочкам.\nПолезным будет обучение, самосовершенствование как в личном, так и в профессиональном плане. Хорошо пройти курсы, получать новые знания и использовать их на практике. Важно не только копить знания, но и делиться ими.\nОсобенное внимание стоит уделить бумагам, официальным документам. Придётся следить за их правильным оформлением.\nВозможны ключевые события:\nПоложительные:\nДля молодых людей - обучение, получение документов, отделение от родителей и начало самостоятельной жизни. Возможно вступление в брак с подходящим партнёром, который крепко стоит на ногах...Продолжение в платной версии\n\n(11) Время роста и успеха, но в то же время и больших энергозатрат. Можно преуспеть в карьере и обществе вплоть до сильного влияния на большое количество людей, создания новых направлений. Период позитивный и дарящий много отдачи при разумном использовании своей силы. Именно сейчас важно привести себя в форму, научиться эффективно работать, а не перегружаться. Хорошо нормализовать своей режим дня, регулярно заниматься спортом, чаще бывать на свежем воздухе. Отводите время и на увлечения, выделяя этому свободное время. Так ваша работоспособность будет гораздо выше, нежели если вы будете бросаться от одного проекта к другому, взваливать на себя всё разом, постоянно создавать кипучую деятельность и задерживаться на работе.\nНе пожалейте время на профилактику хронических заболеваний и плановый медосмотр, чтобы не упустить важное. В противном случае сопутствующий такому периоду трудоголизм может довести до полного физического и нервного истощения.\nВозможны ключевые события:\nПоложительные:\nПериод прохождения испытания на выносливость, максимальное напряжение сил с отдачей в спорт, работу, бизнес, какую-либо плодотворную деятельность. Ситуация в ваших руках, и вы получаете повышение, признание...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.382479Z",
                    "edited": "2022-02-05T09:51:40.536734Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "6",
                    "gender": "",
                    "type": "expandable",
                    "title": "75",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5060,
                    "content": "(13) Период кардинальных перемен и резких поворотов в судьбе. Грядут события, после которых жизнь уже не станет прежней. Они могут быть как положительными, так и горькими (вплоть до смерти кого-то из близкого окружения). Важно принять их, какими бы они ни были. Придётся следовать за событиями и процессами, которые становятся совсем неожиданными, но необходимыми.\nВаша роль - принятие, готовность к переменам, непротивление, мудрость. Необходимо самостоятельно начать отпускать всё старое, ненужное и изжившее себя в это время от работы, отношений, которые уже не устраивают, до вещей (например, заняться расхламлением). Придётся буквально подстраиваться под быстро меняющуюся обстановку и следовать за происходящим, не обдумывая долго и не погружаясь глубоко в события. Будет полезно научиться принимать решения быстро и при этом стратегически верно.\nТакой период нередко несёт изменения в самых разных сферах сразу: кризисные ситуации на работе, в отношениях, проблемы со здоровьем. Поэтому не стоит напрасно пускаться в авантюры, совершать рискованные поступки, излишне разбрасываясь временем и энергией. Хорошо начать здоровый образ жизни, отказаться от плохих привычек, следить за рационом.\nВажно не пытаться удерживать то, что уже стало лишним в вашей жизни, что не несет ничего нового, живительного, никакого движения. Это поможет впустить в жизнь свежую энергию и заложить основу для успешного будущего.\nВозможны ключевые события:\nПоложительные:\nПеремены в жизни, как правило, довольно кардинальные. В плане здоровья -хорошо прошедшая операция, избавление от серьезной болезни...Продолжение в платной версии\n\n(12) Сложный судьбоносный период, испытания которого могут стать ключевыми, поворотными моментами для будущей жизни. Дела в бизнесе, какие-то вопросы, отношения в личной жизни, пройдя черед испытаний, могут выйти на новый (более сложный и совершенный) уровень. Либо наоборот - внезапно пойти на спад (крах, развод, потери). Всё зависит от вас только наполовину. Примерно наполовину - от вашего окружения, умения слушать и поступать правильно, ловить знаки судьбы, быть мудрым и глубоким. Впереди потери и обретения. Придется расстаться с кем-то или чем-то важным в жизни.\nВ такое время хорошо прислушиваться к себе и присматриваться к тому, что происходит вокруг. Иногда просто не будет возможности вмешаться в дела или изменить что-либо в происходящих ситуациях. Выигрышной станет позиция чуткого наблюдателя. Хорошо, если в окружении такое же состояние вы сможете внушить и передать другим. Это состояние и грядущие перемены нужны для чего-то важного.\nНе отказывайтесь от участия в благотворительности, помощи другим. Но при этом соблюдайте баланс своей способности дарить (отдавать) другим и получать взамен. Ваши интересы в этот период должны быть всё же на первом месте. Давайте кому-то от внутренней наполненности, от искреннего желания, а не ожидая награды, чего-то взамен или стараясь заслужить любовь.\nНе стоит забывать заботиться о своём физическом теле, соблюдая правильное питание, режим и поддерживая баланс во всём. Полезно обучаться новому, познавать другие точки зрения, постигать мудрость и знания о законах мироздания.\nВозможны ключевые события:\nПоложительные:\nОтносительно спокойное время с небольшими положительными движениями. Например, выход из кризисной ситуации, разрешение дел, небольшой рост бизнеса, привлекательные перспективы в самых разных жизненных сферах...Продолжение в платной версии\n\n(7) Особенность периода – это активное движение и новые возможности. Следует откликаться на все шансы и быть максимально мобильным. Это отличный этап для переездов и всего, что связано со сферой смены жилья. Хорошо просто путешествовать или отправляться в деловые командировки. Это даст новые полезные знакомства, вы обрастёте кругом единомышленников и новых друзей. Также возможно движение по карьерной лестнице, творческий и рабочий рост.\nХорошо не упускать все возможности проявить себя. Но еще более полезно будет наметить конкретную цель, выработать план и двигаться по нему.\nБудет возможность для открытия или долгожданного расширения бизнеса. Если есть сомнения, то стоит опереться на помощников и не бояться впускать в процесс как можно больше людей. Это именно то время, когда главными окажутся коллективные усилия. Вам с успехом удастся выполнять самые разные проекты и руководить коллективом.\nВозможны ключевые события:\nПоложительные:\nХорошие новости и предложения, новые идеи и возможности. Плодотворные поездки, движение по карьере, расширение своего дела...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:36.18288Z",
                    "edited": "2022-02-05T09:51:42.044623Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "13",
                    "gender": "",
                    "type": "expandable",
                    "title": "76-77",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5048,
                    "content": "(7) Особенность периода – это активное движение и новые возможности. Следует откликаться на все шансы и быть максимально мобильным. Это отличный этап для переездов и всего, что связано со сферой смены жилья. Хорошо просто путешествовать или отправляться в деловые командировки. Это даст новые полезные знакомства, вы обрастёте кругом единомышленников и новых друзей. Также возможно движение по карьерной лестнице, творческий и рабочий рост.\nХорошо не упускать все возможности проявить себя. Но еще более полезно будет наметить конкретную цель, выработать план и двигаться по нему.\nБудет возможность для открытия или долгожданного расширения бизнеса. Если есть сомнения, то стоит опереться на помощников и не бояться впускать в процесс как можно больше людей. Это именно то время, когда главными окажутся коллективные усилия. Вам с успехом удастся выполнять самые разные проекты и руководить коллективом.\nВозможны ключевые события:\nПоложительные:\nХорошие новости и предложения, новые идеи и возможности. Плодотворные поездки, движение по карьере, расширение своего дела...Продолжение в платной версии\n\n(14) Хороший период для познания себя, исследования своего глубинного внутреннего Я и тайников души. Нередко проявляется интерес к творчеству, искусству, красоте и тонким вещам. Могут возникнуть ситуации, которые помогут проявиться качествам характера, до этого не проявлявшимся. Особенно это касается смирения, терпеливости, способности принимать события и вещи такими, какие они есть. Часть из них будет просто не остановить и не изменить. Поэтому придётся взять на себя роль мудрого и смиренного наблюдателя, который отдаётся на волю своей судьбы. И это станет лучшим из возможных решений.\nНе проявляйте нетерпеливости: каждому событию своё время. Нельзя также жаловаться, жадничать или роптать на судьбу. Вам всё воздастся в свой определённый срок. Начните доверять хорошему течению жизни и благодарить её даже за мелочи.\nОтличный период для того, чтобы научиться быть в гармонии с собой. Займитесь делами, которые вам по душе или тем, о чём давно мечтали. Не бойтесь связанных с этим перемен. Вам будет дано именно столько, сколько нужно для спокойной, комфортной жизни и занятия хобби, творчеством, саморазвитием и т.д.\nПозаботиться захочется не только о душевном комфорте, но и о телесном. Полезно будет заняться своим питанием, очищением. Не исключено, что интерес появится в области натуральных средств, как травы, масла, минералы, вода. Используйте по максимуму возможности природных даров, но не переусердствуйте. В данный период важна умеренность во всём. Прислушивайтесь к сигналам организма. За что бы ни брались, доводите начатое до конца. Делайте упор на качество, а не количество. Уделяйте внимание и своим эмоциям, сглаживая острые углы и не позволяя накапливаться негативу.\nВозможны ключевые события:\nПоложительные:\nСтабильность в жизни и делах. Незначительный постепенный рост в карьере, бизнесе...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.49789Z",
                    "edited": "2022-02-05T09:51:40.749846Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "7",
                    "gender": "",
                    "type": "expandable",
                    "title": "77.5-78",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5050,
                    "content": "(8) Спокойный и относительно стабильный период, который многие склонны воспринимать как время застоя. На самом деле, в нём закладываются все возможные плоды для дальнейшего развития важных сфер жизни: от личной до карьеры и реализации в обществе. Важно осмыслить своё прошлое и настоящее на предмет, чего вы достигли и к чему хотели бы прийти, каковы ваши возможности и насколько вы себя реализуете в работе, творчестве.\nТакже придётся проработать отношения с партнёром. Подумайте, насколько вы счастливы и реализованы в отношениях, доставляют ли они радость; если есть проблемы, то в чём они. Нередко в эти периоды люди прибегают к совету профессиональных психологов, так как в застаревших проблемах или в себе самом сложно разобраться.\nНеобыкновенное время для действия, проявления кармических законов и воздействия судьбы. Не стоит пенят на жизнь, искать справедливость (по вашим понятиям и законам). Зато полезно поступать с другими, как хотели бы, чтобы обращались с вами. Старайтесь проявлять миролюбие, легкое отношение к жизни, при этом работая над своим характером, постигая жизненные законы.\nОбратите внимание на порядок в делах и документах, отдайте все долги, в какой бы форме они ни были (обязательства, налоги, кредиты, помощь в ответ на оказанную вам).\nВозможны ключевые события:\nПоложительные:\nОбучение и сдача экзаменов, получение диплома. Обращение в госструктуры, суды с успешным разрешением дел в вашу пользу...Продолжение в платной версии\n\n(9) Время для глубокой внутренней проработки своей личности. Хорошо переосмыслить прошлый и настоящий опыт, задать себе правильные вопросы. Нередко люди в такой период усиленно занимаются поиском смысла жизни и себя в мире. Не стоит опираться на других людей и чужие умозаключения - все ответы уже есть внутри вас. Именно к себе, своему внутреннему голосу и стоит обратиться. Полезно больше времени проводить в одиночестве, на природе, заниматься йогой, читать книги по психологии, изучать законы Вселенной и построения взаимоотношений.\nЗанимайтесь творчеством и старайтесь выстроить доверительные, более глубокие отношения со спутником жизни, выходя на новый уровень. Ваша креативность, глубина, внутренний потенциал станут помощниками и в этом.\nПериод, когда многие пересматривают свой жизненный уровень, положение в обществе, доходы. Не исключено, что многое захочется скорректировать. Главное быть во всем умеренным, не делать резких или необдуманных шагов. В погоне за благосостоянием не экономьте на себе и тем более на здоровье. Вам необходим качественный уровень жизни.\nВозможны ключевые события:\nПоложительные:\nОтдых от трудов и уединённое состояние, возможно посещение особых сакральных мест, мест силы или святых мест. Духовный рост, творческое развитие личности обретение себя через обучение или обретение наставника...Продолжение в платной версии\n\n(17) Отличное время для ярких и творческих особ со множеством увлечений и талантов. Даже если вы не любите бывать на публике, этот период станет возможностью сказать миру слово о себе, получить славу, признание популярность.\nВажно быть готовым к грядущим переменам. Хорошо сменить имидж, поработать с внешностью и самооценкой. Развивайте в себе таланты, харизму, природные данные. Чаще полезно бывать в общественных местах от шумных вечеринок до выставок. Вдохновение вы можете получить где угодно. Не исключено, что ваше хобби в данный период станет профессией и приятным способом получить не только известность, но и статус, комфорт, материальные блага. Используйте свои навыки, творчество, знания для этого.\nВажно развивать уверенность в себе, раскрыть свой внутренний мир людям. Публичные выступления, мероприятия, где вы будете в центре внимания - позволят добиться желаемого результата.\nВозможны ключевые события:\nПоложительные:\nЗанятие любимым делом, путешествия, творческий и духовный подъем, возможность зарабатывать, занимаясь искусством. Счастливые знаки судьбы и неожиданная важная помощь извне...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:35.61333Z",
                    "edited": "2022-02-05T09:51:40.964001Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "8",
                    "gender": "",
                    "type": "expandable",
                    "title": "78.5-79",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5032,
                    "content": "(1) Период для самореализации через обучение, новые знания, самосовершенствование и свежие контакты, идеи, в том числе творческие. Можно выразить себя самыми разными способами, используя активную жизненную позицию. Инициатива, повышение своего уровня и передача знаний, расширение круга знакомых - станут ключами к успеху.\nВ это время хорошо получать основное/дополнительное образование, проходить курсы и тренинги. Деятельность мозга становится более приспособленной для восприятия информации, вы буквально готовы впитывать всё как губка.\nТакже хорошо проявлять коммуникативные навыки, больше появляться в обществе, заводить полезные знакомства и находить контакт с окружающими. Это будет полезно в будущем.\nХорошо раскрепоститься и позволить себе заниматься любимым делом. Важно верить в себя и раскрыть свой потенциал. Для самореализации в общественной жизни необходимо проработать свою самооценку и уверенность в себе.\nВозможны ключевые события:\nПоложительные:\nХорошее и стабильное финансовое положение. Полезные связи и знакомства...Продолжение в платной версии\n\n(2) Интересный период загадок и тайн. Прислушайтесь к своей интуиции, внутреннему голосу. Судьба сама приведет вас к нужным людям в своё время. Даже если вы всю жизнь считали себя творцом судьбы и активным в своих позициях, в это время стоит довериться жизненному потоку, прислушаться к происходящему и включить своё шестое чувство.\nЧрезмерная рассудительность и логика в такое время может стать вашим врагом. Гораздо полезнее занять пассивную позицию и использовать свои внутренние ресурсы, обращать внимание на знаки судьбы и \"простые совпадения\". Помочь раскрыть своё внутренне Я может увлечение психологией, астрологией, нумерологией и другими науками.\nОсобенно важно в этот период наладить отношения с матерью и другими женщинами рода, также со своими половинками (и даже бывшими, чтобы отпустили и не держали обиды).\nДля гармонизации своего состояния стоит быть более гибким, проявлять заботу о других, сохранять спокойствие в любых обстоятельствах. Полезными для жизненного и физического баланса станут также забота о теле: здоровый образ жизни, полезные привычки. Чаще стоит бывать на природе, использовать натуральные продукты.\nВозможны ключевые события:\nПоложительные:\nГармоничная и спокойная в целом жизнь в достатке и успехе. Интерес к тайным знаниям, обучение, сбор важной информации, также её использование или передача...Продолжение в платной версии\n\n(3) Период, когда вы смело можете пожинать плоды своей деятельности во всех сферах жизни. Нередко следует продвижение по карьере. При этом может предстоять непростой выбор между интересами семьи и вашей социальной реализацией.\nУ семейных мужчин возможно рождение дочери. Если в этот период появится на свет мальчик, то он будет отличаться мягким складом характера.\nСвободный мужчина вероятнее всего встретит будущую супругу или ту, с которой сложатся серьезные прочные отношения. Такая партнерша сильно повлияет на вашу жизнь в будущем.\nВажно уделять достаточно внимания и заботы женщинам рода, прорабатывая свои мужские качества. Если есть обиды, недопонимания с родственницами, важно найти контакт с ними и наладить отношения.\nВозможны ключевые события:\nПоложительные:\nПродвижение дел, успех в бизнесе, начало новых амбициозных (и особенно творческих) проектов. Бизнес приносит прибыль, успех сопутствует не только в делах, но и в личной жизни...Продолжение в платной версии",
                    "created": "2022-02-05T09:48:34.176635Z",
                    "edited": "2022-02-05T09:51:39.054331Z",
                    "type_id": 141,
                    "language": "ru",
                    "personal": false,
                    "combination": "1",
                    "gender": "",
                    "type": "expandable",
                    "title": "80",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": true,
                  "positions": null
                 },
                 {
                  "imageName": "full",
                  "title": "Личный бренд (NEW)",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 5145,
                    "content": "Уникальность личности человека придает дополнительную ценность его продукту или услуге и формирует личный бренд, который дает возможность транслировать собственное мнение, видение и навыки абсолютно всем. Соединяя многогранный образ своей личности формируется оригинальность и легкость трансляции себя настоящего.",
                    "created": "2022-07-23T06:23:45.853937Z",
                    "edited": "2022-07-23T06:23:45.853938Z",
                    "type_id": 400,
                    "language": "ru",
                    "personal": false,
                    "combination": "1",
                    "gender": "",
                    "type": "info",
                    "title": "Личный бренд (NEW)",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5146,
                    "content": "Основной упор должен быть на уникальность личности. Человек с такой энергией является для людей своеобразной визитной карточкой чего-то нового и уникального.\n\nВ чем вы первооткрыватель? Это и стоит транслировать и продвигать. \n\nЛюди с такой энергией новаторы и лидеры, способные зажечь своими идеями других людей, повести их за собой, делая упор на успешное мышление. Важно позиционировать себя оптимистично, включая где-то нотку авантюризма. \n\nЧем больше различных идей, креатива, тем лучше! \n\nДля формирования успешного личного бренда  важно легко начинать новые проекты, потому что в глазах общества вы необычный человек, у которого все получается с первого раза. \n\nВажно выделяться из «толпы». В вашем случае классно отстраиваться от других коллег, единомышленников. \n\nМожно не жадничать в передаче опыта, различные креативные квесты, игры, викторины будут замечательным подспорьем в ведении блогов в соцсетях. \n\nТакому человеку как вы часто приходится самостоятельно пробивать дорогу в жизни себе и другим. Зато в основе лежит талант достигать вершин мастерства, по большей части самостоятельно. \n\nМожно работать как в одиночку, так и с равными по духу партнерами, но не позволяйте никакого авторитарного давления над ними. \n\nСвобода и новшество – это главная составляющая вашего позиционирования для людей. \n\nНужно внутренне повзрослеть, чтобы соответствовать своим идеям и желаниям.  Из-за страха проявляться будете отказываться от взросления и перекладывать ответственность на других.\n\nРаботайте над своим красноречием, читайте литературу в той сфере, в которой вы растете и развиваетесь. \n\nРаскрывайте свою яркую индивидуальность, в том числе и через внешние необычные привлекающие внимание образы или аксессуары.\n\nИменно вам дана способность глубже и тоньше видеть, чувствовать и понимать причинно-следственные связи. Находить золотую середину и чувствовать баланс. Поэтому ваша аудитория готова внимать каждому вашему слову, чувствуя в ваших словах истину. \n\nВы тот человек, который точно знает: то, что мы имеем в реальности, пришло к нам не случайно, и поэтому с нами никогда и ничего не происходит просто так, все это причинно-следственный закон бытия. \n\nВам проще понять этот закон, а также закон баланса, разглядеть его в событиях своей жизни, а впоследствии научиться видеть его и в жизнях других людей. В блоге также можете транслировать это через свои достижения и провалы. \n\nЕсли вы владеете искусством задавать себе подобнее вопросы: а почему со мной это происходит? В чем истинная причина тех или иных проблем? Что я могу сделать сегодня, чтобы изменилась моя жизнь в будущем? — значит вы максимально реализуете свой потенциал. \n\nВам свойственно влезать в различные разбирательства и отстаивать позиции слабых. Поэтому часто можете притягивать к себе аудиторию со схожими проблемами, или не получать от них, того что ждете. Вы должны всегда договариваться о всем “на берегу”. \n\nВы можете по-настоящему помочь, так как всегда ориентированы на помощь и поддержку,  однако помните о балансе брать-давать. \n\nМожете внести ясность в любую, даже сложную ситуацию. Для вас важно рассказывать людям о взаимосвязи событий, о законах причины и следствия.\n\nДелитесь своими рассуждениями с подписчиками. Обязательно будьте честны перед аудиторией и выполняйте данные обязательства, но не взваливайте на себя непосильную ношу, так недалеко до выгорания.\n\nДля многих людей вы можете казаться достаточно закрытым человеком. Если это и правда так, то стоит обратить внимание на трансляцию своих чувств/ состояний. \n\nНачинайте раскрывать свое сердце и не бойтесь высказывать то, что чувствуете. Это, наоборот, будет полезно для всех, в частности для тех, кто имеет схожие трудности.\n\nВы мудрый человек, проживаете каждый свой опыт, извлекая уроки и пользу. И каждая ваша жизненная история - это кладезь осознаний для другого человека. Вы умеете анализировать свой практический опыт и видеть в уроках/ошибках силу. Поэтому ваша задача передача опыта! \n\nВы можете идеально познать искусство сторителлинга через речь или написание различных текстов и смыслов, но склонны и уйти в отшельничество, не проявляясь совсем  или крайне редко. Введите выходные в своём блоге или устраивайте  отпуск от работы, не забывая предупреждать аудиторию.  \n\nВ любом случае, то, как вы видите глубоко мир, как можете чувствовать природу и постигать различные уровни жизни, передавая свой опыт — это бесценно. И это должен видеть мир. Как это будет, это ваш выбор, однако найти, как передавать свою мудрость, важно.\n\nДемонстрируйте свою экспертность без «танцев с бубном» перед камерой. В своем блоге делитесь мыслями, направляйте аудиторию к поиску глубинных ответов, передавайте знания единомышленникам, создавайте сообщества, развивайте интеллектуальное творчество.",
                    "created": "2022-07-23T06:25:09.520374Z",
                    "edited": "2022-07-23T10:11:02.073998Z",
                    "type_id": 401,
                    "language": "ru",
                    "personal": false,
                    "combination": "1",
                    "gender": "",
                    "type": "expandable",
                    "title": "Самовыражение",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5179,
                    "content": "Оодиночество, глубина познаний, знания, обучение, мудрость, жизненный опыт, личные истории, легенды, притчи, поучительные истории, истории клиентов, кейсы, курсы, полезная информация, практики, древность, история, науки, факты естествознания, природа, уединение, медитация, преподавание, история обучения, учительство, саморазвитие, самопознание, интуиция, религия, бог, общение с высшими силами, аура, любимое дело, спокойствие, самодостаточность, забота об окружающих, забота о животных и стариках, осторожность, замкнутость, борьба с гордыней, отшельничество, нелюбовь к себе, недоверие миру.\n\nВдохновение, творческий порыв, поток (слышание интуиции и следование ей), вселенная, бог, везение, мероприятия, компания, дружба, организация мероприятий, деньги, лотерея, конкурсы, розыгрыши, игры, легкие посты, способы развития интуиции, отклик тела, коммуникации, продажи (если продаем, то легко и весело), идейность, жизнерадостность, в этот день хорошо быть открытым для аудитории, работа с верой в себя, преодоление препятствий, внушаемость, путешествия, новые мероприятия, новые места, посещение культурных мероприятий, поход в кино/театр/ на выставку, обзор различных мест для развлечений.\n\nВера, религия, бог, традиции, семья, род, образование, курсы, книги, воспитание детей, ораторское искусство, публичные выступления, объявление эфиров и их проведение, вебинары, обучающие видео, практики, полезный контент, списки, описание услуг, продажа курсов, отношения родителей и детей, отцы и дети, родовые сценарии, практики по роду, семейные ценности, дом, иерархия, системность, приверженность традициям, страх идти в новое, работа с ограничивающими установками, спор, дискуссии, умение слышать, умение слушать, правда, наставничество, общее дело, семейная психология, внутренний ребенок, сочувствие, духовность, поддержка, новые знания, лицемерие, уступки, компромисс. ",
                    "created": "2022-07-23T06:32:47.464828Z",
                    "edited": "2022-07-23T11:00:25.922827Z",
                    "type_id": 402,
                    "language": "ru",
                    "personal": false,
                    "combination": "9",
                    "gender": "",
                    "type": "expandable",
                    "title": "Темы для позиционирования",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 5193,
                    "content": "Блестящие темные ткани, необычные украшения, камни, сухоцветы, свечи. Все концептуальное, особенное, инновационное.\n\nКниги, минимализм, лаконичная одежда, натуральные ткани, отсутствие аксессуаров или очень маленькое количество, простота во всем, природа или природные элементы.",
                    "created": "2022-07-23T06:35:41.659481Z",
                    "edited": "2022-07-23T10:41:29.487834Z",
                    "type_id": 403,
                    "language": "ru",
                    "personal": false,
                    "combination": "1",
                    "gender": "",
                    "type": "expandable",
                    "title": "Визуал",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": false,
                  "positions": [
                   [
                    "a",
                    "e",
                    "b1"
                   ],
                   [
                    "b1",
                    "c1",
                    "x2"
                   ],
                   [
                    "a",
                    "b",
                    "b1"
                   ]
                  ]
                 }
                ],
                "combinations": {
                 "a": 1,
                 "a1": 9,
                 "a2": 10,
                 "a3": 17,
                 "a4": 4,
                 "a5": 5,
                 "a6": 7,
                 "b": 1,
                 "b1": 9,
                 "b2": 10,
                 "b3": 17,
                 "b4": 4,
                 "b5": 7,
                 "b6": 5,
                 "b7": 5,
                 "b8": 6,
                 "c": 2,
                 "c1": 10,
                 "c2": 12,
                 "c3": 7,
                 "c4": 5,
                 "c5": 7,
                 "c6": 12,
                 "c7": 9,
                 "d": 4,
                 "d1": 12,
                 "d2": 16,
                 "d3": 12,
                 "d4": 10,
                 "d5": 8,
                 "d6": 22,
                 "d7": 14,
                 "d8": 6,
                 "d9": 18,
                 "e": 8,
                 "e1": 16,
                 "e2": 6,
                 "e3": 10,
                 "e4": 19,
                 "e5": 3,
                 "e6": 11,
                 "e7": 7,
                 "e8": 14,
                 "f": 2,
                 "f1": 3,
                 "f2": 5,
                 "f3": 8,
                 "f4": 7,
                 "f5": 3,
                 "f6": 5,
                 "f7": 7,
                 "f8": 8,
                 "g": 3,
                 "g1": 9,
                 "g2": 13,
                 "g3": 17,
                 "g4": 22,
                 "g5": 14,
                 "g6": 19,
                 "g7": 5,
                 "h": 5,
                 "h1": 9,
                 "h3": 11,
                 "h4": 21,
                 "h5": 16,
                 "h6": 13,
                 "h7": 13,
                 "h8": 18,
                 "j": 3,
                 "k": 5,
                 "k1": 4,
                 "k2": 9,
                 "k3": 7,
                 "k4": 11,
                 "k5": 10,
                 "k6": 13,
                 "k7": 8,
                 "k8": 11,
                 "l": 2,
                 "l1": 20,
                 "l2": 18,
                 "l3": 7,
                 "l4": 16,
                 "l5": 22,
                 "l6": 6,
                 "m": 8,
                 "n": 8,
                 "n1": 5,
                 "o": 8,
                 "o1": 5,
                 "o2": 18,
                 "o3": 4,
                 "p1": 19,
                 "p2": 22,
                 "p3": 21,
                 "p4": 8,
                 "s": 6,
                 "s1": 18,
                 "s2": 20,
                 "s3": 10,
                 "s4": 22,
                 "t": 8,
                 "t1": 6,
                 "t2": 11,
                 "t3": 16,
                 "t4": 17,
                 "t5": 7,
                 "t6": 13,
                 "t7": 8,
                 "u": 8,
                 "x": 22,
                 "x1": 7,
                 "x2": 5,
                 "x3": 13,
                 "x4": 16,
                 "x5": 21,
                 "x6": 11,
                 "x8": 9,
                 "y": 6,
                 "y1": 8,
                 "y2": 10,
                 "y3": 12,
                 "y4": 18,
                 "y5": 14,
                 "y6": 22,
                 "y7": 20,
                 "y8": 16,
                 "z": 16,
                 "z1": 17,
                 "z2": 17,
                 "z4": 14,
                 "z5": 7,
                 "z6": 11,
                 "z7": 3,
                 "z8": 19
                }
               }
            saveDiagramButton.addEventListener('click', function(e) {
                e.preventDefault();
        
                var calculationWrap = e.target.closest('.js-calculation-wrap'),
                    language = e.target.getAttribute('data-language-string'),
                    dob = e.target.getAttribute('data-dob-string'),
                    name = e.target.getAttribute('data-name-string'),
                    printDiagramHtml = calculationWrap.querySelectorAll('.js-print-diagram-wrap, .js-section-with-diagram');
                showPreloader();
                domtoimage.toJpeg(printDiagramHtml[0], {
                    bgcolor: "#ffffff"
                }).then(function(dataUrl) {
                    createDiagramPdf(response, language, dob, name, dataUrl);
                    setTimeout(function() {
                        hidePreloader()
                    }, 1000)
                }).catch(function(error) {
                    console.error('oops, something went wrong!', error)
                })
            })
                resetForm(form);
                if (product_id) {
                    fetch("/wp-json/c/v1/deactivate/" + product_id)
                }
                
                calculationWrap.querySelector('.js-calculation-begin').classList.add('d-none');
                calculationWrap.querySelector('.js-calculation-block').classList.remove('d-none');
                setTimeout(function() {
                    calculationWrap.querySelector('.js-form-with-calculation').dataset.click='false'
                }, 3000);
                var headerTitles = getHeaderTitlesForCalculation(typeOfForm, language, formName, formDob, 0);
                setHeaderTitleForCalculation(calculationWrap, headerTitles.title, headerTitles.subTitle);
                
                createInfoFromServer(response, calculationWrap, language, age);
                addActiveArticleInTheSectionWithDiagram(sectionWithDiagram);
                clearActiveRowInTable(sectionWithDiagram);
                fillInTheDiagram(response.combinations, sectionWithDiagram);
                activeArticleInTheSectionWithDiagram(sectionWithDiagram, calculationWrap);
                cloneDiagramSection(calculationWrap);
                setTimeout(function() {
                    scrollToBeginOfCalculation(calculationWrap);
                    hidePreloader()
                }, 1000)

        }
    )
    

    document.querySelector('.js-childrens-matrix-form').addEventListener('submit', (e) => {
            e.preventDefault();
            var form = e.target,
                typeOfForm = detectTypeOfForm(form),
                calculationWrap = form.closest('.js-calculation-wrap'),
                sectionWithDiagram = calculationWrap.querySelector('.js-section-with-diagram'),
                saveButton = calculationWrap.querySelector('.js-save-info-in-pdf'),
                saveFromEditorButton = calculationWrap.querySelector('.js-save-from-editor'),
                saveDiagramButton = calculationWrap.querySelector('.js-save-diagram-in-pdf'),
                formName = form.querySelector('#child-name').value,
                formDob = form.querySelector('#child-dob').value,
                age = getAgeFromBirthdate(formDob),
                product_id = +form.querySelector("#product_id").value,
                gender = form.querySelector('#child-gender').value,
                // language = form.querySelector('#language').value,
                edw_var = '';
            if (document.querySelector('.js-check-date-form').classList.contains('js-not-full-functionality')) {
                edw_var = "&edw=1"
            }
            var res = {
                "ok": true,
                "data": [
                 {
                  "imageName": "personal_features",
                  "title": "Личные качества",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 135,
                    "content": "Ребенок - какой он? Каким видят его окружающие? В этом разделе описаны личные качества ребенка и как он проявляет себя в социуме, а также даны рекомендации для родителей, каких ошибок в воспитании следует избегать.\u2028Ознакомившись с этим разделом, должно прийти понимание, как родители могут помочь ребенку проявить себя.",
                    "created": "2021-10-13T06:11:03.011232Z",
                    "edited": "2021-10-13T06:11:03.011232Z",
                    "type_id": 101,
                    "language": "ru",
                    "personal": false,
                    "combination": "1",
                    "gender": "",
                    "type": "info",
                    "title": "Личные качества",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 1,
                    "content": "(1) Такой ребенок очень энергичен и свободолюбив. Это волевая, независимая личность. Любит эксперименты и всё новое. Он первооткрыватель и новатор от рождения. Имеет огромный творческий потенциал, который необходимо направить в такой вид творчества, где нужно делать что-то руками. Имеет много интересов и способностей, развитое мышление и отличную память. Он хочет выделяться на фоне сверстников, интересен в общении.  Этот ребенок готов устраивать праздничный карнавал, хоть каждый день. Изобретателен, буквально фонтанирует идеями. Он обладает явными качествами лидера, организаторскими и управленческими способностями, а также владеет мастерством убеждения.",
                    "created": "2021-10-03T18:35:48.761721Z",
                    "edited": "2021-10-03T18:35:48.761722Z",
                    "type_id": 1,
                    "language": "ru",
                    "personal": false,
                    "combination": "1",
                    "gender": "",
                    "type": "expandable",
                    "title": "Характеристика качеств",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 66,
                    "content": "(1) Нельзя подавлять лидерские качества этого ребенка. С ним нужно быть «на равных», другом. Уважать его свободу, его выбор. Нельзя запрещать ему пробовать что-то новое, неизведанное для него. Если то, что он хочет опасно, нужно подробно объяснить почему не следует этого делать, а не просто говорить «нельзя». Важно поддерживать его в творческих начинаниях, развивать мелкую моторику. Помочь найти те занятия, которые будут приносить ему удовольствие. Такому ребенку хорошо прививать любовь к чтению. Он черпает вдохновение, находясь на природе, поэтому ему полезно чаще бывать за городом, выбирать вид отдыха на открытом воздухе. Имея врожденный потенциал может хитрить, недоговаривать и даже манипулировать. Важно научить его различать в каких ситуациях влияние словами на людей - во благо, а каких слов лучше избегать, например, врать не хорошо.",
                    "created": "2021-10-03T18:35:53.068183Z",
                    "edited": "2021-10-03T18:35:53.068184Z",
                    "type_id": 2,
                    "language": "ru",
                    "personal": false,
                    "combination": "1",
                    "gender": "",
                    "type": "expandable",
                    "title": "Рекомендации для родителей",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 100,
                    "content": "(12) Такой ребенок любит общение и легко находит общий язык с окружающими. Люди чувствуют его готовность помогать и обращаются к нему за советом. Он умеет общаться на равных, не считает себя умнее или лучше других. Для него важно не создавать себе кумиров, не привязываться к кому-либо слишком сильно, иначе при прекращении общения будет очень переживать. Ребенку стоит научиться не боятся обращаться за советом. Родителям важно донести до него, что все знать невозможно и признать то, что он в каких-то вопросах недостаточно осведомлен – это абсолютно нормально. Ребенок может иметь проблемы с отстаиванием личных границ, поэтому для него важно научиться говорить о себе, своих желаниях и не стесняться отказывать. Он подвержен влиянию чужого мнения, может захотеть выполнять просьбы сверстников или взрослых против своей собственной воли, поэтому важно научить ребенка говорить нет без чувства стыда. Задача родителей – хвалить ребенка за его особое виденье и уникальность, т. к. именно эта особенность принесет этому ребенку счастье и реализацию в различных сферах жизни.",
                    "created": "2021-10-03T18:37:44.320842Z",
                    "edited": "2021-10-03T18:37:44.320842Z",
                    "type_id": 3,
                    "language": "ru",
                    "personal": false,
                    "combination": "12",
                    "gender": "",
                    "type": "expandable",
                    "title": "Ребенок в общении",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": true,
                  "positions": [
                   [
                    "a",
                    "b",
                    "e"
                   ]
                  ]
                 },
                 {
                  "imageName": "talents",
                  "title": "Отношения с родителями",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 137,
                    "content": "Огромное влияние на ребенка оказывает семья. Опыт, приобретённый в отношениях с родителями является фундаментом его характера, отношения к себе и тактики поведения в социуме. Этот раздел поможет ответить на вопросы: Как вырастить гармоничную личность и каких ошибок в воспитании ребенка следует избегать?",
                    "created": "2021-10-13T19:11:25.927127Z",
                    "edited": "2021-10-13T19:11:25.927127Z",
                    "type_id": 102,
                    "language": "ru",
                    "personal": false,
                    "combination": "1",
                    "gender": "",
                    "type": "info",
                    "title": "Отношения с родителями",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 255,
                    "content": "(1) Ребёнок может испытывать дефицит внимания родителей, поэтому взрослым необходимо дарить ему поддержку и любовь просто за то, что он есть, безусловно. Также важно выстроить доверительные отношения друг с другом, чтобы у него не накопились обиды и не возникли проблемы из-за них во взрослой жизни. Родители должны стараться уделять ему достаточно своего времени, потому что ребёнок чувствует происходящее иначе, чем они и может считать себя обделенным, даже если это не так, по мнению взрослых. Родителям не стоит требовать от ребёнка быть во всем первым. Также не нужно создавать конкуренцию в семье, если есть брат или сестра – каждый должен ощущать любовь, уважение и безопасность в равной доле. Такой ребёнок может воплощать в жизнь всё, о чем мечтает. От рождения он одарен хорошей интуицией –понимает, как нужно сделать что-либо, для того чтобы получить желаемый результат. Реализация его идей будет зависеть не только от его способности широко мыслить, но и от готовности самостоятельно принимать решения и начать действовать. Важно не зависать в мечтах, а переходить к их воплощению.\nОшибки, которых родителям следует избегать в отношениях с ребенком: Требование быть только первым, самым лучшим, неудовлетворенность меньшим результатом. Эгоизм. Лишение ребенка возможности принимать решения самостоятельно и нести за них ответственность.\n\n(13) Семья, в которой растет этот ребенок достаточно консервативных взглядов. Любые изменения в ней встречают с опасением и тяжело решаются на них, поэтому осознанно они случаются крайне редко. Это может привести к тому, что ребенок будет испытывать страх перемен и станет бояться впускать в свою жизнь что-то новое, ограничивать свои возможности устаревшими взглядами на мир. Если он ведет себя отстраненно и холодно с родителями, то это значит, что на подсознательном уровне он боится потерять родных. Взрослым важно начать впускать перемены в свою жизнь на всех уровнях, как физически -   избавляясь от старых ненужных вещей, так и работая с образом мышления -освободиться от собственных страхов, ограничивающих установок, консервативных взглядов. Родителям обязательно нужно объяснить ребенку естественность жизненных циклов, не избегать разговоров о смерти и в случае ухода из жизни родных говорить правду, а не придумывать легенды. Также родителям важно научить ценить настоящий момент, жить сегодняшним днем, наслаждаться каждым мгновением.\nОшибки, которых родителям следует избегать в отношениях с ребенком: Трансляция своих страхов ребенку, боязнь отпустить его, недоверие. Избегание разговоров о смерти, обман, что кто-то из умерших родственников просто уехал куда-то далеко. Боязнь перемен.\n\n(14) У мамы или папы такого ребёнка могут быть проблемы с алкоголем, а также другие разрушающие зависимости, которые мешают поддерживать гармоничные отношения в семье. В будущем этот вопрос может вылиться в раздражение с его стороны и обиды на родителей за дефицит внимания и жизненную нереализованность. Во избежание негативных последствий взрослым необходимо избавиться от пагубных привычек, наделить жизнь смыслом, счастьем и гармонией, чтобы транслировать их ребёнку. Также родителям важно окружить его любовью и поддерживать в любой ситуации, верить в его таланты и способности. Это необходимо для того, чтобы ребенок имел стабильную самооценку и уверенность в собственных силах. Стоит отметить, что родителям следует набраться терпения, исключить любую раздражительность и грубость в отношении ребёнка, особенно в вопросе его медлительности и размеренности. Для него во всем важен баланс и гармония, в том числе и в вопросах питания. Ему нельзя что-то жестко запрещать, иначе, это может привести к неумеренности в еде, жадности, нарушениях обмена веществ и, как следствие, к появлению проблем с лишним весом.\nОшибки, которых родителям следует избегать в отношениях с ребенком: Неверие в таланты и способности ребенка, нежелание поддержать творческие порывы. Отсутствие терпения, раздражительность и грубость по отношению к ребенку, если он что-то делает медленно. Неразборчивость и неумеренность в питании, жесткие ограничения.",
                    "created": "2021-10-31T22:27:16.957984Z",
                    "edited": "2021-10-31T22:27:16.957984Z",
                    "type_id": 4,
                    "language": "ru",
                    "personal": false,
                    "combination": "1",
                    "gender": "",
                    "type": "expandable",
                    "title": "Что нужно учитывать в вопросах воспитания ребенка",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 304,
                    "content": "(2) Проблемы рода. В прошлом предки распространяли много сплетен, врали, возможно, клеветали. Из-за этого разрушались чьи-то судьбы или дела. В семье много тайн, так называемых \"скелетов в шкафу\" (в прошлом или настоящем).\nОт родителей  других родственников появляется отягощение судьбы в виде неискренности в самых разных аспектах жизни от постоянного лицемерия, мелкого обмана до сокрытия серьезных тайн. Либо может быть противоположное - неумение хранить тайны.\nРебенок с такой программой растёт лицемерным, двуличным, постоянно стремящимся строить кого-то из себя, выдавать желаемое за действительность. С одной стороны, актерским талантам такого ребенка можно позавидовать. Но при этом такие дети вырастают бросающимися из крайности в крайность, не умеющими делать выбор. Их постоянно разрывают внутренние противоречия, конфликты (сложно определиться, не знают, чего хотят).\nНередки сложности в общении и контактах с родственницами женского пола (мать, бабушка, тетя) и воспитателями, учителями в школе. Вырастает личность корыстолюбивая, равнодушная.\nВо взрослом возрасте окружающим может казаться странным, что человек не любит быть на природе, не хочет контактировать с ней. Происходит нарушение биологических ритмов из-за внутреннего разлада, отсутствия гармонии в душе. В характере нет мудрости и внутренней целостности.\nРекомендации родителям. Важно научить ребёнка преодолевать свою лень и пассивную позицию. Необходимо открыто заявлять о себе, своих желаниях. Неплохо с раннего возраста начинать учиться слушать свой внутренний голос, что способствует развитию интуиции\nОбязательно разобраться с членами рода/семьи и раскрыть наконец семейные тайны. Признаться себе даже в тяжёлых вещах, найти компромиссы. Легче станет не только взрослым, но главное -  ребенку. Он сможет гармонично развиваться, быть целостным, понимать себя. Иначе возможны проблемы со здоровьем, так называемая психосоматика, когда непонятно, в чем причина. Но ребёнку становится все хуже. При этом анализы хорошие и врачи разводят руками.\n\n(10) Проблемы рода. В прошлом возможно негативное влияние на других людей, провокации, которые приводили к краху жизни, неудачам окружающих. Либо наоборот - представители рода вели тяжёлую жизнь с изматывающим физическим трудом (как рабство много поколений). Это вело и к сложностям в финансах, постоянным долгам. И к зависимости в человеческом, моральном плане, когда человек полностью подчиняется другим, живет по велению родственников/близких, от которых зависит полностью.\nОтражается это на ребёнке в том, что он пассивен, не проявляет инициативу и интереса к жизни. У него нет целей в жизни, зато присутствует аморфность и легкая внушаемость. Лень и апатия доводят до пренебрежения не только к своему духовному, социальному развитию. Ребёнок может равнодушно относиться и к своему физическому телу, ненавидеть спорт и всяческую активность, быть неряшливым.\nНередко такой человек находит для себя авторитет (не всегда верный и хороший) и цепляется за него, живя чужим умом. Может бесцельно растрачивать свою жизнь. При нелюбви к себе и неверии в собственные силы подросший ребенок постоянно ждет активности от других, но сам ни за что не сделает первый шаг. Понятно, чем это всё грозит. Авторитетом или более активным по отношению к нему может стать кто угодно от тирана и абъюзера до мошенника.\nТакие дети имеют большие сложности в принятии решений, не могут сделать свой выбор от самых элементарных бытовых вещей (что хочется поесть) до судьбоносных решений (выбор профессии, второй половинки). Они полностью привыкли полагаться на других, и конечно, свою и без того спящую интуицию тоже не слышат.\nРекомендации родителям. Важно помочь ребёнку развивать интуицию, слушать себя и свои истинные желания. Такой ребенок не должен быть ведомым и жить по чужим нормам, социальным установкам или моде, навязанной в его кругу общения. Действовать согласно велению сердца, но при этом разумно - вот главный посыл. Необходимо научить ребёнка самостоятельно принимать решения, жить своим опытом, верить в свою счастливую судьбу и удачу, не ждать от жизни только плохого.\nВначале будет непросто. Жизнь как бы проверяет таких людей на истинность желаний, на готовность идти вперед за своими целями. Необходимо научить ребенка преодолевать \"подножки\" от судьбы и воспринимать каждое \"нет\" от неё как очередную ступень. Тогда подрастающая личность научится не пасовать перед трудностями, делать выводы из самых разных ситуаций и продолжать свой путь, не сдаваясь. Если ребёнок будет после каждой неудачи впадать в уныние, отказываться от активности и полагаться на других, его жизнь станет очень тяжелой.\n\n(12) Проблемы рода. Огромную роль играет накопленная в роду жертвенность. Синдром жертвы передается от поколения к поколению. Члены рода постоянно испытывают нехватку любви извне, поддержки и одобрения. Нередко от этого включается программа самоуничтожения. Возможно, в роду были повешенные, страдальцы, инвалиды. Огромную родовую печать накладывают пострадавшие физически, финансово, морально предки. Особенно от того, что были лишены возможности двигаться вперед.\nЛибо от деятеьности членов рода могли становиться в жертвами другие люди. Их страдания перешли на потомство мучителей.\nС такой родовой программой чаще всего вырастают абъюзеры, созависимые люди, с синдромом жертвы или другими психологическими отклонениями. Особенно сильно это сказывается на личной жизни.\nУже у малыша наблюдается чрезмерная требовательность в любви и внимании. При этом сам ребенок вырастает не любящим себя, с чувством ненужности  обреченности, как будто ему что-то недодали. Дефицит любви к себе приводит в отношения с токсичными партнёрами. От этого возникают частые депрессии, апатия, болезненные состояния. Общая усталость и отсутствие жизненной энергии становятся буквально спутниками человека.\nЕсли не складываются личные отношения, такие люди начинают проявлять ненужную жертвенность сначала к самым близким, потом и к окружающим вплоть до знакомых и коллег. Они не любят себя, считают никчёмными и ненужными. Нуждаются в постоянном проявлении любви и одобрения. Хотят, чтобы люди подчеркивали их нужность и значимость. Навязчивые идеи о том, что любви нет и никто человека не любит, приводят к излишней ранимости и обидчивости (часто на пустом месте) по принципу \"сам придумал/додумал - сам обиделся\".\nЧрезмерная привязанность к объекту любви, желание полностью владеть им и контролировать тоже не делает счастливее. В результате в отношениях человек постоянно страдает, никуда не движется, не развивается, как бы находится в подвешенном состоянии.\nНежелание проживать собственную жизнь, все время уделяя близким, детям, родителям, мужу/жене, друзьям, но не себе - встречается одинаково у женщин и мужчин с такой родовой кармой. Берут на себя слишком много чужих проблем и обязанностей, что усугубляет синдром жертвы. Хотя кажется, что они настоящие спасатели, но страдать такому человеку жизненно необходимо. Это его \"гармоничное\" состояние (точнее сказать - привычное).\nОни больше других зависимы от отношений, от любви, постоянно в поиске её. Часто применяют манипуляции, чтобы привязать к себе.\nС раннего возраста наблюдается зависание на одном уровне, нежелание учиться, развиваться. У ребенка преобладает негативное мышление. Нет умения отпускать людей или что-то из своей жизни, начинать новые жизненные циклы.\nРекомендации родителям. Ребёнок испытывает жалость к себе и копирует жертвенное поведение от взрослых членов рода. Чтобы этого избежать, необходимо не стесняться проявлять любовь к ребёнку. Чаще проводить время вместе, напоминать, как он важен и нужен всем членам семьи. Необходимо сформировать у малыша адекватную самооценку, чтобы он понимал, что допустимо и что нет от окружающих по отношению к нему. Хорошо, если родители способствуют становлению веры в себя, поддерживают креативность, помогая развивать творческое начало ребёнка. Подрастающему члену рода важно научиться слышать свои желания и не бояться отвечать «нет».  Так возможно облегчить родовую карму и реализовать положительную программу рода: служение людям через создание пользы для окружающих, но при этом без жертвенности и причинения вреда самому себе.\n\n(8) Проблемы рода. Заключение в тюрьмы, репрессии. Представители предыдущих поколений могли быть осуждены при борьбе за справедливость. Также поколения, пострадавшие от несправедливости.\nНовые поколения могут нести на себе печать рода в виде постоянных судебных тяжб, разбирательств. В том числе причиной может стать не только правдоискательство, но и проблемы в характере самого человека: обидчивость, агрессивность, сетование на жизнь, что она несправедлива и трудна. Для таких людей характерно убеждение, что кругом ложь, вспыльчивость, впадание в депрессии.\nПри этом происходит хождение по кругу. Человек совершает одни и те же ошибки, попадая в похожие ситуации. Такие люди словно слепы и не желают извлекать уроки из опыта, учиться, развиваться. Мешает и нежелание меняться, гордыня, упрямство. При всех поисках правды в самом человеке отсутствует равновесие. Отсюда бескомпромиссность в позициях и суждениях, перегибы, поиски проблем в окружающих, а не в себе.\nРекомендации родителям. Ребёнка следует научить тому, что нельзя обвинять окружающих в своих проблемах и неудачах. Важно уметь быть объективным, находя причины в том числе и в себе. Для этого необходимо постоянно учиться, развиваться, познавать разные стороны жизни и основные законы мироздания. Конечно же, родители сами должны регулярно, транслировать ребёнку причинно-следственные связи (на своем примре и действиях окружающих).\nРодителям стоит придерживаться золотой середины во всем, показывая ребенку принцип гармонии и внутреннего равновесия. Необходимо дать знания ребёнку, которых нет в школьной программе, но они не менее важны для жизни. А именно: делать выводы из непростых ситуаций, обращать внимание на разные стороны и все возможные причины возникновения явлений (эффект взвешивания на весах). Так во взрослую жизнь он войдет с опытом самостоятельно извлекать жизненные уроки и не совершать одних и тех же ошибок.\n\n(16) Проблемы рода. Программа разрушения рода связана с агрессией, нанесением увечий, сильного физического ущерба и страдания многим людям. Войны, убийство многих душ, отрицание веры и разрушение храмов - могли быть в предыдущих поколениях рода. Кто-то из семьи в прошлом разрушал свою и чужие жизни.\nАгрессия могл быть направлена не только на окружающих, но и вовнутрь. Человек  участвовал в драках, разрушениях, наносил увечья. Либо сам представитель рода был сильно изувечен при этом - инвалидность, парализация и т.д.\nУ ребёнка могут быть в жизни различные опасные ситуации, разрушения внешние (для здоровья и физического тела) и внутренние (хаос в душе, склонность к агрессии, попытки суицида, неконтролируемые эмоции, вспыльчивость, импульсивность). Такие дети с раннего возраста беспечно относятся к своему телу и здоровью, много рискуют. Когда подрастают, становятся еще более безбашенными, совершая поступки с неоправданным риском для жизни. Для ребенка характерно негативное отношение к жизни, нежелание духовного развития, торможение личностного роста. Много опасностей и повышенный травматизм.\nРекомендации родителям. Ребёнок с кармой, отягощённой склонностями к физическому разрушению, нуждается в максимальной гармонизации и духовном развитии. Важнейшая роль в этом у его родителей.\nНужно научить ребёнка принимать перемены в жизни без страха и смело двигаться вперёд во всех направлениях.  При этом жить в осознанности, действуя без чрезмерного риска, не разрушая себя. Особое внимание следует обратить и на физическое развитие малыша, приучить его к здоровому образу жизни, передать основы здоровых привычек, правильного питания. Так не возникнет зависимости, перепадов настроения и чрезмерной агрессии. Ребенку будет проще контролировать себя и анализировать своё состояние.\nВашему наследнику важно духовного развиваться, развивать креативность - особенно как умение посмотреть на вещи «под новым углом». Более серьёзно регулировать свои мысли и действия. Необходимо буквально на протяжении всей жизни без остановки учиться и духовно развиваться, впоследствии передавая опыт другим.\nПотенциал рода - духовный наставник. При правильном воспитании ребёнок сможет очистить карму рода и быть успешным в своём призвании.",
                    "created": "2021-12-19T21:40:04.051637Z",
                    "edited": "2021-12-19T21:40:04.051637Z",
                    "type_id": 5,
                    "language": "ru",
                    "personal": false,
                    "combination": "2",
                    "gender": "",
                    "type": "expandable",
                    "title": "Уроки по роду мужской линии",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 309,
                    "content": "(5) Проблемы рода. Преграды в передаче знаний. Гордыня в оценивании людей по субъективному «умный»/«глупый». Чересчур жёсткие, непримиримые взгляды на самые разные вещи. Категоричность в оценках. Возможна семейная магия. В прошлых и новых поколениях разрывы семейных отношений, войны между родственниками.\nРодители и старшие родственники очень деспотичны и консервативны. Не принимают ничего нового или отличного от их мировоззрения. Постоянно стремятся учить других, навязывать свои взгляды и жизненные принципы. Обычно оценивают людей по уму. Любят доминировать, проявлять свою власть. Хотят, чтобы им подчинялись, спрашивали совета, признавали их ум и мудрость. Такие люди считают правыми только себя, вступают в споры очень агрессивно, часто создают конфликты на пустом месте \"по убеждениям\".\nПри этом наблюдается сильная зависимость от семейных уз. Взрослые буквально не дают жить детям, молодому поколению. Стремятся к влиянию на их жизнь, полному контролю, не дают ничего решать, вмешиваются во все. У них высокие требования к себе и близким. Что часто материально выражается даже в маниакальной любви к чистоте и порядку в быту. Такое поведение на глубоком уровне от страха быть неуслышанным, непонятым, не передать опыт и важную информацию (родовая карма записана буквально в крови, но не осознается).\nРекомендации родителям. Начинать проработку семейного сценария следует с себя. Развивайте в себе и ребёнке позитивное мышление, не бойтесь учиться новому. Важно воспитать ребёнка так, чтобы он не перенял пагубный родовой опыт, чтобы мог жить в мире, принимать людей, не спорил ожесточенно. При этом важно прийти к миру с родственниками и поощрять семейные ценности, традиции. Хорошо показать ребёнку мир в его разнообразии: религий, культур, природы. Так малыш научится, что есть различные мнения, и они имеют право на существование.\nГлавное, чтобы ребенок научился работать с информацией, получал знания. Но не делал это из гордыни как самоцель. Полученные знания необходимо применять на своем опыте и передавать дальше в мир. Самое сложное для родителей - перестать считать себя на 100% правыми, прислушиваться к ребёнку и его желаниям, потребностям, принимать любую точку зрения ребёнка. Так с раннего возраста у юного члена рода будет возможность побороть неуверенность в себе, различные страхи и сомнения. А когда подрастёт, научится свободно выражать своё мнение, не навязывая его другим.\n\n(7) Проблемы в роду. Постоянные конфликты родственников или войны с представителями другого рода. Агрессивность и эгоцентричность выражается в том, что такой человек идёт к своей цели напролом, нарушая границы других людей. Кармические последствия могут быть в проблемах с опорно-двигательным аппаратом (в том числе в результате дорожных аварий). Также встречаются полные противоположности вплоть до того, что новое поколение в роду не имеет целей в жизни, никуда не движется, не может реализовать себя в результате бесхарактерности. Человек не знает, чего хочет, мечется по жизни, но не понимает причин всего этого.\nВзрослые члены рода могут проявлять излишнюю авторитарность, вести себя воинственно, часто с агрессией как к другим членам рода, так и к окружающим. Нередко это правдорубы, которые ищут одним им понятную справедливость. Они редко делят мир на плохое и хорошее, добро и зло, не принимая промежуточных вариантов. Такие бескомпромиссные личности очень требовательны к другим, особенно к близким. Они предпочитают контроль и подавление силой нежели договариваться. А это, в свою очередь, как и чрезмерная активность, приводит к нервным срывам, перенапряжению. Такие люди не умеют жить просто, спокойно в гармони и потоке, не могут расслабляться и не дают другим.\nРебёнок в такой семье, напротив - может быть ленивым, никогда не доводить дело до конца, не брать на себя ответственность. Он будет избегать принятия решений. Наблюдается буквально наплевательское отношений к физическому телу, небрежность, апатия, привычка опаздывать. Если родители сами любят создавать себе трудности, враждебно настроены к окружающему миру (воспринимая его как поле битвы), то ребёнок у них часто может, наоборот, быть не реализованным в обществе, не иметь интересов, ничем не заниматься. Проблем добавляют его разбросанность в действиях, неумение долго концентрироваться на одной цели.\nРекомендации родителям. Неплохо понаблюдать за малышом и найти ему правильное занятие, хобби. Например спорт, который поможет выработать правильные привычки, закалить характер, приучит к здоровому образу жизни и уходу за свои телом.\nНужно научить ребёнка ставить перед собой правильные достижимые цели и добиваться результата. Показать ему, как важно верить в свою победу, но и научить с достоинством принимать поражения (делая из них правильные выводы для дальнейшего движения). Чтобы ребенок мог преодолеть лень и пассивность, родителям стоит поддерживать его в самых разных начинаниях. Помочь найти мотивацию и взрастить ответственность, чтобы подрастающий представитель рода смог принимать решения, строить свою судьбу самостоятельно и даже стать лидером - прямая задача взрослых.\n\n(12) Проблемы рода. Огромную роль играет накопленная в роду жертвенность. Синдром жертвы передается от поколения к поколению. Члены рода постоянно испытывают нехватку любви извне, поддержки и одобрения. Нередко от этого включается программа самоуничтожения. Возможно, в роду были повешенные, страдальцы, инвалиды. Огромную родовую печать накладывают пострадавшие физически, финансово, морально предки. Особенно от того, что были лишены возможности двигаться вперед.\nЛибо от деятеьности членов рода могли становиться в жертвами другие люди. Их страдания перешли на потомство мучителей.\nС такой родовой программой чаще всего вырастают абъюзеры, созависимые люди, с синдромом жертвы или другими психологическими отклонениями. Особенно сильно это сказывается на личной жизни.\nУже у малыша наблюдается чрезмерная требовательность в любви и внимании. При этом сам ребенок вырастает не любящим себя, с чувством ненужности  обреченности, как будто ему что-то недодали. Дефицит любви к себе приводит в отношения с токсичными партнёрами. От этого возникают частые депрессии, апатия, болезненные состояния. Общая усталость и отсутствие жизненной энергии становятся буквально спутниками человека.\nЕсли не складываются личные отношения, такие люди начинают проявлять ненужную жертвенность сначала к самым близким, потом и к окружающим вплоть до знакомых и коллег. Они не любят себя, считают никчёмными и ненужными. Нуждаются в постоянном проявлении любви и одобрения. Хотят, чтобы люди подчеркивали их нужность и значимость. Навязчивые идеи о том, что любви нет и никто человека не любит, приводят к излишней ранимости и обидчивости (часто на пустом месте) по принципу \"сам придумал/додумал - сам обиделся\".\nЧрезмерная привязанность к объекту любви, желание полностью владеть им и контролировать тоже не делает счастливее. В результате в отношениях человек постоянно страдает, никуда не движется, не развивается, как бы находится в подвешенном состоянии.\nНежелание проживать собственную жизнь, все время уделяя близким, детям, родителям, мужу/жене, друзьям, но не себе - встречается одинаково у женщин и мужчин с такой родовой кармой. Берут на себя слишком много чужих проблем и обязанностей, что усугубляет синдром жертвы. Хотя кажется, что они настоящие спасатели, но страдать такому человеку жизненно необходимо. Это его \"гармоничное\" состояние (точнее сказать - привычное).\nОни больше других зависимы от отношений, от любви, постоянно в поиске её. Часто применяют манипуляции, чтобы привязать к себе.\nС раннего возраста наблюдается зависание на одном уровне, нежелание учиться, развиваться. У ребенка преобладает негативное мышление. Нет умения отпускать людей или что-то из своей жизни, начинать новые жизненные циклы.\nРекомендации родителям. Ребёнок испытывает жалость к себе и копирует жертвенное поведение от взрослых членов рода. Чтобы этого избежать, необходимо не стесняться проявлять любовь к ребёнку. Чаще проводить время вместе, напоминать, как он важен и нужен всем членам семьи. Необходимо сформировать у малыша адекватную самооценку, чтобы он понимал, что допустимо и что нет от окружающих по отношению к нему. Хорошо, если родители способствуют становлению веры в себя, поддерживают креативность, помогая развивать творческое начало ребёнка. Подрастающему члену рода важно научиться слышать свои желания и не бояться отвечать «нет».  Так возможно облегчить родовую карму и реализовать положительную программу рода: служение людям через создание пользы для окружающих, но при этом без жертвенности и причинения вреда самому себе.\n\n(11) Проблемы рода. В прошлом, возможно, были проявления разбоя, бандитизма, маниакальные наклонности в чём-либо. С таким числовым кодом рождаются мятежники и революционеры, которые необыкновенно активны и двигают целые массы народа. Среди представителей рода могут встречаться личности с противоположным посылом от трудоголизма до полного бессилия. В роду возможно насилие. В том числе такое, когда кто-то в роду не смог контролировать свою силу и начал применять ее против людей (либо против себя).\nВзрослых представителей рода буквально выжигает пожар внутренней энергии, которая переходит в грубую силу. При этом мешает человеку развиваться духовно. Отсюда появляются тираны, агрессоры, которые давят на окружающих, проявляют свою силу при каждом случае от командования и навязывания своего мнения до физического насилия. Такие люди грубы и бескомпромиссны, излишне возбудимы, они не умеют отдыхать и расслабляться (и другим не дают). Излишний трудоголизм, износ себя в результате приводят к противоположному состоянию, которое характеризуется бессилием, нерешительностью, вялостью и апатией.\nОтсутствие вдохновения, творческой работы приводит к враждебности, одержимости идеями, сильной зацикленности. Часто у таких личностей проявляется упрямство, неоправданная гордыня. Чрезмерный контроль над жизнью не даёт положительных результатов. По итогу человек может сам создавать для себя трудные ситуации, чтобы мужественно преодолевать их, направляя на это свой избыток энергии. Без войны с людьми и обстоятельствами жизнь немыслима. Поэтому дела, вопросы и ситуации, которые у других не вызывают трудностей, превращаются для подобных людей в настоящую проблему.\nРекомендации родителям. Воспитывайте ребенка в гармонии с собой, умеющим владеть собой, правильно прикладывать свою силу и внутреннюю энергию на благо. Важно объяснить ребёнку, что все люди разные, каждый имеет свои таланты и способности, каждый может жить в соответствии со своими убеждениями и выполнять что-то в своём собственном темпе. Не стоит бросаться кого-то подгонять, осуждать и тем более давить. Людей нужно воспринимать такими, какие они есть, со всеми достоинствами и недостатками.\nНеобходимо научить ребенка достигать результата при помощи вдохновения, развивая в нём творческий потенциал. Если он будет применять силу, будет одержимым, это приведет лишь к саморазрушению в данном случае.\nНа собственном примере покажите, как можно, нужно и не стыдно просить о помощи и предлагать её.\nПри проявлении агрессии у ребенка помогите малышу направить её в здоровое русло, выброс такой энергии должен быть экологичным. Способствуйте развитию позитивного мышления, что поможет избежать зацикленности.\n\n(16) Проблемы рода. Программа разрушения рода связана с агрессией, нанесением увечий, сильного физического ущерба и страдания многим людям. Войны, убийство многих душ, отрицание веры и разрушение храмов - могли быть в предыдущих поколениях рода. Кто-то из семьи в прошлом разрушал свою и чужие жизни.\nАгрессия могл быть направлена не только на окружающих, но и вовнутрь. Человек  участвовал в драках, разрушениях, наносил увечья. Либо сам представитель рода был сильно изувечен при этом - инвалидность, парализация и т.д.\nУ ребёнка могут быть в жизни различные опасные ситуации, разрушения внешние (для здоровья и физического тела) и внутренние (хаос в душе, склонность к агрессии, попытки суицида, неконтролируемые эмоции, вспыльчивость, импульсивность). Такие дети с раннего возраста беспечно относятся к своему телу и здоровью, много рискуют. Когда подрастают, становятся еще более безбашенными, совершая поступки с неоправданным риском для жизни. Для ребенка характерно негативное отношение к жизни, нежелание духовного развития, торможение личностного роста. Много опасностей и повышенный травматизм.\nРекомендации родителям. Ребёнок с кармой, отягощённой склонностями к физическому разрушению, нуждается в максимальной гармонизации и духовном развитии. Важнейшая роль в этом у его родителей.\nНужно научить ребёнка принимать перемены в жизни без страха и смело двигаться вперёд во всех направлениях.  При этом жить в осознанности, действуя без чрезмерного риска, не разрушая себя. Особое внимание следует обратить и на физическое развитие малыша, приучить его к здоровому образу жизни, передать основы здоровых привычек, правильного питания. Так не возникнет зависимости, перепадов настроения и чрезмерной агрессии. Ребенку будет проще контролировать себя и анализировать своё состояние.\nВашему наследнику важно духовного развиваться, развивать креативность - особенно как умение посмотреть на вещи «под новым углом». Более серьёзно регулировать свои мысли и действия. Необходимо буквально на протяжении всей жизни без остановки учиться и духовно развиваться, впоследствии передавая опыт другим.\nПотенциал рода - духовный наставник. При правильном воспитании ребёнок сможет очистить карму рода и быть успешным в своём призвании.\n\n(13) Проблемы рода. Обычно отягощают родовую карму предки, которые погибли в войнах. Либо были ранние/необычные смерти: в роду умирали не своей смертью, погибли трагически либо по непонятным обстоятельствам, не дожив положенного срока. Подобную карму дают и родственники - прожигатели жизни.\nВ смягченном арианте может быть непринятие перемен, невозможность перестраиваться на новые циклы жизни, которые внезапно возникают по различным внешним причинам.\nУ таких детей бывает хаос в мыслях и сумасбродность в действиях, принятие импульсивных решений. Склонность к резкости, агрессивности. Часто начатое не доводится до конца. Ребенок не способен долго концентрироваться на чём-то. Часто в поступках проявляет безбашенность, готов рисковать жизнью, возможно увлечение чем-то экстремальным.\nРебёнок как будто играет со смертью, абсолютно не ценит жизнь. Живёт одной ногой с вами, одной ногой в другом мире. Может проявлять жестокость и хладнокровие даже по отношению к близким. Жизнь ими воспринимается как поле битвы. Такая личность склонна создавать препятствия на пустом месте, напряжение, в которое вовлекаются все вокруг. А затем всё это мужественно преодолевается. Так продолжается циклически по кругу как необходимость их существования.\nБолее спокойные люди с такой кармой испытывают постоянный страх за жизнь близких. Цепляются за прошлое во всех проявлениях: за умерших родственников, прошлые отношения. Вплоть до того, что абсолютно не принимают перемен, будущего, не могут переходить из одного жизненного этапа в другой. На бытовом уровне у них в доме часто захламлённость, хаос. Зависание в прошлом опасно и грозит склонностью к суицидальным мыслям.\nРекомендации родителям. Правильно будет учить ребёнка концентрироваться на одном деле, доводя его до конца. Нужно объяснить, что жизнь - это не поле битвы. И тем более не стоит самостоятельно создавать себе сложности там, где их нет.\nОбязательно прорабатывать агрессию. Можно использовать для этого вариант умеренно  экстремальных видов активности - например, скалодром.\nВажно научить ребенка легко расставаться со старыми вещами. Этому способствуют совместные генеральные уборки. Так на элементарном уровне ребенок будет приучаться  впускать новое в свою жизнь, расставаясь со старым, отжившим.\nНе стоит пугаться детских разговоров о смерти. Не рассказывайте сказки, а прямо и честно расскажите об этом, подбирая нужные слова, которые будут понятны ребёнку (в зависимости от возраста).\n\n(20) Проблемы рода. Возможна очень глубокая по сложности ситуация. Какое-то нарушение естественного течения отношений, жизни в роду. Например, один из родственников остался сиротой или жил при очень холодных, жёстких и даже жестоких, отстранённых родителях. Либо не было поддержки по роду, отсутствие прощения от рода или осуждение. Также наблюдается передающийся через поколения страх смерти по причине повторяющихся неестественных или страшных смертей в роду (например, убийств).\nСуды с родственниками, конфликты, осуждение и неприятие родителей могут продолжаться и в настоящем. При зацикленности на семье, страхе смерти близких в то же время между членами рода присутствует неумение прощать, категоричность, мстительность, неуважение старших в роду.\nПод влиянием взрослых с их неразрешёнными проблемами вырастает человек агрессивный и категоричный, всех осуждающий и старающийся подчинить собственной воле. Либо, как противоположность - безвольная и ведомая личность, с отсутствием четких целей и ориентиров в жизни, без стержня в характере. Есть некоторая размытость и низкий уровень развития, социализации. Нередко при этом врождённые тяжёлые кармические болезни. Ребёнок с таким поведением и характером служит взрослым как бы зеркалом, отражающим их сущность. И одновременно преподносит жизненный урок.\nПри неразвитости социальных связей, невозможности реализоваться в жизни иногда происходит уход в низкие энергии. Решив познать мир и его законы (пока непостижимые для неподготовленного сознания), ребёнок может начать тянуться к тематике, связанной со смертью, миром мёртвых, тёмной магией. Его не пугает, а наоборот - чрезмерно интересует эта сторона жизни. Причем, если не прорабатывать с таким ребёнком этот вопрос, свою силу он может в будущем использовать в корыстных целях.\nРекомендации родителям. Необходимо с детства воспитывать ребёнка в почитании старших и тесном общении с родственниками. Для этого самим родителям придётся проделать огромную работу: наладить родственные связи и найти точки взаимодействия со всеми членами рода. Никто не должен быть забыт. Как можно чаще стоит устраивать семейные праздники, собирая всех за одним столом. Способствовать правильному воспитанию будут и семейные традиции, и совместное составления генеалогического дерева. Рассказывайте о предках рода, не утаивая каких-либо историй (для такого ребенка это важно). Тогда наследник сможет получить поддержку рода. Это даст ему возможность в будущем прославить свой род и даже Родину, такой личности с проработанной кармой откроется власть и известность.\nВозможно с раннего возраста развитие у ребёнка чувствования тонкого мира. Неплохо помогать развивать интуицию малышу. Делать это нужно постепенно и аккуратно. Если пугают сны, видения, есть страх смерти, обязательно обсудить это. Объяснять нужно всё честно, ничего не скрывая и не увиливая от вопросов.  Подбирайте правильные слова и сравнения сообразно с возрастом ребёнка для его понимания.",
                    "created": "2021-12-19T21:40:04.774727Z",
                    "edited": "2021-12-19T21:40:04.774727Z",
                    "type_id": 5,
                    "language": "ru",
                    "personal": false,
                    "combination": "5",
                    "gender": "",
                    "type": "expandable",
                    "title": "Уроки по роду женской линии",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": false,
                  "positions": [
                   [
                    "a1",
                    "a2",
                    "a"
                   ],
                   [
                    "f",
                    "s2",
                    "s1"
                   ],
                   [
                    "y",
                    "s3",
                    "s4"
                   ],
                   [
                    "g",
                    "p2",
                    "p1"
                   ],
                   [
                    "k",
                    "p4",
                    "p3"
                   ]
                  ]
                 },
                 {
                  "imageName": "talents",
                  "title": "Таланты ребенка",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 160,
                    "content": "Какими способностями обладает ребенок? Что следует делать родителям, для того, чтобы помочь ему раскрыть заложенный потенциал? Что блокирует таланты ребенка? Найти ответы на эти вопросы поможет информация из этого раздела.",
                    "created": "2021-10-13T19:50:07.21739Z",
                    "edited": "2021-10-13T19:50:07.21739Z",
                    "type_id": 103,
                    "language": "ru",
                    "personal": false,
                    "combination": "",
                    "gender": "",
                    "type": "info",
                    "title": "Таланты ребенка",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 138,
                    "content": "(1) Ребенок рождён с талантом первооткрывателя, изобретателя и первопроходца. Он быстро осваивает большое количество информации, новые знания даются ему легко. Ему необходимо делиться с миром своими открытиями. С рождения обладает качествами лидера, ловко заводит новые знакомства, вдохновляет людей своими идеями. Такой ребенок искусно владеет ораторским мастерством, может одним точным высказыванием объяснить то, что многим не удастся передать десятками предложений. Он умеет красиво и емко выражать мысли не только устно, но и в письменной речи. Ребенок способен улаживать конфликты и быть посредником в спорах. Кроме всего прочего, его особым даром является то, что он может добиться больших результатов совершенно в любом деле, если будет уделять ему достаточно внимания. Ему в целом любые начинания даются довольно легко. Родителям необходимо поддерживать его творческие идеи. Это важно для того, чтобы у него сформировалась уверенность в себе и своих силах. Он легко воплощает в жизнь свои желания. Проявление эгоизма и высокомерное отношение к другим, в частности к братьям и сестрам, блокирует таланты.\n\n(13) Ребёнок обладает креативным мышлением, сможет придумать что-то уникальное, то, что до него ещё никто не делал. У него есть способность трансформировать всё вокруг, влияя своей энергетикой на окружающий его мир. Имеет дар целителя. Ребёнок находит возможности в любой, даже сложной ситуации, умеет сохранять ясность мыслей. Ему не стоит бояться перемен и различных изменений, так как страх блокирует развитие таланта. Во взрослой жизни он с лёгкостью сможет приносить изменения в судьбы других людей или реализовать себя в экстремальных профессиях, которые требуют крепких нервов и полного контроля над собой.\n\n(14) Природа одарила этого ребенка творческими способностями. Он чувствует желания своей души и ему важно им следовать. Развитию таланта способствует доверие к миру, ощущение защищенности и безопасности. Лучшее, что могут дать родители — это подарить эту уверенность. Нужно научить ребенка быть благодарным за то, что есть сейчас и проявлять терпение, тогда раскрытию талантов ничего не помешает. Он - прирождённый дипломат, который умеет дать верный совет. Такой ребёнок может вносить равновесие в сложные взаимоотношения, знает, как найти выход из трудных ситуаций. В любой ситуации он ищет «золотую середину», старается решить возникающие конфликты мирным путём. Для него важно устранить все разногласия между своим внутренним и внешним миром. В будущем его будут ценить за спокойствие, сдержанность, внешнюю мягкость и внутреннюю гармонию, а также за умение посмотреть на ситуацию со стороны и медленно, но уверенно двигаться к целям.",
                    "created": "2021-10-13T19:44:49.275712Z",
                    "edited": "2021-10-13T19:44:49.275713Z",
                    "type_id": 7,
                    "language": "ru",
                    "personal": false,
                    "combination": "1",
                    "gender": "",
                    "type": "expandable",
                    "title": "Таланты от рождения",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 332,
                    "content": "(5) Артистизм, ораторское мастерство, умение убеждать и влиять на людей, вести за собой - творческие данные вашего ребёнка. У него в будущем проявятся также отличные способности к преподаванию, умению работать с информацией и структурировать её. Такие люди самые сложные вещи умеют донести простым языком и сделать доступными. Это настоящие просветители и организаторы. У ребёнка также своеобразный дар гармонизировать пространство и атмосферу вокруг, что делает его личность особенно притягательной. В будущем хорошие возможности для создания счастливой крепкой семьи, которая станет опорой и поддержкой во всём.\nРекомендации родителям. Чтобы ребёнку было легче развивать свои таланты, важно привить с детства любовь к организованности и порядку. Так способности смогут проявляться наиболее ярко в гармоничном окружении. Не забывайте поддерживать родственные отношения, проводя время вместе как можно чаще и устраивая семейные посиделки без повода. Воспитывайте малыша в уважении к другим людям и принятии всех их особенностей, в терпимости и интересу к разным культурам, точкам зрения. Важно показывать всё это родителям на собственном примере.\n\n(16) Таланты по линии женского рода. От предков достался дар трансформаций. Это настоящий революционер и разрушитель. Но некие общественные рамки и стереотипы он разрушать будет не в качестве самоцели. Это ещё и созидатель. В будущем ему будет что предложить обществу взамен отживших способов действий или жизненных ограничений. Такие люди имеют неизменно оптимистичный взгляд на жизнь и  смело идут вперед, не пасуя  перед трудностями.\nРекомендации родителям. Для развития природного дара полезно много времени уделять просмотру научных программ, чтению технической литературы. Ребёнку может быть интересно, как устроены самые разные вещи, механизмы, а также жизненные процессы и тело человека. Станьте мудрым спутником малыша на пути его развития, поддерживая в победах и тем более - в неудачах. Формируйте активное, деятельное отношение к жизни, воспитывайте ответственность. Плохо, если в семье взрослые зациклены на чём-то, живут закрыто в страхе перемен. Такой настрой может навсегда заблокировать таланты ребёнка.\n\n(11) Дар мощнейшей внутренней энергетики. Такие люди - буквально вечные двигатели, которые и окружающих заряжают оптимизмом, жаждой движения, энергией. Вне зависимости от данных от рождения (семья, образование, уровень достатка) такой ребёнок сможет многого достичь в будущем благодаря своей работоспособности, популярности в своём кругу, хорошей интуиции. При этом важно, чтобы энергия была направлена на благо, но не на подавление или агрессию. Не исключено, что потенциал ребёнка раскроется в будущем через энергетическое целительство.\nРекомендации родителям. Для развития способностей и баланса жизненной силы полезно организовать активность ребёнка правильно, чередуя работу/учёбу с отдыхом. Излишняя энергия может найти выход в занятиях спортом, что будет только на пользу. Важно не распыляться в делах, а научиться фокусировать своё внимание и ставить конкретные цели. Агрессия, излишняя возбудимость, активность на износ может заблокировать природные данные ребёнка. Поэтому научите его перераспределять силу грамотно, жить в балансе, использовать свою энергию только во благо, но не на подавление других. Добиваться своего важно разумными компромиссами и логикой, но не навязывать свои принципы или давить авторитетом.",
                    "created": "2021-12-27T10:40:00.777714Z",
                    "edited": "2021-12-27T10:40:00.777714Z",
                    "type_id": 8,
                    "language": "ru",
                    "personal": false,
                    "combination": "5",
                    "gender": "",
                    "type": "expandable",
                    "title": "Таланты по женской линии",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 350,
                    "content": "(2) Такой ребёнок - прирожденный дипломат, который умеет сглаживать острые углы и разрешать конфликты. Именно поэтому к нему тянутся окружающие, чтобы обрести гармоничное состояние от общения или примирить враждующие стороны.\nДля таких детей характерна также способность к эмпатии, высокий уровень чувствительности. С одной стороны, малыш чувствует чужую боль как свою и может сильно переживать от этого. С другой, это помогает налаживать контакты с людьми, открывает возможности видеть вещие сны и развивать интуицию. Не удивляйтесь, обнаружив актёрский талант у малыша либо тягу к природе, живому миру.\nРекомендации родителям.\nНе препятствуйте прирождённым склонностям и интересам ребёнка, особенно связанным с развитием интуиции, умению чувствовать, восприимчивости. Таким детям легко даётся всё, что связано с растениями, животными. Способствуйте этим хобби.\nЧтобы получить поддержку рода и энергетические ресурсы, необходимо воспитывать зрелую личность, которая сможет преодолевать лень и пассивность. Научите ребёнка прямо говорить о своих чувствах и желаниях, выражать собственные эмоции. Покажите пример честного и открытого поведения с окружающими, близкими.\nВажно наладить контакты с родственниками, примирению может помочь сам ребёнок. Если есть конфликты, непонимание с родом (особенно женского пола - мамой, бабушкой), таланты ребёнка не будут раскрываться. Но не забывайте и позаботиться о гармонии во внутреннем мире самого малыша. Помогите ему понять себя, принять свою двойственность и сложную натуру, полюбить своё тело и заботиться о нём. Если не будет гармонии, то возможны проблемы с деторождением в будущем без физических отклонений (то есть преграды на уровне подсознания, \"проблема в голове\", как говорят).\n\n(10) У ребёнка талант общаться, легко находить язык со всеми, организаторские качества. Это помогает ему быть душой компании, осваиваться в любой новой обстановке, сотрудничать с самыми разными людьми. Также ребёнок использует свою интуицию, умеет слышать внутреннее Я, поэтому оказывается в нужное время в нужном месте.\nТакие люди - настоящие везунчики, они ловят удачу и добиваются успеха, благосостояния легко. Умеют встроиться в нужный поток и буквально управлять удачей. Находящиеся рядом или в тесных взаимоотношениях буквально разделяют их успех. Близким, друзьям или соратникам такого человека удаётся найти своё предназначение, хорошо устроиться в жизни.\nРекомендации родителям.\nДары судьбы, данные ребёнку от рождения, обязательно следует реализовать. Для этого всей семье нужно перестроить сознание, особенно старшему поколению. Не зацикливаться на деньгах, проще относиться ко многим вещам, стараться решать любые вопросы творчески. Полезно чаще бывать в новых местах, путешествовать, знакомиться с людьми, принимать участие в праздниках и самим их устраивать.\nС раннего возраста важно внушить наследнику азы финансовой грамотности, научить распоряжаться деньгами. Нельзя тяжело работать или копить деньги только ради денег. В жизни должен постоянно присутствовать живой поток обмена опытом, нового, знакомств, знаний.\n\n(8) Таким детям присуще острое чувство справедливости и законопослушности, тяга к регулированию прав, познанию законов. Им легко даётся понимание связи различных событий. Аналитический склад ума, таланты организатора в совокупности с умением координировать масштабные проекты с огромным количеством участников - всё это позволяет реализовывать самые смелые замыслы.\nКроме того, ребёнок умеет нести, правильно подавать себя в обществе, выражает себя ярко и не испытывает ложного смущения. При всём этом такая личность умеет соблюдать баланс в жизни, пропорционально выстраивая и развивая каждую из её сфер.\nЧасто есть способности к астрологии, нумерологии и другим наукам, позволяющим познать себя, раскрыть своё истинное предназначение и определить жизненный путь.\nРекомендации родителям.\nЧтобы помочь ребёнку самореализоваться, нужно участие всех членов рода. Родителям важно воспитывать малыша в честности и искренности. Самим всегда говорить правду, не давать ложных надежд и обещаний. Любые проявления нечестности блокируют развитие ребёнка, закрывая родовые энергетические каналы.\nИзучайте вместе законы мироздания, черпайте энергию не только из привычных ресурсов, но и от общения с природой, правильного мышления, оптимистичного настроя. Обязательно учите наследника благодарности - одной из мощнейших практик. Не забывайте делать это каждый день. Учите осознанному отношению ко всему. Разбирайте трудности,  неудачи сразу. При этом учите ребёнка не замыкаться и не винить себя, не жалеть, а правильно задавать вопросы. Например: \"Как сделать, чтобы было лучше? Чему научила меня эта ситуация?\" Так он сможет сделать верные выводы, которые замотивируют идти дальше, а не будут акцентировать внимание на неудаче.",
                    "created": "2021-12-27T10:41:57.544769Z",
                    "edited": "2021-12-27T10:41:57.544769Z",
                    "type_id": 9,
                    "language": "ru",
                    "personal": false,
                    "combination": "2",
                    "gender": "",
                    "type": "expandable",
                    "title": "Таланты по мужской линии",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 279,
                    "content": "(1) Раскрыть потенциал ребенка помогут занятия, предполагающие выступления на публике, такие, как театральный кружок, музыкальная школа, а также ведение блога в социальных сетях. Писательство, тренирует умение перерабатывать и передавать информацию другим. Хорошим вариантом вне учебной деятельности может стать литературный кружок или секция юных журналистов и телерепортеров. Важную роль в формировании навыка красивой речи и общего мировоззрения играет чтение книг. Этот ребенок, с его новаторским мышлением, скорее всего проявит интерес к изобретательству, поэтому можно рассматривать любые научные кружки. Также хорошо изучать иностранные языки. У ребенка от природы «золотые» руки и он способен создавать поистине уникальные вещи. Занятие вышивкой, создание поделок из бисера и сборка конструктора из мелких деталей, раскрашивание тонких узоров, лепка, оригами и множество других интересных дел, требующих сноровки пальцев, терпения и усидчивости, помогут в развитии способностей. Кроме всего прочего ребенку может быть интересно постижение азов финансовой грамотности, предпринимательства, умения обращаться с деньгами.\n\n(13) Таланты ребенка реализуются благодаря присутствию в выбранном им виде занятий элемента новизны, азарта, движения и даже риска. Его вдохновляет неизвестность и преодоление собственного страха. Из активных видов деятельности его смогут увлечь скалолазание, спортивная борьба, бокс, мото- и автоспорт, туризм, троеборье, преодоление полосы препятствий, паркур, катание на сноуборде, скейтборде, трюковом самокате. Кружок изобретателей, радиолюбителей, программирования, конструирования и робототехники также помогут развить врожденные способности. Ребенку принесут пользу дополнительные занятия в научных секциях, где ставятся практические эксперименты и опыты - это может быть химия, биология, физика. Возможно, его всерьез заинтересует медицина.\n\n(14) Этот ребенок отличается богатым внутренним миром, стремлением к прекрасному. Важно создать ему условия для свободы творчества и самовыражения. Развить способности ему помогут занятия в театральной студии, музыкальной школе, в кружках художественного творчества и хореографии. Мыловарение, художественная обработка дерева или конструирование из лего, макраме, шитье, вышивка позволят ребенку реализовывать свои способности к созданию чего-то изящного и уникального своими руками. Кроме того, ему могут быть интересны и кулинарные эксперименты. Это обширное поле деятельности для ребенка с творческим видением, от создания нового рецепта, до креативной подачи блюда и красивой сервировки стола. Также ему пойдут на пользу занятия йогой, растяжкой и плаванием - они помогут восстанавливать силы и лучше справляться с эмоциями.",
                    "created": "2021-10-31T22:57:21.499503Z",
                    "edited": "2021-10-31T22:57:21.499503Z",
                    "type_id": 10,
                    "language": "ru",
                    "personal": false,
                    "combination": "1",
                    "gender": "",
                    "type": "expandable",
                    "title": "Направления увлечений, хобби и кружков по интересам",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": false,
                  "positions": [
                   [
                    "b",
                    "b1",
                    "b2"
                   ],
                   [
                    "f",
                    "s2",
                    "s1"
                   ],
                   [
                    "g",
                    "p2",
                    "p1"
                   ]
                  ]
                 },
                 {
                  "imageName": "",
                  "title": "Самореализация ребенка",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 161,
                    "content": "Каждый родитель желает своему ребенку процветания и благополучия. В этом разделе собрана информация о том, какие навыки и качества необходимо развивать для его успешной самореализации в жизни.",
                    "created": "2021-10-13T19:59:14.16588Z",
                    "edited": "2021-10-13T19:59:14.16588Z",
                    "type_id": 104,
                    "language": "ru",
                    "personal": false,
                    "combination": "",
                    "gender": "",
                    "type": "info",
                    "title": "Самореализация ребенка",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 27,
                    "content": "(5) Такого ребёнка ожидает успех в работе, связанной с получением информации и дальнейшей передачей знаний. Это можно реализовать преподавательской деятельностью в любой области, но особенно успешно в: истории, религии, программировании, психологии, науке или медицине. Кроме того, в качестве будущей специализации можно рассматривать сферы, где традициям, порядку и учёту цифр уделяется достаточное внимание. Например, подойдет работа юристом, экономистом, управленцем, консультантом, наставником или бухгалтером. Также он сможет стать основателем учений, открывать собственные школы или записывать различные курсы. Поэтому при выборе образования стоит уделить особое внимание направлениям, которые способствуют развитию таких навыков, как умение анализировать и структурировать получаемую информацию. А также таким, где совершенствуется ораторское мастерство.",
                    "created": "2021-10-03T18:35:50.776119Z",
                    "edited": "2021-10-03T18:35:50.776119Z",
                    "type_id": 11,
                    "language": "ru",
                    "personal": false,
                    "combination": "5",
                    "gender": "",
                    "type": "expandable",
                    "title": "Направление деятельности, варианты будущих профессий",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 50,
                    "content": "Родителям необходимо развивать в ребёнке лидерские качества, ставить перед ним цели, давать самостоятельность и свободу выбора. Также, окружающим стоит предлагать ему руководящие роли, например, стать старостой в классе. При его воспитании необходимо уделять внимание вопросу здоровой конкуренции. Родителям нужно обязательно донести до него мысль, о том, как важно не паразитировать за счет слабых, а добиваться успехов заслужено. Для такого ребёнка агрессия может стать проблемой - необходимо научиться справляться с негативными эмоциями.  Умение брать на себя ответственность и работать в команде пригодятся в будущем. Эти качества стоит развивать с детских лет. Важным навыком будет умение доводить начатое до конца и достигать своих целей.  Поэтому со школьного возраста необходимо учить ставить цели, планировать, вести дневник успехов. Такому динамичному ребенку обязательно нужно учиться отдыхать. Хорошо взять за правило по крайней мере один день в неделю посвящать семейному активному отдыху. Кроме того, энергичный жизненный стиль должен стать привычкой. Например, можно освоить велосипед, ролики, коньки, лыжи. Или обратить внимание на командные виды спорта - они помогут развить необходимые навыки. Подвижность важна и будет иметь влияние на финансовый успех.\n\n(16) Абсолютное «нет» для ребёнка - зацикливание на материальных предметах и одержимость ими. Важно ему донести, что это не трагично, когда что-то сломалось или испортилось, что не нужно бояться потерять свои игрушки, вещи -  у всего есть срок службы. Не стоит и самим родителям сокрушаться по этому поводу, дабы не транслировать своему ребёнку подобное поведение. Тем более не ввязываться в споры и разборки, где делят деньги или иные ценные вещи. Для достижения благополучия в будущем ребёнку важно уметь жить без излишеств и не чувствовать при этом себя ущемленным. Нужно учиться быть благодарным за то, что имеешь. Ему желательно чередовать активность и спокойные игры, искать гармонию и баланс во всём. Проявление агрессии может отрицательно сказываться на его финансовом потоке, поэтому важно научиться через игры сбрасывать все негативные эмоции.\n\n(20) Материальный успех ребёнка в будущем будет зависеть от хороших отношений с семьей, поэтому стоит максимально поддерживать родственные связи. Родителям важно помочь ребёнку и деликатно направить, заинтересовать семейными ценностями, традициями, историей. Своим примером показывать, что нужно уважать старших родственников, чтить тех, кого уже нет рядом. Также важно учить ребенка мыслить позитивно, менять негативные убеждения на позитивные. «У меня ничего не получается» изменить на «У меня все и всегда удается, я стараюсь и вижу результат». На этом необходимо заострить внимание, поскольку дети быстрее притягивают к себе то, о чем думают и говорят. Всё потому, что у них сознание более восприимчиво, чем у взрослых. Кроме всего прочего, нужно развивать в ребёнке интуицию и учить его доверять своему внутреннему компасу. В его будущем особо остро встанет вопрос поиска призвания, поэтому ему стоит чаще обращать внимание на свои истинные желания. Важно, чтобы он слушал интуицию, внутренний отклик, понимал себя. Тогда эти навыки помогут найти работу мечты. Более того, его амбиций хватит для того, чтобы с успехом прославить свою семью или даже Родину.\n\n(4) Для того, чтобы во взрослой жизни не было проблем с финансами, нужно развивать качества лидера и чувство справедливости. Также необходимо ставить перед ребенком цели, для того, чтобы в дальнейшем он научился этому сам. Важно давать самостоятельность и свободу выбора, предлагать выполнять руководящие роли в коллективе, например, старостой класса в школе. В обучении и воспитании этого ребенка нет места давлению, принуждению, авторитарным методам, так как в последующем это может негативно отразится на его взаимоотношениях с людьми. Ему нельзя идти по головам, ради достижения своих целей. Умение поддерживать полезные связи и общаться с мужчинами, в частности с отцом, также будет влиять на финансовую сторону его жизни. Ребенку важно брать на себя ответственность и признавать ошибки, идти на компромисс и уметь договариваться. Родителям необходимо поддерживать его интерес к получению образования в сфере менеджмента, государственного или муниципального управления. Ему важно стать хозяином собственной жизни и стремится к руководству. С раннего детства родителям стоит обращать свое внимание на игры, ориентированные на развитие бизнес-навыков и посвященных семейному бюджету и планированию. Например, «Магазин» или «Купи-Продай». Это репетиция реального шопинга. Необязательно использовать для оплаты листики, пусть дети привыкают к настоящим деньгам. Как проходит игра: Игроки расставляют на столе различные товары с ценниками, решают, кто будет покупателем, а кто продавцом. Задача первого – собрать нужную сумму на покупку и получить сдачу, а задача второго – пересчитать полученное. Такая игра позволит прокачать навыки финансовой грамотности и повысить интеллект в этой сфере.",
                    "created": "2021-10-03T18:35:52.135967Z",
                    "edited": "2021-10-03T18:35:52.135967Z",
                    "type_id": 12,
                    "language": "ru",
                    "personal": false,
                    "combination": "7",
                    "gender": "",
                    "type": "expandable",
                    "title": "Для достижения успеха важно",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": false,
                  "positions": [
                   [
                    "x2",
                    "x",
                    "c1",
                    "c2",
                    "c"
                   ]
                  ]
                 },
                 {
                  "imageName": "destiny",
                  "title": "Предназначение ребенка",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 162,
                    "content": "Предназначение - это те цели и задачи, которые необходимо выполнить в течение жизни. Взрослым не стоит перекладывать на ребенка свои ожидания, а нужно позволить ему проживать свою судьбу. Подробно о том, какие качества следует развивать для того, чтобы ребёнок смог выполнить свои жизненные задачи написано в этом разделе.",
                    "created": "2021-10-13T20:03:09.228993Z",
                    "edited": "2021-10-13T20:03:09.228993Z",
                    "type_id": 105,
                    "language": "ru",
                    "personal": false,
                    "combination": "",
                    "gender": "",
                    "type": "info",
                    "title": "Предназначение ребенка",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 169,
                    "content": "(7) Миссия этого ребёнка связана с постоянной активностью и движением. Ни много ни мало, его жизненная задача - изменить мир собственными достижениями, успехами в карьере, получить признание в той сфере, которую он выберет. Его победы должен увидеть мир, а результаты трудов должны приносить пользу. Призвание ребенка – действовать. Ему важно понять, что нельзя сидеть и ждать, пока кто-то – судьба, родители или работодатели – о нем позаботятся. Лень, скука, однообразие, хаотичность в действиях и необдуманность поступков будет играть против него. Родителям важно развивать лидерские качества ребенка, учить его брать на себя ответственность - тогда во взрослой жизни ему будет легче добиться успеха. Уже с детства ему можно учиться ставить цели и достигать их, и важно делать это мирным путём, а не любой ценой. Для реализации своего предназначения ему необходимо овладеть навыком выстраивать отношения с коллективом, быть его яркой его частью, при этом важно делегировать и распределять задачи в команде, а не стараться делать все самому. Важно подобрать физическую активность по душе, например, посещать спортивные секции, которые прививают любовь к здоровому образу жизни, а также развивают дисциплину. Ему нужно завести дневник целей и планов, записывать в него все, что он хочет достичь и фиксировать успехи.  Будучи взрослым, он сможет делиться своим опытом с другими, рассказывать, как он шел к реализации своих замыслов, что мешало, а что, наоборот, дало толчок к достижениям, и его путь вдохновит других.\n\n(5) Постоянно изучать что-то новое и делиться накопленными знаниями - жизненная миссия этого ребёнка. Ему важно быть открытым всему непознанному, идти вперед, легко меняя устаревшие взгляды, ломая навязанные стереотипы – именно так он сможет воплотить в жизнь свое предназначение. Чтобы ребенок успешно реализовал свою миссию, ему необходимо постоянно что-то исследовать, поэтому родителям стоит поощрять его желание получать знания, выбирать соответствующие секции, покупать интересные книги. Однако, для того чтобы он не хватал знания поверхностно, а стремился погрузиться в них, следует обсуждать с ним изученный материал, узнавать на сколько он понял суть изложенного или увиденного, как к этому относится лично и где смог бы применить. Ребенок обладает способностями к педагогике, поэтому важно объяснить ему чем отличается совет от нравоучения, и что не стоит пытаться решать за окружающих их задачи. Занятия по развитию ораторского мастерства помогут раскрыть его таланты и поспособствуют дальнейшей реализации в целом. С появлением такого ребёнка в семье важно создавать новые семейные традиции, чаще собираться с родными и проводить время вместе, стараться найти общий язык с близкими. Например, можно каждые выходные устраивать уборку всё семьей, чтобы у каждого была своя задача и объем работы. Совместный труд объединяет домочадцев, научит ребенка уважать чужую работу и поддерживать порядок в доме. Для его успешного будущего значимы хорошие отношения с отцом, важно чтобы папа был наставником и авторитетом. Родители могут помочь ребёнку избавиться от неуверенности и сомнений, тогда он легко сможет стать примером для многих.\n\n(12) Миссия этого ребенка – служение людям. Ему необходимо эмоционально контактировать с этим миром, изучать его, принимать во всем несовершенстве. Его жизненные принципы - это любовь, сострадание и милосердие. Он видит всё под другим углом и может предложить свое нестандартное решение на многие вопросы. Ребенок любит помогать и хочет быть полезен людям, отчего ему сложно даются отказы. Важным навыком на пути реализации его предназначения будет умение сказать «нет», когда просьба противоречит его планам или желаниям. Этому родителям нужно учить его ещё с детства, иначе вырастет человек угождающий окружающим вопреки желаниям своего сердца. Самая главная задача ребенка относиться к себе с такой же любовью, какую он дарит другим. Родителям следует помочь своему чаду найти занятие по душе, чтобы оно приносило удовольствие. Для него подойдут занятия, развивающие творческие способности, художественные таланты и нестандартное мышление. Для этого у ребенка есть все данные. Для выхода из состояния неопределенности и инертности необходимы занятия фитнесом, йога или другой активный отдых. Одной из главных задач родителей этого ребенка - помочь ему изучить свой внутренний мир, научиться понимать себя, а также окружающих и их эмоции. Это поможет ребенку обрести иное видение и открыть для себя уникальные возможности.",
                    "created": "2021-10-13T20:04:57.085397Z",
                    "edited": "2021-10-13T20:04:57.085398Z",
                    "type_id": 13,
                    "language": "ru",
                    "personal": false,
                    "combination": "7",
                    "gender": "",
                    "type": "expandable",
                    "title": "Первое, личное предназначение",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 174,
                    "content": "(12) Миссия этого ребенка – служение людям. Ему необходимо эмоционально контактировать с этим миром, изучать его, принимать во всем несовершенстве. Его жизненные принципы - это любовь, сострадание и милосердие. Он видит всё под другим углом и может предложить свое нестандартное решение на многие вопросы. Ребенок любит помогать и хочет быть полезен людям, отчего ему сложно даются отказы. Важным навыком на пути реализации его предназначения будет умение сказать «нет», когда просьба противоречит его планам или желаниям. Этому родителям нужно учить его ещё с детства, иначе вырастет человек угождающий окружающим вопреки желаниям своего сердца. Самая главная задача ребенка относиться к себе с такой же любовью, какую он дарит другим. Родителям следует помочь своему чаду найти занятие по душе, чтобы оно приносило удовольствие. Для него подойдут занятия, развивающие творческие способности, художественные таланты и нестандартное мышление. Для этого у ребенка есть все данные. Для выхода из состояния неопределенности и инертности необходимы занятия фитнесом, йога или другой активный отдых. Одной из главных задач родителей этого ребенка - помочь ему изучить свой внутренний мир, научиться понимать себя, а также окружающих и их эмоции. Это поможет ребенку обрести иное видение и открыть для себя уникальные возможности.\n\n(6) Главная жизненная задача этого ребёнка - принять и полюбить себя безусловно, таким какой есть и не стремиться быть идеальным. Он обладает чувственной натурой. Его дар - умение работать в команде, способность получать наилучший результат в партнерстве или в окружении единомышленников. Ребенку следует показывать миру любовь к людям, окружающим вещам, замечать простые поводы для радости рядом каждый день. Родителям важно помочь ему обрести внутренний стержень и быть независимым от чужого мнения, научиться делать самостоятельный выбор и не сомневаться в его правильности. Сосредоточиться на позитивных качествах в людях, принимать их со всеми недостатками и отказаться от осуждения или агрессии - одна из задач ребенка на жизненном пути. Родителям следует учить его мыслить позитивно, и что не стоит категорично делить мир на чёрное и белое, а следует принимать и любить его целиком, во всём его многообразии. Важно помочь понять ребенку, что ошибки совершают все. Иногда можно позволить ошибаться как себе, так и другим. Нужно быть терпимее и милосерднее. Умение оставаться собой в мире, который постоянно пытается сделать человека кем-нибудь другим — величайшее достижение.",
                    "created": "2021-10-13T20:04:58.166172Z",
                    "edited": "2021-10-13T20:04:58.166172Z",
                    "type_id": 13,
                    "language": "ru",
                    "personal": false,
                    "combination": "12",
                    "gender": "",
                    "type": "expandable",
                    "title": "Второе, социальное предназначение",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": false,
                  "positions": [
                   [
                    "h",
                    "j",
                    "m",
                    "n",
                    "t",
                    "z",
                    "s"
                   ]
                  ]
                 },
                 {
                  "imageName": "intellect",
                  "title": "Мышление ребенка",
                  "blockType": "default",
                  "blocks": [
                   {
                    "id": 373,
                    "content": "В этом разделе описаны кармические уроки ребенка. Здесь могут находиться основные страхи и комплексы, блоки, установки, которые мешают не только ребенку, но и будут раздражать его родителей. Эти энергии довольно часто уходят в минус и указывают на такие качества, которые сам ребенок может не осознавать или бояться признаться себе в них. Несмотря на это, они будут существенно влиять на его жизнь, тормозить на пути и являться причиной негативных ситуаций. ",
                    "created": "2021-12-27T10:55:40.787356Z",
                    "edited": "2021-12-27T10:55:40.787356Z",
                    "type_id": 106,
                    "language": "ru",
                    "personal": false,
                    "combination": "",
                    "gender": "",
                    "type": "info",
                    "title": "Мышление ребенка",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 379,
                    "content": "(6) У ребёнка нет чувства, что его любят. Он не понимает, как правильно воспринимать и принимать любовь. Сложности возникают даже с близкими от собственнических чувств и ревности до открытых конфликтов, конкурирования.\nБоится, что без любви окружающих не сможет ничего достигнуть, максимально зависим от чужой оценки, мнения. Поэтому старается всячески заслужить любовь через следование за авторитетным в обществе человеком. Часто живет не своими желаниями, целями, а теми, которые навязаны со стороны либо в тренде в обществе, в его кругу.\nЕсли не получается добиться признания и любви, такой ребёнок замыкается и начинает ненавидеть других. Не слушает советы, а если даже сам их просит, то всё равно делает по-своему. Возникают сложности с самостоятельностью, принятием выбора в жизни. Часто может в будущем связаться с тираничным или токсичным партнёром.\nРекомендации родителям. Важно понять, что для вашего ребёнка любовь - это наивысшая ценность. Необходимо научить правильно принимать и отдавать её, правильному восприятию любви. Причём это чувство должно быть многосторонним, не однобоким. Та самая человеческая любовь, которая включает в себя много аспектов: братская, любовь к ребёнку и родным, Родине, платоническая и телесная, страсть и нежность.\nНе бойтесь дать ребёнку \"слишком много\" любви. Он действительно нуждается как в тёплых словах, так и в поступках, заботе. Пусть даже и выражающихся в простых объятиях.\nНельзя показывать ребёнку, что какая-то раса, вера или чьё-то положение в обществе лучше. А кто-то хуже по внешности, уму и т.д. Но для этого необходимо самому быть примером терпимости и лояльности к окружающим. Проработайте отношения в семье или со своим партнёром. Относитесь с одинаковым уважением и вниманием к людям разных социальных слоёв. На собственном примере обучайте дружить, взаимодействовать, помогать. А главное - самостоятельно принимать решения и строить свою жизнь без подсказок со стороны.\n\n(4) Такой ребенок растёт достаточно жёстким, хладнокровным, требовательным и не в меру деспотичным. Проявляет высокие запросы даже к друзьям и близким, из-за чего возникают проблемы в общении, выстраивании социальных связей.\nДевочка будет требовать повышенного внимания, расти капризной. У неё много мужского в характере и преобладание именно маскулинной энергии, \"мальчишеских черт\". Она может не любить куклы и с раннего возраста предпочесть игры с мальчиками. При этом растёт задирой, стараясь постоянно соревноваться и ни в чём им не уступать.\nВ будущем у такой девушки могут возникнуть проблемы с противоположным полом, трудности с выстраиванием личной жизни. Либо с материнством, деторождением, воспитанием детей.\nВ семье растёт ребенок с очень логичным складом ума. Такой девочке чуждо всё женственное, она может не принимать себя и своё тело, женскую природу. Особенно трудности могут начаться в подростковый переходный период. Ребёнку сложно проявлять свои чувства, эмоции. Вырастает деспотичная авторитарная личность. И чем меньше родители дают малышке тепла, ласки, тем больше в ней страха отчуждения, потери родителей. Поэтому дочь начинает буквально контролировать, давить даже на близких.\nРекомендации родителям. Важно помочь девочке быть женственной, проявить ей своё женское начало. Полюбить себя, свою внешность, своё тело и собственную природу. Развивать интуицию, умение прислушиваться к себе, креативные способности. Маме нужно быть как можно ближе к дочери, наглядно давая ей правильную модель женского поведения. Это значит не тащить всё на себе (даже если в семье нет папы) или хотя бы не акцентировать на этом внимание. Стараться делегировать дела, заниматься вместе женскими хобби (от выращивания цветов до рукоделия). Необходимо научить девочку быть мягкой, мудрой, доброй и - при необходимости - гибкой.\nСтальной характер, принципиальность, бескомпромиссность сослужат такому ребёнку в жизни плохую службу. Важно показать девочке правильные ценности в иерархии общества: уметь уважать авторитет и более высоких по должности людей, правильно относится к ровесникам или тем, кто ниже по положению. Это значит ровно, без унижения и страха в первом случае и без деспотизма, жестокости, гордыни - во втором.\nНа всю жизнь девочки будет влиять авторитет взрослого мужчины из ее близкого окружения, поэтому никогда нельзя говорить плохо об отце ребёнка. Если мама растит девочку одна, то хорошо, чтобы перед глазами у дочери была правильная модель мужского поведения. Эту роль может на себя взять друг семьи, крёстный отец, дедушка, брат, дядя или другой достойный родственник.\n\n(18) У такой девочки много иллюзий, фобий и страхов. От этого чувство одиночества, непонятости, чрезмерная чувствительность, обидчивость. Всё в совокупности приводит к душевным страданиям. Если невозможно выразить свои чувства, разделить с кем-то страхи, ребёнок уходит в иллюзорный мир. Среди таких личностей много фантазёров и игроманов, живущих в иной реальности.\nОни вообще много внимания уделяют внешней стороне жизни, забывая про саморазвитие. Например, девочка много заботится о своей внешности, красоте, но не учится, не самосовершенствуется. То есть присутствует неправильное восприятие себя и своей женственности.\nТакой ребёнок непрактичен и уязвим, поддаётся пагубному влиянию других. Может быть зависимым, заниматься излишним самопожертвованием.\nРекомендации родителям. Помогите ребёнку развивать интуицию. Пусть её повышенная чувствительность станет проводником во внешний мир для успеха коммуникаций, а не уводит в виртуальную реальность. Важно научить малышку правильно владеть своей фантазией и воображением. Например, можно вместе составлять карту желаний. У таких детей мощнейшая энергия на визуализацию и исполнение задуманного.\nДевочке важно помочь раскрыть женскую сущность, перераспределив энергию. Она должна преобразовывать не только свою внешность, но и пространство вокруг. Овладевать навыками хозяйки, заботиться о близких, быть мягкой.\nЧтобы наладить контакты дочери с ровесниками, чаще приглашайте их в гости, показывайте пример радушия и доброты, угощайте за общим столом и обсуждайте интересные вещи.\nТакой ребёнок имеет тесную связь с Луной и сильно может зависеть от её циклов. Гармонизировать лунное влияние возможно, отслеживая лунные циклы и используя их на пользу девочки. Например, при убывающей Луне не стоит давать дочери интенсивных нагрузок, особенно связанных с умственной деятельностью. Чтобы ребёнок лучше понимал себя и не путался в собственных эмоциях, не утопал в страхах, говорите с ним. Не игнорируйте фобии и опасения, разделите это с ребёнком, стараясь аргументировано их развеять (но ни в коем случае не смеяться над ними).",
                    "created": "2021-12-27T11:01:35.159555Z",
                    "edited": "2021-12-27T11:01:35.159555Z",
                    "type_id": 15,
                    "language": "ru",
                    "personal": false,
                    "combination": "6",
                    "gender": "",
                    "type": "expandable",
                    "title": "Подсознательные страхи и блоки",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": false,
                  "positions": [
                   [
                    "d",
                    "c",
                    "d1",
                    "d2"
                   ]
                  ]
                 },
                 {
                  "imageName": "forecast",
                  "title": "Прогноз на год",
                  "blockType": "forecast",
                  "blocks": [
                   {
                    "id": 301,
                    "content": "(1) Слова взрослых в этот период будут оказывать особенно сильное влияние на ребенка. Родителям следует учитывать это и стараться как можно больше взаимодействовать с ним, именно через речь. Даже если он еще слишком мал, для того, чтобы говорить - словарный запас всё равно копится, и усилия родителей не пройдут бесследно, а помогут ребенку заговорить. На этом этапе жизни хорошо уделить внимание развитию фантазии и образного мышления. С малышами можно заниматься, показывая различные картинки и рассказывая ему истории, читая сказки, а подросток и сам может начать сочинять рассказы или стихи. Если у ребенка есть братья или сестры, то возможно возникновение конкуренции между детьми за внимание родителей. Для того, чтобы это не переросло в регулярные конфликты, взрослым необходимо наладить контакт с каждым и уделять время всем, чтобы никто не чувствовал себя обделенным. Этот период располагает к большому количеству общения в жизни и расширения круга знакомств. Хорошее время для получения новых знаний, совершенствования уже имеющихся навыков и достижения успехов в учебе. Полезно делать или мастерить что-то руками, развивать ловкость рук. Может появиться необходимость приобретения новой техники в образовательных целях, взрослым не стоит игнорировать эту потребность. В это время, как никогда, важна поддержка родителей и их вера в успех ребенка. Не следует высмеивать его идеи, какими бы невероятными они не казались. На самом деле они могут быть очень ценными.\n\n(4) Родителям девочки необходимо принимать ее индивидуальность, мягко направлять ее в сторону развития женственности и безусловно поддерживать ее во всем. Особенно значимы взаимоотношения с отцом, поэтому важно его непосредственное участие в воспитании и жизни ребенка. Взрослым нужно предоставлять девочке возможность самостоятельно выбирать и принимать решения. Благодаря этому она научится дисциплине и ответственности. В этот период состав семьи может расширится за счёт рождения мальчика или девочки с сильным, волевым характером. Также в жизни девочки может появится мальчик или мужчина, который сыграет важную роль в её судьбе, например, учитель, тренер, наставник, друг родителей или одноклассник.\n\n(5) В этот период родителям стоит уделить особое внимание вопросу общения с ребенком, ему просто необходимо получать их поддержку. Взрослым следует поощрять его тягу к знаниям, делиться ценными советами и собственным опытом. Кроме того, в это время вероятен переход на следующую ступень обучения, например, из средней школы в старшую. Взрослым необходимо следить за тем, чтобы ребенок соблюдал баланс учебы и отдыха, не зарывался в процессе получения знаний. Благоприятный момент для пополнения в семье. Вероятно, участие ребенка в мероприятии, связанном с какой-либо традицией, в том числе религиозной, например, он может побывать на свадьбе или венчании. В это время необходимо уделять больше внимания чистоте в доме. Родителям следует научить ребёнка поддерживать порядок, привлекать его к процессу уборки. Кроме того, важно раскладывать всё по полочкам и в мыслях. Период будет учить тому, что нужно уважительно относиться ко времени, стараться не опаздывать и соблюдать режим дня. Кроме всего прочего, возможно получение какого-то официального документа, например, аттестата или паспорта.",
                    "created": "2021-11-20T21:24:59.572208Z",
                    "edited": "2021-11-20T21:24:59.572209Z",
                    "type_id": 18,
                    "language": "ru",
                    "personal": false,
                    "combination": "1",
                    "gender": "",
                    "type": "info",
                    "title": "0",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 189,
                    "content": "(5) В этот период родителям стоит уделить особое внимание вопросу общения с ребенком, ему просто необходимо получать их поддержку. Взрослым следует поощрять его тягу к знаниям, делиться ценными советами и собственным опытом. Кроме того, в это время вероятен переход на следующую ступень обучения, например, из средней школы в старшую. Взрослым необходимо следить за тем, чтобы ребенок соблюдал баланс учебы и отдыха, не зарывался в процессе получения знаний. Благоприятный момент для пополнения в семье. Вероятно, участие ребенка в мероприятии, связанном с какой-либо традицией, в том числе религиозной, например, он может побывать на свадьбе или венчании. В это время необходимо уделять больше внимания чистоте в доме. Родителям следует научить ребёнка поддерживать порядок, привлекать его к процессу уборки. Кроме того, важно раскладывать всё по полочкам и в мыслях. Период будет учить тому, что нужно уважительно относиться ко времени, стараться не опаздывать и соблюдать режим дня. Кроме всего прочего, возможно получение какого-то официального документа, например, аттестата или паспорта.\n\n(22) В это время важно довериться течению событий, впускать перемены и новые возможности в свою жизнь. Ребенок почувствует желание быть независимым от родителей. Взрослым не стоит ограничивать его общение, для него важно знакомиться с новыми людьми из самых разных сфер жизни. Период хорош для того, чтобы пробовать что-то новое, преодолевать страхи и получать свежий опыт. В это время необходимо пользоваться возможностями для различных поездок, начиная от выездов до дачи или на природу, заканчивая путешествиями по всему миру. Тур слёт, олимпиада, выездные соревнования, отпуск родителей - важно по максимуму пользоваться шансами, даруемыми судьбой. Если игнорировать предоставляемые возможности, то могут возникнуть обстоятельства, ограничивающие передвижение. Необходимо очищать пространство вокруг от всего старого - часто ребенок “прикипает” к чему-то, к какой-то вещи, которая может быть сломана или уже изжила себя. В целом период наполнен радостью и счастьем.\n\n(9) В это время ребёнку больше чем обычно потребуется возможность бывать в уединении. Период благоприятен для того, чтобы погрузиться в себя, заняться творчеством, развивать свой креативный потенциал и врожденные таланты. Родителям не стоит дополнительно навязывать ему одиночество или ограничивать общение. Ребенок сам чувствует, насколько ему необходимо побыть одному. В данный период родителям необходимо помочь ему обрести веру в себя, поддерживать его, не дать замкнуться в себе. Ребенку нужна возможность учиться думать самостоятельно, анализировать, узнавать разные точки зрения и делать выводы. Со стороны взрослых лучшим решением будет организовать досуг, где бы он смог бы контактировать с другими детьми, с которыми есть общие интересы, с животными или проводил бы время на природе. Это поможет ему наполниться энергией и вдохновением. Для данного периода характерно спокойное течение дел, без резких изменений в жизни или каких-то ярких социальных событий.",
                    "created": "2021-10-13T20:11:06.339484Z",
                    "edited": "2021-10-13T20:11:06.339485Z",
                    "type_id": 18,
                    "language": "ru",
                    "personal": false,
                    "combination": "5",
                    "gender": "",
                    "type": "info",
                    "title": "1-2.5",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 187,
                    "content": "(4) Родителям девочки необходимо принимать ее индивидуальность, мягко направлять ее в сторону развития женственности и безусловно поддерживать ее во всем. Особенно значимы взаимоотношения с отцом, поэтому важно его непосредственное участие в воспитании и жизни ребенка. Взрослым нужно предоставлять девочке возможность самостоятельно выбирать и принимать решения. Благодаря этому она научится дисциплине и ответственности. В этот период состав семьи может расширится за счёт рождения мальчика или девочки с сильным, волевым характером. Также в жизни девочки может появится мальчик или мужчина, который сыграет важную роль в её судьбе, например, учитель, тренер, наставник, друг родителей или одноклассник.\n\n(18) Сейчас ребёнку особенно нужен домашний очаг, хочется быть окруженным уютом и комфортом, важно совместное времяпрепровождение с родителями, друзьями и родственниками. Возрастает чувствительность ребенка или, наоборот, проявляется эмоциональная холодность. В данный период скорее всего будут появляться страхи. Они могут быть, как обоснованными, так и беспочвенным. Очень важно следить за тем, куда направлены его внимание и мысли. Если ребенок будет постоянно фокусироваться на негативе, то страхи могут реализоваться в жизнь. В это время мысли воплощаются быстрее и проще, чем обычно, поэтому так важно следить за их направлением. Если ребенок не может преодолеть страхи своими силами, то необходимо обратиться к специалисту по работе с сознанием, иначе подобный образ мышления может укорениться и отравлять жизнь на протяжении долгого времени. В этот период хорошо изучать историю, философию, мифологию, для тех, кто постарше возможно погружение в психологию. Это всё необходимо для того, чтобы наладить контакт с подсознанием. Также ребенку важно развивать интуицию, заниматься творчеством, связанным с образами, например, фотографией, созданием комиксов или картин с изображением абстракций, росписью на одежде.\n\n(22) В это время важно довериться течению событий, впускать перемены и новые возможности в свою жизнь. Ребенок почувствует желание быть независимым от родителей. Взрослым не стоит ограничивать его общение, для него важно знакомиться с новыми людьми из самых разных сфер жизни. Период хорош для того, чтобы пробовать что-то новое, преодолевать страхи и получать свежий опыт. В это время необходимо пользоваться возможностями для различных поездок, начиная от выездов до дачи или на природу, заканчивая путешествиями по всему миру. Тур слёт, олимпиада, выездные соревнования, отпуск родителей - важно по максимуму пользоваться шансами, даруемыми судьбой. Если игнорировать предоставляемые возможности, то могут возникнуть обстоятельства, ограничивающие передвижение. Необходимо очищать пространство вокруг от всего старого - часто ребенок “прикипает” к чему-то, к какой-то вещи, которая может быть сломана или уже изжила себя. В целом период наполнен радостью и счастьем.",
                    "created": "2021-10-13T20:11:05.109504Z",
                    "edited": "2021-10-13T20:11:05.109505Z",
                    "type_id": 18,
                    "language": "ru",
                    "personal": false,
                    "combination": "4",
                    "gender": "",
                    "type": "info",
                    "title": "2.5-3.5",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 191,
                    "content": "(7) Для этого периода характерно много движения, поездок, постоянное развитие, а также достижение целей и всевозможные победы. Рекомендуется провести его максимально активно. Все вокруг будет сопутствовать успеху, как в учебной, так и во внеурочной деятельности. Это время хорошо подходит для различных поездок и путешествий. Некоторые из них могут быть связаны с учёбой или участием в каких-то мероприятиях, например, олимпиаде или соревнованиях. Если в планах есть переезд, то этот период подходит как нельзя лучше. Родителям важно ставить перед ребёнком четкие цели и обязательно вместе радоваться при их достижении, нельзя оставлять успех незамеченным и воспринимать его как должное. Если полученный результат ниже ожидаемого, то взрослым нужно вместе с ребенком проанализировать ситуацию и объяснить, что не всегда все удается сразу. Не следует опускать руки, необходимо провести работу над ошибками и попробовать еще раз. Важно не ленится, учиться контролировать свои эмоции и агрессию. Хорошее время для начала нового проекта.\n\n(5) В этот период родителям стоит уделить особое внимание вопросу общения с ребенком, ему просто необходимо получать их поддержку. Взрослым следует поощрять его тягу к знаниям, делиться ценными советами и собственным опытом. Кроме того, в это время вероятен переход на следующую ступень обучения, например, из средней школы в старшую. Взрослым необходимо следить за тем, чтобы ребенок соблюдал баланс учебы и отдыха, не зарывался в процессе получения знаний. Благоприятный момент для пополнения в семье. Вероятно, участие ребенка в мероприятии, связанном с какой-либо традицией, в том числе религиозной, например, он может побывать на свадьбе или венчании. В это время необходимо уделять больше внимания чистоте в доме. Родителям следует научить ребёнка поддерживать порядок, привлекать его к процессу уборки. Кроме того, важно раскладывать всё по полочкам и в мыслях. Период будет учить тому, что нужно уважительно относиться ко времени, стараться не опаздывать и соблюдать режим дня. Кроме всего прочего, возможно получение какого-то официального документа, например, аттестата или паспорта.\n\n(12) Отношения родителей ребёнка могут переживать не лучшие времена. Напряжение в общении может выливаться в ссоры, которые изменят привычный уклад жизни семьи, а при неблагоприятном исходе вероятен развод родителей. Очень важно в этот период учиться относиться с любовью ко всем, даже к тем людям, которые допускают ошибки. В это время у ребенка может случиться разлад с кем-то из близких, возможно придётся отпустить кого-то из своего окружения. Чтобы сгладить данный период, родителям необходимо помочь ему реализовать себя в творчестве и всячески поддерживать его в этом. Результаты не заставят себя долго ждать. Время подходит для того, чтобы посмотреть на жизнь под другим углом. Хорошо реализовать желание помогать другим, участвовать в проектах, которые приносят пользу обществу или стать волонтером. Главное делать это не в ущерб себе. Родителям стоит чаще баловать ребёнка, делать ему подарки. Особое внимание нужно уделить его физическому развитию и здоровому питанию.",
                    "created": "2021-10-13T20:11:08.089168Z",
                    "edited": "2021-10-13T20:11:08.089169Z",
                    "type_id": 18,
                    "language": "ru",
                    "personal": false,
                    "combination": "7",
                    "gender": "",
                    "type": "info",
                    "title": "3.5-4",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 185,
                    "content": "(3) В этот период родителям необходимо уделить максимум внимания своему ребёнку. Особенно близкие отношения с дочерью следует выстроить маме. Ей важно научить дочку секретам ухода за собой, заботе о своём теле и ментальном здоровье. Именно в это время женские качества и черты девочки, такие, как нежность, доброта, приятный голос и красивая речь, будут особенно заметны окружающим. Также маме нужно помочь ей справиться комплексами по поводу внешности, если они возникли. В этот период в семье может случиться пополнение, вероятнее всего еще девочка или мальчик, который будет обладать мягким характером. Родителям необходимо распределить свое внимание между детьми так, чтобы удавалось провести время с каждым. Очень хорошо заниматься совместным творчеством, хозяйственными и бытовыми делами. Ребенку полезно иметь круг общения вне семьи - друзей и приятелей из садика, школы, двора, различных секций, с которыми она могла бы проводить время вместе, гулять, иметь общие интересы. Взрослым важно не поддаваться на манипуляции и капризы девочки, ведь так она начнет удовлетворять свои потребности за родительский счет, а в будущем начнёт это делать за счет других.\n\n(14) Подходящее время для раскрытия творческих способностей. Хорошо посещать выставки, галереи, музеи, кино, театры, стоит попробовать себя в интеллектуальных играх. Родители могут помочь ребёнку подобрать курсы, которые раскроют его творческий потенциал. Период будет учить размеренности, сдержанности, в это время не следует торопиться, ко всему надо относиться внимательно. В жизни ребенка могут сложиться ситуации, которые потребуют от него много терпения и смирения, повлиять на обстоятельства будет невозможно. Важно довериться течению событий и понять, что и такие периоды в жизни важны для того, чтобы найти внутреннюю гармонию и понять свои истинные желания. В этот период ребёнку важно соблюдать здоровый образ жизни и заботится о своем теле. Благоприятно пребывание у водоемов и занятия плаванием.\n\n(17) В данный период ребёнку необходимо заявить о себе миру, раскрыть свои таланты и показать их окружающим. Сцена, выступления, ведение блога в социальных сетях – всё это можно рассматривать, как способы проявить себя.  Важно выбрать такое увлечение, которое поможет ребёнку раскрепоститься и раскрыть все его способности. В этот период необходимо работать над уверенностью в себе, самооценкой, осознать свою ценность и уникальность. Для того, чтобы найти вдохновение рекомендуется посещать различные культурные мероприятия - театры, концерты, выставки, экскурсии. Период хорош для осознания того, что трудолюбие не менее важный фактор, чем талант. Для достижения успеха и получения признания, потребуется приложить усилия. В данный период возможна встреча с человеком, который сыграет знаковую роль в жизни ребенка или знакомства, которые приведут к судьбоносным событиям.",
                    "created": "2021-10-13T20:11:01.103162Z",
                    "edited": "2021-10-13T20:11:01.103162Z",
                    "type_id": 18,
                    "language": "ru",
                    "personal": false,
                    "combination": "3",
                    "gender": "",
                    "type": "info",
                    "title": "5",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 192,
                    "content": "(8) Необходимо завершить все ранее начатые и не доведенные до результата дела или проекты. Новые возможности откроются только после этого. Для данного периода не характерно бурное развитие событий или глобальные перемены. Будут складываться ситуации, в которых ребёнку важно научиться извлекать уроки, анализировать произошедшее с ним, особенно, если они повторяются уже не в первый раз. Взрослым не нужно пытаться уберечь его от ошибок, но следует помочь сделать правильные выводы и избежать их в будущем. В этот период родителям нужно как можно больше общаться с ребенком и стараться выстаивать доверительные отношения. Это поможет понимать его лучше и определиться с направлением обучения, так как сам он может запутаться в своих желаниях и взглядах. Родителям следует обратить внимание на то, какие убеждения и установки они закладывают в фундамент мировоззрения своего ребенка. «Поступать с другими нужно так, как бы хотелось, чтобы поступали с тобой» - вот главное правило, которому взрослым важно научить ребенка. Ему необходимо научиться гордиться собой и своими поступками.\n\n(20) Поддержка родственников в любых начинаниях очень значима для ребенка в этот период. Необходимо наладить взаимоотношения с родными, особенно с родителями и бабушками-дедушками. Хорошо в это время изучать семейную историю, погружаться в судьбы предков или даже попробовать воссоздать генеалогическое древо. Родителям не рекомендуется оставлять без внимания обиды ребенка. Необходимо научить его проговаривать свои негативные чувства, решать конфликты, а не замалчивать их. Ему нужно уважительно относиться к старшему поколению и находить общий язык. Если у самих родителей возникают конфликты с другими родственниками, то об этом необходимо открыто разговаривать с ребёнком, объяснять почему происходят подобные вещи и как важно уметь прощать, при этом не нужно перекладывать ответственность на других и обвинять кого-либо в произошедшем. В этот период у ребенка может усилиться интуиция, к нему будут приходить идеи и мысли, которые удивят даже его самого, а также может проявиться дар предчувствия. В этот период особенно важно принимать систему, частью которой является ребенок. Негативные мысли и критика государства, своего рода, родины действует губительно. Необходимо участвовать в общественной жизни и стараться принести пользу, прославить свою семью, школу или родной город. Возможен прорыв в обучении, достижение впечатляющих результатах на олимпиаде, например.\n\n(10) Период, в который могут произойти судьбоносные события. В это время обстоятельства складываются особенно удачливо. Важно получать удовольствие и радоваться каждому дню, необходимо научится доверять своей интуиции, жить в моменте «здесь и сейчас». Хороший период для путешествий, поездок. Важно относиться к ним легко и даже несколько авантюрно, например, поехать в отпуск спонтанно, без чемодана и тщательного планирования. Родителям нужно помочь ребёнку справляться с ленью, научиться понимать собственные желания и цели. В этот период будут открываться счастливые возможности и встречаться нужные люди. Все задуманное будет исполняться довольно легко, но важно отпускать свои желания, а не зацикливаться на них.",
                    "created": "2021-10-13T20:11:08.489384Z",
                    "edited": "2021-10-13T20:11:08.489384Z",
                    "type_id": 18,
                    "language": "ru",
                    "personal": false,
                    "combination": "8",
                    "gender": "",
                    "type": "info",
                    "title": "6-7.5",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 189,
                    "content": "(5) В этот период родителям стоит уделить особое внимание вопросу общения с ребенком, ему просто необходимо получать их поддержку. Взрослым следует поощрять его тягу к знаниям, делиться ценными советами и собственным опытом. Кроме того, в это время вероятен переход на следующую ступень обучения, например, из средней школы в старшую. Взрослым необходимо следить за тем, чтобы ребенок соблюдал баланс учебы и отдыха, не зарывался в процессе получения знаний. Благоприятный момент для пополнения в семье. Вероятно, участие ребенка в мероприятии, связанном с какой-либо традицией, в том числе религиозной, например, он может побывать на свадьбе или венчании. В это время необходимо уделять больше внимания чистоте в доме. Родителям следует научить ребёнка поддерживать порядок, привлекать его к процессу уборки. Кроме того, важно раскладывать всё по полочкам и в мыслях. Период будет учить тому, что нужно уважительно относиться ко времени, стараться не опаздывать и соблюдать режим дня. Кроме всего прочего, возможно получение какого-то официального документа, например, аттестата или паспорта.\n\n(6) Родителям нужно уделить ребенку особое внимание и чаще проявлять заботу в это время. Ему будет необходимо больше нежности и тактильных проявлений любви. Также взрослым важно укреплять его уверенность в себе, для того чтобы в будущем он не зависел от мнения окружающих. В этот период необходимо научить ребёнка любить себя, принимать свои особенности и ценить собственную уникальность. Ему благоприятно найти дело по душе, окружать себя атмосферой уюта, развивать чувство вкуса. В этот период хорошо принять участие в новом проекте, который связан со сферой творчества, красоты, или проявить себя в большом коллективе. Важно наполнить жизнь ребенка разнообразным общением, не препятствовать тому, чтобы он проводил время с друзьями, приятелями, хорошо заводить и поддерживать новые знакомства. В это время полезно заниматься творчеством, изучать искусство, посещать музеи и выставки, развивающие чувство прекрасного. Ребёнку необходимо заниматься физической активностью, которая приносит ему приятные ощущения, например, йогой, аэробикой или плаванием. Взрослым важно держать под контролем ситуации, в которых ребенок чувствует себя обиженным. Им необходимо первыми идти на примирение, просить прощения, стараться сглаживать острые углы и по возможности совсем избегать конфликтов. У ребёнка в это время могут возникнуть сложности с прощением - ему будет трудно отпустить обиду или забыть о случившемся.\n\n(11) Данный период благоприятен для того, чтобы реализовать заложенный в ребенке потенциал силы и лидерские качества. Ему необходимо проявляться в коллективе, на внеклассных мероприятиях, добиваться успеха в учёбе или достигать результатов в спорте. Полезно вести динамичный образ жизни, больше бывать на свежем воздухе, так как недостаток физической активности приведет к накоплению нерастраченной энергии, и может выразится в стремлении подавлять других, добиваться желаемого любой ценой. Спорт наполнит энергией и поможет «свернуть горы». В это время родителям важно тщательно следить за распорядком дня ребёнка и уделять достаточно внимания вопросам здоровья, распределяя занятия так, чтобы была возможность качественного отдыха.",
                    "created": "2021-10-13T20:11:06.339484Z",
                    "edited": "2021-10-13T20:11:06.339485Z",
                    "type_id": 18,
                    "language": "ru",
                    "personal": false,
                    "combination": "5",
                    "gender": "",
                    "type": "info",
                    "title": "7.5-8.5",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 191,
                    "content": "(7) Для этого периода характерно много движения, поездок, постоянное развитие, а также достижение целей и всевозможные победы. Рекомендуется провести его максимально активно. Все вокруг будет сопутствовать успеху, как в учебной, так и во внеурочной деятельности. Это время хорошо подходит для различных поездок и путешествий. Некоторые из них могут быть связаны с учёбой или участием в каких-то мероприятиях, например, олимпиаде или соревнованиях. Если в планах есть переезд, то этот период подходит как нельзя лучше. Родителям важно ставить перед ребёнком четкие цели и обязательно вместе радоваться при их достижении, нельзя оставлять успех незамеченным и воспринимать его как должное. Если полученный результат ниже ожидаемого, то взрослым нужно вместе с ребенком проанализировать ситуацию и объяснить, что не всегда все удается сразу. Не следует опускать руки, необходимо провести работу над ошибками и попробовать еще раз. Важно не ленится, учиться контролировать свои эмоции и агрессию. Хорошее время для начала нового проекта.\n\n(16) Перемены в этот период могут затрагивать буквально все сферы жизни ребенка. Возможны потери материального плана, особенно тех вещей, которым придается излишняя важность. Период будет учить принятию обстоятельств. Если сопротивляться переменам, то могут притянутся разрушения, физические травмы, или даже катастрофы и аварии. Чтобы избежать негативного влияния периода, родителям важно научить ребенка быть гибким, подстраиваться под ситуации, проявлять жизнелюбие и искать во всем позитивные моменты, воспринимать неудачи, как опыт и видеть в них возможность для личностного роста. Проявление у ребёнка чрезмерных амбиций может разрушать что-то стабильное и уже устоявшееся. В этот период важно осознать, что разрушение чего-то старого обязательно открывает новые возможности. Хорошее время для формирования у ребёнка принципов нравственности и понятия о морали. Родители могут ограничить чрезмерные удовольствия, например, следить за временем, которое ребенок проводит за гаджетами или сколько съедает сладкого в день. Этот период отлично подходит для выработка навыка дисциплины. Родителям нужно поспособствовать развитию у ребёнка чувства сопереживания и навыка взаимовыручки. Благоприятно помогать людям или животным, которые оказались в трудных обстоятельствах.\n\n(5) В этот период родителям стоит уделить особое внимание вопросу общения с ребенком, ему просто необходимо получать их поддержку. Взрослым следует поощрять его тягу к знаниям, делиться ценными советами и собственным опытом. Кроме того, в это время вероятен переход на следующую ступень обучения, например, из средней школы в старшую. Взрослым необходимо следить за тем, чтобы ребенок соблюдал баланс учебы и отдыха, не зарывался в процессе получения знаний. Благоприятный момент для пополнения в семье. Вероятно, участие ребенка в мероприятии, связанном с какой-либо традицией, в том числе религиозной, например, он может побывать на свадьбе или венчании. В это время необходимо уделять больше внимания чистоте в доме. Родителям следует научить ребёнка поддерживать порядок, привлекать его к процессу уборки. Кроме того, важно раскладывать всё по полочкам и в мыслях. Период будет учить тому, что нужно уважительно относиться ко времени, стараться не опаздывать и соблюдать режим дня. Кроме всего прочего, возможно получение какого-то официального документа, например, аттестата или паспорта.",
                    "created": "2021-10-13T20:11:08.089168Z",
                    "edited": "2021-10-13T20:11:08.089169Z",
                    "type_id": 18,
                    "language": "ru",
                    "personal": false,
                    "combination": "7",
                    "gender": "",
                    "type": "info",
                    "title": "8.5-9",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 302,
                    "content": "(2) Ребенок будет очень нуждаться в достаточном количестве внимания со стороны матери. Маме следует транслировать ему спокойствие и гармонию, окружить своей заботой. В дальнейшем, эта эмоциональная привязанность может сыграть важную роль в жизни ребенка. В это время в семье могут произойти какие-то события, которые родителям захочется скорее забыть или сохранить в секрете. Всё же, нужно помнить, что, все тайное рано или поздно становится явным. Подходящее время для формирования полезных привычек и здорового образа жизни, правильного питания. Хорошо чаще бывать на природе, за городом. Если ребенок не ощущает внутренней гармонии, то это будет отражаться на его внешности. Проявляться дисбаланс может, как полным равнодушием к своему внешнему виду и даже отказом соблюдать гигиену, так и чрезвычайно ярким проявлением себя, совсем не свойственным ему. В этом случае взрослым не стоит его ругать, заставлять или навязывать свое мнение силой. Важно найти корень проблемы, если нужно, то обратиться к специалисту, который разберется в причинах переживаний ребенка.\n\n(10) Период, в который могут произойти судьбоносные события. В это время обстоятельства складываются особенно удачливо. Важно получать удовольствие и радоваться каждому дню, необходимо научится доверять своей интуиции, жить в моменте «здесь и сейчас». Хороший период для путешествий, поездок. Важно относиться к ним легко и даже несколько авантюрно, например, поехать в отпуск спонтанно, без чемодана и тщательного планирования. Родителям нужно помочь ребёнку справляться с ленью, научиться понимать собственные желания и цели. В этот период будут открываться счастливые возможности и встречаться нужные люди. Все задуманное будет исполняться довольно легко, но важно отпускать свои желания, а не зацикливаться на них.\n\n(12) Отношения родителей ребёнка могут переживать не лучшие времена. Напряжение в общении может выливаться в ссоры, которые изменят привычный уклад жизни семьи, а при неблагоприятном исходе вероятен развод родителей. Очень важно в этот период учиться относиться с любовью ко всем, даже к тем людям, которые допускают ошибки. В это время у ребенка может случиться разлад с кем-то из близких, возможно придётся отпустить кого-то из своего окружения. Чтобы сгладить данный период, родителям необходимо помочь ему реализовать себя в творчестве и всячески поддерживать его в этом. Результаты не заставят себя долго ждать. Время подходит для того, чтобы посмотреть на жизнь под другим углом. Хорошо реализовать желание помогать другим, участвовать в проектах, которые приносят пользу обществу или стать волонтером. Главное делать это не в ущерб себе. Родителям стоит чаще баловать ребёнка, делать ему подарки. Особое внимание нужно уделить его физическому развитию и здоровому питанию.",
                    "created": "2021-11-20T21:25:00.134765Z",
                    "edited": "2021-11-20T21:25:00.134765Z",
                    "type_id": 18,
                    "language": "ru",
                    "personal": false,
                    "combination": "2",
                    "gender": "",
                    "type": "info",
                    "title": "10",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 191,
                    "content": "(7) Для этого периода характерно много движения, поездок, постоянное развитие, а также достижение целей и всевозможные победы. Рекомендуется провести его максимально активно. Все вокруг будет сопутствовать успеху, как в учебной, так и во внеурочной деятельности. Это время хорошо подходит для различных поездок и путешествий. Некоторые из них могут быть связаны с учёбой или участием в каких-то мероприятиях, например, олимпиаде или соревнованиях. Если в планах есть переезд, то этот период подходит как нельзя лучше. Родителям важно ставить перед ребёнком четкие цели и обязательно вместе радоваться при их достижении, нельзя оставлять успех незамеченным и воспринимать его как должное. Если полученный результат ниже ожидаемого, то взрослым нужно вместе с ребенком проанализировать ситуацию и объяснить, что не всегда все удается сразу. Не следует опускать руки, необходимо провести работу над ошибками и попробовать еще раз. Важно не ленится, учиться контролировать свои эмоции и агрессию. Хорошее время для начала нового проекта.\n\n(18) Сейчас ребёнку особенно нужен домашний очаг, хочется быть окруженным уютом и комфортом, важно совместное времяпрепровождение с родителями, друзьями и родственниками. Возрастает чувствительность ребенка или, наоборот, проявляется эмоциональная холодность. В данный период скорее всего будут появляться страхи. Они могут быть, как обоснованными, так и беспочвенным. Очень важно следить за тем, куда направлены его внимание и мысли. Если ребенок будет постоянно фокусироваться на негативе, то страхи могут реализоваться в жизнь. В это время мысли воплощаются быстрее и проще, чем обычно, поэтому так важно следить за их направлением. Если ребенок не может преодолеть страхи своими силами, то необходимо обратиться к специалисту по работе с сознанием, иначе подобный образ мышления может укорениться и отравлять жизнь на протяжении долгого времени. В этот период хорошо изучать историю, философию, мифологию, для тех, кто постарше возможно погружение в психологию. Это всё необходимо для того, чтобы наладить контакт с подсознанием. Также ребенку важно развивать интуицию, заниматься творчеством, связанным с образами, например, фотографией, созданием комиксов или картин с изображением абстракций, росписью на одежде.",
                    "created": "2021-10-13T20:11:08.089168Z",
                    "edited": "2021-10-13T20:11:08.089169Z",
                    "type_id": 18,
                    "language": "ru",
                    "personal": false,
                    "combination": "7",
                    "gender": "",
                    "type": "info",
                    "title": "11-12.5",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 189,
                    "content": "(5) В этот период родителям стоит уделить особое внимание вопросу общения с ребенком, ему просто необходимо получать их поддержку. Взрослым следует поощрять его тягу к знаниям, делиться ценными советами и собственным опытом. Кроме того, в это время вероятен переход на следующую ступень обучения, например, из средней школы в старшую. Взрослым необходимо следить за тем, чтобы ребенок соблюдал баланс учебы и отдыха, не зарывался в процессе получения знаний. Благоприятный момент для пополнения в семье. Вероятно, участие ребенка в мероприятии, связанном с какой-либо традицией, в том числе религиозной, например, он может побывать на свадьбе или венчании. В это время необходимо уделять больше внимания чистоте в доме. Родителям следует научить ребёнка поддерживать порядок, привлекать его к процессу уборки. Кроме того, важно раскладывать всё по полочкам и в мыслях. Период будет учить тому, что нужно уважительно относиться ко времени, стараться не опаздывать и соблюдать режим дня. Кроме всего прочего, возможно получение какого-то официального документа, например, аттестата или паспорта.\n\n(8) Необходимо завершить все ранее начатые и не доведенные до результата дела или проекты. Новые возможности откроются только после этого. Для данного периода не характерно бурное развитие событий или глобальные перемены. Будут складываться ситуации, в которых ребёнку важно научиться извлекать уроки, анализировать произошедшее с ним, особенно, если они повторяются уже не в первый раз. Взрослым не нужно пытаться уберечь его от ошибок, но следует помочь сделать правильные выводы и избежать их в будущем. В этот период родителям нужно как можно больше общаться с ребенком и стараться выстаивать доверительные отношения. Это поможет понимать его лучше и определиться с направлением обучения, так как сам он может запутаться в своих желаниях и взглядах. Родителям следует обратить внимание на то, какие убеждения и установки они закладывают в фундамент мировоззрения своего ребенка. «Поступать с другими нужно так, как бы хотелось, чтобы поступали с тобой» - вот главное правило, которому взрослым важно научить ребенка. Ему необходимо научиться гордиться собой и своими поступками.\n\n(13) Все вокруг может меняться просто молниеносно. Период будет наполнен открытиями и различными трансформациями. Важно быть к ним готовым и научиться быстро адаптироваться в новых условиях. Если ребенок будет бояться перемен в жизни, то у него могут быть проблемы по здоровью, в общении с окружающими или в учебе. Родителям необходимо помочь ему избавиться от всего, что уже устарело и сломано, ведь пока пространство вокруг него захламлено, его жизненная энергия блокируется. Также ребёнку важно научиться прислушиваться к себе, честно говорить о том, что не нравится и менять это. Взрослым нужно следить за тем, как он проявляет эмоции - возможны резкие перепады настроения. Родителям важно научить ребёнка экологично проживать свои чувства и мягко объяснить, что грубым словом можно очень больно ранить другого человека. В этот период у ребенка может возникнуть желание попробовать себя в экстремальных видах спорта или занятиях, связанных с риском. Взрослым не стоит препятствовать этому, так как ему важно прожить этот этап ярко и незабываемо. Все дела, которые будут начаты, необходимо доводить до завершения, нельзя бросать их на половине пути. В этот период возможна смерть среди близких или в кругу знакомых.",
                    "created": "2021-10-13T20:11:06.339484Z",
                    "edited": "2021-10-13T20:11:06.339485Z",
                    "type_id": 18,
                    "language": "ru",
                    "personal": false,
                    "combination": "5",
                    "gender": "",
                    "type": "info",
                    "title": "12.5-13.5",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 192,
                    "content": "(8) Необходимо завершить все ранее начатые и не доведенные до результата дела или проекты. Новые возможности откроются только после этого. Для данного периода не характерно бурное развитие событий или глобальные перемены. Будут складываться ситуации, в которых ребёнку важно научиться извлекать уроки, анализировать произошедшее с ним, особенно, если они повторяются уже не в первый раз. Взрослым не нужно пытаться уберечь его от ошибок, но следует помочь сделать правильные выводы и избежать их в будущем. В этот период родителям нужно как можно больше общаться с ребенком и стараться выстаивать доверительные отношения. Это поможет понимать его лучше и определиться с направлением обучения, так как сам он может запутаться в своих желаниях и взглядах. Родителям следует обратить внимание на то, какие убеждения и установки они закладывают в фундамент мировоззрения своего ребенка. «Поступать с другими нужно так, как бы хотелось, чтобы поступали с тобой» - вот главное правило, которому взрослым важно научить ребенка. Ему необходимо научиться гордиться собой и своими поступками.\n\n(6) Родителям нужно уделить ребенку особое внимание и чаще проявлять заботу в это время. Ему будет необходимо больше нежности и тактильных проявлений любви. Также взрослым важно укреплять его уверенность в себе, для того чтобы в будущем он не зависел от мнения окружающих. В этот период необходимо научить ребёнка любить себя, принимать свои особенности и ценить собственную уникальность. Ему благоприятно найти дело по душе, окружать себя атмосферой уюта, развивать чувство вкуса. В этот период хорошо принять участие в новом проекте, который связан со сферой творчества, красоты, или проявить себя в большом коллективе. Важно наполнить жизнь ребенка разнообразным общением, не препятствовать тому, чтобы он проводил время с друзьями, приятелями, хорошо заводить и поддерживать новые знакомства. В это время полезно заниматься творчеством, изучать искусство, посещать музеи и выставки, развивающие чувство прекрасного. Ребёнку необходимо заниматься физической активностью, которая приносит ему приятные ощущения, например, йогой, аэробикой или плаванием. Взрослым важно держать под контролем ситуации, в которых ребенок чувствует себя обиженным. Им необходимо первыми идти на примирение, просить прощения, стараться сглаживать острые углы и по возможности совсем избегать конфликтов. У ребёнка в это время могут возникнуть сложности с прощением - ему будет трудно отпустить обиду или забыть о случившемся.\n\n(14) Подходящее время для раскрытия творческих способностей. Хорошо посещать выставки, галереи, музеи, кино, театры, стоит попробовать себя в интеллектуальных играх. Родители могут помочь ребёнку подобрать курсы, которые раскроют его творческий потенциал. Период будет учить размеренности, сдержанности, в это время не следует торопиться, ко всему надо относиться внимательно. В жизни ребенка могут сложиться ситуации, которые потребуют от него много терпения и смирения, повлиять на обстоятельства будет невозможно. Важно довериться течению событий и понять, что и такие периоды в жизни важны для того, чтобы найти внутреннюю гармонию и понять свои истинные желания. В этот период ребёнку важно соблюдать здоровый образ жизни и заботится о своем теле. Благоприятно пребывание у водоемов и занятия плаванием.",
                    "created": "2021-10-13T20:11:08.489384Z",
                    "edited": "2021-10-13T20:11:08.489384Z",
                    "type_id": 18,
                    "language": "ru",
                    "personal": false,
                    "combination": "8",
                    "gender": "",
                    "type": "info",
                    "title": "13.5-14",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 185,
                    "content": "(3) В этот период родителям необходимо уделить максимум внимания своему ребёнку. Особенно близкие отношения с дочерью следует выстроить маме. Ей важно научить дочку секретам ухода за собой, заботе о своём теле и ментальном здоровье. Именно в это время женские качества и черты девочки, такие, как нежность, доброта, приятный голос и красивая речь, будут особенно заметны окружающим. Также маме нужно помочь ей справиться комплексами по поводу внешности, если они возникли. В этот период в семье может случиться пополнение, вероятнее всего еще девочка или мальчик, который будет обладать мягким характером. Родителям необходимо распределить свое внимание между детьми так, чтобы удавалось провести время с каждым. Очень хорошо заниматься совместным творчеством, хозяйственными и бытовыми делами. Ребенку полезно иметь круг общения вне семьи - друзей и приятелей из садика, школы, двора, различных секций, с которыми она могла бы проводить время вместе, гулять, иметь общие интересы. Взрослым важно не поддаваться на манипуляции и капризы девочки, ведь так она начнет удовлетворять свои потребности за родительский счет, а в будущем начнёт это делать за счет других.\n\n(16) Перемены в этот период могут затрагивать буквально все сферы жизни ребенка. Возможны потери материального плана, особенно тех вещей, которым придается излишняя важность. Период будет учить принятию обстоятельств. Если сопротивляться переменам, то могут притянутся разрушения, физические травмы, или даже катастрофы и аварии. Чтобы избежать негативного влияния периода, родителям важно научить ребенка быть гибким, подстраиваться под ситуации, проявлять жизнелюбие и искать во всем позитивные моменты, воспринимать неудачи, как опыт и видеть в них возможность для личностного роста. Проявление у ребёнка чрезмерных амбиций может разрушать что-то стабильное и уже устоявшееся. В этот период важно осознать, что разрушение чего-то старого обязательно открывает новые возможности. Хорошее время для формирования у ребёнка принципов нравственности и понятия о морали. Родители могут ограничить чрезмерные удовольствия, например, следить за временем, которое ребенок проводит за гаджетами или сколько съедает сладкого в день. Этот период отлично подходит для выработка навыка дисциплины. Родителям нужно поспособствовать развитию у ребёнка чувства сопереживания и навыка взаимовыручки. Благоприятно помогать людям или животным, которые оказались в трудных обстоятельствах.\n\n(19) Спокойный период в жизни ребенка, без резких поворотов и судьбоносных событий. Если использовать правильно потенциал этого этапа, то можно привнести в жизнь много радости, почувствовать прибавление сил и улучшение здоровья. Ребёнку необходимо больше времени проводить в обществе своих братьев и сестёр, важно наладить с ними отношения и найти контакт, если есть конфликты или непонимание. В этот период ему нужно научиться правильно распределять свою энергию между несколькими делами и задачами. Это необходимо для того, чтобы у ребенка не возникло навязчивое желание быть в центре внимания. Например, следует уделять время не только общению и учебе, но и своему хобби, которое, зачастую, может быть полезным и для окружающих. В этот период важно осознание того, что жизнь изобильна, а Вселенная всегда благоволит тем, кто верит в успех. Тому, кто благодарен жизни за всё, что имеет и возможности, которые она предоставляет, будет сопутствовать счастье, удача и благополучие.",
                    "created": "2021-10-13T20:11:01.103162Z",
                    "edited": "2021-10-13T20:11:01.103162Z",
                    "type_id": 18,
                    "language": "ru",
                    "personal": false,
                    "combination": "3",
                    "gender": "",
                    "type": "info",
                    "title": "15",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 191,
                    "content": "(7) Для этого периода характерно много движения, поездок, постоянное развитие, а также достижение целей и всевозможные победы. Рекомендуется провести его максимально активно. Все вокруг будет сопутствовать успеху, как в учебной, так и во внеурочной деятельности. Это время хорошо подходит для различных поездок и путешествий. Некоторые из них могут быть связаны с учёбой или участием в каких-то мероприятиях, например, олимпиаде или соревнованиях. Если в планах есть переезд, то этот период подходит как нельзя лучше. Родителям важно ставить перед ребёнком четкие цели и обязательно вместе радоваться при их достижении, нельзя оставлять успех незамеченным и воспринимать его как должное. Если полученный результат ниже ожидаемого, то взрослым нужно вместе с ребенком проанализировать ситуацию и объяснить, что не всегда все удается сразу. Не следует опускать руки, необходимо провести работу над ошибками и попробовать еще раз. Важно не ленится, учиться контролировать свои эмоции и агрессию. Хорошее время для начала нового проекта.\n\n(11) Данный период благоприятен для того, чтобы реализовать заложенный в ребенке потенциал силы и лидерские качества. Ему необходимо проявляться в коллективе, на внеклассных мероприятиях, добиваться успеха в учёбе или достигать результатов в спорте. Полезно вести динамичный образ жизни, больше бывать на свежем воздухе, так как недостаток физической активности приведет к накоплению нерастраченной энергии, и может выразится в стремлении подавлять других, добиваться желаемого любой ценой. Спорт наполнит энергией и поможет «свернуть горы». В это время родителям важно тщательно следить за распорядком дня ребёнка и уделять достаточно внимания вопросам здоровья, распределяя занятия так, чтобы была возможность качественного отдыха.\n\n(18) Сейчас ребёнку особенно нужен домашний очаг, хочется быть окруженным уютом и комфортом, важно совместное времяпрепровождение с родителями, друзьями и родственниками. Возрастает чувствительность ребенка или, наоборот, проявляется эмоциональная холодность. В данный период скорее всего будут появляться страхи. Они могут быть, как обоснованными, так и беспочвенным. Очень важно следить за тем, куда направлены его внимание и мысли. Если ребенок будет постоянно фокусироваться на негативе, то страхи могут реализоваться в жизнь. В это время мысли воплощаются быстрее и проще, чем обычно, поэтому так важно следить за их направлением. Если ребенок не может преодолеть страхи своими силами, то необходимо обратиться к специалисту по работе с сознанием, иначе подобный образ мышления может укорениться и отравлять жизнь на протяжении долгого времени. В этот период хорошо изучать историю, философию, мифологию, для тех, кто постарше возможно погружение в психологию. Это всё необходимо для того, чтобы наладить контакт с подсознанием. Также ребенку важно развивать интуицию, заниматься творчеством, связанным с образами, например, фотографией, созданием комиксов или картин с изображением абстракций, росписью на одежде.",
                    "created": "2021-10-13T20:11:08.089168Z",
                    "edited": "2021-10-13T20:11:08.089169Z",
                    "type_id": 18,
                    "language": "ru",
                    "personal": false,
                    "combination": "7",
                    "gender": "",
                    "type": "info",
                    "title": "16-17.5",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 187,
                    "content": "(4) Родителям девочки необходимо принимать ее индивидуальность, мягко направлять ее в сторону развития женственности и безусловно поддерживать ее во всем. Особенно значимы взаимоотношения с отцом, поэтому важно его непосредственное участие в воспитании и жизни ребенка. Взрослым нужно предоставлять девочке возможность самостоятельно выбирать и принимать решения. Благодаря этому она научится дисциплине и ответственности. В этот период состав семьи может расширится за счёт рождения мальчика или девочки с сильным, волевым характером. Также в жизни девочки может появится мальчик или мужчина, который сыграет важную роль в её судьбе, например, учитель, тренер, наставник, друг родителей или одноклассник.\n\n(22) В это время важно довериться течению событий, впускать перемены и новые возможности в свою жизнь. Ребенок почувствует желание быть независимым от родителей. Взрослым не стоит ограничивать его общение, для него важно знакомиться с новыми людьми из самых разных сфер жизни. Период хорош для того, чтобы пробовать что-то новое, преодолевать страхи и получать свежий опыт. В это время необходимо пользоваться возможностями для различных поездок, начиная от выездов до дачи или на природу, заканчивая путешествиями по всему миру. Тур слёт, олимпиада, выездные соревнования, отпуск родителей - важно по максимуму пользоваться шансами, даруемыми судьбой. Если игнорировать предоставляемые возможности, то могут возникнуть обстоятельства, ограничивающие передвижение. Необходимо очищать пространство вокруг от всего старого - часто ребенок “прикипает” к чему-то, к какой-то вещи, которая может быть сломана или уже изжила себя. В целом период наполнен радостью и счастьем.\n\n(8) Необходимо завершить все ранее начатые и не доведенные до результата дела или проекты. Новые возможности откроются только после этого. Для данного периода не характерно бурное развитие событий или глобальные перемены. Будут складываться ситуации, в которых ребёнку важно научиться извлекать уроки, анализировать произошедшее с ним, особенно, если они повторяются уже не в первый раз. Взрослым не нужно пытаться уберечь его от ошибок, но следует помочь сделать правильные выводы и избежать их в будущем. В этот период родителям нужно как можно больше общаться с ребенком и стараться выстаивать доверительные отношения. Это поможет понимать его лучше и определиться с направлением обучения, так как сам он может запутаться в своих желаниях и взглядах. Родителям следует обратить внимание на то, какие убеждения и установки они закладывают в фундамент мировоззрения своего ребенка. «Поступать с другими нужно так, как бы хотелось, чтобы поступали с тобой» - вот главное правило, которому взрослым важно научить ребенка. Ему необходимо научиться гордиться собой и своими поступками.",
                    "created": "2021-10-13T20:11:05.109504Z",
                    "edited": "2021-10-13T20:11:05.109505Z",
                    "type_id": 18,
                    "language": "ru",
                    "personal": false,
                    "combination": "4",
                    "gender": "",
                    "type": "info",
                    "title": "17.5-18.5",
                    "tintColor": "",
                    "additional": null
                   },
                   {
                    "id": 189,
                    "content": "(5) В этот период родителям стоит уделить особое внимание вопросу общения с ребенком, ему просто необходимо получать их поддержку. Взрослым следует поощрять его тягу к знаниям, делиться ценными советами и собственным опытом. Кроме того, в это время вероятен переход на следующую ступень обучения, например, из средней школы в старшую. Взрослым необходимо следить за тем, чтобы ребенок соблюдал баланс учебы и отдыха, не зарывался в процессе получения знаний. Благоприятный момент для пополнения в семье. Вероятно, участие ребенка в мероприятии, связанном с какой-либо традицией, в том числе религиозной, например, он может побывать на свадьбе или венчании. В это время необходимо уделять больше внимания чистоте в доме. Родителям следует научить ребёнка поддерживать порядок, привлекать его к процессу уборки. Кроме того, важно раскладывать всё по полочкам и в мыслях. Период будет учить тому, что нужно уважительно относиться ко времени, стараться не опаздывать и соблюдать режим дня. Кроме всего прочего, возможно получение какого-то официального документа, например, аттестата или паспорта.\n\n(10) Период, в который могут произойти судьбоносные события. В это время обстоятельства складываются особенно удачливо. Важно получать удовольствие и радоваться каждому дню, необходимо научится доверять своей интуиции, жить в моменте «здесь и сейчас». Хороший период для путешествий, поездок. Важно относиться к ним легко и даже несколько авантюрно, например, поехать в отпуск спонтанно, без чемодана и тщательного планирования. Родителям нужно помочь ребёнку справляться с ленью, научиться понимать собственные желания и цели. В этот период будут открываться счастливые возможности и встречаться нужные люди. Все задуманное будет исполняться довольно легко, но важно отпускать свои желания, а не зацикливаться на них.\n\n(15) В семье возможны крупные покупки, например, машина или квартира. Жизнь   будет наполнена яркими событиями, в это время легко сбываются мечты и исполняются желания. В этот период у ребенка может произойти изменение восприятия окружающего мира и мировоззрения. Им может овладеть желание славы, известности, стремление выглядеть впечатляюще в глазах окружающих, появится потребность в подтверждении своего превосходства. Возможны скандалы, выяснения отношений, а также проявление таких негативных эмоций, как зависть, ревность, жадность, агрессия или манипуляции. Подходящий период для того, чтобы родители рассказали ребёнку про основные человеческие ценности. Стремление к богатству, славе и власти, должно иметь за собой определённую миссию, удовлетворяющую не только его потребности, но и призванную принести пользу другим. Подросток может пережить состояние влюбленности, яркое чувство, захватывающее душу и разум всецело, когда просто невозможно представить жизнь без любимого человека.",
                    "created": "2021-10-13T20:11:06.339484Z",
                    "edited": "2021-10-13T20:11:06.339485Z",
                    "type_id": 18,
                    "language": "ru",
                    "personal": false,
                    "combination": "5",
                    "gender": "",
                    "type": "info",
                    "title": "18.5-19",
                    "tintColor": "",
                    "additional": null
                   }
                  ],
                  "trialAccess": false,
                  "positions": null
                 }
                ],
                "combinations": {
                 "a": 1,
                 "a1": 13,
                 "a2": 14,
                 "a3": 7,
                 "a4": 4,
                 "a5": 5,
                 "a6": 7,
                 "b": 1,
                 "b1": 13,
                 "b2": 14,
                 "b3": 7,
                 "b4": 4,
                 "b5": 7,
                 "b6": 5,
                 "b7": 7,
                 "b8": 8,
                 "c": 4,
                 "c1": 16,
                 "c2": 20,
                 "c3": 8,
                 "c4": 9,
                 "c5": 13,
                 "c6": 22,
                 "c7": 17,
                 "d": 6,
                 "d1": 18,
                 "d2": 6,
                 "d3": 13,
                 "d4": 16,
                 "d5": 6,
                 "d6": 18,
                 "d7": 22,
                 "d8": 11,
                 "d9": 10,
                 "e": 12,
                 "e1": 6,
                 "e2": 18,
                 "e3": 12,
                 "e4": 11,
                 "e5": 10,
                 "e6": 17,
                 "e7": 12,
                 "e8": 22,
                 "f": 2,
                 "f1": 3,
                 "f2": 5,
                 "f3": 8,
                 "f4": 7,
                 "f5": 3,
                 "f6": 5,
                 "f7": 7,
                 "f8": 8,
                 "g": 5,
                 "g1": 13,
                 "g2": 19,
                 "g3": 7,
                 "g4": 5,
                 "g5": 20,
                 "g6": 9,
                 "g7": 6,
                 "h": 7,
                 "h1": 5,
                 "h3": 7,
                 "h4": 13,
                 "h5": 14,
                 "h6": 19,
                 "h7": 18,
                 "h8": 8,
                 "j": 5,
                 "k": 7,
                 "k1": 6,
                 "k2": 13,
                 "k3": 11,
                 "k4": 17,
                 "k5": 16,
                 "k6": 5,
                 "k7": 14,
                 "k8": 19,
                 "l": 2,
                 "l1": 10,
                 "l2": 8,
                 "l3": 14,
                 "l4": 6,
                 "l5": 7,
                 "l6": 10,
                 "m": 12,
                 "n": 12,
                 "n1": 15,
                 "o": 12,
                 "o1": 15,
                 "o2": 8,
                 "o3": 18,
                 "p1": 11,
                 "p2": 16,
                 "p3": 13,
                 "p4": 20,
                 "s": 18,
                 "s1": 8,
                 "s2": 10,
                 "s3": 8,
                 "s4": 16,
                 "t": 12,
                 "t1": 8,
                 "t2": 15,
                 "t3": 22,
                 "t4": 5,
                 "t5": 9,
                 "t6": 17,
                 "t7": 10,
                 "u": 12,
                 "x": 7,
                 "x1": 7,
                 "x2": 5,
                 "x3": 19,
                 "x4": 5,
                 "x5": 4,
                 "x6": 7,
                 "x8": 5,
                 "y": 10,
                 "y1": 14,
                 "y2": 18,
                 "y3": 22,
                 "y4": 5,
                 "y5": 6,
                 "y6": 20,
                 "y7": 16,
                 "y8": 8,
                 "z": 6,
                 "z1": 9,
                 "z2": 9,
                 "z4": 22,
                 "z5": 12,
                 "z6": 17,
                 "z7": 10,
                 "z8": 11
                }
               }
            saveDiagramButton.addEventListener('click', function(e) {
                e.preventDefault();
        
                var calculationWrap = e.target.closest('.js-calculation-wrap'),
                    language = e.target.getAttribute('data-language-string'),
                    dob = e.target.getAttribute('data-dob-string'),
                    name = e.target.getAttribute('data-name-string'),
                    printDiagramHtml = calculationWrap.querySelectorAll('.js-print-diagram-wrap, .js-section-with-diagram');
                showPreloader();
                domtoimage.toJpeg(printDiagramHtml[0], {
                    bgcolor: "#ffffff"
                }).then(function(dataUrl) {
                    createDiagramPdf(res, language, dob, name, dataUrl);
                    setTimeout(function() {
                        hidePreloader()
                    }, 1000)
                }).catch(function(error) {
                    console.error('oops, something went wrong!', error)
                })
            })
            showPreloader();
            
            resetForm(form);
            if (product_id) {
                fetch("/wp-json/c/v1/deactivate/" + product_id)
            }
            calculationWrap.querySelector('.js-calculation-begin').classList.add('d-none');
            calculationWrap.querySelector('.js-calculation-block').classList.remove('d-none');
            setTimeout(function() {
                calculationWrap.querySelector('.js-form-with-calculation').dataset.click=('false')
            }, 3000);
            var headerTitles = getHeaderTitlesForCalculation(typeOfForm, language, formName, formDob, 0);
            setHeaderTitleForCalculation(calculationWrap, headerTitles.title, headerTitles.subTitle);
            createInfoFromServer(res, calculationWrap, language, age);
            addActiveArticleInTheSectionWithDiagram(sectionWithDiagram);
            clearActiveRowInTable(sectionWithDiagram);
            fillInTheDiagram(res.combinations, sectionWithDiagram);
            activeArticleInTheSectionWithDiagram(sectionWithDiagram, calculationWrap);
            cloneDiagramSection(calculationWrap);
            setTimeout(function() {
                scrollToBeginOfCalculation(calculationWrap);
                hidePreloader()
            }, 1000)

    });
    const response = {
        "ok": true,
        "data": [
         {
          "imageName": "couple_positive",
          "title": "В позитиве",
          "blockType": "default",
          "trialAccess": false,
          "blocks": [
           {
            "id": 0,
            "content": "() ",
            "created": "0001-01-01T00:00:00Z",
            "edited": "0001-01-01T00:00:00Z",
            "type_id": 0,
            "type": "expandable",
            "language": "",
            "combination": "",
            "title": "Для чего встретились",
            "tintColor": ""
           },
           {
            "id": 0,
            "content": "() ",
            "created": "0001-01-01T00:00:00Z",
            "edited": "0001-01-01T00:00:00Z",
            "type_id": 0,
            "type": "expandable",
            "language": "",
            "combination": "",
            "title": "Как проявляется пара",
            "tintColor": ""
           },
           {
            "id": 38,
            "content": "(20) Паре важно собирать родственников за одним столом, поддерживать и укреплять семейные узы. Если кто-то из родных в ссоре - стоит их примирить. Бизнес будет успешным, если его можно будет оставить наследникам. Также, благоприятно продолжать семейное династическое дело или ремесло.\n\n(10) Паре необходимо много путешествовать и радоваться жизни, фонтанировать идеями, открывать новые направления во всем. Важно работать в удовольствие, в свободном графике в сфере креатива и творчества.\n\n(8) Партнерам необходимо выполнять обещания, поддерживать друг друга, не осуждать. Вместе справляться с жизненными сложностями. Пара хорошо может организовать рабочий процесс. В работе дополняют друг друга.\n\n(14) Важно внимательно относиться друг к другу, проявлять чувства, заботиться, уделять время беседам об искусстве. Хорошо вместе заниматься творчеством, медитировать. Отдых лучше всего организовывать около водоемов. В работе важно отводить себе роль вдохновителей проекта, а для реализации идей подбирать профессиональных исполнителей.\n\n(6) Паре важно проявлять заботу друг о друге, разговаривать по душам, устраивать романтические вечера. Необходимо общаться с друзьями, развлекаться, дарить подарки, покупать себе и друг другу красивую одежду. Партнеры могут дать хороший совет как лучше выстроить деловые отношения, помочь «правильными знакомствами».",
            "created": "2020-08-02T20:29:37.299454Z",
            "edited": "2020-08-02T20:29:37.299454Z",
            "type_id": 29,
            "type": "expandable",
            "language": "ru",
            "combination": "20",
            "title": "Для финансового благополучия и счастливых отношений важно",
            "tintColor": ""
           }
          ]
         },
         {
          "imageName": "couple_negative",
          "title": "В негативе",
          "blockType": "default",
          "trialAccess": false,
          "blocks": [
           {
            "id": 0,
            "content": "() ",
            "created": "0001-01-01T00:00:00Z",
            "edited": "0001-01-01T00:00:00Z",
            "type_id": 0,
            "type": "expandable",
            "language": "",
            "combination": "",
            "title": "Проблемы и трудности",
            "tintColor": ""
           },
           {
            "id": 78,
            "content": "(20) Скандалы в паре часто возникают по поводу отношений с родственниками. Родные вмешиваются в отношения, пытаются их расстроить. Страх перемен, боязнь начать свое дело, нет уверенности в завтрашнем дне. Партнеры проецируют проблемы в отношениях с родителями друг на друга.\n\n(6) Отношения становятся поверхностными, дежурные фразы, взаимодействие ограничено бытом. Партнеры откупаются друг от друга дорогими подарками. Отсутствие общения между собой компенсируют множеством встреч с друзьями. Возможны измены. \n\n(4) Мужчина не может обеспечить семью, может страдать от алкоголизма. Женщина берет на себя мужские обязанности. Неуважение к партнеру и его родителям. Скандалы. Агрессия.\n\n(8) В отношениях может появится физическая агрессия, разочарование в партнере, споры и обиды, депрессия. Видят только недостатки друг друга.\n\n(14) Люди в паре обижаются друг на друга, испытывают недовольство, страдают. Им сложно дается решение финансовых вопросов, совершают много ненужных трат. Партнеры могут жить в ожидании более подходящего для отношений человека.",
            "created": "2020-08-02T20:29:46.416561Z",
            "edited": "2020-08-02T20:29:46.416561Z",
            "type_id": 31,
            "type": "expandable",
            "language": "ru",
            "combination": "20",
            "title": "Если пара не выполняет то, для чего встретилась включается негативная карма",
            "tintColor": ""
           }
          ]
         },
         {
          "imageName": "couple_important",
          "title": "Важно",
          "blockType": "default",
          "trialAccess": false,
          "blocks": null
         },
         {
          "imageName": "couple_comfort",
          "title": "Зона комфорта пары",
          "blockType": "default",
          "trialAccess": false,
          "blocks": [
           {
            "id": 268,
            "content": "Центральная энергия в матрице определяет как партнеры взаимодействуют друг с другом. Это общая зона комфорта для пары. Для того, чтобы вместе было хорошо необходимо пройти урок этой энергии. Также эта точка расскажет о том к чему паре следует стремиться в отношениях, чтобы оба партнера были счастливы, а в паре царила гармония. \n\n(16) Про такую пару говорят “с перчинкой”. Комфортными отношения партнеров будут в том случае, если они научатся подмазывать каждую трещинку, которая пошла в паре, иначе частые ссоры полностью обессилят как морально, так и физически, и даже могут привести к расставанию. Для взаимопонимания нужно совместное занятие, направленное на трансформацию не только материального, но и духовного - изучение основ Мироздания, занятия йогой, цигун, танцами. Возможно создание парой проекта, направленного на саморазвитие личности. Совместное строительство дома, переезды и ремонты укрепят отношения.",
            "created": "2022-05-04T09:41:14.239207Z",
            "edited": "2022-05-04T09:41:14.239207Z",
            "type_id": 40,
            "type": "expandable",
            "language": "ru",
            "combination": "0",
            "title": "Зона комфорта в отношениях",
            "tintColor": ""
           }
          ]
         }
        ],
        "combinations": {
         "a": 2,
         "a1": 18,
         "a2": 20,
         "b": 2,
         "b1": 18,
         "b2": 20,
         "c": 4,
         "c1": 20,
         "c2": 6,
         "d": 8,
         "d1": 6,
         "d2": 14,
         "e": 16,
         "f": 4,
         "g": 6,
         "k": 10,
         "k1": 10,
         "k2": 6,
         "k3": 16,
         "m1": 16,
         "m2": 16,
         "m3": 5,
         "m4": 21,
         "t": 14,
         "x": 8,
         "y": 12,
         "z": 10
        }
       }

    document.querySelector('.js-compatibility-form').addEventListener('submit', (e) => {
        e.preventDefault();
        var form = e.target,
            typeOfForm = detectTypeOfForm(form),
            calculationWrap = form.closest('.js-calculation-wrap'),
            sectionWithDiagram = calculationWrap.querySelector('.js-section-with-diagram'),
            saveButton = calculationWrap.querySelector('.js-save-info-in-pdf'),
            saveFromEditorButton = calculationWrap.querySelector('.js-save-from-editor'),
            saveDiagramButton = calculationWrap.querySelector('.js-save-diagram-in-pdf'),
            formDobOne = form.querySelector('#dob-compatibility-1').value,
            product_id = +form.querySelector("#product_id").value,
            formDobTwo = form.querySelector('#dob-compatibility-2').value,
            language = form.querySelector('#language-compatibility').value,
            edw_var = '';
        if (document.querySelector('.js-check-date-form').classList.contains('js-not-full-functionality')) {
            edw_var = "&edw=1"
        }
        var queryString = "date1=" + formDobOne + "&date2=" + formDobTwo + "&language=" + language + edw_var;
        // saveButton.dataset.queryString=(queryString);
        // saveButton.dataset.dobString=(formDobOne);
        // saveButton.dataset.dob2String=(formDobTwo);
        // saveButton.dataset.languageString=(language);
        saveFromEditorButton.dataset.dobString=(formDobOne);
        saveFromEditorButton.dataset.dob2String=(formDobTwo);
        saveFromEditorButton.dataset.languageString=(language);
        saveDiagramButton.dataset.nameString=(!1);
        saveDiagramButton.dataset.dobString=(formDobOne + " + " + formDobTwo);
        saveDiagramButton.dataset.languageString=(language);
        showPreloader();
        saveDiagramButton.addEventListener('click', function(e) {
            e.preventDefault();
    
            var calculationWrap = e.target.closest('.js-calculation-wrap'),
                language = e.target.getAttribute('data-language-string'),
                dob = e.target.getAttribute('data-dob-string'),
                name = e.target.getAttribute('data-name-string'),
                printDiagramHtml = calculationWrap.querySelectorAll('.js-print-diagram-wrap, .js-section-with-diagram');
            showPreloader();
            domtoimage.toJpeg(printDiagramHtml[0], {
                bgcolor: "#ffffff"
            }).then(function(dataUrl) {
                createDiagramPdf(response, language, dob, name, dataUrl);
                setTimeout(function() {
                    hidePreloader()
                }, 1000)
            }).catch(function(error) {
                console.error('oops, something went wrong!', error)
            })
        })

        resetForm(form);
        if (product_id) {
            fetch("/wp-json/c/v1/deactivate/" + product_id)
        }
        
        calculationWrap.querySelector('.js-calculation-begin').classList.add('d-none');
        calculationWrap.querySelector('.js-calculation-block').classList.remove('d-none');
        // calculationWrap.querySelector('.js-calculation-block').querySelector('.js-dob-and-dob-2').innerText=formDobOne + " + " + formDobTwo
        setTimeout(function() {
            calculationWrap.querySelector('.js-form-with-calculation').dataset.click=('false')
        }, 3000);
        var headerTitles = getHeaderTitlesForCalculation(typeOfForm, language, '', formDobOne, formDobTwo);
        setHeaderTitleForCalculation(calculationWrap, headerTitles.title, headerTitles.subTitle);
        createInfoFromServer(response, calculationWrap, language, 0);
        addActiveArticleInTheSectionWithDiagram(sectionWithDiagram);
        clearActiveRowInTable(sectionWithDiagram);
        fillInTheDiagram(response.combinations, sectionWithDiagram);
        activeArticleInTheSectionWithDiagram(sectionWithDiagram, calculationWrap);
        cloneDiagramSection(calculationWrap);
        setTimeout(function() {
            scrollToBeginOfCalculation(calculationWrap);
            hidePreloader()
        }, 1000)
                
    });
    // document.querySelector('.js-start-from-the-beginning').addEventListener('click', function(e) {
    //     e.preventDefault();
    //     var calculationWrap = e.target.closest('.js-calculation-wrap');
    //     beginCalculationFromTheBeginning(calculationWrap)
    // });
    function createDiagramPdf(dataJson, language, dob, name, diagramImage) {
        var title = '',
            name = (name === 'false') ? '' : name;
        if (language === 'ru') {
            title = 'Диаграмма'
        } else if (language === 'en') {
            title = 'Diagram'
        }
        var docInfo = {
            info: {
                title: title,
                author: 'https://matritsa-sudbi.ru',
                subject: title,
                keywords: 'Матрица судьбы, Расчёт матрицы'
            }
        }
        var styles = {
            topTitle: {
                fontSize: 24,
                bold: !0
            },
            elemParagraph: {
                fontSize: 15,
                bold: false
            },
            elemTitle: {
                fontSize: 18,
                bold: !0
            }
        }
        var content = [];
        var topTitleObj = {
            text: title + ": " + name + " (" + dob + ")" + "\n\n",
            style: "topTitle",
            alignment: 'center'
        }
        content.push(topTitleObj);

        content.push({
            image: diagramImage,
            fit: [780, 500],
            alignment: 'center'
        })
        
        console.log(dataJson, 'dataJson')
        for (var i = 0; i < dataJson.data.length; i++) {
            if (dataJson.data[i].blocks === null) {continue; }
            dataJson.data[i].blocks.forEach(item => {
                var elemParagraphTitleObj = {
                    text: item.title,
                    style: "elemTitle",
                    margin: [0, 20, 0, 0] 
                }
                var elemParagraphObj = {
                    text: item.content,
                    style: "elemParagraph",
                    margin: [0, 20, 0, 0] 
                }
                content.push(elemParagraphTitleObj);
                content.push(elemParagraphObj);
            })
        }
        
        var diagramPdf = {
            pageSize: 'A4',
            pageMargins: [50, 60],
            pageOrientation: 'portrait',
            content: []
        };
        diagramPdf.info = docInfo;
        diagramPdf.content = content;
        diagramPdf.styles = styles;
        pdfMake.createPdf(diagramPdf).download('' + title.toLowerCase() + '.pdf')
    }

}   

initCalculation();