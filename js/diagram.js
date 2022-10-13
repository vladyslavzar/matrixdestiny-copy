
function initAccordionScroll() {
    $('body').on('click', '.js-calculation-accordion .js-accordion-item.-with-collapse .accordion__btn', function() {
        var accordionBtn = $(this);
        $(this).closest('.js-accordion-item').find('.collapse').toggleClass('show')
        console.log($(this).closest('.js-accordion-item').find('.collapse'))
        setTimeout(function() {
            $('html, body').animate({
                scrollTop: accordionBtn.closest('.js-accordion-item').offset().top - 100
                
            }, 300)
        }, 100)
    })
    $('.js-calculation-accordion').on('hidden.bs.collapse', function() {
        $(this).find('.js-second-level-accordion .collapse').collapse('hide')
    })
}

function initCalculation() {
    initAccordionScroll();
    function initPopovers() {
        function calculationAccordionPopover() {
            var calculationAccordionPopoverSelector = $('.js-calculation-accordion [data-toggle="popover"]'),
                hideTimeout;
            calculationAccordionPopoverSelector.popover({
                trigger: 'hover | focus',
                placement: 'right',
                offset: '0, -100% + 50px'
            });
            calculationAccordionPopoverSelector.on('shown.bs.popover', function(e) {
                clearTimeout(hideTimeout);
                hideTimeout = setTimeout(function() {
                    $(e.target).popover('hide')
                }, 2000)
            })
        }
        calculationAccordionPopover();
        $('.js-popover').popover({
            trigger: 'hover | focus',
            placement: 'right',
            offset: '0, 20px'
        })
    }
    
    
    function initForecastSlider(calculationWrap) {
        var initialSlide = 0,
            forecastYearsSlider = calculationWrap.find('.js-slider-forecast-years'),
            forecastTextSlider = calculationWrap.find('.js-slider-forecast-text');
        forecastYearsSlider.find('.forecast-years-item').each(function(index) {
            if ($(this).hasClass('-active')) {
                initialSlide = index
            }
        });
        if (forecastYearsSlider.length) {
            forecastYearsSlider.slick({
                slidesToShow: 3,
                asNavFor: forecastTextSlider,
                arrows: !1,
                centerMode: !0,
                centerPadding: "0",
                focusOnSelect: !0,
                initialSlide: initialSlide,
                mobileFirst: !0,
                swipeToSlide: !0,
                responsive: [{
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 5
                    }
                }]
            })
        }
        if (forecastTextSlider.length) {
            forecastTextSlider.slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: !1,
                fade: !0,
                swipe: !1,
                asNavFor: forecastYearsSlider,
                initialSlide: initialSlide,
                adaptiveHeight: !0
            })
        }
    }

    var API_CHECKDATE = 'https://api.matritsa-sudbi.ru/api/v2/calculate/',
        API_COMPATIBILITY = 'https://api.matritsa-sudbi.ru/api/v2/compat?',
        API_CHILDREN = 'https://api.matritsa-sudbi.ru/api/v2/children/calculate/';

    function detectNotFullFunctionality() {
        var formWithCalculation = $('.js-form-with-calculation');
        if (!formWithCalculation.length) return;
        formWithCalculation.each(function() {
            if ($(this).hasClass('js-not-full-functionality')) {
                $(this).get(0).notFullFunctionality = !0
            } else {
                $(this).get(0).notFullFunctionality = !1
            }
        })
    }
    detectNotFullFunctionality();

    function showPreloader() {
        $('.js-preloader').addClass('-show')
    }

    function hidePreloader() {
        $('.js-preloader').removeClass('-show')
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
            case (form.hasClass('js-check-date-form')):
                typeOfForm = "check-date";
                break;
            case (form.hasClass('js-compatibility-form')):
                typeOfForm = "compatibility";
                break;
            case (form.hasClass('js-childrens-matrix-form')):
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
        var calculationAnchorSection = calculationWrap.closest('.js-anchor-section'),
            additionalOffset = 0;
        if ($('.blog-article').length) {
            additionalOffset = 50
        }
        $('body, html').animate({
            scrollTop: calculationAnchorSection.offset().top + additionalOffset
        }, 500)
    }

    function beginCalculationFromTheBeginning(calculationWrap) {
        calculationWrap.find('.js-calculation-begin').removeClass('d-none');
        calculationWrap.find('.js-calculation-block').addClass('d-none');
        calculationWrap.find('.js-editor-block').addClass('d-none');
        calculationWrap.find('.js-accordion-buttons').removeClass('d-none');
        calculationWrap.find('.js-calculation-accordion').removeClass('d-none');
        calculationWrap.find('.js-calculation-accordion').empty();
        calculationWrap.find('.js-editor').empty();
        setTimeout(function() {
            calculationWrap.find('.js-form-with-calculation').attr('data-click', 'false')
        }, 3000);
        setTimeout(function() {
            if ($('.section-about').length) {
                $('body, html').animate({
                    scrollTop: calculationWrap.closest('.section').find('.js-anchor-title').offset().top
                }, 500)
            } else if ($('.blog-article').length || $('.section-woocommerce-main-content').length) {
                scrollToBeginOfCalculation(calculationWrap)
            }
        }, 100)
    }

    function showEditBlock(calculationWrap) {
        showPreloader();
        setTimeout(function() {
            calculationWrap.find('.js-editor-block').removeClass('d-none');
            calculationWrap.find('.js-calculation-accordion').addClass('d-none');
            calculationWrap.find('.js-accordion-buttons').addClass('d-none');
            calculationWrap.find('.js-editor-inner').scrollTop(0);
            setTimeout(function() {
                calculationWrap.find('.js-form-with-calculation').attr('data-click', 'false')
            }, 3000);
            scrollToBeginOfCalculation(calculationWrap)
        }, 1000);
        setTimeout(function() {
            hidePreloader()
        }, 2000)
    }

    function resetForm(form) {
        form.find('input[type="text"]').val('');
        form.find('select').each(function(number, item) {
            $(item).find('option').first().prop('selected', !0)
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
        var notFullFunctionality = calculationForm.get(0).notFullFunctionality,
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
            if (blockType === 'health' && !$.isEmptyObject(articleBlocks[i].additional)) {
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
            itemIsLock = calculationForm.length && calculationForm.get(0).notFullFunctionality && !articleObject.trialAccess,
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
                var resultWithAboveTitle = calculationForm.attr('data-result-type') === 'with-above-title';
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
                                itemIsLock = calculationForm.length && calculationForm.get(0).notFullFunctionality
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
            calculationAccordion = calculationWrap.find('.js-calculation-accordion'),
            calculationForm = calculationWrap.find('.js-form-with-calculation'),
            typeOfForm = detectTypeOfForm(calculationForm);
        calculationAccordion.attr('id', typeOfForm + '-accordion');
        for (var i = 0; i < dataJson.data.length; i++) {
            var accordionItem = createAccordionItem(dataJson.data[i], i, language, sortedForecastArray, currentAge, calculationForm);
            calculationAccordion.append(accordionItem);
            if (dataJson.data[i].blockType === 'forecast') initForecastSlider(calculationWrap)
        }
        initPopovers()
    }

    function loadScript(src) {
        var themePath = $('body').attr('data-theme-path'),
            script = document.createElement('script');
        script.src = themePath + src;
        script.async = !1;
        var el = document.querySelector('.js-wrap-for-sticky');
        if (el.parentNode) {
            el.parentNode.insertBefore(script, el.nextSibling)
        }
    }

    function loadAdditionalScripts() {
        if (!$('body').get(0).editorScriptsInit) {
            $('body').get(0).editorScriptsInit = !0;
            loadScript("/js/editor.header.js");
            loadScript("/js/editor.core.js");
            loadScript("/js/pdfmake.min.js");
            loadScript("/js/vfs_fonts.js")
        }
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
        calculationWrap.find('.js-calculation-header-title').text(title);
        calculationWrap.find('.js-calculation-header-sub-title').text(subTitle)
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
                    console.log('914 text', title, forecastText, forecastSubTitle, fc)
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

    function initEditor(blocks, holder) {
        var editor;
        editor = new EditorJS({
            holder: holder,
            inlineToolbar: !1,
            minHeight: 0,
            tools: {
                header: {
                    class: Header,
                    config: {
                        placeholder: 'Header'
                    }
                },
            },
            data: {
                blocks: blocks
            },
            i18n: {
                messages: {
                    ui: {
                        'blockTunes': {
                            'toggler': {
                                'Click to tune': 'Нажмите, чтобы настроить'
                            },
                        },
                        'toolbar': {
                            'toolbox': {
                                'Add': 'Добавить'
                            }
                        }
                    },
                    toolNames: {
                        'Text': 'Параграф',
                        'Heading': 'Заголовок'
                    },
                    blockTunes: {
                        'delete': {
                            'Delete': 'Удалить'
                        },
                        'moveUp': {
                            'Move up': 'Переместить вверх'
                        },
                        'moveDown': {
                            'Move down': 'Переместить вниз'
                        }
                    },
                }
            },
            onReady: function() {
                $('.js-save-from-editor').on('click', function(e) {
                    e.preventDefault();
                    var calculationWrap = $(this).closest('.js-calculation-wrap'),
                        calculationForm = calculationWrap.find('.js-form-with-calculation'),
                        typeOfDocument = detectTypeOfForm(calculationForm),
                        language = $(this).attr('data-language-string'),
                        dob = $(this).attr('data-dob-string'),
                        dob2, name = '';
                    if (typeOfDocument === 'check-date' || typeOfDocument === 'childrens-matrix') {
                        name = $(this).attr('data-name-string')
                    } else if (typeOfDocument === 'compatibility') {
                        dob2 = $(this).attr('data-dob-2-string')
                    }
                    showPreloader();
                    setTimeout(function() {
                        editor.save().then(function(outputData) {
                            var headerTitles = getHeaderTitlesForCalculation(typeOfDocument, language, name, dob, dob2),
                                pdfName = headerTitles.subTitle + '.pdf',
                                blocks = outputData.blocks;
                            blocks = addHeaderTitlesToConvertedArray(headerTitles, blocks);
                            createTextPdf(blocks, pdfName);
                            setTimeout(function() {
                                hidePreloader()
                            }, 1000)
                        }).catch(function(error) {
                            console.log('Saving failed: ', error)
                        })
                    }, 100)
                })
            }
        })
    }

    function fillInTheDiagram(combinations, sectionWithDiagram) {
        var personalCalculationItems = sectionWithDiagram.find('.js-personal-calculation-item');
        personalCalculationItems.each(function() {
            var personalCalculationPosition = $(this).attr('data-personal-calculation-position');
            $(this).text(combinations[personalCalculationPosition])
        })
    }

    function clearActiveArticleInTheSectionWithDiagram(sectionWithDiagram) {
        sectionWithDiagram.find('.js-personal-calculation-item').removeClass('-active')
    }

    function addActiveArticleInTheSectionWithDiagram(sectionWithDiagram) {
        sectionWithDiagram.find('.js-personal-calculation-item').addClass('-active')
    }

    function clearActiveRowInTable(sectionWithDiagram) {
        sectionWithDiagram.find('.js-health-table tbody tr').removeClass('-active')
    }

    function activeArticleInTheSectionWithDiagram(sectionWithDiagram, calculationWrap) {
        var calculationAccordion = calculationWrap.find('.js-calculation-accordion');
        calculationAccordion.on('shown.bs.collapse', function(e) {
            clearActiveArticleInTheSectionWithDiagram(sectionWithDiagram);
            clearActiveRowInTable(sectionWithDiagram);
            var activeAccordionItem = $(e.target).closest('.js-accordion-item'),
                activeAccordionItemName = activeAccordionItem.find('.accordion__btn').text(),
                activeAccordionItemType = activeAccordionItem.attr('data-block-type'),
                positionsOfActiveAccordion = activeAccordionItem.attr('data-personal-calculation-positions').replace(/\s/g, "").split(',');
            if (activeAccordionItem.hasClass('-lock') || positionsOfActiveAccordion[0] === 'null') {
                addActiveArticleInTheSectionWithDiagram(sectionWithDiagram);
                return
            }
            for (var i = 0; i < positionsOfActiveAccordion.length; i++) {
                var position = positionsOfActiveAccordion[i],
                    targetItem = sectionWithDiagram.find('.js-personal-calculation-item[data-personal-calculation-position="' + position + '"]'),
                    targetItemInTable = targetItem.closest('.js-health-table').length ? !0 : !1;
                targetItem.addClass('-active');
                if (targetItemInTable && (activeAccordionItemType === 'health' || activeAccordionItemName === 'Программы' || activeAccordionItemName === 'Programs')) {
                    targetItem.closest('tr').addClass('-active')
                }
            }
        });
        calculationAccordion.on('hide.bs.collapse', function(e) {
            addActiveArticleInTheSectionWithDiagram(sectionWithDiagram);
            clearActiveRowInTable(sectionWithDiagram)
        })
    }

    function cloneDiagramSection(calculationWrap) {
        var diagram = calculationWrap.find('.js-section-with-diagram'),
            cloneWrapTarget = calculationWrap.find('.js-print-diagram-wrap');
        cloneWrapTarget.find('.js-section-with-diagram').remove();
        diagram.clone().removeClass('.js-personal-calculation-item').appendTo(cloneWrapTarget)
    }
    $.validator.addMethod("checkDate", function(value, element) {
        return value.match(/^(0?[0-9]|[12][0-9]|3[0-1])[/., -](0?[0-9]|1[0-2])[/., -](\d{4})$/)
    }, "Пожалуйста введите корректную дату.");
    $('.js-check-date-form').validate({
        rules: {
            dob: {
                checkDate: !0
            }
        },
        submitHandler: function(form) {
            var form = $(form),
                typeOfForm = detectTypeOfForm(form),
                calculationWrap = form.closest('.js-calculation-wrap'),
                sectionWithDiagram = calculationWrap.find('.js-section-with-diagram'),
                saveButton = calculationWrap.find('.js-save-info-in-pdf'),
                saveFromEditorButton = calculationWrap.find('.js-save-from-editor'),
                saveDiagramButton = calculationWrap.find('.js-save-diagram-in-pdf'),
                formName = form.find('#name').val(),
                formDob = form.find('#dob').val(),
                age = getAgeFromBirthdate(formDob),
                appeal = form.find('#appeal').val(),
                gender = form.find('#gender').val(),
                product_id = +form.find("#product_id").val(),
                pid = form.find("#pid").val(),
                language = form.find('#language').val(),
                edw_var = '';
            if ($('.js-check-date-form').hasClass('js-not-full-functionality')) {
                edw_var = "&edw=1"
            }
            var queryString = formDob + "?gender=" + gender + "&language=" + language + "&appeal=" + (appeal || 'p') + edw_var;
            saveButton.attr('data-query-string', queryString);
            saveButton.attr('data-name-string', formName);
            saveButton.attr('data-dob-string', formDob);
            saveButton.attr('data-language-string', language);
            saveFromEditorButton.attr('data-name-string', formName);
            saveFromEditorButton.attr('data-dob-string', formDob);
            saveFromEditorButton.attr('data-language-string', language);
            saveDiagramButton.attr('data-name-string', formName);
            saveDiagramButton.attr('data-dob-string', formDob);
            saveDiagramButton.attr('data-language-string', language);
            showPreloader();
            $.ajax({
                url: API_CHECKDATE + queryString,
                method: "GET",
                success: function(response) {
                    resetForm(form);
                    if (product_id) {
                        fetch("/wp-json/c/v1/deactivate/" + product_id)
                    }
                    
                    calculationWrap.find('.js-calculation-begin').addClass('d-none');
                    calculationWrap.find('.js-calculation-block').removeClass('d-none');
                    setTimeout(function() {
                        calculationWrap.find('.js-form-with-calculation').attr('data-click', 'false')
                    }, 3000);
                    var headerTitles = getHeaderTitlesForCalculation(typeOfForm, language, formName, formDob, 0);
                    setHeaderTitleForCalculation(calculationWrap, headerTitles.title, headerTitles.subTitle);
                    createInfoFromServer(response, calculationWrap, language, age);
                    setTimeout(function() {
                        var blocks = convertDataForEditorAndSave(response, age, language);
                        initEditor(blocks, 'js-calculation-editor')
                    }, 1000)
                    addActiveArticleInTheSectionWithDiagram(sectionWithDiagram);
                    clearActiveRowInTable(sectionWithDiagram);
                    fillInTheDiagram(response.combinations, sectionWithDiagram);
                    activeArticleInTheSectionWithDiagram(sectionWithDiagram, calculationWrap);
                    cloneDiagramSection(calculationWrap);
                    setTimeout(function() {
                        scrollToBeginOfCalculation(calculationWrap);
                        hidePreloader()
                    }, 1000)
                },
                error: function() {
                    console.log('some error occurred')
                },
            })
        }
    });
    $('.js-childrens-matrix-form').validate({
        rules: {
            "child-dob": {
                checkDate: !0
            }
        },
        submitHandler: function(form) {
            var form = $(form),
                typeOfForm = detectTypeOfForm(form),
                calculationWrap = form.closest('.js-calculation-wrap'),
                sectionWithDiagram = calculationWrap.find('.js-section-with-diagram'),
                saveButton = calculationWrap.find('.js-save-info-in-pdf'),
                saveFromEditorButton = calculationWrap.find('.js-save-from-editor'),
                saveDiagramButton = calculationWrap.find('.js-save-diagram-in-pdf'),
                formName = form.find('#child-name').val(),
                formDob = form.find('#child-dob').val(),
                age = getAgeFromBirthdate(formDob),
                product_id = +form.find("#product_id").val(),
                gender = form.find('#child-gender').val(),
                language = form.find('#language').val(),
                edw_var = '';
            if ($('.js-check-date-form').hasClass('js-not-full-functionality')) {
                edw_var = "&edw=1"
            }
            var queryString = formDob + "?gender=" + gender + "&language=" + language + edw_var;
            saveButton.attr('data-query-string', queryString);
            saveButton.attr('data-name-string', formName);
            saveButton.attr('data-dob-string', formDob);
            saveButton.attr('data-language-string', language);
            saveFromEditorButton.attr('data-name-string', formName);
            saveFromEditorButton.attr('data-dob-string', formDob);
            saveFromEditorButton.attr('data-language-string', language);
            saveDiagramButton.attr('data-name-string', formName);
            saveDiagramButton.attr('data-dob-string', formDob);
            saveDiagramButton.attr('data-language-string', language);
            showPreloader();
            $.ajax({
                url: API_CHILDREN + queryString,
                method: "GET",
                success: function(response) {
                    resetForm(form);
                    if (product_id) {
                        fetch("/wp-json/c/v1/deactivate/" + product_id)
                    }
                    calculationWrap.find('.js-calculation-begin').addClass('d-none');
                    calculationWrap.find('.js-calculation-block').removeClass('d-none');
                    setTimeout(function() {
                        calculationWrap.find('.js-form-with-calculation').attr('data-click', 'false')
                    }, 3000);
                    var headerTitles = getHeaderTitlesForCalculation(typeOfForm, language, formName, formDob, 0);
                    setHeaderTitleForCalculation(calculationWrap, headerTitles.title, headerTitles.subTitle);
                    createInfoFromServer(response, calculationWrap, language, age);
                    setTimeout(function() {
                        var blocks = convertDataForEditorAndSave(response, age, language);
                        initEditor(blocks, 'js-childrens-matrix-editor')
                    }, 1000)
                    addActiveArticleInTheSectionWithDiagram(sectionWithDiagram);
                    clearActiveRowInTable(sectionWithDiagram);
                    fillInTheDiagram(response.combinations, sectionWithDiagram);
                    activeArticleInTheSectionWithDiagram(sectionWithDiagram, calculationWrap);
                    cloneDiagramSection(calculationWrap);
                    setTimeout(function() {
                        scrollToBeginOfCalculation(calculationWrap);
                        hidePreloader()
                    }, 1000)
                },
                error: function() {
                    console.log("some error occurred")
                },
            })
        }
    });
    $('.js-compatibility-form').validate({
        rules: {
            "dob-compatibility-1": {
                checkDate: !0
            },
            "dob-compatibility-2": {
                checkDate: !0
            }
        },
        submitHandler: function(form) {
            var form = $(form),
                typeOfForm = detectTypeOfForm(form),
                calculationWrap = form.closest('.js-calculation-wrap'),
                sectionWithDiagram = calculationWrap.find('.js-section-with-diagram'),
                saveButton = calculationWrap.find('.js-save-info-in-pdf'),
                saveFromEditorButton = calculationWrap.find('.js-save-from-editor'),
                saveDiagramButton = calculationWrap.find('.js-save-diagram-in-pdf'),
                formDobOne = form.find('#dob-compatibility-1').val(),
                product_id = +form.find("#product_id").val(),
                formDobTwo = form.find('#dob-compatibility-2').val(),
                language = form.find('#language-compatibility').val(),
                edw_var = '';
            if ($('.js-check-date-form').hasClass('js-not-full-functionality')) {
                edw_var = "&edw=1"
            }
            var queryString = "date1=" + formDobOne + "&date2=" + formDobTwo + "&language=" + language + edw_var;
            saveButton.attr('data-query-string', queryString);
            saveButton.attr('data-dob-string', formDobOne);
            saveButton.attr('data-dob-2-string', formDobTwo);
            saveButton.attr('data-language-string', language);
            saveFromEditorButton.attr('data-dob-string', formDobOne);
            saveFromEditorButton.attr('data-dob-2-string', formDobTwo);
            saveFromEditorButton.attr('data-language-string', language);
            saveDiagramButton.attr('data-name-string', !1);
            saveDiagramButton.attr('data-dob-string', formDobOne + " + " + formDobTwo);
            saveDiagramButton.attr('data-language-string', language);
            showPreloader();
            $.ajax({
                url: API_COMPATIBILITY + queryString,
                method: "GET",
                success: function(response) {
                    resetForm(form);
                    if (product_id) {
                        fetch("/wp-json/c/v1/deactivate/" + product_id)
                    }
                    
                    calculationWrap.find('.js-calculation-begin').addClass('d-none');
                    calculationWrap.find('.js-calculation-block').removeClass('d-none');
                    calculationWrap.find('.js-calculation-block').find('.js-dob-and-dob-2').text(formDobOne + " + " + formDobTwo);
                    setTimeout(function() {
                        calculationWrap.find('.js-form-with-calculation').attr('data-click', 'false')
                    }, 3000);
                    var headerTitles = getHeaderTitlesForCalculation(typeOfForm, language, '', formDobOne, formDobTwo);
                    setHeaderTitleForCalculation(calculationWrap, headerTitles.title, headerTitles.subTitle);
                    createInfoFromServer(response, calculationWrap, language, 0);
                    setTimeout(function() {
                        var blocks = convertDataForEditorAndSave(response, 0, language);
                        initEditor(blocks, 'js-compatibility-editor')
                    }, 1000)
                    addActiveArticleInTheSectionWithDiagram(sectionWithDiagram);
                    clearActiveRowInTable(sectionWithDiagram);
                    fillInTheDiagram(response.combinations, sectionWithDiagram);
                    activeArticleInTheSectionWithDiagram(sectionWithDiagram, calculationWrap);
                    cloneDiagramSection(calculationWrap);
                    setTimeout(function() {
                        scrollToBeginOfCalculation(calculationWrap);
                        hidePreloader()
                    }, 1000)
                },
                error: function() {
                    console.log('some error occurred')
                },
            })
        }
    });
    $('.js-start-from-the-beginning').on('click', function(e) {
        e.preventDefault();
        var calculationWrap = $(this).closest('.js-calculation-wrap');
        beginCalculationFromTheBeginning(calculationWrap)
    });
    $('.js-show-editor').on('click', function(e) {
        e.preventDefault();
        var calculationWrap = $(this).closest('.js-calculation-wrap');
        showEditBlock(calculationWrap)
    });

    function addHeaderTitlesToConvertedArray(headerTitle, blocks) {
        var convertedArrayWithTitles = blocks,
            convertedTitle = headerTitle.title,
            convertedSubTitle = headerTitle.subTitle;
        convertedArrayWithTitles.unshift({
            type: 'paragraph',
            data: {
                text: ''
            }
        });
        convertedArrayWithTitles.unshift({
            type: 'paragraph',
            data: {
                text: ''
            }
        });
        convertedArrayWithTitles.unshift({
            type: 'paragraph',
            data: {
                text: ''
            }
        });
        convertedArrayWithTitles.unshift({
            type: 'header',
            data: {
                text: convertedSubTitle,
                level: 6
            }
        });
        convertedArrayWithTitles.unshift({
            type: 'header',
            data: {
                text: convertedTitle,
                level: 3
            }
        });
        return convertedArrayWithTitles
    }

    function createTextPdf(data, pdfName) {
        console.log('Data ->', data)
        var docInfo = {
                info: {
                    title: 'Matrix destiny',
                    author: 'https://matritsa-sudbi.ru',
                    subject: 'Calculation',
                    keywords: 'Matrix destiny'
                }
            },
            styles = {
                header_1: {
                    fontSize: 46,
                    bold: !0,
                    margin: [0, 0, 0, 30]
                },
                header_2: {
                    fontSize: 36,
                    bold: !0,
                    margin: [0, 0, 0, 30]
                },
                header_3: {
                    fontSize: 32,
                    bold: !0,
                    margin: [0, 0, 0, 20]
                },
                header_4: {
                    fontSize: 28,
                    bold: !0,
                    margin: [0, 0, 0, 20]
                },
                header_5: {
                    fontSize: 24,
                    bold: !0,
                    margin: [0, 0, 0, 20]
                },
                header_6: {
                    fontSize: 17,
                    bold: !0,
                    margin: [0, 0, 0, 10]
                },
                paragraph: {
                    fontSize: 14,
                    bold: !1,
                    margin: [0, 0, 0, 15]
                },
            },
            content = [];
        for (var i = 0; i < data.length; i++) {
            var style = data[i].type === 'header' ? 'header_' + data[i].data.level : data[i].type,
                textItem = {
                    text: data[i].data.text,
                    style: style
                };
            content.push(textItem)
        }
        var futureArticle = {
            pageSize: 'A4',
            info: docInfo,
            content: content,
            styles: styles
        };
        const pdf = pdfMake.createPdf(futureArticle);
        const pdf_2 = pdfMake.createPdf(futureArticle);
        let promiseObject = pdf_2.getBase64((base64Data) => {});
        promiseObject.then(function(result) {
            $.ajax({
                type: 'POST',
                url: '/upload.php',
                dataType: 'html',
                data: {
                    text: result,
                    name: pdfName,
                    user: jQuery(".info_js_thank").attr('data-user'),
                    userid: jQuery(".js-form-with-calculation").attr('data-user-id'),
                    click: jQuery(".js-form-with-calculation").attr('data-click'),
                    type: jQuery(".js-form-with-calculation").attr('data-type'),
                },
                success: function(data) {
                    pdf.download(pdfName)
                }
            })
        })
    }

    function createDiagramPdf(language, dob, name, diagramImage) {
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
        var diagramPdf = {
            pageSize: 'A4',
            pageMargins: [20, 20],
            pageOrientation: 'landscape',
            content: []
        };
        diagramPdf.info = docInfo;
        diagramPdf.content = content;
        diagramPdf.styles = styles;
        pdfMake.createPdf(diagramPdf).download('' + title.toLowerCase() + '.pdf')
    }
    $('.js-save-info-in-pdf').on('click', function(e) {
        e.preventDefault();
        var calculationWrap = $(this).closest('.js-calculation-wrap'),
            calculationForm = calculationWrap.find('.js-form-with-calculation'),
            typeOfDocument = detectTypeOfForm(calculationForm),
            apiUrl = '',
            queryString = $(this).attr('data-query-string'),
            language = $(this).attr('data-language-string'),
            dob = $(this).attr('data-dob-string'),
            age = getAgeFromBirthdate(dob),
            name, currentAge, dob2;
        showPreloader();
        if (typeOfDocument === 'check-date') {
            apiUrl = API_CHECKDATE;
            name = $(this).attr('data-name-string');
            currentAge = getAgeFromBirthdate(dob)
        } else if (typeOfDocument === 'compatibility') {
            apiUrl = API_COMPATIBILITY;
            dob2 = $(this).attr('data-dob-2-string')
        } else if (typeOfDocument === 'childrens-matrix') {
            apiUrl = API_CHILDREN;
            name = $(this).attr('data-name-string');
            currentAge = getAgeFromBirthdate(dob)
        }
        $.ajax({
            url: apiUrl + queryString,
            method: 'GET',
            success: function(response) {
                var headerTitles = getHeaderTitlesForCalculation(typeOfDocument, language, name, dob, dob2)
                var pdfName = headerTitles.subTitle + '.pdf'
                var blocks = convertDataForEditorAndSave(response, age, language);
                blocks = addHeaderTitlesToConvertedArray(headerTitles, blocks);
                createTextPdf(blocks, pdfName);
                setTimeout(function() {
                    hidePreloader()
                }, 1000)
            },
            error: function() {
                console.log("some error occurred")
            },
        })
    });
    $('.js-form-with-calculation input[type="submit"]').on('click', function(e) {
        setTimeout(function() {
            $('.auto_download .js-save-info-in-pdf').click()
        }, 3000)
    });
    $('.js-save-diagram-in-pdf').on('click', function(e) {
        e.preventDefault();
        var calculationWrap = $(this).closest('.js-calculation-wrap'),
            language = $(this).attr('data-language-string'),
            dob = $(this).attr('data-dob-string'),
            name = $(this).attr('data-name-string'),
            printDiagramHtml = calculationWrap.find('.js-print-diagram-wrap .js-section-with-diagram');
        showPreloader();
        domtoimage.toJpeg(printDiagramHtml.get(0), {
            bgcolor: "#ffffff"
        }).then(function(dataUrl) {
            createDiagramPdf(language, dob, name, dataUrl);
            setTimeout(function() {
                hidePreloader()
            }, 1000)
        }).catch(function(error) {
            console.error('oops, something went wrong!', error)
        })
    })
    
}



$(document).ready(function() {
    initCalculation();
});
