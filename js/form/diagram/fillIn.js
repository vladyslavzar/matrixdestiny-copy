export const fillInTheDiagram = (combinations, sectionWithDiagram) => {
    let personalCalculationItems = sectionWithDiagram.querySelectorAll('.js-personal-calculation-item');
    
    personalCalculationItems.forEach(function(e) {
        let personalCalculationPosition = e.getAttribute('data-personal-calculation-position');
        e.innerText=combinations[personalCalculationPosition]
    })
}