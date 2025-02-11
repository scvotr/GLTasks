const fs = require('fs')
const path = require('path')

const readFileAsync = (file_path, encoding) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file_path, encoding, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const getLabsPreviewFiles = async (req_id, folderName, files) => {
  const currentDirectory = process.cwd()
  const filesPreviews = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const { type, name } = file
    let file_path
    let file_content

    file_path = `${currentDirectory}/uploads/${folderName}/${req_id}/thumbnail_${name}`

    try {
      file_content = await readFileAsync(file_path, 'base64')
    } catch (error) {
      file_path = `${currentDirectory}/uploads/default/404.jpg`
      file_content = await readFileAsync(file_path, 'base64')
    }

    filesPreviews.push({
      type: type,
      name: name,
      content: file_content,
    })
  }
  return filesPreviews
}

const getFullFile = async (file, folderName) => {
  const currentDirectory = process.cwd()
  const { type, name } = file.file
  const { req_id } = file

  const fullFile = {}
  let file_path
  let file_content

  if (type !== '.jpg' && type !== '.png') {
    file_path = `${currentDirectory}/uploads/${folderName}/${req_id}/${name}`
    file_content = await readFileAsync(file_path, 'base64')
  } else {
    file_path = `${currentDirectory}/uploads/${folderName}/${req_id}/compres_${name}`
    file_content = await readFileAsync(file_path, 'base64')
  }

  fullFile.type = type
  fullFile.name = name
  fullFile.content = file_content

  return fullFile
}

module.exports = { getLabsPreviewFiles, getFullFile }
