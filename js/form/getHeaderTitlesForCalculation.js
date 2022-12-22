export const getHeaderTitlesForCalculation = (typeOfForm, language, name, dob, dob2) => {
    let headerTitles = {
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