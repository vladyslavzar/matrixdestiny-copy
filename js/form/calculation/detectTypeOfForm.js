export const detectTypeOfForm = (form) => {
    let typeOfForm = "";

    switch (true) {
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