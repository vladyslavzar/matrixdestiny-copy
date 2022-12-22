export const createDiagramPdf = (dataJson, language, dob, name, diagramImage) => {
    pdfMake.fonts = {
        Roboto: {
            normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
            bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        },
    }
    let title = '';

    name = (name === 'false') ? '' : name;

    if (language === 'ru') {
        title = 'Диаграмма'
    } else if (language === 'en') {
        title = 'Diagram'
    }

    let docInfo = {
        info: {
            title: title,
            author: 'https://matritsa-sudbi.ru',
            subject: title,
            keywords: 'Матрица судьбы, Расчёт матрицы'
        }
    }

    let styles = {
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

    let content = [];

    let topTitleObj = {
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
    
    for (let i = 0; i < dataJson.data.length; i++) {
        if (dataJson.data[i].blocks === null) {continue; }
        dataJson.data[i].blocks.forEach(item => {
            let elemParagraphTitleObj = {
                text: item.title,
                style: "elemTitle",
                margin: [0, 20, 0, 0] 
            }
            let elemParagraphObj = {
                text: item.content,
                style: "elemParagraph",
                margin: [0, 20, 0, 0] 
            }
            content.push(elemParagraphTitleObj);
            content.push(elemParagraphObj);
        })
    }
    
    let diagramPdf = {
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