const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs').promises; 
const path = require('path');

const currentDirectory = process.cwd();
const pathToFonts = path.join(currentDirectory, 'fonts/Time/TIMES.TTF')

const AddWatermark = async (pdfBytes, watermarkText) => {
  try {
    // Загружаем PDF-документ
    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit);
    // Встраиваем шрифт в документ
    const fontBuffer = await fs.readFile(path.resolve(pathToFonts)); //const fontBuffer = await fs.readFile(pathToFonts);
    const openTimesFont = await pdfDoc.embedFont(fontBuffer);
    // Получаем страницы документа
    const pages = pdfDoc.getPages();
    // Проходим по всем страницам и добавляем водяной знак
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const textWidth = openTimesFont.widthOfTextAtSize(watermarkText, 50);
      const x = (width - textWidth) / 2;
      const y = height / 2;
      page.drawText(watermarkText, { x, y, font: openTimesFont, size: 50, color: rgb(0.7, 0.7, 0.7) })
    })
    const pdfBytesW = await pdfDoc.save();
    return pdfBytesW;
  } catch (error) {
    // Обрабатываем ошибки и выбрасываем исключение
    throw new Error(`AddWatermark failed: ${error.message}`);   
  }
};

module.exports = {
  AddWatermark,
};

  // const watermarkedPdfBytes = await pdfDoc.save();
  // return { originalPdfBytes: pdfBytes, watermarkedPdfBytes };