'use strict'

const fs = require('fs').promises;
const path = require('path');
const JSZip = require('jszip');

/**
 * Модифицирует файл шаблона .docx с указанными изменениями и сохраняет результат в выходной файл.
 * @param {string} inputFilePath - Путь к входному файлу .docx.
 * @param {string} outputFilePath - Путь, по которому будет сохранен измененный файл .docx.
 * @param {Array} modifications - Массив объектов, содержащих пары ключ-значение для модификаций.
 * @returns {Promise<void>} - Промис, который разрешается, когда файл успешно модифицирован и сохранен.
*/

const ModifyDocxTemplate = async (inputFilePath, outputFilePath, modifications) => {
  const currentDirectory = process.cwd(); // Получаем текущую директорию
  const midle_path = './src/docs/Templates/'
  const templateFullPath = path.join(currentDirectory, midle_path + inputFilePath)
  const modifyFullPath = path.join(currentDirectory, midle_path + outputFilePath)

  try {
    const data = await fs.readFile(templateFullPath); // Чтение файла с использованием fs.promises
    const zip = await JSZip.loadAsync(data);
    
    // Выполнение операций с содержимым .docx файла
    let documentContent = await zip.file('word/document.xml').async('string')

    for(const key in modifications) {
      const placeholder = new RegExp(`<w:t>${modifications[key].key}<\\/w:t>`, 'g')
      const newData =  modifications[key].value
      // Замена подстроки    documentContent = documentContent.replace(/<w:t>USERNAME<\/w:t>/g, '<w:t>Работает</w:t>');
      documentContent = documentContent.replace(placeholder, `<w:t>${newData}</w:t>`)
    }
      
    // Обновление содержимого файла в объекте zip
    zip.file('word/document.xml', documentContent);
    
    // Сохранение измененного файла
    const content = await zip.generateAsync({ type: 'nodebuffer' });
    const contentArBf = await zip.generateAsync({ type: 'arraybuffer' });
    await fs.writeFile(modifyFullPath, content);
    return {content, contentArBf}; //? Возвращаем содержимое файла
    // return content; //? Возвращаем содержимое файла
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

module.exports = {
  ModifyDocxTemplate
};