export const detectNotFullFunctionality = () => {
    let formWithCalculation = document.querySelectorAll('.js-form-with-calculation');
    
    if (!formWithCalculation.length) return;

    formWithCalculation.forEach(function(e) {
        if (e.classList.contains('js-not-full-functionality')) {
            e[0].notFullFunctionality = true
        } else {
            e[0].notFullFunctionality = false
        }
    })
}