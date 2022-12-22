export const initForecastSlider = (calculationWrap) => {
    let initialSlide = 3,
        forecastYearsSlider = calculationWrap.querySelector('.js-slider-forecast-years'),
        forecastTextSlider = calculationWrap.querySelector('.js-slider-forecast-text');
        
    if (!forecastYearsSlider) return;

    if (forecastYearsSlider) {
        const sliderItem = forecastTextSlider.querySelectorAll('div');
        const track = document.querySelector('.slider-forecast-years-inner');

        const showSlide = (n) => {
            sliderItem.forEach(item => {
                item.style.display="none";
            })
            sliderItem[n].style.display="block";
        }

        showSlide(2)

        forecastYearsSlider.querySelectorAll('p').forEach((item, i) => {
            item.style.width="200px";
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const btn = e.target;
                initialSlide = i;
                track.style.transform = `translateX(${((2-initialSlide)*200)-55}px)`
                forecastYearsSlider.querySelectorAll('p').forEach(item => {
                    item.classList.remove('-active');
                })

                btn.classList.add('-active');

                showSlide(initialSlide);
            })
        })
    }
}