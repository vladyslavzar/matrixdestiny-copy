export const getAgeFromBirthdate = (birthDate, ageAtDate) => {
    let daysInMonth = 30.436875,
        dob = new Date(birthDate.split('.').reverse().join('-')),
        aad;

    if (!ageAtDate) {
        aad = new Date()
    } else {
        aad = new Date(ageAtDate)
    }

    let yearAad = aad.getFullYear(),
        yearDob = dob.getFullYear(),
        years = yearAad - yearDob;

    dob.setFullYear(yearAad);

    let aadMillis = aad.getTime(),
        dobMillis = dob.getTime();

    if (aadMillis < dobMillis) {
        --years;
        dob.setFullYear(yearAad - 1);
        dobMillis = dob.getTime()
    }

    let days = (aadMillis - dobMillis) / 86400000,
        monthsDec = days / daysInMonth,
        months = Math.floor(monthsDec);

    days = Math.floor(daysInMonth * (monthsDec - months));
    
    let finalCalculations = {
        years: years,
        months: months,
        days: days
    };
    return finalCalculations
}