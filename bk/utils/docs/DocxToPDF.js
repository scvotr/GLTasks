'use strict'

const libre = require('libreoffice-convert');
const logger = require('../logger/logger');

const convertDocxToPdf = async (docxContent, templateFullPath) => {
  return new Promise((resolve, reject) => {
    libre.convert(docxContent, '.pdf', undefined, (err, done) => {
      if (err) {
        logger.error(`convertDocxToPdf -> libre.convert: ${err.message}`)
        reject(new Error(`convertDocxToPdf -> libre.convert: ${err.message}`));
      } else {
        logger.info(`convertDocxToPdf -> libre.convert: done`);
        resolve(done);
      }
    });
  });
};

module.exports = {
  convertDocxToPdf,
};


// ! Подключение шрифтов и писанина в PDF 
// const pathToFonts = path.join(currentDirectory, 'fonts/Time/TIMES.TTF')
// const convertDocxToPdf = async (docxContent, templateFullPath) => {
//   try {
//     // Преобразуйте ArrayBuffer в Buffer
//     const docxBuffer = Buffer.from(docxContent);
//       // Извлечение содержимого с форматированием
//     const rezult = await mammoth.extractRawText({ buffer: docxBuffer });
//     const plainText = rezult.value

//     // Использование Mammoth для конвертации .docx в HTML
//     const { value } = await mammoth.extractRawText({ path: templateFullPath, encoding: 'utf8' });
//     const htmlContent = value;
//     // console.log('htmlContent', value)

//     // !-----------------------------------

//     // ?-----------------------------------
//     const extend = '.pdf'
//     const pathTo = path.join(currentDirectory, 'test_output222.pdf')
//     libre.convert(docxBuffer, extend, undefined, (err, done) => {
//       if (err) {
//         console.log(`Error converting file: ${err}`);
//       }
      
//       // Here in done you have pdf file which you can save or transfer in another stream
//       console.log('done', done)
//       fs.writeFile(pathTo, done);
//   });
//     // !-----------------------------------

//     const sanitizedHtmlContent = htmlContent.replace(/♥/g, '\u2665');
//      // Создание нового PDF документа
//     const pdfDoc = await PDFDocument.create();
//     pdfDoc.registerFontkit(fontkit);
//     // Загрузка пользовательского шрифта с помощью fontkit
//     const fontBuffer = await fs.readFile(pathToFonts);
//     // Встраиваем шрифт в PDF документ
//     const openTimesFont = await pdfDoc.embedFont(fontBuffer);
    
//     const page = pdfDoc.addPage([595.276, 841.890]); // Размер страницы A4
//     const { width, height } = page.getSize();
//     const fontSize = 12;

//     // Используйте встраившийся пользовательский шрифт при отрисовке текста
//     page.drawText(plainText, {
//       x: 50,
//       y: height - 4 * fontSize,
//       size: fontSize,
//       font: openTimesFont,
//       color: rgb(0, 0.53, 0.71),
//     });

//     const pdfBytes = await pdfDoc.save();
//     return pdfBytes;
//   } catch (error) {
//     throw new Error(`convertDocxToPdf failed: ${error.message}`);
//   }
// };

// module.exports = {
//   convertDocxToPdf,
//   convertDocxToPd,
// };

