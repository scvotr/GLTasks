'use strict'

const fs = require('fs') //.promises;
const path = require('path');

// ДОБАВИТЬ PNG

const deleteFile = async (fileName, folder = null, folderPath = defaultPath) => {
  try {
    const file_ext = path.extname(fileName);
    const fullFilePath = path.join(folder, folderPath);
    const filePath = path.join(fullFilePath, fileName);
    const thumbnailFilePath = path.join(fullFilePath, `thumbnail_${fileName}`);
    const compresFilePath = path.join(fullFilePath, `compres_${fileName}`);

    const unlinkFile = (filePath) => {
      return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    };

    if (file_ext === '.pdf') {
      await unlinkFile(filePath);
    } else {
      await Promise.all([
        unlinkFile(filePath),
        unlinkFile(thumbnailFilePath),
        unlinkFile(compresFilePath),
      ]);
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

module.exports = {
  deleteFile,
}


// const deleteFile = async (fileName, folder = null, folderPath = defaultPath) => {
//   console.log(fileName, folder, folderPath);

//   try {
//     const fileExtension = path.extname(fileName);
//     const fullFilePath = path.join(folder, folderPath);
//     const filePath = path.join(fullFilePath, fileName);
//     const thumbnailFilePath = path.join(fullFilePath, `thumbnail_${fileName}`);
//     const compressedFilePath = path.join(fullFilePath, `compressed_${fileName}`);

//     const unlinkFile = (filePath) => {
//       return new Promise((resolve, reject) => {
//         if (!fs.existsSync(filePath)) {
//           return resolve(); // Файл не существует, ничего не делаем
//         }

//         fs.unlink(filePath, (err) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve();
//           }
//         });
//       });
//     };

//     if (fileExtension === '.pdf') {
//       await unlinkFile(filePath);
//     } else {
//       await Promise.all([
//         unlinkFile(filePath),
//         unlinkFile(thumbnailFilePath),
//         unlinkFile(compressedFilePath),
//       ]);
//     }

//     return true; // Успешное удаление
//   } catch (error) {
//     console.error(error);
//     return false; // Ошибка при удалении
//   }
// };