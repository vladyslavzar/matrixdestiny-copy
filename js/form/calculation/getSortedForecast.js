export const getSortedForecast = (data) => {
    let forecastArray = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i].blockType === "forecast") {
            let allForecastBlocks = data[i];

            for (let j = 0; j < allForecastBlocks.blocks.length; j++) {
                let title = allForecastBlocks.blocks[j].title,
                    firstYearValue = (title.indexOf("-") !== -1) ? +title.split("-")[0] : +title,
                    text = allForecastBlocks.blocks[j].content;

                let skipParent = false;

                for (let k = 0; k < forecastArray.length; k++) {
                    if (forecastArray[k].title === title) {
                        skipParent = true
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